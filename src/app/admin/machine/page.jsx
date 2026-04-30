"use client";
import Sidebar from "@/components/sidebar";
import Button from "@/components/ui/Button";
import { UserContext } from "@/store/context/UserContext";
import GetLinkItems from "@/utils/SidebarItems";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import {
  Box,
  Center,
  Divider,
  Heading,
  HStack,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { theme } from "@/data/data";
import moment from "moment";

export default function Page() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state: UserState } = useContext(UserContext);
  const { colorMode } = useColorMode();
  const t = useTranslations("Dictionary");
  const colorTxt1 = useColorModeValue("#475467", "gray.300");
  const bdColor = useColorModeValue(theme.divider.primary, "gray.700") 


  async function fetchData(id) {
    axios
      .get(`/api/newroutes/healthcare/${id}/log`)
      .then((response) => {
        setLogs(response.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const RenderEachRow = ({ind, item}) => {
    return (
        <Tr
        key={ind}
        backgroundColor={
          ind % 2 === 0
            ? colorMode === "light"
              ? "#F9FAFB"
              : "gray.700"
            : colorMode === "light"
            ? "white"
            : "transparent"
        }
      >
        <Td
          fontSize={"14px"}
          fontWeight={"400"}
          color={colorTxt1}
        >
          {item.test_code}
        </Td>
        <Td
          fontSize={"14px"}
          fontWeight={"400"}
          color={colorTxt1}
        >
          {item.value}
        </Td>
        <Td
          fontSize={"14px"}
          fontWeight={"400"}
          color={colorTxt1}
        >
          {item.reference_range}
        </Td>
        <Td
          fontSize={"14px"}
          fontWeight={"400"}
          color={colorTxt1}
        >
          {item.units}
        </Td>
      </Tr>
    )
  }

  const sideLinks = GetLinkItems("admin");
  return (
    <Sidebar LinkItems={sideLinks} settingsLink={"/admin/settings"}>
      <Box p={4} w={"100%"}>
        <HStack align={"flex-start"} spacing={10} mb={4}>
          <Heading size="lg">{t("machineReports")}</Heading>
          {UserState.value.data?.centerid && (
            <Button
              isLoading={loading}
              colorScheme="teal"
              onClick={() => {
                setLogs([])
                setLoading(true);
                fetchData(UserState.value.data.centerid);
              }}
            >
              {t("getData")}
            </Button>
          )}
        </HStack>
        {logs.length === 0 ? (
          <Center>
            <Text fontSize="md" color="gray.500">
              {t("noDataFound")}
            </Text>
          </Center>
        ) : (
            
          <Accordion allowMultiple gap={5} display={'flex'} flexDir={'column'}>
            {logs.sort((a, b) => moment(b.logDate).isBefore(moment(a.logDate)) ? -1 : 1).map((log, index) => (
              <AccordionItem
                key={index}
                border="1px solid"
                borderColor={bdColor}
                borderRadius="md"
                boxShadow="md"
              >
                <AccordionButton p={4}>
                  <Box flex="1" textAlign="left">
                    <Heading size="sm">
                      {t("patientName")}: {log.Patient.name || "N/A"}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      <strong>{t("date")}:</strong> {log.logDate || "N/A"}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Heading size="sm" mb={2}>
                    {t("testResults")}
                  </Heading>
                  <Divider my={2} />
                  <Table variant="simple" w={"100%"}>
                    <Thead>
                      <Tr>
                        {[
                          t("investigation"),
                          t("result"),
                          t("reference"),
                          t("unit"),
                        ].map((item, index1) => (
                          <Th
                            key={index1}
                            fontSize={"12px"}
                            fontWeight={"500"}
                            color="#667085"
                          >
                            {item}
                          </Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {log.Results.map((item, ind) => (
                       <RenderEachRow key={ind} ind={ind} item={item}/>
                      ))}
                    </Tbody>
                  </Table>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </Box>
    </Sidebar>
  );
}

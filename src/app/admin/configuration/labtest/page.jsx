"use client";
import Button from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import {  theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Box,
  Flex,
  HStack,
  Input,
  Select,
  Spacer,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";
import { showToastFailed } from "@/utils/toastUtils";

export default function Settings() {
  const {colorMode} = useColorMode()
  const t = useTranslations("Dictionary");
  const toastIdRef = useRef(null);
  const toast = useToast();
  const { state: UserState } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const sideLinks = GetLinkItems("admin");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [entry, setEntry] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const bgColor = useColorModeValue("white", "gray.800")
  const colorTxt1 = useColorModeValue("#475467", 'gray.300')
  const bdColor = useColorModeValue(theme.divider.primary, "gray.700")
 

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
  
    axios
      .get(`/api/newroutes/healthcare/${id}/admin/settings`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  const RenderEachRow = ({ item, index, column }) => {
    const [rowLoading, setRowLoading] = useState(false);
    async function handleDeleteRow(item) {
      const temp = data[column].filter((itm) => itm !== item);
      await axios
        .post("/api/update", {
          table: "settings",
          columns: [column],
          values: [temp],
          conditions: {
            column: "id",
            operator: "=",
            value: data.id,
          },
        })
        .then((response) => {
          fetchData(UserState.value.data.centerid);
          setRowLoading(false);
        })
        .catch((e) => {
          setRowLoading(false);
          showToastFailed(
            toast,
            toastIdRef,
            t("Failed"),
            e?.response?.data?.message
          );
        });
    }

    return (
      <Tr key={index} backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {index + 1}
        </Td>

       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item}
        </Td>

        <Td>
          {rowLoading ? (
            <Spinner size={"sm"} />
          ) : (
            <DeleteIcon
              onClick={() => {
                setRowLoading(true);
                handleDeleteRow(item);
              }}
              boxSize={4}
              color={"red"}
              _hover={{ opacity: 0.7 }}
            />
          )}
        </Td>
      </Tr>
    );
  };

  async function handleSave(val, itm) {
    let temp = [];
    if (val === "category") {
      if (data.labtestcategories) {
        temp = [...data.labtestcategories];
      }
      temp.push(itm);
    } else if (val === "tube") {
      if (data.labtesttube) {
        temp = [...data.labtesttube];
      }
      temp.push(itm);
    } else {
      if (data.labtestunit) {
        temp = [...data.labtestunit];
      }
      temp.push(itm);
    }
    axios
      .post("/api/update", {
        table: "settings",
        columns:
          val == "category"
            ? ["labtestcategories"]
            : val == "tube"
            ? ["labtesttube"]
            : ["labtestunit"],
        values: [temp],
        conditions: {
          column: "id",
          operator: "=",
          value: data.id,
        },
      })
      .then((response) => {
        onClose();
        fetchData(UserState.value.data.centerid);
      })
      .catch((e) => {
        setLoading(false);
        showToastFailed(
          toast,
          toastIdRef,
          t("Failed"),
          e?.response?.data?.message
        );
      });
  }

  return (
    <Sidebar LinkItems={sideLinks} settingsLink={"/admin/settings"}>
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <HStack justifyContent={"space-between"}>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("labTest")}</Text>
        </HStack>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <Text
            fontSize={"16px"}
            fontWeight={"400"}
            color={theme.text.secondary}
            textAlign={"center"}
          >
            {t("settingsSubheading")}
          </Text>
        </div>
        <HStack w={"100%"}>
          <Spacer />
          <Button
            onClick={() => {
              setEntry("");
              onOpen();
            }}
          >
            {t("add")}
          </Button>
        </HStack>

        <VStack align={"flex-start"} width={"100%"}>
          <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"16px"}>
            {t("category")}
          </Text>
          <Box
            width={"100%"}
            border={"1px solid"}
            borderColor={bdColor}
            borderRadius={"8px"}
            maxW={"800px"}
          >
            <TableContainer maxH={"800px"} overflowY={"auto"}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {[t("Sr"), t("name")].map((item, index) => (
                      <Th
                        key={index}
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
                  {data?.labtestcategories?.map((item, index) => (
                    <RenderEachRow
                      key={index}
                      item={item}
                      index={index}
                      column={"labtestcategories"}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
           
          </Box>
        </VStack>

        <VStack align={"flex-start"} width={"100%"}>
          <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"16px"}>
            {t("tube")}
          </Text>
          <Box
            width={"100%"}
            border={"1px solid"}
            borderColor={bdColor}
            borderRadius={"8px"}
            maxW={"800px"}
          >
            <TableContainer maxH={"800px"} overflowY={"auto"}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {[t("Sr"), t("name")].map((item, index) => (
                      <Th
                        key={index}
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
                  {data?.labtesttube?.map((item, index) => (
                    <RenderEachRow
                      key={index}
                      item={item}
                      index={index}
                      column={"labtesttube"}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
        
          </Box>
        </VStack>

        <VStack align={"flex-start"} width={"100%"}>
          <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"16px"}>
            {t("unit")}
          </Text>
          <Box
            width={"100%"}
            border={"1px solid"}
            borderColor={bdColor}
            borderRadius={"8px"}
            maxW={"800px"}
          >
            <TableContainer maxH={"800px"} overflowY={"auto"}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {[t("Sr"), t("name")].map((item, index) => (
                      <Th
                        key={index}
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
                  {data?.labtestunit?.map((item, index) => (
                    <RenderEachRow
                      key={index}
                      item={item}
                      index={index}
                      column={"labtestunit"}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            
          </Box>
        </VStack>
      </Flex>

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent maxW={"90%"} width={"600px"}>
          <AlertDialogBody mb={5}>
            <HStack align={"flex-start"} w={"100%"} gap={10} mt={5}>
              <VStack width={"100%"} gap={5}>
                <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"}fontSize={"18px"} fontWeight={"500"} >
                  {t("addNewEntry")}
                </Text>
                <VStack align={"flex-start"} w={"inherit"} gap={0}>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("type")}</Text>
                  <Select
                   bg={bgColor}
                   borderColor={bdColor}
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    <option value="">{t("selectOne")}</option>
                    <option value="tube">{t("tube")}</option>
                    <option value="unit">{t("unit")}</option>
                    <option value="category">{t("category")}</option>
                  </Select>
                </VStack>

                <VStack align={"flex-start"} w={"inherit"} gap={0}>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("name")}</Text>
                  <Input
                   bg={bgColor}
                   borderColor={bdColor}
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                  />
                </VStack>
              </VStack>
            </HStack>
          </AlertDialogBody>

          <AlertDialogFooter w={"100%"}>
            <Button
              isDisabled={!selectedOption || !entry}
              isLoading={loading}
              w={"100%"}
              onClick={() => {
                setLoading(true);

                handleSave(selectedOption, entry);
              }}
            >
              {t("save")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  
    </Sidebar>
  );
}

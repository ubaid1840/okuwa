"use client";
import Button from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { AppointmentContext } from "@/store/context/AppointmentContext";
import { PatientContext } from "@/store/context/PatientContext";
import { AddIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  useToast,
  VStack,
  Icon,
  InputGroup,
  InputLeftElement,
  Input,
  Menu,
  MenuButton,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useRef, useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoFilterSharp } from "react-icons/io5";
import { LuBadgeCheck } from "react-icons/lu";
import moment from "moment";
import { RxPencil1 } from "react-icons/rx";
import { SlOptionsVertical } from "react-icons/sl";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Dictionary")
  const { state: AppointmentState, setAppointment } =
    useContext(AppointmentContext);
  const pathname = usePathname();
  const [data, setData] = useState([
    {
      patientName: "Olivia",
      id: "PC0001",
      appointmentDate: "20/07/2024",
      insuranceProvider: "ABC Healthcare",
      coverageVerification: "verified",
      benefits: {
        deductible: 1000,
        coverage: "90%",
      },
      billing: {
        invoice: "#56789",
        status: "Unpaid",
      },
      invoicing: "Pending",
    },
  ]);

  const {colorMode} = useColorMode()
  const colorTxt1 = useColorModeValue("#475467", 'gray.300')
  const colorTxt2 = useColorModeValue("#101828", "gray.300")
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

  const RenderEachRow = ({ item, index }) => {
    return (
      <Tr
        backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}

      >
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.patient}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            {"PT0001"}
          </div>
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.appointmentDate}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.insuranceProvider}
        </Td>

        <Td>
          <div
            style={{
              display: "flex",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor: "#ECFDF3",
              alignItems: "center",
              paddingInline: "10px",
              color: "#027A48",
              borderRadius: "50px",
              width: "fit-content",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#12B76A",
                borderRadius: "3px",
                marginRight: "5px",
              }}
            />
            <div>{item.coverageVerification}</div>
          </div>
        </Td>
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.benefits.deductible}  {t("deductible")}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            {item?.benefits?.coverage}  {t("coverage")}
          </div>
        </Td>
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          <div> {t("invoice")}</div>
          <div>{item.billing.invoice}</div>

          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            {item.billing.status}
          </div>
        </Td>

        <Td>
          <div
            style={{
              display: "flex",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor: "#F2F4F7",
              alignItems: "center",
              paddingInline: "10px",
              color: "#667085",
              borderRadius: "50px",
              width: "fit-content",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#667085",
                borderRadius: "3px",
                marginRight: "5px",
              }}
            />
            <div>{"Pending"}</div>
          </div>
        </Td>

        <Td zIndex={2}>
          <Menu>
            <MenuButton
              zIndex={2}
              variant={"ghost"}
              as={IconButton}
              icon={<SlOptionsVertical />}
            />
            <MenuList>
              <MenuItem> {t("verifyInsuranceCoverage")}</MenuItem>
              <MenuItem> {t("processBilling")}</MenuItem>
              <MenuItem> {t("sendInvoice")}</MenuItem>
            </MenuList>
          </Menu>
        </Td>
      </Tr>
    );
  };
  const financeLinks = GetLinkItems('finance');
  return (
    <Sidebar LinkItems={financeLinks}>
      <Flex flex={1} gap={"50px"} p={"32px"} flexDir="column" overflowX={'auto'}>
        <Text color={colorMode === 'dark' && 'gray.300'}variant="heading"> {t("insuranceAndBilling")}</Text>
        {data.length == 0 ? (
          <VStack spacing={5}>
            <Image
              width={"315px"}
              height={"210px"}
              src="/assets/Calendar-pana-1.png"
            />
            <Text color={colorMode === 'dark' && 'gray.300'}fontWeight={"600"} fontSize={"30px"}>
            {t("noBillingRecord")}
             
            </Text>
            <div style={{ width: "70%" }}>
              <Text
                fontSize={"16px"}
                fontWeight={"400"}
                color={theme.text.secondary}
                textAlign={"center"}
              >
                 {t("noBillingRecordSubheading")}
               
              </Text>
            </div>
            <Link href={`${pathname}/addbilling`} style={{ minWidth: "350px" }}>
              <Button leftIcon={<AddIcon marginTop={"-2px"} />}>
              {t("newBilling")}
              </Button>
            </Link>
          </VStack>
        ) : (
          <Box
            width={"100%"}
            border={"1px solid"}
            borderColor={bdColor}
            borderRadius={5}
          >
            <HStack justify={"space-between"} width={"100%"} p={5}>
              <div style={{ display: "flex" }}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={CiSearch} boxSize={5} color="#667085" />
                  </InputLeftElement>
                 <Input  placeholder={t("search")} />
                </InputGroup>
                <Menu>
                  <MenuButton
                    border={"0px solid"}
                    borderColor={bdColor}
                    borderRightWidth={0}
                    borderTopLeftRadius={"8px"}
                    borderBottomLeftRadius={"8px"}
                    paddingInline={"1rem"}
                  >
                    <Box
                      display="flex"
                      height="40px"
                      border={"1px solid"}
                      borderRadius={"5px"}
                      borderColor={bdColor}
                      px={"10px"}
                      alignItems={"center"}
                    >
                      <Icon as={IoFilterSharp} boxSize={4} color="#344054" />
                      <Text color={colorMode === 'dark' && 'gray.300'}ml={2} variant="subheading">
                      {t("filter")}
                      </Text>
                    </Box>
                  </MenuButton>
                </Menu>
              </div>
              <div>
                <Link href={`${pathname}/addinsuranceandbilling`}>
                  <Button leftIcon={<AddIcon marginTop={"-2px"} />}>
                  {t("newBilling")}
                  </Button>
                </Link>
              </div>
            </HStack>
            <Box width={"100%"}>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      {[
                        t('patient'),
                        t('date'),
                        t('insuranceProvider'),
                        t('coverageVerification'),
                        t('benefits'),
                        t('billing'),
                        t('invoicing'),
                      ].map((item, index) => (
                        <Th
                          key={index}
                          fontSize={"12px"}
                          fontWeight={"500"}
                          color="#667085"
                        >
                          {item}
                        </Th>
                      ))}
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.length > 0 &&
                      data.map((item, index) => (
                        <RenderEachRow key={index} item={item} index={index} />
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <HStack justifyContent={"space-between"} p={5}>
                <div>
                  <Button
                    variant="outline"
                    backgroundColor={"#FFFFFF"}
                    color={"black"}
                    border={"1px solid"}
                    borderColor={bdColor}
                  >
                     {t("previous")}
                  </Button>
                </div>
                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading"> {t("page")} 1  {t("of")} 1</Text>
                </div>
                <div>
                  <Button
                    variant="outline"
                    backgroundColor={"#FFFFFF"}
                    color={"black"}
                    border={"1px solid"}
                    borderColor={bdColor}
                  >
                     {t("next")}
                  </Button>
                </div>
              </HStack>
            </Box>
          </Box>
        )}
      </Flex>
    </Sidebar>
  );
}

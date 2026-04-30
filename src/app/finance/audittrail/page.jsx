"use client";
import Button from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import {  DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
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
  useOutsideClick,
  useColorMode,
  useColorModeValue,

} from "@chakra-ui/react";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { IoFilterSharp } from "react-icons/io5";
import { useTranslations } from "next-intl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useRef, useState } from "react";

export default function Page() {
  const t = useTranslations("Dictionary")

  const ref = useRef();
  const datePickerRef = useRef(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const {colorMode} = useColorMode()
  const colorTxt1 = useColorModeValue("#101828", "gray.300")
  const colorTxt2 = useColorModeValue("#475467", 'gray.300')
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

  const [openCalendar, setOpenCalendar] = useState(false);
  useOutsideClick({
    ref: ref,
    handler: () => setOpenCalendar(false),
  });
  const data = [
    {
      "date": "2024-07-15",
      "time": "09:30:00",
      "action": "Generated Monthly Report - July 2024",
      "userRole": "Finance Manager",
      "user": "Alice Johnson",
      "details": "Monthly financial report for July 2024 has been generated and sent for review."
    },
    {
      "date": "2024-07-14",
      "time": "14:45:00",
      "action": "Updated Invoice #12345",
      "userRole": "Finance Assistant",
      "user": "Bob Smith",
      "details": "Invoice #12345 was updated with the corrected payment amount."
    },
    {
      "date": "2024-07-13",
      "time": "11:00:00",
      "action": "Approved Annual Budget - 2025",
      "userRole": "Finance Director",
      "user": "Carol Davis",
      "details": "Annual budget for the fiscal year 2025 has been approved and submitted for final approval."
    },
    {
      "date": "2024-07-12",
      "time": "16:20:00",
      "action": "Revised Quarterly Report - Q2 2024",
      "userRole": "Finance Analyst",
      "user": "David Lee",
      "details": "Quarterly financial report for Q2 2024 was revised and sent to the review team."
    },
    {
      "date": "2024-07-11",
      "time": "10:15:00",
      "action": "Created New Expense Report",
      "userRole": "Finance Assistant",
      "user": "Emma Clark",
      "details": "A new expense report was created for the business trip expenses incurred in June 2024."
    }
  ]
  

  const RenderEachRow = ({ item, index }) => {
    return (
       <Tr backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}>
         <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt1}>
          {item?.date}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            {item?.time}
          </div>
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt2}>
          {item?.action}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt2}>
          {item?.userRole}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt2}>
          {item?.user}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt2}>
          {item?.details}
        </Td>

      
      </Tr>
    );
  };
  const financeLinks = GetLinkItems('finance');
  return (
    <Sidebar LinkItems={financeLinks}>
      <Flex
        flex={1}
        gap={"50px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("auditTrail")}</Text>
        {data.length == 0 ? (
          <VStack spacing={5}>
            <Image
              width={"315px"}
              height={"210px"}
              src="/assets/Calendar-pana-1.png"
            />
            <Text color={colorMode === 'dark' && 'gray.300'}fontWeight={"600"} fontSize={"30px"}>
            {t("noAuditTrail")}
            </Text>
            <div style={{ width: "70%" }}>
              <Text
                fontSize={"16px"}
                fontWeight={"400"}
                color={theme.text.secondary}
                textAlign={"center"}
              >
                {/* Start processing billing information and co-payments */}
              </Text>
            </div>
            {/* <Link href={`${pathname}/addbilling`} style={{ minWidth: "350px" }}>
              <Button leftIcon={<AddIcon marginTop={"-2px"} />}>
                New Billing
              </Button>
            </Link> */}
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
              <HStack>
                <div ref={ref} style={{ display: "flex", gap: "10px" }}>
                  {openCalendar && (
                    <div style={{ position: "absolute", zIndex: 2 }}>
                      <DatePicker
                        ref={datePickerRef}
                        selected={startDate}
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                      />
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      if (!openCalendar) setOpenCalendar(true);
                    }}
                    leftIcon={<Icon as={CiCalendar} boxSize={4} />}
                    variant="outline"
                    backgroundColor={"#FFFFFF"}
                    color={"black"}
                    border={"1px solid"}
                    borderColor={bdColor}
                  >
                    {startDate
                      ? `${moment(new Date(startDate)).format(
                          "DD/MM/YYYY"
                        )} - ${
                          endDate &&
                          moment(new Date(endDate)).format("DD/MM/YYYY")
                        }`
                      : t("selectDates")}
                  </Button>

                  <div>
                <Button
                  leftIcon={<DownloadIcon marginTop={"-2px"} />}
                //   onClick={onOpen}
                >
                  {t("downloadReport")}
                </Button>
              </div>
                </div>
              </HStack>
             
            </HStack>
            <Box width={"100%"}>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      {[
                        t('timeStamp'),
                        t('action'),
                        t('userRole'),
                        t('user'),
                        t('details'),
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
                  <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">Page 1 of 1</Text>
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

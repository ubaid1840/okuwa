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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useOutsideClick,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useRef, useState, useEffect } from "react";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { IoFilterSharp } from "react-icons/io5";
import { LuBadgeCheck } from "react-icons/lu";
import moment from "moment";
import { RxPencil1 } from "react-icons/rx";
import { SlOptionsVertical } from "react-icons/sl";
import { FiDownload, FiUpload } from "react-icons/fi";
import Dropzone from "@/components/DropZone";
import { useTranslations } from "next-intl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Page() {
  const t = useTranslations("Dictionary");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const pathname = usePathname();
  const data = [
    {
      reportName: "Monthly Report - April 2021",
      generatedDate: "2021-04-30",
      generatedBy: "Finance Team",
      status: "In Review",
    },
    {
      reportName: "Annual Report - 2021",
      generatedDate: "2021-12-31",
      generatedBy: "Finance Team",
      status: "Downloadable",
    },
    {
      reportName: "Quarterly Report - Q1 2022",
      generatedDate: "2022-03-31",
      generatedBy: "Finance Team",
      status: "In Review",
    },
    {
      reportName: "Monthly Report - January 2022",
      generatedDate: "2022-01-31",
      generatedBy: "Finance Team",
      status: "Downloadable",
    },
    {
      reportName: "Annual Report - 2022",
      generatedDate: "2022-12-31",
      generatedBy: "Finance Team",
      status: "In Review",
    },
  ];

  const toastIdRef = useRef(null);
  const toast = useToast();
  const id = "test-toast";

  const params = useSearchParams();

  const ref = useRef();
  const datePickerRef = useRef(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const [openCalendar, setOpenCalendar] = useState(false);
  useOutsideClick({
    ref: ref,
    handler: () => setOpenCalendar(false),
  });

  const { colorMode } = useColorMode();
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.700");
  const colorTxt1 = useColorModeValue("#475467", "gray.300");

  function addToast() {
    if (!toastIdRef.current || !toast.isActive(toastIdRef.current)) {
      toastIdRef.current = toast({
        render: () => (
          <Box
            width={"400px"}
            padding={"10px"}
            bg={"#ECFDF3"}
            borderRadius={"8px"}
          >
            <HStack alignItems={"flex-start"} spacing={5}>
              <div
                style={{
                  backgroundColor: "#D1FADF",
                  display: "flex",
                  borderRadius: "100px",
                  padding: "5px",
                }}
              >
                <Icon as={LuBadgeCheck} color={"#039855"} boxSize={6} />
              </div>
              <VStack alignItems={"flex-start"}>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant="subheading"
                >
                  {t("reportSuccessfullyAdded")}
                </Text>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant="description"
                  fontSize="14px"
                >
                  {" "}
                  {t("reportSuccessfullyAddedSubheading")}
                </Text>
              </VStack>
              <CloseIcon
                _hover={{ cursor: "pointer" }}
                height={"10px"}
                width={"10px"}
                color={"#667085"}
                onClick={() => closeToast()}
              />
            </HStack>
          </Box>
        ),
        position: "top-right",
        duration: 3000,
      });
    }
  }

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
      toastIdRef.current = null;
    }
  }

  const RenderEachRow = ({ item, index }) => {
    return (
      <Tr
        backgroundColor={
          index % 2 == 0
            ? colorMode == "light"
              ? "#F9FAFB"
              : "gray.700"
            : colorMode == "light"
            ? "white"
            : "transparent"
        }
      >
        <Td fontSize={"14px"} fontWeight={"400"} color={"#101828"}>
          {item?.reportName}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.generatedDate}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.generatedBy}
        </Td>

        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          <div
            style={{
              display: "flex",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor:
                item.status == "Downloadable" ? "#ECFDF3" : "#FEF3F2",
              alignItems: "center",
              paddingInline: "10px",
              color: item.status == "Downloadable" ? "#027A48" : "#B42318",
              borderRadius: "50px",
              width: "fit-content",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                backgroundColor:
                  item.status == "Downloadable" ? "#12B76A" : "#F04438",
                borderRadius: "3px",
                marginRight: "5px",
              }}
            />
            <div>{item.status}</div>
          </div>
        </Td>
        <Td>
          <Icon
            as={FiDownload}
            boxSize={6}
            _hover={{ cursor: "pointer", opacity: 0.7 }}
          />
        </Td>
      </Tr>
    );
  };
  const financeLinks = GetLinkItems("finance");
  return (
    <Sidebar LinkItems={financeLinks}>
      <Flex
        flex={1}
        gap={"50px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <Text color={colorMode === "dark" && "gray.300"} variant="heading">
          {" "}
          {t("financialStatement")}
        </Text>
        {data.length == 0 ? (
          <VStack spacing={5}>
            <Image
              width={"315px"}
              height={"210px"}
              src="/assets/Calendar-pana-1.png"
            />
            <Text
              color={colorMode === "dark" && "gray.300"}
              fontWeight={"600"}
              fontSize={"30px"}
            >
              {t("noFinancialStatement")}
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
                  <Input placeholder={t("search")} />
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
                      <Text
                        color={colorMode === "dark" && "gray.300"}
                        ml={2}
                        variant="subheading"
                      >
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
                    <Button onClick={onOpen}>{t("newReport")}</Button>
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
                        t("reportName"),
                        t("generationDate"),
                        t("generatedBy"),
                        t("status"),
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
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant="subheading"
                  >
                    {" "}
                    {t("page")} 1 {t("of")} 1
                  </Text>
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
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        size={"sm"}
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent width={"400px"}>
          <AlertDialogHeader>
            <div
              style={{
                display: "flex",
                borderRadius: "30px",
                backgroundColor: "#b2d8d8",
                border: "6px solid",
                borderColor: "#EFF4FF",
                height: "40px",
                width: "40px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon as={FiUpload} boxSize={4} color={"#155EEF"} />
            </div>
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <VStack alignItems={"flex-start"} spacing={2}>
              <Text
                color={colorMode === "dark" ? "gray.300" : "#101828"}
                fontSize={"18px"}
                fontWeight={"500"}
              >
                {t("uploadNewReport")}
              </Text>
              <VStack alignItems={"flex-start"} spacing={0} width={"100%"}>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"description"}
                  fontSize={"14px"}
                >
                  {t("reportName")}
                </Text>
                <Input placeholder={t("reportNameInput")} />
              </VStack>
              <VStack spacing={0} width={"100%"}>
                <Text
                  alignSelf={"flex-start"}
                  variant={"description"}
                  fontSize={"14px"}
                >
                  {t("uploadReport")}
                </Text>
                <Dropzone
                  borderColor={true}
                  colorMode={colorMode}
                  onDrop={(file) => {}}
                  title={t("clickToUpload")}
                  subheading={t("dragAndDrop")}
                  description={t("descriptionDropzone")}
                  drag={t("drag")}
                />
              </VStack>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              onClick={onClose}
              border="1px solid"
              borderColor={bdColor}
              backgroundColor="#FFFFFF"
              color="#000000"
            >
              {t("reject")}
            </Button>
            <Button ml={3} onClick={() => addToast()}>
              {" "}
              {t("upload")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}

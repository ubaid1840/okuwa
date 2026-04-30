"use client";
import Button, { DangerButton, GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import {
  AddIcon,
  ArrowBackIcon,
  CloseIcon,
  DeleteIcon,
  DownloadIcon,
} from "@chakra-ui/icons";

import {
  Image,
  Box,
  Flex,
  HStack,
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
  Avatar,
  Divider,
  IconButton,
  UnorderedList,
  ListItem,
  Tabs,
  TabList,
  TabIndicator,
  TabPanels,
  TabPanel,
  Tab,
  Textarea,
  Select,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { CiCalendar, CiSearch } from "react-icons/ci";
import {
  IoCall,
  IoCallOutline,
  IoFilterSharp,
  IoMicOutline,
} from "react-icons/io5";
import { PiCalendarHeartLight, PiIntersect } from "react-icons/pi";
import {
  HiMiniArrowUturnRight,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { Status } from "@/components/ui/StatusBox";
import { TbCalendarHeart } from "react-icons/tb";
import { useContext, useEffect, useRef, useState } from "react";
import { LuBadgeCheck, LuCalendarMinus } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { data, medicalRecordData } from "./data";
import {
  IoIosSend,
  IoMdAddCircleOutline,
  IoMdArrowBack,
  IoMdCheckboxOutline,
} from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import PrescriptionCard from "@/components/ui/prescriptionCard";
import { BsStars } from "react-icons/bs";
import {
  FiArrowDownRight,
  FiArrowUp,
  FiArrowUpRight,
  FiPlusCircle,
} from "react-icons/fi";
import Checkbox from "@/components/ui/Checkbox";
import { useTranslations } from "next-intl";
import { MedicalLibraryCard } from "@/components/ui/MedicalLibraryCard";
import { imagingData } from "./data";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";
import moment from "moment";
import StatusBox from "@/components/ui/StatusBox";

export default function Page() {
  const t = useTranslations("Dictionary");
  const pathname = usePathname();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const toastIdRef = useRef(null);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [imagingSearch, setImagingSearch] = useState("");

  const { state: UserState } = useContext(UserContext);
  const [allLabTest, setAllLabTest] = useState([]);
  const [allImagingStudies, setAllImagingStudies] = useState([]);
  const [selectedReport, setSelectedReport] = useState()
  const {colorMode} = useColorMode()
  const colorTxt1 = useColorModeValue("#475467", 'gray.300')
  const colorTxt2 = useColorModeValue("#101828", "gray.300")
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

  useEffect(() => {
    if (UserState.value.data.id) {
      fetchData(UserState.value.data.id, UserState.value.data.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id, centerid) {
    axios.post("/api/doctor/labrequest/getall", { id: id }).then((response) => {
   
      if (response.data.length > 0) {
        const filterLab = response.data.filter(
          (item) => item.requesttype === "labTest"
        );
        setAllLabTest([...filterLab]);

        const filterImaging = response.data.filter(
          (item) => item.requesttype !== "labTest"
        );
        setAllImagingStudies([...filterImaging]);
      }
    });
  }

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
                <Text color={colorMode === 'dark' ? 'gray.300' : "black"}variant="subheading" >
                  {t("requestSuccessfullySent")}
                </Text>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="description" fontSize="14px">
                  {t("requestSuccessfullySentSubheading")}
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

  function addToastImagingSent() {
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
                <Text color={colorMode === 'dark' ? 'gray.300' : "black"}variant="subheading" >
                  {t("imagingStudiesSuccessfullySent")}
                </Text>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="description" fontSize="14px">
                  {t("imagingStudiesSuccessfullySentSubheading")}
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

  useEffect(() => {
    const search = new URLSearchParams(window.location.search).get(
      "requestadded"
    );
    if (search === "true" && !toast.isActive(toastIdRef.current)) {
      addToast();
    }
  }, []);

  const doctorLinks = GetLinkItems("doctor");

  const RenderEachRow = ({ item, index }) => {
    return (
       <Tr backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}>
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.testtype}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            LT{item?.id}
          </div>
        </Td>

        <Td>
          <div
            style={{
              display: "flex",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor:
                item.priority == "high"
                  ? "#FEF3F2"
                  : item.priority == "medium"
                  ? "#FFFAEB"
                  : "#EFF8FF",
              alignItems: "center",
              paddingInline: "10px",
              color:
                item.priority == "high"
                  ? "#B42318"
                  : item.priority == "medium"
                  ? "#B54708"
                  : "#175CD3",
              borderRadius: "50px",
              width: "fit-content",
            }}
          >
            <Icon
              mr={1}
              as={
                item.priority == "high"
                  ? FiArrowUp
                  : item.priority == "medium"
                  ? FiArrowUpRight
                  : FiArrowDownRight
              }
            />
            <div>{item?.priority ? t(item?.priority) : ""}</div>
          </div>
        </Td>

       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.expected
            ? moment(new Date(Number(item?.expected))).format("DD/MM/YYYY")
            : ""}
        </Td>
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.patient_firstname || "" + " " + item?.patient_lastname || ""}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            PT{item.patient_id}
          </div>
        </Td>

        <Td>
        <StatusBox item={item?.status}/>
        </Td>
        {item.status === "completed" ? (
          <Td
            fontSize="14px"
            fontWeight="500"
            color={theme.color.link}
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedReport(item)
              setIsDetailOpen(true)
            }}
          >
            {t("viewDetails")}
          </Td>
        ) : (
          <Td></Td>
        )}
      </Tr>
    );
  };

  const RenderEachRowImagingData = ({ item, index }) => {
    return (
       <Tr backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}>
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.testtype}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            LT{item?.id}
          </div>
        </Td>

        <Td>
          <div
            style={{
              display: "flex",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor:
                item.priority == "high"
                  ? "#FEF3F2"
                  : item.priority == "medium"
                  ? "#FFFAEB"
                  : "#EFF8FF",
              alignItems: "center",
              paddingInline: "10px",
              color:
                item.priority == "high"
                  ? "#B42318"
                  : item.priority == "medium"
                  ? "#B54708"
                  : "#175CD3",
              borderRadius: "50px",
              width: "fit-content",
            }}
          >
            <Icon
              mr={1}
              as={
                item.priority == "high"
                  ? FiArrowUp
                  : item.priority == "medium"
                  ? FiArrowUpRight
                  : FiArrowDownRight
              }
            />
            <div>{item?.priority ? t(item?.priority) : ""}</div>
          </div>
        </Td>

       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.expected
            ? moment(new Date(Number(item?.expected))).format("DD/MM/YYYY")
            : ""}
        </Td>
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.patient_firstname || "" + " " + item?.patient_lastname || ""}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            PT{item.patient_id}
          </div>
        </Td>

        <Td>
        <StatusBox item={item?.status}/>
        </Td>
        {item.status === "completed" ? (
          <Td
            fontSize="14px"
            fontWeight="500"
            color={theme.color.link}
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedReport(item)
              setIsDetailOpen(true)
            }}
          >
            {t("viewDetails")}
          </Td>
        ) : (
          <Td></Td>
        )}
      </Tr>
    );
  };

  return (
    <Sidebar LinkItems={doctorLinks}  >
      <Flex
        flex={1}
        gap={"20px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <Text color={colorMode === 'dark' && 'gray.300'}variant="heading"> {t("labRequests")}</Text>

        <Tabs overflowY={"auto"}>
          <TabList
            borderBottomWidth={"1px"}
            borderBottomColor={theme.divider.primary}
          >
            {[t("labTest"), t("imagingStudies")].map((item, index) => (
              <Tab
                key={index}
                fontWeight={"500"}
                fontSize={"14px"}
                _selected={{ color: theme.color.primary }}
              >
                {item}
              </Tab>
            ))}
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg={theme.color.primary}
            borderRadius="1px"
            width={"100px"}
          />
          <TabPanels mt={5}>
            <TabPanel>
              {allLabTest.length == 0 ? (
                <VStack spacing={5}>
                  <Image
                    width={"315px"}
                    height={"210px"}
                    src="/assets/Calendar-pana-1.png"
                  />
                  <Text color={colorMode === 'dark' && 'gray.300'}fontWeight={"600"} fontSize={"30px"}>
                    {t("noRequestYet")}
                  </Text>
                  <div style={{ width: "70%" }}>
                    <Text
                      fontSize={"16px"}
                      fontWeight={"400"}
                      color={theme.text.secondary}
                      textAlign={"center"}
                    >
                      {t("noRequestYetSubheading")}
                    </Text>
                  </div>
                  <Link
                    href={`${pathname}/addrequest`}
                    style={{ minWidth: "350px" }}
                  >
                    <Button
                      leftIcon={<AddIcon marginTop={"-2px"} />}
                      width={"100%"}
                    >
                      {t("addNewRequest")}
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
                  <HStack width={"100%"} p={5} justify={"space-between"}>
                    <div style={{ display: "flex", width: "50%" }}>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={CiSearch} boxSize={5} color="#667085" />
                        </InputLeftElement>
                       <Input  value={search} onChange={(e)=> setSearch(e.target.value)} placeholder={t("search")} />
                      </InputGroup>
                     
                    </div>
                    <Link href={`${pathname}/addrequest`}>
                      <Button
                        leftIcon={<AddIcon marginTop={"-2px"} />}
                        //   onClick={onOpen}
                      >
                        {t("addNewRequest")}
                      </Button>
                    </Link>
                  </HStack>
                  <Box width={"100%"}>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            {[
                              t("testType"),
                              t("priority"),
                              t("expectedDate"),
                              t("patientName"),
                              t("status"),
                              t("report"),
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
                          </Tr>
                        </Thead>
                        <Tbody>
                          {allLabTest.length > 0 &&
                            allLabTest
                              .filter((eachTest) => {
                                const string = `${
                                  eachTest.patient_firstname || ""
                                } ${eachTest.patient_lastname || ""}`;
                                if (
                                  string
                                    .toLocaleLowerCase()
                                    .includes(search.toLocaleLowerCase())
                                ) {
                                  return eachTest;
                                }
                              })
                              .map((item, index) => (
                                <RenderEachRow
                                  key={index}
                                  item={item}
                                  index={index}
                                />
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
                        <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
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
            </TabPanel>

            <TabPanel>
              {allImagingStudies.length == 0 ? (
                <VStack spacing={5}>
                  <Image
                    width={"315px"}
                    height={"210px"}
                    src="/assets/Calendar-pana-1.png"
                  />
                  <Text color={colorMode === 'dark' && 'gray.300'}fontWeight={"600"} fontSize={"30px"}>
                    {t("noRequestYet")}
                  </Text>
                  <div style={{ width: "70%" }}>
                    <Text
                      fontSize={"16px"}
                      fontWeight={"400"}
                      color={theme.text.secondary}
                      textAlign={"center"}
                    >
                      {t("noRequestYetSubheading")}
                    </Text>
                  </div>
                  <Link
                    href={`${pathname}/addrequest`}
                    style={{ minWidth: "350px" }}
                  >
                    <Button
                      leftIcon={<AddIcon marginTop={"-2px"} />}
                      width={"100%"}
                    >
                      {t("addNewRequest")}
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
                  <HStack width={"100%"} p={5} justify={"space-between"}>
                    <div style={{ display: "flex", width: "50%" }}>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={CiSearch} boxSize={5} color="#667085" />
                        </InputLeftElement>
                       <Input  value={imagingSearch} onChange={(e)=> setImagingSearch(e.target.value)} placeholder={t("search")} />
                      </InputGroup>
                     
                    </div>
                    <Link href={`${pathname}/addrequest`}>
                      <Button
                        leftIcon={<AddIcon marginTop={"-2px"} />}
                        //   onClick={onOpen}
                      >
                        {t("addNewRequest")}
                      </Button>
                    </Link>
                  </HStack>
                  <Box width={"100%"}>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            {[
                              t("testType"),
                              t("priority"),
                              t("expectedDate"),
                              t("patientName"),
                              t("status"),
                              t("report"),
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
                          </Tr>
                        </Thead>
                        <Tbody>
                          {allImagingStudies.length > 0 &&
                            allImagingStudies .filter((eachTest) => {
                              const string = `${
                                eachTest.patient_firstname || ""
                              } ${eachTest.patient_lastname || ""}`;
                              if (
                                string
                                  .toLocaleLowerCase()
                                  .includes(imagingSearch.toLocaleLowerCase())
                              ) {
                                return eachTest;
                              }
                            }).map((item, index) => (
                              <RenderEachRowImagingData
                                key={index}
                                item={item}
                                index={index}
                              />
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
                        <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
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
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>

      {isDetailOpen && (
        <Box
          flex={1}
          width={"100%"}
          bg={"#344054B2"}
          display={"flex"}
          height={"100vh"}
          overflowY={"auto"}
          justifyContent={"flex-end"}
          position={"absolute"}
          right={0}
        >
          <Box
            width={"580px"}
            overflowY={"auto"}
            bg={"white"}
            p={"30px"}
            onClick={() => {}}
          >
            <VStack
              width={"100%"}
              flex={1}
              alignItems={"flex-start"}
              spacing={5}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <CloseIcon
                  onClick={() => {
                    setSelectedReport()
                    setIsDetailOpen(false)}}
                  _hover={{ cursor: "pointer", opacity: 0.7 }}
                />
              </div>
              <HStack width={"100%"} justifyContent={"space-between"}>
                <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"}fontSize={"20px"} fontWeight={"500"} >
                  {t("reportDetails")}
                </Text>
                {/* <div>
                  <Button
                    backgroundColor={"#EFF4FF"}
                    color={"#004EEB"}
                    leftIcon={<DownloadIcon />}
                    fontWeight={"500"}
                  >
                    {t("downloadAsPdf")}
                  </Button>
                </div> */}
              </HStack>

              <HStack width={"100%"} alignItems={"flex-start"} gap={10}>
                <div>
                  <Text
                    maxW={"150px"}
                    minW={"150px"}
                    variant="subheading"
                    fontSize={"14px"}
                  >
                    {t("image")}
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px",
                    backgroundColor: theme.icon.background,
                    borderRadius: "50px",
                  }}
                >
                  {selectedReport?.image ?  <Image
                  borderRadius={'8px'}
                    src={selectedReport?.image}
                    height={"100px"}
                    width={"100px"}
                  />  : null}
                 
                </div>
              </HStack>
              <HStack alignItems={"flex-start"} width={"100%"} gap={10}>
                <div>
                  <Text
                    maxW={"150px"}
                    minW={"150px"}
                    variant="subheading"
                    fontSize={"14px"}
                  >
                    {t("imageAcquisitionDetail")}
                  </Text>
                </div>
                <VStack alignItems={"flex-start"}>
                  <div>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                      {t("modality")}:
                    </Text>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                      {selectedReport?.testtype}
                    </Text>
                  </div>
                  <div>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                      {t("dateAndTime")}:
                    </Text>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {`${moment(new Date(Number(selectedReport?.expected))).format(
                      "DD/MM/YYYY"
                    )} ${moment(new Date(Number(selectedReport?.expected))).format(
                      "hh:mm A"
                    )}`}
                    </Text>
                  </div>
                  {/* <div>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                      {t("bodyPart")}:
                    </Text>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                      Chest
                    </Text>
                  </div> */}

                  <div>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                      {t("requestType")}:
                    </Text>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {t(selectedReport?.requesttype)}
                    </Text>
                  </div>
                </VStack>
              </HStack>
              <HStack width={"100%"} alignItems={"flex-start"} gap={10}>
                <div>
                  <Text
                    maxW={"150px"}
                    minW={"150px"}
                    variant="subheading"
                    fontSize={"14px"}
                  >
                    {t("patientDetails")}
                  </Text>
                </div>
                <div>
                  <VStack alignItems={"flex-start"}>
                    <div>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                        {t("patientID")}:
                      </Text>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                      PT{selectedReport?.patient_id}
                      </Text>
                    </div>

                    <div>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                        {t("patientName")}:
                      </Text>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                      {selectedReport?.patient_firstname || "" + " " + selectedReport?.patient_lastname || ""}
                      </Text>
                    </div>

                    <div>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                        {t("dob")}:
                      </Text>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                      {selectedReport?.patient_dob
                      ? moment(new Date(Number(selectedReport.patient_dob))).format(
                          "DD/MM/YYYY"
                        )
                      : ""}
                      </Text>
                    </div>
                  </VStack>
                </div>
              </HStack>
              <Divider color={theme.divider.primary} />
              <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"18px"}>
                {t("analysis")}
              </Text>
              <HStack alignItems={"flex-start"} width={"100%"} gap={10}>
                <div>
                  <Text
                    variant="subheading"
                    fontSize={"14px"}
                    maxW={"150px"}
                    minW={"150px"}
                  >
                    {t("imageAnalysis")}
                  </Text>
                </div>
                <UnorderedList
                  fontSize={"14px"}
                  fontWeight={"500"}
                  color={"#344054"}
                >
                  <ListItem>
                   {selectedReport?.imageanalysis}
                  </ListItem>
                 
                </UnorderedList>
              </HStack>

              <HStack alignItems={"flex-start"} width={"100%"} gap={10}>
                <div>
                  <Text
                    variant="subheading"
                    fontSize={"14px"}
                    maxW={"150px"}
                    minW={"150px"}
                  >
                    {t("interpretation")}
                  </Text>
                </div>
                <UnorderedList
                  fontSize={"14px"}
                  fontWeight={"500"}
                  color={"#344054"}
                >
                  <ListItem>
                  {selectedReport?.interpretation}
                  </ListItem>
                 
                </UnorderedList>
              </HStack>

              <HStack alignItems={"flex-start"} width={"100%"} gap={10}>
                <div>
                  <Text
                    variant="subheading"
                    fontSize={"14px"}
                    maxW={"150px"}
                    minW={"150px"}
                  >
                    {t("recommendation")}
                  </Text>
                </div>
                <UnorderedList
                  fontSize={"14px"}
                  fontWeight={"500"}
                  color={"#344054"}
                >
                  <ListItem>
                  {selectedReport?.recommendation}
                  </ListItem>
                </UnorderedList>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </Sidebar>
  );
}

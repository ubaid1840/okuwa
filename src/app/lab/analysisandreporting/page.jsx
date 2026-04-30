"use client";
import Button from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { AppointmentContext } from "@/store/context/AppointmentContext";
import { PatientContext } from "@/store/context/PatientContext";
import { AddIcon, CloseIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
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
  UnorderedList,
  ListItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useRef, useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoFilterSharp } from "react-icons/io5";
import { LuBadgeCheck } from "react-icons/lu";
import moment from "moment";
import { RxPencil1 } from "react-icons/rx";
import { SlOptionsVertical } from "react-icons/sl";
import { useTranslations } from "next-intl";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";
import { Status } from "@/components/ui/StatusBox";
import StatusBox from "@/components/ui/StatusBox";
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils";

export default function Page() {
  const t = useTranslations("Dictionary");
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState([]);

  const toastIdRef = useRef(null);
  const toast = useToast();
  const id = "test-toast";
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { state: UserState } = useContext(UserContext);
  const params = useSearchParams();
  const [selectedReport, setSelectedReport] = useState();
  const [search, setSearch] = useState("");
  const {colorMode} = useColorMode()
  const colorTxt1 = useColorModeValue("#475467", 'gray.300')
  const colorTxt2 = useColorModeValue("#101828", "gray.300")
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data?.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    axios
      .post("/api/labrequest/getall", { centerid: id })
      .then((response) => {
      
        if (response.data.length > 0) {
          const filterData = response.data.filter(
            (item) =>
              item?.status == "completed" || item?.status == "needreview"
          ).filter((item)=> item.requesttype === UserState.value.data.speciality && item.labuserid === UserState.value.data.id)
          setData([...filterData]);
        }
      })
      .catch((e) => {
        showToastFailed(toast, toastIdRef, t("Failed"), e?.response?.data?.message || t("Failed"))
      });
  }

  useEffect(() => {
    const search = new URLSearchParams(window.location.search).get(
      "reportadded"
    );
    if (search === "true" && !toast.isActive(toastIdRef.current)) {
      showToastSuccess(
        toast,
        toastIdRef,
        t("reportSuccessfullyCreated"),
        t("reportSuccessfullyCreatedSubheading")
      );
    }
  }, []);

  const RenderEachRow = ({ item, index }) => {
    return (
       <Tr backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}>
        <Td
          onClick={() => {
            if (item?.image) {
              window.open(item.image, "_blank");
            }
          }}
          fontSize={"14px"}
          fontWeight={"400"}
          color={item?.image ? "blue" : "#475467"}
          _hover={item?.image && { cursor: "pointer" }}
        >
          {item?.image ? "Image" : ""}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.testtype}
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
            PT{item?.patient_id}
          </div>
        </Td>
        {/* <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.doctor_firstname || "" + " " + item?.doctor_lastname || ""}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            {item?.doctor_specialization ? t(item.doctor_specialization) : ""}
          </div>
        </Td> */}

        <Td>
          <StatusBox item={item?.status} />
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"blue"}>
          {item.status == "needreview" ? (
            <Link href={`${pathname}/addnewreport?id=${item.id}`}>
              <Text color={colorMode === 'dark' && 'gray.300'}_hover={{ cursor: "pointer" }}>{t("generateReport")}</Text>
            </Link>
          ) : (
            <Text
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedReport(item);
                setIsDetailOpen(true);
              }}
            >
              {t("seeReport")}
            </Text>
          )}
        </Td>
      </Tr>
    );
  };
  const labLinks = GetLinkItems("lab");
  return (
    <Sidebar LinkItems={labLinks}>
      <Flex
        flex={1}
        gap={"50px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("analysisAndReporting")}</Text>

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
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("search")}
                />
              </InputGroup>
            </div>
          </HStack>
          <Box width={"100%"}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {[
                      t("image"),
                      t("type"),
                      t("patientName"),
                      // t("requestedBy"),
                      t("reportStatus"),
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
                    data
                      .filter((eachRow) => {
                        const string = `${eachRow.patient_firstname} ${eachRow.patient_lastname} ${eachRow.doctor_firstname} ${eachRow.doctor_lastname}`;
                        if (
                          string
                            .toLocaleLowerCase()
                            .includes(search.toLocaleLowerCase())
                        ) {
                          return eachRow;
                        }
                      })
                      .map((item, index) => (
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
                    setSelectedReport();
                    setIsDetailOpen(false);
                  }}
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
                  {selectedReport?.image ? (
                    <Image
                      borderRadius={"8px"}
                      src={selectedReport?.image}
                      height={"100px"}
                      width={"100px"}
                    />
                  ) : null}
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
                      {`${moment(
                        new Date(Number(selectedReport?.expected))
                      ).format("DD/MM/YYYY")} ${moment(
                        new Date(Number(selectedReport?.expected))
                      ).format("hh:mm A")}`}
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
                        {selectedReport?.patient_firstname ||
                          "" + " " + selectedReport?.patient_lastname ||
                          ""}
                      </Text>
                    </div>

                    <div>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                        {t("dob")}:
                      </Text>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                        {selectedReport?.patient_dob
                          ? moment(
                              new Date(Number(selectedReport.patient_dob))
                            ).format("DD/MM/YYYY")
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
                  <ListItem>{selectedReport?.imageanalysis}</ListItem>
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
                  <ListItem>{selectedReport?.interpretation}</ListItem>
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
                  <ListItem>{selectedReport?.recommendation}</ListItem>
                </UnorderedList>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </Sidebar>
  );
}

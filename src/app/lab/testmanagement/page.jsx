"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { AppointmentContext } from "@/store/context/AppointmentContext";
import { PatientContext } from "@/store/context/PatientContext";
import { AddIcon, CloseIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
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
import { FiArrowDownRight, FiArrowUp, FiArrowUpRight } from "react-icons/fi";
import { TbInfoHexagon } from "react-icons/tb";
import { useTranslations } from "next-intl";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";
import { Status } from "@/components/ui/StatusBox";
import StatusBox from "@/components/ui/StatusBox";
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils";

export default function Page() {
  const t = useTranslations("Dictionary");
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = usePathname();
  const [data, setData] = useState([]);

  const toastIdRef = useRef(null);
  const toast = useToast();
  const id = "test-toast";
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const cancelRef = useRef();

  const { state: UserState } = useContext(UserContext);
  const params = useSearchParams();
  const [selectedReport, setSelectedReport] = useState();
  const [search, setSearch] = useState("");
  const { colorMode } = useColorMode();
  const colorTxt1 = useColorModeValue("#475467", "gray.300");
  const colorTxt2 = useColorModeValue("#101828", "gray.300");
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.700");

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
          const filterData = response.data
            .filter(
              (item) =>
                item.status !== "needreview" && item.status !== "completed"
            )
            .filter(
              (item) =>
                item.requesttype === UserState.value.data.speciality &&
                item.labuserid === UserState.value.data.id
            );
          setData([...filterData]);
        }
      })
      .catch((e) => {
        showToastFailed(
          toast,
          toastIdRef,
          t("Failed"),
          e?.response?.data?.message || t("Failed")
        );
      });
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
            <div>{t(item.priority)}</div>
          </div>
        </Td>

        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.expected
            ? moment(new Date(Number(item.expected))).format("DD/MM/YYYY")
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
        {item.status === "requested" ? (
          <Td fontSize={"14px"} fontWeight={"400"} color={"blue"}>
            <Text
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedReport(item);
                onOpen();
              }}
            >
              {t("action")}
            </Text>
          </Td>
        ) : item.status === "rejected" ? null : item.status === "requested" ||
          item.status === "scheduled" ? (
          <Td fontSize={"14px"} fontWeight={"400"} color={"gray"}>
            <Link href={`${pathname}/addreport?id=${item.id}`}>
              <Text
                color={colorMode === "dark" && "gray.300"}
                _hover={{ cursor: "pointer" }}
              >
                {t("details")}
              </Text>
            </Link>
          </Td>
        ) : null}
      </Tr>
    );
  };

  async function handleReject() {
    await axios
      .post("/api/update", {
        table: "labrequest",
        columns: ["status"],
        values: ["rejected"],
        conditions: {
          column: "id",
          operator: "=",
          value: selectedReport.id,
        },
      })
      .then((resposne) => {
        fetchData(UserState.value.data.centerid);
        showToastFailed(
          toast,
          toastIdRef,
          t("testRequestSuccessfullyRejected"),
          t("testRequestSuccessfullyRejectedSubheading")
        );
        onClose();
        setSelectedReport();
      });
  }

  async function handleApprove() {
    axios;
    await axios
      .post("/api/update", {
        table: "labrequest",
        columns: ["status"],
        values: ["scheduled"],
        conditions: {
          column: "id",
          operator: "=",
          value: selectedReport.id,
        },
      })
      .then(() => {
        fetchData(UserState.value.data.centerid);
        showToastSuccess(
          toast,
          toastIdRef,
          t("testRequestSuccessfullyApproved"),
          t("testRequestSuccessfullyApprovedSubheading")
        );
        onClose();
        setSelectedReport();
      });
  }
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
        <Text color={colorMode === "dark" && "gray.300"} variant="heading">
          {t("testManagement")}
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
              {t("noRecordFound")}
            </Text>
            {/* <Link href={`${pathname}/addrequest`} style={{ minWidth: "350px" }}>
              <Button leftIcon={<AddIcon marginTop={"-2px"} />} width={"100%"}>
                {t("addNewTest")}
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
              <InputGroup width={"100%"} maxW={"600px"}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={CiSearch} boxSize={5} color="#667085" />
                </InputLeftElement>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("search")}
                />
              </InputGroup>
              {/* <Link href={`${pathname}/addrequest`}>
                <Button
                  leftIcon={<AddIcon marginTop={"-2px"} />}
                  //   onClick={onOpen}
                >
                  {t("addNewTest")}
                </Button>
              </Link> */}
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
                        // t("requestedBy"),
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
                      data
                        .filter((item) => {
                          const string = `${item.patient_firstname || ""} ${
                            item.patient_lastname || ""
                          } ${item.doctor_firstname || ""} ${
                            item.doctor_lastname || ""
                          }`;
                          if (
                            string
                              .toLocaleLowerCase()
                              .includes(search.toLocaleLowerCase())
                          )
                            return item;
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
                  <GhostButton>{t("previous")}</GhostButton>
                </div>
                <div>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant="subheading"
                  >
                    {t("page")} 1 {t("of")} 1
                  </Text>
                </div>
                <div>
                  <GhostButton>{t("next")}</GhostButton>
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
              <Icon as={TbInfoHexagon} color={"#155EEF"} />
            </div>
          </AlertDialogHeader>
          <AlertDialogCloseButton />

          <AlertDialogBody>
            <VStack alignItems={"flex-start"} spacing={3}>
              <Text
                color={colorMode === "dark" ? "gray.300" : "#101828"}
                fontSize={"18px"}
                fontWeight={"500"}
              >
                {t("confirmTestRequestApproval")}
              </Text>
              <Text
                color={colorMode === "dark" ? "gray.300" : "#667085"}
                fontSize={"14px"}
                fontWeight={"400"}
              >
                {t("confirmTestRequestApprovalSubheading")}
              </Text>
              <HStack width={"80%"} justifyContent={"space-between"}>
                <VStack gap={0} align={"flex-start"}>
                  <Text
                    color={colorMode === "dark" ? "gray.300" : "#667085"}
                    fontSize={"14px"}
                    fontWeight={"400"}
                  >
                    {t("testType")}
                  </Text>
                  <Text
                    color={colorMode === "dark" ? "gray.300" : "#344054"}
                    fontSize={"14px"}
                    fontWeight={"400"}
                  >
                    {selectedReport?.testtype}
                  </Text>
                </VStack>
                <VStack gap={0} align={"flex-start"}>
                  <Text
                    color={colorMode === "dark" ? "gray.300" : "#667085"}
                    fontSize={"14px"}
                    fontWeight={"400"}
                  >
                    {t("expectedDate")}
                  </Text>
                  <Text
                    color={colorMode === "dark" ? "gray.300" : "#344054"}
                    fontSize={"14px"}
                    fontWeight={"400"}
                   
                  >
                    {selectedReport?.expected
                      ? moment(
                          new Date(Number(selectedReport?.expected))
                        ).format("DD/MM/YYYY")
                      : ""}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </AlertDialogBody>

          {selectedReport && (
            <AlertDialogFooter>
              <Button
                onClick={() => {
                  handleReject();
                }}
                border="1px solid"
                borderColor="#FDA29B"
                backgroundColor="#FFFFFF"
                color="#B42318"
              >
                {t("reject")}
              </Button>
              <Button
                ml={3}
                onClick={() => {
                  handleApprove();
                }}
              >
                {t("approve")}
              </Button>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}

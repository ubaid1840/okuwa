"use client";
import Button, { DangerButton, GhostButton } from "@/components/ui/Button";
import InputCalendarRow from "@/components/ui/InputCalendarRow";
import InputImageRow from "@/components/ui/InputImageRow";
import InputRow from "@/components/ui/InputRow";
import InputSelectRow from "@/components/ui/InputSelectRow";
import InputTextArea from "@/components/ui/InputTextRow";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import {
  AddIcon,
  ChevronRightIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Divider,
  Flex,
  HStack,
  Input,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Image,
  Avatar,
  Select,
  TableContainer,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Box,
  Icon,
  Textarea,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useToast,
  Spinner,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { CiCalendar } from "react-icons/ci";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@/components/ui/Checkbox";
import { GoBriefcase } from "react-icons/go";
import { RxPencil1 } from "react-icons/rx";
import { Status } from "@/components/ui/StatusBox";
import { BsClipboard2 } from "react-icons/bs";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";
import moment from "moment";
import StatusBox from "@/components/ui/StatusBox";
import { showToastFailed } from "@/utils/toastUtils";

export default function Page() {
  const t = useTranslations("Dictionary");
  const pathName = usePathname();
  const sideLinks = GetLinkItems("nurse");
  const [role, setRole] = useState(t("selectOne"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSave,
    onOpen: onOpenSave,
    onClose: onCloseSave,
  } = useDisclosure();
  const [workHistory, setWorkHistory] = useState([]);
  const [isDetailOpen, setIsDetaiOpen] = useState(false);
  const ref = useRef();
  const [data, setData] = useState([]);
  const { state: UserState } = useContext(UserContext);
  const [selectedTask, setSelectedTask] = useState();
  const router = useRouter();
  const toastIdRef = useRef(null);
  const toast = useToast();
  const id = "test-toast";
  const {colorMode} = useColorMode()
  const colorTxt1 = useColorModeValue("#475467", 'gray.300')
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.700")
  

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data?.centerid, UserState.value.data?.id);
    }
  }, [UserState.value.data]);

  async function fetchData(id, nurse) {
    axios
      .post("/api/nurse/task/getall", { centerid: id, nurseid: nurse })
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => {
        if (e?.response?.data?.message)
          showToastFailed(
            toast,
            toastIdRef,
            t("Failed"),
            e?.response?.data?.message
          );
      });
  }

  const RenderEachRow = ({ item, index }) => {
    const [rowLoading, setRowLoading] = useState(false);

    async function handleUpdateStatus(id) {
      await axios
        .post("/api/update", {
          table: "task",
          columns: ["status"],
          values: ["completed"],
          conditions: {
            column: "id",
            operator: "=",
            value: id,
          },
        })
        .then(() => {
          fetchData(UserState.value.data?.centerid, UserState.value.data?.id);
        })
        .catch(() => {
          setRowLoading(false);
        });
    }

    return (
      <Tr
        backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}
        _hover={{ cursor: "pointer" }}
      >
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.task}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          <StatusBox item={item?.priority} />
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {moment(new Date(Number(item?.deadline))).format("DD/MM/YYYY")}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {`${item?.assignedby_firstname || ""} ${
            item?.assignedby_lastname || ""
          }`}
        </Td>

       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          <StatusBox item={item?.status} />
        </Td>

        {item.status === "pending" && (
         <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
            {rowLoading ? (
              <Spinner size={"sm"} />
            ) : (
              <GhostButton
                size={"sm"}
                onClick={() => {
                  setRowLoading(true);
                  handleUpdateStatus(item.task_id);
                }}
              >
                {t("markAsDone")}
              </GhostButton>
            )}
          </Td>
        )}
      </Tr>
    );
  };

  function calculateAge(dobInMilliseconds) {
    const currentDate = new Date();
    const dobDate = new Date(dobInMilliseconds);
    let age = currentDate.getFullYear() - dobDate.getFullYear();
    const monthDiff = currentDate.getMonth() - dobDate.getMonth();
    const dayDiff = currentDate.getDate() - dobDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  async function handleComplete(id) {
    await axios
      .post("/api/update", {
        table: "task",
        columns: ["status"],
        values: ["completed"],
        conditions: {
          column: "id",
          operator: "=",
          value: id,
        },
      })
      .then((response) => {
        fetchData(UserState.value.data.centerid, UserState.value.data.id);
      })
      .catch((e) => {
        if (e?.response?.data?.message)
          showToastFailed(
            toast,
            toastidref,
            t("Failed"),
            e?.response?.data?.message
          );
      });
  }

  function getStartOfWeek(date) {
    const day = date.getDay(); // Sunday - Saturday : 0 - 6
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday is the start of the week
    return new Date(date.setDate(diff));
  }

  // Helper function to get the end of the current week (Sunday)
  function getEndOfWeek(startOfWeek) {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday of the same week
    return endOfWeek;
  }

  // Function to filter tasks by the current week
  function filterTasksByCurrentWeek(tasks) {
    const now = new Date();
    const startOfWeek = getStartOfWeek(new Date(now)); // Monday of the current week
    const endOfWeek = getEndOfWeek(startOfWeek); // Sunday of the current week

    return tasks.filter((task) => {
      const taskDeadline = new Date(Number(task.deadline)); // Assuming task.deadline is in a valid date format
      return taskDeadline >= startOfWeek && taskDeadline <= endOfWeek;
    });
  }

  return (
    <Sidebar LinkItems={sideLinks}>
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("taskManagement")}</Text>

        <Tabs w={"100%"}>
          <TabList
            borderBottomWidth={"1px"}
            borderBottomColor={bdColor}
          >
            {[t("today"), t("thisWeek")].map((item, index) => (
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
              <Box
                width={"100%"}
                border={"1px solid"}
                borderRadius={"8px"}
                borderColor={bdColor}
              >
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        {[
                          t("task"),
                          t("priority"),
                          t("deadline"),
                          t("assignedBy"),
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
                            if (
                              moment(new Date(Number(item.deadline))).format(
                                "DD/MM/YYYY"
                              ) === moment(new Date()).format("DD/MM/YYYY")
                            ) {
                              return item;
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
                    <GhostButton
                    >
                      {t("previous")}
                    </GhostButton>
                  </div>
                  <div>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
                      {" "}
                      {t("page")} 1 {t("of")} 1
                    </Text>
                  </div>
                  <div>
                    <GhostButton
                     
                    >
                      {t("next")}
                    </GhostButton>
                  </div>
                </HStack>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box
                width={"100%"}
                border={"1px solid"}
                borderRadius={"8px"}
                borderColor={bdColor}
              >
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        {[
                          t("task"),
                          t("priority"),
                          t("deadline"),
                          t("assignedBy"),
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
                      {filterTasksByCurrentWeek(data).length > 0 &&
                        filterTasksByCurrentWeek(data).map((item, index) => (
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
                    <GhostButton
                    >
                      {t("previous")}
                    </GhostButton>
                  </div>
                  <div>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
                      {" "}
                      {t("page")} 1 {t("of")} 1
                    </Text>
                  </div>
                  <div>
                    <GhostButton
                     
                    >
                      {t("next")}
                    </GhostButton>
                  </div>
                </HStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Sidebar>
  );
}

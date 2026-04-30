"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { Status } from "@/components/ui/StatusBox";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { UserContext } from "@/store/context/UserContext";
import { AddIcon, } from "@chakra-ui/icons";
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
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Textarea,
  Select,
  useColorMode, useColorModeValue
} from "@chakra-ui/react";
import axios from "@/lib/axiosInstance";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useContext, useRef, useState, useEffect } from "react";
import { CiCalendar, CiSearch } from "react-icons/ci";
import StatusBox from "@/components/ui/StatusBox";
import { showToastFailed, } from "@/utils/toastUtils";
import {
  Select as SearchableSelect,
  useChakraSelectProps,
} from "chakra-react-select";
import { FaCheckCircle } from "react-icons/fa";
import moment from "moment";
import { Calendar } from "primereact/calendar";

export default function Page({ page }) {
  const { colorMode } = useColorMode()
  const t = useTranslations("Dictionary");
  const [data, setData] = useState([]);
  const { state: UserState } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [nurses, setNurses] = useState([]);
  const [entryLoading, setEntryLoading] = useState(false);
  const cancelRef = useRef();

  const [newEntry, setNewEntry] = useState({
    nurse: "",
    nurseID: "",
    task: "",
    priority: "",
    deadline: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      if (page === 'admin') {
        fetchDataforAdmin(UserState.value.data?.centerid);
      } else {
        fetchDataforUser(UserState.value.data?.centerid, UserState.value.data?.id);
      }

      // fetchNurses(UserState.value.data?.centerid);
    }
  }, [UserState.value.data]);

  async function fetchNurses(id) {
    axios
      .post("/api/admin/nurse/getall", {
        centerid: id,
      })
      .then((response) => {
        setNurses(response.data);
      });
  }

  async function fetchDataforAdmin(id) {
    axios
      .get(`/api/newroutes/healthcare/${id}/admin/task`)
      .then((response) => {
        if (response.data?.task){
          setData(response.data.task);
          setNurses(response.data.nurse)
        }
       
      })
      .catch((e) => {
        if (e?.response?.data?.message)
          toast({
            title: "Failed",
            description: e?.response?.data?.message,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
      });
  }

  async function fetchDataforUser(id, myid) {
    axios
      .post("/api/doctor/task/getall", { centerid: id, id: myid })
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => {
        if (e?.response?.data?.message)
          showToastFailed(toast, toastIdRef, t("Failed"), e?.response?.data?.message)
      });
  }

  const toastIdRef = useRef(null);
  const toast = useToast();
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
  const txtColor1 = useColorModeValue("#475467", 'gray.300')
  const bgColor = useColorModeValue('white', 'gray.800')

  const customChakraStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: bdColor,
    }),
  };

  const nurseselectProps = useChakraSelectProps({
    value: {
      value: newEntry.nurse,
      label: newEntry.nurse == "" ? t("selectOne") : newEntry.nurse,
    },
    onChange: (e) => {
      setNewEntry((prevState) => ({
        ...prevState,
        nurse: e.label,
        nurseID: e.value,
      }));
    },
  });

  async function handleSaveNewEntryForAdmin() {
    axios
      .post("/api/insert", {
        table: "task",
        columns: [
          "nurseid",
          "deadline",
          "priority",
          "centerid",
          "status",
          "task",
          "created",
          "assignedby",
          "admin"
        ],
        values: [
          newEntry.nurseID,
          moment(newEntry.deadline).valueOf(),
          newEntry.priority,
          UserState.value.data.centerid,
          "pending",
          newEntry.task,
          moment().valueOf(),
          UserState.value.data.id,
          true
        ],
      })
      .then(() => {
        setEntryLoading(false);
        onClose();
        fetchDataforAdmin(UserState.value.data?.centerid);
      })
      .catch(() => {
        setEntryLoading(false);
      });
  }

  async function handleSaveNewEntryForUser(myid) {
    axios
      .post("/api/insert", {
        table: "task",
        columns: [
          "nurseid",
          "deadline",
          "priority",
          "centerid",
          "status",
          "task",
          "created",
          "assignedby",
          "admin"
        ],
        values: [
          newEntry.nurseID,
          moment(newEntry.deadline).valueOf(),
          newEntry.priority,
          UserState.value.data.centerid,
          "pending",
          newEntry.task,
          moment().valueOf(),
          myid,
          false
        ],
      })
      .then(() => {
        setEntryLoading(false);
        onClose();
        fetchDataforUser(UserState.value.data?.centerid, myid);
      })
      .catch(() => {
        setEntryLoading(false);
      });
  }

  const RenderEachRow = ({ item, index }) => {
    return (
      <Tr
        backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}
    
      >
        <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          {item?.task}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          {item?.firstname + " " + item?.lastname}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          <StatusBox item={item?.priority} />
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          {moment(new Date(Number(item?.deadline))).format("DD/MM/YYYY")}
        </Td>
        <Td>
          <StatusBox item={item?.status} />
        </Td>
      </Tr>
    );
  };

  const sideLinks = GetLinkItems(page);

  return (
    <Sidebar LinkItems={sideLinks} settingsLink={page === 'admin' && "/admin/settings"}>
      <Flex
        flex={1}
        gap={"50px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <Text color={colorMode === 'dark' && 'gray.300'} variant="heading"> {t("task")}</Text>
        {data?.length == 0 ? (
          <VStack spacing={5}>
            <Image
              width={"315px"}
              height={"210px"}
              src="/assets/No-data-pana-1.png"
            />
            <Text color={colorMode === 'dark' && 'gray.300'} fontWeight={"600"} fontSize={"30px"}>
              {t("noTaskAssigned")}
            </Text>
            <div>
              <Button
                onClick={() => {
                  setNewEntry({
                    nurse: "",
                    nurseID: "",
                    priority: "",
                    task: "",
                  });
                  onOpen();
                }}
                leftIcon={<AddIcon marginTop={"-2px"} />}
                width={"100%"}
              >
                {t("newTask")}
              </Button>
            </div>
          </VStack>
        ) : (
          <Box
            width={"100%"}
            border={"1px solid"}
            borderColor={bdColor}
            borderRadius={5}
          >
            <HStack justify={"space-between"} width={"100%"} p={5}>
              <div
                style={{ display: "flex", width: "100%", maxWidth: "700px" }}
              >
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={CiSearch} boxSize={5} color="#667085" />
                  </InputLeftElement>
                  <Input

                    placeholder={t("search")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </div>

              <div>
                <Button
                  onClick={() => {
                    setNewEntry({
                      nurse: "",
                      nurseID: "",
                      priority: "",
                      task: "",
                    });
                    onOpen();
                  }}
                  leftIcon={<AddIcon marginTop={"-2px"} />}
                >
                  {t("newTask")}
                </Button>
              </div>
            </HStack>
            <Box width={"100%"}>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      {[
                        t("task"), t("nurse"), t("priority"), t("deadline"), t("status")
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
                    {data?.length > 0 &&
                      data
                        .filter((itm) => {
                          const searchItem = itm.firstname + " " + itm.lastname + " " + itm.priority + " " + itm.status;
                          if (
                            searchItem
                              .toLocaleLowerCase()
                              .includes(search.toLocaleLowerCase())
                          ) {
                            return itm;
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
                  <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">
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
              <Icon as={FaCheckCircle} boxSize={6} color={"#155EEF"} />
            </div>
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <VStack alignItems={"flex-start"} spacing={2} w={"100%"}>
              <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontSize={"18px"} fontWeight={"500"}>
                {t("newTask")}
              </Text>
              <VStack alignItems={"flex-start"} spacing={0} w={"100%"}>
                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"}>{t("nurse")}</Text>
                <div style={{ width: "100%" }}>
                  <SearchableSelect
                    useBasicStyles
                    chakraStyles={customChakraStyles}
                    colorScheme="teal"
                    options={nurses.map((item) => {
                      return {
                        value: item.id,
                        label: `${item.id} - ${item.firstname}  ${item.lastname} `,
                      };
                    })}
                    {...nurseselectProps}
                  />
                </div>
              </VStack>
              <VStack alignItems={"flex-start"} spacing={0} w={"100%"}>
                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"}>{t("priority")}</Text>
                <Select
                  bg={bgColor}
                  borderColor={bdColor}
                  value={newEntry.priority}
                  onChange={(e) =>
                    setNewEntry((prevState) => ({
                      ...prevState,
                      priority: e.target.value,
                    }))
                  }
                >
                  <option value={""}>{t("selectOne")}</option>
                  <option value={"low"}>{t("low")}</option>
                  <option value={"medium"}>{t("medium")}</option>
                  <option value={"high"}>{t("high")}</option>
                </Select>
              </VStack>
              <VStack alignItems={"flex-start"} spacing={0} w={"100%"}>
                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"}>{t("task")}</Text>
                <Textarea
                  bg={bgColor}
                  borderColor={bdColor}
                  height={"150px"}
                  resize={"none"}
                  value={newEntry.task}
                  onChange={(e) =>
                    setNewEntry((prevState) => ({
                      ...prevState,
                      task: e.target.value,
                    }))
                  }
                />
              </VStack>
              <VStack align={"flex-start"} gap={0} w={"100%"}>
                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"}>{t("deadline")}</Text>
                </div>
                <Box
                  display={"flex"}
                  width={"100%"}
                  height={10}
                  borderRadius={"0.375rem"}
                  outline={"2px solid transparent"}
                  border={"1px solid"}
                  borderColor={bdColor}
                  paddingInlineStart={"1rem"}
                  paddingInlineEnd={"1rem"}
                  alignItems={"center"}
                  _hover={{ borderColor: theme.color.border }}
                  _focusWithin={{
                    boxShadow: "0px 0px 3px 3px #b2d8d8",
                    borderColor: theme.color.border,
                  }}
                >
                  <Calendar
                    dateFormat="dd/mm/yy"
                    className="custom-datepicker"
                    value={newEntry.deadline}
                    onChange={(e) => {
                      setNewEntry((prevState) => ({
                        ...prevState,
                        deadline: e.value,
                      }));
                    }}
                  />

                  <Icon as={CiCalendar} size={20} />
                </Box>
              </VStack>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter width={"100%"} justifyContent={"space-between"}>
            <GhostButton
              width={"100%"}
              onClick={onClose}
            >
              {t("cancel")}
            </GhostButton>
            <Button
              isLoading={entryLoading}
              isDisabled={
                !newEntry.nurseID ||
                !newEntry.task ||
                !newEntry.deadline ||
                !newEntry.priority
              }
              width={"100%"}
              ml={3}
              onClick={() => {
                setEntryLoading(true);
                if (page === 'admin') {
                  handleSaveNewEntryForAdmin();
                } else {
                  handleSaveNewEntryForUser(UserState.value.data.id);
                }

              }}
            >
              {t("confirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}

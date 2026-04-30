"use client";
import Button, { GhostButton } from "@/components/ui/Button";
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
  useOutsideClick,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Textarea,
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
import { useTranslations } from "next-intl";
import StatusBox, { Status } from "@/components/ui/StatusBox";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";
import { showToastFailed } from "@/utils/toastUtils";
import {
  Select as SearchableSelect,
  useChakraSelectProps,
} from "chakra-react-select";

export default function Page() {
  const t = useTranslations("Dictionary");
  const { state: UserState } = useContext(UserContext);
  const pathname = usePathname();
  const cancelRef = useRef();
  const [data, setData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [entryLoading, setEntryLoading] = useState(false);
  const [newEntry, setNewEntry] = useState({
    patient: "",
    patientID: "",
    wound: "",
  });
  const toastIdRef = useRef(null);
  const toast = useToast();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const id = "test-toast";
  const { colorMode } = useColorMode();
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.700");
  const colorTxt1 = useColorModeValue("#475467", "gray.300");
  const colorTxt2 = useColorModeValue("#101828", "gray.300");

  const params = useSearchParams();

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data?.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    axios
      .post("/api/nurse/woundtreatment/getall", { id: id })
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => {
        showToastFailed(
          toast,
          toastIdRef,
          t("Failed"),
          e?.response?.data?.message
        );
      });

    axios
      .post("/api/patient/getall", {
        centerid: id,
      })
      .then((response) => {
        onClose();
        setPatients(response.data);
      });
  }

  const customChakraStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: bdColor,
    }),
  };

  const patientSelectProps = useChakraSelectProps({
    value: {
      value: newEntry.patient,
      label: newEntry.patient == "" ? t("selectOne") : newEntry.patient,
    },
    onChange: (e) => {
      setNewEntry((prevState) => ({
        ...prevState,
        patient: e.label,
        patientID: e.value,
      }));
    },
  });
  async function handleSaveNewEntry() {
    const temp = { ...newEntry, created: moment().valueOf() };
    axios
      .post("/api/insert", {
        table: "woundtreatment",
        columns: [
          "centerid",
          "patientid",
          "nurseid",
          "created",
          "status",
          "wound",
        ],
        values: [
          UserState.value.data.centerid,
          temp.patientID,
          UserState.value.data.id,
          temp.created,
          "ongoing",
          temp.wound,
        ],
      })
      .then(() => {
        setEntryLoading(false);
        onClose();
        fetchData(UserState.value.data?.centerid);
      })
      .catch(() => {
        setEntryLoading(false);
      });
  }

  const RenderFirstTreatment = ({ item }) => {
    let sortedData = item.sort((a, b) => Number(a.created) - Number(b.created));
    return moment(new Date(Number(sortedData[0].created))).format("DD/MM/YYYY");
  };

  const RenderLastTreatment = ({ item }) => {
    let sortedData = item.sort((a, b) => Number(a.created) - Number(b.created));
    return moment(
      new Date(Number(sortedData[sortedData.length - 1].created))
    ).format("DD/MM/YYYY");
  };

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
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.woundtreatment_details.length > 0 && (
            <RenderFirstTreatment item={item?.woundtreatment_details} />
          )}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.woundtreatment_details.length > 0 && (
            <RenderLastTreatment item={item?.woundtreatment_details} />
          )}
        </Td>
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {`${item?.patient_firstname || ""} ${item?.patient_lastname || ""}`}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            PT{item?.patientid}
          </div>
        </Td>

        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.wound}
        </Td>

        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          <StatusBox item={item?.status} />
        </Td>

        <Td
          fontSize="14px"
          fontWeight="500"
          color="#004EEB"
          _hover={{ cursor: "pointer" }}
        >
          <Link
            href={`${pathname}/treatmentdetails?id=${item?.wound_id}`}
            _hover={{ textDecorationLine: "none" }}
          >
            {t("seeDetails")}
          </Link>
        </Td>
      </Tr>
    );
  };
  const sideLinks = GetLinkItems("nurse");
  return (
    <Sidebar LinkItems={sideLinks}>
      <Flex
        flex={1}
        gap={"50px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <Text color={colorMode === "dark" && "gray.300"} variant="heading">
          {" "}
          {t("woundTreatment")}
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
              {t("noWoundTreatment")}
            </Text>
            <div style={{ width: "70%" }}>
              <Text
                fontSize={"16px"}
                fontWeight={"400"}
                color={theme.text.secondary}
                textAlign={"center"}
              >
                {t("noWoundTreatmentSubheading")}
              </Text>
            </div>
            <div>
              <Button
                leftIcon={<AddIcon marginTop={"-2px"} />}
                width={"100%"}
                onClick={() => {
                  setEntryLoading(false);
                  setNewEntry({
                    note: "",
                    patient: "",
                    patientID: "",
                    wound: "",
                  });
                  onOpen();
                }}
              >
                {t("newTreatment")}
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
              <div style={{ display: "flex" }}>
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
                  leftIcon={<AddIcon marginTop={"-2px"} />}
                  onClick={() => {
                    setEntryLoading(false);
                    setNewEntry({
                      note: "",
                      patient: "",
                      patientID: "",
                      wound: "",
                    });
                    onOpen();
                  }}
                >
                  {t("newTreatment")}
                </Button>
              </div>
            </HStack>
            <Box width={"100%"}>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      {[
                        t("firstTreatment"),
                        t("lastUpdate"),
                        t("patient"),
                        t("wound"),
                        t("treatmentStatus"),
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
                          const string =
                            item.patient_firstname +
                            " " +
                            item.patient_lastname;
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
                    {" "}
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
              <Icon
                as={MdOutlineHealthAndSafety}
                boxSize={6}
                color={"#155EEF"}
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <VStack alignItems={"flex-start"} spacing={2} w={"100%"}>
              <Text
                color={colorMode === "dark" ? "gray.300" : "#101828"}
                fontSize={"18px"}
                fontWeight={"500"}
              >
                {t("newTreatment")}
              </Text>
              <VStack alignItems={"flex-start"} spacing={0} w={"100%"}>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"description"}
                >
                  {t("patient")}
                </Text>
                <div style={{ width: "100%" }}>
                  <SearchableSelect
                    useBasicStyles
                    chakraStyles={customChakraStyles}
                    colorScheme="teal"
                    options={patients.map((item) => {
                      return {
                        value: item.id,
                        label: `${item.id} - ${item.firstname}  ${item.lastname} `,
                      };
                    })}
                    {...patientSelectProps}
                  />
                </div>
              </VStack>
              <VStack alignItems={"flex-start"} spacing={0} w={"100%"}>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"description"}
                >
                  {t("wound")}
                </Text>
                <Input
                  placeholder={t("inputWound")}
                  value={newEntry.wound}
                  onChange={(e) =>
                    setNewEntry((prevState) => ({
                      ...prevState,
                      wound: e.target.value,
                    }))
                  }
                />
              </VStack>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter width={"100%"} justifyContent={"space-between"}>
            <GhostButton width={"100%"} onClick={onClose}>
              {t("cancel")}
            </GhostButton>
            <Button
              isLoading={entryLoading}
              isDisabled={!newEntry.patientID || !newEntry.wound}
              width={"100%"}
              ml={3}
              onClick={() => {
                setEntryLoading(true);
                handleSaveNewEntry();
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

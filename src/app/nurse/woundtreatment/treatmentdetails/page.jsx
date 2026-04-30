"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { AddIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import "react-datepicker/dist/react-datepicker.css";
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
  Select,
  Box,
  Icon,
  TableContainer,
  Table,
  Thead,
  Tr,
  Tbody,
  InputGroup,
  InputLeftElement,
  Th,
  Td,
  useDisclosure,
  AlertDialog,
  AlertDescription,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Textarea,
  useToast,
  Spinner,
  Spacer,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { useTranslations } from "next-intl";
import InputRow from "@/components/ui/InputRow";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import Dropzone from "@/components/DropZone";
import { LuBadgeCheck } from "react-icons/lu";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";
import moment from "moment";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/config/firebase";
import Loading from "@/app/loading";

export default function Page() {
  const t = useTranslations("Dictionary");
  const pathName = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [data, setData] = useState();
  const { state: UserState } = useContext(UserContext);
  const [firstTreatment, setFirstTreatment] = useState();
  const [search, setSearch] = useState("");
  const [newEntry, setNewEntry] = useState({ note: "", image: "" });
  const [uploading, setUploading] = useState(false);
  const toastIdRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.700");
  const colorTxt1 = useColorModeValue("#475467", "gray.300");

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      const search = new URLSearchParams(window.location.search).get("id");
      if (search) {
        fetchData(Number(search));
      }
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    axios
      .post("/api/nurse/woundtreatment/getsingle", { id: id })
      .then((response) => {
        if (response.data?.length > 0) {
          setLoading(false);
          setData(response.data[0]);
          if (response.data[0]?.woundtreatment_details?.length > 0) {
            const temp = response.data[0].woundtreatment_details.sort(
              (a, b) => Number(a.created) - Number(b.created)
            );

            setFirstTreatment(temp[0]?.created);
          }
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
      toastIdRef.current = null;
    }
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
                <Text
                  color={colorMode === "dark" ? "gray.300" : "black"}
                  variant="subheading"
                >
                  {t("woundTreatmentProgressAdded")}
                </Text>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant="description"
                  fontSize="14px"
                >
                  {t("woundTreatmentProgressAddedSubheading")}
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

  const RenderEachRow = ({ item, index }) => {
    const [rowLoading, setRowLoading] = useState(false);
    async function handleDelete(id) {
      axios
        .post("/api/delete", {
          table: "woundtreatment_detail",
          conditions: [{ column: "id", operator: "=", value: id }],
          conditionOperator: "AND",
        })
        .then(() => {
          setRowLoading(false);
          const temp = data.woundtreatment_details.filter(
            (eachItem) => eachItem.id !== id
          );
          setData((prevState) => ({
            ...prevState,
            woundtreatment_details: temp,
          }));
        });
    }
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
          {item?.created
            ? moment(new Date(Number(item.created))).format("DD/MM/YYYY")
            : ""}
        </Td>

        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.note}
        </Td>

        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          Progress_{data.woundtreatment_details.length - index}.png
        </Td>

        <Td>
          <HStack>
            <Text
              as={Link}
              href={item.image}
              target="_blank"
              _hover={{ cursor: "pointer", opacity: 0.7 }}
              fontSize={"14px"}
              color={"#004EEB"}
              fontWeight={"500"}
            >
              {t("viewImage")}
            </Text>
            {rowLoading ? (
              <Spinner ml={2} size={"sm"} />
            ) : (
              <Text
                onClick={() => {
                  setRowLoading(true);
                  handleDelete(item.id);
                }}
                _hover={{ cursor: "pointer", opacity: 0.7 }}
                fontSize={"14px"}
                color={"#B42318"}
                fontWeight={"500"}
              >
                {t("delete")}
              </Text>
            )}
          </HStack>
        </Td>
      </Tr>
    );
  };

  async function uploadFiles() {
    const search = new URLSearchParams(window.location.search).get("id");
    if (search) {
      const response = await fetch(newEntry.image);
      const blob = await response.blob();

      const name = moment().valueOf().toString() + ".png";
      const metadata = {
        contentType: "image/png",
      };
      const storageRef = ref(
        storage,
        `HC${UserState.value.data.centerid}/wound/${search}/` + name
      );
      const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            handleSaveNewEntry(downloadURL, Number(search));
          });
        }
      );
    } else {
      setUploading(false);
    }
  }

  async function handleSaveNewEntry(imgLink, wid) {
    const search = new URLSearchParams(window.location.search).get("id");
    if (search) {
      axios
        .post("/api/insert", {
          table: "woundtreatment_detail",
          columns: ["woundtreatment_id", "created", "image", "note"],
          values: [wid, moment().valueOf(), imgLink, newEntry.note],
        })
        .then(() => {
          setUploading(false);
          addToast();
          fetchData(wid);
          onClose();
        });
    }
  }

  async function handleUpdateStatus() {
    const search = new URLSearchParams(window.location.search).get("id");
    if (search) {
      axios
        .post("/api/update", {
          table: "woundtreatment",
          columns: ["status"],
          values: ["completed"],
          conditions: {
            column: "id",
            operator: "=",
            value: Number(search),
          },
        })
        .then(() => {
          router.push(pathName.replace(/\/[^\/]*$/, ""));
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }

  const sideLinks = GetLinkItems("nurse");
  return (
    <Sidebar LinkItems={sideLinks}>
      {loading ? (
        <Loading />
      ) : (
        <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
          <HStack fontSize="14px" fontWeight="500" color="#667085">
            <Link href={pathName.replace(/\/[^\/]*$/, "")}>
              {t("woundTreatment")}
            </Link>
            <ChevronRightIcon />
            <Text color={colorMode === "dark" ? "gray.300" : "#344054"}>
              {t("treatmentDetails")}
            </Text>
          </HStack>
          <HStack justifyContent={"space-between"}>
            <Text color={colorMode === "dark" && "gray.300"} variant="heading">
              {t("treatmentDetails")}
            </Text>
            <Button
              onClick={() => {
                setLoading(true);
                handleUpdateStatus();
              }}
            >
              {t("markAsDone")}
            </Button>
          </HStack>
          <Text
            color={colorMode === "dark" && "gray.300"}
            variant="subheading"
            fontSize={"16px"}
            fontWeight={"500"}
          >
            {t("patientInformation")}
          </Text>

          <VStack align={"flex-start"} gap={5}>
            <InputRow
              title={t("firstName")}
              value={data?.patient_firstname}
              disabled={true}
            />
            <InputRow
              title={t("lastName")}
              value={data?.patient_lastname}
              disabled={true}
            />
            <InputRow
              title={t("dob")}
              value={
                data?.patient_dob
                  ? moment(new Date(Number(data.patient_dob))).format(
                      "DD/MM/YYYY"
                    )
                  : ""
              }
              disabled={true}
            />
            <InputRow
              title={t("gender")}
              value={data?.patient_gender ? t(data.patient_gender) : ""}
              disabled={true}
            />
          </VStack>
          <Divider color={theme.divider.primary} />
          <Text
            color={colorMode === "dark" && "gray.300"}
            variant="subheading"
            fontSize={"16px"}
            fontWeight={"500"}
          >
            {t("treatmentInformation")}
          </Text>
          <VStack align={"flex-start"} gap={5}>
            <InputRow
              title={t("firstTreatment")}
              value={
                firstTreatment
                  ? moment(new Date(Number(firstTreatment))).format(
                      "DD/MM/YYYY"
                    )
                  : ""
              }
              disabled={true}
            />
            <InputRow title={t("wound")} value={data?.wound} disabled={true} />
            <InputRow
              title={t("status")}
              value={data?.status ? t(data?.status) : ""}
              disabled={true}
            />
          </VStack>
          <Box
            width={"100%"}
            border={"1px solid"}
            borderColor={bdColor}
            borderRadius={5}
          >
            <HStack justify={"space-between"} width={"100%"} p={5}>
              <Spacer />
              <div>
                <Button
                  leftIcon={<AddIcon marginTop={"-2px"} />}
                  onClick={() => {
                    setNewEntry({ image: "", note: " " });
                    onOpen();
                  }}
                >
                  {t("addProgress")}
                </Button>
              </div>
            </HStack>
            <Box width={"100%"}>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      {[t("date"), t("note"), t("image")].map((item, index) => (
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
                    {data?.woundtreatment_details?.length > 0 &&
                      data?.woundtreatment_details
                        .sort((a, b) => Number(b.created) - Number(a.created))
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
        </Flex>
      )}
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
                {t("addProgress")}
              </Text>
              <VStack alignItems={"flex-start"} spacing={0} w={"100%"}>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"description"}
                >
                  {t("note")}
                </Text>
                <Textarea
                  placeContent={"fillTreatmentNoteHere"}
                  resize="none"
                  height={"140px"}
                  value={newEntry.note}
                  onChange={(e) =>
                    setNewEntry((prevState) => ({
                      ...prevState,
                      note: e.target.value,
                    }))
                  }
                />
              </VStack>
              <VStack alignItems={"flex-start"} spacing={0} w={"100%"}>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"description"}
                >
                  {t("image")}
                </Text>
                {newEntry.image ? (
                  <HStack spacing={5}>
                    <Box
                      border={"1px solid"}
                      borderColor={bdColor}
                      borderRadius={"8px"}
                      display={"flex"}
                      flexDir={"row"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      padding={"16px"}
                    >
                      <Image
                        src={newEntry.image}
                        height={"100px"}
                        width={"100px"}
                      />
                    </Box>
                    <Text
                      _hover={{ cursor: "pointer" }}
                      color={theme.input.label}
                      fontSize={"14px"}
                      fontWeight={"500"}
                      onClick={() =>
                        setNewEntry((prevState) => ({
                          ...prevState,
                          image: "",
                        }))
                      }
                    >
                      {t("delete")}
                    </Text>
                  </HStack>
                ) : (
                  <Dropzone
                  borderColor={true} colorMode={colorMode}
                    onDrop={(file) => {
                      setNewEntry((prevState) => ({
                        ...prevState,
                        image: URL.createObjectURL(file),
                      }));
                    }}
                    title={t("clickToUpload")}
                    subheading={t("dragAndDrop")}
                    description={t("descriptionDropzone")}
                    drag={t("drag")}
                  />
                )}
              </VStack>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter width={"100%"} justifyContent={"space-between"}>
            <GhostButton width={"100%"} onClick={onClose}>
              {t("cancel")}
            </GhostButton>
            <Button
              isLoading={uploading}
              isDisabled={!newEntry.image || !newEntry.note}
              width={"100%"}
              ml={3}
              onClick={() => {
                setUploading(true);
                uploadFiles();
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

"use client";
import Sidebar from "@/components/sidebar";
import {
  ChevronRightIcon,
  CloseIcon,
  DeleteIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Flex,
  HStack,
  Image,
  Input,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  Box,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Icon,
  UnorderedList,
  ListItem,
  useToast,
  Center,
  Spinner,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import Button, { GhostButton } from "@/components/ui/Button";
import { theme } from "@/data/data";
import moment from "moment";
import GetLinkItems from "@/utils/SidebarItems";
import { useTranslations } from "next-intl";
import { HiMiniArrowUturnRight } from "react-icons/hi2";
import { MdOutlineModeEdit } from "react-icons/md";
import { LuBadgeCheck, LuCalendarPlus, LuFilePlus2 } from "react-icons/lu";
import InputRow from "@/components/ui/InputRow";
import ImageRow from "@/components/ui/ImageRow";
import PrescriptionCard from "@/components/ui/prescriptionCard";
import { Status } from "@/components/ui/StatusBox";
import axios from "@/lib/axiosInstance";
import { UserContext } from "@/store/context/UserContext";
import InputImageRow from "@/components/ui/InputImageRow";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/config/firebase";
import InputSelectRow from "@/components/ui/InputSelectRow";

export default function Page() {
  const { colorMode } = useColorMode();
  const t = useTranslations("Dictionary");
  const pathName = usePathname();
  const [labResultOption, setLabResultOption] = useState(0);

  const [singleDetail, setSingleDetail] = useState();
  const searchParams = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toastIdRef = useRef(null);
  const toast = useToast();
  const id = "test-toast";
  const { state: UserState } = useContext(UserContext);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();
  const [imageLoading, setImageLoading] = useState(false);

  const [data, setData] = useState({
    labtestcategory: "",
    labtesttube: "",
    labtestunit: "",
    code: "",
    abbreviation: "",
    note: "",
  });
  const router = useRouter();
  const [settingsData, setSettingsData] = useState();

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      const search = new URLSearchParams(window.location.search).get("id");
      if (search) {
        fetchData(Number(search), UserState.value.data?.centerid);
      }
    }
  }, [UserState.value.data]);

  async function fetchData(id, centerid) {
    axios
      .post("/api/settings/get", {
        id: centerid,
      })
      .then((response) => {
        setSettingsData(response.data);
      });
    axios.post("/api/labrequest/single", { id: id }).then((response) => {
      setData((prevState) => ({ ...prevState, ...response.data }));
      if (response.data?.length == 0) {
        router.push(`${pathName.replace(/\/[^\/]*$/, "")}`);
      }
    });
  }
  async function handleSaveImage(e) {
    const name = `${data.patient_firstname || ""}-${
      data.patient_lastname || ""
    }-${data.requesttype}-${data.id}.png`;

    const metadata = {
      contentType: "image/png",
    };
    const storageRef = ref(storage, `lab/images/` + name);
    const uploadTask = uploadBytesResumable(storageRef, e, metadata);
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
        setImageLoading(false);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageLoading(false);
          setImage(downloadURL);
        });
      }
    );
  }

  async function updateDB(imglink) {
    axios
      .post("/api/update", {
        table: "labrequest",
        columns: [
          "image",
          "status",
          "labtestcategory",
          "labtesttube",
          "labtestunit",
          "code",
          "abbreviation",
          "performedbyid",
          "performedbyfirstname",
          "performedbylastname",
          "note",
        ],
        values: [
          imglink,
          "needreview",
          data.labtestcategory,
          data.labtesttube,
          data.labtestunit,
          data.code,
          data.abbreviation,
          UserState.value.data.id,
          UserState.value.data.firstname,
          UserState.value.data.lastname,
          data.note,
        ],
        conditions: {
          column: "id",
          operator: "=",
          value: data.id,
        },
      })
      .then(() => {
        router.push(pathName.replace(/\/[^\/]*$/, ""));
        setLoading(false);
        setImage("");
        setData({
          labtestcategory: "",
          labtesttube: "",
          labtestunit: "",
          code: "",
          abbreviation: "",
          note: "",
        });
      });
  }
  const sideLinks = GetLinkItems("lab");
  return (
    <Sidebar LinkItems={sideLinks}>
      {data ? (
        <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
          <HStack fontSize="14px" fontWeight="500" color="#667085">
            <Link href={pathName.replace(/\/[^\/]*$/, "")}>
              {t("testManagement")}
            </Link>
            <ChevronRightIcon />
            <Text color={colorMode === "dark" ? "gray.300" : "#344054"}>
              {t("addReport")}
            </Text>
          </HStack>
          <HStack justifyContent={"space-between"}>
            <Text color={colorMode === "dark" && "gray.300"} variant="heading">
              {t("addReport")}
            </Text>
            <HStack>
              <Link href={`${pathName.replace(/\/[^\/]*$/, "")}`}>
                <GhostButton
                  onClick={() => {
                    setImage("");
                  }}
               
                >
                  {t("cancel")}
                </GhostButton>
              </Link>

              <Button
                isDisabled={!image}
                isLoading={loading}
                onClick={() => {
                  setLoading(true);
                  updateDB(image);
                }}
              >
                {t("save")}
              </Button>
            </HStack>
          </HStack>
          <VStack align={"flex-start"} gap={5}>
            <HStack width={"100%"} justifyContent={"space-between"}>
              <HStack spacing={10}>
                <Image
                  src={"/assets/patient.png"}
                  height={"60px"}
                  width={"60px"}
                  borderRadius={"50px"}
                />
                <VStack spacing={0} alignItems={"flex-start"}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant="heading"
                    fontSize="24px"
                  >
                    {data?.patient_firstname ||
                      "" + " " + data?.patient_lastname ||
                      ""}
                  </Text>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant="description"
                    fontSize="16px"
                    fontWeight="400"
                  >
                    PT{data?.patient_id || ""}
                  </Text>
                </VStack>
              </HStack>
            </HStack>

            {/* <InputRow
              value={`${data.doctor_firstname || ""} ${
                data.doctor_lastname || ""
              } - ${
                data?.doctor_specialization
                  ? t(data?.doctor_specialization)
                  : ""
              }`}
              title={t("requestor")}
              disabled={true}
            /> */}

            <InputRow
              value={t(data?.requesttype)}
              disabled={true}
              title={t("requestType")}
            />

            <InputRow
              value={`${data.testtype || ""}`}
              disabled={true}
              title={t("testType")}
            />

            <InputRow
              value={
                data?.expected
                  ? moment(new Date(Number(data.expected))).format("DD/MM/YYYY")
                  : ""
              }
              disabled={true}
              title={t("expectedDate")}
            />

            <InputSelectRow
              withoutTranslation={true}
              options={
                settingsData?.labtestcategories?.length > 0
                  ? settingsData?.labtestcategories
                  : []
              }
              value={data?.labtestcategory}
              title={t("category")}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  labtestcategory: e.target.value,
                }))
              }
            />

            <InputSelectRow
              withoutTranslation={true}
              options={
                settingsData?.labtesttube?.length > 0
                  ? settingsData?.labtesttube
                  : []
              }
              value={data?.labtesttube}
              title={t("tube")}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  labtesttube: e.target.value,
                }))
              }
            />

            <InputSelectRow
              withoutTranslation={true}
              options={
                settingsData?.labtestunit?.length > 0
                  ? settingsData?.labtestunit
                  : []
              }
              value={data?.labtestunit}
              title={t("unit")}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  labtestunit: e.target.value,
                }))
              }
            />

            <InputRow
              value={data?.code}
              title={t("code")}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  code: e.target.value,
                }))
              }
            />

            <InputRow
              value={data?.abbreviation}
              title={t("abbreviation")}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  abbreviation: e.target.value,
                }))
              }
            />

            <InputRow
              value={data?.note}
              title={t("note")}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  note: e.target.value,
                }))
              }
            />

            <InputImageRow
              loading={imageLoading}
              title={"Image"}
              image={image}
              onReturn={(e) => {
                setImageLoading(true);
                handleSaveImage(e);
              }}
              onDeleteImage={() => setImage("")}
            />
          </VStack>
        </Flex>
      ) : (
        <Center height={"100vh"} width={"100%"}>
          <Spinner />
        </Center>
      )}
    </Sidebar>
  );
}

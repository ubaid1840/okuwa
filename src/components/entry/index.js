"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { AppointmentContext } from "@/store/context/AppointmentContext";
import { PatientContext } from "@/store/context/PatientContext";
import { Button as ChakraButton, Portal } from "@chakra-ui/react"
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
  MenuItem,
  MenuList,
  UnorderedList,
  useColorMode,
  useColorModeValue,
  Input,
  ListItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Select,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useRef, useState, useEffect } from "react";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { IoFilterSharp } from "react-icons/io5";
import { LuBadgeCheck } from "react-icons/lu";
import moment from "moment";
import { RxPencil1 } from "react-icons/rx";
import { useTranslations } from "next-intl";
import { UserContext } from "@/store/context/UserContext";
import axios from '@/lib/axiosInstance';
import StatusBox from "../ui/StatusBox";
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils";
import Checkbox from "../ui/Checkbox";
import { Calendar } from "primereact/calendar";
import {
  CreatePdfLabPrivate,
  CreatePdfLabPublic,
} from "@/functions/createPDFLab";
import {
  CreatePdfHospitalizationPrivate,
  CreatePdfHospitalizationPublic,
} from "@/functions/createPDFHospitalization";
import { formatNumber } from "@/functions/formatNumber";
import handleOpenReport from "@/functions/existingReport";

export default function Appointments({ page }) {
  const { colorMode } = useColorMode()
  const t = useTranslations("Dictionary");
  const pathname = usePathname();
  const [data, setData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDetailOpen, setIsDetaiOpen] = useState(false);
  const { state: UserState } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState(-1);
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState({});
  const [appointmentByDoctor, setAppointmentByDoctor] = useState([])
  const [appointmentByLab, setAppointmentByLab] = useState([])
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const colorTxt1 = useColorModeValue("#475467", 'gray.300')
  const colorTxt2 = useColorModeValue("#101828", "gray.300")
  const bgColor = useColorModeValue('white', 'gray.800')
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
  const [completedLoading, setCompletedLoading] = useState(false)

  const [allTestType, setAllTestType] = useState([]);
  const [allImagingStudies, setAllImagingStudies] = useState([]);
  const {
    isOpen: isOpenLab,
    onOpen: onOpenLab,
    onClose: onCloseLab,
  } = useDisclosure();
  const {
    isOpen: isOpenHospitalization,
    onOpen: onOpenHospitalization,
    onClose: onCloseHospitalization,
  } = useDisclosure();

  const [hospitalizationData, setHospitalizationData] = useState({
    insuranceType: "private",
  });
  const [labData, setLabData] = useState({
    requestType: "",
    testType: "",
    priority: "",
    expectedDate: moment().valueOf(),
    imagingType: "",
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [serialNo, setSerialNo] = useState("");
  const [alreadExistingReport, setAlreadExistingReport] = useState(null);


  useEffect(() => {
    if (UserState.value.data?.centerid) {

      if (page === 'admin') {
        fetchDataForAdmin(UserState.value.data?.centerid);
      } else {
        fetchDataForUser(UserState.value.data.centerid, UserState.value.data.id);
      }

    }
  }, [UserState.value.data]);

  async function fetchDataForUser(id, createdby) {
    await axios
      .post("/api/appointment/getallbyfront", {
        centerid: id,
        createdby: createdby
      })
      .then((response) => {
        setData(response.data);
        if (response.data?.length > 0) {
          const groupedData = response.data?.reduce((acc, current) => {
            const { doctor_id } = current;

            if (doctor_id === null) {
              return acc; // Skip this iteration
            }

            // Check if the doctor_id already exists in the accumulator
            if (!acc[doctor_id]) {
              acc[doctor_id] = [];
            }

            // Push the current object into the array for this doctor_id
            acc[doctor_id].push(current);

            return acc;
          }, {});

          const groupedDataLab = response.data?.reduce((acc, current) => {
            const { lab_id } = current;

            if (lab_id === null) {
              return acc; // Skip this iteration
            }

            // Check if the doctor_id already exists in the accumulator
            if (!acc[lab_id]) {
              acc[lab_id] = [];
            }

            // Push the current object into the array for this doctor_id
            acc[lab_id].push(current);

            return acc;
          }, {});

          // Convert the result back to an array of doctor_id with related data
          const result = Object.keys(groupedData).map((doctor_id) => ({
            doctor_id: parseInt(doctor_id),
            records: groupedData[doctor_id]
          }));
          const labResult = Object.keys(groupedDataLab).map((lab_id) => ({
            lab_id: parseInt(lab_id),
            records: groupedDataLab[lab_id]
          }));
          setAppointmentByDoctor([...result])
          setAppointmentByLab([...labResult])
        }

      })
      .catch((e) => {
        showToastFailed(toast, toastIdRef, "Failed", e?.reponse?.data?.message)
      })
  }

  async function fetchDataForAdmin(id) {
    axios
      .get(`/api/newroutes/healthcare/${id}/admin/appointment`)
      .then((response) => {
        setData(response.data);
        if (response.data?.length > 0) {
          const groupedData = response.data?.reduce((acc, current) => {
            const { doctor_id } = current;

            if (doctor_id === null) {
              return acc; // Skip this iteration
            }

            // Check if the doctor_id already exists in the accumulator
            if (!acc[doctor_id]) {
              acc[doctor_id] = [];
            }

            // Push the current object into the array for this doctor_id
            acc[doctor_id].push(current);

            return acc;
          }, {});

          const groupedDataLab = response.data?.reduce((acc, current) => {
            const { lab_id } = current;

            if (lab_id === null) {
              return acc; // Skip this iteration
            }

            // Check if the doctor_id already exists in the accumulator
            if (!acc[lab_id]) {
              acc[lab_id] = [];
            }

            // Push the current object into the array for this doctor_id
            acc[lab_id].push(current);

            return acc;
          }, {});

          // Convert the result back to an array of doctor_id with related data
          const result = Object.keys(groupedData).map((doctor_id) => ({
            doctor_id: parseInt(doctor_id),
            records: groupedData[doctor_id]
          }));
          const labResult = Object.keys(groupedDataLab).map((lab_id) => ({
            lab_id: parseInt(lab_id),
            records: groupedDataLab[lab_id]
          }));
          setAppointmentByDoctor([...result])
          setAppointmentByLab([...labResult])
        }

      });
  }

  async function handleMarkAsCompleted() {
    await axios.post("/api/update", {
      table: 'appointment',
      columns: ['status'],
      values: ['completed'],
      conditions: {
        column: 'id',
        operator: '=',
        value: selectedAppointment.appointment_id,
      }
    }).then(() => {
      setLoading(false)
      setIsDetaiOpen(!isDetailOpen)
      if (page === 'admin') {
        fetchDataForAdmin(UserState.value.data?.centerid);
      } else {
        fetchDataForUser(UserState.value.data.centerid, UserState.value.data.id);
      }
    }).catch((e) => {
      setLoading(false)
    })
  }

  const toastIdRef = useRef(null);
  const toast = useToast();

  const id = "test-toast";

  useEffect(() => {
    const search = new URLSearchParams(window.location.search).get(
      "appointmentadded"
    );
    if (search === "true" && !toast.isActive(toastIdRef.current)) {
      showToastSuccess(toast, toastIdRef, t("appointmentSuccessfullyScheduled"), t("appointmentSuccessfullyScheduledSubheading"))
    }
  }, []);

  async function handleDeleteAppointment() {
    await axios
      .post("/api/appointment/delete", {
        id: selectedAppointment.appointment_id,
      })
      .then(() => {
        setDeleteLoading(false)
        setIsDetaiOpen(!isDetailOpen);
        const temp = data.filter(
          (item, index) =>
            item.appointment_id !== selectedAppointment.appointment_id
        );
        setData([...temp]);
      }).catch((e) => {
        showToastFailed(toast, toastIdRef, t("Failed"), e?.response?.data?.message || t("Failed"))
      })
  }

  async function handleCreateReportLab() {

    if (
      selectedAppointment?.patient_insurances.length > 0 &&
      JSON.parse(selectedAppointment?.patient_insurances[0]).insuranceexpiry &&
      Number(
        JSON.parse(selectedAppointment?.patient_insurances[0]).insuranceexpiry
      ) > moment().valueOf()
    ) {
    } else {
      showToastFailed(toast, toastIdRef, t("Failed"), t("patientNoInsurance"));
    }
    axios
      .post("/api/settings/get", { id: UserState.value.data?.centerid })
      .then((response) => {
        setAllImagingStudies(response.data?.imagingstudies || []);
        setAllTestType(response.data?.labtest || []);
      });

    let temp = null;
    if (selectedAppointment?.patient_insurances.length > 0) {
      temp = JSON.parse(selectedAppointment?.patient_insurances[0]);
    }
    setHospitalizationData({
      center_name: selectedAppointment?.center_name,
      center_id: selectedAppointment?.centerid.toString(),
      service: "medical center",
      timein: `${moment().format("DD/MM/YYYY")} ${moment().format("hh:mm A")}`,
      timeout: `${moment().format("DD/MM/YYYY")} ${moment().format("hh:mm A")}`,
      numOfDays: "0",
      patient_insuranceprovider: temp ? temp.insuranceprovider : "",
      patient_insurancenumber: temp ? temp.insurancenumber : "",
      patient_firstname: selectedAppointment?.patient_firstname || "",
      patient_lastname: selectedAppointment?.patient_lastname || "",
      patient_dob: selectedAppointment?.patient_dob || "",
      patient_id: selectedAppointment?.patient_id.toString() || "",
      patient_number: selectedAppointment?.patient_number || "",
      insured: JSON.parse(selectedAppointment?.patient_insurances[0])
        .insuranceexpiry
        ? Number(
          JSON.parse(selectedAppointment?.patient_insurances[0])
            .insuranceexpiry
        ) >= moment().valueOf()
          ? true
          : false
        : false,
      insurer_name: "",
      insurer_insurance_number: "",
      doctor_firstname: selectedAppointment?.doctor_firstname || "",
      doctor_lastname: selectedAppointment?.doctor_lastname || "",
      doctor_number: selectedAppointment?.doctor_phone || "",
      doctor_speciality: selectedAppointment?.doctor_speciality
        ? t(selectedAppointment?.doctor_speciality)
        : "",
      doctor_id: selectedAppointment?.doctor_id || "",
      patient_insurancetype:
        JSON.parse(selectedAppointment?.patient_insurances[0])
          .insurancetype || "",
      full: false,
      ald: false,
      exonere: false,
      accident: false,
      pregnancy: false,
    });
    onOpenLab();
  }

  async function handleProceedLab() {
    if (hospitalizationData?.insured) {
      axios
        .get(
          `/api/newroutes/healthcare/${UserState.value.data.centerid}/report/${serialNo}`
        )
        .then(async (response) => {
          if (response.data.data) {
            setAlreadExistingReport(response.data.data);
          } else {
            let temp;
            temp = {
              ...hospitalizationData,
              labtest: selectedAppointment.requestlabtest,
            };

            if (temp?.patient_insurancetype === "private") {
              const url = await CreatePdfLabPrivate(
                "/pdf/CNAMGS-lab-private.pdf",
                "private",
                serialNo,
                temp
              );
            } else {
              const url = await CreatePdfLabPublic(
                "/pdf/CNAMGS-lab-public.pdf",
                "private",
                serialNo,
                temp
              );
            }

            axios.post(
              `/api/newroutes/healthcare/${UserState.value.data.centerid}/report/${serialNo}`,
              {
                data: temp,
                type: "lab",
                appointmentid: selectedAppointment.appointment_id,
                status:
                  temp?.patient_insurancetype == "private"
                    ? "private"
                    : "public",
              }
            );
            onCloseLab();
          }
        });
    } else {
      showToastFailed(toast, toastIdRef, t("Failed"), t("patientNoInsurance"));
    }
  }

  async function handleCreateReportHospitalization() {
    if (
      selectedAppointment?.patient_insurances.length > 0 &&
      JSON.parse(selectedAppointment?.patient_insurances[0]).insuranceexpiry &&
      Number(
        JSON.parse(selectedAppointment?.patient_insurances[0]).insuranceexpiry
      ) > moment().valueOf()
    ) {
      setHospitalizationData({
        center_name: selectedAppointment?.center_name,
        center_id: selectedAppointment?.centerid.toString(),
        service: "medical center",
        timein: `${moment().format("DD/MM/YYYY")} ${moment().format(
          "hh:mm A"
        )}`,
        timeout: `${moment().format("DD/MM/YYYY")} ${moment().format(
          "hh:mm A"
        )}`,
        numOfDays: "0",
        patient_firstname: selectedAppointment?.patient_firstname || "",
        patient_lastname: selectedAppointment?.patient_lastname || "",
        patient_dob: selectedAppointment?.patient_dob || "",
        patient_id: selectedAppointment?.patient_id.toString() || "",
        patient_number: selectedAppointment?.patient_number || "",
        insured: JSON.parse(selectedAppointment?.patient_insurances[0])
          .insuranceexpiry
          ? Number(
            JSON.parse(selectedAppointment?.patient_insurances[0])
              .insuranceexpiry
          ) >= moment().valueOf()
            ? true
            : false
          : false,
        insurer_name: "",
        insurer_insurance_number: "",
        doctor_firstname: selectedAppointment?.doctor_firstname || "",
        doctor_lastname: selectedAppointment?.doctor_lastname || "",
        doctor_number: selectedAppointment?.doctor_phone || "",
        doctor_speciality: selectedAppointment?.doctor_speciality
          ? t(selectedAppointment?.doctor_speciality)
          : "",
        doctor_id: selectedAppointment?.doctor_id || "",
        patient_insurancetype:
          JSON.parse(selectedAppointment?.patient_insurances[0])
            .insurancetype || "",
        full: false,
        ald: false,
        exonere: false,
        accident: false,
        pregnancy: false,
      });
      onOpenHospitalization();
    } else {
      showToastFailed(toast, toastIdRef, t("Failed"), t("patientNoInsurance"));
    }
  }

  async function handleProceedHospitalization() {
    axios
      .get(
        `/api/newroutes/healthcare/${UserState.value.data.centerid}/report/${serialNo}`
      )
      .then(async (response) => {
        if (response.data.data) {
          setAlreadExistingReport(response.data.data);
        } else {
          console.log("not found");
          let temp;
          if (startDate && endDate) {
            const date1 = moment(new Date(startDate));
            const date2 = moment(new Date(endDate));
            const differenceInDays = date2.diff(date1, "days");
            temp = {
              ...hospitalizationData,
              numOfDays: differenceInDays.toString(),
            };
          }

          if (hospitalizationData.patient_insurancetype === "private") {
            const url = await CreatePdfHospitalizationPrivate(
              "/pdf/CNAMGS-hospitalization-private.pdf",
              "private",
              serialNo,
              temp
            );
          } else {
            const url = await CreatePdfHospitalizationPublic(
              "/pdf/CNAMGS-hospitalization-public.pdf",
              "private",
              serialNo,
              temp
            );
          }
          axios.post(
            `/api/newroutes/healthcare/${UserState.value.data.centerid}/report/${serialNo}`,
            {
              data: temp,
              type: "hospitalization",
              appointmentid: selectedAppointment.appointment_id,
              status:
                hospitalizationData.patient_insurancetype == "private"
                  ? "private"
                  : "public",
            }
          );
          onCloseHospitalization();
        }
      });
  }

  const RenderEachRow = ({ item, index }) => {

    return (
      <Tr
        backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}
        _hover={{ cursor: "pointer" }}
        onClick={() => {
          setSelectedAppointment(item);
          setIsDetaiOpen(true);
        }}
      >
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.patient_firstname + " " + item?.patient_lastname}
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
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.doctor_firstname || "" + " " + item?.doctor_lastname || ""}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            {item?.doctor_speciality ? t(item?.doctor_speciality) : ""}
          </div>
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.room_name}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {moment(new Date(Number(item?.appointmentdate))).format("DD/MM/YYYY")}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {moment(new Date(Number(item?.appointmentdate))).format("hh:mm A")}
        </Td>




        <Td>
          <StatusBox item={item?.status} />
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.reason ? `${t(item?.reason)} ${item?.service ? `(${item.service})` : ""}` : ""}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"blue"}>
          {item?.invoiced}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"red"}>
          {item?.patientamount}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"green"}>
          {item?.insuranceamount}
        </Td>
        {page === "admin" && (
          !item?.createdby_firstname ?
            <Td fontSize={"14px"} fontWeight={"400"}>
              {`${t("admin")}`}
            </Td>
            :
            <Td fontSize={"14px"} fontWeight={"400"}>
              {`${item?.createdby_firstname} ${item?.createdby_lastname}`}
            </Td>
        )}
        {/* <Td>
          <HStack>
            <DeleteIcon boxSize={4} color={"red"} _hover={{ opacity: 0.7 }} />
            <Icon as={RxPencil1} boxSize={4} _hover={{ opacity: 0.7 }} />
          </HStack>
        </Td> */}
      </Tr>
    );
  };

  const RenderEachRowDoctor = ({ item, index }) => {

    return (
      <Tr
        backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}
        _hover={{ cursor: "pointer" }}
        onClick={() => {
          setSelectedAppointment(item);
          setIsDetaiOpen(true);
        }}
      >
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.patient_firstname + " " + item?.patient_lastname}
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
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.room_name}
        </Td>
        {/* <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.doctor_firstname + " " + item.doctor_lastname}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            {t(item?.doctor_speciality)}
          </div>
        </Td> */}
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {moment(new Date(Number(item?.appointmentdate))).format("DD/MM/YYYY")}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {moment(new Date(Number(item?.appointmentdate))).format("hh:mm A")}
        </Td>




        <Td>
          <StatusBox item={item?.status} />
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.reason ? t(item?.reason) : ""}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"blue"}>
          {item?.invoiced}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"red"}>
          {item?.patientamount}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"green"}>
          {item?.insuranceamount}
        </Td>
        {page === "admin" && (
          !item?.createdby_firstname ?
            <Td fontSize={"14px"} fontWeight={"400"}>
              {`${t("admin")}`}
            </Td>
            :
            <Td fontSize={"14px"} fontWeight={"400"}>
              {`${item?.createdby_firstname} ${item?.createdby_lastname}`}
            </Td>
        )}
        {/* <Td>
          <HStack>
            <DeleteIcon boxSize={4} color={"red"} _hover={{ opacity: 0.7 }} />
            <Icon as={RxPencil1} boxSize={4} _hover={{ opacity: 0.7 }} />
          </HStack>
        </Td> */}
      </Tr>
    );
  };

  const RenderEachRowLab = ({ item, index }) => {

    return (
      <Tr
        backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}
        _hover={{ cursor: "pointer" }}
        onClick={() => {
          setSelectedAppointment(item);
          setIsDetaiOpen(true);
        }}
      >
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.patient_firstname + " " + item?.patient_lastname}
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
          {item?.doctor_firstname + " " + item.doctor_lastname}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            {t(item?.doctor_speciality)}
          </div>
        </Td> */}
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {moment(new Date(Number(item?.appointmentdate))).format("DD/MM/YYYY")}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {moment(new Date(Number(item?.appointmentdate))).format("hh:mm A")}
        </Td>




        <Td>
          <StatusBox item={item?.status} />
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.reason ? t(item?.reason) : ""}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"blue"}>
          {item?.invoiced}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"red"}>
          {item?.patientamount}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"green"}>
          {item?.insuranceamount}
        </Td>
        {page === "admin" && (
          !item?.createdby_firstname ?
            <Td fontSize={"14px"} fontWeight={"400"}>
              {`${t("admin")}`}
            </Td>
            :
            <Td fontSize={"14px"} fontWeight={"400"}>
              {`${item?.createdby_firstname} ${item?.createdby_lastname}`}
            </Td>
        )}
        {/* <Td>
          <HStack>
            <DeleteIcon boxSize={4} color={"red"} _hover={{ opacity: 0.7 }} />
            <Icon as={RxPencil1} boxSize={4} _hover={{ opacity: 0.7 }} />
          </HStack>
        </Td> */}
      </Tr>
    );
  };

  const sideLinks = GetLinkItems(page);
  return (
    <Sidebar LinkItems={sideLinks} settingsLink={page == 'admin' ? "/admin/settings" : null}>
      <Flex
        flex={1}
        gap={"50px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <Text color={colorMode === 'dark' && 'gray.300'} variant="heading"> {t("dashboard")}</Text>
        {data.length == 0 ? (
          <VStack spacing={5}>
            <Image
              width={"315px"}
              height={"210px"}
              src="/assets/Calendar-pana-1.png"
            />
            <Text color={colorMode === 'dark' && 'gray.300'} fontWeight={"600"} fontSize={"30px"}>
              {t("noAppointmentScheduled")}
            </Text>
            <div style={{ width: "70%" }}>
              <Text
                fontSize={"16px"}
                fontWeight={"400"}
                color={theme.text.secondary}
                textAlign={"center"}
              >
                {t("noAppointmentScheduledSubheading")}
              </Text>
            </div>
            <Link
              href={`${pathname}/newentry`}
              style={{ minWidth: "350px" }}
            >
              <Button leftIcon={<AddIcon marginTop={"-2px"} />} width={"100%"}>
                {t("newEntry")}
              </Button>
            </Link>
          </VStack>
        ) : (
          <>
            <Box
              width={"100%"}
              border={"1px solid"}
              borderColor={bdColor}
              borderRadius={5}
            >
              <HStack justify={"space-between"} width={"100%"} p={5}>
                <div style={{ display: "flex", width: '100%', maxWidth: '700px' }}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={CiSearch} boxSize={5} color="#667085" />
                    </InputLeftElement>
                    <Input
                      bg={bgColor}
                      borderColor={bdColor}
                      placeholder={t("search")}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
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
                        <Text color={colorMode === 'dark' && 'gray.300'} ml={2} variant="subheading">
                          {selectedOption == 0
                            ? t("patient")
                            : selectedOption == 1
                              ? t("doctor")
                              : t("filter")}
                        </Text>
                      </Box>
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setSelectedOption(0)}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"}>{t("patient")}</Text>
                      </MenuItem>
                      <MenuItem onClick={() => setSelectedOption(1)}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"}>{t("doctor")}</Text>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
                <div>
                  <Link href={`${pathname}/newentry`}>
                    <Button leftIcon={<AddIcon marginTop={"-2px"} />}>
                      {t("newEntry")}
                    </Button>
                  </Link>
                </div>
              </HStack>
              <Box width={"100%"}>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        {[
                          t("patient"),
                          t("doctor"),
                          t("room"),
                          t("date"),
                          t("time"),
                          t("status"),
                          t("reason"),
                          t("invoiced"),
                          t("paidByPatient"),
                          t("insuranceCovered"),
                          page === 'admin' && t("createdBy")
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
                      {data.length > 0 && selectedOption == 1
                        ? data.sort((a, b) => Number(a?.appointmentdate) - Number(b?.appointmentdate)).filter((item) => {
                          const string =
                            item.doctor_firstname + " " + item.doctor_lastname;
                          if (string.toLocaleLowerCase().includes(search)) {
                            return item;
                          }
                        }).map((item, index) => (
                          moment(new Date(Number(item?.appointmentdate))).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY") &&
                          <RenderEachRow
                            key={index}
                            item={item}
                            index={index}
                          />
                        ))
                        : selectedOption == 0
                          ? data.sort((a, b) => Number(a?.appointmentdate) - Number(b?.appointmentdate)).filter((item) => {
                            const string =
                              item.patient_firstname + " " + item.patient_lastname;
                            if (string.toLocaleLowerCase().includes(search)) {
                              return item;
                            }
                          }).map((item, index) => (
                            moment(new Date(Number(item?.appointmentdate))).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY") &&
                            <RenderEachRow
                              key={index}
                              item={item}
                              index={index}
                            />
                          ))
                          : data.sort((a, b) => Number(a?.appointmentdate) - Number(b?.appointmentdate)).map((item, index) => (
                            moment(new Date(Number(item?.appointmentdate))).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY") &&
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
            {appointmentByDoctor.length > 0 &&
              appointmentByDoctor.map((eachApp, ind) => (
                eachApp.records.length > 0 && eachApp.records.filter((item) => moment(new Date(Number(item?.appointmentdate))).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY")).length > 0 &&
                <Box
                  key={ind}
                  width={"100%"}
                  border={"1px solid"}
                  borderColor={bdColor}
                  borderRadius={5}
                >
                  <Text color={colorMode === 'dark' && 'gray.300'} mt={'20px'} mb={'10px'} ml={5} variant={'heading'}>{"Dr. " + eachApp.records[0].doctor_firstname + " " + eachApp.records[0].doctor_lastname}</Text>

                  <Box width={"100%"} >

                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            {[
                              t("patient"),
                              // t("doctor"),
                              t("room"),
                              t("date"),
                              t("time"),
                              t("status"),
                              t("reason"),
                              t("invoiced"),
                              t("paidByPatient"),
                              t("insuranceCovered"),
                              page === 'admin' && t('createdBy')
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
                          {eachApp.records.length > 0 && eachApp.records.sort((a, b) => Number(a?.appointmentdate) - Number(b?.appointmentdate)).map((item, index) => (
                            moment(new Date(Number(item?.appointmentdate))).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY") &&
                            <RenderEachRowDoctor
                              key={index}
                              item={item}
                              index={index}
                            />
                          ))
                          }
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
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">
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
              ))}


            {appointmentByLab.length > 0 &&
              appointmentByLab.map((eachApp, ind) => (
                eachApp.records.length > 0 && eachApp.records.filter((item) => moment(new Date(Number(item?.appointmentdate))).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY")).length > 0 &&
                <Box
                  key={ind}
                  width={"100%"}
                  border={"1px solid"}
                  borderColor={bdColor}
                  borderRadius={5}
                >
                  <Text color={colorMode === 'dark' && 'gray.300'} mt={'20px'} mb={'10px'} ml={5} variant={'heading'}>{eachApp.records[0].lab_firstname + " " + eachApp.records[0].lab_lastname + " (" + t(eachApp.records[0].lab_speciality) + ")"}</Text>

                  <Box width={"100%"} >

                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            {[
                              t("patient"),
                              // t("doctor"),
                              t("date"),
                              t("time"),
                              t("status"),
                              t("reason"),
                              t("invoiced"),
                              t("paidByPatient"),
                              t("insuranceCovered"),
                              page === 'admin' && t('createdBy')
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
                          {eachApp.records.length > 0 && eachApp.records.sort((a, b) => Number(a?.appointmentdate) - Number(b?.appointmentdate)).map((item, index) => (
                            moment(new Date(Number(item?.appointmentdate))).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY") &&
                            <RenderEachRowLab
                              key={index}
                              item={item}
                              index={index}
                            />
                          ))
                          }
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
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">
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
              ))}

          </>
        )

        }

      </Flex>

      {isDetailOpen && (
        <Box
          flex={1}
          width={"100%"}
          bg={"#344054B2"}
          display={"flex"}
          minH={"100vh"}
          height={"100%"}
          overflowY={"auto"}
          justifyContent={"flex-end"}
          position={"absolute"}
          right={0}
        >
          <Box
            h={"100vh"}
            pos={"fixed"}
            right={0}
            width={"512px"}
            overflowY={"auto"}
            bg={bgColor}
            p={"30px"}
            onClick={() => { }}
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
                  onClick={() => setIsDetaiOpen(false)}
                  _hover={{ cursor: "pointer", opacity: 0.7 }}
                />
              </div>
              <HStack width={"100%"} justifyContent={"space-between"}>
                <Text
                  color={colorMode === "dark" ? "gray.300" : "#101828"}
                  fontSize={"20px"}
                  fontWeight={"500"}
                >
                  {t("appointmentDetails")}
                </Text>
                <HStack>
                  {page === "nurse" &&
                    selectedAppointment?.reason === "nursing" && (
                      <Button
                        isDisabled={!selectedAppointment?.appointment_id}
                        isLoading={completedLoading}
                        mr={3}
                        onClick={() => {
                          setCompletedLoading(true);
                          handleMarkAsCompleted(
                            selectedAppointment?.appointment_id
                          );
                        }}
                        size="sm"
                      >
                        {t("markAsComplete")}
                      </Button>
                    )}
                  {/* <Button
                    onClick={() => handleDeleteAppointment()}
                    size="sm"
                    borderColor="#FDA29B"
                    backgroundColor="#FFFFFF"
                    color="#B42318"
                    border="1px solid"
                  >
                    {t("delete")}
                  </Button> */}

                  {selectedAppointment.status === "labtestrequested" && (
                    <Button
                      isLoading={completedLoading}
                      size="sm"
                      onClick={() => {
                        setCompletedLoading(true);
                        handleMarkAsCompleted(
                          selectedAppointment?.appointment_id
                        );
                      }}
                    >
                      {t("markAsComplete")}
                    </Button>
                  )}
                </HStack>
              </HStack>
              <Text
                color={colorMode === "dark" && "gray.300"}
                variant={"subheading"}
                fontSize={"16px"}
              >
                {t("appointmentInformation")}
              </Text>
              <HStack alignItems={"flex-start"}>
                <div style={{ width: "170px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant="subheading"
                    fontSize={"14px"}
                  >
                    {t("status")}
                  </Text>
                </div>
                <VStack spacing={5} alignItems={"flex-start"}>
                  <VStack spacing={0} alignItems={"flex-start"}>
                    <Text
                      color={colorMode === "dark" && "gray.300"}
                      variant="description"
                      fontSize={"14px"}
                    >
                      {t("modality")}:
                    </Text>
                    <Text
                      color={colorMode === "dark" && "gray.300"}
                      variant="subheading"
                      fontSize={"14px"}
                    >
                      {t(selectedAppointment?.status)}
                    </Text>
                  </VStack>
                  <VStack spacing={0} alignItems={"flex-start"}>
                    <Text
                      color={colorMode === "dark" && "gray.300"}
                      variant="description"
                      fontSize={"14px"}
                    >
                      {t("dateAndTime")}:
                    </Text>
                    <Text
                      color={colorMode === "dark" && "gray.300"}
                      variant="subheading"
                      fontSize={"14px"}
                    >
                      {moment(
                        new Date(Number(selectedAppointment?.appointmentdate))
                      ).format("DD MMM YYYY, HH:00 A")}
                    </Text>
                  </VStack>
                  <VStack spacing={0} alignItems={"flex-start"}>
                    <Text
                      color={colorMode === "dark" && "gray.300"}
                      variant="description"
                      fontSize={"14px"}
                    >
                      {t("bodyPart")}:
                    </Text>
                    <Text
                      color={colorMode === "dark" && "gray.300"}
                      variant="subheading"
                      fontSize={"14px"}
                    >
                      {selectedAppointment?.reason}
                    </Text>
                  </VStack>
                  {/* <VStack spacing={0} alignItems={"flex-start"}>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant="description" fontSize={"14px"}>
                      {t("protocol")}:
                    </Text>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading" fontSize={"14px"}>
                      T1-weighted and T2-weighted
                    </Text>
                  </VStack> */}
                </VStack>
              </HStack>

              <HStack
                alignItems={"flex-start"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <div style={{ width: "150px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant="subheading"
                    fontSize={"14px"}
                    mt={2}
                  >
                    {t("date")}
                  </Text>
                </div>

                <Input
                  onChange={(e) => { }}
                  value={moment(
                    new Date(Number(selectedAppointment?.appointmentdate))
                  ).format("DD MMM YYYY")}
                  maxW={"280px"}
                />
              </HStack>
              <HStack
                alignItems={"flex-start"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <div style={{ width: "150px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    width={"100px"}
                    variant="subheading"
                    fontSize={"14px"}
                    mt={2}
                  >
                    {t("time")}
                  </Text>
                </div>
                <Input
                  onChange={(e) => { }}
                  value={moment(
                    new Date(Number(selectedAppointment?.appointmentdate))
                  ).format("HH:00")}
                  maxW={"280px"}
                />
              </HStack>
              <HStack
                alignItems={"flex-start"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <div style={{ width: "150px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    width={"100px"}
                    variant="subheading"
                    fontSize={"14px"}
                    mt={2}
                  >
                    {t("doctor")}
                  </Text>
                </div>
                <Input
                  onChange={(e) => { }}
                  value={`${selectedAppointment?.doctor_firstname} (${selectedAppointment?.doctor_speciality})`}
                  maxW={"280px"}
                />
              </HStack>
              <HStack
                alignItems={"flex-start"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <div style={{ width: "150px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    width={"100px"}
                    variant="subheading"
                    fontSize={"14px"}
                    mt={2}
                  >
                    {t("room")}
                  </Text>
                </div>
                <Input
                  onChange={(e) => { }}
                  value={selectedAppointment?.doctor_firstname}
                  maxW={"280px"}
                />
              </HStack>
              <Divider color={theme.divider.primary} />
              <Text
                color={colorMode === "dark" && "gray.300"}
                variant={"subheading"}
                fontSize={"16px"}
              >
                {t("patientInformation")}
              </Text>
              <HStack
                alignItems={"flex-start"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <div style={{ width: "150px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    width={"100px"}
                    variant="subheading"
                    fontSize={"14px"}
                    mt={2}
                  >
                    {t("patient")}
                  </Text>
                </div>
                <Input
                  onChange={(e) => { }}
                  value={selectedAppointment?.patient_firstname}
                  maxW={"280px"}
                />
              </HStack>
              <HStack
                alignItems={"flex-start"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <div style={{ width: "150px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    width={"100px"}
                    variant="subheading"
                    fontSize={"14px"}
                    mt={2}
                  >
                    {t("phoneNumber")}
                  </Text>
                </div>
                <Input
                  onChange={(e) => { }}
                  value={selectedAppointment?.patient_number}
                  maxW={"280px"}
                />
              </HStack>
              {selectedAppointment?.status === "labtestrequested" && (
                <>
                  <Divider color={theme.divider.primary} />
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                    fontSize={"16px"}
                  >
                    {t("medicalTest")}
                  </Text>

                  <Box
                    borderRadius={"6px"}
                    w={"100%"}
                    border={"1px solid"}
                    borderColor={"#CCCCCC"}
                    p={5}
                    bg={"white"}
                  >
                    <UnorderedList
                      fontSize={"14px"}
                      fontWeight={"500"}
                      color={"#344054"}
                    >
                      {selectedAppointment?.requestlabtest.length > 0 &&
                        selectedAppointment?.requestlabtest.map(
                          (item, index) => {
                            const parseData = JSON.parse(item);
                            return (
                              <ListItem key={index}>
                                {`${parseData.name} (${t(parseData.type)})`}
                              </ListItem>
                            );
                          }
                        )}
                    </UnorderedList>
                  </Box>
                  {/* <Button onClick={() => handleCreateReportLab()}>
                    Generate Lab Report
                  </Button> */}
                </>
              )}

              <Menu>
                <MenuButton
                  fontSize={"14px"}
                  fontWeight={"400"}
                  as={ChakraButton}
                  colorScheme={"teal"}
                >
                  {t("generateReport")}
                </MenuButton>
                <Portal>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setSerialNo("");
                        setAlreadExistingReport(null);
                        handleCreateReportHospitalization();
                      }}
                    >
                      {t("hospitalization")}
                    </MenuItem>

                    {selectedAppointment?.status === "labtestrequested" && (
                      <MenuItem
                        onClick={() => {
                          setSerialNo("");
                          setAlreadExistingReport(null);
                          handleCreateReportLab();
                        }}
                      >
                        {t("labTest")}
                      </MenuItem>
                    )}
                  </MenuList>
                </Portal>
              </Menu>
            </VStack>
          </Box>
        </Box>
      )}

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onCloseLab}
        isOpen={isOpenLab}
        isCentered
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent maxH={"95%"} overflowY={"auto"}>
          <AlertDialogHeader>
            <Text color={colorMode === "dark" && "gray.300"} variant="heading">
              {" "}
              {t("addNewRequest")}
            </Text>
            {/* <AlertIcon icon={IoMicOutline} /> */}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody mb={5}>
            <VStack alignItems={"flex-start"} width={"100%"} spacing={5}>
              <VStack align={"flex-start"} width={"100%"}>
                <Input
                  placeholder={t("serialNo")}
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                />

                {alreadExistingReport && (
                  <Text
                    _hover={{ color: "blue", cursor: "pointer" }}
                    variant={"description"}
                    color={"red"}
                    onClick={() => {
                      handleOpenReport(alreadExistingReport);
                    }}
                  >
                    Sr {alreadExistingReport.serialno}{" "}
                    {t("alreadyExistForAppointment")}{" "}
                    {alreadExistingReport.appointmentid}
                  </Text>
                )}

                <div>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("expectedDate")}
                  </Text>
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
                  _hover={{ borderColor: bdColor }}
                  _focusWithin={{
                    boxShadow: `0px 0px 3px 3px ${bdColor}`,
                    borderColor: bdColor,
                  }}
                  position={"relative"}
                >
                  <Calendar
                    className="custom-datepicker"
                    value={moment(labData.expectedDate).toDate()}
                    onChange={(e) => {
                      setLabData((prevState) => {
                        const newState = { ...prevState };
                        newState.expectedDate = moment(e.value)
                          .startOf("day")
                          .valueOf();
                        return newState;
                      });
                    }}
                  />
                  <Icon as={CiCalendar} size={20} />
                </Box>
              </VStack>
            </VStack>

            <Text
              color={colorMode === "dark" && "gray.300"}
              variant={"subheading"}
              fontSize={"16px"}
              mt={4}
            >
              {t("extraConditions")}
            </Text>
            <VStack alignItems={"flex-start"} gap={5} mt={5}>
              <Checkbox
                value={hospitalizationData?.accident}
                onChange={(e) =>
                  setHospitalizationData((prevState) => {
                    return { ...prevState, accident: e.target.checked };
                  })
                }
              >
                {t("accident")}
              </Checkbox>
              <Checkbox
                value={hospitalizationData?.accident}
                onChange={(e) =>
                  setHospitalizationData((prevState) => {
                    return { ...prevState, pregnancy: e.target.checked };
                  })
                }
              >
                {t("pregnancy")}
              </Checkbox>
              <Checkbox
                value={hospitalizationData?.accident}
                onChange={(e) =>
                  setHospitalizationData((prevState) => {
                    return { ...prevState, full: e.target.checked };
                  })
                }
              >
                Plein
              </Checkbox>
              <Checkbox
                value={hospitalizationData?.accident}
                onChange={(e) =>
                  setHospitalizationData((prevState) => {
                    return { ...prevState, ald: e.target.checked };
                  })
                }
              >
                ALD
              </Checkbox>
              <Checkbox
                value={hospitalizationData?.exonere}
                onChange={(e) =>
                  setHospitalizationData((prevState) => {
                    return { ...prevState, exonere: e.target.checked };
                  })
                }
              >
                Exonere
              </Checkbox>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <GhostButton onClick={onCloseLab}>{t("cancel")}</GhostButton>
            <Button
              isDisabled={!serialNo}
              ml={3}
              onClick={() => {
                handleProceedLab();
              }}
            >
              {t("proceed")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onCloseHospitalization}
        isOpen={isOpenHospitalization}
        isCentered
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent>
          <AlertDialogHeader>
            {/* <AlertIcon icon={IoMicOutline} /> */}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody mb={5}>
            <Text
              color={colorMode === "dark" && "gray.300"}
              variant={"subheading"}
              fontSize={"16px"}
            >
              {t("extraConditions")}
            </Text>
            <VStack alignItems={"flex-start"} gap={5} mt={5}>
              <Input
                placeholder={t("serialNo")}
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
              />
              {alreadExistingReport && (
                <Text
                  _hover={{ color: "blue", cursor: "pointer" }}
                  variant={"description"}
                  color={"red"}
                  onClick={() => {
                    handleOpenReport(alreadExistingReport);
                  }}
                >
                  Sr {alreadExistingReport.serialno}{" "}
                  {t("alreadyExistForAppointment")}{" "}
                  {alreadExistingReport.appointmentid}
                </Text>
              )}
              <Checkbox
                value={hospitalizationData?.accident}
                onChange={(e) =>
                  setHospitalizationData((prevState) => {
                    return { ...prevState, accident: e.target.checked };
                  })
                }
              >
                {t("accident")}
              </Checkbox>
              <Checkbox
                value={hospitalizationData?.accident}
                onChange={(e) =>
                  setHospitalizationData((prevState) => {
                    return { ...prevState, pregnancy: e.target.checked };
                  })
                }
              >
                {t("pregnancy")}
              </Checkbox>
              <Checkbox
                value={hospitalizationData?.accident}
                onChange={(e) =>
                  setHospitalizationData((prevState) => {
                    return { ...prevState, full: e.target.checked };
                  })
                }
              >
                Plein
              </Checkbox>
              <Checkbox
                value={hospitalizationData?.accident}
                onChange={(e) =>
                  setHospitalizationData((prevState) => {
                    return { ...prevState, ald: e.target.checked };
                  })
                }
              >
                ALD
              </Checkbox>
              <Checkbox
                value={hospitalizationData?.exonere}
                onChange={(e) =>
                  setHospitalizationData((prevState) => {
                    return { ...prevState, exonere: e.target.checked };
                  })
                }
              >
                Exonere
              </Checkbox>
              <VStack align={"flex-start"} gap={0}>
                <div>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("startDate")}
                  </Text>
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
                    id="start-time"
                    showTime
                    hourFormat="12"
                    dateFormat="dd/mm/yy"
                    className="custom-datepicker"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.value);
                      setHospitalizationData((prevState) => {
                        return {
                          ...prevState,
                          timein: `${moment(new Date(e.value)).format(
                            "DD/MM/YYYY"
                          )} ${moment(new Date(e.value)).format("hh:mm A")}`,
                        };
                      });
                    }}
                  />

                  <Icon as={CiCalendar} size={20} />
                </Box>
              </VStack>
              <VStack align={"flex-start"} gap={0}>
                <div>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("endDate")}
                  </Text>
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
                    id="end-time"
                    showTime
                    hourFormat="12"
                    dateFormat="dd/mm/yy"
                    className="custom-datepicker"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.value);
                      setHospitalizationData((prevState) => {
                        return {
                          ...prevState,
                          timeout: `${moment(new Date(e.value)).format(
                            "DD/MM/YYYY"
                          )} ${moment(new Date(e.value)).format("hh:mm A")}`,
                        };
                      });
                    }}
                  />

                  <Icon as={CiCalendar} size={20} />
                </Box>
              </VStack>
              {!hospitalizationData?.insured && (
                <>
                  <VStack align={"flex-start"} w={"100%"}>
                    <Text
                      color={colorMode === "dark" && "gray.300"}
                      variant={"subheading"}
                    >
                      {t("insurer")}
                    </Text>
                    <Input
                      value={hospitalizationData.insurer_name}
                      onChange={(e) =>
                        setHospitalizationData((prevState) => {
                          return {
                            ...prevState,
                            insurer_name: e.target.value,
                          };
                        })
                      }
                    />
                  </VStack>
                  <VStack align={"flex-start"} w={"100%"}>
                    <Text
                      color={colorMode === "dark" && "gray.300"}
                      variant={"subheading"}
                    >
                      {t("insurerNumber")}
                    </Text>
                    <Input
                      value={hospitalizationData.insurer_insurance_number}
                      onChange={(e) =>
                        setHospitalizationData((prevState) => {
                          return {
                            ...prevState,
                            insurer_insurance_number: e.target.value,
                          };
                        })
                      }
                    />
                  </VStack>
                </>
              )}
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <GhostButton onClick={onCloseHospitalization}>
              {t("cancel")}
            </GhostButton>
            <Button
              isDisabled={!serialNo}
              ml={3}
              onClick={() => {
                handleProceedHospitalization();
              }}
            >
              {t("proceed")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </Sidebar>
  );
}

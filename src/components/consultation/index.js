"use client";
import Button, { DangerButton, GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import {
    AddIcon,
    ArrowBackIcon,
    DeleteIcon,
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
    Wrap,
    WrapItem,
    Spacer,
    Center,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    ModalBody,
    MenuList,
    MenuItem,
    Portal,
    useColorModeValue,
    useColorMode,
} from "@chakra-ui/react";
import { Button as ChakraButton } from '@chakra-ui/react'
import {
    IoMicOutline,
} from "react-icons/io5";
import {
    HiMiniArrowUturnRight,

} from "react-icons/hi2";
import { useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    IoMdCheckboxOutline,
} from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import PrescriptionCard from "@/components/ui/prescriptionCard";
import { BsStars } from "react-icons/bs";
import Checkbox from "@/components/ui/Checkbox";
import { useTranslations } from "next-intl";
import { GrExpand, GrContract } from "react-icons/gr";
import moment from "moment";
import Lottie from "lottie-react";
import animationData from "../../../public/animation.json";
import { UserContext } from "@/store/context/UserContext";
import axios from "@/lib/axiosInstance";
import DoctorChatComponent from "@/components/chat/DoctorChatComponent";
import PrescriptionBox from "@/components/ui/PrescriptionBox";
import StreamCallComponenet from "@/components/StreamVideo/StreamCallComponent";
import AlertIcon from "@/components/ui/AlertIcon";
import { CreatePdf, CreatePdfNoInsurance } from "@/functions/createPDF";
import downloadReferal from "@/functions/referalPDF";
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils";
import { formatNumber } from "@/functions/formatNumber";
import handleOpenReport from "@/functions/existingReport";

export default function Component({ page }) {
    const t = useTranslations("Dictionary");

    const pathname = usePathname();
    const toastIdRef = useRef(null);
    const toast = useToast();
    const [selectedOption, setSelectedOption] = useState(1);
    const [medLoading, setMedLoading] = useState(false);
    const [recordingComplete, setRecordingComplete] = useState(false);
    const [medicalRecordData, setMedicalRecordData] = useState([]);
    const [prescriptionData, setPrescriptionData] = useState([]);
    const [finishLoading, setFinishLoading] = useState(false);
    const [referalData, setReferalData] = useState({
        reason: "",
        symptoms: "",
        present: "",
        past: "",
        diagnosis: "",
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isOpenCall,
        onOpen: onOpenCall,
        onClose: onCloseCall,
    } = useDisclosure();

    const {
        isOpen: isOpenAI,
        onOpen: onOpenAI,
        onClose: onCloseAI,
    } = useDisclosure();

    const {
        isOpen: isOpenPreview,
        onOpen: onOpenPreview,
        onClose: onClosePreview,
    } = useDisclosure();

    const {
        isOpen: isOpenFinishConsultation,
        onOpen: onOpenFinishConsultation,
        onClose: onCloseFinishConsultation,
    } = useDisclosure();

    const cancelRefAI = useRef();
    const [micPressed, setMicPressed] = useState(false);
    const [continueStep, setContinueStep] = useState(0);
    const [diagnosis, setDiagnosis] = useState("");
    const [prescription, setPrescription] = useState([]);
    const [medicinePrescriptionCompleted, setMedicinePrescriptionCompleted] =
        useState(false);
    const [diagnosisList, setDiagnosisList] = useState([
        {
            value: "",
        },
    ]);
    const [mainForm, setMainForm] = useState({
        complaint: "",
        history: "",
        examination: "",
        patient: "",
        doctor: "",
        notes: ""
    });

    const [consultationType, setConsultationType] = useState("inPerson");
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const { state: UserState } = useContext(UserContext);
    const [selectedAppointment, setSelectedAppointment] = useState();
    const [audioUrl, setAudioUrl] = useState("");
    const {
        isOpen: isOpenRecord,
        onClose: onCloseRecord,
        onOpen: onOpenRecord,
    } = useDisclosure();
    const [fallback, setFallback] = useState();
    const router = useRouter()
    const { isOpen: isOpenPrescription, onOpen: onOpenPrescription, onClose: onClosePrescription } = useDisclosure();

    const [testOption, setTestOption] = useState("")
    const [allTestType, setAllTestType] = useState([]);
    const [medicalTest, setMedicalTest] = useState([])
    const [alreadExistingReport, setAlreadExistingReport] = useState(null)
    const { isOpen: isOpenMedicalTest, onOpen: onOpenMedicalTest, onClose: onCloseMedicalTest } = useDisclosure();
    const { colorMode } = useColorMode()
    const [serialNo, setSerialNo] = useState("")
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
    const bdColor2 = useColorModeValue("#CCCCCC", "#4a5568")
    const bgColor = useColorModeValue("#FFFFFF", "gray.800")
    const bgColor2 = useColorModeValue("#F9FAFB", "gray.700")
    const bgColor3 = useColorModeValue("white", "transparent")
    const bgColor4 = useColorModeValue("#EFF4FF", "gray.500")
    const colorTxt1 = useColorModeValue("#667085", "gray.300")



    useEffect(() => {
        if (UserState.value.data?.centerid) {
            const search = new URLSearchParams(window.location.search).get(
                "id"
            );
            if (search) {
                fetchData(Number(search))
                fetchLabData(UserState.value.data.centerid)
            }
        }

    }, [UserState.value.data]);

    async function fetchLabData(id) {
        axios.post("/api/settings/get", { id: id }).then((response) => {
            setAllTestType(response.data?.labtest || []);
        });
    }

    async function fetchData(id) {

        await axios
            .post("/api/doctor/appointment/getsingle", {
                id: id,
            })
            .then((response) => {
                if (response.data) {
                    setSelectedAppointment(response.data);
                    if (response.data.medicalRecords.length > 0) {
                        setMedicalRecordData(response.data.medicalRecords);
                        let temp = [];
                        response.data.medicalRecords.map((eachRecord) => {
                            let temp1 = [];
                            eachRecord.prescription.map((each) => {
                                temp1.push(JSON.parse(each));
                            });
                            temp.push({
                                diagnosis: eachRecord.diagnosis,
                                prescription: [...temp1],
                            });
                        });
                        setPrescriptionData([...temp]);
                    }
                }

            });
    }

    async function fetchPrescription() {
        const response = await fetch("/api/prescription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                complaint: mainForm.complaint,
                medicalHistory: mainForm.history,
                examinationFindings: mainForm.examination,
            }),
        });

        const data = await response.json();
        setDiagnosis(data?.diagnosis);
        setPrescription(data?.prescription);
    }

    async function sendRecordingToAI(audioUrl) {
        try {
            // Fetch the audio file from the URL
            const response = await fetch(audioUrl);

            // Ensure the response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Read the response as an ArrayBuffer
            const arrayBuffer = await response.arrayBuffer();

            // Create a Blob from the ArrayBuffer with the correct MIME type
            const contentType = response.headers.get("content-type"); // Get the correct content type from response headers
            const supportedMimeTypes = [
                "audio/flac",
                "audio/m4a",
                "audio/mp3",
                "audio/mp4",
                "audio/mpeg",
                "audio/mpga",
                "audio/oga",
                "audio/ogg",
                "audio/wav",
                "audio/webm",
            ];

            if (!supportedMimeTypes.includes(contentType)) {
                throw new Error(
                    `Invalid file format: ${contentType}. Supported formats: ${supportedMimeTypes.join(
                        ", "
                    )}`
                );
            }

            const audioBlob = new Blob([arrayBuffer], { type: contentType });

            try {
                const uploadResponse = await fetch("/api/voicetotext", {
                    method: "POST",
                    body: audioBlob,
                });

                if (uploadResponse.ok) {
                    const json = await uploadResponse.json();

                    setMainForm({
                        complaint: json.complaint,
                        examination: json.examinationFindings,
                        history: json.history,
                        patient: json.patient,
                        doctor: json.doctor,
                    });
                } else {
                    console.error("Error uploading file:", uploadResponse.statusText);
                    onClose();
                }
            } catch (error) {
                console.error("Error during upload:", error);
                onClose();
            }
        } catch (error) {
            console.error("Failed to create or upload audio Blob:", error);
            onClose();
        }
    }

    async function handleFileUpload(event) {
        if (!audioBlob) {
            console.error("No audio recorded");
            return;
        }

        try {
            const response = await fetch("/api/voicetotext", {
                method: "POST",
                body: audioBlob,
            });

            if (response.ok) {
                const json = await response.json();

                setMainForm({
                    complaint: json.complaint,
                    examination: json.examinationFindings,
                    history: json.history,
                    patient: json.patient,
                    doctor: json.doctor,
                });
            } else {
                console.error("Error uploading file:", response.statusText);
                onClose();
            }
        } catch (error) {
            console.error("Error:", error);
            onClose();
        }
    }

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                setAudioBlob(event.data); // Store the audio blob
            };

            mediaRecorder.start();


            mediaRecorder.onstop = () => {
                stream.getTracks().forEach((track) => track.stop());
            };
        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    async function handlePrescribeMedicine() {
        await axios
            .post("/api/insert", {
                table: "medicalrecord",
                columns: ["centerid", "appointmentid", "patientid", "created", 'diagnosis', 'prescription', 'type', 'note', 'complaint', 'history', 'examination'],
                values: [
                    UserState.value.data.centerid,
                    selectedAppointment.id,
                    selectedAppointment.patient_id,
                    new Date().getTime(),
                    diagnosis,
                    prescription,
                    selectedAppointment?.type,
                    mainForm.notes,
                    mainForm.complaint,
                    mainForm.history,
                    mainForm.examination
                ],
            })
            .then((response) => {
                onClosePreview();
                setMedLoading(false);
                setFallback(response.data);
                showToastSuccess(toast, toastIdRef, t("medicineSuccessfullyPrescribed"), t("medicineSuccessfullyPrescribedSubheading"))
                setMedicinePrescriptionCompleted(true);
            })
            .catch((e) => {
                setMedLoading(false);
            });
    }



    async function handleFinishConsultation() {

        await axios.post("/api/update", {
            table: 'appointment',
            columns: ['status', 'notes', 'endtime', "requestlabtest"],
            values: [medicalTest.length == 0 ? 'completed' : 'labtestrequested', mainForm.notes, moment().valueOf(), medicalTest],
            conditions: {
                column: 'id',
                operator: '=',
                value: selectedAppointment.id,
            }
        })
            .then((response) => {
                setFinishLoading(false);
                onCloseFinishConsultation();
                showToastSuccess(toast, toastIdRef, t("consultationSuccessfullyFinished"), t("consultationSuccessfullyFinishedSubheading"))
                setTimeout(() => {
                    router.push(`${pathname.replace(/\/[^\/]*$/, "")}`)
                }, 3000)
            })
            .catch((e) => {
                setFinishLoading(false);
                toast({
                    title: t("Failed"),
                    description: e.response?.data?.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
            });
    }


    async function handleCreateReportPrescription() {

        axios
            .get(
                `/api/newroutes/healthcare/${UserState.value.data.centerid}/report/${serialNo}`
            ).then(async (response) => {
                if (response.data.data) {
                    setAlreadExistingReport(response.data.data);
                } else {
                    let haveInsurance = false
                    const pdfData = {
                        ...selectedAppointment,
                        ...fallback,
                        diagnosis: diagnosis,
                        prescription: prescription,
                        doctor_specialization: t(selectedAppointment?.doctor_specialization),
                        frequencytitle: t("frequency"),
                        whentitle: t("when"),
                        quantitytitle: t("quantity"),
                        patient_insuranceprovider: selectedAppointment.patient_insurances.length > 0 ? JSON.parse(selectedAppointment.patient_insurances[0]).insuranceprovider : "",
                        patient_insurancenumber: selectedAppointment.patient_insurances.length > 0 ? JSON.parse(selectedAppointment.patient_insurances[0]).insurancenumber : ""
                    };


                    if (
                        selectedAppointment?.patient_insurances.length > 0 && JSON.parse(selectedAppointment?.patient_insurances[0]).insuranceexpiry &&
                        Number(JSON.parse(selectedAppointment?.patient_insurances[0]).insuranceexpiry) >= moment().valueOf()
                    ) {
                        haveInsurance = true
                        if (
                            JSON.parse(selectedAppointment?.patient_insurances[0]).insurancetype &&
                            JSON.parse(selectedAppointment?.patient_insurances[0]).insurancetype === "private"
                        ) {
                            const url = await CreatePdf(
                                "/pdf/CNAMGS-private.pdf",
                                selectedAppointment?.type
                                    ? selectedAppointment.type == "online"
                                        ? true
                                        : false
                                    : false,
                                "private",
                                serialNo,
                                pdfData
                            );
                        } else {
                            const url = await CreatePdf(
                                "/pdf/CNAMGS-public.pdf",
                                selectedAppointment?.type
                                    ? selectedAppointment.type == "online"
                                        ? true
                                        : false
                                    : false,
                                "public",
                                serialNo,
                                pdfData
                            );
                        }
                    } else {
                        haveInsurance = false
                        const url = await CreatePdfNoInsurance(serialNo, pdfData);
                    }
                    const search = new URLSearchParams(window.location.search).get(
                        "id"
                    );
                    axios.post(
                        `/api/newroutes/healthcare/${UserState.value.data.centerid}/report/${serialNo}`,
                        {
                            data: {
                                ...pdfData,
                                online: selectedAppointment?.type
                                    ? selectedAppointment.type == "online"
                                        ? true
                                        : false
                                    : false,
                                haveInsurance: haveInsurance,
                            },
                            type: "prescription",
                            appointmentid: Number(search),
                            status: JSON.parse(selectedAppointment?.patient_insurances[0]).insurancetype &&
                                JSON.parse(selectedAppointment?.patient_insurances[0]).insurancetype == "private" ? "private" : "public"
                        }
                    );
                    onClosePrescription()
                }
            })

    }




    // async function handleFinishConsultation() {

    //     if (selectedAppointment?.patient_insuranceexpiry) {
    //         await axios
    //             .post("/api/insert", {
    //                 table: "reportrequest",
    //                 columns: ["appointmentid", "status", 'centerid', 'created', 'insurance', 'insuranceprovider', 'insuranceexpiry', 'insurancepercentage', 'insurancenumber'],
    //                 values: [
    //                     selectedAppointment.id,
    //                     "requested",
    //                     UserState.value.data.centerid,
    //                     moment().valueOf(),
    //                     true,
    //                     selectedAppointment?.patient_insuranceprovider,
    //                     selectedAppointment?.patient_insuranceexpiry,
    //                     selectedAppointment?.patient_insurancepercentage,
    //                     selectedAppointment?.patient_insurancenumber
    //                 ],
    //             })
    //     } else {
    //         await axios
    //             .post("/api/insert", {
    //                 table: "reportrequest",
    //                 columns: ["appointmentid", "status", 'centerid', 'created', 'insurance'],
    //                 values: [
    //                     selectedAppointment.id,
    //                     "requested",
    //                     UserState.value.data.centerid,
    //                     moment().valueOf(),
    //                     false,
    //                 ],
    //             })
    //     }

    //     await axios.post("/api/update", {
    //         table: 'appointment',
    //         columns: ['status', 'notes', 'endtime'],
    //         values: ['completed', mainForm.notes, moment().valueOf()],
    //         conditions: {
    //             column: 'id',
    //             operator: '=',
    //             value: selectedAppointment.id,
    //         }
    //     })
    //         .then((response) => {
    //             setFinishLoading(false);
    //             onCloseFinishConsultation();
    //             showToastSuccess(toast, toastIdRef, t("consultationSuccessfullyFinished"), t("consultationSuccessfullyFinishedSubheading"))
    //             setTimeout(() => {
    //                 router.push(`${pathname.replace(/\/[^\/]*$/, "")}`)
    //             }, 3000)
    //         })
    //         .catch((e) => {
    //             setFinishLoading(false);
    //             toast({
    //                 title: t("Failed"),
    //                 description: e.response?.data?.message,
    //                 status: "error",
    //                 duration: 3000,
    //                 isClosable: true,
    //                 position: "top-right",
    //             });
    //         });
    // }

    async function handleDownloadReferal() {
        await downloadReferal({ ...selectedAppointment, ...referalData, doctor_specialization: t(selectedAppointment?.doctor_specialization), reasonTitle: t("reasonForReferral"), symptomsTitle: t("symptoms"), presentTitle: t("presentMedicationsSuggestions"), pastTitle: t("pastMedicationsSuggestions"), diagnosisTitle: t("pastDiagnosis") })
        showToastSuccess(toast, toastIdRef, t("referralSuccessfullyDownloaded"), t("referralSuccessfullyDownloadedSubheading"))
    }


    const linkItems = GetLinkItems(page);
    return (
        <Sidebar LinkItems={linkItems}>
            {!selectedAppointment ? (
                <Center width={'100%'} height={'100vh'}>
                    <Spinner />
                </Center>
            ) : (
                <Flex flex={1} overflowX={"auto"} height={"100vh"}>
                    <Flex bg={bgColor} width={"30%"} height={"100%"}>
                        <VStack width={"100%"} gap={5} py={"20px"}>
                            <VStack width={"100%"} gap={5} alignItems={"flex-start"}>
                                <HStack gap={5} px={"20px"}>
                                    <Link href={`${pathname.replace(/\/[^\/]*$/, "")}`}>
                                        <IconButton
                                            width={"50px"}
                                            variant={"outline"}
                                            icon={<ArrowBackIcon boxSize={5} />}
                                        />
                                    </Link>
                                    <VStack align={"flex-start"} gap={0}>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"heading"} fontSize={"20px"}>
                                            {t("consultation")}
                                        </Text>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                            {selectedAppointment?.type
                                                ? t(selectedAppointment?.type)
                                                : t("inPerson")}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Divider />

                            </VStack>
                            <DoctorChatComponent
                                colorMode={colorMode}
                                email={selectedAppointment.patient_email}
                                myEmail={UserState.value.data.email}
                                name={
                                    selectedAppointment.patient_firstname +
                                    " " +
                                    selectedAppointment.patient_lastname
                                }
                                onOpenCall={() => {
                                    setConsultationType("video");
                                    onOpenCall();
                                }}
                            />
                        </VStack>
                    </Flex>

                    <Flex
                        bg={bgColor2}
                        width={"70%"}
                        py={"20px"}
                        flexDir={"column"}
                        gap={5}
                        overflowY={"auto"}
                        height={"100vh"}
                    >
                        <Wrap px={"32px"} gap={8}>
                            <WrapItem>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedOption(1)}
                                    backgroundColor={
                                        selectedOption == 1 ? theme.color.selection : "#FFFFFF"
                                    }
                                    color={selectedOption == 1 ? theme.color.primary : "black"}
                                    rightIcon={
                                        <div
                                            style={{
                                                padding: "5px",
                                                backgroundColor:
                                                    selectedOption == 1
                                                        ? theme.color.darkshade
                                                        : "#F2F4F7",
                                                borderRadius: "50px",
                                            }}
                                        >
                                            <Icon as={MdOutlineModeEdit} />
                                        </div>
                                    }
                                    fontWeight={"500"}
                                >
                                    {t("prescribeMedicine")}
                                </Button>
                            </WrapItem>
                            <WrapItem>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedOption(0)}
                                    backgroundColor={
                                        selectedOption == 0 ? theme.color.selection : "#FFFFFF"
                                    }
                                    color={selectedOption == 0 ? theme.color.primary : "black"}
                                    rightIcon={
                                        <div
                                            style={{
                                                padding: "5px",
                                                backgroundColor:
                                                    selectedOption == 0
                                                        ? theme.color.darkshade
                                                        : "#F2F4F7",
                                                borderRadius: "50px",
                                            }}
                                        >
                                            <Icon as={FaRegUser} />
                                        </div>
                                    }
                                    fontWeight={"500"}
                                >
                                    {t("patientInformation")}
                                </Button>
                            </WrapItem>


                            <WrapItem>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedOption(2)}
                                    backgroundColor={
                                        selectedOption == 2 ? theme.color.lightshade : "#FFFFFF"
                                    }
                                    color={selectedOption == 2 ? theme.color.primary : "black"}
                                    rightIcon={
                                        <div
                                            style={{
                                                padding: "5px",
                                                backgroundColor:
                                                    selectedOption == 2
                                                        ? theme.color.darkshade
                                                        : "#F2F4F7",
                                                borderRadius: "50px",
                                            }}
                                        >
                                            <Icon as={HiMiniArrowUturnRight} />
                                        </div>
                                    }
                                    fontWeight={"500"}
                                >
                                    {t("referPatient")}
                                </Button>
                            </WrapItem>
                            <Spacer />
                            <WrapItem>
                                <Button onClick={() => onOpenFinishConsultation()}>
                                    {t("finishConsultation")}
                                </Button>
                            </WrapItem>
                            <WrapItem>
                                <Menu >
                                    <MenuButton fontSize={'14px'} fontWeight={'400'} as={ChakraButton} colorScheme={'teal'}>
                                        {t("generateReport")}
                                    </MenuButton>
                                    <Portal>
                                        <MenuList >
                                            <MenuItem isDisabled={!fallback} onClick={() => {
                                                setSerialNo("")
                                                setAlreadExistingReport(null)
                                                onOpenPrescription()
                                            }}>{t("prescription")}</MenuItem>
                                        </MenuList>
                                    </Portal>
                                </Menu>
                            </WrapItem>
                        </Wrap>
                        <Divider mt={"11px"} />
                        {selectedOption == 0 && (
                            <Tabs mx={"32px"} overflowY={"auto"}>
                                <TabList
                                    borderBottomWidth={"1px"}
                                    borderBottomColor={theme.divider.primary}
                                >
                                    {[
                                        t("basicInfo"),
                                        t("medicalRecord"),
                                        t("prescription"),
                                        t("insurance"),
                                    ].map((item, index) => (
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
                                        <VStack alignItems={"flex-start"} spacing={5}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                                {t("personalInfo")}
                                            </Text>
                                            <VStack gap={0} align={"inherit"}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("firstName")}
                                                </Text>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                    {selectedAppointment.patient_firstname}
                                                </Text>
                                            </VStack>
                                            <VStack gap={0} align={"inherit"}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("lastName")}
                                                </Text>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                    {selectedAppointment.patient_lastname}
                                                </Text>
                                            </VStack>
                                            <VStack gap={0} align={"inherit"}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("dob")}
                                                </Text>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                    {selectedAppointment?.patient_dob
                                                        ? moment(
                                                            new Date(
                                                                Number(selectedAppointment?.patient_dob)
                                                            )
                                                        ).format("DD/MM/YYYY")
                                                        : ""}
                                                </Text>
                                            </VStack>
                                            <VStack gap={0} align={"inherit"}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("gender")}
                                                </Text>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                    {selectedAppointment?.patient_gender
                                                        ? t(selectedAppointment?.patient_gender)
                                                        : ""}
                                                </Text>
                                            </VStack>

                                            <Divider />
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                                {t("contact")}
                                            </Text>
                                            <VStack gap={0} align={"inherit"}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("email")}
                                                </Text>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                    {selectedAppointment.patient_email}
                                                </Text>
                                            </VStack>
                                            <VStack gap={0} align={"inherit"}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("phoneNumber")}
                                                </Text>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                    {selectedAppointment.patient_number}
                                                </Text>
                                            </VStack>
                                            <VStack gap={0} align={"inherit"}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("homeAddress")}
                                                </Text>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                    {selectedAppointment?.patient_address}
                                                </Text>
                                            </VStack>
                                        </VStack>
                                    </TabPanel>
                                    <TabPanel>
                                        <TableContainer>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                                {t("medicalRecord")}
                                            </Text>
                                            <Table variant="simple">
                                                <Thead>
                                                    <Tr backgroundColor={bgColor3}>
                                                        {[t("date"), t("diagnosis")].map(
                                                            (item, index) => (
                                                                <Th
                                                                    key={index}
                                                                    fontSize={"12px"}
                                                                    fontWeight={"500"}
                                                                    color={colorTxt1}
                                                                >
                                                                    {item}
                                                                </Th>
                                                            )
                                                        )}
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {medicalRecordData.map((item, index) => (
                                                        <Tr key={index}>
                                                            <Td
                                                                fontSize={"14px"}
                                                                fontWeight={"400"}
                                                                color={colorMode == 'light' ? "#475467" : "gray.300"}
                                                            >
                                                                {moment(
                                                                    new Date(Number(item?.created))
                                                                ).format("DD MMM YYYY")}
                                                            </Td>
                                                            <Td
                                                                fontSize={"14px"}
                                                                fontWeight={"400"}
                                                                color={colorMode == 'light' ? "#475467" : "gray.300"}
                                                            >
                                                                {item?.diagnosis}
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </TabPanel>
                                    <TabPanel>
                                        <VStack alignItems={"flex-start"} spacing={5}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                                {t("prescription")}
                                            </Text>
                                            <VStack gap={2} align={"inherit"}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                    {t("prescriptionFor")}
                                                </Text>
                                                <UnorderedList
                                                    ml={5}
                                                    fontSize={"14px"}
                                                    fontWeight={"500"}
                                                    color={colorMode == 'light' ? "#344054" : "gray.300"}
                                                >
                                                    {prescriptionData.length > 0 &&
                                                        prescriptionData.map((item, index) => (
                                                            <ListItem key={index}>
                                                                {item.diagnosis}
                                                            </ListItem>
                                                        ))}
                                                </UnorderedList>
                                            </VStack>

                                            {prescriptionData.length > 0 &&
                                                prescriptionData.map(
                                                    (item) =>
                                                        item.prescription &&
                                                        item.prescription.length > 0 &&
                                                        item.prescription.map((each, index) => (
                                                            <PrescriptionCard
                                                                key={each.tablet}
                                                                heading={each.tablet}
                                                                head1={`${t("frequency")}:`}
                                                                head2={`${t("when")}:`}
                                                                head3={`${t("quantity")}:`}
                                                                value1={each.frequency}
                                                                value2={each.when}
                                                                value3={each.quantity}
                                                                disabled={true}
                                                                allowBorder={false}
                                                            />
                                                        ))
                                                )}
                                        </VStack>
                                    </TabPanel>
                                    <TabPanel>
                                        <VStack alignItems={"flex-start"} spacing={5}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                                {t("insuranceInfo")}
                                            </Text>
                                            {selectedAppointment?.patient_insurances.length > 0 && selectedAppointment?.patient_insurances.map((item, index) => (
                                                <VStack key={index} align={"inherit"} w={'100%'}>
                                                    <VStack gap={0} align={"inherit"}>
                                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                            {t("insuranceProvider")}
                                                        </Text>
                                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                            {JSON.parse(item)?.insuranceprovider}
                                                        </Text>
                                                    </VStack>
                                                    <VStack gap={0} align={"inherit"}>
                                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                            {t("insuranceNumber")}
                                                        </Text>
                                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                            {JSON.parse(item)?.insurancenumber}
                                                        </Text>
                                                    </VStack>
                                                    <VStack gap={0} align={"inherit"}>
                                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                            {t("insuranceType")}
                                                        </Text>
                                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                            {JSON.parse(item)?.insurancetype
                                                                ? t(JSON.parse(item)?.insurancetype)
                                                                : ""}
                                                        </Text>
                                                    </VStack>
                                                    <VStack gap={0} align={"inherit"}>
                                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                            {t("insuranceExpiry")}
                                                        </Text>
                                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                            {JSON.parse(item)?.insuranceexpiry
                                                                ? moment(
                                                                    new Date(
                                                                        Number(
                                                                            JSON.parse(item)?.insuranceexpiry
                                                                        )
                                                                    )
                                                                ).format("DD/MM/YYYY")
                                                                : ""}
                                                        </Text>
                                                    </VStack>
                                                    <Divider />
                                                </VStack>
                                            ))}
                                        </VStack>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        )}

                        {selectedOption == 1 &&
                            (!medicinePrescriptionCompleted ? (
                                <VStack
                                    align={"flex-start"}
                                    width={"100%"}
                                    px={"32px"}
                                    gap={8}
                                    overflowY={"auto"}
                                >
                                    <HStack justify={"space-between"} width={"inherit"}>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                            {t("consultationSummary")}
                                        </Text>
                                        <div>
                                            <GhostButton
                                                onClick={() => {
                                                    setConsultationType("inPerson");
                                                    setAudioBlob(null);
                                                    setRecordingComplete(false);
                                                    setMicPressed(false);
                                                    setMainForm({
                                                        complaint: "",
                                                        history: "",
                                                        examination: "",
                                                    });
                                                    onOpen();
                                                }}
                                                leftIcon={<Icon as={IoMicOutline} boxSize={4} />}
                                            >
                                                {t("voiceToText")}
                                            </GhostButton>
                                        </div>
                                    </HStack>
                                    <VStack gap={4} width={"100%"}>
                                        <VStack width={"100%"} align={"flex-start"} gap={0}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {t("complaint")}
                                            </Text>
                                            <Textarea
                                                value={mainForm.complaint}
                                                placeholder={t("complaintInput")}
                                                resize={"none"}
                                                height={"120px"}
                                                onChange={(e) => {
                                                    setMainForm({
                                                        ...mainForm,
                                                        complaint: e.target.value,
                                                    });
                                                }}
                                            />
                                        </VStack>
                                        <VStack width={"100%"} align={"flex-start"} gap={0}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {t("historyOfPresentIllness")}
                                            </Text>
                                            <Textarea
                                                value={mainForm.history}
                                                placeholder={t("historyOfPresentIllnessInput")}
                                                resize={"none"}
                                                height={"120px"}
                                                onChange={(e) => {
                                                    setMainForm({
                                                        ...mainForm,
                                                        history: e.target.value,
                                                    });
                                                }}
                                            />
                                        </VStack>
                                        <VStack width={"100%"} align={"flex-start"} gap={0}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {t("examinationFindings")}
                                            </Text>
                                            <Textarea
                                                value={mainForm.examination}
                                                placeholder={t("examinationFindingsInput")}
                                                resize={"none"}
                                                height={"120px"}
                                                onChange={(e) => {
                                                    setMainForm({
                                                        ...mainForm,
                                                        examination: e.target.value,
                                                    });
                                                }}
                                            />
                                        </VStack>

                                        <VStack width={"100%"} align={"flex-start"} gap={0}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {t("medicalTest")}
                                            </Text>
                                            <Box borderRadius={'6px'} w={'100%'} h={'140px'} overflowY={'auto'} border={'1px solid'} borderColor={bdColor2} p={5} >

                                                <UnorderedList
                                                    fontSize={"14px"}
                                                    fontWeight={"500"}
                                                    color={colorMode == 'light' ? "#344054" : "gray.300"}
                                                >
                                                    {medicalTest.length > 0 && medicalTest.map((item, index) => (
                                                        <ListItem key={index}>
                                                            {`${item.name} (${t(item.type)})`}
                                                        </ListItem>
                                                    ))

                                                    }
                                                </UnorderedList>

                                            </Box>

                                        </VStack>



                                        <Button w={"100%"} onClick={() => {
                                            setMedicalTest((prevState) => {
                                                const newState = [...prevState]
                                                newState.push({ name: "", type: "" })
                                                return newState
                                            })
                                            setTestOption("")
                                            onOpenMedicalTest()
                                        }}>Add Medical Test</Button>

                                        <VStack width={"100%"} align={"flex-start"} gap={0}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {t("notesForDoctor")}
                                            </Text>
                                            <Textarea
                                                value={mainForm.notes}
                                                placeholder={t("notesForDoctorInput")}
                                                resize={"none"}
                                                height={"120px"}
                                                onChange={(e) => {
                                                    setMainForm({
                                                        ...mainForm,
                                                        notes: e.target.value,
                                                    });
                                                }}
                                            />
                                        </VStack>
                                    </VStack>
                                    <div>
                                        <Button
                                            onClick={async () => {
                                                fetchPrescription();
                                                onOpenAI();

                                            }}
                                            isDisabled={
                                                !mainForm.complaint ||
                                                !mainForm.history ||
                                                !mainForm.examination
                                            }
                                            backgroundColor={theme.color.selection}
                                            color={theme.color.icon}
                                            leftIcon={<Icon as={BsStars} boxSize={5} />}
                                            fontWeight={"500"}
                                        >
                                            {t("generateAIDiagnosisAndPrescription")}
                                        </Button>
                                    </div>
                                    <Divider />
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                        {t("diagnosis")}
                                    </Text>
                                    <div style={{ width: "100%" }}>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                            {`${t("diagnosis")}`}
                                        </Text>
                                        <HStack width={"100%"} mt={1}>
                                            <Input
                                                value={diagnosis}
                                                onChange={(e) => {
                                                    setDiagnosis(e.target.value);
                                                }}
                                            />
                                        </HStack>
                                    </div>

                                    <Divider />
                                    <HStack width={"100%"} justify={"space-between"}>
                                        <div>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                                {t("prescription")}
                                            </Text>
                                        </div>
                                        {/* <GhostButton
                  leftIcon={<Icon as={PiIntersect} boxSize={5} />}
                >
                  {t("checkMedicationInteraction")}
                </GhostButton> */}
                                    </HStack>

                                    <PrescriptionBox
                                        data={prescription}
                                        onReturn={(data) => {
                                            setPrescription((prevState) => {
                                                const newState = [...prevState];
                                                newState.push(data);
                                                return newState;
                                            });
                                        }}
                                        onReturnDelete={(data) => setPrescription(data)}
                                    />
                                    <div style={{ width: "100%" }}>
                                        <Button
                                            width={"100%"}
                                            onClick={() => onOpenPreview()}
                                            isDisabled={prescription.length === 0}
                                        >
                                            {t("preview")}
                                        </Button>
                                    </div>
                                </VStack>
                            ) : (
                                <VStack
                                    align={"flex-start"}
                                    width={"100%"}
                                    px={"32px"}
                                    gap={8}
                                    overflowY={"auto"}
                                >
                                    <HStack justify={"space-between"} width={"inherit"}>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                            {t("consultationSummary")}
                                        </Text>

                                    </HStack>
                                    <VStack gap={4} width={"100%"}>
                                        <VStack width={"100%"} align={"flex-start"} gap={0}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                {t("complaint")}
                                            </Text>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {mainForm.complaint}
                                            </Text>
                                        </VStack>
                                        <VStack width={"100%"} align={"flex-start"} gap={0}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {t("historyOfPresentIllness")}
                                            </Text>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {mainForm.history}
                                            </Text>
                                        </VStack>
                                        <VStack width={"100%"} align={"flex-start"} gap={0}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {t("examinationFindings")}
                                            </Text>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {mainForm.examination}
                                            </Text>
                                        </VStack>
                                    </VStack>

                                    <Divider />
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                        {t("diagnosis")}
                                    </Text>
                                    <VStack align={"flex-start"} gap={3} width={"100%"}>
                                        {diagnosisList.map((item, index) => (
                                            <div key={index} style={{ width: "100%" }}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                    {`${t("diagnosis")} ${index + 1}`}
                                                </Text>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                    {item.value}
                                                </Text>
                                            </div>
                                        ))}
                                    </VStack>

                                    <Divider />

                                    <HStack width={"100%"} justify={"space-between"}>
                                        <div>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                                {t("prescription")}
                                            </Text>
                                        </div>
                                        {/* <GhostButton
                  leftIcon={<Icon as={PiIntersect} boxSize={5} />}
                >
                  {t("checkMedicationInteraction")}
                </GhostButton> */}
                                    </HStack>
                                    {prescription.length == 0 ? (
                                        <VStack
                                            width={"100%"}
                                            borderRadius={"8px"}
                                            border={"1px solid"}
                                            borderColor={"#EAECF0"}
                                            overflow={"hidden"}
                                            gap={0}
                                        >
                                            <HStack
                                                width={"100%"}
                                                justify={"space-between"}
                                                bg={"#F2F4F7"}
                                                px={"15px"}
                                            >
                                                <Text
                                                    variant={"subheading"}
                                                    fontWeight={"600"}
                                                    fontSize={"16px"}
                                                >
                                                    Prescription 1
                                                </Text>
                                                <IconButton
                                                    isDisabled={prescription.length === 0}
                                                    variant={"ghost"}
                                                    icon={<DeleteIcon color={"red"} boxSize={5} />}
                                                />
                                            </HStack>
                                            <HStack width={"100%"} bg={"#FFFFFF"} p={"15px"}>
                                                <div style={{ width: "100%" }}>
                                                    <Button leftIcon={<AddIcon mt={"-2px"} />}>
                                                        {t("addMedicine")}
                                                    </Button>
                                                </div>
                                            </HStack>
                                        </VStack>
                                    ) : (
                                        prescription.map((eachItem, index) => (
                                            <VStack key={index} width={"100%"} gap={2}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {`${t("prescription")} ${index + 1}`}
                                                </Text>
                                                <PrescriptionCard
                                                    heading={eachItem.tablet}
                                                    head1={`${t("frequency")}:`}
                                                    head2={`${t("when")}:`}
                                                    head3={`${t("quantity")}:`}
                                                    value1={eachItem.frequency}
                                                    value2={eachItem.when}
                                                    value3={eachItem.quantity}
                                                    disabled={true}
                                                />
                                            </VStack>
                                        ))
                                    )}
                                </VStack>
                            ))}

                        {selectedOption == 2 && (
                            <VStack
                                alignItems={"flex-start"}
                                gap={8}
                                px={"32px"}
                                width={"100%"}
                                overflowY={"auto"}
                            >
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                    {t("patientContactDetail")}
                                </Text>
                                <VStack gap={0} align={"inherit"} width={"100%"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("name")}
                                    </Text>
                                    <Input
                                        value={`${selectedAppointment?.patient_firstname} ${selectedAppointment?.patient_lastname}`}
                                        resize="none"
                                        isDisabled
                                    />
                                </VStack>

                                <VStack gap={0} align={"inherit"} width={"100%"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("dob")}
                                    </Text>
                                    <Input
                                        value={
                                            selectedAppointment?.patient_dob
                                                ? moment(
                                                    new Date(Number(selectedAppointment?.dob))
                                                ).format("DD/MM/YYYY")
                                                : ""
                                        }
                                        resize="none"
                                        isDisabled
                                    />
                                </VStack>

                                <VStack gap={0} align={"inherit"} width={"100%"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("email")}
                                    </Text>
                                    <Input
                                        value={selectedAppointment?.patient_email}
                                        resize="none"
                                        isDisabled
                                    />
                                </VStack>

                                <VStack gap={0} align={"inherit"} width={"100%"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("phoneNumber")}
                                    </Text>
                                    <Input
                                        value={selectedAppointment?.patient_number}
                                        resize="none"
                                        isDisabled
                                    />
                                </VStack>

                                <VStack gap={0} align={"inherit"} width={"100%"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("homeAddress")}
                                    </Text>
                                    <Textarea
                                        value={selectedAppointment?.patient_address}
                                        resize="none"
                                        isDisabled
                                        height={"140px"}
                                    />
                                </VStack>

                                <VStack gap={0} align={"inherit"} width={"100%"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("reasonForReferral")}
                                    </Text>
                                    <Textarea
                                        value={referalData.reason}
                                        onChange={(e) =>
                                            setReferalData((prevState) => {
                                                const newState = { ...prevState };
                                                newState.reason = e.target.value;
                                                return newState;
                                            })
                                        }
                                        resize="none"
                                        height={"140px"}
                                    />
                                </VStack>

                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                    {t("healthSummary")}
                                </Text>

                                <VStack gap={0} align={"inherit"} width={"100%"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("symptoms")}
                                    </Text>
                                    <Textarea resize="none" height={"140px"} value={referalData.symptoms}
                                        onChange={(e) =>
                                            setReferalData((prevState) => {
                                                const newState = { ...prevState };
                                                newState.symptoms = e.target.value;
                                                return newState;
                                            })
                                        } />
                                </VStack>
                                <VStack gap={0} align={"inherit"} width={"100%"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("presentMedicationsSuggestions")}
                                    </Text>
                                    <Textarea resize="none" height={"140px"} value={referalData.present}
                                        onChange={(e) =>
                                            setReferalData((prevState) => {
                                                const newState = { ...prevState };
                                                newState.present = e.target.value;
                                                return newState;
                                            })
                                        } />
                                </VStack>

                                <VStack gap={0} align={"inherit"} width={"100%"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("pastMedicationsSuggestions")}
                                    </Text>
                                    <Textarea resize="none" height={"140px"} value={referalData.past}
                                        onChange={(e) =>
                                            setReferalData((prevState) => {
                                                const newState = { ...prevState };
                                                newState.past = e.target.value;
                                                return newState;
                                            })
                                        } />
                                </VStack>

                                <VStack gap={0} align={"inherit"} width={"100%"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"pastDiagnosis"} fontSize={"14px"}>
                                        {t("pastDiagnosis")}
                                    </Text>
                                    <Textarea resize="none" height={"140px"} value={referalData.diagnosis}
                                        onChange={(e) =>
                                            setReferalData((prevState) => {
                                                const newState = { ...prevState };
                                                newState.diagnosis = e.target.value;
                                                return newState;
                                            })
                                        } />
                                </VStack>
                                <div style={{ width: "100%" }}>
                                    <Button
                                        onClick={() => handleDownloadReferal()}
                                        style={{ width: "100%" }}
                                    >
                                        {t("downloadReferral")}
                                    </Button>
                                </div>
                            </VStack>
                        )}
                    </Flex>

                </Flex>
            )}

            <Modal isOpen={isOpenRecord} onClose={onCloseRecord} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <Center w={"100%"}>
                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"heading"} fontSize={"20px"}>
                                {t("sendToAI")}
                            </Text>
                        </Center>
                        {!audioUrl ? (
                            <HStack align={"flex-start"} gap={2}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"}>{t("processingFile")}</Text>
                                <Spinner size="sm" />
                            </HStack>
                        ) : (
                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"}>{t("fileReady")}</Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => {
                                setAudioUrl("");
                                onCloseRecord();
                            }}
                        >
                            {t("close")}
                        </Button>
                        <Button
                            isDisabled={!audioUrl}
                            onClick={() => {
                                setMainForm({
                                    patient: "",
                                    doctor: "",
                                    complaint: "",
                                    examination: "",
                                    history: "",
                                });
                                sendRecordingToAI(audioUrl);
                                setRecordingComplete(true);
                                setContinueStep(0);
                                onCloseRecord();
                                onOpen();
                            }}
                        >
                            {t("send")}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <AlertDialog
                motionPreset="slideInBottom"
                onClose={onClose}
                isOpen={isOpen}
                isCentered
                closeOnOverlayClick={false}
            >
                <AlertDialogOverlay bg={"#344054B2"} />

                <AlertDialogContent
                    maxW={"80%"}
                    width={!recordingComplete ? "400px" : "800px"}
                >
                    <AlertDialogHeader>
                        <AlertIcon icon={IoMicOutline} />
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody mb={5}>
                        <VStack alignItems={"flex-start"} spacing={2}>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontSize={"18px"} fontWeight={"500"}>
                                {t("voiceConsultation")}
                            </Text>
                            {recordingComplete ? (
                                continueStep == 1 ? (
                                    <VStack width={"100%"}>
                                        <HStack align={"flex-start"} width={"100%"}>
                                            <div style={{ width: "200px" }}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("complaint")}:
                                                </Text>
                                            </div>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {mainForm.complaint}
                                            </Text>
                                        </HStack>
                                        <HStack align={"flex-start"} width={"100%"}>
                                            <div style={{ width: "200px" }}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("historyOfPresentIllness")}:
                                                </Text>
                                            </div>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {mainForm.history}
                                            </Text>
                                        </HStack>
                                        <HStack align={"flex-start"} width={"100%"}>
                                            <div style={{ width: "200px" }}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("examinationFindings")}:
                                                </Text>
                                            </div>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {mainForm.examination}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                ) : mainForm.patient ? (
                                    <VStack width={"100%"}>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"20px"}>
                                            {t("summary")}
                                        </Text>
                                        <HStack align={"flex-start"} width={"100%"}>
                                            <div style={{ width: "200px" }}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("patient")}:
                                                </Text>
                                            </div>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {mainForm.patient}
                                            </Text>
                                        </HStack>
                                        <HStack align={"flex-start"} width={"100%"}>
                                            <div style={{ width: "200px" }}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("doctor")}:
                                                </Text>
                                            </div>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {mainForm.doctor}
                                            </Text>
                                        </HStack>
                                        <div>
                                            <Button mt={2} onClick={() => setContinueStep(1)}>
                                                {t("continue")}
                                            </Button>
                                        </div>
                                    </VStack>
                                ) : (
                                    <Center w={"100%"}>
                                        <Spinner />
                                    </Center>
                                )
                            ) : !micPressed ? (
                                <>
                                    <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"} fontSize={"14px"} fontWeight={"400"} >
                                        {t("startTalkingToMicrophone")}
                                    </Text>
                                    <div style={{ alignSelf: "center" }}>
                                        <Box
                                            _hover={{ cursor: "pointer" }}
                                            height={"80px"}
                                            width={"80px"}
                                            borderRadius={"40px"}
                                            bg={bgColor4}
                                            alignItems={"center"}
                                            justifyContent={"center"}
                                            display={"flex"}
                                            onClick={() => {
                                                handleStartRecording();
                                                setMicPressed(true);
                                            }}
                                        >
                                            <Icon as={IoMicOutline} boxSize={12} />
                                        </Box>
                                    </div>
                                </>
                            ) : (
                                <VStack width={"100%"}>
                                    <div style={{ width: 100, height: 100 }}>
                                        <Lottie animationData={animationData} loop={true} />
                                    </div>
                                    <div style={{ alignSelf: "center" }}>
                                        <Box
                                            _hover={{ cursor: "pointer" }}
                                            height={"80px"}
                                            width={"80px"}
                                            borderRadius={"40px"}
                                            bg={bgColor4}
                                            alignItems={"center"}
                                            justifyContent={"center"}
                                            display={"flex"}
                                            onClick={() => {
                                                handleStopRecording();
                                                setMicPressed(false);
                                                // setRecordingComplete(true)
                                            }}
                                        >
                                            <Icon as={IoMicOutline} boxSize={12} />
                                        </Box>
                                    </div>
                                </VStack>
                            )}
                            {audioBlob && !recordingComplete && (
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "10px",
                                    }}
                                >
                                    <Button
                                        onClick={() => {
                                            handleFileUpload();
                                            setRecordingComplete(true);
                                        }}
                                    >
                                        Continue
                                    </Button>
                                </div>
                            )}
                        </VStack>
                    </AlertDialogBody>
                    {recordingComplete && continueStep != 0 && (
                        <AlertDialogFooter>
                            <GhostButton onClick={() => setMicPressed(false)}>
                                {t("cancel")}
                            </GhostButton>
                            <Button
                                ml={3}
                                onClick={() => {
                                    onClose();
                                }}
                            >
                                {t("confirm")}
                            </Button>
                        </AlertDialogFooter>
                    )}
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRefAI}
                onClose={onCloseAI}
                isOpen={isOpenAI}
                isCentered
            >
                <AlertDialogOverlay bg={"#344054B2"} />

                <AlertDialogContent
                    maxW={"80%"}
                    width={"800px"}
                    overflowY={"auto"}
                    maxHeight={"95vh"}
                >
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
                            <Icon color={theme.color.primary} as={BsStars} boxSize={5} />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody mb={5}>
                        <VStack alignItems={"flex-start"} spacing={2} width={"100%"}>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontSize={"18px"} fontWeight={"500"} >
                                {t("AIDiagnosisAndPrescription")}
                            </Text>

                            <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"} fontSize={"14px"} fontWeight={"400"} >
                                {t("AIDiagnosisAndPrescriptionSubheading")}
                            </Text>
                            <HStack>
                                <div style={{ width: "200px" }}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                        {t("diagnosis")}
                                    </Text>
                                </div>
                                <VStack align={"flex-start"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("diagnosis")} 1
                                    </Text>
                                    <Input
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                    />
                                </VStack>
                            </HStack>
                            <Divider />
                            <HStack width={"100%"} align={"flex-start"}>
                                <div style={{ width: "200px" }}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                        {t("prescription")}
                                    </Text>
                                </div>
                                <VStack align={"flex-start"} width={"100%"}>
                                    {prescription.length === 0 && (
                                        <Center w={"100%"}>
                                            <Spinner />
                                        </Center>
                                    )}
                                    {prescription.length > 0 &&
                                        prescription.map((eachPrescription, index) => (
                                            <VStack
                                                key={index}
                                                align={"flex-start"}
                                                width={"100%"}
                                                gap={0}
                                            >
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("prescription")} {index + 1}
                                                </Text>
                                                <PrescriptionCard
                                                    allowBorder={true}
                                                    heading={eachPrescription.tablet}
                                                    head1={`${t("frequency")}:`}
                                                    head2={`${t("when")}:`}
                                                    head3={`${t("quantity")}:`}
                                                    value1={eachPrescription.frequency}
                                                    value2={eachPrescription.when}
                                                    value3={eachPrescription.quantity}
                                                    onChangeHeading={(val) => {
                                                        setPrescription((prevState) => {
                                                            const newState = [...prevState];
                                                            newState[index].tablet = val;
                                                            return newState;
                                                        });
                                                    }}
                                                    onChangeValue1={(val) => {
                                                        setPrescription((prevState) => {
                                                            const newState = [...prevState];
                                                            newState[index].frequency = val;
                                                            return newState;
                                                        });
                                                    }}
                                                    onChangeValue2={(val) => {
                                                        setPrescription((prevState) => {
                                                            const newState = [...prevState];
                                                            newState[index].when = val;
                                                            return newState;
                                                        });
                                                    }}
                                                    onChangeValue3={(val) => {
                                                        setPrescription((prevState) => {
                                                            const newState = [...prevState];
                                                            newState[index].quantity = val;
                                                            return newState;
                                                        });
                                                    }}
                                                />
                                            </VStack>
                                        ))}
                                </VStack>
                            </HStack>
                        </VStack>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <GhostButton onClick={() => onCloseAI()}>{t("cancel")}</GhostButton>
                        <Button
                            ml={3}
                            onClick={() => {
                                setDiagnosisList((prevState) => {
                                    const newState = [...prevState];
                                    newState[diagnosisList.length - 1].value = diagnosis;
                                    return newState;
                                });

                                onCloseAI();
                            }}
                        >
                            {`${t("confirm")}`}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                motionPreset="slideInBottom"
                onClose={onClosePreview}
                isOpen={isOpenPreview}
                isCentered
            >
                <AlertDialogOverlay bg={"#344054B2"} />

                <AlertDialogContent
                    maxW={"80%"}
                    width={"800px"}
                    overflowY={"auto"}
                    maxHeight={"95vh"}
                >
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
                                color={theme.color.primary}
                                as={IoMdCheckboxOutline}
                                boxSize={5}
                            />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody mb={5}>
                        <VStack alignItems={"flex-start"} gap={5}>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontSize={"18px"} fontWeight={"500"} >
                                {t("previewPrescription")}
                            </Text>

                            <HStack align={"flex-start"} width={"100%"}>
                                <div style={{ width: "200px" }}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("consultationSummary")}
                                    </Text>
                                </div>
                                <VStack gap={4} align={"flex-start"}>
                                    <VStack gap={2} align={"flex-start"}>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                            {t("complaint")}:
                                        </Text>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                            {mainForm.complaint}
                                        </Text>
                                    </VStack>

                                    <VStack gap={2} align={"flex-start"}>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                            {t("historyOfPresentIllness")}:
                                        </Text>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                            {mainForm.history}
                                        </Text>
                                    </VStack>
                                    <VStack gap={2} align={"flex-start"}>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                            {t("examinationFindings")}:
                                        </Text>
                                        <Text color={colorMode === 'dark' && 'gray.300'}
                                            variant={"subheading"}
                                            fontSize={"14px"}
                                            style={{ whiteSpace: "pre-line" }}
                                        >
                                            {mainForm.examination}
                                        </Text>
                                    </VStack>
                                </VStack>
                            </HStack>
                            <Divider />
                            <HStack>
                                <div style={{ width: "200px" }}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                        {t("diagnosis")}
                                    </Text>
                                </div>
                                <VStack align={"flex-start"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                        {t("diagnosis")} 1
                                    </Text>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                        {diagnosis}
                                    </Text>
                                </VStack>
                            </HStack>
                            <Divider />
                            <HStack width={"100%"} align={"flex-start"}>
                                <div style={{ width: "200px" }}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                        {t("prescription")}
                                    </Text>
                                </div>
                                <VStack align={"flex-start"} width={"100%"}>
                                    {prescription.length > 0 &&
                                        prescription.map((eachPrescription, index) => (
                                            <VStack
                                                key={index}
                                                align={"flex-start"}
                                                width={"100%"}
                                                gap={0}
                                            >
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("prescription")} {index + 1}
                                                </Text>
                                                <PrescriptionCard
                                                    heading={eachPrescription.tablet}
                                                    head1={`${t("frequency")}:`}
                                                    head2={`${t("when")}:`}
                                                    head3={`${t("quantity")}:`}
                                                    value1={eachPrescription.frequency}
                                                    value2={eachPrescription.when}
                                                    value3={eachPrescription.quantity}
                                                />
                                            </VStack>
                                        ))}
                                </VStack>
                            </HStack>
                            <Divider />
                            <HStack alignItems={"flex-start"} gap={0}>
                                <Box mt={1}>
                                    <Checkbox defaultChecked />
                                </Box>
                                <Text
                                    variant={"description"}
                                    color={colorMode == 'light' ? "#667085" : "gray.400"}
                                    fontSize={"14px"}
                                >
                                    {t("consultationDeclaration")}
                                </Text>
                            </HStack>
                        </VStack>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <GhostButton onClick={() => onClosePreview()}>
                            {t("cancel")}
                        </GhostButton>
                        <Button
                            isLoading={medLoading}
                            ml={3}
                            onClick={() => {
                                setMedLoading(true);
                                handlePrescribeMedicine();
                            }}
                        >
                            {t("confirm")}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                motionPreset="slideInBottom"
                onClose={onCloseFinishConsultation}
                isOpen={isOpenFinishConsultation}
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
                                color={theme.color.primary}
                                as={IoMdCheckboxOutline}
                                boxSize={5}
                            />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <VStack alignItems={"flex-start"} spacing={2}>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontSize={"18px"} fontWeight={"500"} >
                                {t("finishConsultationHeading")}
                            </Text>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"} fontSize={"14px"} fontWeight={"400"} >
                                {t("finishConsultationSunheading")}
                            </Text>
                        </VStack>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <GhostButton
                            onClick={() => {
                                onCloseFinishConsultation();
                                setFinishLoading(false);
                            }}
                        >
                            {t("cancel")}
                        </GhostButton>
                        <Button
                            isLoading={finishLoading}
                            ml={3}
                            onClick={() => {
                                setFinishLoading(true);
                                handleFinishConsultation();
                            }}
                        >
                            {t("finish")}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <AlertDialog
                motionPreset="slideInBottom"
                onClose={onCloseMedicalTest}
                isOpen={isOpenMedicalTest}
                isCentered
                closeOnOverlayClick={false}
            >
                <AlertDialogOverlay bg={"#344054B2"} />

                <AlertDialogContent maxH={'95%'} overflowY={'auto'}>
                    <AlertDialogHeader>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="heading"> {t("addNewRequest")}</Text>
                        {/* <AlertIcon icon={IoMicOutline} /> */}
                    </AlertDialogHeader>
                    {/* <AlertDialogCloseButton onClick={()=>{
                          setMedicalTest((prevState) => {
                            const newState = [...prevState]
                            newState.pop()
                            return newState
                        })
                    }}/> */}
                    <AlertDialogBody mb={5} >
                        {medicalTest.length > 0 &&
                            <VStack width={"100%"} align={"flex-start"} gap={5}>
                                <VStack width={"100%"} align={"flex-start"} gap={0}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                        {t("type")}
                                    </Text>
                                    <Select value={medicalTest[medicalTest.length - 1]?.type} onChange={(e) => setMedicalTest((prevState) => {
                                        const newState = [...prevState]
                                        newState[medicalTest.length - 1].type = e.target.value
                                        return newState
                                    })} >
                                        <option value={""}>{t("selectOne")}</option>
                                        <option value={"labTest"}>{t("labTest")}</option>
                                        <option value={"imagingStudies"}>{t("imagingStudies")}</option>
                                    </Select>
                                </VStack>

                                {medicalTest[medicalTest.length - 1]?.type && medicalTest[medicalTest.length - 1]?.type === 'labTest' &&
                                    <VStack align={'flex-start'} width={'100%'}>
                                        <div >
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"}>{t("testType")}</Text>
                                        </div>
                                        <Select
                                            value={testOption} onChange={(e) => {
                                                setTestOption(e.target.value)
                                                setMedicalTest((prevState) => {
                                                    const newState = [...prevState]
                                                    newState[medicalTest.length - 1].name = e.target.value
                                                    return newState
                                                })

                                            }}
                                        >
                                            <option value={""}>{t("other")}</option>
                                            {allTestType.length > 0 &&
                                                allTestType.map((item, index) => (
                                                    <option key={index} value={item}>
                                                        {item}
                                                    </option>
                                                ))}

                                        </Select>
                                    </VStack>
                                }
                                {!testOption &&
                                    <VStack width={"100%"} align={"flex-start"} gap={2}>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                            {t("name")}
                                        </Text>

                                        <Input value={medicalTest[medicalTest.length - 1]?.name} onChange={(e) => setMedicalTest((prevState) => {
                                            const newState = [...prevState]
                                            newState[medicalTest.length - 1].name = e.target.value
                                            return newState
                                        })} />
                                    </VStack>
                                }


                            </VStack>
                        }
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <GhostButton onClick={() => {
                            setMedicalTest((prevState) => {
                                const newState = [...prevState]
                                newState.pop()
                                return newState
                            })
                            onCloseMedicalTest()
                        }}>{t("cancel")}</GhostButton>
                        <Button
                            ml={3}
                            onClick={() => {
                                onCloseMedicalTest()
                            }}
                        >
                            {t("save")}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                motionPreset="slideInBottom"
                onClose={onClosePrescription}
                isOpen={isOpenPrescription}
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


                            </VStack>
                        </VStack>

                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <GhostButton onClick={onClosePrescription}>{t("cancel")}</GhostButton>
                        <Button
                            isDisabled={!serialNo}
                            ml={3}
                            onClick={() => {
                                handleCreateReportPrescription();
                            }}
                        >
                            {t("proceed")}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {UserState.value.data?.email && selectedAppointment?.patient_email && (
                <StreamCallComponenet
                    from={UserState.value.data?.email}
                    isOpen={isOpenCall}
                    onClose={onCloseCall}
                    name={
                        UserState.value.data?.firstname
                            ? UserState.value.data?.firstname
                            : UserState.value.data?.name
                    }
                    to={"mikemag.edu@gmail.com"}
                    onReturn={(url) => setAudioUrl(url)}
                    onRecordingStopped={() => onOpenRecord()}
                    onRecordingStart={() => setAudioUrl("")}
                />
            )}

        </Sidebar>
    );
}

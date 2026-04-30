"use client";
import Sidebar from "@/components/sidebar";
import { ChevronRightIcon, CloseIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
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
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    useColorMode,
    useColorModeValue,
    Divider
} from "@chakra-ui/react";
import { usePathname, useSearchParams } from "next/navigation";
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
import axios from '@/lib/axiosInstance';
import { UserContext } from "@/store/context/UserContext";
import StatusBox from "@/components/ui/StatusBox";
import InputImageRow from "@/components/ui/InputImageRow";
import downloadReferal from "@/functions/referalPDF";
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils";

export default function PatientDetailPage({ page, pid }) {
    const { colorMode } = useColorMode()
    const t = useTranslations("Dictionary");
    const pathname = usePathname();
    const [labResultOption, setLabResultOption] = useState(0);

    const [singleDetail, setSingleDetail] = useState();
    const searchParams = useSearchParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [appointment, setAppointment] = useState([])
    const [medicalRecord, setMedicalRecord] = useState([])
    const [prescriptionData, setPrescriptionData] = useState([])
    const toastIdRef = useRef(null);
    const toast = useToast();
    const id = "test-toast";
    const { state: UserState } = useContext(UserContext)
    const [labRecords, setLabRecrods] = useState([])
    const { isOpen: isOpenRefer, onClose: onCloseRefer, onOpen: onOpenRefer } = useDisclosure()
    const [referalData, setReferalData] = useState({
        reason: "",
        symptoms: "",
        present: "",
        past: "",
        diagnosis: "",
    });

    const params = useSearchParams();
    const txtColor1 = useColorModeValue("#475467", "gray.300")
    const txtColor2 = useColorModeValue("#475467", "gray.300")
    const txtColor3 = useColorModeValue("#344054", "gray.300")
    const bdBottom = useColorModeValue(theme.divider.primary, "gray.600")
    const bdColorCustom = useColorModeValue("#EAECF0", "gray.600")

    const [data, setData] = useState();

    useEffect(() => {
        if (UserState.value.data?.centerid) {
            if (pid) {
                fetchData(Number(pid))
            }
        }

    }, [UserState.value.data]);

    async function fetchData(id) {

        axios.get(`/api/newroutes/healthcare/${UserState.value.data.centerid}/patient/${id}`)
            .then((response) => {
                if (!response.data?.patient) {
                    router.push(`${pathname.replace(/\/[^\/]*$/, "")}`)
                }
                setData(response.data.patient)
                setAppointment(response.data.appointments)
                setMedicalRecord(response.data.medicalRecords)
                setLabRecrods(response.data.labRequests)
                if (response.data.medicalRecords.length > 0) {
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

            }).catch((e) => {

                showToastFailed(toast, toastIdRef, t("Failed"), e?.response?.data?.message, t("Failed"))

            })

    }

    const RenderEachRow = ({ item, index }) => {
        return (
            <Tr backgroundColor={
                index % 2 == 0
                    ? colorMode == "light"
                        ? "#F9FAFB"
                        : "gray.700"
                    : colorMode == "light"
                        ? "white"
                        : "transparent"
            }>
                <Td fontSize={"14px"}
                    fontWeight={"400"}
                    color={txtColor1}>
                    {moment(new Date(Number(item?.appointmentdate))).format("DD MMM YYYY")}
                </Td>
                <Td fontSize={"14px"}
                    fontWeight={"400"}
                    color={txtColor1}>
                    {moment(new Date(Number(item?.appointmentdate))).format("hh:mm A")}
                </Td>
                <Td fontSize={"14px"}
                    fontWeight={"500"}
                    color={txtColor2}>
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
                <Td fontSize={"14px"}
                    fontWeight={"400"}
                    color={txtColor1} isTruncated>
                    <Box
                        textOverflow="ellipsis"
                        whiteSpace="wrap"
                    >
                        {item?.reason ? t(item?.reason) : item?.reason || ""}
                    </Box>
                </Td>
                <Td fontSize={"14px"}
                    fontWeight={"400"}
                    color={txtColor1}>
                    {t(item.type)}
                </Td>
                <Td fontSize="14px" fontWeight="400" color="#344054">
                    <StatusBox item={item?.status} />
                </Td>
                <Td fontSize={"14px"}
                    fontWeight={"400"}
                    color={txtColor1}>
                    {medicalRecord.filter((eachRecord) => eachRecord.appointmentid === item.id).length == 0 ? "No" :
                        <Accordion allowMultiple >
                            <AccordionItem style={{ borderTopWidth: '0px', borderBottomWidth: '0px' }}>
                                <h2>
                                    <AccordionButton>
                                        <Box as='span' flex='1' textAlign='left'>
                                            Yes
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    {medicalRecord.filter((eachRecord) => eachRecord.appointmentid === item.id).map((eachRecord, ind) => (
                                        <VStack alignItems={"flex-start"} spacing={5} maxW={'600px'} key={ind}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                                {t("prescriptionFor")}
                                            </Text>
                                            <UnorderedList
                                                ml={5}
                                                fontSize={"14px"}
                                                fontWeight={"500"}
                                                color={txtColor3}
                                            >
                                                <ListItem key={index}>{eachRecord.diagnosis}</ListItem>

                                            </UnorderedList>
                                            {eachRecord.prescription.length > 0 &&
                                                eachRecord.prescription.map(
                                                    (eachPres) => {
                                                        const parseItem = JSON.parse(eachPres)
                                                        return (

                                                            <PrescriptionCard
                                                                key={parseItem.tablet}
                                                                heading={parseItem.tablet}
                                                                head1={`${t("frequency")}:`}
                                                                head2={`${t("when")}:`}
                                                                head3={`${t("quantity")}:`}
                                                                value1={parseItem.frequency}
                                                                value2={parseItem.when}
                                                                value3={parseItem.quantity}
                                                                disabled={true}
                                                                allowBorder={false}
                                                            />

                                                        )
                                                    }
                                                )}
                                        </VStack>
                                    ))}
                                </AccordionPanel>
                            </AccordionItem>




                        </Accordion>
                    }
                </Td>
            </Tr>
        );
    };

    const RenderEachRowMedicalRecord = ({ item, index }) => {
        return (
            <Tr backgroundColor={index % 2 === 0 ? "#F9FAFB" : "white"}>
                <Td fontSize={"14px"}
                    fontWeight={"400"}
                    color={txtColor1}>
                    {moment(new Date(Number(item?.created))).format("DD MMM YYYY")}
                </Td>
                <Td fontSize={"14px"}
                    fontWeight={"400"}
                    color={txtColor1}>
                    {item?.centername}
                </Td>
                <Td fontSize={"14px"}
                    fontWeight={"500"}
                    color={txtColor2}>
                    {item?.doctor_firstname + " " + item?.doctor_lastname}
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "#667085",
                        }}
                    >
                        {item?.staff_speciality}
                    </div>
                </Td>
                <Td fontSize={"14px"}
                    fontWeight={"400"}
                    color={txtColor1} isTruncated>
                    <Box
                        textOverflow="ellipsis"
                        whiteSpace="wrap"
                    >
                        {item?.diagnosis}
                    </Box>
                </Td>
                <Td fontSize={"14px"}
                    fontWeight={"400"}
                    color={txtColor1}>
                    {t(item?.type)}
                </Td>
            </Tr>
        );
    };

    const RenderEachRowLabResults = ({ item, index }) => {
        return (
            <Tr backgroundColor={index % 2 === 0 ? "#F9FAFB" : "white"}>
                <Td fontSize={"14px"}
                    fontWeight={"500"}
                    color={txtColor2}>
                    {item?.testtype}
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "#667085",
                        }}
                    >
                        {item?.id}
                    </div>
                </Td>
                <Td fontSize={"14px"}
                    fontWeight={"400"}
                    color={txtColor1}>
                    {item?.expected ? moment(new Date(Number(item.expected))).format("DD/MM/YYYY") : ""}
                </Td>

                <Td fontSize={"14px"}
                    fontWeight={"500"}
                    color={txtColor2}>
                    {`${item?.doctor_firstname || ""} ${item?.doctor_lastname}`}
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
                <Td fontSize="14px" fontWeight="400" color="blue" _hover={item?.image && { cursor: 'pointer' }} onClick={() => {
                    if (item.image) {
                        window.open(item.image, "_blank")
                    }
                }}>
                    {item?.image ?
                        t("report")
                        : "-"
                    }

                </Td>
                <Td>
                    <StatusBox item={item?.status} />
                </Td>


            </Tr>
        );
    };



    async function handleDownloadReferal() {

        await downloadReferal({ center_name: UserState.value.data?.center_name, center_address: UserState.value.data?.center_address, center_phonenumber: UserState.value.data?.center_phonenumber, ...referalData, doctor_firstname: UserState.value.data?.firstname || "", doctor_lastname: UserState.value.data?.lastname || "", doctor_specialization: UserState.value.data?.speciality ? t(UserState.value.data?.speciality) : "", patient_dob: data.dob, patient_address: data.address, patient_firstname: data.firstname, reasonTitle: t("reasonForReferral"), symptomsTitle: t("symptoms"), presentTitle: t("presentMedicationsSuggestions"), pastTitle: t("pastMedicationsSuggestions"), diagnosisTitle: t("pastDiagnosis") })
        showToastSuccess(toast, toastIdRef, t("referralSuccessfullyDownloaded"), t("referralSuccessfullyDownloadedSubheading"))
        onCloseRefer()
    }
    const doctorLinks = GetLinkItems(page);
    return (
        <Sidebar LinkItems={doctorLinks} settingsLink={page == 'admin' ? "/admin/settings" : null}>
            {data ? (

                <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column" overflowX={'auto'}>
                    <HStack fontSize="14px" fontWeight="500" color="#667085">
                        <Link href={pathname.replace(/\/[^\/]*$/, "")}>{t("patient")}</Link>
                        <ChevronRightIcon />
                        <Text color={colorMode === 'dark' ? 'gray.300' : "#344054"}>{t("patientDetails")}</Text>
                    </HStack>
                    <Text color={colorMode === 'dark' && 'gray.300'} variant="heading">{t("patientDetails")}</Text>

                    <HStack width={"100%"} justifyContent={"space-between"}>
                        <HStack spacing={10}>
                            <Image
                                src={"/assets/patient.png"}
                                height={"60px"}
                                width={"60px"}
                                borderRadius={"50px"}
                            />
                            <VStack spacing={0} alignItems={"flex-start"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant="heading" fontSize="24px">
                                    {data?.firstname +
                                        " " +
                                        data?.lastname}
                                </Text>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant="description" fontSize="16px" fontWeight="400">
                                    PT{data?.id + " - " + data?.insurancenumber}
                                </Text>
                            </VStack>
                        </HStack>
                        {page == 'doctor' && <HStack>

                            <Button
                                onClick={() => {
                                    setReferalData({
                                        reason: "",
                                        symptoms: "",
                                        present: "",
                                        past: "",
                                        diagnosis: "",
                                    });
                                    onOpenRefer()
                                }}
                                variant="outline"
                                backgroundColor={"#FFFFFF"}
                                color={"black"}
                                leftIcon={<Icon as={HiMiniArrowUturnRight} />}
                                fontWeight={"500"}
                            >
                                {t("referPatient")}
                            </Button>

                            {/* <Link href={`${pathname}/prescribemedicine`}>
                                <Button
                                    variant="outline"
                                    backgroundColor={"#FFFFFF"}
                                    color={"black"}
                                    leftIcon={<Icon as={MdOutlineModeEdit} />}
                                    fontWeight={"500"}
                                >
                                    {t("prescribeMedicine")}
                                </Button>
                            </Link> */}
                            {/* <Button
                variant="outline"
                backgroundColor={"#FFFFFF"}
                color={"black"}
                leftIcon={<Icon as={LuFilePlus2} />}
                fontWeight={"500"}
              >
                {t("requestLabTest")}
              </Button>
              <Button
                variant="outline"
                backgroundColor={"#FFFFFF"}
                color={"black"}
                leftIcon={<Icon as={LuCalendarPlus} />}
                fontWeight={"500"}
              >
                {t("addAppointment")}
              </Button> */}
                        </HStack>}
                    </HStack>
                    <Tabs>
                        <TabList
                            borderBottomWidth={"1px"}
                            borderBottomColor={bdBottom}
                        >
                            {[
                                t("basicInfo"),
                                t("insurance"),
                                t("appointment"),
                                t("labResults"),
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
                                <VStack alignItems={"flex-start"} minWidth={"60%"} spacing={5}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="heading" fontSize={"18px"}>
                                        {t("personalInfo")}
                                    </Text>
                                    <InputRow
                                        disabled={true}
                                        title={t("firstName")}
                                        value={data?.firstname || ""}
                                    />

                                    <InputRow
                                        disabled={true}
                                        title={t("lastName")}
                                        value={data?.lastname || ""}
                                    />

                                    <InputRow
                                        disabled={true}
                                        title={t("dob")}
                                        value={data?.dob ? moment(new Date(Number(data?.dob))).format("DD/MM/YYYY") : data?.dob || ""}
                                    />

                                    <InputRow
                                        disabled={true}
                                        title={t("gender")}
                                        value={data?.gender ? t(data.gender) : data?.gender || ""}
                                    />

                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="heading" fontSize={"18px"}>
                                        {t("contact")}
                                    </Text>
                                    <InputRow
                                        disabled={true}
                                        title={t("email")}
                                        value={data?.email || ""}
                                    />

                                    <InputRow
                                        disabled={true}
                                        title={t("phoneNumber")}
                                        value={data?.number || ""}
                                    />

                                    <InputRow
                                        disabled={true}
                                        title={t("homeAddress")}
                                        value={data?.address || ""}
                                    />
                                </VStack>
                            </TabPanel>
                            <TabPanel>
                                {data.insurances.length > 0 && data.insurances.map((item, index) => (
                                    <VStack key={index} alignItems={"flex-start"} minWidth={"60%"} spacing={5}>
                                        {JSON.parse(item).insurancecard &&
                                            <ImageRow title={t("insuranceCard")} image={JSON.parse(item).insurancecard} clickable={true} />}

                                        <InputRow
                                            title={t("insuranceProvider")}
                                            value={JSON.parse(item)?.insuranceprovider}
                                            disabled={true}
                                        />

                                        <InputRow
                                            title={t("insuranceCardID")}
                                            value={JSON.parse(item)?.insurancenumber}
                                            disabled={true}
                                        />

                                        <InputRow
                                            title={t("insuranceExpiry")}
                                            value={JSON.parse(item)?.insuranceexpiry ? moment(new Date(Number(JSON.parse(item)?.insuranceexpiry))).format("DD/MM/YYYY") : JSON.parse(item)?.insuranceexpiry}
                                            disabled={true}
                                        />

                                        <InputRow
                                            title={t("coveragePercentage")}
                                            value={JSON.parse(item)?.insurancepercentage}
                                            disabled={true}
                                        />
                                        <Divider />
                                    </VStack>
                                ))}

                            </TabPanel>
                            <TabPanel width="100%">
                                <VStack alignItems="flex-start" minW="60%" spacing={5}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="heading" fontSize="18px">
                                        {t("appointment")}
                                    </Text>
                                    <Box
                                        width="100%"
                                        border={"1px solid"}
                                        borderRadius={"8px"}
                                        borderColor={bdColorCustom}
                                    >
                                        <TableContainer overflowX="auto">
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        {[
                                                            t("date"),
                                                            t("time"),
                                                            t("doctor"),
                                                            t("reason"),
                                                            t("type"),
                                                            t("status"),
                                                            t("medicalRecord")
                                                        ].map((item, index) => (
                                                            <Th
                                                                padding={"16px"}
                                                                key={index}
                                                                fontSize="12px"
                                                                fontWeight="500"
                                                                color="#667085"
                                                                whiteSpace="nowrap"
                                                                isTruncated
                                                            >
                                                                {item}
                                                            </Th>
                                                        ))}
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {appointment.length > 0 &&
                                                        appointment.map((item, index) => (
                                                            <RenderEachRow
                                                                key={index}
                                                                item={item}
                                                                index={index}
                                                            />
                                                        ))}
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                        <HStack justifyContent="space-between" p={5}>
                                            <div>
                                                <GhostButton

                                                >
                                                    {t("previous")}
                                                </GhostButton>
                                            </div>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">Page 1 of 1</Text>
                                            <div>
                                                <GhostButton

                                                >
                                                    {t("next")}
                                                </GhostButton>
                                            </div>
                                        </HStack>
                                    </Box>
                                </VStack>
                            </TabPanel>

                            <TabPanel width="100%">
                                <VStack alignItems="flex-start" minW="60%" spacing={5}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="heading" fontSize="18px">
                                        {t("labResults")}
                                    </Text>
                                    <HStack align={"flex-start"}>
                                        <Box
                                            onClick={() => setLabResultOption(0)}
                                            _hover={{ cursor: "pointer", opacity: 0.7 }}
                                            px={'30px'}
                                            h={"28px"}
                                            display={"flex"}
                                            alignItems={"center"}
                                            justifyContent={"center"}
                                            borderRadius={"16px"}
                                            bg={labResultOption == 0 ? "#EFF4FF" : "#F2F4F7"}
                                            color={labResultOption == 0 ? theme.color.primary : "#000000"}
                                            fontSize={"14px"}
                                            fontWeight={"500"}
                                        >
                                            <div>
                                                <Text>{t("testResults")}</Text>
                                            </div>
                                        </Box>
                                        <Box
                                            onClick={() => setLabResultOption(1)}
                                            _hover={{ cursor: "pointer", opacity: 0.7 }}
                                            px={'30px'}
                                            h={"28px"}
                                            display={"flex"}
                                            alignItems={"center"}
                                            justifyContent={"center"}
                                            borderRadius={"16px"}
                                            bg={labResultOption == 1 ? "#EFF4FF" : "#F2F4F7"}
                                            color={labResultOption == 1 ? theme.color.primary : "#000000"}
                                            fontSize={"14px"}
                                            fontWeight={"500"}
                                        >
                                            <div>
                                                <Text>{t("imagingResults")}</Text>
                                            </div>
                                        </Box>
                                    </HStack>
                                    {labResultOption == 0 ? (
                                        <Box
                                            width="100%"
                                            border={"1px solid"}
                                            borderRadius={"8px"}
                                            borderColor={bdColorCustom}
                                        >
                                            <TableContainer overflowX="auto">
                                                <Table variant="simple" size="sm">
                                                    <Thead>
                                                        <Tr>
                                                            {[
                                                                t("testType"),
                                                                t("expectedDate"),
                                                                t("requestedBy"),
                                                                t("report"),
                                                                t("status"),
                                                            ].map((item, index) => (
                                                                <Th
                                                                    padding={"16px"}
                                                                    key={index}
                                                                    fontSize="12px"
                                                                    fontWeight="500"
                                                                    color="#667085"
                                                                    whiteSpace="nowrap"
                                                                    isTruncated>
                                                                    {item}
                                                                </Th>
                                                            ))}
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {labRecords.length > 0 &&
                                                            labRecords.map((item, index) => (
                                                                item.requesttype === "labTest" &&
                                                                <RenderEachRowLabResults
                                                                    key={index}
                                                                    item={item}
                                                                    index={index}
                                                                />
                                                            ))}
                                                    </Tbody>
                                                </Table>
                                            </TableContainer>
                                            <HStack justifyContent="space-between" p={5}>
                                                <div>
                                                    <GhostButton

                                                    >
                                                        {t("previous")}
                                                    </GhostButton>
                                                </div>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">Page 1 of 1</Text>
                                                <div>
                                                    <GhostButton

                                                    >
                                                        {t("next")}
                                                    </GhostButton>
                                                </div>
                                            </HStack>
                                        </Box>
                                    ) : (
                                        <Box
                                            width="100%"
                                            border={"1px solid"}
                                            borderRadius={"8px"}
                                            borderColor={bdColorCustom}
                                        >
                                            <TableContainer overflowX="auto">
                                                <Table variant="simple" size="sm">
                                                    <Thead>
                                                        <Tr>
                                                            {[
                                                                t("testType"),
                                                                t("expectedDate"),
                                                                t("requestedBy"),
                                                                t("report"),
                                                                t("status"),
                                                            ].map((item, index) => (
                                                                <Th
                                                                    padding={"16px"}
                                                                    key={index}
                                                                    fontSize="12px"
                                                                    fontWeight="500"
                                                                    color="#667085"
                                                                    whiteSpace="nowrap" // Prevent text wrapping
                                                                    isTruncated // Ensure text truncation
                                                                >
                                                                    {item}
                                                                </Th>
                                                            ))}
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {labRecords.length > 0 &&
                                                            labRecords.map((item, index) => (
                                                                item.requesttype !== "labTest" &&
                                                                <RenderEachRowLabResults
                                                                    key={index}
                                                                    item={item}
                                                                    index={index}
                                                                />
                                                            ))}
                                                    </Tbody>
                                                </Table>
                                            </TableContainer>
                                            <HStack justifyContent="space-between" p={5}>
                                                <div>
                                                    <GhostButton

                                                    >
                                                        {t("previous")}
                                                    </GhostButton>
                                                </div>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">Page 1 of 1</Text>
                                                <div>
                                                    <GhostButton

                                                    >
                                                        {t("next")}
                                                    </GhostButton>
                                                </div>
                                            </HStack>
                                        </Box>
                                    )}
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
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
                                        backgroundColor: "#FEE4E2",
                                        border: "6px solid",
                                        borderColor: "#FEF3F2",
                                        height: "40px",
                                        width: "40px",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <DeleteIcon height={"20px"} width={"18px"} color={"red"} />
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogCloseButton />
                            <AlertDialogBody>
                                <VStack alignItems={"flex-start"} spacing={2}>
                                    <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontSize={"18px"} fontWeight={"500"}>
                                        {t("deletePatientRecord")}
                                    </Text>
                                    <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"} fontSize={"14px"} fontWeight={"400"}>
                                        {t("deletePatientRecordDescription")}
                                    </Text>
                                </VStack>
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <GhostButton
                                    onClick={onClose}
                                >
                                    {t("cancel")}
                                </GhostButton>
                                <Button backgroundColor="#D92D20" ml={3}>
                                    {t("delete")}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog
                        motionPreset="slideInBottom"
                        onClose={onCloseRefer}
                        isOpen={isOpenRefer}
                        isCentered
                    >
                        <AlertDialogOverlay bg={"#344054B2"} />

                        <AlertDialogContent width={"800px"} maxW={'800px'}>

                            <AlertDialogCloseButton />
                            <AlertDialogBody>
                                <VStack
                                    alignItems={"flex-start"}
                                    gap={8}
                                    px={"32px"}
                                    width={"100%"}
                                    overflowY={"auto"}
                                >

                                    <HStack align={'flex-start'} gap={10} pt={10} w={'100%'}>
                                        <VStack align={'flex-start'} w={'inherit'}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                                {t("patientContactDetail")}
                                            </Text>
                                            <VStack gap={0} align={"inherit"} width={"100%"}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("name")}
                                                </Text>
                                                <Input
                                                    value={`${data?.firstname} ${data?.lastname}`}
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
                                                        data?.dob
                                                            ? moment(
                                                                new Date(Number(data?.dob))
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
                                                    value={data?.email}
                                                    resize="none"
                                                    isDisabled
                                                />
                                            </VStack>

                                            <VStack gap={0} align={"inherit"} width={"100%"}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("phoneNumber")}
                                                </Text>
                                                <Input
                                                    value={data?.number}
                                                    resize="none"
                                                    isDisabled
                                                />
                                            </VStack>

                                            <VStack gap={0} align={"inherit"} width={"100%"}>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                                    {t("homeAddress")}
                                                </Text>
                                                <Textarea
                                                    value={data?.address}
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
                                        </VStack>
                                        <VStack align={'flex-start'} w={'inherit'}>


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
                                        </VStack>
                                    </HStack>


                                    <div style={{ width: "100%", paddingBottom: '10px' }}>
                                        <Button
                                            onClick={() => handleDownloadReferal()}
                                            style={{ width: "100%" }}
                                        >
                                            {t("downloadReferral")}
                                        </Button>
                                    </div>
                                </VStack>
                            </AlertDialogBody>
                        </AlertDialogContent>
                    </AlertDialog>
                </Flex>
            ) : <Center height={'100vh'} width={'100%'}>
                <Spinner />
            </Center>}
        </Sidebar>
    );
}

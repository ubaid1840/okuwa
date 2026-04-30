"use client";
import Button, { DangerButton, GhostButton } from "@/components/ui/Button";
import { theme } from "@/data/data";
import {
    ArrowBackIcon,
} from "@chakra-ui/icons";

import {
    Flex,
    HStack,
    Text,
    useToast,
    VStack,
    Icon,
    Input,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    useDisclosure,
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
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    HiMiniArrowUturnRight,
} from "react-icons/hi2";
import { useRef, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import PrescriptionCard from "@/components/ui/prescriptionCard";
import { useTranslations } from "next-intl";
import moment from "moment";
import DoctorChatComponent from "@/components/chat/DoctorChatComponent";
import downloadReferal from "@/functions/referalPDF";
import { showToastSuccess } from "@/utils/toastUtils";

const AppointmentRecord = ({ selectedAppointment, myEmail, medicalRecordData, prescriptionData, onReturn }) => {


    const t = useTranslations("Dictionary")
    const [selectedOption, setSelectedOption] = useState(0)
    const { isOpen: isOpenCall, onClose: onCloseCall, onOpen: onOpenCall } = useDisclosure()
    const toastIdRef = useRef(null);
    const toast = useToast();

    const [referalData, setReferalData] = useState({
        reason: "",
        symptoms: "",
        present: "",
        past: "",
        diagnosis: "",
    });
    const { colorMode } = useColorMode()
    const bgColor = useColorModeValue("#FFFFFF", "gray.800")
    const bgColor1 = useColorModeValue("#F9FAFB", "gray.700")
    const bdColor = useColorModeValue(theme.divider.primary, "gray.600")

    async function handleDownloadReferal() {
        await downloadReferal({
            ...selectedAppointment,
            ...referalData,
            doctor_specialization: t(selectedAppointment?.doctor_specialization),
            reasonTitle: t("reasonForReferral"),
            symptomsTitle: t("symptoms"),
            presentTitle: t("presentMedicationsSuggestions"),
            pastTitle: t("pastMedicationsSuggestions"),
            diagnosisTitle: t("pastDiagnosis"),
        });
        showToastSuccess(toast, toastIdRef, t("referralSuccessfullyDownloaded"), t("referralSuccessfullyDownloadedSubheading"))
    }


    return (
        <Flex flex={1} overflowX={"auto"} height={"100vh"}>
            <Flex bg={bgColor} width={"30%"} height={"100%"}>
                <VStack width={"100%"} gap={5} py={"20px"}>
                    <VStack width={"100%"} gap={5} alignItems={"flex-start"}>
                        <HStack gap={5} px={"20px"}>
                            <IconButton
                                onClick={onReturn}
                                width={"50px"}
                                variant={"outline"}
                                icon={<ArrowBackIcon boxSize={5} />}
                            />
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
                        disableCall={true}
                        email={selectedAppointment.patient_email}
                        myEmail={myEmail}
                        name={
                            selectedAppointment.patient_firstname +
                            " " +
                            selectedAppointment.patient_lastname
                        }
                        onOpenCall={() => {
                            onOpenCall();
                        }}
                    />
                </VStack>
            </Flex>

            <Flex
                bg={bgColor1}
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
                                    <Icon as={FaRegUser} />
                                </div>
                            }
                            fontWeight={"500"}
                        >
                            {t("record")}
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
                </Wrap>
                <Divider mt={"11px"} />
                {selectedOption == 0 && (
                    <Tabs mx={"32px"} overflowY={"auto"}>
                        <TabList
                            borderBottomWidth={"1px"}
                            borderBottomColor={bdColor}
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
                                    {/* <VStack gap={0} align={"inherit"}>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                    {t("height")}
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {selectedAppointment.patient_height}
                  </Text>
                </VStack>
                <VStack gap={0} align={"inherit"}>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                    {t("weight")}
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {selectedAppointment.patient_weight}
                  </Text>
                </VStack> */}
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
                                            <Tr backgroundColor={colorMode == 'light' ? "#FFFFFF" : "gray.800"}>
                                                {[t("date"), t("diagnosis")].map(
                                                    (item, index) => (
                                                        <Th
                                                            key={index}
                                                            fontSize={"12px"}
                                                            fontWeight={"500"}
                                                            color="#667085"
                                                        >
                                                            {item}
                                                        </Th>
                                                    )
                                                )}
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {medicalRecordData.map((item, index) => (
                                                <Tr key={index} color={colorMode == 'light' ? "#475467" : "gray.300"}>
                                                    <Td
                                                        fontSize={"14px"}
                                                        fontWeight={"400"}

                                                    >
                                                        {moment(
                                                            new Date(Number(item?.created))
                                                        ).format("DD MMM YYYY")}
                                                    </Td>
                                                    <Td
                                                        fontSize={"14px"}
                                                        fontWeight={"400"}

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

                {selectedOption == 1 && (
                    <VStack alignItems={"flex-start"} spacing={5} p={5}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                            {t("basicInfo")}
                        </Text>
                        <HStack align={"flex-start"} width={"100%"} maxW={"500px"}>
                            <VStack gap={0} align={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                    {t("firstName")}
                                </Text>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                    {selectedAppointment?.patient_firstname || ""}
                                </Text>
                            </VStack>
                            <Spacer />
                            <VStack gap={0} align={"flex-end"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                    {t("lastName")}
                                </Text>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                    {selectedAppointment?.patient_lastname || ""}
                                </Text>
                            </VStack>
                        </HStack>
                        {selectedAppointment.patient_insurances.length > 0 && selectedAppointment.patient_insurances.map((item, index) => (
                            <VStack key={index} w={'100%'} align={'inherit'} spacing={5}>
                                <HStack align={"flex-start"} width={"100%"} maxW={"500px"}>
                                    <VStack gap={0} align={"inherit"}>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                            {t("insuranceProvider")}
                                        </Text>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                            {JSON.parse(item)?.insuranceprovider}
                                        </Text>
                                    </VStack>
                                    <Spacer />
                                    <VStack gap={0} align={"flex-end"}>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                            {t("insuranceNumber")}
                                        </Text>
                                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                            {JSON.parse(item)?.insurancenumber}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <HStack align={"flex-start"} width={"100%"} maxW={"500px"}>
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
                                    <Spacer />
                                    <VStack gap={0} align={"flex-end"}>
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
                                </HStack>
                            </VStack>)
                        )}

                        <HStack align={"flex-start"} width={"100%"} maxW={"500px"}>
                            <VStack gap={0} align={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                    {t("invoiced")}
                                </Text>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                    {selectedAppointment?.invoiced}
                                </Text>
                            </VStack>
                            <Spacer />
                            <VStack gap={0} align={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                    {t("paidByPatient")}
                                </Text>
                                <Text
                                    variant={"subheading"}
                                    fontSize={"14px"}
                                    color={"red"}
                                >
                                    {selectedAppointment?.patientamount}
                                </Text>
                            </VStack>
                            <Spacer />
                            <VStack gap={0} align={"flex-end"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                    {t("insuranceCovered")}
                                </Text>
                                <Text
                                    variant={"subheading"}
                                    fontSize={"14px"}
                                    color={"green"}
                                >
                                    {selectedAppointment?.insuranceamount}
                                </Text>
                            </VStack>
                        </HStack>
                        <VStack gap={2} align={"inherit"}>
                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                                {t("notesForDoctor")}
                            </Text>
                            <UnorderedList
                                ml={5}
                                fontSize={"14px"}
                                fontWeight={"500"}
                                color={colorMode == "light" ? "#344054" : "gray.300"}
                            >
                                <ListItem>{selectedAppointment?.notes}</ListItem>
                            </UnorderedList>
                        </VStack>

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
                                {selectedAppointment.medicalRecords.length > 0 &&
                                    selectedAppointment.medicalRecords
                                        .filter(
                                            (eachRecord) =>
                                                eachRecord.appointmentid ===
                                                selectedAppointment.id
                                        )
                                        .map((item, index) => (
                                            <ListItem key={index}>{item.diagnosis}</ListItem>
                                        ))}
                            </UnorderedList>
                        </VStack>

                        {selectedAppointment.medicalRecords.length > 0 &&
                            selectedAppointment.medicalRecords
                                .filter(
                                    (eachRecord) =>
                                        eachRecord.appointmentid === selectedAppointment.id
                                )
                                .map(
                                    (item) =>
                                        item.prescription &&
                                        item.prescription.length > 0 &&
                                        item.prescription.map((item, index) => {
                                            const each = JSON.parse(item);
                                            return (
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
                                            );
                                        })
                                )}
                    </VStack>
                )}

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
                                            new Date(Number(selectedAppointment?.patient_dob))
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
                            <Textarea
                                resize="none"
                                height={"140px"}
                                value={referalData.symptoms}
                                onChange={(e) =>
                                    setReferalData((prevState) => {
                                        const newState = { ...prevState };
                                        newState.symptoms = e.target.value;
                                        return newState;
                                    })
                                }
                            />
                        </VStack>
                        <VStack gap={0} align={"inherit"} width={"100%"}>
                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                {t("presentMedicationsSuggestions")}
                            </Text>
                            <Textarea
                                resize="none"
                                height={"140px"}
                                value={referalData.present}
                                onChange={(e) =>
                                    setReferalData((prevState) => {
                                        const newState = { ...prevState };
                                        newState.present = e.target.value;
                                        return newState;
                                    })
                                }
                            />
                        </VStack>

                        <VStack gap={0} align={"inherit"} width={"100%"}>
                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                {t("pastMedicationsSuggestions")}
                            </Text>
                            <Textarea
                                resize="none"
                                height={"140px"}
                                value={referalData.past}
                                onChange={(e) =>
                                    setReferalData((prevState) => {
                                        const newState = { ...prevState };
                                        newState.past = e.target.value;
                                        return newState;
                                    })
                                }
                            />
                        </VStack>

                        <VStack gap={0} align={"inherit"} width={"100%"}>
                            <Text color={colorMode === 'dark' && 'gray.300'} variant={"pastDiagnosis"} fontSize={"14px"}>
                                {t("pastDiagnosis")}
                            </Text>
                            <Textarea
                                resize="none"
                                height={"140px"}
                                value={referalData.diagnosis}
                                onChange={(e) =>
                                    setReferalData((prevState) => {
                                        const newState = { ...prevState };
                                        newState.diagnosis = e.target.value;
                                        return newState;
                                    })
                                }
                            />
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
    )
}

export default AppointmentRecord
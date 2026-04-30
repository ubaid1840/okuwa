import { theme } from "@/data/data"
import { Avatar, Box, Center, Divider, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, ListItem, Menu, MenuButton, Spinner, Tab, TabIndicator, Table, TableContainer, TabList, TabPanel, TabPanels, Tabs, Tbody, Td, Text, Th, Thead, Tr, UnorderedList, useColorModeValue, VStack } from "@chakra-ui/react"
import { useTranslations } from "next-intl"
import { FaRegUser } from "react-icons/fa"
import Button, { GhostButton } from "./ui/Button"
import { useEffect, useState } from "react"
import { RiShareBoxLine } from "react-icons/ri"
import { CiSearch } from "react-icons/ci"
import { patientList } from "@/app/doctor/messages/data"
import { IoFilterSharp } from "react-icons/io5"
import axios from "axios"
import InputRow from "./ui/InputRow"
import PrescriptionCard from "./ui/prescriptionCard"
import moment from "moment"


const StaffInformation = ({ data, onReturnClick, role, page, colorMode }) => {
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

    const t = useTranslations('Dictionary')
    const [selected, setSelected] = useState('staff')
    const [allPatients, setAllPatients] = useState([])
    const [search, setSearch] = useState("")
    const [patientLoading, setPatientLoading] = useState(false)

    useEffect(() => {
        if (selected === 'patient' && data?.centerid) {
            axios.post("/api/patient/getall", { centerid: data.centerid })
                .then((response) => {
                    setPatientLoading(false)

                    setAllPatients(response.data)
                }).catch((e) => {
                    console.log(e?.response?.data)
                })
        }
    }, [selected])
    return (
        <VStack w={'100%'} gap={"20px"} align={'flex-start'}>
            <HStack width={'100%'} justify={'space-between'} pr={20}>
                <div style={{ width: "100%" }}>
                    <Text color={colorMode === 'dark' && 'gray.300'} variant="heading" fontSize={'18px'}> {t("staffInformation")}</Text>
                </div>
                <HStack >
                    <Box
                        _hover={{ cursor: 'pointer' }}
                        onClick={() => setSelected('staff')}
                        height={"36px"}
                        width={"36px"}
                        backgroundColor={selected == 'staff' ? theme.color.primary : '#FFFFFF'}
                        color={selected == 'staff' ? "white" : 'black'}
                        border={"1px solid"}
                        borderColor={selected == 'staff' ? theme.color.primary : bdColor}
                        borderRadius={"8px"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        <Icon as={FaRegUser} boxSize={4} />
                    </Box>
                    {page === 'doctor' && role === 'doctor' ?
                        <Box
                            _hover={{ cursor: 'pointer' }}
                            onClick={() => {
                                setPatientLoading(true)
                                setSelected('patient')
                            }}
                            height={"36px"}
                            width={"36px"}
                            backgroundColor={selected == 'patient' ? theme.color.primary : '#FFFFFF'}
                            color={selected == 'patient' ? "white" : 'black'}
                            border={"1px solid"}
                            borderColor={selected == 'patient' ? theme.color.primary : bdColor}
                            borderRadius={"8px"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Icon as={RiShareBoxLine} boxSize={4} />
                        </Box>
                        : null
                    }
                </HStack>

            </HStack>
            <Divider color={theme.divider.primary} />
            {selected == 'staff'
                ?
                <VStack alignItems={"flex-start"} spacing={5}>
                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                        {t("personalInfo")}
                    </Text>
                    <VStack gap={0} align={"inherit"}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                            {role == 'admin' ? t("name") : t("firstName")}
                        </Text>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                            {data.firstName}
                        </Text>
                    </VStack>
                    {role != 'admin' &&
                        <>
                            <VStack gap={0} align={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                    {t("lastName")}
                                </Text>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                    {data.lastName}
                                </Text>
                            </VStack>
                            <VStack gap={0} align={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                    {t("dob")}
                                </Text>
                                <Text
                                color={colorMode === 'dark' && 'gray.300'}
                                    variant={"subheading"}
                                    fontSize={"14px"}
                                > {data.dob}</Text>
                            </VStack>
                            <VStack gap={0} align={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                    {t("gender")}
                                </Text>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                    {data.gender}
                                </Text>
                            </VStack>
                        </>
                    }
                    <Divider />
                    <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"18px"}>
                        {t("contact")}
                    </Text>
                    <VStack gap={0} align={"inherit"}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                            {t("email")}
                        </Text>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                            {data.email}
                        </Text>
                    </VStack>
                    {role != 'admin' &&
                        <>
                            <VStack gap={0} align={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                    {t("phoneNumber")}
                                </Text>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                    {data.phoneNumber}
                                </Text>
                            </VStack>
                            <VStack gap={0} align={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
                                    {t("homeAddress")}
                                </Text>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"subheading"} fontSize={"14px"}>
                                    {data.homeAddress}
                                </Text>
                            </VStack>

                        </>
                    }
                </VStack>
                :
                <VStack width={'100%'} gap={5} pt={2}>
                    <div style={{ display: "flex", width: "100%" }}>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={CiSearch} boxSize={5} color="#667085" />
                            </InputLeftElement>
                            <Input placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} />
                        </InputGroup>

                    </div>
                    {patientLoading ?
                        <Center>
                            <Spinner />
                        </Center>
                        :
                        <VStack
                            align={"flex-start"}
                            gap={0}
                            width={"100%"}
                        >
                            {allPatients.length > 0 && allPatients.filter((item) => {
                                const string = `${item?.firstname} ${item.lastname}`
                                if (string.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
                                    return item
                                }
                            })
                                .map((item, index) => (
                                    <HStack
                                        borderBottomWidth={1}
                                        borderBottomColor={theme.divider.primary}
                                        p={3}
                                        bg={"white"}
                                        width={"100%"}
                                        justify={"space-between"}
                                        key={index}
                                    >
                                        <HStack>
                                            <VStack align={"flex-start"} gap={0}>
                                                <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontWeight={'600'} fontSize={'18px'}>
                                                    {`${item?.firstname} ${item?.lastname}`}
                                                </Text>
                                                <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"}>PT{item?.id}</Text>
                                            </VStack>
                                        </HStack>
                                        <div>
                                            <Button
                                                onClick={onReturnClick}
                                                backgroundColor={"#EFF4FF"}
                                                color={"#004EEB"}
                                                leftIcon={<Icon as={RiShareBoxLine} boxSize={4} />}
                                                fontWeight={"500"}
                                            >
                                                {t('share')}
                                            </Button>
                                        </div>
                                    </HStack>
                                ))}
                        </VStack>
                    }
                </VStack>}

        </VStack>
    )

}

export const PatientInformation = ({ id, role, centerid }) => {

    const t = useTranslations('Dictionary')
    const [patientLoading, setPatientLoading] = useState(true)
    const [medicalRecord, setMedicalRecord] = useState([])
    const [prescriptionData, setPrescriptionData] = useState([])
    const [data, setData] = useState()

    useEffect(() => {
        fetchData(id, centerid)
        return () => {
            setData()
            setMedicalRecord([])
            setPrescriptionData([])
            setPatientLoading(true)
        };
    }, [])

    async function fetchData(id, centerid) {

        await axios.post("/api/patient/single", { patientid: id, centerid: centerid })
            .then((response) => {
                setPatientLoading(false)
                setData(response.data.patient)
                setMedicalRecord(response.data.medicalRecords)
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
                setPatientLoading(false)
            })

    }

    const RenderEachRowMedicalRecord = ({ item, index }) => {
        const txtColor1 = useColorModeValue("#475467", "gray.300")
        const txtColor2 = useColorModeValue("#101828", "gray.300")
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
                        // Adjust based on your design needs
                        // overflow="hidden"
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

    // 

    return (
        <VStack w={'100%'} align={'flex-start'}>
            <HStack width={'100%'} justify={'space-between'}>
                <div style={{ width: "100%", paddingTop: '32px', paddingBottom: '32px', paddingRight: '20px', paddingLeft: '20px' }}>
                    <Text color={colorMode === 'dark' && 'gray.300'} variant="heading" fontSize={'18px'}> {t("patientInformation")}</Text>
                </div>


            </HStack>
            <Divider color={theme.divider.primary} />
            {patientLoading ?
                <Center w={'100%'} mt={2}>
                    <Spinner />
                </Center> :
                <Tabs p={'10px'}>
                    <TabList
                        borderBottomWidth={"1px"}
                        borderBottomColor={theme.divider.primary}
                    >
                        {[
                            t("basicInfo"),
                            t("medicalRecord"),
                            t("prescription"),
                            // t("labResults"),
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


                        <TabPanel width="100%">
                            <VStack alignItems="flex-start" minW="60%" spacing={5}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant="heading" fontSize="18px">
                                    {t("medicalRecord")}
                                </Text>
                                <Box
                                    width="100%"
                                    border={"1px solid"}
                                    borderRadius={"8px"}
                                    borderColor={"#EAECF0"}
                                >
                                    <TableContainer overflowX="auto">
                                        <Table variant="simple" size="sm">
                                            <Thead>
                                                <Tr>
                                                    {[
                                                        t("date"),
                                                        t("location"),
                                                        t("doctor"),
                                                        t("diagnosis"),
                                                        t("consultationType"),
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
                                                {medicalRecord.length > 0 &&
                                                    medicalRecord.map((item, index) => (
                                                        <RenderEachRowMedicalRecord
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
                                        color={"#344054"}
                                    >
                                        {prescriptionData.length > 0 &&
                                            prescriptionData.map((item, index) => (
                                                <ListItem key={index}>{item.diagnosis}</ListItem>
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

                    </TabPanels>
                </Tabs>

            }


        </VStack>
    )

}

export default StaffInformation
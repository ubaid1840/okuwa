'use client'

import Button from "@/components/ui/Button"
import { CloseIcon } from "@chakra-ui/icons"
import { Box, VStack, HStack, Text, Icon, Divider, Avatar, useColorMode, useColorModeValue } from "@chakra-ui/react"
import moment from "moment"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { CiCalendar } from "react-icons/ci"
import Link from "next/link"
import StatusBox from "@/components/ui/StatusBox"
import axios from "axios"


const Component = ({ selectedAppointment, onReturn, visible }) => {
    const {colorMode} = useColorMode()
    const router = useRouter()
    async function handleStartConsultation() {
        axios.post("/api/update", {
            table: 'appointment', 
            columns: ['status', 'starttime'], 
            values: ['ongoing', moment().valueOf()], 
            conditions: {
              column: 'id', 
              operator: '=', 
              value: selectedAppointment.id, 
            }
          })
      
        router.push(`${pathname}/consultation?id=${selectedAppointment.id}`)
    }
    const pathname = usePathname()
    const t = useTranslations("Dictionary")
    const bgColor = useColorModeValue("white", "gray.800")
    const bgColor2 = useColorModeValue("#F2F4F7", "gray.500")
    return (
        visible &&
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
            zIndex={2}
        >
            <Box
                width={"580px"}
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
                            onClick={() => onReturn(false)}
                            _hover={{ cursor: "pointer", opacity: 0.7 }}
                        />
                    </div>
                    <HStack width={"100%"} justifyContent={"space-between"}>
                        <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"}fontSize={"20px"} fontWeight={"500"} >
                            {t("appointmentDetails")}
                        </Text>
                    </HStack>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"16px"}>
                        {t("appointmentInformation")}
                    </Text>
                    <HStack width={"100%"} justify={"space-between"}>
                        <HStack gap={2}>
                            <Box
                                bg={bgColor2}
                                height={"56px"}
                                width={"56px"}
                                borderRadius={"30px"}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                            >
                                <Icon as={CiCalendar} boxSize={7} />
                            </Box>
                            <VStack align={"flex-start"} justify={"center"} gap={0}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading" fontSize={"16px"}>
                                    {`${moment(
                                        new Date(Number(selectedAppointment.appointmentdate))
                                    ).format("DD MMM YYYY, hh:mm A")}`}
                                </Text>
                                <StatusBox item={selectedAppointment?.status} />
                            </VStack>
                        </HStack>
                        <HStack align={"flex-start"} gap={2}></HStack>
                    </HStack>
                    <Divider />
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"16px"}>
                        {t("patientInformation")}
                    </Text>
                    <HStack width={"100%"} justify={"space-between"}>
                        <HStack gap={2}>
                            <Avatar size="lg" src="/assets/patient.png" />
                            <VStack align={"flex-start"} justify={"center"} gap={0}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading" fontSize={"16px"}>
                                    {selectedAppointment?.patient_firstname +
                                        " " +
                                        selectedAppointment?.patient_lastname}
                                </Text>

                                <Text color={colorMode === 'dark' && 'gray.300'}variant="description" fontSize={"14px"}>
                                    {`${selectedAppointment?.patient_gender
                                        ? t(selectedAppointment?.patient_gender)
                                        : "NA"
                                        }, ${selectedAppointment?.patient_dob
                                            ? moment(
                                                new Date(Number(selectedAppointment.patient_dob))
                                            ).format("DD/MM/YYYY")
                                            : "NA"
                                        }`}
                                </Text>
                            </VStack>
                        </HStack>
                    </HStack>
                    <Divider />
                    <VStack align={"flex-start"} gap={4}>
                        <HStack align={"flex-start"}>
                            <div style={{ width: "200px" }}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                                    {t("patientName")}
                                </Text>
                            </div>
                            <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                                {`${selectedAppointment.patient_firstname} ${selectedAppointment.patient_lastname} #${selectedAppointment.id}`}
                            </Text>
                        </HStack>
                        <HStack align={"flex-start"}>
                            <div style={{ width: "200px" }}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                                    {t("phoneNumber")}
                                </Text>
                            </div>
                            <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                                {selectedAppointment.patient_number}
                            </Text>
                        </HStack>
                        <HStack align={"flex-start"}>
                            <div style={{ width: "200px" }}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                                    {t("consultationType")}
                                </Text>
                            </div>
                            <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                                {selectedAppointment.type
                                    ? t(selectedAppointment.type)
                                    : t("inPerson")}
                            </Text>
                        </HStack>

                        <HStack align={"flex-start"}>
                            <div style={{ width: "200px" }}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                                    {t("reason")}
                                </Text>
                            </div>
                            <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                                {selectedAppointment?.reason
                                    ? t(selectedAppointment?.reason)
                                    : ""}
                            </Text>
                        </HStack>
                    </VStack>

                    <Button onClick={() => {
                        handleStartConsultation()
                    }}>{t("startConsultation")}</Button>

                </VStack>
            </Box>
        </Box>
    )
}

export default Component
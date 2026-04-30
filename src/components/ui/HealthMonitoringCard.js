import { Avatar, Box, HStack, VStack, Text, Icon, Divider, useColorMode } from "@chakra-ui/react"
import { GhostButton } from "./Button"
import { IoCallOutline, IoSpeedometerOutline } from "react-icons/io5"
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2"
import { useTranslations } from "next-intl"
import { theme } from "@/data/data"
import { BsHeartPulse } from "react-icons/bs"
import { LiaTemperatureHighSolid } from "react-icons/lia";
import { FiWind } from "react-icons/fi"
import { MdWarningAmber } from "react-icons/md"


export const HealthMonitoringCard = ({ data, type, bdColor, colorMode }) => {

    const Alert = ({ name, type }) => {
        return (
            <HStack py={'2px'} px={'8px'} gap={'10px'} bg={'#FEF3F2'} borderRadius={'50px'} mt={1}>
                <Icon color={'#B42318'} as={MdWarningAmber} />
                <Text  fontSize={'14px'} fontWeight={'500'} color={'#B42318'}>{type} {name}</Text>
            </HStack>
        )
    }

    function checkBloodPressure(item) {
        const temp = item.split('/')
        if (Number(temp[0]) > 125)
            return (
                <HStack width={'50%'}>
                    <Icon color={'#B42318'} boxSize={10} as={BsHeartPulse} />
                    <VStack align={'flex-start'} gap={0}>
                        <Text  color={'#B42318'} fontWeight={'500'} fontSize={'16px'}>{t('bloodPressure')}</Text>
                        <Text  color={'#B42318'} fontWeight={'400'} fontSize={'14px'}>{item} mmHg</Text>
                        <Alert type={'High'} name={'blood pressure'} />
                    </VStack>
                </HStack>

            )
        else if (Number(temp[0]) < 90)
            return (
                <HStack width={'50%'}>
                    <Icon color={'#B42318'} boxSize={10} as={BsHeartPulse} />
                    <VStack align={'flex-start'} gap={0}>
                        <Text  color={'#B42318'} fontWeight={'500'} fontSize={'16px'}>{t('bloodPressure')}</Text>
                        <Text  color={'#B42318'} fontWeight={'400'} fontSize={'14px'}>{item} mmHg</Text>
                        <Alert type={'Low'} name={'blood pressure'} />

                    </VStack>
                </HStack>
            )
        else return (
            <HStack width={'50%'}>
                <Icon boxSize={10} as={BsHeartPulse} />
                <VStack align={'flex-start'} gap={0}>
                    <Text color={colorMode === 'dark' ? 'gray.300' : '#101828'} fontWeight={'500'} fontSize={'16px'}>{t('bloodPressure')}</Text>
                    <Text  color={colorMode === 'dark' ? 'gray.300' : '#667085'} fontWeight={'400'} fontSize={'14px'}>{item} mmHg</Text>
                </VStack>
            </HStack>
        )
    }

    function checkHeartRate(item) {

        if (Number(item) > 100)
            return (
                <HStack>
                    <Icon boxSize={10} as={IoSpeedometerOutline} />
                    <VStack align={'flex-start'} gap={0}>
                        <Text  color={'#B42318'} fontWeight={'500'} fontSize={'16px'}>{t('heartRate')}</Text>
                        <Text  color={'#B42318'} fontWeight={'400'} fontSize={'14px'}>{item} bpm</Text>
                        <Alert type={'High'} name={'heart rate'} />
                    </VStack>
                </HStack>

            )
        else if (Number(item) < 60)
            return (
                <HStack>
                    <Icon boxSize={10} as={IoSpeedometerOutline} />
                    <VStack align={'flex-start'} gap={0}>
                        <Text  color={'#B42318'} fontWeight={'500'} fontSize={'16px'}>{t('heartRate')}</Text>
                        <Text  color={'#B42318'} fontWeight={'400'} fontSize={'14px'}>{item} bpm</Text>
                        <Alert type={'Low'} name={'heart rate'} />
                    </VStack>
                </HStack>
            )
        else return (
            <HStack>
                <Icon boxSize={10} as={IoSpeedometerOutline} />
                <VStack align={'flex-start'} gap={0}>
                    <Text color={colorMode === 'dark' ? 'gray.300' : '#101828'} fontWeight={'500'} fontSize={'16px'}>{t('heartRate')}</Text>
                    <Text color={colorMode === 'dark' ? 'gray.300' : '#667085'}fontWeight={'400'} fontSize={'14px'}>{item} bpm</Text>
                </VStack>
            </HStack>
        )
    }

    function checkTemperature(item) {

        if (Number(item) > 99.1)
            return (
                <HStack width={'50%'}>
                    <Icon boxSize={10} as={LiaTemperatureHighSolid} />
                    <VStack align={'flex-start'} gap={0}>
                        <Text  color={'#B42318'} fontWeight={'500'} fontSize={'16px'}>{t('temperature')}</Text>
                        <Text  color={'#B42318'} fontWeight={'400'} fontSize={'14px'}>{item}°F</Text>
                        <Alert type={'High'} name={'temperature'} />
                    </VStack>
                </HStack>

            )
        else if (Number(item) < 97.8)
            return (
                <HStack width={'50%'}>
                    <Icon boxSize={10} as={LiaTemperatureHighSolid} />
                    <VStack align={'flex-start'} gap={0}>
                        <Text  color={'#B42318'} fontWeight={'500'} fontSize={'16px'}>{t('temperature')}</Text>
                        <Text  color={'#B42318'} fontWeight={'400'} fontSize={'14px'}>{item}°F</Text>
                        <Alert type={'Low'} name={'temperature'} />
                    </VStack>
                </HStack>
            )
        else return (
            <HStack width={'50%'}>
                <Icon boxSize={10} as={LiaTemperatureHighSolid} />
                <VStack align={'flex-start'} gap={0}>
                    <Text color={colorMode === 'dark' ? 'gray.300' : '#101828'} fontWeight={'500'} fontSize={'16px'}>{t('temperature')}</Text>
                    <Text color={colorMode === 'dark' ? 'gray.300' : '#667085'} fontWeight={'400'} fontSize={'14px'}>{item}°F</Text>
                </VStack>
            </HStack>
        )
    }

    function checkRespiratoryRate(item) {

        if (Number(item) > 20)
            return (
                <HStack>
                    <Icon boxSize={10} as={FiWind} />
                    <VStack align={'flex-start'} gap={0}>
                        <Text  color={'#B42318'} fontWeight={'500'} fontSize={'16px'}>{t('respiratoryRate')}</Text>
                        <Text  color={'#B42318'} fontWeight={'400'} fontSize={'14px'}>{item} bpm</Text>
                        <Alert type={'High'} name={'respiratory rate'} />
                    </VStack>
                </HStack>

            )
        else if (Number(item) < 12)
            return (
                <HStack>
                    <Icon boxSize={10} as={FiWind} />
                    <VStack align={'flex-start'} gap={0}>
                        <Text  color={'#B42318'} fontWeight={'500'} fontSize={'16px'}>{t('respiratoryRate')}</Text>
                        <Text  color={'#B42318'} fontWeight={'400'} fontSize={'14px'}>{item} bpm</Text>
                        <Alert type={'Low'} name={'respiratory rate'} />
                    </VStack>
                </HStack>
            )
        else return (
            <HStack>
                <Icon boxSize={10} as={FiWind} />
                <VStack align={'flex-start'} gap={0}>
                    <Text color={colorMode === 'dark' ? 'gray.300' : '#101828'} fontWeight={'500'} fontSize={'16px'}>{t('respiratoryRate')}</Text>
                    <Text color={colorMode === 'dark' ? 'gray.300' :'#667085'} fontWeight={'400'} fontSize={'14px'}>{item} bpm</Text>
                </VStack>
            </HStack>
        )
    }


    const t = useTranslations("Dictionary")
    return (
        <Box border={'1px solid'} borderRadius={'8px'} borderColor={bdColor} p={'16px'} width={'100%'}>
            <VStack align={'flex-start'} width={'100%'} gap={5}>
                <HStack width={'100%'} justify={'space-between'}>
                    <HStack>
                        <Avatar name={data?.patient && `${data.patient.firstname}`} />
                        <VStack align={'flex-start'} gap={0}>
                            <Text color={colorMode === 'dark' ? 'gray.300' : '#101828'} fontWeight={'500'} fontSize={'16px'}>{data?.patient && `${data.patient.firstname} ${data.patient.lastname}`}</Text>
                            <Text color={colorMode === 'dark' ? 'gray.300' : '#667085'} fontWeight={'400'} fontSize={'14px'}>{data.patientid}</Text>
                        </VStack>
                    </HStack>
                   
                </HStack>
                <Divider color={theme.divider.primary} />
                <HStack width={'100%'}>
                    {checkBloodPressure(data?.bloodpressure ? data?.bloodpressure : "/")}
                    {checkHeartRate(Number(data?.heartrate))}
                </HStack>

                <HStack width={'100%'}>
                    {checkTemperature(Number(data?.temperature))}
                    {checkRespiratoryRate(Number(data?.respiratory))}


                </HStack>

            </VStack>
        </Box>
    )
}


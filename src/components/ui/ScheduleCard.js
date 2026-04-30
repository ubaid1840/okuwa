import { HStack, Icon, Spinner, useColorMode, VStack } from "@chakra-ui/react"
import { useTranslations } from "next-intl"
import { Text } from "@chakra-ui/react"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { RxPencil1 } from "react-icons/rx"
import { useState } from "react"
import axios from "axios"




export const ScheduleCard = ({ data, day, refreshFetch }) => {
    const t = useTranslations('Dictionary')
    const {colorMode} = useColorMode()




    const RenderEachItem = ({ item, index }) => {
        async function deleteSchedule(item) {
            axios.post("/api/doctor/schedule/delete", { id: item.id })
                .then((response) => {
                    setLoading(false)
                    refreshFetch()
                })
        }

        const [loading, setLoading] = useState(false)
        return (
            <HStack gap={3}>
                <Text>{item.starttime}</Text>
                <Text>-</Text>
                <Text>{item.endtime}</Text>
                {/* <Icon as={RxPencil1} /> */}
                {loading ?
                    <Spinner size={"sm"} />
                    :
                    <Icon as={DeleteIcon} _hover={{ cursor: "pointer", opacity: 0.7 }} color={'red'} onClick={() => {
                        setLoading(true)
                        deleteSchedule(item)
                    }} />}
            </HStack>
        )
    }
    return (
        <VStack
            width={"100%"}
            align={"flex-start"}
            bg={"#F9FAFB"}
            borderRadius={"8px"}
            border={"1px solid"}
            borderColor={"#EAECF0"}
            p={"16px"}
            gap={'16px'}
        >
            <Text color={colorMode === 'dark' && 'gray.300'}style={{ fontWeight: '700', fontSize: '18px', color: data.length === 0 ? '#98A2B3' : '#344054' }}>{t(day)}</Text>
            {data.length == 0 ?
                <Text color={colorMode === 'dark' ? 'gray.300' : "#98A2B3"} fontWeight={'400'} fontSize={'16px'}>{t('noSchedule')}</Text> :
                <VStack gap={'16px'}>
                    {data.sort((a, b) => {
                        let timeA = new Date(`1970-01-01T${a.starttime}:00`);
                        let timeB = new Date(`1970-01-01T${b.starttime}:00`);
                        return timeA - timeB;
                    }).map((item, index) => (
                        <RenderEachItem item={item} index={index} key={index} />
                    ))}
                </VStack>}
        </VStack>
    )
}


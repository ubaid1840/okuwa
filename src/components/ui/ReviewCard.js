import { Avatar, Divider, HStack, Icon, useColorMode, VStack } from "@chakra-ui/react"
import { useTranslations } from "next-intl"
import { Text } from "@chakra-ui/react"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { RxPencil1 } from "react-icons/rx"
import { IoStar } from "react-icons/io5"
import { theme } from "@/data/data"




export const ReviewCard = ({ data }) => {
    const { colorMode } = useColorMode()


    return (
        <HStack justify={'flex-start'} alignItems={'flex-start'} width={'70%'}>
            <Avatar name={data?.name} />
            <VStack
                width={"100%"}
                align={"flex-start"}
            >
                <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontWeight={'500'} fontSize={'16px'}>{data.name}</Text>
                <HStack >
                    {Array.from({ length: data.rating }).map((_, index) => (
                        <Icon key={index} as={IoStar} color={'golden'} />
                    ))}
                </HStack>
                <div style={{ width: '100%' }}>
                    <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} width={'100%'} fontWeight={'500'} fontSize={'16px'}>{data?.note}</Text>
                </div>
                <Divider color={theme.divider.primary} />
            </VStack>

        </HStack>
    )
}
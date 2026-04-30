import { Avatar, HStack, VStack, Text, Box, Divider, Input, IconButton, Icon } from "@chakra-ui/react";
import { useContext, useState } from "react";
import moment from "moment";
import Button from "../ui/Button";
import { IoCallOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { UserContext } from "@/store/context/UserContext";


const Chatcomponent = ({ name, allMessages, onReturnSend, onOpenCall, page, disableCall, colorMode }) => {

    const { state: UserState } = useContext(UserContext)

    const [messages, setMessages] = useState('')
    const t = useTranslations("Dictionary");
    function handleSend() {
        onReturnSend({
            time: new Date().getTime(),
            msg: messages,
            by: UserState.value.data.email
        })
        setMessages("")
    }

    return (
        <VStack
            width={"100%"}
            gap={5}
            pb={"20px"}
            height={'100%'}
        >
            <VStack width={"100%"} alignItems={"flex-start"} gap={0} spacing={0}>
                <HStack width={"100%"} justify={"space-between"} px={"32px"} py={'20px'} gap={0}>
                    <HStack>
                        <Avatar size={page == 'doctor' ? "lg" : "md"} name={name} />
                        <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"16px"}>
                            {name}
                        </Text>
                    </HStack>
                    {!disableCall &&
                        <IconButton
                            onClick={() => {
                                onOpenCall();
                            }}
                            variant="outline"
                            icon={<Icon as={IoCallOutline} boxSize={5} />}
                        />
                    }
                </HStack>
                <Divider />
            </VStack>
            <VStack height={'100%'} overflowY={'auto'} width={'100%'} align={'flex-start'} p={5}>
                {allMessages.length > 0 && allMessages?.map((item, index) => (
                    item.by != UserState.value.data.email ?
                        <VStack key={index} align={'flex-start'} justify={'flex-start'} width={'100%'} paddingRight={'40px'}>
                            <Box p={2} bg={'#F2F4F7'} borderRadius={'8px'}>
                                <Text color={colorMode === 'dark' ? 'gray.300' : '#667085'} fontWeight={'400'} fontSize={'16px'}>{item.msg}</Text>
                            </Box>
                            <Text color={colorMode === 'dark' ? 'gray.300': '#667085'} fontWeight={'400'} fontSize={'12px'}>
                                {moment(new Date(item.time)).format("hh:mm A")}
                            </Text>
                        </VStack>
                        : <VStack key={index} align={'flex-end'} justify={'flex-start'} width={'100%'} paddingLeft={'40px'}>
                            <Box p={2} bg={'#155EEF'} borderRadius={'8px'}>
                                <Text color={colorMode === 'dark' ? 'gray.300' : '#FFFFFF'} fontWeight={'400'} fontSize={'16px'}>{item.msg}</Text>
                            </Box>
                            <Text color={colorMode === 'dark' ? 'gray.300' : '#667085'} fontWeight={'400'} fontSize={'12px'}>
                                {moment(new Date(item.time)).format("hh:mm A")}
                            </Text>
                        </VStack>
                ))}
            </VStack>
            <VStack width={"100%"} alignItems={"flex-start"} gap={5}>
                <Divider />
                <HStack width={"100%"} px={"20px"}>
                    <Input
                        placeholder={t("sendInput")}
                        value={messages}
                        onChange={(e) => setMessages(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSend()
                            }
                        }}
                    />
                    <div>
                        <Button onClick={() => {
                            handleSend()

                        }}>{t("send")}</Button>
                    </div>
                </HStack>
            </VStack>
        </VStack>
    )

}

export default Chatcomponent
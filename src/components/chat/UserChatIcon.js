'use client'
import { db } from "@/config/firebase";
import { theme } from "@/data/data"
import { Avatar, HStack, Text, VStack, Box, Divider } from "@chakra-ui/react"
import { collection, onSnapshot } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";


const UserChatIcon = ({ name, type, email, onChatSelected, myEmail, onReturnList, selected, colorMode }) => {

const [lastMsg, setLastMsg] = useState({})
const [allMessages, setAllMessages] = useState([])

    useEffect(() => {
        const sortedEmails = [myEmail, email].sort();
        const dbIdentifier = sortedEmails.join("-");
        const unsubscribe = onSnapshot(collection(db, dbIdentifier), (snapshot) => {
          let list = [];
          snapshot.forEach((docs) => {
            list.push(docs.data());
          });
          if(list.length > 0) {
            const userLastMsg = list.filter((item, index) => item.by === email).sort((a,b)=> b.time - a.time)
            if(userLastMsg.length > 0){
                setLastMsg(userLastMsg[0])
            }
          }
          if(list.length > 0){
            const sortedList = list.sort((a,b) => a.time - b.time)
            setAllMessages(sortedList)
          onReturnList(sortedList)
          }
          
        });
        return () => {
          unsubscribe();
        };
      }, []);

    return (
        <VStack w={'100%'} alignItems={'flex-start'} _hover={{cursor:'pointer'}} onClick={()=> onChatSelected(allMessages)} px={'20px'} bg={selected ? colorMode === 'light' ? theme.color.lightbackground : 'gray.600' : 'transparent'} py={'15px'} gap={0} borderBottomWidth={1} borderBottomColor={colorMode == 'light' ? theme.divider.primary : 'gray.600'}>
            <HStack width={'100%'}
                align={'flex-start'} justify={'space-between'}>
                <HStack gap={3} align={'flex-start'}>
                    <Avatar name={name} size={'sm'} mt={1}/>
                    <VStack align={'flex-start'} gap={0}>
                        <Text color={colorMode === 'dark' ? 'gray.300' : '#101828'} fontSize={'16px'} fontWeight={'500'}>{name}</Text>
                        <Text color={colorMode === 'dark'  ?'gray.300' : '#475467'} fontSize={'12px'} fontWeight={'500'}>{type}</Text>
                        <Text color={colorMode === 'dark' ? 'gray.300' : '#475467'} fontSize={'12px'} fontWeight={'500'}>{lastMsg.msg ?  lastMsg?.msg?.slice(0, 25) + '...' : ""}</Text>
                    </VStack>
                </HStack>
                <VStack >
                    <Text color={colorMode === 'dark' ? 'gray.300' : '#667085'} fontSize={'12px'} fontWeight={'400'}>{lastMsg.time ?moment(new Date(lastMsg?.time)).format("hh:mm A") : ""}</Text>
                    {/* <Box h={'16px'} w={'16px'} borderRadius={'3px'} bg={'#FF536E'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Text color={colorMode === 'dark' && 'gray.300'}color={'#FFFFFF'} fontSize={'12px'} fontWeight={'500'}>1</Text>
                    </Box> */}
                </VStack>
            </HStack>
            {/* <Divider color={theme.divider.primary} /> */}
        </VStack>
    )
}

export default UserChatIcon
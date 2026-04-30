"use client";
import Button from "@/components/ui/Button";
import Chatcomponent from "@/components/chat/ChatComponent";
import Sidebar from "@/components/sidebar";
import StaffInformation, { PatientInformation } from "@/components/StaffInformation";
import UserChatIcon from "@/components/chat/UserChatIcon";


import { auth, db } from "@/config/firebase";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { UserContext } from "@/store/context/UserContext";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Checkbox,
    Divider,
    Flex,
    HStack,
    Icon,
    Text,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import moment from "moment";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useCallback, useContext, useEffect, useState } from "react";
import { RiShareBoxLine, RiShareLine } from "react-icons/ri";


function MessagesTeam({ page }) {
    const {
        isOpen: isOpenCall,
        onOpen: onOpenCall,
        onClose: onCloseCall,
    } = useDisclosure();

    const {
        isOpen: isOpenShare,
        onOpen: onOpenShare,
        onClose: onCloseShare,
    } = useDisclosure();

    const sideLinks = GetLinkItems(page);
    const t = useTranslations("Dictionary");
    const [chatSelected, setChatSelected] = useState(false);
    const [allMessages, setAllMessages] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const { state: UserState } = useContext(UserContext);
    const [selectedUser, setSelectedUser] = useState("");
    const { colorMode } = useColorMode()
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
    const bgColor = useColorModeValue("#F9FAFB", "gray.700")

    useEffect(() => {
        if (UserState.value.data?.id) {
            fetchData(UserState.value.data.email, UserState.value.data.centerid);
        }
    }, [UserState.value.data]);

    async function fetchData(e, id) {

        axios.post("/api/messages/getusers", { email: e, id: id })
            .then((response) => {
                setAllUsers(response.data);
            })
    }

    async function handleReturnSend(e) {
        const sortedEmails = [
            UserState.value.data.email,
            selectedUser.email,
        ].sort();
        const dbIdentifier = sortedEmails.join("-");
        await addDoc(collection(db, dbIdentifier), e);
    }
    function handleChatSelected(e) {
        setSelectedUser(e);
        setChatSelected(true);
    }

    function handleCalling() {
        onOpenCall();
    }

    function calculateAge(dobInMilliseconds) {
        const currentDate = new Date();
        const dobDate = new Date(dobInMilliseconds);
        let age = currentDate.getFullYear() - dobDate.getFullYear();
        const monthDiff = currentDate.getMonth() - dobDate.getMonth();
        const dayDiff = currentDate.getDate() - dobDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age;
    }

    return (
        <Sidebar LinkItems={sideLinks}  >
            <Flex height={"100vh"} flex={1}>
                <Flex width={"30%"} flexDir="column">
                    <div style={{ width: "100%", paddingLeft: '32px', paddingRight: '32px', paddingTop: '20px', paddingBottom: '20px' }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="heading"> {t("teamMessages")}</Text>
                    </div>
                    <VStack
                        align={"flex-start"}
                        width={"100%"}
                        overflowY={"auto"}
                        gap={0}
                    >
                        {allUsers.length > 0 &&
                            allUsers.map((eachUser, index) => (
                                <UserChatIcon
                                    colorMode={colorMode}
                                    selected={selectedUser.id === eachUser.id}
                                    myEmail={UserState.value.data?.email}
                                    email={eachUser.email}
                                    key={index}
                                    name={eachUser.role != 'admin' ? `${eachUser?.firstname} ${eachUser?.lastname}` : eachUser.name}
                                    type={t(eachUser?.role)}
                                    onChatSelected={(msgs) => {
                                        setAllMessages(msgs);
                                        setChatSelected(true);
                                        setSelectedUser(eachUser);
                                    }}
                                    onReturnList={(msgs) => {
                                        setAllMessages(msgs);
                                    }}
                                />

                            ))}
                    </VStack>
                </Flex>

                {!chatSelected ? (
                    <VStack
                        height={"100%"}
                        width={"100%"}
                        bg={bgColor}
                        align={"center"}
                        justify={"center"}
                    >
                        <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"} fontWeight={"400"} fontSize={"16px"} >
                            {t("noChatSelected")}
                        </Text>
                    </VStack>
                ) : (
                    <VStack
                        height={"100%"}
                        width={"30%"}
                        align={"flex-start"}
                        borderLeftWidth={1}
                        borderLeftColor={colorMode == 'light' ? theme.divider.primary : "gray.600"}
                        borderRightWidth={1}
                        borderRightColor={colorMode == 'light' ? theme.divider.primary : 'gray.600'}
                    >
                        <Box height={"100%"} width={"100%"}>
                            <Chatcomponent
                                colorMode={colorMode}
                                disableCall={true}
                                name={selectedUser.role == 'admin' ? selectedUser.name : `${selectedUser?.firstname} ${selectedUser?.lastname}`}
                                onReturnSend={(e) => handleReturnSend(e)}
                                onOpenCall={() => [handleCalling()]}
                                allMessages={allMessages}
                            />
                        </Box>
                    </VStack>
                )}

                {chatSelected && (
                    <VStack width={"40%"} p={"32px"} overflowY={"auto"}>
                        <StaffInformation
                            colorMode={colorMode}
                            page={page}
                            role={selectedUser?.role}
                            onReturnClick={() => onOpenShare()}
                            data={{
                                firstName: selectedUser.role == 'admin' ? selectedUser?.name : selectedUser?.firstname,
                                lastName: selectedUser.role == 'admin' ? "" : selectedUser?.lastname,
                                dob: selectedUser.role == 'admin' ? "" : selectedUser?.dob ? moment(new Date(Number(selectedUser?.dob))).format("MMM DD, YYYY") + " (" + calculateAge(Number(selectedUser.dob)) + " years old)" : "",
                                gender: selectedUser.role == 'admin' ? "" : selectedUser?.gender ? t(selectedUser?.gender) : "",
                                email: selectedUser?.email,
                                phoneNumber: selectedUser.role == 'admin' ? "" : selectedUser?.phonenumber,
                                homeAddress: selectedUser.role == 'admin' ? "" : selectedUser?.homeaddress,
                                officeAddress: selectedUser.role == 'admin' ? "" : selectedUser?.officeaddress,
                                centerid: selectedUser?.centerid
                            }}
                        />
                    </VStack>
                )}
            </Flex>
            {UserState.value.data.email && selectedUser.email && (
                <></>
                // <VideoCallDialog
                //   from={UserState.value.data.email}
                //   isOpen={isOpenCall}
                //   onClose={onCloseCall}
                //   name={selectedUser.name}
                //   to={selectedUser.email}
                // />
            )}

            <AlertDialog
                motionPreset="slideInBottom"
                onClose={onCloseShare}
                isOpen={isOpenShare}
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
                            <Icon as={RiShareBoxLine} color={"#155EEF"} boxSize={4} />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <VStack alignItems={"flex-start"} spacing={2}>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontSize={"18px"} fontWeight={"500"} >
                                {t("sharePatientInfo")}
                            </Text>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontSize={"18px"} fontWeight={"400"} >
                                Judy Smith
                            </Text>
                            <Text
                                mt={5}
                                fontSize={"14px"}
                                fontWeight={"400"}
                                color={"#667085"}
                            >
                                {t("selectInformationToShare")}
                            </Text>
                            <HStack alignItems={"flex-start"} gap={5}>
                                <Box mt={1}>
                                    <Checkbox />
                                </Box>
                                <Text
                                    variant={"description"}
                                    color={"#667085"}
                                    fontSize={"14px"}
                                >
                                    {t("medicalRecord")}
                                </Text>
                            </HStack>

                            <HStack alignItems={"flex-start"} gap={5}>
                                <Box mt={1}>
                                    <Checkbox />
                                </Box>
                                <Text
                                    variant={"description"}
                                    color={"#667085"}
                                    fontSize={"14px"}
                                >
                                    {t("prescriptions")}
                                </Text>
                            </HStack>

                            <HStack alignItems={"flex-start"} gap={5}>
                                <Box mt={1}>
                                    <Checkbox />
                                </Box>
                                <Text
                                    variant={"description"}
                                    color={"#667085"}
                                    fontSize={"14px"}
                                >
                                    {t("labResults")}
                                </Text>
                            </HStack>
                        </VStack>
                    </AlertDialogBody>
                    <AlertDialogFooter
                        width={"100%"}
                        alignItems={"flex-start"}
                        justifyContent={"space-between"}
                    >
                        <Button
                            width={"100%"}
                            //    
                            onClick={onCloseShare}
                            border="1px solid"
                            borderColor={bdColor}
                            backgroundColor="#FFFFFF"
                            color="#000000"
                        >
                            {t("cancel")}
                        </Button>
                        <Button onClick={() => onCloseShare()} width={"100%"} ml={3}>
                            {t("share")}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Sidebar>
    );
}

function MessagesPatient({ page }) {

    const { colorMode } = useColorMode()
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
    const {
        isOpen: isOpenCall,
        onOpen: onOpenCall,
        onClose: onCloseCall,
    } = useDisclosure();

    const {
        isOpen: isOpenShare,
        onOpen: onOpenShare,
        onClose: onCloseShare,
    } = useDisclosure();

    const sideLinks = GetLinkItems(page);
    const t = useTranslations("Dictionary");
    const [chatSelected, setChatSelected] = useState(false);
    const [allMessages, setAllMessages] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const { state: UserState } = useContext(UserContext);
    const [selectedUser, setSelectedUser] = useState("");

    useEffect(() => {
        if (UserState.value.data?.centerid) {
            fetchData(UserState.value.data.centerid);
        }
    }, [UserState.value.data]);

    async function fetchData(id) {

        axios.post("/api/patient/getall", { centerid: id })
            .then((response) => {

                setAllUsers(response.data);
            })
    }

    async function handleReturnSend(e) {
        const sortedEmails = [
            UserState.value.data.email,
            selectedUser.email,
        ].sort();
        const dbIdentifier = sortedEmails.join("-");
        await addDoc(collection(db, dbIdentifier), e);
    }
    function handleChatSelected(e) {
        setSelectedUser(e);
        setChatSelected(true);
    }

    function handleCalling() {
        onOpenCall();
    }

    function calculateAge(dobInMilliseconds) {
        const currentDate = new Date();
        const dobDate = new Date(dobInMilliseconds);
        let age = currentDate.getFullYear() - dobDate.getFullYear();
        const monthDiff = currentDate.getMonth() - dobDate.getMonth();
        const dayDiff = currentDate.getDate() - dobDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age;
    }

    const CallbackPatientInformation = useCallback(() => {
        return (
            <PatientInformation
                id={selectedUser.id}
                centerid={UserState.value.data.centerid}
            />
        )
    }, [selectedUser])

    return (
        <Sidebar LinkItems={sideLinks}  >
            <Flex height={"100vh"} flex={1}>
                <Flex width={"30%"} flexDir="column">
                    <div style={{ width: "100%", paddingLeft: '32px', paddingRight: '32px', paddingTop: '20px', paddingBottom: '20px' }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="heading"> {t("patientMessages")}</Text>
                    </div>

                    <VStack
                        align={"flex-start"}
                        width={"100%"}
                        overflowY={"auto"}
                        gap={0}

                    >
                        {allUsers.length > 0 &&
                            allUsers.map((eachUser, index) => (
                                <UserChatIcon
                                    colorMode={colorMode}
                                    selected={selectedUser.id === eachUser.id}
                                    myEmail={UserState.value.data?.email}
                                    email={eachUser?.email}
                                    key={index}
                                    name={`${eachUser?.firstname || ""} ${eachUser?.lastname || ""}`}
                                    type={t("patient")}
                                    onChatSelected={(msgs) => {
                                        setAllMessages(msgs);
                                        setChatSelected(true);
                                        setSelectedUser(eachUser);
                                    }}
                                    onReturnList={(msgs) => {
                                        setAllMessages(msgs);
                                    }}
                                />

                            ))}
                    </VStack>
                </Flex>

                {!chatSelected ? (
                    <VStack
                        height={"100%"}
                        width={"100%"}
                        bg={"#F9FAFB"}
                        align={"center"}
                        justify={"center"}
                    >
                        <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"} fontWeight={"400"} fontSize={"16px"} >
                            {t("noChatSelected")}
                        </Text>
                    </VStack>
                ) : (
                    <VStack
                        height={"100%"}
                        width={"30%"}
                        align={"flex-start"}
                        borderLeftWidth={1}
                        borderLeftColor={theme.divider.primary}
                        borderRightWidth={1}
                        borderRightColor={theme.divider.primary}
                    >
                        <Box height={"100%"} width={"100%"}>
                            <Chatcomponent
                                colorMode={colorMode}
                                disableCall={true}
                                name={`${selectedUser?.firstname || ""} ${selectedUser?.lastname || ""}`}
                                onReturnSend={handleReturnSend}
                                onOpenCall={() => [handleCalling()]}
                                allMessages={allMessages}
                            />
                        </Box>
                    </VStack>
                )}

                {chatSelected && (
                    <VStack width={"40%"} gap={0} overflowY={"auto"}>
                        <CallbackPatientInformation />

                    </VStack>
                )}
            </Flex>
            {UserState.value.data.email && selectedUser.email && (
                <></>
                // <VideoCallDialog
                //   from={UserState.value.data.email}
                //   isOpen={isOpenCall}
                //   onClose={onCloseCall}
                //   name={selectedUser.name}
                //   to={selectedUser.email}
                // />
            )}

            <AlertDialog
                motionPreset="slideInBottom"
                onClose={onCloseShare}
                isOpen={isOpenShare}
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
                            <Icon as={RiShareBoxLine} color={"#155EEF"} boxSize={4} />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <VStack alignItems={"flex-start"} spacing={2}>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontSize={"18px"} fontWeight={"500"} >
                                {t("sharePatientInfo")}
                            </Text>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontSize={"18px"} fontWeight={"400"} >
                                Judy Smith
                            </Text>
                            <Text
                                mt={5}
                                fontSize={"14px"}
                                fontWeight={"400"}
                                color={"#667085"}
                            >
                                {t("selectInformationToShare")}
                            </Text>
                            <HStack alignItems={"flex-start"} gap={5}>
                                <Box mt={1}>
                                    <Checkbox />
                                </Box>
                                <Text
                                    variant={"description"}
                                    color={"#667085"}
                                    fontSize={"14px"}
                                >
                                    {t("medicalRecord")}
                                </Text>
                            </HStack>

                            <HStack alignItems={"flex-start"} gap={5}>
                                <Box mt={1}>
                                    <Checkbox />
                                </Box>
                                <Text
                                    variant={"description"}
                                    color={"#667085"}
                                    fontSize={"14px"}
                                >
                                    {t("prescriptions")}
                                </Text>
                            </HStack>

                            <HStack alignItems={"flex-start"} gap={5}>
                                <Box mt={1}>
                                    <Checkbox />
                                </Box>
                                <Text
                                    variant={"description"}
                                    color={"#667085"}
                                    fontSize={"14px"}
                                >
                                    {t("labResults")}
                                </Text>
                            </HStack>
                        </VStack>
                    </AlertDialogBody>
                    <AlertDialogFooter
                        width={"100%"}
                        alignItems={"flex-start"}
                        justifyContent={"space-between"}
                    >
                        <Button
                            width={"100%"}
                            //    
                            onClick={onCloseShare}
                            border="1px solid"
                            borderColor={bdColor}
                            backgroundColor="#FFFFFF"
                            color="#000000"
                        >
                            {t("cancel")}
                        </Button>
                        <Button onClick={() => onCloseShare()} width={"100%"} ml={3}>
                            {t("share")}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Sidebar>
    );
}

export { MessagesPatient, MessagesTeam }

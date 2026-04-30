"use client"

import React, { useContext, useEffect, useState } from "react";
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    useColorModeValue,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    Image,
    Divider,
    HStack,
    Avatar,
    VStack,
    Switch,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Heading,
    AccordionIcon,
    useColorMode,
} from "@chakra-ui/react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { RiHome2Line, RiLogoutBoxLine } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./logo";
import { theme } from "@/data/data";
import Link from "next/link";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { signOut } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import useCheckSession from "@/config/checkSession";
import { UserContext } from "@/store/context/UserContext";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Button, { DangerButton } from "./ui/Button";
import dynamic from "next/dynamic";
import { ColorContext } from "@/store/context/ColorContext";
import StreamCallComponenet from "./StreamVideo/StreamCallComponent";
import { CiCalendar } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { BiMessageRoundedDetail } from "react-icons/bi";
import DarkModeSwitcher from "./DarkModeSwitcher";


export default function Sidebar({ children, LinkItems, settingsLink }) {
    const checkSession = useCheckSession()
    const [allowed, setAllowed] = useState(false)
    const { state: UserState, setUser } = useContext(UserContext)
    const [calling, setCalling] = useState(false)
    const [acceptCall, setAcceptCall] = useState(false)
    const { isOpen: isOpenVideo, onOpen: onOpenVideo, onClose: onCloseVideo } = useDisclosure()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [callingUser, setCallingUser] = useState()


    useEffect(() => {
        if (UserState.value.data.email) {
            const unsubscribe = onSnapshot(doc(db, "calling", `${UserState.value.data.email}-calling`), (docs) => {
                if (docs.data()) {
                    if (docs.data().status == 'calling') {
                        setCallingUser(docs.data())
                        setCalling(true)
                    } else {
                        setCalling(false)
                    }
                }

            });
        }


    }, [UserState.value.data.email]);

    useEffect(() => {
        checkSession().then((val) => {
            setAllowed(val.status)
            if (val?.user) {
                setUser(val?.user)
            }
        })
    }, [])

    function handleAcceptCall() {
        onOpenVideo()
        updateDoc(doc(db, "calling", `${UserState.value.data.email}-calling`), {
            status: 'connected'
        })
    }

    function handleRejectCall() {
        setCalling(false)
        updateDoc(doc(db, "calling", `${UserState.value.data.email}-calling`), {
            status: 'idle'
        })
    }

    return (
        // allowed &&
        <Box
            minH="100vh"
            overflowY={'auto'}
        >
            <SidebarContent
                settingsLink={settingsLink}
                LinkItems={LinkItems}
                onClose={() => onClose}
                display={{ base: "none", md: "flex" }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent settingsLink={settingsLink} LinkItems={LinkItems} display="flex" onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
            <Box ml={{ base: 0, md: '280px' }} display={"flex"}>
                {children}
                {calling &&
                    <Box
                        width={'300px'}
                        borderRadius={'8px'}
                        p={10}
                        position={'fixed'}
                        bottom={10}
                        right={10}
                        borderColor={theme.divider.primary}
                        bg={'#1c1f2e'}>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div>
                                <Text color={'white'} variant={'subheading'} mb={2}>{callingUser?.email} Calling</Text>
                            </div>
                        </div>
                        <HStack width={'100%'} justify={'space-between'} align={'center'}>
                            <Button onClick={() => handleAcceptCall()}>Accep</Button>
                            <DangerButton onClick={() => handleRejectCall()}>Decline</DangerButton>
                        </HStack>
                    </Box>}
                {/* <VideoCallDialog
                    receivingCall={true}
                    from={UserState.value.data.email}
                    isOpen={isOpenVideo}
                    onClose={onCloseVideo}
                    callingUser={callingUser}
                /> */}

                <StreamCallComponenet
                    receivingCall={true}
                    from={UserState.value.data.email}
                    isOpen={isOpenVideo}
                    onClose={onCloseVideo}
                    name={UserState.value.data?.firstname ? UserState.value.data?.firstname : UserState.value.data?.name}
                    to={callingUser?.email} />
            </Box>
        </Box>
    );
}

const SidebarContent = ({ LinkItems, settingsLink, onClose, ...rest }) => {

    const { colorMode, toggleColorMode } = useColorMode()
    const t = useTranslations("Dictionary")
    const pathname = usePathname()
    const { state: UserState } = useContext(UserContext)
    function handleLogout() {
        signOut(auth)
    }

    const accordionColor = useColorModeValue("black", 'gray.300')
    const avatarBgColor = useColorModeValue('gray.300', "#F9FAFB")
    const avatarTextColor = useColorModeValue("black", "#DFDFDFFF")
    const containerBgColor = useColorModeValue(theme.color.background, 'gray.900')
    const containerColor = useColorModeValue("black", "white")
    const containerBorderRightcolor = useColorModeValue("#EAECF0", "gray.800")

    return (
        <Box
            w={{ base: "full", md: '280px' }}
            pos="fixed"
            minHeight={"full"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            bg={containerBgColor}
            {...rest}
            borderRightWidth={1}
            borderRightColor={containerBorderRightcolor}
            color={containerColor}
        >
            <div>
                <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                    <Logo />
                    <HStack>
                        <DarkModeSwitcher />
                        {/* <Switch colorScheme={'teal'} id='isChecked' isChecked={colorMode === 'dark'} onChange={(e) => {
                        toggleColorMode()
                    }} /> */}
                        <CloseButton
                            display={{ base: "flex", md: "none" }}
                            onClick={onClose}
                        />
                    </HStack>
                </Flex>



                {LinkItems.map((link, index) =>
                (
                    <NavItem
                        colorMode={colorMode}
                        key={link.name}
                        icon={link.icon}
                        path={`${link.path}`}
                    >
                        {link.name}
                    </NavItem>
                )
                )}

                {pathname.includes("admin") ?
                    <VStack gap={0} align="stretch">
                        <Accordion  >

                            <AccordionItem borderTopWidth={0} borderBottomWidth={0} pb={2}>
                                <h2>
                                    <AccordionButton >
                                        <Box flex="1" textAlign="left" color={accordionColor}>
                                            {t("configuration")}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel p={0}>
                                    <VStack align={'flex-start'} gap={0}>
                                        <NavItem
                                            colorMode={colorMode}
                                            icon={RiHome2Line}
                                            path={`/admin/configuration/general`}
                                        >
                                            {t("generalSettings")}
                                        </NavItem>

                                        <NavItem
                                            colorMode={colorMode}
                                            icon={CiCalendar}
                                            path={`/admin/configuration/labtest`}
                                        >
                                            {t("labTest")}
                                        </NavItem>


                                    </VStack>
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem borderTopWidth={0} borderBottomWidth={0} pb={2}>
                                <h2>
                                    <AccordionButton >
                                        <Box flex="1" textAlign="left" color={accordionColor}>
                                            {t("frontDesk")}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel p={0}>
                                    <VStack align={'flex-start'} gap={0}>
                                        <NavItem
                                            colorMode={colorMode}
                                            icon={RiHome2Line}
                                            path={`/admin/frontdesk/dashboard`}
                                        >
                                            {t("dashboard")}
                                        </NavItem>

                                        <NavItem
                                            colorMode={colorMode}
                                            icon={CiCalendar}
                                            path={`/admin/frontdesk/appointments`}
                                        >
                                            {t("appointments")}
                                        </NavItem>

                                        <NavItem colorMode={colorMode}
                                            icon={GoPeople}
                                            path={`/admin/frontdesk/patients`}
                                        >
                                            {t("patients")}
                                        </NavItem>

                                    </VStack>
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem borderTopWidth={0} borderBottomWidth={0} pb={2}>
                                <h2>
                                    <AccordionButton >
                                        <Box flex="1" textAlign="left" color={accordionColor}>
                                            {t("doctor")}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel p={0}>
                                    <VStack align="stretch">
                                        <NavItem
                                            colorMode={colorMode}
                                            icon={RiHome2Line}
                                            path={`/admin/doctor/dashboard`}
                                        >
                                            {t("dashboard")}
                                        </NavItem>

                                    </VStack>
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem borderTopWidth={0} borderBottomWidth={0} pb={2}>
                                <h2>
                                    <AccordionButton >
                                        <Box flex="1" textAlign="left" color={accordionColor}>
                                            {t("finance")}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel p={0}>
                                    <VStack align="stretch">
                                        <NavItem
                                            colorMode={colorMode}
                                            icon={RiHome2Line}
                                            path={`/admin/finance/dashboard`}
                                        >
                                            {t("dashboard")}
                                        </NavItem>

                                    </VStack>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>

                    </VStack>

                    :
                    pathname.includes("admin/doctor") ? null : pathname.includes("nurse") || pathname.includes("doctor") ?
                        <VStack gap={0} align="stretch">
                            <Accordion  >
                                <AccordionItem borderTopWidth={0} borderBottomWidth={0} pb={2}>
                                    <h2>
                                        <AccordionButton >
                                            <Box flex="1" textAlign="left">
                                                Messages
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel p={0}>
                                        <VStack align={'flex-start'} gap={0}>
                                            <NavItem
                                                colorMode={colorMode}
                                                icon={BiMessageRoundedDetail}
                                                path={pathname.includes("doctor") ? "/doctor/messages/team" : "/nurse/messages/team"}
                                            >
                                                Team
                                            </NavItem>

                                            <NavItem
                                                colorMode={colorMode}
                                                icon={BiMessageRoundedDetail}
                                                path={pathname.includes("doctor") ? "/doctor/messages/patient" : "/nurse/messages/patient"}
                                            >
                                                Patients
                                            </NavItem>



                                        </VStack>
                                    </AccordionPanel>
                                </AccordionItem>

                            </Accordion>
                        </VStack>
                        : null
                }

            </div>
            <Flex
                w={'100%'}
                flexDir={'column'}>
                {/* <NavItem
                    icon={IoIosNotificationsOutline}
                    path={`/notifications`}
                >
                    {t('notifications')}
                </NavItem>
                */}
                {settingsLink &&
                    <NavItem
                        colorMode={colorMode}
                        icon={IoSettingsOutline}
                        path={settingsLink}
                    >
                        {t('settings')}
                    </NavItem>
                }
                <Divider color={'#EAECF0'} width={'250px'} alignSelf={'center'} />
                <HStack width={'100%'} justifyContent={'space-evenly'} py={5} >
                    <Avatar name={auth?.currentUser?.email} bg={avatarBgColor} color={'black'} />
                    <VStack alignItems={'flex-start'} spacing={0} >
                        <Text variant="subheading" color={avatarTextColor}>{UserState.value.data?.role ? t(UserState.value.data.role) : "Superadmin"}</Text>
                        <Text variant="subheading" fontWeight="400" fontSize={"10px"} color={avatarTextColor}>{auth?.currentUser?.email}</Text>
                    </VStack>

                    <Icon onClick={() => handleLogout()} as={FiLogOut} boxSize={6} color={'#667085'} _hover={{ color: theme.color.primary, cursor: 'pointer' }} />

                </HStack>
            </Flex>
        </Box>
    );
};

const NavItem = ({ icon, children, path, colorMode, ...rest }) => {
    const pathname = usePathname();
    return (
        <Link
            href={path}
            style={{ textDecoration: "none", fontSize: "14px", fontWeight: "300", height: '40px' }}
            _focus={{ boxShadow: "none" }}
        >
            <Flex
                align="center"
                p="2"
                my="1"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    color: theme.color.primary,
                }}
                fontSize={'16px'}
                fontWeight={'500'}
                color={pathname.includes(path) ? theme.color.primary : colorMode == 'light' ? '#344054' : "gray.300"}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        _groupHover={{
                            color: theme.color.primary,
                        }}
                        boxSize={5}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

const MobileNav = ({ onOpen, ...rest }) => {
    const bgColor = useColorModeValue("white", "gray.900")
    const borderBottomColor = useColorModeValue("gray.200", "gray.700")
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg={bgColor}
            borderBottomWidth="1px"
            borderBottomColor={borderBottomColor}
            justifyContent="flex-start"
            {...rest}
        >
            <IconButton
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Logo />
        </Flex>
    );
};

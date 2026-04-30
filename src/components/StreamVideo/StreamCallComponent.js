'use client'
import { StreamCall, StreamTheme, StreamVideo, useStreamVideoClient, StreamVideoClient, RingingCall, } from "@stream-io/video-react-sdk";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import MeetingSetup from "./meetingsetup";
import MeetingRoom from "./meetingroom";
import { UserContext } from "@/store/context/UserContext";
import { tokenProvider } from '../../../actions/stream.actions';
import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { GrContract, GrExpand } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { HiOutlineVideoCamera, HiOutlineVideoCameraSlash } from "react-icons/hi2";
import { IoMicOffOutline, IoMicOutline } from "react-icons/io5";
import '@stream-io/video-react-sdk/dist/css/styles.css'
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamCallComponenet = ({ isOpen, onClose, name, to, from, callingUser, receivingCall, onReturn, onRecordingStopped, onRecordingStart }) => {
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: "",
        link: ""
    })
    const [callDetails, setCallDetails] = useState()
    const [setupComplete, setSetupComplete] = useState(false)
    const [call, setCall] = useState()
    const [loading, setLoading] = useState(true)
    const [videoClient, setVideoClient] = useState()
    const { state: UserState } = useContext(UserContext)

    const [roomId, setRoomId] = useState("")
    const [fullScreen, setFullScreen] = useState(true);
    const [video, setVideo] = useState(true)
    const [mute, setMute] = useState(false)

    useEffect(() => {
        if (isOpen && from) {
            async function LoadToken() {
                const token = await tokenProvider(from.replace(/\./g, "0").replace(/@/g, "0"))
                const client = new StreamVideoClient({
                    apiKey: apiKey,
                    user: {
                        id: from.replace(/\./g, "0").replace(/@/g, "0"),
                        name: name
                    },
                    tokenProvider: token
                })
                setVideoClient(client)
                const newFrom = from.replace(/\./g, "0").replace(/@/g, "0").split("@")[0]
                const newTo = to.replace(/\./g, "0").replace(/@/g, "0").split("@")[0]

                const sortedEmails = [newFrom, newTo].sort();
                const roomID = sortedEmails.join("-") + "123"
                console.log(roomID)
                createMeeting(client, roomID, from, to)
            }

            LoadToken()

        }

    }, [from, isOpen])

    const loadCall = async (client, id) => {
        const { calls } = await client.queryCalls({
            filter_conditions: {
                id: id
            }
        })
        if (calls.length > 0) {
            setCall(calls[0])
            setLoading(false)
            if (!receivingCall) {
                updateDb(id)
            }


        }
    }

    async function updateDb(id) {
        setDoc(doc(db, "calling", `${to}-calling`), {
            status: "calling",
            roomID: id,
            email: from
        });
    }

    const createMeeting = async (client, id, from, to) => {

        const call = await client.call('development', id)
        const startsAt = values.dateTime.toISOString()
        const description = values.description
        await call.getOrCreate({
            data: {
                starts_at: startsAt,
                custom: {
                    description
                }
            }

        })
        loadCall(client, id)
        setCallDetails(call)
    }

    if (loading) return null
    if (!isOpen) return null;

    return (

        <>
            {fullScreen && (
                <Box
                    pos={"absolute"}
                    height={"100vh"}
                    bg={"#344054B2"}
                    width={"100%"}
                    left={"0"}
                    top={"0"}
                    backdropFilter="blur(2px)"
                />
            )}
            <Box
                position={"fixed"}
                bottom={fullScreen ? "0" : "5"}
                left={fullScreen ? "0" : "5"}
                right={fullScreen && "0"}
                top={fullScreen && "0"}
                m={fullScreen ? "auto" : "0"}
                h={fullScreen ? "max-content" : "max-content"}
                width={fullScreen ? "1000px" : "500px"}
                bgGradient="linear(to-b, #252931FF, #1A1D23FF)"
                zIndex={1000}
                borderRadius="10px"
                p={fullScreen ? 3 : '5px'}

            >
                <StreamVideo client={videoClient} >
                    <StreamCall call={call} >
                        <StreamTheme style={{ color: 'white' }}>
                            {!setupComplete ? <MeetingSetup setSetupComplete={setSetupComplete} />
                                : <MeetingRoom receivingCall={receivingCall} user={UserState.value.data.email} onLeave={() => {
                                    onClose()
                                    setSetupComplete(false)
                                }} onReturn={onReturn}
                                onRecordingStopped={onRecordingStopped} onRecordingStart={onRecordingStart}/>}
                        </StreamTheme>
                    </StreamCall>
                </StreamVideo>
                {/* {setupComplete &&
                    <HStack
                        position={'absolute'}
                        width={"100%"}
                        justify={"center"}
                        align={"flex-start"}
                        gap={10}
                    bottom={5}

                    >
                        <Box
                            _hover={{ cursor: "pointer" }}
                            onClick={() => setMute(!mute)}
                            bg={"#FFFFFF33"}
                            h={"50px"}
                            w={"50px"}
                            borderRadius={"50px"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            {!mute ? (
                                <Icon as={IoMicOutline} boxSize={6} color={"white"} />
                            ) : (
                                <Icon as={IoMicOffOutline} boxSize={6} color={"white"} />
                            )}
                        </Box>
                        <Box
                            _hover={{ cursor: "pointer" }}
                            onClick={() => setVideo(!video)}
                            bg={"#FFFFFF33"}
                            h={"50px"}
                            w={"50px"}
                            borderRadius={"50px"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            {!video ? (
                                <Icon
                                    as={HiOutlineVideoCamera}
                                    boxSize={6}
                                    color={"white"}
                                />
                            ) : (
                                <Icon
                                    as={HiOutlineVideoCameraSlash}
                                    boxSize={6}
                                    color={"white"}
                                />
                            )}
                        </Box>
                        <Box
                            _hover={{ cursor: "pointer" }}
                            onClick={() => {
                                // onCloseCall()
                                // setTime(0)
                            }}
                            bg={"#F83D39"}
                            h={"50px"}
                            w={"50px"}
                            borderRadius={"50px"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Icon as={IoMdClose} boxSize={6} color={"white"} />
                        </Box>
                    </HStack>
                } */}
                <Box
                    pos={"absolute"}
                    right={fullScreen ? "20px" : '15px'}
                    top={fullScreen ? "20px" : '15px'}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => setFullScreen(!fullScreen)}
                    bg={"#313443"}
                    borderRadius={"50px"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    zIndex={10}
                >
                    {fullScreen ? (
                        <Icon as={GrContract} boxSize={3} color={"white"} m={2} />
                    ) : (
                        <Icon as={GrExpand} boxSize={3} color={"white"} m={2} />
                    )}
                </Box>
            </Box>

            {/* Fullscreen toggle button */}

        </>



    )

}

export default StreamCallComponenet

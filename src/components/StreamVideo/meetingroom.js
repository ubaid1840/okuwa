'use client'
import React, { useCallback, useEffect, useState } from 'react'
import {
    CallControls,
    CallParticipantsList,
    CallStatsButton,
    CallingState,
    CancelCallButton,
    LoadingIndicator,
    PaginatedGridLayout,
    ReactionsButton,
    ScreenShareButton,
    SpeakerLayout,
    SpeakingWhileMutedNotification,
    ToggleAudioPublishingButton,
    ToggleVideoPublishingButton,
    useCall,
    useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { Box, Center, Flex, Icon } from '@chakra-ui/react';
import { BsRecordCircle } from 'react-icons/bs';

function MeetingRoom({ user, onLeave, receivingCall, onReturn, onRecordingStopped, onRecordingStart }) {
    const [layout, setLayout] = useState('grid');
    const [showParticipants, setShowParticipants] = useState(false);
    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout />;
            case 'speaker-right':
                return <SpeakerLayout />;
            default:
                return <SpeakerLayout />;
        }
    };

    return (

        <Box w={'100%'} display={'flex'} flexDir={'column'}>
            <CallLayout />
            <Box w={'100%'} position={'absolute'} bottom={5}>
                <CallControl onLeave={onLeave} receivingCall={receivingCall} onReturn={onReturn} onRecordingStopped={onRecordingStopped} onRecordingStart={onRecordingStart} />
            </Box>
        </Box>
    )
}

export default MeetingRoom


const CallControl = ({ onLeave, user, receivingCall, onReturn, onRecordingStopped, onRecordingStart }) => (
    <div className="str-video__call-controls">
        {!receivingCall ?
            <>
                <SpeakingWhileMutedNotification>
                    <ToggleAudioPublishingButton />
                </SpeakingWhileMutedNotification>
                <ToggleVideoPublishingButton />
                <CancelCallButton onLeave={onLeave} />
                {/* <ScreenShareButton /> */}
                <ReactionsButton />
                <CustomRecordCallButton receivingCall={receivingCall} onReturn={onReturn} onRecordingStopped={onRecordingStopped} onRecordingStart={onRecordingStart} />
            </>
            :
            <>
                <SpeakingWhileMutedNotification>
                    <ToggleAudioPublishingButton />
                </SpeakingWhileMutedNotification>
                <ToggleVideoPublishingButton />
                <CancelCallButton onLeave={onLeave} />
            </>
        }


    </div>
);

export const CustomRecordCallButton = ({ receivingCall, onReturn, onRecordingStopped, onRecordingStart }) => {
    const call = useCall();

    const { useIsCallRecordingInProgress } = useCallStateHooks();

    const isCallRecordingInProgress = useIsCallRecordingInProgress();
    const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);


    useEffect(() => {

        if (!call) return;
        const eventHandlers = [
            call.on('call.recording_started', () => setIsAwaitingResponse(false)),
            call.on('call.recording_stopped', () => setIsAwaitingResponse(false)),
            call.on('call.recording_ready', () => fetchList()),
        ];
        return () => {
            eventHandlers.forEach((unsubscribe) => unsubscribe());
        };
    }, [call]);

    const toggleRecording = useCallback(async () => {
        try {
            setIsAwaitingResponse(true);
            if (isCallRecordingInProgress) {
                await call?.stopRecording();
                onRecordingStopped()
            } else {
                await call?.startRecording();
                onRecordingStart()
            }
        } catch (e) {
            setIsAwaitingResponse(false);
            console.error(`Failed start recording`, e);
        }
    }, [call, isCallRecordingInProgress]);

    async function fetchList() {
        if (!receivingCall) {
            const list = await call.queryRecordings()
            const data = [...list.recordings]
            data.sort((a, b) => new Date(b.end_time) - new Date(a.end_time));
            onReturn(data[0].url)
        }

    }

    return (
        <>
            {isAwaitingResponse ? (
                <Flex h={'40px'} w={'50px'} alignItems={'center'} justify={'center'}>
                    <LoadingIndicator
                        tooltip={
                            isCallRecordingInProgress
                                ? 'Waiting for recording to stop... '
                                : 'Waiting for recording to start...'
                        }
                    />
                </Flex>
            ) : (

                isCallRecordingInProgress ? (
                    <Box borderRadius={50} bg={'#19232d'} p={0} m={0} _hover={{ cursor: 'pointer', backgroundColor: '#3B3B3BFF' }}>
                        <Icon as={BsRecordCircle} boxSize={6} color={'red'} m={2} onClick={toggleRecording} />
                    </Box>
                ) : (
                    <Box borderRadius={50} bg={'#19232d'} p={0} m={0} _hover={{ cursor: 'pointer', backgroundColor: '#3B3B3BFF' }}>
                        <Icon as={BsRecordCircle} boxSize={6} onClick={toggleRecording} m={2} />
                    </Box>
                )
            )}
        </>
    );
};



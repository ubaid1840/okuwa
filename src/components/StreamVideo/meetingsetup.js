'use client'
import { Box, Center, Spinner } from '@chakra-ui/react'
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import Button from '../ui/Button'

const MeetingSetup = ({ setSetupComplete }) => {

    const [micToggle, setMicToggle] = useState(false)

    const call = useCall();


    useEffect(() => {

        if (!call) return
        if (micToggle) {
            call?.camera?.disable()
            call?.microphone?.disable()
        } else {
            call?.camera?.enable()
            call?.microphone?.enable()
        }
    }, [call?.camera, call?.microphone, micToggle])

    return (
        <Center w={'100%'} height={'100%'} display={'flex'} flexDir={'column'}>
            {!call && <Spinner />}
            <VideoPreview className='video-preview'/>
            <Box>
                <DeviceSettings />
            </Box>
            <Button mt={5} onClick={() => {
                call.join()
                setSetupComplete(true)
            }}>
                Start Call
            </Button>
        </Center>
    )
}

export default MeetingSetup
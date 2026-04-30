'use client'
import { Flex, Spinner } from '@chakra-ui/react'
export default function Loading() {
    return (
        <Flex flex={1} alignItems={'center'} justifyContent={'center'} height={'100vh'}>
            <Spinner />
        </Flex>
    )
}
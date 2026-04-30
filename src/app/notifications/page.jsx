"use client"
import { Flex, Text, useColorMode } from "@chakra-ui/react";

export default function Page () {
    const {colorMode} = useColorMode()

    return (
        <Flex height={'100vh'} align={'center'} justify={'center'}>
            <Text color={colorMode === 'dark' && 'gray.300'}variant={'heading'}>Under development</Text>
        </Flex>
    )
}
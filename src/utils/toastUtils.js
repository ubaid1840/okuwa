import { Box, HStack, Icon, VStack, Text, Spacer } from "@chakra-ui/react";
import { LuBadgeCheck } from "react-icons/lu";
import { CloseIcon } from "@chakra-ui/icons";
import { MdCancel } from "react-icons/md";



export function closeToast(toast, toastIdRef) {
    if (toastIdRef.current) {
        toast.close(toastIdRef.current);
        toastIdRef.current = null;
    }
}

export function showToastSuccess(toast, toastIdRef, heading, subheading) {
    if (!toastIdRef.current || !toast.isActive(toastIdRef.current)) {
        toastIdRef.current = toast({
            render: () => (
                <Box
                    width={"400px"}
                    padding={"10px"}
                    bg={"#ECFDF3"}
                    borderRadius={"8px"}
                >
                    <HStack alignItems={"flex-start"} spacing={5}>
                        <div
                            style={{
                                backgroundColor: "#D1FADF",
                                display: "flex",
                                borderRadius: "100px",
                                padding: "5px",
                            }}
                        >
                            <Icon as={LuBadgeCheck} color={"#039855"} boxSize={6} />
                        </div>
                        <VStack alignItems={"flex-start"}>
                            <Text variant="subheading" color="black">
                                {heading}
                            </Text>
                            <Text variant="description" fontSize="14px">
                                {subheading}
                            </Text>
                        </VStack>
                        <Spacer />
                        <CloseIcon
                            _hover={{ cursor: "pointer" }}
                            height={"10px"}
                            width={"10px"}
                            color={"#667085"}
                            onClick={() => closeToast(toast, toastIdRef)}
                        />
                    </HStack>
                </Box>
            ),
            position: "top-right",
            duration: 2000,
        });
    }
}

export function showToastFailed(toast, toastIdRef, heading, subheading) {
    if (!toastIdRef.current || !toast.isActive(toastIdRef.current)) {
        toastIdRef.current = toast({
            render: () => (
                <Box
                    width={"400px"}
                    padding={"10px"}
                    bg={"#FDECECFF"}
                    borderRadius={"8px"}
                >
                    <HStack alignItems={"flex-start"} spacing={5}>
                    
                        <div
                            style={{
                                backgroundColor: "#FAD1D1FF",
                                display: "flex",
                                borderRadius: "100px",
                                padding: "5px",
                            }}
                        >
                            <Icon as={MdCancel} color={"#980303FF"} boxSize={6} />
                        </div>
                        <VStack alignItems={"flex-start"}>
                            <Text variant="subheading" color="black">
                                {heading || ""}
                            </Text>
                            <Text variant="description" fontSize="14px">
                                {subheading || ""}
                            </Text>
                        </VStack>
                        <Spacer />
                        <CloseIcon
                            _hover={{ cursor: "pointer" }}
                            height={"10px"}
                            width={"10px"}
                            color={"#667085"}
                            onClick={() => closeToast(toast, toastIdRef)}
                        />
                    </HStack>
                </Box>
            ),
            position: "top-right",
            duration: 2000,
        });
    }
}
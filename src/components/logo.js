import { theme } from "@/data/data";
import { Image, Text } from "@chakra-ui/react";


export default function Logo() {
    return (
        <div style={{ display: "flex" }}>
            <Image
                src="/assets/Vector.png" // Replace with your image URL
                width="20px"
                height="20px"
            />
            <Text ml={1} color={theme.color.primary} fontSize="16px" fontWeight="600">
                Okuwa
            </Text>
            {/* <Text color={colorMode === 'dark' && 'gray.300'}color={theme.color.icon} fontSize="16px">
                Care
            </Text> */}
        </div>
    )
}
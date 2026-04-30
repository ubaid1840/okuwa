import { theme } from "@/data/data"
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"
import { Box } from "@chakra-ui/react"


const ArrowButton = ({ type, onClick }) => {

    return (
        <Box
            onClick={onClick}
            height={"36px"}
            width={"36px"}
            backgroundColor={"#FFFFFF"}
            color={"black"}
            border={"1px solid"}
            borderColor={useColorModeValue(theme.color.primaryBorderColor, 'gray.700')}
            borderRadius={"8px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            {type == 'back' ? <ArrowBackIcon boxSize={4} /> : type == 'forward' ? <ArrowForwardIcon boxSize={4} /> : null}

        </Box>
    )
}

export default ArrowButton
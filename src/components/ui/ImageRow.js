import { HStack, Input, Text, Image } from "@chakra-ui/react"


const ImageRow = ({ title, image, props, clickable, colorMode }) => {

    return (
        <HStack
            alignItems={"flex-start"}
            width={"100%"}
            maxWidth={'800px'}
            {...props}
        >
            <div style={{ width: "280px" }}>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading" mt={2}>
                    {title}
                </Text>
            </div>
            {clickable ?
                <Image
                    onClick={() => window.open(image, "_blank")}
                    _hover={{ cursor: 'pointer' }}
                    src={image}
                    height={"60px"}

                /> :
                <Image

                    src={image}
                    height={"60px"}

                />}

        </HStack>
    )

}

export default ImageRow
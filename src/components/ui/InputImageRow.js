import { Box, HStack, Input, Text, Image, useColorModeValue } from "@chakra-ui/react"
import Dropzone from "../DropZone";
import { useTranslations } from "next-intl";
import { theme } from "@/data/data";


const InputImageRow = ({ title, props, onReturn, loading, image, onDeleteImage, colorMode, borderColor }) => {
    const t = useTranslations('Dictionary')
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, borderColor ? 'gray.600' : 'gray.700')
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
            {image ?
                <HStack spacing={5}>
                    <Box
                        border={"1px solid"}
                        borderColor={bdColor}
                        borderRadius={"8px"}
                        display={"flex"}
                        flexDir={"row"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        padding={"16px"}
                    >
                        <Image
                            src={image}
                            height={"100px"}
                            width={"100px"}
                        />
                    </Box>
                    <Text
                        _hover={{ cursor: "pointer" }}
                        color={theme.input.label}
                        fontSize={"14px"}
                        fontWeight={"500"}
                        onClick={onDeleteImage}
                    >
                        {t("delete")}
                    </Text>
                </HStack>
                :

                <Dropzone borderColor={true} colorMode={colorMode} onDrop={(file) => onReturn(file)}
                    title={t("clickToUpload")}
                    subheading={t("dragAndDrop")}
                    description={t("descriptionDropzone")}
                    drag={t("drag")}
                    loading={loading} />
            }
        </HStack>
    )

}

export default InputImageRow
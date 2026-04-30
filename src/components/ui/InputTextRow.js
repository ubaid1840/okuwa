import { theme } from "@/data/data"
import { HStack, Input, Text, Textarea, useColorModeValue } from "@chakra-ui/react"


const InputTextArea = ({ title, value, disabled, props, onChange, placeholder, colorMode }) => {

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
            <Textarea
                isDisabled={disabled}
                _disabled={{bg : 'transparent'}}
                 
                value={value}
                placeholder={placeholder}
                resize={"none"}
                height={"120px"}
                onChange={onChange}
            />
        </HStack>
    )

}

export default InputTextArea
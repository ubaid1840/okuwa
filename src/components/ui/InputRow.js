import { CountriesList, theme } from "@/data/data";
import { HStack, Input, Text, useColorModeValue } from "@chakra-ui/react"
import {
    Select as SearchableSelect,
    useChakraSelectProps,
} from "chakra-react-select";
import { useState } from "react";

const InputRow = ({ title, value, disabled, props, onChange, placeholder, type, isRequired, colorMode }) => {

    const [code, setCode] = useState({ value: "", label: "" });
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
    const bgColor = useColorModeValue('white', 'gray.800')

    const customChakraStyles = {
      
        control: (provided) => ({
            ...provided,
            borderColor: bdColor,
        }),
        input: (provided) => ({
            ...provided,
          }),
      
    };

    const codeSelectProps = useChakraSelectProps({
        value: code,
        onChange: setCode,
    });

    return (
        <HStack
            alignItems={"flex-start"}
            width={"100%"}
            maxWidth={'800px'}
            {...props}
        >
            <div style={{ width: "280px" }}>
                <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2} display={'flex'}>
                    {title} {isRequired && <Text ml={1} color={'red'}>*</Text>}
                </Text>
            </div>
            {type && type == 'number'
                ?
                <>
                    <div style={{ width: "250px" }}>
                        <SearchableSelect
                            chakraStyles={customChakraStyles}
                            options={CountriesList.map((item) => {
                                return {
                                    value: item.num,
                                    label: item.num,
                                };
                            })}
                            {...codeSelectProps}
                        />
                    </div>
                    <Input
                        bg={bgColor}
                        borderColor={bdColor}
                        placeholder={placeholder}
                        onChange={(e) => onChange({ target: { value: e.target.value ? code.value + e.target.value : code.value } })}
                        value={value}
                        isDisabled={disabled}
                        _disabled={{bg : 'transparent'}}
                    />
                </>

                :
                <Input
                isDisabled={disabled}
                _disabled={{bg : 'transparent'}}
                    bg={bgColor}
                    borderColor={bdColor}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}

                />}



        </HStack>
    )

}

export default InputRow
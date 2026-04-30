import { theme } from "@/data/data"
import { HStack, Input, Select, Text, useColorModeValue } from "@chakra-ui/react"
import { useTranslations } from "next-intl"


const InputSelectRow = ({ title, value, disabled, props, onChange, options, forRoom, isRequired, withoutTranslation, colorMode }) => {
    const t = useTranslations("Dictionary")
    const bgColor = useColorModeValue('white', 'gray.800')
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
    return (
        <HStack
            alignItems={"flex-start"}
            width={"100%"}
            maxWidth={'800px'}
            {...props}
        >
            <div style={{ width: "280px", display: 'flex' }}>
                <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2} display={'flex'}>
                    {title} {isRequired && <Text ml={1} color={'red'}>*</Text>}
                </Text>
                
            </div>
            {!forRoom ?
            !withoutTranslation ?
                <Select bg={bgColor}
                borderColor={bdColor} value={value} isDisabled={disabled} onChange={onChange}>
                    <option value={""}>
                        {t("selectOne")}
                    </option>
                    {options.map((item, index) => (
                        <option key={index} value={item}>{t(item)}</option>
                    ))}
                </Select>
                :
                <Select bg={bgColor}
                borderColor={bdColor} value={value} isDisabled={disabled} onChange={onChange}>
                <option value={""}>
                    {t("selectOne")}
                </option>
                {options.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                ))}
            </Select>
                :
                <Select bg={bgColor}
                borderColor={bdColor} isDisabled={disabled} onChange={onChange}>
                    <option value={""}>
                        {t("selectOne")}
                    </option>
                    {options.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))}
                </Select>}

        </HStack>
    )

}

export default InputSelectRow
import { theme } from "@/data/data"
import { VStack, Box, Image, HStack, Text, Input, useColorModeValue, } from "@chakra-ui/react"
import { useTranslations } from "next-intl"
import { useState } from "react"


const PrescriptionCard = ({ heading, head1, value1, head2, value2, head3, value3, onClick, condition, onChangeHeading, onChangeValue1, onChangeValue2, onChangeValue3, disabled, allowBorder, colorMode }) => {
  const t = useTranslations('Dictionary')
  const bdColor = useColorModeValue("#EAECF0", "gray.600")

  return (
    <VStack
      border={"1px solid"}
      borderRadius={"8px"}
      borderColor={bdColor}
      alignItems={"flex-start"}
      width={"100%"}
      py={"10px"}
    >
      <Box p={"16px"} width={"100%"}>
        <HStack justifyContent={"space-between"} w={'inherit'}>
          <HStack spacing={2} w={'inherit'}>
            <div
              style={{
                height: "32px",
                width: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F5F8FF",
                borderRadius: "50px",
              }}
            >
              <Image
                height={"16px"}
                width={"16px"}
                src="/assets/circle-cut.png"
              />
            </div>

            <Input value={heading} onChange={(e) => onChangeHeading(e.target.value)} isDisabled={disabled} w={'100%'} border={!allowBorder ? '0px solid' : '1px solid'} borderColor={bdColor} />

          </HStack>
          {condition &&
            <Text
              onClick={onClick}
              justifySelf={"flex-end"}
              fontSize="14px"
              fontWeight="500"
              color="#004EEB"
              _hover={{ cursor: "pointer" }}
            >
              {t('seeDetails')}
            </Text>
          }
        </HStack>
      </Box>
      <Box
        p={"16px"}
        borderTopWidth={"1px"}
        borderTopColor={bdColor}
        width={"100%"}
      >
        <HStack justify={"space-between"}>
          <VStack spacing={0} align={"flex-start"}>
            <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
              {head1}
            </Text>
            <Input value={value1} onChange={(e) => onChangeValue1(e.target.value)} isDisabled={disabled} border={!allowBorder ? '0px solid' : '1px solid'} borderColor={bdColor}/>
          </VStack>
          <VStack spacing={0} align={"flex-start"}>
            <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
              {head2}
            </Text>
            <Input value={value2} onChange={(e) => onChangeValue2(e.target.value)} isDisabled={disabled} border={!allowBorder ? '0px solid' : '1px solid'} borderColor={bdColor}/>
          </VStack>

          <VStack spacing={0} align={"flex-start"}>
            <Text color={colorMode === 'dark' && 'gray.300'} variant={"description"} fontSize={"14px"}>
              {head3}
            </Text>
            <Input value={value3} onChange={(e) => onChangeValue3(e.target.value)} isDisabled={disabled} border={!allowBorder ? '0px solid' : '1px solid'} borderColor={bdColor}/>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  )
}

export default PrescriptionCard
import { theme } from "@/data/data"
import { Box, Text, useColorMode } from "@chakra-ui/react"
import { useTranslations } from "next-intl"
import { useState } from "react"


const DashboardFilterButton = ({ onReturn, selected, colorMode }) => {

    const t = useTranslations("Dictionary")

    return (
       <div style={{display:'flex'}}>
         <Box
                  _hover={{ cursor: "pointer" }}
                  onClick={() => onReturn(4)}
                  width="100px"
                  height="40px"
                  alignItems="center"
                  display={"flex"}
                  justifyContent="center"
                  borderTopLeftRadius={"8px"}
                  borderBottomLeftRadius={"8px"}
                  border={"1px solid"}
                  borderColor={colorMode == 'light' ? theme.color.primaryBorderColor : 'gray.700'}
                  backgroundColor={selected == 4 ? colorMode == 'light' ? "#F9FAFB" : 'gray.600' : 'transparent'}
                  borderRightWidth={"0px"}
                  margin={0}
                >
                    <div>
                    <Text  variant={"subheading"} color={colorMode == 'light' ? 'black' : 'gray.300'}>{t("all")}</Text>
                  </div>
                </Box>
                <Box
                  _hover={{ cursor: "pointer" }}
                  onClick={() => onReturn(1)}
                  margin={0}
                  width="100px"
                  height="40px"
                  alignItems="center"
                  display={"flex"}
                  justifyContent="center"
                  border={"1px solid"}
                  borderColor={colorMode == 'light' ? theme.color.primaryBorderColor : 'gray.700'}
                  backgroundColor={selected == 1 ? colorMode == 'light' ? "#F9FAFB" : 'gray.600' : 'transparent'}
                >
                    <div>
                    <Text  variant={"subheading"} color={colorMode == 'light' ? 'black' : 'gray.300'}>{t("12months")}</Text>
                  </div>
                </Box>
                <Box
                  _hover={{ cursor: "pointer" }}
                  onClick={() => onReturn(2)}
                  margin={0}
                  width="100px"
                  height="40px"
                  alignItems="center"
                  display={"flex"}
                  justifyContent="center"
                  border={"1px solid"}
                  borderColor={colorMode == 'light' ? theme.color.primaryBorderColor : 'gray.700'}
                  backgroundColor={selected == 2 ? colorMode == 'light' ? "#F9FAFB" : 'gray.600' : 'transparent'}
                >
                  <div>
                    <Text  variant={"subheading"} color={colorMode == 'light' ? 'black' : 'gray.300'}>{t("30days")}</Text>
                  </div>
                </Box>
                <Box
                  _hover={{ cursor: "pointer" }}
                  onClick={() => onReturn(3)}
                  width="100px"
                  height="40px"
                  alignItems="center"
                  display={"flex"}
                  justifyContent="center"
                  borderTopRightRadius={"8px"}
                  borderBottomRightRadius={"8px"}
                  border={"1px solid"}
                  borderColor={colorMode == 'light' ? theme.color.primaryBorderColor : 'gray.700'}
                  backgroundColor={selected == 3 ? colorMode == 'light' ? "#F9FAFB" : 'gray.600' : 'transparent'}
                  borderLeftWidth={"0px"}
                >
                  <div>
                    <Text  variant={"subheading"} color={colorMode == 'light' ? 'black' : 'gray.300'}>{t("7days")}</Text>
                  </div>
                </Box>
       </div>
    )
}

export default DashboardFilterButton
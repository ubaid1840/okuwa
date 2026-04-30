"use client"
import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import Button from "@/components/ui/Button";
import { theme } from "@/data/data";
import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Page() {
  const t = useTranslations("Dictionary");
  const { colorMode } = useColorMode();
  return (
    <Flex height={"100vh"} align={"center"} justify={"center"}>
       <Box pos={"fixed"} top={5} right={10}>
        <DarkModeSwitcher />
      </Box>
      <VStack spacing={10}>
        <Image width={"210px"} height={"210px"} src="/assets/Done-pana-1.png" />
        <Text
          color={colorMode === "dark" && "gray.300"}
          fontWeight={"600"}
          fontSize={"30px"}
        >
          {t("registrationSuccessfull")}
        </Text>
        <div style={{ width: "70%" }}>
          <Text
            fontSize={"16px"}
            fontWeight={"400"}
            color={theme.text.secondary}
            textAlign={"center"}
          >
            {t("registrationSuccessfullSubheading")}
          </Text>
        </div>
        <HStack justifyContent={"center"} width={"100%"} paddingBottom={"32px"}>
          <div>
            <Link href={"/login"}>
              {/*          
              <Button
                variant="outline"
                backgroundColor={"#FFFFFF"}
                color={"black"}
                border={"1px solid"}
                borderColor={useColorModeValue(theme.color.primaryBorderColor, 'gray.700')}
              >
                {t('takeMeHome')}

              </Button> */}
            </Link>
          </div>
          <div>
            <Link target="_blank" href="https://gmail.com">
              <Button> {t("checkEmail")}</Button>
            </Link>
          </div>
        </HStack>
      </VStack>
    </Flex>
  );
}

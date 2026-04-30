"use client";
import Button from "@/components/ui/Button";
import Logo from "@/components/logo";
import { theme } from "@/data/data";
import {
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  Stack,
  Text,
  useColorMode,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import useCheckSession from "@/config/checkSession";
import { FooterOne } from "@/components/Footer";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";

export default function Page() {
  const t = useTranslations("Dictionary");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setValidation] = useState([false, false]);
  const [matched, setMatched] = useState(false);
  const [showSuccessfull, setShowSuccessfull] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast()
  const {colorMode} = useColorMode()

  useEffect(() => {
    if (password.length > 7) {
      if (validation[0] == false)
        setValidation((prevState) => {
          const newState = [...prevState];
          newState[0] = true;
          return newState;
        });
    } else {
      if (validation[0] == true)
        setValidation((prevState) => {
          const newState = [...prevState];
          newState[0] = false;
          return newState;
        });
    }

    if (!/[0-9]/.test(password)) {
      if (validation[1] == true)
        setValidation((prevState) => {
          const newState = [...prevState];
          newState[1] = false;
          return newState;
        });
    } else {
      if (validation[1] == false)
        setValidation((prevState) => {
          const newState = [...prevState];
          newState[1] = true;
          return newState;
        });
    }

    if (password == confirmPassword) {
      if (matched == false) setMatched(true);
    } else {
      if (matched == true) setMatched(false);
    }
  }, [password, confirmPassword]);

  function handlePasswordCreation() {
    try {
      const oobCode = new URLSearchParams(window.location.search).get("oobCode");
      const mode = new URLSearchParams(window.location.search).get("mode");
      const continueUrl = new URLSearchParams(window.location.search).get(
        "continueUrl"
      );
      confirmPasswordReset(auth, oobCode, password).then(() => {
        setLoading(false)
        router.push(continueUrl);
      }).catch((e)=>{
        setLoading(false)
        toast({
          title : "Error",
          description : e.message,
          duration : 3000,
          status : 'error',
          isClosable : true,
          position : 'top-right'
        })
      })
    } catch (error) {
      
      
    }
    // setShowSuccessfull(true);
   
  }

  return !showSuccessfull ? (
    <Flex height="100vh">
       <Box pos={"fixed"} top={5} right={10}>
        <DarkModeSwitcher />
      </Box>
      <Flex flex={1} direction="column" justify="space-between" align="center">
        <VStack
          width={"400px"}
          alignItems={"flex-start"}
          spacing={5}
          justify="center"
          flex={1}
        >
          <Logo />
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("setNewPassword")}</Text>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="description">{t("setNewPasswordSubheading")}</Text>
          <Stack dir="column" spacing={1} width={"100%"}>
            <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("password")}</Text>

            <Input
              placeholder={t("passwordInput")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
          <Stack dir="column" spacing={1} width={"100%"}>
            <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("confirmPassword")}</Text>

            <Input
              placeholder={t("confirmPasswordInput")}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Stack>
          <VStack alignItems={"flex-start"}>
            <HStack>
              <Icon
                as={FaCircleCheck}
                color={validation[0] ? theme.color.icon : "#CED3DB"}
                boxSize={5}
              />
              <Text color={validation[0] ? "green" : "#475467"}>
                {t("passwordValidation1")}
              </Text>
            </HStack>
            <HStack>
              <Icon
                as={FaCircleCheck}
                color={validation[1] ? theme.color.icon : "#CED3DB"}
                boxSize={5}
              />
              <Text color={validation[1] ? "green" : "#475467"}>
                {t("passwordValidation2")}
              </Text>
            </HStack>
          </VStack>

          <Button
            isLoading={loading}
            loadingText="Creating"
            isDisabled={!validation[0] || !validation[1] || !matched}
            onClick={() => {
              setLoading(true)
              handlePasswordCreation()}}
          >
            {t("confirmPassword")}
          </Button>
        </VStack>

        <FooterOne />
      </Flex>
      <Flex flex={1}>
        <Image
          src="/assets/password.png"
          alt="Full Size Image"
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Flex>
    </Flex>
  ) : (
    <Flex height={"100vh"} align={"center"} justify={"center"}>
       <Box pos={"fixed"} top={5} right={10}>
        <DarkModeSwitcher />
      </Box>
      <VStack spacing={5} width={"70%"}>
        <Image width={"210px"} height={"210px"} src="/assets/Done-pana-1.png" />
        <Text color={colorMode === 'dark' && 'gray.300'}fontWeight={"600"} fontSize={"30px"}>
          {t("passwordCreated")}
        </Text>
        <div style={{ width: "80%" }}>
          <Text
            fontSize={"16px"}
            fontWeight={"400"}
            color={theme.text.secondary}
            textAlign={"center"}
          >
            {t("passwordCreatedSubheading")}
          </Text>
        </div>
        <Link href="/login">
          <Button> {t("login")}</Button>
        </Link>
      </VStack>
    </Flex>
  );
}

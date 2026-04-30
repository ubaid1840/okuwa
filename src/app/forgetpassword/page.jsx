"use client";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Logo from "@/components/logo";
import {
  Flex,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
  Image,
  useDisclosure,
  useColorMode,
  Box,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HospitalContext } from "@/store/context/HospitalContext";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import useCheckSession from "@/config/checkSession";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";
import { FooterOne } from "@/components/Footer";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";

export default function Page() {
  const { colorMode } = useColorMode();
  const t = useTranslations("Dictionary");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selected, setSelected] = useState(Array(5).fill(false));
  const pathname = usePathname();
  const [selectedMedicalCenter, setSelectedMedicalCenter] = useState([]);
  const [searchItem, setSearchItem] = useState("");

  const itemsHeading = [
    t("emergencies"),
    t("intensiveCare"),
    t("maternity"),
    t("surgery"),
    t("radiologyAndMedicalImaging"),
  ];

  const itemsSubheading = [
    t("emergenciesSubheading"),
    t("intensiveCareSubheading"),
    t("maternitySubheading"),
    t("surgerySubheading"),
    t("radiologyAndMedicalImagingSubheading"),
  ];

  const checkSession = useCheckSession();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (email.includes("@") && email.includes(".")) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }

    if (password.length > 7) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  }, [email, password]);

  function checkExists(data) {
    const temp = selectedMedicalCenter.filter((item) => item === data);
    if (temp.length > 0) return true;
  }

  function removeSelection(name) {
    const temp = selectedMedicalCenter.filter((item) => item !== name);
    setSelectedMedicalCenter([...temp]);
  }

  function handleSelectedOption(name) {
    const temp = selectedMedicalCenter.filter((item, index) => item === name);
    if (temp.length > 0) {
      removeSelection(name);
    } else {
      const temp = [...selectedMedicalCenter];
      temp.push(name);
      setSelectedMedicalCenter([...temp]);
    }
  }

  async function handleResetEmail() {
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin,
    }).then(() => {
      console.log("email sent");
    });
  }

  return (
    <Flex height="100vh">
      <Box pos={"fixed"} top={5} right={10}>
        <DarkModeSwitcher />
      </Box>
      <Flex flex={1}>
        <Image
          src="/assets/login.png"
          alt="Full Size Image"
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Flex>
      <Flex flex={1} direction="column" justify="space-between" align="center">
        <VStack
          width={"400px"}
          alignItems={"flex-start"}
          spacing={5}
          justify="center"
          flex={1}
        >
          <Logo />
          <Text color={colorMode === "dark" && "gray.300"} variant="heading">
            {t("resetPassword")}
          </Text>
          <Text
            color={colorMode === "dark" && "gray.300"}
            variant="description"
          >
            {t("resetPasswordSubheading")}
          </Text>
          <Stack dir="column" spacing={1} width={"100%"}>
            <Text
              color={colorMode === "dark" && "gray.300"}
              variant="subheading"
            >
              {" "}
              {t("email")}
            </Text>

            <Input
              placeholder={t("emailInput")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Stack>

          <Button
            onClick={() => handleResetEmail()}
            width={"100%"}
            isDisabled={!isEmailValid ? true : false}
          >
            {" "}
            {t("reset")}
          </Button>

          <HStack width={"auto"} alignSelf={"center"}>
            <Text
              color={colorMode === "dark" && "gray.300"}
              variant="description"
            >
              {" "}
              {t("loginBack")}
            </Text>
            <Link href="/login" _hover={{ textDecorationLine: "none" }}>
              <Text variant="link" fontWeight={"500"}>
                {t("login")}
              </Text>
            </Link>
          </HStack>
        </VStack>

        <FooterOne />
      </Flex>
    </Flex>
  );
}

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
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  InputGroup,
  InputLeftElement,
  Icon,
  useToast,
  Box,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HospitalContext } from "@/store/context/HospitalContext";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { medicalServices } from "./data";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { theme } from "@/data/data";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import useCheckSession from "@/config/checkSession";
import axios from "@/lib/axiosInstance";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { MdCancel } from "react-icons/md";
import Cookies from "js-cookie";
import { FooterOne } from "@/components/Footer";
import { showToastFailed } from "@/utils/toastUtils";
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
  const [currentID, setCurrentID] = useState(0);
  const [selected, setSelected] = useState([]);
  const pathname = usePathname();
  const [selectedMedicalCenter, setSelectedMedicalCenter] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const toastIdRef = useRef(null);
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const itemsHeading = [
    "emergencies",
    "intensiveCare",
    "maternity",
    "surgery",
    "radiologyAndMedicalImaging",
  ];

  const itemsSubheading = [
    "emergenciesSubheading",
    "intensiveCareSubheading",
    "maternitySubheading",
    "surgerySubheading",
    "radiologyAndMedicalImagingSubheading",
  ];

  // const checkSession = useCheckSession();

  // useEffect(() => {
  //   checkSession()
  // }, []);

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

  async function handleLogin(role) {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "frontDesk") {
          router.push("/frontdesk");
        } else if (role === "doctor") {
          router.push("/doctor");
        } else if (role === "labUser") {
          router.push("/lab");
        } else if (role === "nurse") {
          router.push("/nurse");
        }
      })
      .catch((e) => {
        setLoading(false);
        showToastFailed(toast, toastIdRef, t("Failed"), e.message);
      });
  }

  async function handleLoginInsurance() {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
        router.push("/insurance");
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        showToastFailed(toast, toastIdRef, t("Failed"), e.message);
      });
  }

  async function handleSignIn() {
    if (email == "superadmin@gmail.com") {
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          setLoading(false);
          router.push("/internal");
        })
        .catch((e) => {
          setLoading(false);
          showToastFailed(toast, toastIdRef, t("Failed"), e.message);
        });
    } else {
      try {
        const response = await axios.post("/api/login", { email: email });
        if (response.data?.insuranceid) {
          handleLoginInsurance();
        } else {
          if (response.data?.role) {
            setCurrentID(response.data?.centerid);
            if (response.data?.role === "admin") {
              if (response.data?.settingsData) {
                handleLogin(response.data.role);
              } else {
                onOpen();
              }
            } else {
              handleLogin(response.data.role);
            }
          } else {
            setLoading(false);
          }
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
        if (e.response && e.response.data) {
          showToastFailed(
            toast,
            toastIdRef,
            t("Failed"),
            e?.response?.data?.message
          );
        } else {
          showToastFailed(toast, toastIdRef, t("Failed"), e.message);
        }
      }
    }
  }

  function handleGetStarted() {
    onClose();
    const temp = [...selected, ...selectedMedicalCenter];
    axios
      .post("/api/insert", {
        table: "settings",
        columns: ["centerid", "settings_array"],
        values: [currentID, temp],
      })
      .then((response) => {
        // console.log(response.data);
        handleLogin("admin");
      });
  }

  return (
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
          {/* <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("welcomeBack")}</Text> */}
          <Text color={colorMode === "dark" && "gray.300"} variant="heading">
            {t("welcomeBackSubheading")}
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
          <Stack dir="column" spacing={1} width={"100%"}>
            <Text
              color={colorMode === "dark" && "gray.300"}
              variant="subheading"
            >
              {" "}
              {t("password")}
            </Text>

            <Input
              placeholder={t("passwordInput")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
          <HStack width={"100%"} justify={"space-between"}>
            <Checkbox onChange={(e) => setRemember(e.target.checked)}>
              {t("rememberMe")}
            </Checkbox>
            <Link
              href="/forgetpassword"
              _hover={{ textDecorationLine: "none" }}
            >
              <Text variant="link" fontWeight={"500"}>
                {t("forgetPassword")}
              </Text>
            </Link>
          </HStack>
          {/* <Link href={"/admin"} style={{ width: "100%" }}> */}
          <Button
            isLoading={loading}
            onClick={() => {
              setLoading(true);
              handleSignIn();
            }}
            width={"100%"}
            isDisabled={!isEmailValid || !isPasswordValid ? true : false}
          >
            {" "}
            {t("signIn")}
          </Button>
          {/* </Link> */}
          <HStack width={"auto"} alignSelf={"center"}>
            <Text
              color={colorMode === "dark" && "gray.300"}
              variant="description"
            >
              {" "}
              {t("noAccount")}
            </Text>
            <Link href="/signup" _hover={{ textDecorationLine: "none" }}>
              <Text variant="link" fontWeight={"500"}>
                {t("signUp")}
              </Text>
            </Link>
          </HStack>
        </VStack>

        <FooterOne />
      </Flex>
      <Flex flex={1}>
        <Image
          src="/assets/login.png"
          alt="Full Size Image"
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Flex>

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent maxW={"90%"} width={"900px"}>
          <AlertDialogBody mb={5}>
            <HStack align={"flex-start"} w={"100%"} gap={10} mt={5}>
              <VStack gap={3} width={"100%"}>
                <Logo />
                <Text
                  color={colorMode === "dark" ? "gray.300" : "#101828"}
                  fontSize={"18px"}
                  fontWeight={"500"}
                >
                  {t("selectServicesOffered")}
                </Text>

                <Text
                  color={colorMode === "dark" ? "gray.300" : "#667085"}
                  fontSize={"14px"}
                  fontWeight={"400"}
                >
                  {t("selectServicesOfferedSubheading")}
                </Text>

                {itemsHeading.map((item, index) => (
                  <VStack
                    key={index}
                    w={"inherit"}
                    align={"flex-start"}
                    p={4}
                    border={"1px solid"}
                    borderRadius={"8px"}
                    borderColor={
                      selected[index] == true ? "#155EEF" : "#EAECF0"
                    }
                    bg={selected[index] == true ? "#EFF4FF" : "#FFFFFF"}
                  >
                    <HStack align={"flex-start"}>
                      <Checkbox
                        style={{ marginTop: "5px" }}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelected((prevState) => {
                              const newState = [...prevState];
                              newState.push(item);
                              return newState;
                            });
                          } else {
                            const temp = selected.filter(
                              (item, ind) => ind !== index
                            );
                            setSelected([...temp]);
                          }
                        }}
                      />
                      <VStack align={"flex-start"} gap={0}>
                        <Text
                          variant={"subheading"}
                          fontSize={"16px"}
                          color={
                            selected[index] == true ? "#0040C1" : "#344054"
                          }
                        >
                          {t(item)}
                        </Text>
                        <Text
                          variant={"description"}
                          color={
                            selected[index] == true ? "#155EEF" : "#667085"
                          }
                        >
                          {itemsSubheading[index]}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                ))}
              </VStack>

              <VStack width={"100%"}>
                <Text
                  color={colorMode === "dark" ? "gray.300" : "#101828"}
                  fontSize={"18px"}
                  fontWeight={"500"}
                >
                  {t("couldNotFindCenter")}
                </Text>

                <Text
                  color={colorMode === "dark" ? "gray.300" : "#667085"}
                  fontSize={"14px"}
                  fontWeight={"400"}
                >
                  {t("couldNotFindCenterSubheading")}
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={CiSearch} boxSize={5} color="#667085" />
                  </InputLeftElement>
                  <Input
                    placeholder={t("search")}
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                  />
                </InputGroup>
                <VStack
                  align={"flex-start"}
                  gap={0}
                  maxH={"550px"}
                  overflowY={"auto"}
                  width={"100%"}
                >
                  {medicalServices
                    .filter((item) =>
                      t(item)
                        ?.toLocaleLowerCase()
                        .includes(searchItem.toLocaleLowerCase())
                    )
                    .map((item, index) => (
                      <HStack
                        borderBottomWidth={1}
                        borderBottomColor={theme.divider.primary}
                        p={3}
                        bg={checkExists(index) ? "#F5F8FF" : "white"}
                        _hover={{ cursor: "pointer" }}
                        width={"100%"}
                        justify={"space-between"}
                        key={index}
                        onClick={() => {
                          handleSelectedOption(item);
                        }}
                      >
                        <HStack>
                          <Text
                            color={colorMode === "dark" && "gray.300"}
                            variant={"subheading"}
                          >
                            {t(item)}
                          </Text>
                        </HStack>
                        {checkExists(item) && <CheckIcon />}
                      </HStack>
                    ))}
                </VStack>
              </VStack>
            </HStack>
          </AlertDialogBody>

          <AlertDialogFooter w={"100%"}>
            <Button
              w={"100%"}
              onClick={() => {
                handleGetStarted();
              }}
            >
              {t("getStarted")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
}

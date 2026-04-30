"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { CheckIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import "react-datepicker/dist/react-datepicker.css";
import {
  Divider,
  Flex,
  HStack,
  Input,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Image,
  Select,
  Box,
  Icon,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  InputGroup,
  InputLeftElement,
  Avatar,
  useToast,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { useTranslations } from "next-intl";
import { IoIosSend } from "react-icons/io";
import { data, patientList } from "../data";
import { IoMicOutline } from "react-icons/io5";
import { LuBadgeCheck } from "react-icons/lu";

export default function Page() {
  const t = useTranslations("Dictionary");
  const pathName = usePathname();
  const cancelRef = useRef();
  const sideLinks = GetLinkItems("nurse");
  const [singleDetail, setSingleDetail] = useState();
  const [searchItem, setSearchItem] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPatient, setSelectedPatient] = useState([]);
  const {colorMode} = useColorMode()

  useEffect(() => {
    const search = new URLSearchParams(window.location.search).get("id");
    if (search) {
      
    const temp = data.filter((item) => item.id === Number(search))
    setSingleDetail(temp[0]);
    }
  }, []);

  function checkExists(index) {
    const temp = selectedPatient.filter((item) => item === index);
    if (temp.length > 0) return true;
  }

  function removeSelection(index) {
    const temp = selectedPatient.filter((item) => item !== index);
    setSelectedPatient([...temp]);
  }

  function handleSelectedPatient(index) {
    const temp = selectedPatient.filter((item) => item === index);
    if (temp.length > 0) {
      removeSelection(index);
    } else {
      setSelectedPatient((prevState) => {
        const newState = [...prevState];
        newState.push(index);
        return newState;
      });
    }
  }

  const toastIdRef = useRef(null);
  const toast = useToast();

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
      toastIdRef.current = null;
    }
  }

  function addToastArticle() {
    if (!toastIdRef.current || !toast.isActive(toastIdRef.current)) {
      toastIdRef.current = toast({
        render: () => (
          <Box
            width={"400px"}
            padding={"10px"}
            bg={"#ECFDF3"}
            borderRadius={"8px"}
          >
            <HStack alignItems={"flex-start"} spacing={5}>
              <div
                style={{
                  backgroundColor: "#D1FADF",
                  display: "flex",
                  borderRadius: "100px",
                  padding: "5px",
                }}
              >
                <Icon as={LuBadgeCheck} color={"#039855"} boxSize={6} />
              </div>
              <VStack alignItems={"flex-start"}>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading" >
                  {t("articleSuccessfullySent")}
                </Text>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="description" fontSize="14px">
                  {t("articleSuccessfullySentSubheading")}
                </Text>
              </VStack>
              <CloseIcon
                _hover={{ cursor: "pointer" }}
                height={"10px"}
                width={"10px"}
                color={"#667085"}
                onClick={() => closeToast()}
              />
            </HStack>
          </Box>
        ),
        position: "top-right",
        duration: 3000,
      });
    }
  }

  return (
    <Sidebar LinkItems={sideLinks} >
      {singleDetail && (
        <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
          <HStack fontSize="14px" fontWeight="500" color="#667085">
            <Link href={pathName.replace(/\/[^\/]*$/, "")}>
              {t("medicalLibrary")}
            </Link>
            <ChevronRightIcon />
            <Text color={colorMode === 'dark' ? 'gray.300' : "#344054"}>{singleDetail.title}</Text>
          </HStack>
          <HStack justifyContent={"space-between"}>
            <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{singleDetail.title}</Text>
            <HStack>
              <Button onClick={onOpen} leftIcon={<Icon as={IoIosSend} />}>
                {t("shareToPatient")}
              </Button>
            </HStack>
          </HStack>
          <VStack alignItems={"flex-start"} width={"60%"} gap={3}>
            <VStack align={"flex-start"} gap={1}>
              <Text color={colorMode === 'dark' ? 'gray.300' : "#475467"} fontSize={"16px"} fontWeight={"600"}>
                {t("description")}
              </Text>
              <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"} fontSize={"16px"} fontWeight={"400"}>
                {singleDetail.description}
              </Text>
            </VStack>

            <VStack align={"flex-start"} gap={1}>
              <Text color={colorMode === 'dark' ? 'gray.300' : "#475467"} fontSize={"16px"} fontWeight={"600"}>
                {t("treatment")}
              </Text>
              <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"} fontSize={"16px"} fontWeight={"400"}>
                {singleDetail.treatment}
              </Text>
            </VStack>
          </VStack>
        </Flex>
      )}

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent>
          <AlertDialogHeader>
            <div
              style={{
                display: "flex",
                borderRadius: "30px",
                backgroundColor: "#b2d8d8" ,
                border: "6px solid",
                borderColor: colorMode == 'light' ? "#EFF4FF" : 'inherit',
                height: "40px",
                width: "40px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon color={theme.color.primary} as={IoIosSend} boxSize={5} />
            </div>
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody mb={5}>
            <VStack alignItems={"flex-start"} spacing={5}>
              <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"}fontSize={"18px"} fontWeight={"500"} >
                {t("shareToPatient")}
              </Text>

              <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"}fontSize={"14px"} fontWeight={"400"} >
                {singleDetail?.title}
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
                maxH={"50vh"}
                overflowY={"auto"}
                width={"100%"}
              >
                {patientList
                  .filter((item) =>
                    item?.patientName
                      ?.toLocaleLowerCase()
                      .includes(searchItem.toLocaleLowerCase())
                  )
                  .map((item, index) => (
                    <HStack
                      borderBottomWidth={1}
                      borderBottomColor={colorMode == 'light' ? theme.divider.primary : 'gray.700'}
                      p={3}
                      bg={checkExists(index) ? colorMode == 'light' ? "#F5F8FF" : 'gray.500' : "transparent"}
                      _hover={{ cursor: "pointer" }}
                      width={"100%"}
                      justify={"space-between"}
                      key={index}
                      onClick={() => {
                        handleSelectedPatient(index);
                      }}
                    >
                      <HStack>
                        <Avatar name={item?.patientName} />
                        <VStack align={"flex-start"} gap={0}>
                          <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>
                            {item?.patientName}
                          </Text>
                          <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{item?.patientID}</Text>
                        </VStack>
                      </HStack>
                      {checkExists(index) && <CheckIcon />}
                    </HStack>
                  ))}
              </VStack>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter width={"100%"} justifyContent={"space-between"}>
            <GhostButton width={"100%"} onClick={() => onClose()}>
              {t("cancel")}
            </GhostButton>
            <Button onClick={() =>{
                onClose()
                addToastArticle()}} width={"100%"} ml={3}>
              {t("share")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}




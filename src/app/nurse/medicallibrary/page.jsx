"use client";
import Button, { DangerButton, GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import {
  AddIcon,
  ArrowBackIcon,
  CloseIcon,
  DeleteIcon,
  DownloadIcon,
} from "@chakra-ui/icons";

import {
  Image,
  Box,
  Flex,
  HStack,
  Text,
  useToast,
  VStack,
  Icon,
  InputGroup,
  InputLeftElement,
  Input,
  Menu,
  MenuButton,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Avatar,
  Divider,
  IconButton,
  UnorderedList,
  ListItem,
  Tabs,
  TabList,
  TabIndicator,
  TabPanels,
  TabPanel,
  Tab,
  Textarea,
  Select,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { CiCalendar, CiSearch } from "react-icons/ci";
import {
  IoCall,
  IoCallOutline,
  IoFilterSharp,
  IoMicOutline,
} from "react-icons/io5";
import { PiCalendarHeartLight, PiIntersect } from "react-icons/pi";
import {
  HiMiniArrowUturnRight,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { Status } from "@/components/ui/StatusBox";
import { TbCalendarHeart } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";
import { LuBadgeCheck, LuCalendarMinus } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { data, medicalRecordData } from "./data";
import {
  IoMdAddCircleOutline,
  IoMdArrowBack,
  IoMdCheckboxOutline,
} from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import PrescriptionCard from "@/components/ui/prescriptionCard";
import { BsStars } from "react-icons/bs";
import { FiPlusCircle } from "react-icons/fi";
import Checkbox from "@/components/ui/Checkbox";
import { useTranslations } from "next-intl";
import { MedicalLibraryCard } from "@/components/ui/MedicalLibraryCard";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("Dictionary");
  const pathname = usePathname();
  const [isDetailOpen, setIsDetaiOpen] = useState(false);
  const toastIdRef = useRef(null);
  const toast = useToast();
  const [allData, setAllData] = useState([]);
  const [viewConsultation, setViewConsultation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenAI,
    onOpen: onOpenAI,
    onClose: onCloseAI,
  } = useDisclosure();

  const {
    isOpen: isOpenPreview,
    onOpen: onOpenPreview,
    onClose: onClosePreview,
  } = useDisclosure();

  const {
    isOpen: isOpenFinishConsultation,
    onOpen: onOpenFinishConsultation,
    onClose: onCloseFinishConsultation,
  } = useDisclosure();

  const cancelRef = useRef();
  const cancelRefAI = useRef();
  const [micPressed, setMicPressed] = useState(false);
  const [search, setSearch] = useState("");
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [medicinePrescriptionCompleted, setMedicinePrescriptionCompleted] =
    useState(false);
  const [diagnosisOptions, setDiagnosisOptions] = useState([
    "Diagnosis 1",
    "Diagnosis 2",
    "Diagnosis 3",
  ]);
  const [diagnosisList, setDiagnosisList] = useState([
    {
      value: t("selectDiagnosis"),
    },
  ]);
  const [mainForm, setMainForm] = useState({
    complaint: "",
    history: "",
    examination: "",
  });

  const { colorMode } = useColorMode();
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.700");

  useEffect(() => {
    setAllData(data);
  }, []);

  function handleSearch() {
    const temp = data.filter((item) =>
      item.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
    setAllData([...temp]);
  }
 

  const sideLinks = GetLinkItems("nurse");
  return (
    <Sidebar LinkItems={sideLinks}>
      <Flex
        flex={1}
        gap={"20px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <Text color={colorMode === "dark" && "gray.300"} variant="heading">
          {" "}
          {t("medicalLibrary")}
        </Text>

        <HStack width={"50%"} p={5} gap={200}>
          <div style={{ display: "flex", width: "100%" }}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={CiSearch} boxSize={5} color="#667085" />
              </InputLeftElement>
              <Input
                placeholder={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
            <Menu>
              <MenuButton
                border={"0px solid"}
                borderColor={bdColor}
                borderRightWidth={0}
                borderTopLeftRadius={"8px"}
                borderBottomLeftRadius={"8px"}
                paddingInline={"1rem"}
                onClick={() => handleSearch()}
              >
                <Box
                  display="flex"
                  height="40px"
                  border={"1px solid"}
                  borderRadius={"5px"}
                  borderColor={bdColor}
                  px={"10px"}
                  alignItems={"center"}
                >
                  <Icon as={IoFilterSharp} boxSize={4} color="#344054" />
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    ml={2}
                    variant="subheading"
                  >
                    {t("filter")}
                  </Text>
                </Box>
              </MenuButton>
            </Menu>
          </div>
        </HStack>

        <Tabs mx={"32px"} overflowY={"auto"}>
          <TabList
            borderBottomWidth={"1px"}
            borderBottomColor={bdColor}
          >
            {[t("all"), t("diagnosis"), t("medicine")].map((item, index) => (
              <Tab
                key={index}
                fontWeight={"500"}
                fontSize={"14px"}
                _selected={{ color: theme.color.primary }}
              >
                {item}
              </Tab>
            ))}
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg={theme.color.primary}
            borderRadius="1px"
            width={"100px"}
          />
          <TabPanels mt={5}>
            <TabPanel>
              <VStack gap={10}>
                {allData.map((item, index) => (
                  <MedicalLibraryCard
                  colorMode={colorMode}
                    data={item}
                    key={index}
                    index={index}
                    onPress={(i) =>
                      router.push(`${pathname}/${item.title}?id=${i}`)
                    }
                  />
                ))}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack gap={10}>
                {allData
                  .filter((item) => item.type === "Diagnosis")
                  .map((item, index) => (
                    <MedicalLibraryCard
                    colorMode={colorMode}
                      data={item}
                      key={index}
                      index={index}
                      onPress={(i) =>
                        router.push(`${pathname}/${item.title}?id=${i}`)
                      }
                    />
                  ))}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack gap={10}>
                {allData
                  .filter((item) => item.type === "Medicine")
                  .map((item, index) => (
                    <MedicalLibraryCard
                    colorMode={colorMode}
                      data={item}
                      key={index}
                      index={index}
                      onPress={(i) =>
                        router.push(`${pathname}/${item.title}?id=${i}`)
                      }
                    />
                  ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Sidebar>
  );
}

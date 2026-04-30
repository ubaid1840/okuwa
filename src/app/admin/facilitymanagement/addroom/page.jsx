"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Select as MultiSelect } from "chakra-react-select";
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
  Textarea,
  useToast,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { CiCalendar } from "react-icons/ci";
import { useTranslations } from "next-intl";
import axios from "@/lib/axiosInstance";
import { UserContext } from "@/store/context/UserContext";
import { showToastFailed } from "@/utils/toastUtils";

export default function Page() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { state: UserState } = useContext(UserContext);
  const router = useRouter();
  const t = useTranslations("Dictionary");
  const pathName = usePathname();
  const [loading, setLoading] = useState(false);
  const toastIdRef = useRef(null);
  const bgColor = useColorModeValue('white', 'gray.800')
  const bdColor = useColorModeValue(
    theme.color.primaryBorderColor,
    "gray.700"
  )
  const [data, setData] = useState({
    roomName: "",
    roomDescription: "",
    procedures: [],
  });
  const customChakraStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: bdColor
    }),
  };


  async function handleSaveFacility() {
    axios
      .post("/api/insert", {
        table: "room",
        columns: ["centerid", "name", "description", "procedures"],
        values: [
          UserState.value.data.centerid,
          data.roomName,
          data.roomDescription,
          data.procedures,
        ],
      })
      .then((response) => {
        router.push(`${pathName.replace(/\/[^\/]*$/, "")}?facilityadded=true`);
      })
      .catch((e) => {
        setLoading(false);
        if (e?.response?.data?.message) {
          showToastFailed(
            toast,
            toastIdRef,
            t("Failed"),
            e.response.data.message
          );
        }
      });
  }

  const sideLinks = GetLinkItems("admin");
  return (
    <Sidebar LinkItems={sideLinks} settingsLink={"/admin/settings"}>
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <HStack fontSize="14px" fontWeight="500" color="#667085">
          <Link href={pathName.replace(/\/[^\/]*$/, "")}>{t("facility")}</Link>
          <ChevronRightIcon />
          <Text color={colorMode === "dark" ? "gray.300" : "#344054"}>
            {t("addNewRoom")}
          </Text>
        </HStack>
        <HStack justifyContent={"space-between"}>
          <Text color={colorMode === "dark" && "gray.300"} variant="heading">
            {t("addNewRoom")}
          </Text>
          <HStack>
            <Link href={`${pathName.replace(/\/[^\/]*$/, "")}`}>
              <GhostButton
                onClick={() =>
                  setData({
                    roomName: "",
                    roomDescription: "",
                    procedures: [],
                  })
                }
              >
                {t("cancel")}
              </GhostButton>
            </Link>

            <Button
              isLoading={loading}
              isDisabled={!UserState.value.data?.role}
              onClick={() => {
                setLoading(true);
                handleSaveFacility();
              }}
            >
              {t("save")}
            </Button>
          </HStack>
        </HStack>
        <VStack alignItems={"flex-start"} width={"70%"} spacing={5}>
          <HStack width={"100%"} alignItems={"flex-start"}>
            <div style={{ width: "380px" }}>
              <Text
                color={colorMode === "dark" && "gray.300"}
                variant={"subheading"}
                mt={2}
              >
                {t("roomName")}
              </Text>
            </div>
            <Input
             bg={bgColor}
             borderColor={bdColor}
              placeholder="Input room name"
              value={data.roomName}
              onChange={(e) =>
                setData((prevState) => {
                  const newState = { ...prevState };
                  newState.roomName = e.target.value;
                  return newState;
                })
              }
            />
          </HStack>
          <HStack width={"100%"} alignItems={"flex-start"}>
            <div style={{ width: "380px" }}>
              <Text
                color={colorMode === "dark" && "gray.300"}
                variant={"subheading"}
                mt={2}
              >
                {t("roomDescription")}
              </Text>
            </div>
            <Textarea
             bg={bgColor}
             borderColor={bdColor}
              value={data.roomDescription}
              height={"150px"}
              resize={"none"}
              placeholder={t("roomDescriptionInput")}
              onChange={(e) =>
                setData((prevState) => {
                  const newState = { ...prevState };
                  newState.roomDescription = e.target.value;
                  return newState;
                })
              }
            />
          </HStack>
          <HStack width={"100%"}>
            <div style={{ width: "380px" }}>
              <Text
                color={colorMode === "dark" && "gray.300"}
                variant={"subheading"}
                mt={2}
              >
                {t("availableProcedures")}
              </Text>
            </div>
            <div style={{ width: "100%" }}>
              <MultiSelect
                isMulti
                onChange={(e) => {
                  setData((prevState) => {
                    const newState = { ...prevState };
                    newState.procedures = [...e];
                    return newState;
                  });
                }}
                closeMenuOnSelect={false}
                useBasicStyles
                chakraStyles={customChakraStyles}
                colorScheme="blue"
                options={[
                  {
                    label: t("dentalCleaning"),
                    value: "dentalCleaning",
                  },
                  {
                    label: t("scaling"),
                    value: "scaling",
                  },
                  {
                    label: t("radiology"),
                    value: "radiology",
                  },
                  {
                    label: t("surgical"),
                    value: "surgical",
                  },
                  {
                    label: t("intensiveCareUnit"),
                    value: "intensiveCareUnit",
                  },
                  {
                    label: t("observation"),
                    value: "observation",
                  },
                  {
                    label: t("therapy"),
                    value: "therapy",
                  },
                  {
                    label: t("pediatrics"),
                    value: "pediatrics",
                  },
                  {
                    label: t("cardiology"),
                    value: "cardiology",
                  },
                  {
                    label: t("recovery"),
                    value: "recovery",
                  },
                ]}
              />
            </div>
          </HStack>
        </VStack>
      </Flex>
    </Sidebar>
  );
}

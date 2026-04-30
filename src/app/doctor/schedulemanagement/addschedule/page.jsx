"use client";
import Button from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { ChevronRightIcon } from "@chakra-ui/icons";
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
  useToast,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { CiCalendar } from "react-icons/ci";
import { useTranslations } from "next-intl";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";
import { showToastFailed } from "@/utils/toastUtils";

export default function Page() {
  const toast = useToast();
  const t = useTranslations("Dictionary");
  const pathName = usePathname();
  const [loading, setLoading] = useState(false);
  const toastIdRef = useRef(null)
  const [formData, setFormData] = useState({
    day: "",
    startTime: "",
    endTime: "",
  });
  const route = useRouter();
  const { state: UserState } = useContext(UserContext);
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
  const {colorMode} = useColorMode()
  async function handleAddSchedule() {
    await axios
      .post("/api/doctor/schedule/add", {
        centerid: UserState.value.data.centerid,
        doctorid: UserState.value.data.id,
        day: formData.day,
        starttime: formData.startTime,
        endtime: formData.endTime,
      })
      .then(() => {
        route.push(`${pathName.replace(/\/[^\/]*$/, "")}?scheduleadded=true`);
      })
      .catch((e) => {
        if (e?.response?.data?.message) {
          showToastFailed(toast, toastIdRef, t("Failed"), e.response.data.message)
         
        } else {
          showToastFailed(toast, toastIdRef, t("Failed"), e.message)
        }
      });
  }
  function addOneHour(timeString) {
    // Create a new Date object using the current date and the provided time
    let [hours, minutes] = timeString.split(":");
    let date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));

    // Add 1 hour
    date.setHours(date.getHours() + 1);

    // Format the new time as "HH:MM"
    let newHours = String(date.getHours()).padStart(2, "0");
    let newMinutes = String(date.getMinutes()).padStart(2, "0");

    return `${newHours}:${newMinutes}`;
  }


  const doctorLinks = GetLinkItems("doctor");
  return (
    <Sidebar LinkItems={doctorLinks}  >
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <HStack fontSize="14px" fontWeight="500" color="#667085">
          <Link href={pathName.replace(/\/[^\/]*$/, "")}>
            {t("scheduleManagement")}
          </Link>
          <ChevronRightIcon />
          <Text color={colorMode === 'dark' ? 'gray.300' : "#344054"}>{t("addNewSchedule")}</Text>
        </HStack>
        <HStack justifyContent={"space-between"}>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("addNewSchedule")}</Text>
          <HStack>
            <Link href={`${pathName.replace(/\/[^\/]*$/, "")}`}>
              <Button
                variant="outline"
                backgroundColor={"#FFFFFF"}
                color={"black"}
                border={"1px solid"}
                borderColor={bdColor}
              >
                {t("cancel")}
              </Button>
            </Link>

            {/* <Link
              href={`${pathName.replace(/\/[^\/]*$/, "")}?scheduleadded=true`}
            > */}
            <Button
              isDisabled={
                !formData.day ||
                !formData.startTime ||
                !formData.endTime ||
                !UserState.value.data?.id
              }
              isLoading={loading}
              onClick={() => handleAddSchedule()}
            >
              {t("save")}
            </Button>
            {/* </Link> */}
          </HStack>
        </HStack>
        <VStack alignItems={"flex-start"} width={"60%"} spacing={5}>
          <HStack width={"100%"}>
            <div style={{ width: "280px" }}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} width={"280px"}>
                {t("day")}
              </Text>
            </div>
            <Select
              value={formData.day}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  day: e.target.value,
                }))
              }
            >
              <option disabled value={""}>
                {t("selectOne")}
              </option>
              <option value="monday">{t("monday")}</option>
              <option value="tuesday">{t("tuesday")}</option>
              <option value="wednesday">{t("wednesday")}</option>
              <option value="thursday">{t("thursday")}</option>
              <option value="friday">{t("friday")}</option>
            </Select>
          </HStack>
          <HStack width={"100%"}>
            <div style={{ width: "280px" }}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} width={"280px"}>
                {t("time")}
              </Text>
            </div>
            <Select
              value={formData.startTime}
              onChange={(e) => {
                const startTime = e.target.value;
                const endTime = addOneHour(startTime);
                setFormData((prevState) => ({
                  ...prevState,
                  startTime: startTime,
                  endTime: endTime,
                }));
              }}
            >
              <option disabled value={""}>
                {t("selectOne")}
              </option>
              <option value="00:00">00:00</option>
              <option value="01:00">01:00</option>
              <option value="02:00">02:00</option>
              <option value="03:00">03:00</option>
              <option value="04:00">04:00</option>
              <option value="05:00">05:00</option>
              <option value="06:00">06:00</option>
              <option value="07:00">07:00</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
              <option value="22:00">22:00</option>
              <option value="23:00">23:00</option>
            </Select>
            {formData.endTime && (
             <Input  value={formData.endTime} onChange={(e) => {}} />
            )}
          </HStack>
        </VStack>
      </Flex>
    </Sidebar>
  );
}

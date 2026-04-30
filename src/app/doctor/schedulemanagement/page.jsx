"use client";
import Button from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

import {
  Image,
  Box,
  Flex,
  HStack,
  Text,
  useToast,
  VStack,
  Icon,
  useColorMode,
} from "@chakra-ui/react";

import { useContext, useEffect, useRef, useState } from "react";
import { LuBadgeCheck, LuCalendarMinus } from "react-icons/lu";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { useTranslations } from "next-intl";
import { ScheduleCard } from "@/components/ui/ScheduleCard";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";
import { showToastSuccess } from "@/utils/toastUtils";

export default function Page() {
  const t = useTranslations("Dictionary");
  const doctorLinks = GetLinkItems("doctor");
  const { state: UserState } = useContext(UserContext);

  const pathname = usePathname();

  const toastIdRef = useRef(null);
  const toast = useToast();
  const [data, setData] = useState([]);
  const {colorMode} = useColorMode()
  

  useEffect(() => {
    if (UserState.value.data?.id) {
      fetchData(UserState.value.data.id);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    await axios
      .post("/api/doctor/schedule/getall", { id: id })
      .then((response) => {
        setData(response.data);
      });
  }

  useEffect(() => {
    const search = new URLSearchParams(window.location.search).get(
      "scheduleadded"
    );
    if (search === "true" && !toast.isActive(toastIdRef.current)) {
      showToastSuccess(
        toast,
        toastIdRef,
        t("scheduleSuccessfullyAdded"),
        t("scheduleSuccessfullyAddedSubheading")
      );
    }
  }, []);

  return (
    <Sidebar LinkItems={doctorLinks}  >
      <Flex
        flex={1}
        gap={"50px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <HStack width={"100%"} justify={"space-between"}>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("scheduleManagement")}</Text>
          <Link href={`${pathname}/addschedule`}>
            <Button leftIcon={<AddIcon mt={"-2px"} />}>
              {t("addNewSchedule")}
            </Button>
          </Link>
        </HStack>
        {data.length == 0 ? (
          <VStack spacing={5}>
            <Image
              width={"315px"}
              height={"210px"}
              src="/assets/Calendar-pana-1.png"
            />
            <Text color={colorMode === 'dark' && 'gray.300'}fontWeight={"600"} fontSize={"30px"}>
              {t("noScheduleYet")}
            </Text>
            <div style={{ width: "70%" }}>
              <Text
                fontSize={"16px"}
                fontWeight={"400"}
                color={theme.text.secondary}
                textAlign={"center"}
              >
                {t("noScheduleYetSubheading")}
              </Text>
            </div>

            <Link
              href={`${pathname}/addschedule`}
              style={{ minWidth: "350px" }}
            >
              <Button
                px={"10px"}
                width={"100%"}
                leftIcon={<AddIcon marginTop={"-2px"} />}
              >
                {t("addNewSchedule")}
              </Button>
            </Link>
          </VStack>
        ) : (
          <VStack>
            <ScheduleCard
              data={data.filter((item, index) => item.day === "monday")}
              day={"monday"}
              refreshFetch={() => fetchData(UserState.value.data?.id)}
            />
            <ScheduleCard
              data={data.filter((item, index) => item.day === "tuesday")}
              day={"tuesday"}
              refreshFetch={() => fetchData(UserState.value.data?.id)}
            />
            <ScheduleCard
              data={data.filter((item, index) => item.day === "wednesday")}
              day={"wednesday"}
              refreshFetch={() => fetchData(UserState.value.data?.id)}
            />
            <ScheduleCard
              data={data.filter((item, index) => item.day === "thursday")}
              day={"thursday"}
              refreshFetch={() => fetchData(UserState.value.data?.id)}
            />
            <ScheduleCard
              data={data.filter((item, index) => item.day === "friday")}
              day={"friday"}
              refreshFetch={() => fetchData(UserState.value.data?.id)}
            />
          </VStack>
        )}
      </Flex>
    </Sidebar>
  );
}

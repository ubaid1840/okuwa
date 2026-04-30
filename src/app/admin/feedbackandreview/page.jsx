"use client";
import Sidebar from "@/components/sidebar";
import GetLinkItems from "@/utils/SidebarItems";

import {
  Flex,
  HStack,
  Text,
  VStack,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";

import { useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";

export default function Page() {
  const t = useTranslations("Dictionary");
  const sideLinks = GetLinkItems("admin");
  const [reviews, setReviews] = useState([]);
  const { state: UserState } = useContext(UserContext);
  const {colorMode} = useColorMode()

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data?.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    axios
      .get(`/api/newroutes/healthcare/${id}/admin/feedback`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((e) => console.log(e));
  }

  return (
    <Sidebar LinkItems={sideLinks} settingsLink={"/admin/settings"}>
      <Flex
        flex={1}
        gap={"50px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <HStack width={"100%"} justify={"space-between"}>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("feedbackAndReview")}</Text>
        </HStack>

        <VStack width={"100%"} gap={10} align={"flex-start"}>
          {reviews.length > 0 &&
            reviews.map((eachReview, index) => (
              <ReviewCard key={index} data={eachReview} />
            ))}
        </VStack>
      </Flex>
    </Sidebar>
  );
}

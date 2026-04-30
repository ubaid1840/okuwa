"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import {
  Box,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { IoFilterSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { HospitalContext } from "@/store/context/HospitalContext";
import { LuBadgeCheck } from "react-icons/lu";
import GetLinkItems from "@/utils/SidebarItems";
import { useTranslations } from "next-intl";
import { SlOptionsVertical } from "react-icons/sl";
import DashboardCard from "@/components/ui/DashboardCard";
import axios from "@/lib/axiosInstance";
import { showToastSuccess } from "@/utils/toastUtils";

export default function Page() {
  const t = useTranslations("Dictionary");
  const pathName = usePathname();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const [active, setActive] = useState(0);
  const [suspended, setSuspended] = useState(0);
  const { colorMode } = useColorMode();
  const colorTxt2 = useColorModeValue("#101828", "gray.300");
  const colorTxt1 = useColorModeValue("#475467", "gray.300");
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.700");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await axios.get("/api/newroutes/superadmin").then((response) => {
      if (response.data) {
        const activ = response.data.filter((item) => item.approved == true);
        const suspend = response.data.filter((item) => item.approved == false);
        setActive(activ.length);
        setSuspended(suspend.length);
        setData(response.data);
      }
    });
  }

  const toastIdRef = useRef(null);
  const toast = useToast();
  const id = "test-toast";

  const params = useSearchParams();

  useEffect(() => {
    const search = new URLSearchParams(window.location.search).get(
      "statusupdate"
    );
    if (search === "true" && !toast.isActive(toastIdRef.current)) {
      showToastSuccess(
        toast,
        toastIdRef,
        t("newHealthCareCenterActive"),
        t("newHealthCareCenterActiveDescription")
      );
    }
  }, []);

  const RenderEachRow = ({ item, index }) => {
    return (
      <Tr>
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.centername}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            HC{item?.id}
          </div>
        </Td>
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.city}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            {item?.country}
          </div>
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.status}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.email}
        </Td>
        <Td>
          {item?.approved ? (
            <div
              style={{
                display: "flex",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: "#ECFDF3",
                alignItems: "center",
                paddingInline: "10px",
                color: "#027A48",
                borderRadius: "50px",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#027A48",
                  borderRadius: "3px",
                  marginRight: "5px",
                }}
              />
              <div>{t("active")}</div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: "#FFFAEB",
                alignItems: "center",
                paddingInline: "10px",
                color: "#B54708",
                borderRadius: "50px",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#F79009",
                  borderRadius: "3px",
                  marginRight: "5px",
                }}
              />
              <div>{t("inactive")}</div>
            </div>
          )}
        </Td>
        <Td
          fontSize="14px"
          fontWeight="500"
          color="#004EEB"
          _hover={{ cursor: "pointer" }}
        >
          <Link
            href={`${pathName}/${item.id}`}
            _hover={{ textDecorationLine: "none" }}
          >
            {t("seeDetails")}
          </Link>
        </Td>
      </Tr>
    );
  };

  const sideLinks = GetLinkItems("internal");
  return (
    <Sidebar LinkItems={sideLinks}>
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <Text color={colorMode === "dark" && "gray.300"} variant="heading">
          {t("healthcareCenter")}
        </Text>
        <HStack width={"100%"} justifyContent={"space-between"}>
          <DashboardCard title={t("registered")} detail={data.length} colorMode={colorMode}/>
          <DashboardCard title={t("active")} detail={active}colorMode={colorMode} />
          <DashboardCard title={t("suspended")} detail={suspended} colorMode={colorMode}/>
        </HStack>
        <Box
          width={"100%"}
          border={"1px solid"}
          borderColor={bdColor}
          borderRadius={5}
        >
          <HStack justify={"space-between"} width={"100%"} p={5}>
            <InputGroup w={"100%"} maxW={"400px"}>
              <InputLeftElement pointerEvents="none">
                <Icon as={CiSearch} boxSize={5} color="#667085" />
              </InputLeftElement>
              <Input
                placeholder={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
            {/* <Menu>
                <MenuButton
                  border={"0px solid"}
                  borderColor={useColorModeValue(theme.color.primaryBorderColor, 'gray.700')}
                  borderRightWidth={0}
                  borderTopLeftRadius={"8px"}
                  borderBottomLeftRadius={"8px"}
                  paddingInline={"1rem"}
                >
                  <Box
                    display="flex"
                    height="40px"
                    border={"1px solid"}
                    borderRadius={"5px"}
                    borderColor={useColorModeValue(theme.color.primaryBorderColor, 'gray.700')}
                    px={"10px"}
                    alignItems={"center"}
                  >
                    <Icon as={IoFilterSharp} boxSize={4} color="#344054" />
                    <Text color={colorMode === 'dark' && 'gray.300'}ml={2} variant="subheading">
                      {t('filter')}
                    </Text>
                  </Box>
                </MenuButton>
              </Menu> */}

            {/* <div>
              <Button leftIcon={<AddIcon marginTop={"-2px"} />}>
              {t('newHealthcareCenter')}
              </Button>
            </div> */}
          </HStack>
          <Box width={"100%"}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {[
                      t("name"),
                      t("location"),
                      t("type"),
                      t("contact"),
                      t("status"),
                    ].map((item, index) => (
                      <Th
                        key={index}
                        fontSize={"12px"}
                        fontWeight={"500"}
                        color="#667085"
                      >
                        {item}
                      </Th>
                    ))}
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.length > 0 &&
                    data
                      .filter((item) =>
                        item.centername
                          .toLocaleLowerCase()
                          .includes(search.toLocaleLowerCase())
                      )
                      .map((item, index) => (
                        <RenderEachRow key={index} item={item} index={index} />
                      ))}
                </Tbody>
              </Table>
            </TableContainer>
            <HStack justifyContent={"space-between"} p={5}>
              <div>
                <GhostButton>{t("previous")}</GhostButton>
              </div>
              <div>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant="subheading"
                >
                  {t("page")} 1 {t("of")} 1
                </Text>
              </div>
              <div>
                <GhostButton>{t("next")}</GhostButton>
              </div>
            </HStack>
          </Box>
        </Box>
      </Flex>
    </Sidebar>
  );
}

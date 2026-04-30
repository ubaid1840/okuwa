"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { UserContext } from "@/store/context/UserContext";
import { AddIcon,  } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Image,
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
  MenuList,
  MenuItem,
  useColorModeValue,
  useColorMode
} from "@chakra-ui/react";
import axios from "@/lib/axiosInstance";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useRef, useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoFilterSharp } from "react-icons/io5";
import StatusBox from "@/components/ui/StatusBox";
import { showToastSuccess } from "@/utils/toastUtils";

export default function Page() {
  const t = useTranslations("Dictionary");
  const pathname = usePathname();
  const [data, setData] = useState([]);
  const { state: UserState } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const {colorMode} = useColorMode()
  const txtColor1 = useColorModeValue("#475467", 'gray.300')
  const txtColor2 = useColorModeValue("#101828", 'gray.300')
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data?.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    axios.get(`/api/newroutes/healthcare/${id}/admin/medicalstaff`).then((response) => {
      setData(response.data);
    });
  }
  const toastIdRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const search = new URLSearchParams(window.location.search).get(
      "medicalstaffadded"
    );
    if (search === "true" && !toast.isActive(toastIdRef.current)) {
      showToastSuccess(toast, toastIdRef,  t("newStaffAdded")    ,t("newStaffAddedSubheading"))
    }
  }, []);

  const RenderEachRow = ({ item, index }) => {
    return (
      <Tr backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}>
          <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          {item?.firstname + " " + item?.lastname}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          {t(item?.role)}
        </Td>

        <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          {item?.speciality && t(item?.speciality)}
        </Td>

        <Td fontSize={"14px"} fontWeight={"500"} color={txtColor2}>
          {item?.room_name || ""}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          {item?.email}
        </Td>
        <Td fontSize={"14px"} fontWeight={"500"} color={txtColor2}>
          {item?.phonenumber}
        </Td>
        <Td fontSize={"14px"} fontWeight={"500"} color={txtColor2}>
          <StatusBox item={item?.status} />
        </Td>
        {/* <Td>
          <HStack align={"flex-start"} gap={5}>
            <DeleteIcon color={"red"} boxSize={5} />
            <Icon as={RxPencil1} boxSize={5} />
          </HStack>
        </Td> */}
      </Tr>
    );
  };

  const sideLinks = GetLinkItems("admin");

  return (
    <Sidebar LinkItems={sideLinks} settingsLink={"/admin/settings"}>
      <Flex
        flex={1}
        gap={"50px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <Text color={colorMode === 'dark' && 'gray.300'}variant="heading"> {t("medicalStaff")}</Text>
        {data?.length == 0 ? (
          <VStack spacing={5}>
            <Image
              width={"315px"}
              height={"210px"}
              src="/assets/No-data-pana-1.png"
            />
            <Text color={colorMode === 'dark' && 'gray.300'}fontWeight={"600"} fontSize={"30px"}>
              {t("noMedicalStaffFound")}
            </Text>
            <div style={{ width: "70%" }}>
              <Text
                fontSize={"16px"}
                fontWeight={"400"}
                color={theme.text.secondary}
                textAlign={"center"}
              >
                {t("noMedicalStaffFoundSubheading")}
              </Text>
            </div>
            <Link
              href={`${pathname}/addmedicalstaff`}
              style={{ minWidth: "350px" }}
            >
              <Button leftIcon={<AddIcon marginTop={"-2px"} />} width={"100%"}>
                {t("newStaff")}
              </Button>
            </Link>
          </VStack>
        ) : (
          <Box
            width={"100%"}
            border={"1px solid"}
            borderColor={bdColor}
            borderRadius={5}
          >
            <HStack justify={"space-between"} width={"100%"} p={5}>
              <div
                style={{ display: "flex", width: "100%", maxWidth: "700px" }}
              >
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
                      <div style={{ alignSelf: "center" }}>
                        <Text color={colorMode === 'dark' && 'gray.300'}ml={2} variant="subheading">
                          {selectedOption ? t(selectedOption) : t("all")}
                        </Text>
                      </div>
                    </Box>
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => setSelectedOption("")}>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("all")}</Text>
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedOption("frontDesk")}>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("frontDesk")}</Text>
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedOption("doctor")}>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("doctor")}</Text>
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedOption("labUser")}>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("labUser")}</Text>
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedOption("nurse")}>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("nurse")}</Text>
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedOption("finance")}>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("finance")}</Text>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>

              <div>
                <Link href={`${pathname}/addmedicalstaff`}>
                  <Button leftIcon={<AddIcon marginTop={"-2px"} />}>
                    {t("newStaff")}
                  </Button>
                </Link>
              </div>
            </HStack>
            <Box width={"100%"}>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      {[
                        t("name"),
                        t("type"),
                        t("specialist"),
                        t("room"),
                        t("emailAddress"),
                        t("phoneNumber"),
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
                    {data?.length > 0 &&
                      data
                        .filter((itm) =>
                          itm?.role
                            .toLocaleLowerCase()
                            .includes(selectedOption.toLowerCase())
                        )
                        .filter((itm) => {
                          const searchItem = itm.firstname + " " + itm.lastname;
                          if (
                            searchItem
                              .toLocaleLowerCase()
                              .includes(search.toLocaleLowerCase())
                          ) {
                            return itm;
                          }
                        })
                        .map((item, index) => (
                          <RenderEachRow
                            key={index}
                            item={item}
                            index={index}
                          />
                        ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <HStack justifyContent={"space-between"} p={5}>
                <div>
                  <GhostButton
                  >
                    {t("previous")}
                  </GhostButton>
                </div>
                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
                    {" "}
                    {t("page")} 1 {t("of")} 1
                  </Text>
                </div>
                <div>
                  <GhostButton
                  >
                    {t("next")}
                  </GhostButton>
                </div>
              </HStack>
            </Box>
          </Box>
        )}
      </Flex>
    </Sidebar>
  );
}

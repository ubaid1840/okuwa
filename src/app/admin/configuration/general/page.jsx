"use client";
import Button from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { reason, theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Checkbox,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Select,
  Spacer,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { medicalServices } from "@/app/login/data";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";
import InputSelectRow from "@/components/ui/InputSelectRow";
import { showToastFailed } from "@/utils/toastUtils";

export default function Settings() {
  const { colorMode } = useColorMode();
  const t = useTranslations("Dictionary");
  const allMedicalServices = [
    ...medicalServices,
    "emergencies",
    "intensiveCare",
    "maternity",
    "surgery",
    "radiologyAndMedicalImaging",
  ];
  const toastIdRef = useRef(null);
  const toast = useToast();
  const [searchItem, setSearchItem] = useState("");
  const [selectedMedicalCenter, setSelectedMedicalCenter] = useState([]);
  const { state: UserState } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const sideLinks = GetLinkItems("admin");
  const [newItem, setNewItem] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [entry, setEntry] = useState({ service: "", price: "", category: "" });
  const {
    isOpen: isOpenLab,
    onOpen: onOpenLab,
    onClose: onCloseLab,
  } = useDisclosure();
  const {
    isOpen: isOpenImaging,
    onOpen: onOpenImaging,
    onClose: oncloseImaging,
  } = useDisclosure();
  const bdColor = useColorModeValue(theme.divider.primary, "gray.700") 
  const txtColor1 = useColorModeValue("#475467", "gray.300")
  const bgColor = useColorModeValue("white", "gray.800")

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    axios
      .get(`/api/newroutes/healthcare/${id}/admin/configuration`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }


  const RenderEachRow = ({ item, index }) => {
    const [rowLoading, setRowLoading] = useState(false);
    async function handleDeleteRow(item) {
      await axios
        .post("/api/delete", {
          table: "reason",
          conditions: [{ column: "id", operator: "=", value: item.id }],
          conditionOperator: "AND",
        })
        .then((response) => {
          const temp = data.filter((eachItem) => eachItem.id !== item.id);
          setData([...temp]);
          setRowLoading(false);
        })
        .catch((e) => {
          setRowLoading(false);
          showToastFailed(
            toast,
            toastIdRef,
            t("Failed"),
            e?.response?.data?.message
          );
        });
    }

    return (
      <Tr
        key={index}
        backgroundColor={
          index % 2 == 0
            ? colorMode == "light"
              ? "#F9FAFB"
              : "gray.700"
            : colorMode == "light"
            ? "white"
            : "transparent"
        }
        _hover={{ cursor: "pointer" }}
      >
        <Td
          fontSize={"14px"}
          fontWeight={"400"}
          color={txtColor1}
        >
          {item?.category ? t(item.category) : ""}
        </Td>

        <Td
          fontSize={"14px"}
          fontWeight={"400"}
          color={txtColor1}
        >
          {item?.service}
        </Td>

        <Td
          fontSize={"14px"}
          fontWeight={"400"}
          color={txtColor1}
        >
          {Number(item?.price).toFixed(2)}
        </Td>

        <Td>
          {rowLoading ? (
            <Spinner size={"sm"} />
          ) : (
            <DeleteIcon
              onClick={() => {
                setRowLoading(true);
                handleDeleteRow(item);
              }}
              boxSize={4}
              color={"red"}
              _hover={{ opacity: 0.7 }}
            />
          )}
        </Td>
      </Tr>
    );
  };

  async function handleSaveLab(value) {
    axios
      .post("/api/update", {
        table: "settings",
        columns: ["labtest"],
        values: [value],
        conditions: {
          column: "id",
          operator: "=",
          value: data.id,
        },
      })
      .then(() => {
        setNewItem("");
        setLoading(false);
        onCloseLab();
        fetchData(UserState.value.data.centerid);
      });
  }

  async function handleSaveImaging(value) {
    axios
      .post("/api/update", {
        table: "settings",
        columns: ["imagingstudies"],
        values: [value],
        conditions: {
          column: "id",
          operator: "=",
          value: data.id,
        },
      })
      .then(() => {
        setNewItem("");
        setLoading(false);
        oncloseImaging();
        fetchData(UserState.value.data.centerid);
      });
  }

  async function handleSave() {
    await axios
      .post("/api/insert", {
        table: "reason",
        columns: ["centerid", "category", "service", "price"],
        values: [
          UserState.value.data.centerid,
          entry.category,
          entry.service,
          entry.price,
        ],
      })
      .then((response) => {
        onClose();
        fetchData(UserState.value.data.centerid);
      })
      .catch((e) => {
        setLoading(false);
        showToastFailed(
          toast,
          toastIdRef,
          t("Failed"),
          e?.response?.data?.message
        );
      });
  }
  return (
    <Sidebar LinkItems={sideLinks} settingsLink={"/admin/settings"}>
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <HStack justifyContent={"space-between"}>
          <Text color={colorMode === "dark" && "gray.300"} variant="heading">
            {t("generalSettings")}
          </Text>
          {/* <HStack>
            <Button onClick={() => {}}>{t("save")}</Button>
          </HStack> */}
        </HStack>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <Text
            fontSize={"16px"}
            fontWeight={"400"}
            color={theme.text.secondary}
            textAlign={"center"}
          >
            {t("settingsSubheading")}
          </Text>
        </div>
        <HStack w={"100%"}>
          <Spacer />
          <Button
            onClick={() => {
              setEntry({
                category: "",
                price: "",
                service: "",
              });
              onOpen();
            }}
          >
            {t("add")}
          </Button>
        </HStack>

        {reason.map((eachReason, ind) => (
          <VStack align={"flex-start"} key={ind} width={"100%"}>
            <Text
              color={colorMode === "dark" && "gray.300"}
              variant={"subheading"}
              fontSize={"16px"}
            >
              {t(eachReason)}
            </Text>
            <Box
              width={"100%"}
              border={"1px solid"}
              borderColor={bdColor}
              borderRadius={"8px"}
              maxW={"800px"}
            >
              <TableContainer maxH={"800px"} overflowY={"auto"}>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      {[t("category"), t("service"), t("price")].map(
                        (item, index) => (
                          <Th
                            key={index}
                            fontSize={"12px"}
                            fontWeight={"500"}
                            color="#667085"
                          >
                            {item}
                          </Th>
                        )
                      )}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.filter((item) => item?.category === eachReason)
                      .length > 0 &&
                      data
                        .filter((item) => item?.category === eachReason)
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
              {/* <HStack justifyContent={"space-between"} p={5}>
                <div>
                  <Button
                    variant="outline"
                    backgroundColor={"#FFFFFF"}
                    color={"black"}
                    border={"1px solid"}
                    borderColor={useColorModeValue(
                      theme.color.primaryBorderColor,
                      "gray.700"
                    )}
                  >
                    {t("previous")}
                  </Button>
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
                  <Button
                    variant="outline"
                    backgroundColor={"#FFFFFF"}
                    color={"black"}
                    border={"1px solid"}
                    borderColor={useColorModeValue(
                      theme.color.primaryBorderColor,
                      "gray.700"
                    )}
                  >
                    {t("next")}
                  </Button>
                </div>
              </HStack> */}
            </Box>
          </VStack>
        ))}
      </Flex>

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent maxW={"90%"} width={"600px"}>
          <AlertDialogBody mb={5}>
            <HStack align={"flex-start"} w={"100%"} gap={10} mt={5}>
              <VStack width={"100%"} gap={5}>
                <Text
                  color={colorMode === "dark" ? "gray.300" : "#101828"}
                  fontSize={"18px"}
                  fontWeight={"500"}
                >
                  {t("addNewEntry")}
                </Text>
                <VStack align={"flex-start"} w={"inherit"} gap={0}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"description"}
                  >
                    {t("category")}
                  </Text>
                  <Select
                    bg={bgColor}
                    borderColor={bdColor}
                    value={entry.category}
                    onChange={(e) =>
                      setEntry((prevState) => {
                        return { ...prevState, category: e.target.value };
                      })
                    }
                  >
                    <option value="">{t("selectOne")}</option>
                    {reason.map((item, index) => (
                      <option key={index} value={item}>
                        {t(item)}
                      </option>
                    ))}
                  </Select>
                </VStack>
                <VStack align={"flex-start"} w={"inherit"} gap={0}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"description"}
                  >
                    {t("service")}
                  </Text>
                  <Input
                    bg={bgColor}
                    borderColor={bdColor}
                    value={entry.service}
                    onChange={(e) =>
                      setEntry((prevState) => {
                        return { ...prevState, service: e.target.value };
                      })
                    }
                  />
                </VStack>
                <VStack align={"flex-start"} w={"inherit"} gap={0}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"description"}
                  >
                    {t("price")}
                  </Text>
                  <Input
                  type="number"
                    bg={bgColor}
                    borderColor={bdColor}
                    value={entry.price}
                    onChange={(e) =>
                      setEntry((prevState) => {
                        return { ...prevState, price: e.target.value };
                      })
                    }
                  />
                </VStack>
              </VStack>
            </HStack>
          </AlertDialogBody>

          <AlertDialogFooter w={"100%"}>
            <Button
              isDisabled={!entry.category || !entry.price || !entry.service}
              isLoading={loading}
              w={"100%"}
              onClick={() => {
                setLoading(true);
                handleSave();
              }}
            >
              {t("save")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onCloseLab}
        isOpen={isOpenLab}
        isCentered
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent maxW={"90%"} width={"600px"}>
          <AlertDialogBody mb={5}>
            <HStack align={"flex-start"} w={"100%"} gap={10} mt={5}>
              <VStack width={"100%"}>
                <Text
                  color={colorMode === "dark" ? "gray.300" : "#101828"}
                  fontSize={"18px"}
                  fontWeight={"500"}
                >
                  {t("addNewEntry")}
                </Text>
                <Input
                  placeholder={t("search")}
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                />
              </VStack>
            </HStack>
          </AlertDialogBody>

          <AlertDialogFooter w={"100%"}>
            <Button
              isLoading={loading}
              w={"100%"}
              onClick={() => {
                setLoading(true);
                let temp = [];
                if (data.labtest) {
                  temp = [...data.labtest];
                }
                temp.push(newItem);
                handleSaveLab(temp);
              }}
            >
              {t("save")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={oncloseImaging}
        isOpen={isOpenImaging}
        isCentered
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent maxW={"90%"} width={"600px"}>
          <AlertDialogCloseButton />
          <AlertDialogBody mb={5}>
            <HStack align={"flex-start"} w={"100%"} gap={10} mt={5}>
              <VStack width={"100%"}>
                <Text
                  color={colorMode === "dark" ? "gray.300" : "#101828"}
                  fontSize={"18px"}
                  fontWeight={"500"}
                >
                  {t("addNewEntry")}
                </Text>
                <Input
                  placeholder={t("search")}
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                />
              </VStack>
            </HStack>
          </AlertDialogBody>

          <AlertDialogFooter w={"100%"}>
            <Button
              isLoading={loading}
              w={"100%"}
              onClick={() => {
                setLoading(true);
                let temp = [];
                if (data.imagingstudies) {
                  temp = [...data.imagingstudies];
                }
                temp.push(newItem);
                handleSaveImaging(temp);
              }}
            >
              {t("save")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}

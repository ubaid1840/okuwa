"use client";
import Button from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
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
  Spinner,
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
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { medicalServices } from "@/app/login/data";
import { useCallback, useContext, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";

export default function Settings() {
  const t = useTranslations("Dictionary");
  const allMedicalServices = [
    ...medicalServices,
    "emergencies",
    "intensiveCare",
    "maternity",
    "surgery",
    "radiologyAndMedicalImaging",
  ];
  const [searchItem, setSearchItem] = useState("");
  const [selectedMedicalCenter, setSelectedMedicalCenter] = useState([]);
  const { state: UserState } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const sideLinks = GetLinkItems("admin");
  const [newItem, setNewItem] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  const colorTxt1 = useColorModeValue("#475467", 'gray.300')
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
  const {colorMode} = useColorMode()

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    axios.get(`/api/newroutes/healthcare/${id}/admin/settings`).then((response) => {
      setData(response.data);
      setSelectedMedicalCenter(response.data.settings_array);
    });
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

  function checkExists(data) {
    const temp = selectedMedicalCenter.filter((item) => item === data);
    if (temp.length > 0) return true;
  }

  function removeSelection(name) {
    const temp = selectedMedicalCenter.filter((item) => item !== name);
    setSelectedMedicalCenter([...temp]);
  }

  async function handleSaveMedicalCenter(value) {
    await axios
      .post("/api/update", {
        table: "settings",
        columns: ["settings_array"],
        values: [value],
        conditions: {
          column: "id",
          operator: "=",
          value: data.id,
        },
      })
      .then(() => {
        setLoading(false);
        onClose();
        fetchData(UserState.value.data.centerid);
      });
  }

  const RenderEachRow = ({ item, index }) => {
    const [rowLoading, setRowLoading] = useState(false);
    async function handleDeleteMedicalCenter(item) {
      const temp = selectedMedicalCenter.filter(
        (eachItem) => eachItem !== item
      );
      await handleSaveMedicalCenter(temp);
      setRowLoading(false);
    }

    return (
      <Tr
        key={index}
        backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}
        _hover={{ cursor: "pointer" }}
      >
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {t(item)}
        </Td>

        <Td>
          {rowLoading ? (
            <Spinner size={"sm"} />
          ) : (
            <DeleteIcon
              onClick={() => {
                setRowLoading(true);
                handleDeleteMedicalCenter(item);
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

  const RenderEachRowTest = ({ item, index }) => {
    const [rowLoading, setRowLoading] = useState(false);
    async function handleDelete(item) {
      const temp = data.labtest.filter((eachItem) => eachItem !== item);
      handleSaveLab(temp);
    }

    return (
      <Tr
        key={index}
        backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}
        _hover={{ cursor: "pointer" }}
      >
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item}
        </Td>

        <Td>
          {rowLoading ? (
            <Spinner size={"sm"} />
          ) : (
            <DeleteIcon
              onClick={() => {
                setRowLoading(true);
                handleDelete(item);
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

  const RenderEachRowImaging = ({ item, index }) => {
    const [rowLoading, setRowLoading] = useState(false);
    async function handleDelete(item) {
      const temp = data.imagingstudies.filter((eachItem) => eachItem !== item);
      handleSaveImaging(temp);
    }

    return (
      <Tr
        key={index}
        backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}
        _hover={{ cursor: "pointer" }}
      >
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item}
        </Td>

        <Td>
          {rowLoading ? (
            <Spinner size={"sm"} />
          ) : (
            <DeleteIcon
              onClick={() => {
                setRowLoading(true);
                handleDelete(item);
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
  return (
    <Sidebar LinkItems={sideLinks} settingsLink={"/admin/settings"}>
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <HStack justifyContent={"space-between"}>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("settings")}</Text>
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
        <div>
          <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>{t("centerType")}</Text>
        </div>
        <HStack width={"100%"} gap={"40px"}>
          <Box
            width={"100%"}
            border={"1px solid"}
            borderColor={theme.divider.primary}
            borderRadius={"8px"}
            maxW={"600px"}
          >
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {[t("type"), t("action")].map((item, index) => (
                      <Th
                        key={index}
                        fontSize={"12px"}
                        fontWeight={"500"}
                        color="#667085"
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>{item}</div>
                          {item === t("action") && (
                            <Button ml={5} onClick={onOpen}>
                              {t("add")}
                            </Button>
                          )}
                        </div>
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data?.settings_array &&
                    data?.settings_array.map((item, index) => (
                      <RenderEachRow key={index} item={item} index={index} />
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
            <HStack justifyContent={"space-between"} p={5}>
              <div>
                <Button
                  variant="outline"
                  backgroundColor={"#FFFFFF"}
                  color={"black"}
                  border={"1px solid"}
                  borderColor={bdColor}
                >
                  {t("previous")}
                </Button>
              </div>
              <div>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
                  {t("page")} 1 {t("of")} 1
                </Text>
              </div>
              <div>
                <Button
                  variant="outline"
                  backgroundColor={"#FFFFFF"}
                  color={"black"}
                  border={"1px solid"}
                  borderColor={bdColor}
                >
                  {t("next")}
                </Button>
              </div>
            </HStack>
          </Box>
        </HStack>

        <div>
          <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>{t("labTest")}</Text>
        </div>
        <HStack width={"100%"} gap={"40px"}>
          <Box
            width={"100%"}
            border={"1px solid"}
            borderColor={theme.divider.primary}
            borderRadius={"8px"}
            maxW={"600px"}
          >
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {[t("name"), t("action")].map((item, index) => (
                      <Th
                        key={index}
                        fontSize={"12px"}
                        fontWeight={"500"}
                        color="#667085"
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>{item}</div>
                          {item === t("action") && (
                            <Button
                              ml={5}
                              onClick={() => {
                                setNewItem("");
                                onOpenLab();
                              }}
                            >
                              {t("add")}
                            </Button>
                          )}
                        </div>
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data?.labtest &&
                    data?.labtest.map((item, index) => (
                      <RenderEachRowTest
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
                <Button
                  variant="outline"
                  backgroundColor={"#FFFFFF"}
                  color={"black"}
                  border={"1px solid"}
                  borderColor={bdColor}
                >
                  {t("previous")}
                </Button>
              </div>
              <div>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
                  {t("page")} 1 {t("of")} 1
                </Text>
              </div>
              <div>
                <Button
                  variant="outline"
                  backgroundColor={"#FFFFFF"}
                  color={"black"}
                  border={"1px solid"}
                  borderColor={bdColor}
                >
                  {t("next")}
                </Button>
              </div>
            </HStack>
          </Box>
        </HStack>

        <div>
          <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>{t("imagingStudies")}</Text>
        </div>
        <HStack width={"100%"} gap={"40px"}>
          <Box
            width={"100%"}
            border={"1px solid"}
            borderColor={theme.divider.primary}
            borderRadius={"8px"}
            maxW={"600px"}
          >
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {[t("name"), t("action")].map((item, index) => (
                      <Th
                        key={index}
                        fontSize={"12px"}
                        fontWeight={"500"}
                        color="#667085"
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>{item}</div>
                          {item === t("action") && (
                            <Button
                              ml={5}
                              onClick={() => {
                                setNewItem("");
                                onOpenImaging();
                              }}
                            >
                              {t("add")}
                            </Button>
                          )}
                        </div>
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data?.imagingstudies &&
                    data?.imagingstudies.map((item, index) => (
                      <RenderEachRowImaging
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
                <Button
                  variant="outline"
                  backgroundColor={"#FFFFFF"}
                  color={"black"}
                  border={"1px solid"}
                  borderColor={bdColor}
                >
                  {t("previous")}
                </Button>
              </div>
              <div>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
                  {t("page")} 1 {t("of")} 1
                </Text>
              </div>
              <div>
                <Button
                  variant="outline"
                  backgroundColor={"#FFFFFF"}
                  color={"black"}
                  border={"1px solid"}
                  borderColor={bdColor}
                >
                  {t("next")}
                </Button>
              </div>
            </HStack>
          </Box>
        </HStack>
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
              <VStack width={"100%"}>
                <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"}fontSize={"18px"} fontWeight={"500"}>
                  {t("couldNotFindCenter")}
                </Text>

                <Text color={colorMode === 'dark' ?'gray.300' : "#667085"}fontSize={"14px"} fontWeight={"400"} >
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
                  {allMedicalServices
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
                          <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>{t(item)}</Text>
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
              isLoading={loading}
              w={"100%"}
              onClick={() => {
                setLoading(true);
                handleSaveMedicalCenter(selectedMedicalCenter);
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
                <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"}fontSize={"18px"} fontWeight={"500"} >
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
                <Text color={colorMode === 'dark' ? 'gray.300': "#101828"}fontSize={"18px"} fontWeight={"500"} >
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

"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
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
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useRef, useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useTranslations } from "next-intl";
import { UserContext } from "@/store/context/UserContext";
import axios from "@/lib/axiosInstance";
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils";

export default function Page() {
  const {colorMode} = useColorMode()
  const t = useTranslations("Dictionary");
  const pathname = usePathname();
  const [data, setData] = useState([]);

  const toastIdRef = useRef(null);
  const toast = useToast();
  const id = "test-toast";
  const [search, setSearch] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const { state: UserState } = useContext(UserContext);
  const [selectedRoom, setSelectedRoom] = useState();
  const colorTxt1 = useColorModeValue("#475467", 'gray.300')
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    if (UserState.value.data?.centerid)
      fetchData(UserState.value.data?.centerid);
  }, [UserState.value.data]);

  async function fetchData(id) {
    await axios
      .get(`/api/newroutes/healthcare/${id}/admin/facility`, {
        centerid: id,
      })
      .then((response) => {
        onClose();
        setData(response.data);
      })
      .catch((e) => {
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

  useEffect(() => {
    const search = new URLSearchParams(window.location.search).get(
      "facilityadded"
    );
    if (search === "true" && !toast.isActive(toastIdRef.current)) {
      showToastSuccess(
        toast,
        toastIdRef,
        t("roomSuccessfullyAdded"),
        t("roomSuccessfullyAddedSubheading")
      );
    }
  }, []);

  const RenderEachRow = ({ item, index }) => {
    return (
       <Tr backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.name}
        </Td>

        <Td>
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
                backgroundColor: "#12B76A",
                borderRadius: "3px",
                marginRight: "5px",
              }}
            />
            <div>{"Open"}</div>
          </div>
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {"N/A"}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {"N/A"}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {"N/A"}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item.description}
        </Td>

        <Td>
          <HStack>
            <DeleteIcon
              boxSize={4}
              color={"red"}
              _hover={{ opacity: 0.7, cursor: "pointer" }}
              onClick={() => {
                setSelectedRoom(item);
                onOpen();
              }}
            />
            {/* <Icon as={RxPencil1} boxSize={4} _hover={{ opacity: 0.7, cursor:'pointer' }} /> */}
          </HStack>
        </Td>
      </Tr>
    );
  };

  async function handleDeleteRoom() {
    axios
      .delete(`/api/newroutes/healthcare/${UserState.value.data?.centerid}/admin/facility/${selectedRoom.id}`)
      .then(() => {
        fetchData(UserState.value.data.centerid);
      })
      .catch((e) => {
        showToastFailed(toast, toastIdRef, t("Failed"), e.response?.data?.message)
        
      });
  }

  const sideLinks = GetLinkItems("admin");
  return (
    <Sidebar LinkItems={sideLinks} settingsLink={"/admin/settings"}>
      <Flex flex={1} gap={"50px"} p={"32px"} flexDir="column">
        <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("facilityManagement")}</Text>
        {data.length == 0 ? (
          <VStack spacing={5}>
            <Image
              width={"315px"}
              height={"210px"}
              src="/assets/Calendar-pana-1.png"
            />
            <Text color={colorMode === 'dark' && 'gray.300'}fontWeight={"600"} fontSize={"30px"}>
              {t("noRoomsAdded")}
            </Text>
            <div style={{ width: "70%" }}>
              <Text
                fontSize={"16px"}
                fontWeight={"400"}
                color={theme.text.secondary}
                textAlign={"center"}
              >
                {t("noRoomsAddedSubheading")}
              </Text>
            </div>
            <Link href={`${pathname}/addroom`} style={{ minWidth: "350px" }}>
              <Button leftIcon={<AddIcon marginTop={"-2px"} />} width={"100%"}>
                {t("newRoom")}
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
              <div style={{ display: "flex", width: "100%" }}>
                <InputGroup w={"100%"} maxW={"400px"}>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={CiSearch} boxSize={5} color="#667085" />
                  </InputLeftElement>
                  <Input
                   bg={bgColor}
                   borderColor={bdColor}
                    placeholder={t("search")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div>
                <Link href={`${pathname}/addroom`}>
                  <Button leftIcon={<AddIcon marginTop={"-2px"} />}>
                    {t("newRoom")}
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
                        t("roomName"),
                        t("status"),
                        t("bookingStatus"),
                        t("procedures"),
                        t("date"),
                        t("description"),
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
                          item.name.toLowerCase().includes(search.toLowerCase())
                        )
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
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay bg={"#344054B2"} />

          <AlertDialogContent width={"400px"}>
            <AlertDialogHeader>
              <div
                style={{
                  display: "flex",
                  borderRadius: "30px",
                  backgroundColor: "#FEE4E2",
                  border: "6px solid",
                  borderColor: "#FEF3F2",
                  height: "40px",
                  width: "40px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DeleteIcon height={"20px"} width={"18px"} color={"red"} />
              </div>
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <VStack alignItems={"flex-start"} spacing={2}>
                <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"}fontSize={"18px"} fontWeight={"500"} >
                  {t("deleteRoomConfirmation")}
                </Text>
                <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"}fontSize={"14px"} fontWeight={"400"} >
                  {t("deleteRoomConfirmationSubheading")}
                </Text>
              </VStack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                onClick={() => {
                  setSelectedRoom();
                  onClose();
                }}
                border="1px solid"
                borderColor={bdColor}
                backgroundColor="#FFFFFF"
                color="#000000"
              >
                {t("cancel")}
              </Button>
              {selectedRoom && (
                <Button
                  backgroundColor="#D92D20"
                  ml={3}
                  onClick={() => handleDeleteRoom()}
                >
                  {t("delete")}
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Flex>
    </Sidebar>
  );
}

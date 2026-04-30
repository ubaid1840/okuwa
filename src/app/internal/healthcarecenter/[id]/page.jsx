"use client";
import Sidebar from "@/components/sidebar";
import { ChevronRightIcon, DeleteIcon } from "@chakra-ui/icons";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Flex,
  HStack,
  Image,
  Input,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  Box,
  Icon,
  useToast,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { HospitalContext } from "@/store/context/HospitalContext";
import Button, { GhostButton } from "@/components/ui/Button";
import { theme } from "@/data/data";
import moment from "moment";
import GetLinkItems from "@/utils/SidebarItems";
import { useTranslations } from "next-intl";
import { SlOptionsVertical } from "react-icons/sl";
import DashboardCard from "@/components/ui/DashboardCard";
import axios from '@/lib/axiosInstance';
import InputImageRow from "@/components/ui/InputImageRow";
import ImageRow from "@/components/ui/ImageRow";
import InputRow from "@/components/ui/InputRow";
import InputTextArea from "@/components/ui/InputTextRow";

export default function Page({params}) {
  const t = useTranslations("Dictionary");
  const pathName = usePathname();
  const [singleDetail, setSingleDetail] = useState();
  const searchParams = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const router = useRouter();
  const [allPatients, setAllPatients] = useState("-")
  const [allStaff, setAllStaff] = useState("")
  const [totalRooms, setTotalRooms] = useState("")
  const toast = useToast()
  const toastIdRef = useRef(null)
  const {colorMode} = useColorMode()
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

  useEffect(() => {
  
      fetchData(params.id);
    
  }, []);

  async function fetchData(id) {
    axios
      .get(`/api/newroutes/superadmin/${id}`)
      .then((response) => {
        if (response.data.length == 0) {
          router.push(pathName.replace(/\/[^\/]*$/, ""));
        } else {
         
          setSingleDetail(response.data?.signup);
          setAllPatients(response.data?.patients)
          setAllStaff(response.data?.staff)
          setTotalRooms(response.data?.total)
        }
      });
  }

  async function handleUpdateStatus(newStatus) {
    try {
      axios
        .put(`/api/newroutes/superadmin/${params.id}`, {
          approved: newStatus,
        })
        .then((response) => {
          router.push(`${pathName.replace(/\/[^\/]*$/, "")}?statusupdate=${newStatus}`);
        });
    } catch (e) {
      showToastFailed(toast, toastIdRef, t("Failed"), e.response.data.message)
    
    }
  }
  const sideLinks = GetLinkItems("internal");
  return (
    <Sidebar LinkItems={sideLinks}>
      {singleDetail && (
        <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
          <HStack fontSize="14px" fontWeight="500" color="#667085">
            <Link href={pathName.replace(/\/[^\/]*$/, "")}>
              {t("healthcareCenter")}
            </Link>
            <ChevronRightIcon />
            <Text color={colorMode === 'dark' ? 'gray.300' : "#344054"}>{t("healthcareCenterDetails")}</Text>
          </HStack>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("healthcareCenterDetails")}</Text>
          <HStack width={"100%"} justifyContent={"space-between"}>
            <DashboardCard title={t("registeredStaff")} detail={allPatients} colorMode={colorMode}/>

            <DashboardCard title={t("registeredPatients")} detail={allStaff} colorMode={colorMode}/>

            <DashboardCard title={t("registeredRooms")} detail={totalRooms} colorMode={colorMode}/>
          </HStack>
          <HStack width={"100%"} justifyContent={"space-between"}>
            <HStack spacing={10}>
              {singleDetail.image &&
              <Image
                src={singleDetail.image}
                height={"60px"}
                width={"60px"}
                borderRadius={"50px"}
              />
}
              <VStack spacing={0} alignItems={"flex-start"}>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="heading" fontSize="24px">
                  {singleDetail.centername}
                </Text>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="description" fontSize="16px" fontWeight="400">
                  HC{singleDetail.id}
                </Text>
              </VStack>
            </HStack>
            {singleDetail.approved == false ? (
              <HStack>
                <Link href={pathName.replace(/\/[^\/]*$/, "")}>
                  <Button
                    borderColor="#FDA29B"
                    backgroundColor="#FFFFFF"
                    color="#B42318"
                    border="1px solid"
                  >
                    {t("reject")}
                  </Button>
                </Link>

                <Button
                  onClick={() => {
                    handleUpdateStatus(true);
                  }}
                >
                  {t("approve")}
                </Button>
              </HStack>
            ) : (
              // <Link href={pathName.replace(/\/[^\/]*$/, "")}>
              <HStack>
                <div>
                  <GhostButton
                    onClick={() => handleUpdateStatus(false)}
                    // onClick={() => onOpen()}
                    // onClick={() => {
                    //   let temp = [...HospitalState.value.data];
                    //   temp[singleDetail.index].approved = "deleted";
                    //   setHospital(temp);
                    // }}
                  >
                    {t("suspend")}
                  </GhostButton>
                </div>
                {/* <div>
                  <Button
                    onClick={() => onOpen()}
                    // onClick={() => {
                    //   let temp = [...HospitalState.value.data];
                    //   temp[singleDetail.index].approved = "deleted";
                    //   setHospital(temp);
                    // }}
                    borderColor="#FDA29B"
                    backgroundColor="#FFFFFF"
                    color="#B42318"
                    border="1px solid"
                  >
                    {t("delete")}
                  </Button>
                </div> */}
              </HStack>

              // </Link>
            )}
          </HStack>
          <Tabs>
            <TabList
              borderBottomWidth={"1px"}
              borderBottomColor={theme.divider.primary}
            >
              {[
                t("generalInfo"),
                t("address"),
                t("contact"),
                t("manager"),
                t("financesInformation"),
              ].map((item, index) => (
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
                <VStack alignItems={"flex-start"} gap={5}>
                  <InputTextArea
                    title={t("description")}
                    value={singleDetail.description}
                    disabled={true}
                  />
                  <InputRow
                    title={t("type")}
                    value={singleDetail.type}
                    disabled={true}
                  />
                  <InputRow
                    title={t("status")}
                    value={singleDetail.status}
                    disabled={true}
                  />
                  <InputRow
                    title={t("foundationDate")}
                    value={moment(
                      new Date(Number(singleDetail.foundationdate))
                    ).format("DD/MM/YYYY")}
                    disabled={true}
                  />
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack alignItems={"flex-start"} spacing={5}>
                  <InputRow
                    title={t("country")}
                    value={singleDetail.country}
                    disabled={true}
                  />
                  <InputRow
                    title={t("city")}
                    value={singleDetail.city}
                    disabled={true}
                  />
                  <InputRow
                    title={t("neighborhood")}
                    value={singleDetail.neighborhood}
                    disabled={true}
                  />
                  <InputTextArea
                    title={t("address")}
                    value={singleDetail.address}
                    disabled={true}
                  />
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack alignItems={"flex-start"} spacing={5}>
                  <InputRow
                    title={t("phoneNumber")}
                    value={singleDetail.phonenumber}
                    disabled={true}
                  />
                  <InputRow
                    title={t("fax")}
                    value={singleDetail.faxnumber}
                    disabled={true}
                  />
                  <InputRow
                    title={t("email")}
                    value={singleDetail.email}
                    disabled={true}
                  />
                  <InputRow
                    title={t("website")}
                    value={singleDetail.website}
                    disabled={true}
                  />

                  <HStack
                    alignItems={"flex-start"}
                    width={"100%"}
                    maxWidth={"800px"}
                  >
                    <div style={{ width: "280px" }}>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading" mt={2}>
                        {t("socialMedia")}
                      </Text>
                    </div>
                    <VStack
                      w={"100%"}
                      align={"flex-start"}
                      gap={0}
                      textDecoration={"underline"}
                      color={"blue"}
                    >
                      {singleDetail.socialmedia.length > 0 &&
                        singleDetail.socialmedia.map((item, index) => (
                          <Link
                            href={
                              JSON.parse(item).input.includes("http")
                                ? JSON.parse(item).input
                                : `https://${JSON.parse(item).input}`
                            }
                            key={index}
                            target="blank"
                          >
                            <Text>{JSON.parse(item).input}</Text>
                          </Link>
                        ))}
                    </VStack>
                  </HStack>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack alignItems={"flex-start"} minWidth={"60%"} spacing={5}>
                  <InputRow
                    title={t("directorName")}
                    value={singleDetail.directorname}
                    disabled={true}
                  />
                  <InputRow
                    title={t("occupation")}
                    value={singleDetail.directoroccupation}
                    disabled={true}
                  />

                  <ImageRow
                    title={t("signature")}
                    image={singleDetail.signature}
                  />
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack alignItems={"flex-start"} minWidth={"60%"} spacing={5}>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant="heading" fontSize={"18px"}>
                    {t("bankAccount")}
                  </Text>

                  <InputRow
                    title={t("bankName")}
                    value={singleDetail.bankname}
                    disabled={true}
                  />

                  <InputRow
                    title={t("accountNumber")}
                    value={singleDetail.accountnumber}
                    disabled={true}
                  />

                  <InputRow
                    title={t("nameOfOwner")}
                    value={singleDetail.bankownername}
                    disabled={true}
                  />

                  <InputRow
                    title={t("bankAddress")}
                    value={singleDetail.bankaddress}
                    disabled={true}
                  />

                  <InputRow
                    title={t("swiftCode")}
                    value={singleDetail.bankswiftcode}
                    disabled={true}
                  />

                  <InputRow
                    title={t("iban")}
                    value={singleDetail.bankiban}
                    disabled={true}
                  />

                  <Text color={colorMode === 'dark' && 'gray.300'}variant="heading" fontSize={"18px"}>
                    {t("mobilePayment")}
                  </Text>

                  <InputRow
                    title={t("mobileMoneyService")}
                    value={singleDetail.mobilemoneyservice}
                    disabled={true}
                  />

                  <InputRow
                    title={t("code")}
                    value={singleDetail.mobilemoneycode}
                    disabled={true}
                  />

                  <InputRow
                    title={t("name")}
                    value={singleDetail.mobilemoneyname}
                    disabled={true}
                  />

                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
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
                    {t("deleteHealthcareCenter")}
                  </Text>
                  <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"}fontSize={"14px"} fontWeight={"400"} >
                    {t("deleteHealthcareCenterDescription")}
                  </Text>
                </VStack>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                 
                  onClick={onClose}
                  border="1px solid"
                  borderColor={bdColor}
                  backgroundColor="#FFFFFF"
                  color="#000000"
                >
                  {t("cancel")}
                </Button>
                <Button backgroundColor="#D92D20" ml={3}>
                  {t("delete")}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Flex>
      )}
    </Sidebar>
  );
}

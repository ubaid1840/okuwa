"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { auth, storage } from "@/config/firebase";
import { CountriesList, theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { UserContext } from "@/store/context/UserContext";
import { ChevronRightIcon } from "@chakra-ui/icons";
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
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  useToast,
  Icon,
  Box,
  Select,
  useColorMode,
  useColorModeValue,
  UnorderedList,
  ListItem
} from "@chakra-ui/react";
import axios from '@/lib/axiosInstance';
import {
  sendPasswordResetEmail,
} from "firebase/auth";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {
  Select as SearchableSelect,
  useChakraSelectProps,
} from "chakra-react-select";
import InputImageRow from "@/components/ui/InputImageRow";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Calendar from "@/components/ui/Calendar";
import AddPatientDialog from "../addPatientDialog";


export default function PatientAdd({ page }) {
  const { colorMode } = useColorMode()
  const t = useTranslations("Dictionary");
  const pathname = usePathname();
  const [patientID, setPatientID] = useState("");
  const [patientDetails, setPatientDetails] = useState();
  const { state: UserState } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const [checkLoading, setCheckLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allInsurances, setAllInsurances] = useState([])
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')


  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data?.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {


    axios
      .get(`/api/newroutes/healthcare/${id}/insurance`)
      .then((response) => {
        setAllInsurances(response.data);

      });
  }

  async function handleCheckPatient(item) {
    await axios
      .get(`/api/newroutes/healthcare/${UserState.value.data.centerid}/patient/${Number(patientID)}/checkandsave`)
      .then((response) => {
        setCheckLoading(false);
        setPatientDetails(response.data);
      })
      .catch((e) => {
        setCheckLoading(false);
        if (e.response?.data?.message) {
          toast({
            title: "Error",
            description: e.response?.data?.message,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      });
  }
  function handleNewRegistration() {
    onOpen();
  }

  async function handleSavePatient(patientForm) {

    axios
      .post(`/api/newroutes/healthcare/${UserState.value.data.centerid}/patient`, {
        firstname: patientForm.firstname,
        lastname: patientForm.lastname,
        email: patientForm.email,
        number: patientForm.number,
        address: patientForm.address,
        dob: patientForm.dob,
        gender: patientForm.gender,
        createdby: UserState.value.data.id,
        creationcondition: UserState.value.data.role == 'admin' ? 'admin' : 'staff',
        insurances: patientForm.insurances
      })
      .then(async (response) => {
        sendPasswordResetEmail(auth, patientForm.email, {
          url: `${window.location.origin}/login`,
        })
          .then(async () => {
            router.push(pathname.replace(/\/[^\/]*$/, ""))
          })
          .catch((error) => {
            setLoading(false);
            toast({
              title: "Failed.",
              description: error.message,
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
          })

      })
      .catch((e) => {
        setLoading(false);
        if (e?.response?.data?.message) {
          toast({
            title: "Échoué",
            description: e?.response?.data?.message,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          toast({
            title: "Échoué",
            description: "Échoué",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      });
  }

  async function handleSaveExistingPatient() {
    await axios
      .post(`/api/newroutes/healthcare/${UserState.value.data.centerid}/patient/${patientDetails.id}/checkandsave`, {
        createdby: UserState.value.data.id,
        creationcondition: UserState.value.data.role == 'admin' ? 'admin' : "staff"
      })
      .then(() => {
        `${pathname.replace(/\/[^\/]*$/, "")}?patientadded=true`;
      })
      .catch((e) => {
        setLoading(false);
        if (e?.response?.data?.message) {
          toast({
            title: "Failed.",
            description: e?.response?.data?.message,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      });
  }


  const sideLinks = GetLinkItems(page);
  return (
    <Sidebar LinkItems={sideLinks} settingsLink={page == 'admin' ? "/admin/settings" : null}>
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <HStack fontSize="14px" fontWeight="500" color="#667085">
          <Link href={pathname.replace(/\/[^\/]*$/, "")}>{t("patient")}</Link>
          <ChevronRightIcon />
          <Text color={colorMode === 'dark' ? 'gray.300' : '#344054'}>{t("addNewPatient")}</Text>
        </HStack>
        <Text color={colorMode === 'dark' && 'gray.300'} variant="heading">{t("addNewPatient")}</Text>
        <HStack alignItems={"flex-start"} minWidth={"70%"}>
          <div style={{ width: "280px" }}>
            <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
              {t("inputPatientID")}
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              width: "70%",
            }}
          >
            <Input
              width="70%"
              value={patientID}
              onChange={(e) => setPatientID(e.target.value)}
            />
            <div>
              <GhostButton
                isLoading={checkLoading}
                isDisabled={!patientID || !UserState.value.data?.centerid}
                onClick={() => {
                  setCheckLoading(true);
                  handleCheckPatient(patientID);
                }}
              >
                {t("check")}
              </GhostButton>
            </div>
            <div>
              <Button onClick={() => handleNewRegistration()}>
                {t("newRegistration")}
              </Button>
            </div>
          </div>
        </HStack>
        {patientDetails && (
          <>
            <HStack width={"100%"} justifyContent={"space-between"}>
              <HStack spacing={10}>
                <Image
                  src={patientDetails.image}
                  height={"60px"}
                  width={"60px"}
                  borderRadius={"50px"}
                />
                <VStack spacing={0} alignItems={"flex-start"}>
                  <Text color={colorMode === 'dark' && 'gray.300'} variant="heading" fontSize="24px">
                    {patientDetails.basicInfo.firstName +
                      " " +
                      patientDetails.basicInfo.lastName}
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'} variant="description" fontSize="16px" fontWeight="400">
                    {patientDetails.id}
                  </Text>
                </VStack>
              </HStack>

              <HStack>
                <Link href={`${pathname.replace(/\/[^\/]*$/, "")}`}>
                  <Button
                    onClick={() => setPatientDetails()}
                    variant="outline"
                    backgroundColor={"#FFFFFF"}
                    color={"black"}
                    border={"1px solid"}
                    borderColor={bdColor}
                  >
                    {t("cancel")}
                  </Button>
                </Link>

                <Button
                  isLoading={loading}
                  onClick={() => {
                    setLoading(true);
                    handleSaveExistingPatient();
                  }}
                >
                  {t("save")}
                </Button>
              </HStack>
            </HStack>
            <Tabs minW={"70%"}>
              <TabList
                borderBottomWidth={"1px"}
                borderBottomColor={theme.divider.primary}
              >
                {[t("basicInfo"), t("insurance")].map((item, index) => (
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
                  <VStack
                    alignItems={"flex-start"}
                    minWidth={"60%"}
                    spacing={5}
                  >
                    <Text color={colorMode === 'dark' && 'gray.300'} variant="heading" fontSize={"18px"}>
                      {t("personalInfo")}
                    </Text>
                    <HStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      minW={"70%"}
                    >
                      <div style={{ width: "280px" }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
                          {t("firstName")}
                        </Text>
                      </div>
                      <Input
                        value={patientDetails.basicInfo.firstName}
                        isDisabled
                      />
                    </HStack>
                    <HStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      minW={"70%"}
                    >
                      <div style={{ width: "280px" }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
                          {t("lastName")}
                        </Text>
                      </div>
                      <Input
                        value={patientDetails.basicInfo.lastName}
                        isDisabled
                      />
                    </HStack>

                    <HStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      minW={"70%"}
                    >
                      <div style={{ width: "280px" }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
                          {t("dob")}
                        </Text>
                      </div>
                      <Input value={patientDetails.basicInfo.dob} isDisabled />
                    </HStack>
                    <HStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      minW={"70%"}
                    >
                      <div style={{ width: "280px" }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
                          {t("gender")}
                        </Text>
                      </div>
                      <Input
                        value={patientDetails.basicInfo.gender}
                        isDisabled
                      />
                    </HStack>

                    <Divider color={theme.divider.primary} />

                    <Text color={colorMode === 'dark' && 'gray.300'} variant="heading" fontSize={"18px"}>
                      {t("contact")}
                    </Text>
                    <HStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      minW={"70%"}
                    >
                      <div style={{ width: "280px" }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
                          {t("email")}
                        </Text>
                      </div>
                      <Input
                        value={patientDetails.basicInfo.email}
                        resize="none"
                        isDisabled
                      />
                    </HStack>

                    <HStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      minW={"70%"}
                    >
                      <div style={{ width: "280px" }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
                          {t("phoneNumber")}
                        </Text>
                      </div>
                      <Input
                        value={patientDetails.basicInfo.phoneNumber}
                        isDisabled
                      />
                    </HStack>
                    <HStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      minW={"70%"}
                    >
                      <div style={{ width: "280px" }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
                          {t("address")}
                        </Text>
                      </div>
                      <Input
                        value={patientDetails.basicInfo.address}
                        resize="none"
                        isDisabled
                      />
                    </HStack>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack alignItems={"flex-start"} minW={"60%"} spacing={5}>
                    <HStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      minW={"70%"}
                    >
                      <div style={{ width: "280px" }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
                          {t("insuranceCard")}
                        </Text>
                      </div>
                      <Image
                        src={patientDetails.insurance.insuranceCard}
                        width={"126px"}
                        height={"126px"}
                      />
                    </HStack>
                    <HStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      minW={"70%"}
                    >
                      <div style={{ width: "280px" }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
                          {t("insuranceProvider")}
                        </Text>
                      </div>
                      <Input
                        value={patientDetails.insurance.insuranceProvider}
                        isDisabled
                      />
                    </HStack>
                    <HStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      minW={"70%"}
                    >
                      <div style={{ width: "280px" }}>
                        <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
                          {t("insuranceCardID")}
                        </Text>
                      </div>
                      <Input
                        minW={"50%"}
                        value={patientDetails.insurance.insuranceCardID}
                        isDisabled
                      />
                    </HStack>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
        <AddPatientDialog loading={loading} allInsurances={allInsurances} onClose={onClose} isOpen={isOpen} onSave={(patientForm) => {
          setLoading(true)
          handleSavePatient(patientForm)
        }} />

      </Flex>

    </Sidebar>
  );
}

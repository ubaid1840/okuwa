"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import InputCalendarRow from "@/components/ui/InputCalendarRow";
import InputImageRow from "@/components/ui/InputImageRow";
import InputRow from "@/components/ui/InputRow";
import InputSelectRow from "@/components/ui/InputSelectRow";
import InputTextArea from "@/components/ui/InputTextRow";
import Sidebar from "@/components/sidebar";
import { doctorTypes, theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import {
  AddIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
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
  Avatar,
  Select,
  TableContainer,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Box,
  Icon,
  Textarea,
  useToast,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { CiCalendar } from "react-icons/ci";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@/components/ui/Checkbox";
import { GoBriefcase } from "react-icons/go";
import { RxPencil1 } from "react-icons/rx";
import { auth, db, storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import moment from "moment";
import axios from "@/lib/axiosInstance";
import { sendPasswordResetEmail } from "firebase/auth";
import { UserContext } from "@/store/context/UserContext";
import { Calendar } from "primereact/calendar";
import { showToastFailed } from "@/utils/toastUtils";

export default function Page() {
  const { colorMode } = useColorMode();
  const t = useTranslations("Dictionary");
  const toast = useToast();
  const pathName = usePathname();
  const sideLinks = GetLinkItems("admin");
  const [role, setRole] = useState("selectOne");
  const [myEmail, setMyEmail] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSave,
    onOpen: onOpenSave,
    onClose: onCloseSave,
  } = useDisclosure();
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const router = useRouter();
  const { state: UserState } = useContext(UserContext);
  const [staffID, setStaffID] = useState("");
  const [allRooms, setAllRooms] = useState([]);
  const toastIdRef = useRef(null);
  const bgColor = useColorModeValue("white", "gray.800")
  const bdColor = useColorModeValue(
    theme.color.primaryBorderColor,
    "gray.700"
  )
  const bdColor2 = useColorModeValue(theme.divider.primary, "gray.600")
  const [history, setHistory] = useState({
    name: "",
    title: "",
    start: new Date(),
    end: new Date(),
  });
  const [data, setData] = useState({
    picture: "",
    firstname: "",
    lastname: "",
    dob: "",
    gender: "male",
    phonenumber: "",
    email: "",
    homeaddress: "",
    officeaddress: "",
    speciality: "",
    qualification: "",
    medicalschool: "",
    training: "",
    fellowship: "",
    workhistory: [],
    centerID: 0,
    roomid: null,
  });

  useEffect(() => {
    if (UserState.value.data?.centerid)
      fetchData(UserState.value.data?.centerid);
  }, [UserState.value.data]);

  async function fetchData(id) {
   
    axios
      .get(`/api/newroutes/healthcare/${id}/admin/facility`)
      .then((response) => {
        setAllRooms(response.data);
      })
      .catch((e) => {
        console.log(e.response);
      });
  }

  const uploadFiles = async (type) => {
    const response = await fetch(data.picture);
    const blob = await response.blob();

    const name = type + ".png";
    const metadata = {
      contentType: "image/png",
    };
    const storageRef = ref(storage, `${data.email}/images/` + name);
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        setLoading(false);
        setImageLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          handleSaveStaff(downloadURL);
        });
      }
    );
  };

  async function handleSaveStaff(imageUrl) {
    let newWorkHistory = [];
    workHistory.map((item, index) => {
      newWorkHistory.push({
        ...item,
        start: new Date(item.start).getTime(),
        end: new Date(item.end).getTime(),
      });
    });
    const temp = {
      ...data,
      picture: imageUrl,
      workhistory: [...newWorkHistory],
      dob: new Date(data.dob).getTime(),
      role: role,
      status: "available",
    };

     axios
      .post(`/api/newroutes/healthcare/${UserState.value.data?.centerid}/admin/medicalstaff`, temp)
      .then(async (response) => {
        await sendPasswordResetEmail(auth, data.email, {
          url: `${window.location.origin}/login`,
        })
          .then(async () => {
            router.push(
              `${pathName.replace(/\/[^\/]*$/, "")}?medicalstaffadded=true`
            );
          })
          .catch((error) => {
            setLoading(false);
            const errorCode = error.code;
            const errorMessage = error.message;
            showToastFailed(toast, toastIdRef, t("Failed"), error.message);
          });
      })
      .catch((e) => {
        if (e.response?.data?.message) {
          setLoading(false);
          showToastFailed(
            toast,
            toastIdRef,
            t("Failed"),
            e.response.data.message
          );
        }
      });
  }

  useEffect(() => {});

  return (
    <Sidebar LinkItems={sideLinks} settingsLink={"/admin/settings"}>
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <HStack fontSize="14px" fontWeight="500" color="#667085">
          <Link href={pathName.replace(/\/[^\/]*$/, "")}>
            {t("medicalStaff")}
          </Link>
          <ChevronRightIcon />
          <Text color={colorMode === "dark" ? "gray.300" : "#344054"}>
            {t("addNewMedicalStaff")}
          </Text>
        </HStack>
        <HStack w={"100%"} justify={"space-between"}>
          <Text color={colorMode === "dark" && "gray.300"} variant="heading">
            {t("addNewMedicalStaff")}
          </Text>
          <HStack>
            <Link href={`${pathName.replace(/\/[^\/]*$/, "")}`}>
              <GhostButton>{t("cancel")}</GhostButton>
            </Link>

            <Button
              isDisabled={
                !role ||
                !data.speciality ||
                !data.firstname ||
                !data.lastname ||
                !data.gender ||
                !data.email
              }
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                if (data.picture) {
                  uploadFiles("profile");
                } else {
                  handleSaveStaff("");
                }
              }}
            >
              {t("save")}
            </Button>
          </HStack>
        </HStack>

        <VStack width={"100%"} gap={5} align={"flex-start"}>
          <HStack alignItems={"flex-start"} width={"100%"} maxWidth={"800px"}>
            <div style={{ width: "280px" }}>
              <Text
                color={colorMode === "dark" && "gray.300"}
                variant="subheading"
                mt={2}
                display={"flex"}
              >
                {t("selectRole")}{" "}
                <Text ml={1} color={"red"}>
                  *
                </Text>
              </Text>
            </div>
            <Select
              bg={bgColor}
              borderColor={bdColor}
              onChange={(e) => {
                setRole(e.target.value);
                setData((prevState) => ({ ...prevState, speciality: "" }));
              }}
            >
              <option value={"selectOne"}>{t("selectOne")}</option>
              <option value="doctor">{t("doctor")}</option>
              <option value="nurse">{t("nurse")}</option>
              <option value="frontDesk">{t("frontDesk")}</option>
              <option value="labUser">{t("labUser")}</option>
              <option value="financeUser">{t("financeUser")}</option>
            </Select>
          </HStack>
          {role !== "selectOne" && (
            <VStack width={"100%"} align={"flex-start"}>
              <InputRow colorMode={colorMode} title={t("staffID")} value={`auto`} disabled={true} />
              <InputSelectRow
              colorMode={colorMode}
                forRoom={true}
                title={t("room")}
                options={allRooms}
                onChange={(e) =>
                  setData((prevState) => {
                    const newState = { ...prevState };
                    newState.roomid = e.target.value;
                    return newState;
                  })
                }
              />

              <Tabs w={"100%"} variant='unstyled'>
                <TabList
                  borderBottomWidth={"1px"}
                  borderBottomColor={bdColor2}
                >
                  {[t("basicInfo"), t("educationAndTraining")].map(
                    (item, index) => (
                      <Tab
                        key={index}
                        fontWeight={"500"}
                        fontSize={"14px"}
                        _selected={{ color: theme.color.primary }}
                      >
                        {item}
                      </Tab>
                    )
                  )}
                </TabList>
                <TabIndicator
                  mt="-1.5px"
                  height="2px"
                  bg={theme.color.primary }
                  borderRadius="1px"
                />
                <TabPanels mt={5}>
                  <TabPanel>
                    <VStack
                      alignItems={"flex-start"}
                      spacing={5}
                      width={"100%"}
                    >
                      <Text
                        color={colorMode === "dark" && "gray.300"}
                        variant={"subheading"}
                        fontSize={"18px"}
                      >
                        {t("personalInfo")}
                      </Text>
                      <InputImageRow
                      colorMode={colorMode}
                        image={data.picture}
                        onDeleteImage={() =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.picture = "";
                            return newState;
                          })
                        }
                        title={t("picture")}
                        onReturn={async (file) => {
                          if (file) {
                            setImageLoading(true);
                            setData((prevState) => {
                              const newState = { ...prevState };
                              newState.picture = URL.createObjectURL(file);
                              return newState;
                            });
                          }
                        }}
                      />
                      <InputRow
                      colorMode={colorMode}
                        isRequired={true}
                        title={t("firstName")}
                        placeholder={t("inputStaffFirstName")}
                        onChange={(e) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.firstname = e.target.value;
                            return newState;
                          })
                        }
                      />
                      <InputRow
                      colorMode={colorMode}
                        isRequired={true}
                        title={t("lastName")}
                        placeholder={t("inputStaffLastName")}
                        onChange={(e) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.lastname = e.target.value;
                            return newState;
                          })
                        }
                      />
                      <InputCalendarRow
                      colorMode={colorMode}
                        title={t("dob")}
                        value={data.dob ? new Date(data.dob) : new Date()}
                        onChange={(date) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.dob = new Date(date.value).getTime();
                            return newState;
                          })
                        }
                      />
                      <InputSelectRow colorMode={colorMode}
                        isRequired={true}
                        title={t("gender")}
                        options={["male", "female"]}
                        onChange={(e) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.gender = e.target.value;
                            return newState;
                          })
                        }
                      />

                      <Divider />
                      <Text
                        color={colorMode === "dark" && "gray.300"}
                        variant={"subheading"}
                        fontSize={"18px"}
                      >
                        {t("contact")}
                      </Text>
                      <InputRow colorMode={colorMode}
                        type={"number"}
                        title={t("phoneNumber")}
                        placeholder={t("inputStaffPhoneNumber")}
                        onChange={(e) => {
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.phonenumber = e.target.value;
                            return newState;
                          });
                        }}
                      />
                      <InputRow colorMode={colorMode}
                        isRequired={true}
                        title={t("email")}
                        placeholder={t("inputStaffEmail")}
                        onChange={(e) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.email = e.target.value;
                            return newState;
                          })
                        }
                      />
                      <InputTextArea
                      colorMode={colorMode}
                        title={t("homeAddress")}
                        placeholder={t("inputStaffHomeAddress")}
                        onChange={(e) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.homeaddress = e.target.value;
                            return newState;
                          })
                        }
                      />
                      <InputTextArea
                      colorMode={colorMode}
                        title={t("officeAddress")}
                        placeholder={t("inputStaffOfficeAddress")}
                        onChange={(e) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.officeaddress = e.target.value;
                            return newState;
                          })
                        }
                      />
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack
                      alignItems={"flex-start"}
                      spacing={5}
                      width={"100%"}
                    >
                      <Text
                        color={colorMode === "dark" && "gray.300"}
                        variant={"subheading"}
                        fontSize={"18px"}
                      >
                        {t("educationAndTraining")}
                      </Text>
                      <InputSelectRow colorMode={colorMode}
                        isRequired={true}
                        value={data.speciality}
                        title={t("speciality")}
                        options={
                          role == "labUser"
                            ? ["labTest", "imagingStudies"]
                            : role == "doctor"
                            ? doctorTypes
                            : role == "frontDesk"
                            ? ["frontDesk"]
                            : role == "nurse"
                            ? ["nurse"]
                            : role == "financeUser"
                            ? ["finance"]
                            : []
                        }
                        onChange={(e) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.speciality = e.target.value;
                            return newState;
                          })
                        }
                      />
                      <InputRow colorMode={colorMode}
                        title={t("qualifications")}
                        placeholder={t("inputStaffQualifications")}
                        onChange={(e) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.qualification = e.target.value;
                            return newState;
                          })
                        }
                      />
                      <InputRow colorMode={colorMode}
                        title={t("medicalSchool")}
                        placeholder={t("inputStaffMedicalSchool")}
                        onChange={(e) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.medicalschool = e.target.value;
                            return newState;
                          })
                        }
                      />
                      <InputRow colorMode={colorMode}
                        title={t("residencyTraining")}
                        placeholder={t("inputStaffResidencyTraining")}
                        onChange={(e) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.training = e.target.value;
                            return newState;
                          })
                        }
                      />
                      <InputRow colorMode={colorMode}
                        title={t("fellowships")}
                        placeholder={t("inputStaffFellowships")}
                        onChange={(e) =>
                          setData((prevState) => {
                            const newState = { ...prevState };
                            newState.fellowship = e.target.value;
                            return newState;
                          })
                        }
                      />

                      <Divider />
                      <Text
                        color={colorMode === "dark" && "gray.300"}
                        variant={"subheading"}
                        fontSize={"18px"}
                      >
                        {t("professionalExperience")}
                      </Text>
                      <HStack
                        alignItems={"flex-start"}
                        width={"100%"}
                        maxWidth={"800px"}
                      >
                        <div style={{ width: "280px" }}>
                          <Text
                            color={colorMode === "dark" && "gray.300"}
                            variant="subheading"
                            mt={2}
                          >
                            {t("workHistory")}
                          </Text>
                        </div>
                        <VStack align={"flex-start"}>
                          {workHistory.length > 0 &&
                            workHistory.map((item, index) => (
                              <HStack
                                key={index}
                                justify={"space-between"}
                                gap={4}
                              >
                                <HStack
                                  p={5}
                                  width={"412px"}
                                  borderRadius={"8px"}
                                  border={"1px solid"}
                                  borderColor={"#EAECF0"}
                                  justify={"space-between"}
                                  align={"flex-start"}
                                >
                                  <HStack gap={5}>
                                    <div
                                      style={{
                                        padding: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "50px",
                                        backgroundColor: theme.color.primary,
                                      }}
                                    >
                                      <Icon
                                        as={GoBriefcase}
                                        boxSize={4}
                                        color={"white"}
                                      />
                                    </div>
                                    <VStack
                                      align={"flex-start"}
                                      width={"100%"}
                                      gap={0}
                                    >
                                      <Text
                                        color={
                                          colorMode === "dark" && "gray.300"
                                        }
                                        variant={"subheading"}
                                      >
                                        {item.name}
                                      </Text>
                                      <Text
                                        variant={"description"}
                                        fontSize={"14px"}
                                      >
                                        {item.title}
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  <div style={{ flexWrap: "nowrap" }}>
                                    <Text
                                      variant={"description"}
                                      fontSize={"14px"}
                                    >
                                      {moment(new Date(item.start)).format(
                                        "YYYY"
                                      )}{" "}
                                      -{" "}
                                      {moment(new Date(item.end)).format(
                                        "YYYY"
                                      )}
                                    </Text>
                                  </div>
                                </HStack>
                                <DeleteIcon
                                  color={"red"}
                                  boxSize={5}
                                  onClick={() => {
                                    const filter = workHistory.filter(
                                      (item, ind) => ind !== index
                                    );
                                    setWorkHistory([...filter]);
                                  }}
                                />
                                {/* <Icon as={RxPencil1} boxSize={5} /> */}
                              </HStack>
                            ))}
                          <div>
                            <GhostButton
                              onClick={() => {
                                setHistory({
                                  name: "",
                                  title: "",
                                  start: new Date(),
                                  end: new Date(),
                                });
                                onOpen();
                              }}
                              leftIcon={<AddIcon mt={"-2px"} />}
                            >
                              {t("addWorkHistory")}
                            </GhostButton>
                          </div>
                        </VStack>
                      </HStack>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          )}
        </VStack>
      </Flex>

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent>
          <AlertDialogCloseButton />
          <AlertDialogBody my={3}>
            <VStack alignItems={"flex-start"} gap={4} width={"100%"}>
              <Text
                color={colorMode === "dark" ? "gray.300" : "#101828"}
                fontSize={"18px"}
                fontWeight={"500"}
              >
                {t("addWorkHistory")}
              </Text>

              <Text
                color={colorMode === "dark" ? "gray.300" : "#667085"}
                fontSize={"14px"}
                fontWeight={"400"}
              >
                {t("addWorkHistorySubheading")}
              </Text>
              <VStack w={"100%"} align={"flex-start"} gap={0}>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"subheading"}
                >
                  {t("hospitalClinicName")}
                </Text>
                <Input
                
                  placeholder={t("hospitalClinicNameInput")}
                  value={history.name}
                  onChange={(e) =>
                    setHistory((prevState) => {
                      const newState = { ...prevState };
                      newState.name = e.target.value;
                      return newState;
                    })
                  }
                />
              </VStack>
              <VStack w={"100%"} align={"flex-start"} gap={0}>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"subheading"}
                >
                  {t("positionTitle")}
                </Text>
                <Input
                
                  placeholder={t("positionTitleInput")}
                  value={history.title}
                  onChange={(e) =>
                    setHistory((prevState) => {
                      const newState = { ...prevState };
                      newState.title = e.target.value;
                      return newState;
                    })
                  }
                />
              </VStack>
              <VStack w={"100%"} align={"flex-start"} gap={0}>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"subheading"}
                >
                  {t("startDate")}
                </Text>
                <Box
                  display={"flex"}
                  width={"100%"}
                  height={10}
                  borderRadius={"0.375rem"}
                  outline={"2px solid transparent"}
                  border={"1px solid"}
                  borderColor={bdColor}
                  paddingInlineStart={"1rem"}
                  paddingInlineEnd={"1rem"}
                  alignItems={"center"}
                  _hover={{ borderColor: theme.color.border }}
                  _focusWithin={{
                    boxShadow: "0px 0px 3px 3px #b2d8d8",
                    borderColor: theme.color.border,
                  }}
                >
                  <Calendar
                    className="custom-datepicker"
                    value={history.start ? new Date(history.start) : new Date()}
                    onChange={(e) => {
                      setHistory((prevState) => {
                        const newState = { ...prevState };
                        newState.start = e.value;
                        return newState;
                      });
                    }}
                  />

                  <Icon as={CiCalendar} size={20} />
                </Box>
              </VStack>
              <VStack w={"100%"} align={"flex-start"} gap={0}>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"subheading"}
                >
                  {t("endDate")}
                </Text>
                <Box
                  display={"flex"}
                  width={"100%"}
                  height={10}
                  borderRadius={"0.375rem"}
                  outline={"2px solid transparent"}
                  border={"1px solid"}
                  borderColor={bdColor}
                  paddingInlineStart={"1rem"}
                  paddingInlineEnd={"1rem"}
                  alignItems={"center"}
                  _hover={{ borderColor: theme.color.border }}
                  _focusWithin={{
                    boxShadow: "0px 0px 3px 3px #b2d8d8",
                    borderColor: theme.color.border,
                  }}
                >
                  <Calendar
                    className="custom-datepicker"
                    value={history.end ? new Date(history.end) : new Date()}
                    onChange={(e) => {
                      setHistory((prevState) => {
                        const newState = { ...prevState };
                        newState.end = e.value;
                        return newState;
                      });
                    }}
                  />

                  <Icon as={CiCalendar} size={20} />
                </Box>
              </VStack>
              {/* <Checkbox>{t("staffCurrentlyWorkingHere")}</Checkbox> */}
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter width={"100%"}>
            <GhostButton w={"100%"} onClick={() => onClose()}>
              {t("cancel")}
            </GhostButton>
            <Button
              isDisabled={
                !history.end ||
                !history.name ||
                !history.start ||
                !history.title
              }
              w={"100%"}
              ml={3}
              onClick={() => {
                const temp = [...workHistory];
                temp.push(history);
                setWorkHistory([...temp]);
                onClose();
              }}
            >
              {`${t("confirm")}`}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onCloseSave}
        isOpen={isOpenSave}
        isCentered
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent>
          <AlertDialogCloseButton />
          <AlertDialogBody my={3}>
            <VStack alignItems={"flex-start"} gap={4} width={"100%"}>
              <Text
                color={colorMode === "dark" ? "gray.300" : "#101828"}
                fontSize={"18px"}
                fontWeight={"500"}
              >
                {t("doctorBio")}
              </Text>

              <Text
                color={colorMode === "dark" ? "gray.300" : "#667085"}
                fontSize={"14px"}
                fontWeight={"400"}
              >
                {t("doctorBioSubheading")}
              </Text>
              <Textarea
                resize={"none"}
                height={"200px"}
                value={
                  "Dr. Lana Steiner - Orthopedic Specialist: Dedicated to restoring mobility and enhancing lives through personalized care and advanced techniques. Committed to excellence in orthopedic treatment for patients of all ages."
                }
              />
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter width={"100%"}>
            <GhostButton w={"100%"} onClick={() => onCloseSave()}>
              {t("cancel")}
            </GhostButton>
            <Link
              href={`${pathName.replace(
                /\/[^\/]*$/,
                ""
              )}?medicalstaffadded=true`}
              style={{ width: "100%", marginLeft: "10px" }}
            >
              <Button
                w={"100%"}
                onClick={() => {
                  onCloseSave();
                }}
              >
                {`${t("confirm")}`}
              </Button>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}

"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { CountriesList, theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { AddIcon, ChevronRightIcon } from "@chakra-ui/icons";
import "react-datepicker/dist/react-datepicker.css";
import {
  Flex,
  HStack,
  Text,
  VStack,
  Select,
  Box,
  Icon,
  Textarea,
  Spinner,
  Center,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Input,
  useToast,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { CiCalendar } from "react-icons/ci";
import { useTranslations } from "next-intl";
import { UserContext } from "@/store/context/UserContext";
import axios from "@/lib/axiosInstance";
import InputTextArea from "@/components/ui/InputTextRow";
import moment from "moment";
import {
  Select as SearchableSelect,
  useChakraSelectProps,
} from "chakra-react-select";
import { Calendar } from "primereact/calendar";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/config/firebase";
import InputImageRow from "@/components/ui/InputImageRow";
import AddPatientDialog from "@/components/patients/addPatientDialog";
import { sendPasswordResetEmail } from "firebase/auth";

export default function AppointmentAdd({ page }) {
  const { colorMode } = useColorMode();
  const t = useTranslations("Dictionary");
  const pathName = usePathname();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const { state: UserState } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [timeList, setTimeList] = useState([]);
  const [timeLoading, setTimeLoading] = useState(false);
  const [dob, setDob] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState();
  const [invoiced, setInvoiced] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allInsurances, setAllInsurances] = useState([]);
  const [allReasons, setAllReasons] = useState([]);
  const [settingsData, setSettingsData] = useState();
  const [labUsers, setLabUsers] = useState([]);
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.700");
  const toast = useToast();

  const [data, setData] = useState({
    patient: "",
    patientID: "",
    doctor: "",
    doctorID: null,
    date: moment().valueOf(),
    time: "",
    reason: "",
    service: "",
    reasonid: null,
    invoiced: "",
    patientamount: "",
    insuranceamount: "",
    type: "inPerson",
    labtestcategory: "",
    labtesttube: "",
    labtestunit: "",
    code: "",
    abbreviation: "",
    labUserId: null,
    labUser: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (selectedPatient && selectedPatient?.insurances?.length > 0) {
      let remainingAmount = Number(invoiced);

      selectedPatient.insurances.forEach((item) => {
        const insurance = JSON.parse(item);
        if (
          insurance.insuranceexpiry &&
          Number(insurance.insuranceexpiry) >= moment().valueOf()
        ) {
          if (Number(insurance.insurancepercentage) > 0) {
            const reduction =
              remainingAmount * (Number(insurance.insurancepercentage) / 100);
            remainingAmount -= reduction;
          }
        }
      });

      setData((prevState) => {
        const newState = { ...prevState };
        newState.invoiced = invoiced;
        newState.insuranceamount = (Number(invoiced) - remainingAmount).toFixed(
          2
        );
        newState.patientamount = remainingAmount.toFixed(2);
        return newState;
      });
    } else {
      setData((prevState) => {
        const newState = { ...prevState };
        newState.invoiced = invoiced;
        newState.insuranceamount = 0;
        newState.patientamount = invoiced;
        return newState;
      });
    }
  }, [invoiced, selectedPatient]);

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data?.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
   
    axios.get(`/api/newroutes/healthcare/${id}/newappointment`)
    .then((response) => {
        if (response.data.settings) {
            setSettingsData(response.data.settings)
        }
        if(response.data.staff){
            const temp = response.data.staff;
            const filterTemp = temp.filter((item) => item.role === "doctor" && item.status === 'available');
            setDoctors([...filterTemp]);
            const labGuys = temp.filter((item) => item.role === 'labUser')
            setLabUsers([...labGuys])
        }
        if(response.data.patient){
            onClose()
            setLoading(false)
            setPatients(response.data.patient);
        }
        if(response.data.insurance){
            setAllInsurances(response.data.insurance);
        }
        if(response.data.reason){
            setAllReasons(response.data.reason)
        }
    })
  }

  async function handleSavePatient(patientForm) {
    await axios
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
        insurances: patientForm.insurances,
    })
    .then(async (response) => {
        sendPasswordResetEmail(auth, patientForm.email, {
            url: `${window.location.origin}/login`,
        })
            .then(async () => {
                fetchData(UserState.value.data.centerid)
                setData((prevState) => ({
                    ...prevState,
                    patient: `${response.data.id} - ${response.data.firstname}  ${response.data.lastname} `,
                    patientID: response.data.id,
                }));
                setSelectedPatient(response.data)
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

  async function handleSaveAppointment() {
    const localIsoString = moment(data.date).format("YYYY-MM-DD");
    const combinedDateTimeString = `${localIsoString}T${data.time}:00.000`;
    const temp = Date.parse(combinedDateTimeString);
    try {
      await axios
        .post("/api/insert", {
          table: "appointment",
          columns: [
            "patientid",
            "doctorid",
            "appointmentdate",
            "reason",
            "centerid",
            "createdby",
            "status",
            "invoiced",
            "patientamount",
            "insuranceamount",
            "type",
            "reasonid",
            "service",
            "labuserid",
          ],
          values: [
            data.patientID,
            data.doctorID,
            temp,
            data.reason,
            UserState.value.data.centerid,
            page == "admin" ? null : UserState.value.data.id,
            "waiting",
            data.invoiced,
            data.patientamount,
            data.insuranceamount,
            data.type,
            data.reasonid,
            data.service,
            data.labUserId,
          ],
        })
        .then((res) => {
          if (data.reason === "labTest" || data.reason === "imagingStudies") {
            axios
              .post("/api/insert", {
                table: "labrequest",
                columns: [
                  "centerid",
                  "patientid",
                  "requesttype",
                  "testtype",
                  "priority",
                  "created",
                  "expected",
                  "status",
                  "appointmentid",
                  "labuserid",
                ],
                values: [
                  UserState.value.data.centerid,
                  data.patientID,
                  data.reason,
                  data.service,
                  "medium",
                  moment().valueOf(),
                  temp,
                  "requested",
                  res.data.data.id,
                  data.labUserId,
                ],
              })
              .then(() => {
                router.push(
                  `${pathName.replace(/\/[^\/]*$/, "")}?appointmentadded=true`
                );
              });
          } else {
            router.push(
              `${pathName.replace(/\/[^\/]*$/, "")}?appointmentadded=true`
            );
          }
        })
        .catch((e) => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  }

  const customChakraStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: bdColor,
    }),
  };

  const patientSelectProps = useChakraSelectProps({
    value: {
      value: data.patient,
      label: data.patient == "" ? t("selectOne") : data.patient,
    },
    onChange: (e) => {
      setData((prevState) => ({
        ...prevState,
        patient: e.label,
        patientID: e.value,
      }));
      const selected = patients.filter((item) => item.id === e.value);
      if (selected.length > 0) {
        setSelectedPatient(selected[0]);
      }
    },
  });

  const doctorSelectProps = useChakraSelectProps({
    value: {
      value: data.doctor,
      label: data.doctor == "" ? t("selectOne") : data.doctor,
    },
    onChange: (e) => {
      setData((prevState) => ({
        ...prevState,
        doctor: e.label,
        doctorID: e.value,
      }));
      if (data.date) {
        fetchDoctorSchedule(
          e.value,
          moment(new Date(data.date)).format("dddd").toLowerCase()
        );
      }
    },
  });

  const reasonSelectProps = useChakraSelectProps({
    value: {
      value: data.reasonid,
      label: data.reason
        ? `${t(data?.reason)} ${data.service}`
        : t("selectOne"),
    },
    onChange: (e) => {
      const temp = [...allReasons.filter((item) => item.id === e.value)];

      if (temp.length > 0) {
        setInvoiced(temp[0].price);
        setData((prevState) => ({
          ...prevState,
          reason: temp[0].category,
          service: temp[0].service,
          reasonid: temp[0].id,
        }));
      }
    },
  });

  const LabSelectProps = useChakraSelectProps({
    value: {
      value: data.labUser,
      label: data.labUser == "" ? t("selectOne") : data.labUser,
    },
    onChange: (e) => {
      const temp = labUsers.filter((item) => item.id === e.value);
      if (temp.length > 0) {
        setData((prevState) => ({
          ...prevState,
          labUser: `${temp[0].firstname} ${temp[0].lastname}`,
          labUserId: e.value,
        }));
      }
    },
  });

  async function fetchDoctorSchedule(id, day) {
    setData((prevState) => ({
      ...prevState,
      time: "Selectionner",
    }));
    setTimeLoading(true);
    await axios
      .get(`/api/newroutes/healthcare/${UserState.value.data.centerid}/doctor/${id}/schedule?day=${day}`)
      .then((response) => {
        setTimeLoading(false);
        const temp = response.data.map((item) => {
          return item.starttime;
        });
        setTimeList([...temp]);
      });
  }

  const sideLinks = GetLinkItems(page);
  return (
    <Sidebar
      LinkItems={sideLinks}
      settingsLink={page == "admin" ? "/admin/settings" : null}
    >
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <HStack fontSize="14px" fontWeight="500" color="#667085">
          <Link href={pathName.replace(/\/[^\/]*$/, "")}>
            {t("appointment")}
          </Link>
          <ChevronRightIcon />
          <Text color={colorMode === "dark" ? "gray.300" : "#344054"}>
            {t("addNewAppointment")}
          </Text>
        </HStack>
        <HStack justifyContent={"space-between"}>
          <Text color={colorMode === "dark" && "gray.300"} variant="heading">
            {t("addNewAppointment")}
          </Text>
          <HStack>
            <Link href={`${pathName.replace(/\/[^\/]*$/, "")}`}>
              <Button
                onClick={() =>
                  setData({
                    patient: "",
                    patientID: "",
                    doctor: "",
                    doctorID: "",
                    date: "",
                    time: "",
                    reason: "",
                    invoiced: "",
                    patientamount: "",
                    insuranceamount: "",
                  })
                }
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
              isDisabled={
                !data.patientID ||
                data.reason == "" ||
                !data.invoiced ||
                !data.date ||
                !data.time
              }
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                handleSaveAppointment();
              }}
            >
              {t("save")}
            </Button>
          </HStack>
        </HStack>
        <VStack alignItems={"flex-start"} width={"60%"} spacing={5}>
          <HStack width={"100%"}>
            <div style={{ width: "280px" }}>
              <Text
                color={colorMode === "dark" && "gray.300"}
                variant={"subheading"}
              >
                {t("patient")}
              </Text>
            </div>
            <div
              style={{ width: "100%", display: "flex", alignItems: "center" }}
            >
              <div style={{ width: "100%" }}>
                <SearchableSelect
                  useBasicStyles
                  chakraStyles={customChakraStyles}
                  colorScheme="teal"
                  options={patients.map((item) => {
                    return {
                      value: item.id,
                      label: `${item.id} - ${item.firstname}  ${item.lastname} `,
                    };
                  })}
                  {...patientSelectProps}
                />
              </div>
              <Center
                _hover={{ opacity: 0.7, cursor: "pointer" }}
                p={2}
                ml={4}
                bg={"#309C18FF"}
                borderRadius={20}
                onClick={() => {
                  onOpen();
                }}
              >
                <Icon as={AddIcon} boxSize={4} color={"white"} />
              </Center>
            </div>
          </HStack>
          <HStack width={"100%"}>
            <div style={{ width: "280px" }}>
              <Text
                color={colorMode === "dark" && "gray.300"}
                variant={"subheading"}
              >
                {t("reason")}
              </Text>
            </div>
            <div style={{ width: "100%" }}>
              <SearchableSelect
                id="select-reason"
                useBasicStyles
                chakraStyles={customChakraStyles}
                colorScheme="teal"
                options={allReasons.map((item) => {
                  return {
                    value: item.id,
                    label: `${t(item?.category)} ${item.service}`,
                  };
                })}
                {...reasonSelectProps}
              />
            </div>
          </HStack>

          {data.reason === "consultation" && (
            <>
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("type")}
                  </Text>
                </div>
                <Select
                  value={data.type}
                  onChange={(e) => {
                    setData((prevState) => {
                      const newState = { ...prevState };
                      newState.type = e.target.value;
                      return newState;
                    });
                  }}
                >
                  <option value={"inPerson"}>{t("inPerson")}</option>
                  <option value={"online"}>{t("online")}</option>
                </Select>
              </HStack>

              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("doctor")}
                  </Text>
                </div>
                <div style={{ width: "100%" }}>
                  <SearchableSelect
                    useBasicStyles
                    chakraStyles={customChakraStyles}
                    colorScheme="teal"
                    options={doctors.map((item) => {
                      return {
                        value: item.id,
                        label: item.firstname + " " + item.lastname,
                      };
                    })}
                    {...doctorSelectProps}
                  />
                </div>
              </HStack>
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("date")}
                  </Text>
                </div>

                <Box
                  display={"flex"}
                  width={"95%"}
                  height={10}
                  borderRadius={"0.375rem"}
                  outline={"2px solid transparent"}
                  border={"1px solid"}
                  borderColor={bdColor}
                  paddingInlineStart={"1rem"}
                  paddingInlineEnd={"1rem"}
                  alignItems={"center"}
                  _hover={{
                    borderColor: bdColor,
                  }}
                  _focusWithin={{
                    boxShadow: `0px 0px 3px 3px ${bdColor}`,
                    borderColor: bdColor,
                  }}
                  position={"relative"}
                >
                  <Calendar
                    className="custom-datepicker"
                    value={moment(data.date).toDate()}
                    onChange={(e) => {
                      setData((prevState) => {
                        const newState = { ...prevState };
                        newState.date = moment(e.value)
                          .startOf("day")
                          .valueOf();
                        return newState;
                      });
                      if (data.doctorID) {
                        fetchDoctorSchedule(
                          data.doctorID,
                          moment(new Date(e.value)).format("dddd").toLowerCase()
                        );
                      }
                    }}
                  />
                  <Icon as={CiCalendar} size={20} />
                </Box>
              </HStack>
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("time")}
                  </Text>
                </div>
                {timeLoading ? (
                  <Center width={"95%"}>
                    <Spinner />
                  </Center>
                ) : data.doctorID ? (
                  <Select
                    value={data.time}
                    onChange={(e) =>
                      setData((prevState) => {
                        const newState = { ...prevState };
                        newState.time = e.target.value;
                        return newState;
                      })
                    }
                  >
                    <option value={""}>{t("selectOne")}</option>
                    {timeList
                      .sort((a, b) => {
                        let timeA = new Date(`1970-01-01T${a}:00`);
                        let timeB = new Date(`1970-01-01T${b}:00`);
                        return timeA - timeB;
                      })
                      .map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                  </Select>
                ) : (
                  <Select
                    value={data.time}
                    onChange={(e) =>
                      setData((prevState) => {
                        const newState = { ...prevState };
                        newState.time = e.target.value;
                        return newState;
                      })
                    }
                  >
                    <option disabled value={""}>
                      {t("selectOne")}
                    </option>
                    <option value="00:00">00:00</option>
                    <option value="01:00">01:00</option>
                    <option value="02:00">02:00</option>
                    <option value="03:00">03:00</option>
                    <option value="04:00">04:00</option>
                    <option value="05:00">05:00</option>
                    <option value="06:00">06:00</option>
                    <option value="07:00">07:00</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                    <option value="23:00">23:00</option>
                  </Select>
                )}
              </HStack>
            </>
          )}

          {data.reason === "labTest" && (
            <>
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("labUser")}
                  </Text>
                </div>
                <div style={{ width: "100%" }}>
                  <SearchableSelect
                    id="select-labguys"
                    useBasicStyles
                    chakraStyles={customChakraStyles}
                    colorScheme="teal"
                    options={labUsers.map((item) => {
                      return {
                        value: item.id,
                        label: `${item.firstname} ${item.lastname} (${t(
                          item.speciality
                        )})`,
                      };
                    })}
                    {...LabSelectProps}
                  />
                </div>
              </HStack>

              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("date")}
                  </Text>
                </div>

                <Box
                  display={"flex"}
                  width={"95%"}
                  height={10}
                  borderRadius={"0.375rem"}
                  outline={"2px solid transparent"}
                  border={"1px solid"}
                  borderColor={bdColor}
                  paddingInlineStart={"1rem"}
                  paddingInlineEnd={"1rem"}
                  alignItems={"center"}
                  _hover={{
                    borderColor: bdColor,
                  }}
                  _focusWithin={{
                    boxShadow: `0px 0px 3px 3px ${bdColor}`,
                    borderColor: bdColor,
                  }}
                  position={"relative"}
                >
                  <Calendar
                    className="custom-datepicker"
                    value={moment(data.date).toDate()}
                    onChange={(e) => {
                      setData((prevState) => {
                        const newState = { ...prevState };
                        newState.date = moment(e.value)
                          .startOf("day")
                          .valueOf();
                        return newState;
                      });
                    }}
                  />
                  <Icon as={CiCalendar} size={20} />
                </Box>
              </HStack>
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("time")}
                  </Text>
                </div>

                <Select
                  value={data.time}
                  onChange={(e) =>
                    setData((prevState) => {
                      const newState = { ...prevState };
                      newState.time = e.target.value;
                      return newState;
                    })
                  }
                >
                  <option disabled value={""}>
                    {t("selectOne")}
                  </option>
                  <option value="00:00">00:00</option>
                  <option value="01:00">01:00</option>
                  <option value="02:00">02:00</option>
                  <option value="03:00">03:00</option>
                  <option value="04:00">04:00</option>
                  <option value="05:00">05:00</option>
                  <option value="06:00">06:00</option>
                  <option value="07:00">07:00</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                </Select>
              </HStack>
            </>
          )}

          {data.reason !== "consultation" && data.reason !== "labTest" && (
            <>
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("date")}
                  </Text>
                </div>

                <Box
                  display={"flex"}
                  width={"95%"}
                  height={10}
                  borderRadius={"0.375rem"}
                  outline={"2px solid transparent"}
                  border={"1px solid"}
                  borderColor={bdColor}
                  paddingInlineStart={"1rem"}
                  paddingInlineEnd={"1rem"}
                  alignItems={"center"}
                  _hover={{
                    borderColor: bdColor,
                  }}
                  _focusWithin={{
                    boxShadow: `0px 0px 3px 3px ${bdColor}`,
                    borderColor: bdColor,
                  }}
                  position={"relative"}
                >
                  <Calendar
                    className="custom-datepicker"
                    value={moment(data.date).toDate()}
                    onChange={(e) => {
                      setData((prevState) => {
                        const newState = { ...prevState };
                        newState.date = moment(e.value)
                          .startOf("day")
                          .valueOf();
                        return newState;
                      });
                    }}
                  />
                  <Icon as={CiCalendar} size={20} />
                </Box>
              </HStack>
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("time")}
                  </Text>
                </div>

                <Select
                  value={data.time}
                  onChange={(e) =>
                    setData((prevState) => {
                      const newState = { ...prevState };
                      newState.time = e.target.value;
                      return newState;
                    })
                  }
                >
                  <option disabled value={""}>
                    {t("selectOne")}
                  </option>
                  <option value="00:00">00:00</option>
                  <option value="01:00">01:00</option>
                  <option value="02:00">02:00</option>
                  <option value="03:00">03:00</option>
                  <option value="04:00">04:00</option>
                  <option value="05:00">05:00</option>
                  <option value="06:00">06:00</option>
                  <option value="07:00">07:00</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                  <option value="22:00">22:00</option>
                  <option value="23:00">23:00</option>
                </Select>
              </HStack>
            </>
          )}

          {selectedPatient && (
            <>
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("invoiced")}
                  </Text>
                </div>

                <Input
                  value={data.invoiced}
                  onChange={(e) => {
                    setInvoiced(e.target.value);
                  }}
                />
              </HStack>
              <VStack gap={0} align={"flex-start"}>
                {data.insuranceamount &&
                  selectedPatient.insurances.length > 0 &&
                  selectedPatient.insurances.map((item, index) => {
                    const eachInsurance = JSON.parse(item);
                    return (
                      <Text key={index} variant={"subheading"}>{`${index + 1}- ${
                        eachInsurance.insurancenumber
                      } (${eachInsurance.insuranceprovider}): ${
                        eachInsurance.insurancepercentage
                      }%`}</Text>
                    );
                  })}
              </VStack>
              <HStack width={"100%"} justify={"flex-end"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("paidByPatient")}
                  </Text>
                </div>

                <Input
                  style={{ borderColor: "#FF7F7F" }}
                  isDisabled
                  value={data.patientamount}
                  onChange={(e) => {}}
                />
              </HStack>

              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("insuranceCovered")}
                  </Text>
                </div>
                <Input
                  style={{ borderColor: "#90EE90" }}
                  isDisabled
                  value={data.insuranceamount}
                  onChange={(e) => {}}
                />
              </HStack>
            </>
          )}
        </VStack>
      </Flex>
      <AddPatientDialog
        loading={loading}
        allInsurances={allInsurances}
        onClose={onClose}
        isOpen={isOpen}
        onSave={(patientForm) => {
          setLoading(true);
          handleSavePatient(patientForm);
        }}
      />
    </Sidebar>
  );
}

"use client";
import Sidebar from "@/components/sidebar";
import GetLinkItems from "@/utils/SidebarItems";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "@/store/context/UserContext";
import axios from "@/lib/axiosInstance";
import AppointmentDetailPopup from "@/components/appointments/appointmentdetailpopup/index";
import { useTranslations } from "next-intl";
import {
  Box,
  Flex,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  HStack,
  Text,
  Center,
  Icon,
  VStack,
  Select,
  Wrap,
  WrapItem,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import moment from "moment";
import Button, { GhostButton } from "@/components/ui/Button";
import { theme } from "@/data/data";
import StatusBox from "@/components/ui/StatusBox";
import { Calendar } from "primereact/calendar";
import { CiCalendar } from "react-icons/ci";
import {
  ClusterBar,
  ClusterColumn,
  PieChart,
} from "@/components/charts/Charts";
import { GiSandsOfTime } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";

export default function Page() {
  const {colorMode} = useColorMode()
  const { state: UserState } = useContext(UserContext);
  const t = useTranslations("Dictionary");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState();
  const [allAppointmentData, setAllAppointmentData] = useState([])
  const bgColor = useColorModeValue('white', 'gray.800')
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
  const colorTxt1 = useColorModeValue("#475467", 'gray.300')
  const colorTxt2 = useColorModeValue("#101828", "gray.300") 

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    axios.get(`/api/newroutes/healthcare/${id}/admin/medicalstaff`).then((response) => {
      if (response.data.length > 0) {
        const filter = response.data.filter((item) => item.role == "doctor");
        setAllDoctors([...filter]);
      }
    });
  
  }

  function getYearFromTimestamp(timestamp) {
    return new Date(timestamp).getFullYear();
  }

  function getYearMonthFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  }

  function getYearMonthDayFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Check if all appointments are in the same year
  function allInSameYear(appointments) {
    const firstYear = getYearFromTimestamp(
      Number(appointments[0].appointmentdate)
    );
    return appointments.every(
      (appointment) =>
        getYearFromTimestamp(Number(appointment.appointmentdate)) === firstYear
    );
  }

  // Group appointments by year, month, or day
  function groupAppointments(appointments) {
    const groups = {};
    let groupingType = "";

    const years = new Set(
      appointments.map((appointment) =>
        getYearFromTimestamp(Number(appointment.appointmentdate))
      )
    );

    if (years.size > 1) {
      // Group by year
      groupingType = "years";
      appointments.forEach((appointment) => {
        const year = getYearFromTimestamp(Number(appointment.appointmentdate));

        if (!groups[year]) {
          groups[year] = {
            patientSet: new Set(),
            totalPatientsConsultation: 0,
            totalPatientsResultAnalysis: 0,
          };
        }
        groups[year].patientSet.add(appointment.patient_id);

        // Count reasons
        if (appointment.reason === "consultation") {
          groups[year].totalPatientsConsultation++;
        } else if (appointment.reason === "resultAnalysis") {
          groups[year].totalPatientsResultAnalysis++;
        }
      });
    } else if (allInSameYear(appointments)) {
      const months = new Set(
        appointments.map((appointment) =>
          getYearMonthFromTimestamp(Number(appointment.appointmentdate))
        )
      );

      if (months.size > 1) {
        // Group by month
        groupingType = "months";
        appointments.forEach((appointment) => {
          const month = getYearMonthFromTimestamp(
            Number(appointment.appointmentdate)
          );

          if (!groups[month]) {
            groups[month] = {
              patientSet: new Set(),
              totalPatientsConsultation: 0,
              totalPatientsResultAnalysis: 0,
            };
          }
          groups[month].patientSet.add(appointment.patient_id);

          // Count reasons
          if (appointment.reason === "consultation") {
            groups[month].totalPatientsConsultation++;
          } else if (appointment.reason === "resultAnalysis") {
            groups[month].totalPatientsResultAnalysis++;
          }
        });
      } else {
        // Group by date (each day of the month)
        groupingType = "dates";
        appointments.forEach((appointment) => {
          const day = getYearMonthDayFromTimestamp(
            Number(appointment.appointmentdate)
          );

          if (!groups[day]) {
            groups[day] = {
              patientSet: new Set(),
              totalPatientsConsultation: 0,
              totalPatientsResultAnalysis: 0,
            };
          }
          groups[day].patientSet.add(appointment.patient_id);

          // Count reasons
          if (appointment.reason === "consultation") {
            groups[day].totalPatientsConsultation++;
          } else if (appointment.reason === "resultAnalysis") {
            groups[day].totalPatientsResultAnalysis++;
          }
        });
      }
    }

    // Convert the sets to readable data
    return Object.entries(groups).map(([key, value]) => ({
      key:
        groupingType == "years"
          ? moment(new Date(key)).format("YYYY")
          : groupingType == "months"
          ? moment(new Date(key)).format("MMM YYYY")
          : moment(new Date(key)).format("DD-MM-YYYY"), // Either year, month, or date
      totalPatients: value.patientSet.size, // Unique patient count
      totalPatientsConsultation: value.totalPatientsConsultation,
      totalPatientsResultAnalysis: value.totalPatientsResultAnalysis,
      type: groupingType,
    }));
  }

  function groupAppointmentsByType(appointments) {
    const groups = {};
    let groupingType = "";

    const years = new Set(
      appointments.map((appointment) =>
        getYearFromTimestamp(Number(appointment.appointmentdate))
      )
    );

    if (years.size > 1) {
      // Group by year
      groupingType = "years";
      appointments.forEach((appointment) => {
        const year = getYearFromTimestamp(Number(appointment.appointmentdate));

        if (!groups[year]) {
          groups[year] = {
            online: new Set(),
            inPerson: new Set(),
          };
        }

        // Add patient_id to respective type
        if (appointment.type === "online") {
          groups[year].online.add(appointment.patient_id);
        } else if (appointment.type === "inPerson") {
          groups[year].inPerson.add(appointment.patient_id);
        }
      });
    } else if (allInSameYear(appointments)) {
      const months = new Set(
        appointments.map((appointment) =>
          getYearMonthFromTimestamp(Number(appointment.appointmentdate))
        )
      );

      if (months.size > 1) {
        // Group by month
        groupingType = "months";
        appointments.forEach((appointment) => {
          const month = getYearMonthFromTimestamp(
            Number(appointment.appointmentdate)
          );

          if (!groups[month]) {
            groups[month] = {
              online: new Set(),
              inPerson: new Set(),
            };
          }

          // Add patient_id to respective type
          if (appointment.type === "online") {
            groups[month].online.add(appointment.patient_id);
          } else if (appointment.type === "inPerson") {
            groups[month].inPerson.add(appointment.patient_id);
          }
        });
      } else {
        // Group by date (each day of the month)
        groupingType = "dates";
        appointments.forEach((appointment) => {
          const day = getYearMonthDayFromTimestamp(
            Number(appointment.appointmentdate)
          );

          if (!groups[day]) {
            groups[day] = {
              online: new Set(),
              inPerson: new Set(),
            };
          }

          // Add patient_id to respective type
          if (appointment.type === "online") {
            groups[day].online.add(appointment.patient_id);
          } else if (appointment.type === "inPerson") {
            groups[day].inPerson.add(appointment.patient_id);
          }
        });
      }
    }

    // Convert the sets to readable data
    return Object.entries(groups).map(([key, value]) => ({
      key:
        groupingType == "years"
          ? moment(new Date(key)).format("YYYY")
          : groupingType == "months"
          ? moment(new Date(key)).format("MMM YYYY")
          : moment(new Date(key)).format("DD-MM-YYYY"), // Either year, month, or date
      totalPatientsOnline: value.online.size, // Unique online patient count
      totalPatientsInPerson: value.inPerson.size, // Unique inPerson patient count
      type: groupingType,
    }));
  }

  async function handleFilterResults() {
    axios.get(`/api/newroutes/healthcare/${UserState.value.data.centerid}/doctor/${selectedDoctor}/appointment`).then((response) => {
      if (response.data.length > 0) {
        setAllAppointmentData(response.data);
      }
    });

    axios
      .get(`/api/newroutes/healthcare/${UserState.value.data.centerid}/doctor/${selectedDoctor}/statistics?startdate=${startDate.getTime()}&enddate=${endDate.getTime()}`)
      .then((response) => {
        setLoading(false);

        setAppointmentData(response.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  const RenderPieChart = useCallback(() => {
    return (
      <PieChart
        id={"piechart-0"}
        data={[
          {
            category: t("consultation"),
            value: appointmentData.filter(
              (item) => item.reason === "consultation"
            ).length,
          },
          {
            category: t("resultAnalysis"),
            value: appointmentData.filter(
              (item) => item.reason === "resultAnalysis"
            ).length,
          },
        ]}
      />
    );
  }, [appointmentData]);

  const RenderClusterColumn = useCallback(() => {
    return (
      <ClusterColumn
        id={"clustercolumn-0"}
        data={
          appointmentData.length > 0
            ? groupAppointments(appointmentData).map((item) => {
                return {
                  year: item.key,
                  Consultation: item.totalPatientsConsultation,
                  "Analyse des résultats": item.totalPatientsResultAnalysis,
                };
              })
            : []
        }
        label={["Consultation", "Analyse des résultats"]}
      />
    );
  }, [appointmentData]);

  const RenderClusterColumnType = useCallback(() => {
    return (
      <ClusterBar
        id={"clusterbar-0"}
        data={
          appointmentData.length > 0
            ? groupAppointmentsByType(appointmentData).map((item) => {
                return {
                  year: item.key,
                  "En ligne": item.totalPatientsOnline,
                  "En personne": item.totalPatientsInPerson,
                };
              })
            : []
        }
        label={["En ligne", "En personne"]}
      />
    );
  }, [appointmentData]);

  const RenderEachRow = ({ item, index }) => {
    return (
      <Tr
        backgroundColor={index % 2 == 0 ? colorMode == 'light' ? "#F9FAFB" : 'gray.700' : colorMode == 'light' ? "white" : 'transparent'}
        onClick={() => {
          setSelectedAppointment(item);
          if (item.medicalRecords.length > 0) {
            setMedicalRecordData(item.medicalRecords);
            let temp = [];
            item.medicalRecords.map((eachRecord) => {
              let temp1 = [];
              eachRecord.prescription.map((each) => {
                temp1.push(JSON.parse(each));
              });
              temp.push({
                diagnosis: eachRecord.diagnosis,
                prescription: [...temp1],
              });
            });
            setPrescriptionData([...temp]);
          }
        }}
      >
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {moment(new Date(Number(item?.appointmentdate))).format(
            "DD MMM YYYY"
          )}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {moment(new Date(Number(item?.appointmentdate))).format("hh:mm A")}
        </Td>
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.patient_firstname + " " + item?.patient_lastname}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            PT{item.patient_id}
          </div>
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.patient_number}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {/* {item?.type} */}
          {item?.type ? t(item?.type) : t("inPerson")}
        </Td>
        <Td>
          <StatusBox item={item?.status} />
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.reason ? t(item?.reason) : ""}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"blue"}>
          {item?.invoiced}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"red"}>
          {item?.patientamount}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={"green"}>
          {item?.insuranceamount}
        </Td>
      </Tr>
    );
  };

  const linkItems = GetLinkItems("admin");
  return (
    <Sidebar LinkItems={linkItems} settingsLink={"/admin/settings"}>
      <Flex
        flex={1}
        gap={"20px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >

        <div>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading"> {t("statistics")}</Text>
        </div>
        <Wrap align={"flex-end"}>
          <WrapItem>
            <VStack align={"flex-start"} gap={0}>
              <div>
                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>{t("doctor")}</Text>
              </div>
              <Select minW={'300px'}
              bg={bgColor}
              borderColor={bdColor}
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value={""}>{t("selectOne")}</option>
                {allDoctors.length > 0 &&
                  allDoctors.map((item, index) => (
                    <option
                      key={index}
                      value={item.id}
                    >{`${item.firstname} ${item.lastname}`}</option>
                  ))}
              </Select>
            </VStack>
          </WrapItem>
          <WrapItem>
            <VStack align={"flex-start"} gap={0}>
              <div>
                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>{t("startDate")}</Text>
              </div>
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
                  dateFormat="dd/mm/yy"
                  className="custom-datepicker"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.value);
                  }}
                />

                <Icon as={CiCalendar} size={20} />
              </Box>
            </VStack>
          </WrapItem>
          <WrapItem>
            <VStack align={"flex-start"} gap={0}>
              <div>
                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>{t("endDate")}</Text>
              </div>
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
                  dateFormat="dd/mm/yy"
                  className="custom-datepicker"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.value);
                  }}
                />

                <Icon as={CiCalendar} size={20} />
              </Box>
            </VStack>
          </WrapItem>
          <WrapItem>
            <Button
              isDisabled={!selectedDoctor}
              width="100px"
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                handleFilterResults();
              }}
            >
              Filter
            </Button>
          </WrapItem>
        </Wrap>

        <VStack w={"100%"}>
          <Flex justify={"center"}>
            <Text color={colorMode === 'dark' && 'gray.300'}variant={"heading"} fontSize={"20px"}>
              {t("consultationVsResult")}
            </Text>
          </Flex>
          <RenderPieChart />
          <RenderClusterColumn />
          <Flex justify={"center"}>
            <Text color={colorMode === 'dark' && 'gray.300'}variant={"heading"} fontSize={"20px"}>
              {t("onlineVsInperson")}
            </Text>
          </Flex>
          <RenderClusterColumnType />
        </VStack>

        <div>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading"> {t("dashboard")}</Text>
        </div>
<Box
          width={"100%"}
          border={"1px solid"}
          borderColor={bdColor}
          borderRadius={5}
        >
          <Center w={"100%"} p={"15px"}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"20px"}>
                {`${t("today")} ${t("inQueue")}`}
              </Text>
              <Icon as={GiSandsOfTime} boxSize={4} color={"orange"} ml={2} />
            </div>
          </Center>
          <Box width={"100%"}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {[
                      t("date"),
                      t("time"),
                      t("patient"),
                      t("phoneNumber"),
                      t("type"),
                      t("status"),
                      // t("action"),
                      t("reason"),
                      t("invoiced"),
                      t("paidByPatient"),
                      t("insuranceCovered"),
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
                  </Tr>
                </Thead>
                <Tbody>
                  {allAppointmentData.length > 0 &&
                    allAppointmentData
                      .sort(
                        (a, b) =>
                          Number(a.appointmentdate) - Number(b.appointmentdate)
                      )
                      .filter((item) => item.status === "waiting")
                      .filter(
                        (item) =>
                          moment(new Date(Number(item.appointmentdate))).format(
                            "DD/MM/YYYY"
                          ) === moment().format("DD/MM/YYYY")
                      )
                      .map((item, index) => (
                        <RenderEachRow key={index} item={item} index={index} />
                      ))}
                </Tbody>
              </Table>
            </TableContainer>
            {appointmentData.length > 0 &&
              appointmentData .filter((item) => item.status === "waiting")
              .filter(
                (item) =>
                  moment(new Date(Number(item.appointmentdate))).format(
                    "DD/MM/YYYY"
                  ) === moment().format("DD/MM/YYYY")
              ).length > 10 && (
                <HStack justifyContent={"space-between"} p={5}>
                  <div>
                    <GhostButton
                    >
                      {t("previous")}
                    </GhostButton>
                  </div>
                  <div>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
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
              )}
          </Box>

          <Center w={"100%"} p={"15px"}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"20px"}>
              {`${t("today")} ${t("completed")}`}
              </Text>
              <Icon as={FaCheckCircle} boxSize={4} color={"green"} ml={2} />
            </div>
          </Center>
          <Box width={"100%"}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {[
                      t("date"),
                      t("time"),
                      t("patient"),
                      t("phoneNumber"),
                      t("type"),
                      t("status"),
                      // t("action"),
                      t("reason"),
                      t("invoiced"),
                      t("paidByPatient"),
                      t("insuranceCovered"),
                     
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
                  </Tr>
                </Thead>
                <Tbody>
                  {allAppointmentData.length > 0 &&
                    allAppointmentData
                      .sort(
                        (a, b) =>
                          Number(a.appointmentdate) - Number(b.appointmentdate)
                      )
                      .filter((item) => item.status === "completed")
                      .filter(
                        (item) =>
                          moment(new Date(Number(item.appointmentdate))).format(
                            "DD/MM/YYYY"
                          ) === moment().format("DD/MM/YYYY")
                      )
                      .map((item, index) => (
                        <RenderEachRow key={index} item={item} index={index} />
                      ))}
                </Tbody>
              </Table>
            </TableContainer>
            {allAppointmentData.length > 0 &&
              allAppointmentData .filter((item) => item.status === "completed")
              .filter(
                (item) =>
                  moment(new Date(Number(item.appointmentdate))).format(
                    "DD/MM/YYYY"
                  ) === moment().format("DD/MM/YYYY")
              ).length > 10 && (
                <HStack justifyContent={"space-between"} p={5}>
                  <div>
                    <GhostButton
                    
                    >
                      {t("previous")}
                    </GhostButton>
                  </div>
                  <div>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
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
              )}
          </Box>
        </Box>

        <Box
          width={"100%"}
          border={"1px solid"}
          borderColor={bdColor}
          borderRadius={5}
        >
          <Center w={"100%"} p={"15px"}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"20px"}>
                {t("all")}
              </Text>
            </div>
          </Center>
          <Box width={"100%"}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {[
                      t("date"),
                      t("time"),
                      t("patient"),
                      t("phoneNumber"),
                      t("type"),
                      t("status"),
                      // t("action"),
                      t("reason"),
                      t("invoiced"),
                      t("paidByPatient"),
                      t("insuranceCovered"),
                     
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
                  </Tr>
                </Thead>
                <Tbody>
                  {allAppointmentData.length > 0 &&
                    allAppointmentData
                      .sort(
                        (a, b) =>
                          Number(a.appointmentdate) - Number(b.appointmentdate)
                      )
                      .map((item, index) => (
                        <RenderEachRow key={index} item={item} index={index} />
                      ))}
                </Tbody>
              </Table>
            </TableContainer>
            {allAppointmentData.length > 0 && allAppointmentData.length > 10 && (
              <HStack justifyContent={"space-between"} p={5}>
              <div>
                <GhostButton
                
                >
                  {t("previous")}
                </GhostButton>
              </div>
              <div>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
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
            )}
          </Box>
        </Box>
      </Flex>
    </Sidebar>
  );
}

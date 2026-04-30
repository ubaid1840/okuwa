"use client";
import Sidebar from "@/components/sidebar";
import GetLinkItems from "@/utils/SidebarItems";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "@/store/context/UserContext";
import axios from "@/lib/axiosInstance";
import { useTranslations } from "next-intl";
import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  Wrap,
  WrapItem,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import moment from "moment";
import Button from "@/components/ui/Button";
import { theme } from "@/data/data";
import { CiCalendar } from "react-icons/ci";
import {
  ClusterBar,
  ClusterColumn,
  PieChart,
} from "@/components/charts/Charts";
import Calendar from "@/components/ui/Calendar";

export default function Page() {
  const { state: UserState } = useContext(UserContext);
  const t = useTranslations("Dictionary");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.700");
  const { colorMode } = useColorMode();

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
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    axios
      .post("/api/doctor/statistics", {
        id: UserState.value.data.id,
        startdate: startOfDay.getTime(),
        enddate: endOfDay.getTime(),
      })
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

  const doctorLinks = GetLinkItems("doctor");
  return (
    <Sidebar LinkItems={doctorLinks}>
      <Flex
        flex={1}
        gap={"20px"}
        p={"32px"}
        flexDir="column"
        overflowX={"auto"}
      >
        <div>
          <Text color={colorMode === "dark" && "gray.300"} variant="heading">
            {" "}
            {t("statistics")}
          </Text>
        </div>
        <Wrap align={"flex-end"}>
          <WrapItem>
            <VStack align={"flex-start"} gap={0}>
              <div>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"subheading"}
                >
                  {t("startDate")}
                </Text>
              </div>

              <Calendar
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.value);
                }}
              />
            </VStack>
          </WrapItem>
          <WrapItem>
            <VStack align={"flex-start"} gap={0}>
              <div>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"subheading"}
                >
                  {t("endDate")}
                </Text>
              </div>

              <Calendar
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.value);
                }}
              />
            </VStack>
          </WrapItem>
          <WrapItem>
            <Button
              isDisabled={!UserState.value.data?.id}
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
            <Text
              color={colorMode === "dark" && "gray.300"}
              variant={"heading"}
              fontSize={"20px"}
            >
              {t("consultationVsResult")}
            </Text>
          </Flex>
          <RenderPieChart />
          <RenderClusterColumn />
          <RenderClusterColumnType />
        </VStack>

        <div style={{ width: "100%", height: "100%", padding: "10px" }}></div>
      </Flex>
    </Sidebar>
  );
}

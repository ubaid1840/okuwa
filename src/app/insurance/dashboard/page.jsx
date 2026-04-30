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
  SimpleGrid,
  Card,
  Heading,
  Divider,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import Button from "@/components/ui/Button";
import { theme } from "@/data/data";
import { Calendar } from "primereact/calendar";
import { CiCalendar } from "react-icons/ci";
import { ClusterColumn, LineChart, PieChart } from "@/components/charts/Charts";
import GeneralMetrics from "@/components/ui/GeneralMetric";
import TopInsights from "@/components/ui/TopInsights";
import PatientDemographics from "@/components/ui/PatientDemographics";
import exportToExcel from "@/utils/exportToExcel";

export default function Page() {
  const t = useTranslations("Dictionary");
  const { state: UserState } = useContext(UserContext);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [allCenters, setAllCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState();
  const [dataOther, setDataOther] = useState();
  const [topMedical, setTopMedical] = useState([]);
  const [exportData, setExportData] = useState([]);
  const {colorMode} = useColorMode()
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

  useEffect(() => {
    if (UserState.value.data?.insuranceid) {
      fetchData(UserState.value.data?.insuranceid);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    axios
      .post("/api/insurance/center", { insurance_id: id })
      .then((response) => {
        setAllCenters(response.data);
      });
  }

  function analyzeAppointments(appointments) {
    let totalConsultations = appointments.length;
    let totalCost = 0;
    let totalPatientContribution = 0;
    let totalInsuranceContribution = 0;
    let doctors = {};
    let services = {};
    let totalDuration = 0;
    let totalDurationsCount = 0;
    let ages = [];

    appointments.forEach((appointment) => {
      // General metrics
      const patientShare = parseFloat(appointment.patientamount);
      const insuranceShare = parseFloat(appointment.insuranceamount);
      const totalInvoice = parseFloat(appointment.invoiced);

      totalCost += totalInvoice;
      totalPatientContribution += patientShare;
      totalInsuranceContribution += insuranceShare;

      // Top Insights - Count doctors and services
      if (appointment.doctor_firstname) {
        const doctorName = `${appointment.doctor_firstname} ${appointment.doctor_lastname}`;
        doctors[doctorName] = (doctors[doctorName] || 0) + 1;
      }

      services[appointment.service] = (services[appointment.service] || 0) + 1;

      // Calculate consultation duration (if starttime and endtime exist)
      if (appointment.starttime && appointment.endtime) {
        const duration =
          (Number(appointment.endtime) - Number(appointment.starttime)) / 60000; // Convert milliseconds to minutes
        totalDuration += duration;
        totalDurationsCount++;
      }

      // Patient demographics - Calculate age
      if (appointment.patient_dob) {
        const dob = new Date(parseInt(appointment.patient_dob));
        const age = new Date().getFullYear() - dob.getFullYear();
        ages.push(age);
      }
    });

    // Calculate top doctor and service
    const mostFrequentDoctor = Object.keys(doctors).reduce((a, b) =>
      doctors[a] > doctors[b] ? a : b
    );
    const mostCommonService = Object.keys(services).reduce((a, b) =>
      services[a] > services[b] ? a : b
    );

    // Average calculations
    const avgCostPerConsultation = totalCost / totalConsultations;
    const avgPatientShare = totalPatientContribution / totalConsultations;
    const avgInsuranceShare = totalInsuranceContribution / totalConsultations;
    const avgConsultationDuration =
      totalDurationsCount > 0 ? totalDuration / totalDurationsCount : null;

    // Age calculations
    const averageAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    const sortedAges = ages.sort((a, b) => a - b);
    const medianAge =
      sortedAges.length % 2 === 0
        ? (sortedAges[sortedAges.length / 2 - 1] +
            sortedAges[sortedAges.length / 2]) /
          2
        : sortedAges[Math.floor(sortedAges.length / 2)];

    return {
      generalMetrics: {
        totalConsultations,
        avgCostPerConsultation,
        avgPatientShare,
        avgInsuranceShare,
        totalRevenueGenerated: totalCost,
        totalInsuranceContribution,
        totalPatientContribution,
      },
      topInsights: {
        mostFrequentDoctor,
        mostCommonService,
        avgConsultationDuration,
      },
      patientDemographics: {
        averageAge,
        ageRange: { min: minAge, max: maxAge },
        medianAge,
      },
    };
  }

  function analyzeAppointmentsOther(appointments) {
    let analysis = {
      consultationPatterns: {
        topMedicalActs: [],
      },
      revenueInsights: {
        totalPatientContribution: 0,
        totalInsuranceContribution: 0,
        totalRevenueGenerated: 0,
        patientSharePercentage: 0,
        insuranceSharePercentage: 0,
      },
      doctorPerformance: {
        mostActiveDoctors: [],
      },
      consultationTimingAndDuration: {
        averageDuration: 0,
      },
      patientDemographics: {
        averageAge: 0,
        ageRange: { min: 0, max: 0 },
        medianAge: 0,
      },
      consultationVolumePerDay: {
        peakHours: [],
      },
      financialDistribution: {
        varianceInCosts: [],
      },
    };

    // Helper functions
    const calculateAverage = (arr) =>
      arr.reduce((a, b) => a + b, 0) / arr.length || 0;
    const calculateMedian = (arr) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    // 1. Consultation Patterns
    const serviceCount = {};
    appointments.forEach((appointment) => {
      const service = appointment?.service || "Unknown";
      serviceCount[service] = (serviceCount[service] || 0) + 1;
    });
    analysis.consultationPatterns.topMedicalActs = Object.entries(serviceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([service, count]) => ({ service, count }));

    // 2. Revenue Insights
    appointments.forEach((appointment) => {
      const patientShare = parseFloat(appointment.patientamount) || 0;
      const insuranceShare = parseFloat(appointment.insuranceamount) || 0;
      const totalCost = patientShare + insuranceShare;
      const invoiced = parseFloat(appointment.invoiced) || 0;
      analysis.revenueInsights.totalPatientContribution += patientShare;
      analysis.revenueInsights.totalInsuranceContribution += insuranceShare;
      analysis.revenueInsights.totalRevenueGenerated += invoiced;
    });
    analysis.revenueInsights.patientSharePercentage = (
      (analysis.revenueInsights.totalPatientContribution /
        analysis.revenueInsights.totalRevenueGenerated) *
      100
    ).toFixed(1);
    analysis.revenueInsights.insuranceSharePercentage = (
      (analysis.revenueInsights.totalInsuranceContribution /
        analysis.revenueInsights.totalRevenueGenerated) *
      100
    ).toFixed(1);

    // 3. Doctor Performance
    const doctorCount = {};
    appointments.forEach((appointment) => {
      const doctorName = `${appointment.doctor_firstname || ""} ${
        appointment.doctor_lastname || ""
      }`;
      doctorCount[doctorName] = (doctorCount[doctorName] || 0) + 1;
    });
    analysis.doctorPerformance.mostActiveDoctors = Object.entries(doctorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // Top 5 for broader insights
      .map(([doctor, count]) => ({ doctor, count }));

    // 4. Consultation Timing and Duration
    let totalDuration = 0;
    let durationCount = 0;
    appointments.forEach((appointment) => {
      if (appointment.starttime && appointment.endtime) {
        const duration =
          (parseInt(appointment.endtime) - parseInt(appointment.starttime)) /
          60000; // minutes
        if (duration > 0) {
          // Valid duration
          totalDuration += duration;
          durationCount++;
        }
      }
    });
    analysis.consultationTimingAndDuration.averageDuration = (
      totalDuration / durationCount
    ).toFixed(2);

    // 5. Patient Demographics
    const ages = appointments
      .map((appointment) => {
        if (appointment.patient_dob) {
          const dob = new Date(parseInt(appointment.patient_dob));
          const ageDifMs = Date.now() - dob.getTime();
          const ageDate = new Date(ageDifMs);
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
        return null;
      })
      .filter((age) => age !== null);

    if (ages.length > 0) {
      analysis.patientDemographics.averageAge = parseFloat(
        calculateAverage(ages).toFixed(2)
      );
      analysis.patientDemographics.ageRange.min = Math.min(...ages);
      analysis.patientDemographics.ageRange.max = Math.max(...ages);
      analysis.patientDemographics.medianAge = calculateMedian(ages);
    }

    // 6. Consultation Volume per Day
    const consultationByHour = {};
    appointments.forEach((appointment) => {
      if (appointment.appointmentdate) {
        const date = new Date(parseInt(appointment.appointmentdate));
        const hour = date.getHours();
        consultationByHour[hour] = (consultationByHour[hour] || 0) + 1;
      }
    });
    const sortedConsultationsByHour = Object.entries(consultationByHour).sort(
      (a, b) => b[1] - a[1]
    );
    analysis.consultationVolumePerDay.peakHours = sortedConsultationsByHour
      .slice(0, 3)
      .map(([hour, count]) => ({ hour, count }));

    // 7. Financial Distribution
    const costVariance = {};
    appointments.forEach((appointment) => {
      const service = appointment?.service || "Unknown";
      const cost = parseFloat(appointment.invoiced) || 0;
      costVariance[service] = (costVariance[service] || 0) + cost;
    });
    analysis.financialDistribution.varianceInCosts = Object.entries(
      costVariance
    )
      .sort((a, b) => b[1] - a[1])
      .map(([service, totalCost]) => ({ service, totalCost }));

    return analysis;
  }

  function deriveTopMedicalActs(appointments) {
    const servicesSummary = appointments.reduce((acc, appointment) => {
      const { service, invoiced, patientamount, insuranceamount } = appointment;

      if (!acc[service]) {
        acc[service] = {
          totalConsultations: 0,
          totalCost: 0,
          patientShare: 0,
          insuranceShare: 0,
          totalRevenue: 0,
        };
      }

      acc[service].totalConsultations += 1;
      acc[service].totalCost += parseFloat(invoiced);
      acc[service].patientShare += parseFloat(patientamount);
      acc[service].insuranceShare += parseFloat(insuranceamount);
      acc[service].totalRevenue += parseFloat(invoiced);

      return acc;
    }, {});

    // Transform the servicesSummary into an array for sorting
    const servicesArray = Object.keys(servicesSummary).map((service) => {
      const data = servicesSummary[service];
      return {
        service,
        totalConsultations: data.totalConsultations,
        averageTotalCost: (data.totalCost / data.totalConsultations).toFixed(2),
        averagePatientShare: (
          data.patientShare / data.totalConsultations
        ).toFixed(2),
        averageInsuranceShare: (
          data.insuranceShare / data.totalConsultations
        ).toFixed(2),
        totalRevenue: data.totalRevenue.toFixed(2),
      };
    });

    // Sort by total consultations to get the top 5 services
    const top5Services = servicesArray
      .sort((a, b) => b.totalConsultations - a.totalConsultations)
      .slice(0, 5);

    // Return the result
    return top5Services;
  }

  async function handleFilterResults() {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    axios
      .post("/api/insurance/dashboard", {
        id: selectedCenter,
        startdate: startOfDay.getTime(),
        enddate: endOfDay.getTime(),
      })
      .then((response) => {
        const myData = [...response.data];

        setLoading(false);
        const analysis = analyzeAppointments(myData);
        const analysisOther = analyzeAppointmentsOther(myData);
        const topMed = deriveTopMedicalActs(myData);

        const temp = response.data?.map((item) => {
          return {
            [t("date")]: moment(new Date(Number(item.appointmentdate))).format(
              "DD/MM/YYYY"
            ),
            [t("time")]: moment(new Date(Number(item.appointmentdate))).format(
              "hh:mm A"
            ),
            [t("startTime")]: item?.starttime
              ? moment(new Date(Number(item.starttime))).format("hh:mm A")
              : "",
            [t("endTime")]: item?.endtime
              ? moment(new Date(Number(item.endtime))).format("hh:mm A")
              : "",
            [t("patient")]: `${item.patient_firstname || ""} ${
              item.patient_lastname || ""
            }`,
            [t("dob")]: item?.patient_dob
              ? moment(new Date(Number(item.dob))).format("DD/MM/YYYY")
              : "",
            [t("address")]: item?.patient_address,
            [t("phoneNumber")]: item?.patient_number,
            [t("insurance")]: item?.patient_insurances.length > 0 ? JSON.parse(item.patient_insurances[0]).insuranceprovider : "",
            [t("reason")]: `${t(item.reason)} ${item?.service || ""}`,
            [t("doctor")]: `${item.doctor_firstname || ""} ${
              item.doctor_lastname || ""
            }`,
            [t("invoiced")]: Number(item?.invoiced),
            [t("paidByPatient")]: Number(item?.patientamount),
            [t("insuranceCovered")]: Number(item?.insuranceamount),
            [t("createdBy")]: item?.creator_firstname
              ? `${item?.creator_firstname} ${item?.creator_lastname}`
              : "Admin",
          };
        });
        setExportData([...temp]);
        setData(analysis);
        setDataOther(analysisOther);

        setTopMedical(topMed);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function handleExport() {
    exportToExcel(exportData, moment().format("DD/MM/YYYY"));
  }

  const linkItems = GetLinkItems("insurance");
  return (
    <Sidebar LinkItems={linkItems}>
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
                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>{t("healthcareCenter")}</Text>
              </div>
              <Select
                width={"200px"}
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
              >
                <option value={""}>{t("selectOne")}</option>
                {allCenters.length > 0 &&
                  allCenters.map((item, index) => (
                    <option
                      key={index}
                      value={item?.centerDetails?.id}
                    >{`${item?.centerDetails?.centername}`}</option>
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
              isDisabled={!selectedCenter}
              width="100px"
              isLoading={loading}
              onClick={() => {
                setData();
                setDataOther();
                setTopMedical([]);
                setExportData([]);
                setLoading(true);
                handleFilterResults();
              }}
            >
              {t("filter")}
            </Button>
          </WrapItem>
          {exportData.length > 0 && (
            <WrapItem>
              <Button onClick={() => handleExport()}>{t("export")}</Button>
            </WrapItem>
          )}
        </Wrap>
        {data && (
          <Box p={5}>
            <Heading size="md" mb={4}>
              {t("generalMetrics")}
            </Heading>
            <GeneralMetrics metrics={data.generalMetrics} />

            <Divider my={8} />

            <Heading size="md" mb={4}>
              {t("topInsights")}
            </Heading>
            <TopInsights insights={data.topInsights} />

            <Divider my={8} />

            <Heading size="md" mb={4}>
              {t("patientDemigraphics")}
            </Heading>
            <PatientDemographics demographics={data.patientDemographics} />
          </Box>
        )}

        {topMedical.length > 0 && (
          <VStack p={5} align={"flex-start"} gap={4}>
            <Heading size="md">{t("topMedicalActs")}</Heading>
            <SimpleGrid columns={[1, 2, 3]} spacing={5} mb={4}>
              {topMedical.map((act, index) => (
                <MedicalActCard key={index} act={act} />
              ))}
            </SimpleGrid>
            <Heading size="md">{t("consultationVsRevenue")}</Heading>
            <TopMedicalChart topMedicalChart={topMedical} />
            <Heading size="md">{t("patientVsInsurance")}</Heading>
            <TopMedicalChartShare topMedicalChart={topMedical} />
          </VStack>
        )}

        {dataOther && (
          <Box p={5}>
            <Heading size="md" mb={4}>
              {t("consultationPatterns")}
            </Heading>
            <TopMedicalActsChart
              topMedicalActs={dataOther?.consultationPatterns?.topMedicalActs}
            />

            <Divider my={8} />

            <Heading size="md" mb={4}>
              {t("revenueInsights")}
            </Heading>
            <RevenueInsightsChart
              revenueInsights={dataOther?.revenueInsights}
            />

            <Divider my={8} />

            <Heading size="md" mb={4}>
              {t("doctorPerformance")}
            </Heading>
            <DoctorPerformanceChart
              mostActiveDoctors={
                dataOther?.doctorPerformance?.mostActiveDoctors
              }
            />

            <Divider my={8} />

            <Heading size="md" mb={4}>
              {t("consultationVolumePerDay")}
            </Heading>
            <ConsultationVolumeChart
              peakHours={dataOther?.consultationVolumePerDay?.peakHours}
            />

            <Divider my={8} />

            <Heading size="md" mb={4}>
              {t("financialDistribution")}
            </Heading>

            <FinancialDistributionChart
              financialDistribution={
                dataOther?.financialDistribution?.varianceInCosts
              }
            />
          </Box>
        )}
      </Flex>
    </Sidebar>
  );
}

const TopMedicalActsChart = ({ topMedicalActs }) => {
  if (topMedicalActs && topMedicalActs.length > 0)
    return (
      <LineChart
        id={`line-chart-1`}
        data={topMedicalActs.map((item) => item.count)}
        label={topMedicalActs.map((item) => item.service)}
      />
    );
};

const RevenueInsightsChart = ({ revenueInsights }) => {
  if (revenueInsights)
    return (
      <PieChart
        id={"piechart-1"}
        data={[
          {
            category: "Patient Contribution",
            value: revenueInsights.totalPatientContribution,
          },
          {
            category: "Insurance Contribution",
            value: revenueInsights.totalInsuranceContribution,
          },
        ]}
      />
    );
};

const DoctorPerformanceChart = ({ mostActiveDoctors }) => {
  if (mostActiveDoctors && mostActiveDoctors.length > 0)
    return (
      <ClusterColumn
        id={"clustercolumn-1"}
        data={[
          mostActiveDoctors.reduce(
            (acc, item) => {
              acc[item.doctor] = item.count;
              return acc;
            },
            { year: "Performance" }
          ),
        ]}
        label={mostActiveDoctors.map((item) => item.doctor)}
      />
    );
};

const TopMedicalChart = ({ topMedicalChart }) => {
  const t = useTranslations("Dictionary");
  if (topMedicalChart && topMedicalChart.length > 0)
    return (
      <ClusterColumn
        id={"clustercolumn-3"}
        data={topMedicalChart.map((item) => {
          return {
            year: item.service,
            [t("totalConsultations")]: Number(item?.totalConsultations),
            [t("totalRevenue")]: Number(item?.totalRevenue),
          };
        })}
        label={[t("totalConsultations"), t("totalRevenue")]}
      />
    );
};

const TopMedicalChartShare = ({ topMedicalChart }) => {
  const t = useTranslations("Dictionary");
  if (topMedicalChart && topMedicalChart.length > 0)
    return (
      <ClusterColumn
        id={"clustercolumn-4"}
        data={topMedicalChart.map((item) => {
          return {
            year: item.service,
            [t("averagePatientShare")]: Number(item?.averagePatientShare),
            [t("averageInsuranceShare")]: Number(item?.averageInsuranceShare),
          };
        })}
        label={[t("averagePatientShare"), t("averageInsuranceShare")]}
      />
    );
};

const ConsultationVolumeChart = ({ peakHours }) => {
  if (peakHours && peakHours.length > 0)
    return (
      <LineChart
        id={`line-chart-2`}
        data={peakHours
          .sort((a, b) => Number(a.hour) - Number(b.hour))
          .map((item) => item.count)}
        label={peakHours
          .sort((a, b) => Number(a.hour) - Number(b.hour))
          .map((item) => item.hour + ":00")}
      />
    );
};

const FinancialDistributionChart = ({ financialDistribution }) => {
  const temp = financialDistribution.reduce(
    (acc, item) => {
      acc[item.service] = item.totalCost;
      return acc;
    },
    { year: "Revenue" }
  );
  const label = financialDistribution.map((item) => item.service);
  if (financialDistribution && financialDistribution.length > 0)
    return <ClusterColumn id={"clustercolumn-2"} data={[temp]} label={label} />;
};

const MedicalActCard = ({ act }) => {
  const {colorMode} = useColorMode()
  const bgColor = useColorModeValue("gray.100", "gray.700")
  const t = useTranslations("Dictionary");
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
      shadow="md"
      bg={bgColor}
    >
      <Text color={colorMode === 'dark' && 'gray.300'}fontSize="xl" fontWeight="bold" mb={2}>
        {act.service}
      </Text>
      <Stack spacing={1}>
        <Text>
          {t("totalConsultations")}: {act.totalConsultations}
        </Text>
        <Text>
          {t("averageTotalCost")}: {act.averageTotalCost} CFA
        </Text>
        <Text>
          {t("averagePatientShare")}: {act.averagePatientShare} CFA
        </Text>
        <Text>
          {t("averageInsuranceShare")}: {act.averageInsuranceShare} CFA
        </Text>
        <Text>
          {t("totalRevenue")}: {act.totalRevenue} CFA
        </Text>
      </Stack>
    </Box>
  );
};

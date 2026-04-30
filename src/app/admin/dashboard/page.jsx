"use client";
import Button from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { PatientContext } from "@/store/context/PatientContext";
import {
  AddIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  useToast,
  VStack,
  Icon,
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
  Link,
  Spacer,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useRef, useState, useEffect } from "react";
import { CiCalendar } from "react-icons/ci";
import { LuBadgeCheck } from "react-icons/lu";
import { SlOptionsVertical } from "react-icons/sl";
import { LuBanknote } from "react-icons/lu";
import { useTranslations } from "next-intl";
import ArrowButton from "@/components/ui/ArrowButton";
import DashboardFilterButton from "@/components/ui/DashboardFilterButton";
import DayCalendarCard from "@/components/ui/DayCalendarCard";
import moment from "moment";
import DashboardCard from "@/components/ui/DashboardCard";
import { UserContext } from "@/store/context/UserContext";
import axios from "@/lib/axiosInstance";
import StatusBox from "@/components/ui/StatusBox";

export default function Page() {
  const t = useTranslations("Dictionary");
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const { state: UserState } = useContext(UserContext);
  const [selected, setSelected] = useState(4);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const { colorMode } = useColorMode();
  const colorTxt1 = useColorModeValue("#475467", "gray.300");
  const colorTxt2 = useColorModeValue("#101828", "gray.300");
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.700");

  useEffect(() => {
    if (UserState.value.data?.centerid) {
      fetchData(UserState.value.data.centerid);
    }
  }, [UserState.value.data]);

  useEffect(() => {
    const filterAppointments = () => {
      if (!data || !data.appointments) {
        return;
      }

      let filtered = [];
      const now = moment();

      if (selected === 4) {
        filtered = [...data.appointments];
      } else if (selected === 3) {
        const sevenDaysAgo = moment().subtract(7, "days");
        filtered = data.appointments.filter((appointment) =>
          moment(Number(appointment.appointmentdate)).isBetween(
            sevenDaysAgo,
            now,
            null,
            "[]"
          )
        );
      } else if (selected === 2) {
        const thirtyDaysAgo = moment().subtract(30, "days");
        filtered = data.appointments.filter((appointment) =>
          moment(Number(appointment.appointmentdate)).isBetween(
            thirtyDaysAgo,
            now,
            null,
            "[]"
          )
        );
      } else if (selected === 1) {
        const twelveMonthsAgo = moment().subtract(12, "months");
        filtered = data.appointments.filter((appointment) =>
          moment(Number(appointment.appointmentdate)).isBetween(
            twelveMonthsAgo,
            now,
            null,
            "[]"
          )
        );
      }

      let total = 0;
      filtered.map((item) => {
        total = total + Number(item.invoiced);
      });

      setTotalIncome(total.toFixed(2));

      setTotalAppointments(filtered.length);

      const uniquePatientIds = Array.from(
        new Set(filtered.map((appointment) => appointment.patient_id))
      );

      setTotalPatients(uniquePatientIds.length);
    };

    if (data?.total_patients) {
      filterAppointments();
    }
  }, [selected, data]);

  async function fetchData(id) {
    axios.get(`/api/newroutes/healthcare/${id}/admin/dashboard`).then((response) => {
      setData(response.data);
      if (response.data.total_patients) {
        setTotalPatients(response.data.total_patients);
      }
      if (response.data.total_appointments) {
        setTotalAppointments(response.data.total_appointments);
      }
      if (response.data.total_invoiced) {
        setTotalIncome(response.data.total_invoiced);
      }
    });
  }

  const RenderEachRow = ({ item, index }) => {
    return (
      <Tr
        backgroundColor={
          index % 2 == 0
            ? colorMode == "light"
              ? "#F9FAFB"
              : "gray.700"
            : colorMode == "light"
            ? "white"
            : "transparent"
        }
      >
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {moment(new Date(Number(item?.appointmentdate))).format("DD/MM/YYYY")}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {moment(new Date(Number(item?.appointmentdate))).format("hh:mm A")}
        </Td>
        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt1}>
          {item?.patient_firstname + " " + item?.patient_lastname}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            PT{item?.paitent_id}
          </div>
        </Td>

        <Td fontSize={"14px"} fontWeight={"500"} color={colorTxt2}>
          {item?.doctor_firstname + " " + item.doctor_lastname}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#667085",
            }}
          >
            {item?.doctor_speciality
              ? t(item?.doctor_speciality)
              : item?.doctor_speciality}
          </div>
        </Td>
        <Td>
          <StatusBox item={item?.status} />
        </Td>
        {/* <Td>
          <HStack>
            <DeleteIcon boxSize={4} color={"red"} _hover={{ opacity: 0.7 }} />
            <Icon as={RxPencil1} boxSize={4} _hover={{ opacity: 0.7 }} />
          </HStack>
        </Td> */}
      </Tr>
    );
  };

  const RenderEachRowStaff = ({ item, index }) => {
    return (
      <Tr
        backgroundColor={
          index % 2 == 0
            ? colorMode == "light"
              ? "#F9FAFB"
              : "gray.700"
            : colorMode == "light"
            ? "white"
            : "transparent"
        }
      >
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {item?.firstname + " " + item?.lastname}
        </Td>
        <Td fontSize={"14px"} fontWeight={"400"} color={colorTxt1}>
          {t(item?.speciality)}
        </Td>
      </Tr>
    );
  };
  const sideLinks = GetLinkItems("admin");
  return (
    <Sidebar LinkItems={sideLinks} settingsLink={"/admin/settings"}>
      <Flex flex={1} gap={8} p={"32px"} flexDir="column" overflowX={"auto"}>
        <Text color={colorMode === "dark" && "gray.300"} variant="heading">
          {t("dashboard")}
        </Text>
        <Flex flex={1} gap={"32px"}>
          <Flex flex={1} flexDir={"column"} gap={5}>
            <HStack width={"100%"} justifyContent={"space-between"}>
              <DashboardFilterButton
                colorMode={colorMode}
                selected={selected}
                onReturn={setSelected}
              />

              {/* <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  leftIcon={<Icon as={CiCalendar} boxSize={4} />}
                  variant="outline"
                  backgroundColor={"#FFFFFF"}
                  color={"black"}
                  border={"1px solid"}
                  borderColor={useColorModeValue(theme.color.primaryBorderColor, 'gray.700')}
                >
                  {t("selectDates")}
                </Button>
                <Button
                  variant="outline"
                  backgroundColor={"#FFFFFF"}
                  color={"#004EEB"}
                  border={"1px solid"}
                  borderColor={theme.color.border}
                >
                  {t("checkDashboard")}
                </Button>
              </div> */}
            </HStack>
            <HStack width={"100%"} justifyContent={"space-between"}>
              <DashboardCard
                colorMode={colorMode}
                title={t("patients")}
                detail={totalPatients}
              />
              <DashboardCard
                colorMode={colorMode}
                title={t("appointments")}
                detail={totalAppointments}
              />
              <DashboardCard
                colorMode={colorMode}
                title={t("totalIncome")}
                detail={totalIncome}
              />
            </HStack>

            <Box
              width={"100%"}
              border={"1px solid"}
              borderColor={bdColor}
              borderRadius={5}
            >
              <Box
                width={"100%"}
                borderBottomWidth={"1px"}
                borderBottomColor={theme.input.color}
              >
                <HStack width={"100%"} justifyContent={"space-between"} p={5}>
                  <Text
                    variant={"heading"}
                    fontSize={"18px"}
                    color={colorMode === "dark" && "gray.300"}
                  >
                    {t("appointments")}
                  </Text>
                  <Icon as={SlOptionsVertical} color={"#98A2B3"} />
                </HStack>
              </Box>
              <Box
                width={"100%"}
                borderBottomWidth={"1px"}
                borderBottomColor={theme.input.color}
              >
                <HStack width={"100%"} justifyContent={"space-between"} p={5}>
                  {/* <ArrowButton type={"back"} /> */}
                  {Array(7)
                    .fill({ date: 1, day: 1 })
                    .map((item, index) => (
                      <DayCalendarCard
                        colorMode={colorMode}
                        onClick={() => {
                          setSelectedDate(index);
                        }}
                        key={index}
                        selected={selectedDate === index}
                        day={moment(new Date())
                          .add(index, "days")
                          .format("ddd")}
                        date={moment(new Date())
                          .add(index, "days")
                          .format("D MMM")}
                      />
                    ))}
                  {/* <ArrowButton type={"forward"} /> */}
                </HStack>
              </Box>
              {data?.total_appointments && data?.appointments.length > 0 ? (
                <Box width={"100%"}>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          {[
                            t("date"),
                            t("time"),
                            t("patient"),
                            t("doctor"),
                            t("status"),
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
                        {data?.appointments
                          .filter(
                            (item, index) =>
                              moment(
                                new Date(Number(item.appointmentdate))
                              ).format("DD/MM/YYYY") ===
                              moment(new Date())
                                .add(selectedDate, "days")
                                .format("DD/MM/YYYY")
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
                  {/* <HStack justifyContent={"space-between"} p={5}>
                    <div>
                      <Button
                        variant="outline"
                        backgroundColor={"#FFFFFF"}
                        color={"black"}
                        border={"1px solid"}
                        borderColor={useColorModeValue(theme.color.primaryBorderColor, 'gray.700')}
                      >
                        {t("previous")}
                      </Button>
                    </div>
                    <div>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
                        {" "}
                        {t("page")} 1 {t("of")} 1
                      </Text>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        backgroundColor={"#FFFFFF"}
                        color={"black"}
                        border={"1px solid"}
                        borderColor={useColorModeValue(theme.color.primaryBorderColor, 'gray.700')}
                      >
                        {t("next")}
                      </Button>
                    </div>
                  </HStack> */}
                </Box>
              ) : (
                <VStack spacing={2} my={10}>
                  <Image
                    width={"315px"}
                    height={"210px"}
                    src="/assets/No-data-pana-1.png"
                  />
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    fontWeight={"600"}
                    fontSize={"20px"}
                  >
                    {t("noAppointmentScheduled")}
                  </Text>
                  <div style={{ width: "70%" }}>
                    <Text
                      fontSize={"14px"}
                      fontWeight={"400"}
                      color={theme.text.secondary}
                      textAlign={"center"}
                    >
                      {t("noAppointmentScheduledSubheading")}
                    </Text>
                  </div>
                  {/* <Link
                    href={`${window.location.origin}/admin/appointments/addappointment`}
                    style={{ minWidth: "350px" }}
                  >
                    <Button
                      leftIcon={<AddIcon marginTop={"-2px"} />}
                      width={"100%"}
                    >
                      {t("newAppointment")}
                    </Button>
                  </Link> */}
                </VStack>
              )}
            </Box>
          </Flex>
          <Flex width={"400px"}>
            <Box
              width={"500px"}
              border={"1px solid"}
              borderColor={bdColor}
              borderRadius={5}
            >
              <Box
                width={"100%"}
                borderBottomWidth={"1px"}
                borderBottomColor={theme.input.color}
              >
                <HStack width={"100%"} justifyContent={"space-between"} p={5}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"heading"}
                    fontSize={"18px"}
                  >
                    {t("doctors")}
                  </Text>
                  <Icon as={SlOptionsVertical} color={"#98A2B3"} />
                </HStack>
              </Box>
              {data?.total_appointments && data?.staff?.length > 0 ? (
                <Box width={"100%"}>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          {[t("name"), t("specialist")].map((item, index) => (
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
                        {data?.staff
                          .filter((item) => item.role === "doctor")
                          .map((item, index) => (
                            <RenderEachRowStaff
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
                        borderColor={useColorModeValue(theme.color.primaryBorderColor, 'gray.700')}
                      >
                        {t("previous")}
                      </Button>
                    </div>
                    <div>
                      <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
                        {" "}
                        {t("page")} 1 {t("of")} 1
                      </Text>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        backgroundColor={"#FFFFFF"}
                        color={"black"}
                        border={"1px solid"}
                        borderColor={useColorModeValue(theme.color.primaryBorderColor, 'gray.700')}
                      >
                        {t("next")}
                      </Button>
                    </div>
                  </HStack> */}
                </Box>
              ) : (
                <VStack
                  spacing={5}
                  align={"center"}
                  width={"100%"}
                  height={"100%"}
                  justify={"center"}
                >
                  <Image
                    width={"315px"}
                    height={"210px"}
                    src="/assets/No-data-pana-1.png"
                  />
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    fontWeight={"600"}
                    fontSize={"20px"}
                  >
                    {t("noMedicalStaffFound")}
                  </Text>
                  <div style={{ width: "70%" }}>
                    <Text
                      fontSize={"14px"}
                      fontWeight={"400"}
                      color={theme.text.secondary}
                      textAlign={"center"}
                    >
                      {t("noMedicalStaffFoundSubheading")}
                    </Text>
                  </div>
                  {/* <Link
                    href={`${window.location.origin}/admin/medicalstaff/addmedicalstaff`}
                    style={{ minWidth: "350px" }}
                  >
                    <Button
                      leftIcon={<AddIcon marginTop={"-2px"} />}
                      width={"100%"}
                    >
                      {t("newStaff")}
                    </Button>
                  </Link> */}
                </VStack>
              )}
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Sidebar>
  );
}

"use client";
import Sidebar from "@/components/sidebar";
import GetLinkItems from "@/utils/SidebarItems";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useContext, useEffect, useState } from "react";
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
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import Button from "@/components/ui/Button";
import { theme } from "@/data/data";
import StatusBox from "@/components/ui/StatusBox";
import AppointmentRecord from "@/components/consultation/record";
import { GiSandsOfTime } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";

export default function Page () {
  const { state: UserState } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState();
  const [openAppointmentRecord, setOpenAppointmentRecord] = useState(false);
  const t = useTranslations("Dictionary");
  const [medicalRecordData, setMedicalRecordData] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState([]);
  const [isDetailOpen, setIsDetaiOpen] = useState(false);
  const {colorMode} = useColorMode()
  const colorTxt1 = useColorModeValue("#475467", 'gray.300')
  const colorTxt2 = useColorModeValue("#101828", "gray.300")
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

  useEffect(() => {
    if (UserState.value.data?.id) {
      fetchDate();
    }
  }, [UserState.value.data]);

  async function fetchDate() {
    axios
      .post("/api/doctor/dashboard", {
        doctorid: UserState.value.data.id,
        centerid: UserState.value.data.centerid,
      })
      .then((response) => {
        let temp = [];
        response.data.map((item) => {
          temp.push({
            start: new Date(Number(item.appointmentdate)).toISOString(),
            end: new Date(Number(item.appointmentdate)).toISOString(),
            title: `${t(item.reason)}`,
          });
        });
        setData([...temp]);
      });

    await axios
      .post("/api/doctor/appointment", {
        id: UserState.value.data?.id,
      })
      .then((response) => {
        setAppointmentData(response.data);
      });
  }

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

        <Td
          fontSize="14px"
          fontWeight="500"
          color={theme.color.link}
          _hover={{ cursor: "pointer" }}
          onClick={() => {
            if (item.status.toLocaleLowerCase() === "completed" || item.status.toLocaleLowerCase() === "labtestrequested") {
              setOpenAppointmentRecord(true);
            } else {
              setIsDetaiOpen(true);
            }
          }}
        >
          {t("viewDetails")}
        </Td>
      </Tr>
    );
  };

  const doctorLinks = GetLinkItems("doctor");
  return (
    <Sidebar LinkItems={doctorLinks}  >
      {!openAppointmentRecord ? (
        <Flex
          flex={1}
          gap={"20px"}
          p={"32px"}
          flexDir="column"
          overflowX={"auto"}
        >
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading"> {t("dashboard")}</Text>
     
              <Box
                width={"100%"}
                border={"1px solid"}
                borderColor={bdColor}
                borderRadius={5}
              >
                <Center w={"100%"} p={'15px'}>
                  <div style={{display:'flex', alignItems:'center'}}>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"20px"}>
                      {t("inQueue")}
                    </Text>
                    <Icon as={GiSandsOfTime } boxSize={4} color={'orange'}  ml={2}/>
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
                            t("details"),
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
                        {appointmentData.length > 0 && appointmentData
                          .sort(
                            (a, b) =>
                              Number(a.appointmentdate) -
                              Number(b.appointmentdate)
                          )
                          .filter((item) => item.status === "waiting")
                          .filter(
                            (item) =>
                              moment(
                                new Date(Number(item.appointmentdate))
                              ).format("DD/MM/YYYY") ===
                              moment().format("DD/MM/YYYY")
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
                  {appointmentData.length > 0 &&
                    appointmentData.filter((item) => item.status === "waiting")
                    .filter(
                      (item) =>
                        moment(
                          new Date(Number(item.appointmentdate))
                        ).format("DD/MM/YYYY") ===
                        moment().format("DD/MM/YYYY")
                    ).length > 10 && (
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
                    )}
                </Box>

                <Center w={"100%"} p={'15px'}>
                  <div style={{display:'flex', alignItems:'center'}}>
                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"20px"}>
                      {t("completed")}
                    </Text>
                    <Icon as={FaCheckCircle } boxSize={4} color={'green'} ml={2}/>
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
                            t("details"),
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
                        {appointmentData.length > 0 && appointmentData
                          .sort(
                            (a, b) =>
                              Number(a.appointmentdate) -
                              Number(b.appointmentdate)
                          )
                          .filter((item) => item.status === "completed" || item.status === "labtestrequested")
                          .filter(
                            (item) =>
                              moment(
                                new Date(Number(item.appointmentdate))
                              ).format("DD/MM/YYYY") ===
                              moment().format("DD/MM/YYYY")
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
                  {appointmentData.length > 0 &&
                    appointmentData.filter((item) => item.status === "completed" || item.status === "labtestrequested")
                    .filter(
                      (item) =>
                        moment(
                          new Date(Number(item.appointmentdate))
                        ).format("DD/MM/YYYY") ===
                        moment().format("DD/MM/YYYY")
                    ).length > 10 && (
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
                    )}
                </Box>
              </Box>
            
          <div style={{ width: "100%", height: "100%", padding: "10px" }}>
            <FullCalendar
              headerToolbar={{
                start: "title",
                end: "today prev,next",
              }}
              plugins={[dayGridPlugin]}
              events={data}
            />
          </div>
        </Flex>
      ) : (
        <Flex flex={1} overflowX={"auto"} height={"100vh"}>
          <AppointmentRecord
            selectedAppointment={selectedAppointment}
            medicalRecordData={medicalRecordData}
            prescriptionData={prescriptionData}
            myEmail={UserState.value.data.email}
            onReturn={() => setOpenAppointmentRecord(false)}
          />
        </Flex>
      )}
      <AppointmentDetailPopup
        visible={isDetailOpen}
        selectedAppointment={selectedAppointment}
        onReturn={() => setIsDetaiOpen(false)}
      />
    </Sidebar>
  );
}

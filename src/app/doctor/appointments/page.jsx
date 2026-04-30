"use client";
import Button, { DangerButton, GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { CloseIcon } from "@chakra-ui/icons";
import AppointmentDetailPopup from "@/components/appointments/appointmentdetailpopup/index";
import {
  Image,
  Box,
  Flex,
  HStack,
  Text,
  useToast,
  VStack,
  Icon,
  InputGroup,
  InputLeftElement,
  Input,
  Menu,
  MenuButton,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Avatar,
  Divider,
  Wrap,
  WrapItem,
  Spacer,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { PiCalendarHeartLight, PiIntersect } from "react-icons/pi";
import { useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import moment from "moment";
import dynamic from "next/dynamic";
import { UserContext } from "@/store/context/UserContext";
import axios from "@/lib/axiosInstance";
import StatusBox from "@/components/ui/StatusBox";
import AppointmentRecord from "@/components/consultation/record";

export default function Page() {
  const t = useTranslations("Dictionary");

  const pathname = usePathname();
  const [isDetailOpen, setIsDetaiOpen] = useState(false);
  const toastIdRef = useRef(null);
  const toast = useToast();
  const [medicalRecordData, setMedicalRecordData] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState([]);
  const [openAppointmentRecord, setOpenAppointmentRecord] = useState(false);

  const { state: UserState } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState({});
  const [search, setSearch] = useState("");
  const bdColor = useColorModeValue(theme.divider.primary, "gray.700") 
  const txtColor1 = useColorModeValue("#475467", "gray.300")
  const txtColor2 = useColorModeValue("#101828", "gray.300")
  const bgColor = useColorModeValue("white", "gray.800")
  const {colorMode} = useColorMode() 

  useEffect(() => {
    if (UserState.value.data?.id) {
      fetchData(UserState.value.data?.id);
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    await axios
      .post("/api/doctor/appointment", {
        id: id,
      })
      .then((response) => {
        setData(response.data);
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
       <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          {moment(new Date(Number(item?.appointmentdate))).format(
            "DD MMM YYYY"
          )}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          {moment(new Date(Number(item?.appointmentdate))).format("hh:mm A")}
        </Td>
        <Td fontSize={"14px"} fontWeight={"500"} color={txtColor2}>
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
       <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          {item?.patient_number}
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
          {/* {item?.type} */}
          {item?.type ? t(item?.type) : t("inPerson")}
        </Td>
        <Td>
          <StatusBox item={item?.status} />
        </Td>
       <Td fontSize={"14px"} fontWeight={"400"} color={txtColor1}>
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
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading"> {t("appointments")}</Text>

          {data.length == 0 ? (
            <VStack spacing={5}>
              <Image
                width={"315px"}
                height={"210px"}
                src="/assets/Calendar-pana-1.png"
              />
              <Text color={colorMode === 'dark' && 'gray.300'}fontWeight={"600"} fontSize={"30px"}>
                {t("noAppointmentScheduled")}
              </Text>
              <div style={{ width: "70%" }}>
                <Text
                  fontSize={"16px"}
                  fontWeight={"400"}
                  color={theme.text.secondary}
                  textAlign={"center"}
                >
                  {t("noAppointmentScheduledSubheading")}
                </Text>
              </div>
            </VStack>
          ) : (
            <Box
              width={"100%"}
              border={"1px solid"}
              borderColor={bdColor}
              borderRadius={5}
            >
              <Wrap width={"100%"} p={5} justify={"space-between"}>
                <WrapItem w={"100%"} maxW={"500px"}>
                  <InputGroup w={"100%"}>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={CiSearch} boxSize={5} color="#667085" />
                    </InputLeftElement>
                    <Input
                      placeholder={t("search")}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                </WrapItem>
                <Spacer />
                <WrapItem>
                  <Link href={"/doctor/schedulemanagement"}>
                    <GhostButton
                      leftIcon={
                        <Icon
                          marginTop={"-2px"}
                          boxSize={5}
                          as={PiCalendarHeartLight}
                        />
                      }
                    >
                      {t("scheduleManagement")}
                    </GhostButton>
                  </Link>
                </WrapItem>
               
              </Wrap>
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
                      {data.length > 0 &&
                        data
                          .filter((item) => {
                            const string = `PT${item.patient_id} ${item.patient_firstname} ${item.patient_lastname}`;
                            if (
                              string
                                .toLocaleLowerCase()
                                .includes(search.toLocaleLowerCase())
                            ) {
                              return item;
                            }
                          })
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

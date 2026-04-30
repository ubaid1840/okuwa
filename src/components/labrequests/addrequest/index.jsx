"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { ChevronRightIcon } from "@chakra-ui/icons";
import "react-datepicker/dist/react-datepicker.css";
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
  Select,
  Box,
  Icon,
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
import axios from "axios";
import {
  Select as SearchableSelect,
  useChakraSelectProps,
} from "chakra-react-select";
import moment from "moment";
import Calendar from "@/components/ui/Calendar";

export default function Page({ page }) {
  const t = useTranslations("Dictionary");
  const pathName = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { state: UserState } = useContext(UserContext);
  const [allPatients, setAllPatients] = useState([]);
  const [allTestType, setAllTestType] = useState([]);
  const [allImagingStudies, setAllImagingStudies] = useState([]);
  const [data, setData] = useState({
    patient: "",
    patientid: null,
    requestType: "",
    testType: "",
    priority: "",
    expectedDate: moment().valueOf(),
    imagingType: "",
  });
  const { colorMode } = useColorMode();
  const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.700");

  useEffect(() => {
    if (UserState.value.data.id) {
      fetchData(UserState.value.data.id, UserState.value.data.centerid);
    }
  }, [UserState.value.data]);

  async function fetchData(id, centerid) {
    axios
      .post("/api/patient/getall", { centerid: centerid })
      .then((response) => {
        setAllPatients(response.data);
      });

    axios.post("/api/settings/get", { id: centerid }).then((response) => {
      setAllImagingStudies(response.data?.imagingstudies || []);
      setAllTestType(response.data?.labtest || []);
    });
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
        patientid: e.value,
      }));
    },
  });

  async function handleLabRequest() {
    await axios
      .post("/api/labrequest/add", {
        centerid: UserState.value.data.centerid,
        patientid: data.patientid,
        requesttype: data.requestType,
        testtype:
          data.requestType == "imagingStudies"
            ? data.imagingType
            : data.testType,
        priority: data.priority,
        created: moment().valueOf(),
        expected: data.expectedDate.valueOf(),
        status: "requested",
        image: "",
        doctorid: page === "doctor" ? UserState.value.data.id : null,
      })
      .then((response) => {
        router.push(`${pathName.replace(/\/[^\/]*$/, "")}?requestadded=true`);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  }

  const sideLinks = GetLinkItems(page);
  return (
    <Sidebar LinkItems={sideLinks}>
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <HStack fontSize="14px" fontWeight="500" color="#667085">
          <Link href={pathName.replace(/\/[^\/]*$/, "")}>
            {t("labRequests")}
          </Link>
          <ChevronRightIcon />
          <Text color={colorMode === "dark" ? "gray.300" : "#344054"}>
            {page == "lab" ? t("addNewTest") : t("addNewRequest")}
          </Text>
        </HStack>
        <HStack justifyContent={"space-between"}>
          <Text color={colorMode === "dark" && "gray.300"} variant="heading">
            {page == "lab" ? t("addNewTest") : t("addNewRequest")}
          </Text>
          <HStack>
            <Link href={`${pathName.replace(/\/[^\/]*$/, "")}`}>
              <GhostButton
                onClick={() =>
                  setData({
                    requestor: "",
                    patient: "",
                    requestType: "",
                    testType: "",
                    priority: "",
                    expectedDate: "",
                  })
                }
              >
                {t("cancel")}
              </GhostButton>
            </Link>

            <Button
              isDisabled={
                !data.patientid || !data.requestType || !data.priority
              }
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                handleLabRequest();
              }}
            >
              {t("confirm")}
            </Button>
          </HStack>
        </HStack>
        <VStack alignItems={"flex-start"} width={"60%"} spacing={5}>
          {page === "doctor" && (
            <HStack width={"100%"}>
              <div style={{ width: "280px" }}>
                <Text
                  color={colorMode === "dark" && "gray.300"}
                  variant={"subheading"}
                >
                  {t("requestor")}
                </Text>
              </div>
              <Input
                isDisabled
                value={
                  UserState.value.data?.name
                    ? UserState.value.data?.name
                    : `${UserState.value.data?.firstname || ""} ${
                        UserState.value.data?.lastname || ""
                      }`
                }
                onChange={(e) => {}}
              />
            </HStack>
          )}

          <HStack width={"100%"}>
            <div style={{ width: "280px" }}>
              <Text
                color={colorMode === "dark" && "gray.300"}
                variant={"subheading"}
              >
                {t("patient")}
              </Text>
            </div>
            <div style={{ width: "100%" }}>
              <SearchableSelect
                id="custom-select-id"
                useBasicStyles
                chakraStyles={customChakraStyles}
                colorScheme="teal"
                options={allPatients.map((item) => {
                  return {
                    value: item.id,
                    label: `${item.id} - ${item.firstname}  ${item.lastname} `,
                  };
                })}
                {...patientSelectProps}
              />
            </div>
          </HStack>

          <HStack width={"100%"}>
            <div style={{ width: "280px" }}>
              <Text
                color={colorMode === "dark" && "gray.300"}
                variant={"subheading"}
              >
                {t("expectedDate")}
              </Text>
            </div>

            <Calendar
              value={moment(data.expectedDate).toDate()}
              onChange={(e) => {
                setData((prevState) => {
                  const newState = { ...prevState };
                  newState.expectedDate = moment(e.value)
                    .startOf("day")
                    .valueOf();
                  return newState;
                });
              }}
            />
          </HStack>

          <HStack width={"100%"}>
            <div style={{ width: "280px" }}>
              <Text
                color={colorMode === "dark" && "gray.300"}
                variant={"subheading"}
              >
                {t("requestType")}
              </Text>
            </div>
            <Select
              value={data.requestType}
              onChange={(e) =>
                setData((prevState) => {
                  const newState = { ...prevState };
                  newState.requestType = e.target.value;
                  return newState;
                })
              }
            >
              <option value={""}>{t("selectOne")}</option>
              <option value={"labTest"}>{t("labTest")}</option>
              <option value={"imagingStudies"}>{t("imagingStudies")}</option>
            </Select>
          </HStack>

          {data.requestType == "labTest" && (
            <>
              <Divider color={theme.divider.primary} />
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("testType")}
                  </Text>
                </div>
                <Select
                  value={data.testType}
                  onChange={(e) =>
                    setData((prevState) => {
                      const newState = { ...prevState };
                      newState.testType = e.target.value;
                      return newState;
                    })
                  }
                >
                  <option value={""}>{t("selectOne")}</option>
                  {allTestType.length > 0 &&
                    allTestType.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </Select>
              </HStack>
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("priority")}
                  </Text>
                </div>
                <Select
                  value={data?.priority}
                  onChange={(e) =>
                    setData((prevState) => {
                      const newState = { ...prevState };
                      newState.priority = e.target.value;
                      return newState;
                    })
                  }
                >
                  <option disabled value={""}>
                    {t("selectOne")}
                  </option>
                  <option value="high">{t("high")}</option>
                  <option value="medium">{t("medium")}</option>
                  <option value="low">{t("low")}</option>
                </Select>
              </HStack>
            </>
          )}

          {data.requestType == "imagingStudies" && (
            <>
              <Divider color={theme.divider.primary} />
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("imagingType")}
                  </Text>
                </div>
                <Select
                  value={data.imagingType}
                  onChange={(e) =>
                    setData((prevState) => {
                      const newState = { ...prevState };
                      newState.imagingType = e.target.value;
                      return newState;
                    })
                  }
                >
                  <option value={""}>{t("selectOne")}</option>
                  {allImagingStudies.length > 0 &&
                    allImagingStudies.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </Select>
              </HStack>
              <HStack width={"100%"}>
                <div style={{ width: "280px" }}>
                  <Text
                    color={colorMode === "dark" && "gray.300"}
                    variant={"subheading"}
                  >
                    {t("priority")}
                  </Text>
                </div>
                <Select
                  value={data?.priority}
                  onChange={(e) =>
                    setData((prevState) => {
                      const newState = { ...prevState };
                      newState.priority = e.target.value;
                      return newState;
                    })
                  }
                >
                  <option disabled value={""}>
                    {t("selectOne")}
                  </option>
                  <option value="high">{t("high")}</option>
                  <option value="medium">{t("medium")}</option>
                  <option value="low">{t("low")}</option>
                </Select>
              </HStack>
            </>
          )}
        </VStack>
      </Flex>
    </Sidebar>
  );
}

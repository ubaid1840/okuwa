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
  Textarea,
  Center,
  Spinner,
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
import moment from "moment";

export default function Page() {
  const t = useTranslations("Dictionary");
  const pathName = usePathname();
  const { state: UserState } = useContext(UserContext);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [inputData, setInputData] = useState({
    analysis: "",
    interpretation: "",
    recommendation: "",
  });
  const {colorMode} = useColorMode()
  const bdColor=  useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
  useEffect(() => {
    if (UserState.value.data?.centerid) {
      const search = new URLSearchParams(window.location.search).get("id");
      if (search) {
        fetchData(Number(search));
      }
    }
  }, [UserState.value.data]);

  async function fetchData(id) {
    axios.post("/api/labrequest/single", { id: id }).then((response) => {
      setData(response.data);
      if (response.data?.length == 0) {
        router.push(`${pathName.replace(/\/[^\/]*$/, "")}`);
      }
    });
  }

  async function handleSaveReport() {
    axios
      .post("/api/update", {
        table: "labrequest",
        columns: [
          "imageanalysis",
          "interpretation",
          "recommendation",
          "status",
        ],
        values: [
          inputData.analysis,
          inputData.interpretation,
          inputData.recommendation,
          "completed",
        ],
        conditions: {
          column: "id",
          operator: "=",
          value: data.id,
        },
      })
      .then((response) => {
        if (data.appointmentid) {
          axios
            .post("/api/update", {
              table: "appointment",
              columns: ["status"],
              values: ["completed"],
              conditions: {
                column: "id",
                operator: "=",
                value: data.appointmentid,
              },
            })
            .then(() => {
              router.push(
                `${pathName.replace(/\/[^\/]*$/, "")}?reportadded=true`
              );
            });
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  const labLinks = GetLinkItems("lab");
  return (
    <Sidebar LinkItems={labLinks}>
      {data ? (
        <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
          <HStack fontSize="14px" fontWeight="500" color="#667085">
            <Link href={pathName.replace(/\/[^\/]*$/, "")}>
              {t("analysisAndReporting")}
            </Link>
            <ChevronRightIcon />
            <Text color={colorMode === 'dark' ? 'gray.300' : "#344054"}>{t("addNewReport")}</Text>
          </HStack>
          <HStack justifyContent={"space-between"}>
            <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("addNewReport")}</Text>
            <HStack>
              <Link href={`${pathName.replace(/\/[^\/]*$/, "")}`}>
                <GhostButton
                 
                >
                  {t("cancel")}
                </GhostButton>
              </Link>

              <Button
                isLoading={loading}
                onClick={() => {
                  setLoading(true);
                  handleSaveReport();
                }}
              >
                {t("save")}
              </Button>
            </HStack>
          </HStack>
          <VStack alignItems={"flex-start"} width={"70%"} spacing={5}>
            <HStack width={"100%"} alignItems={"flex-start"}>
              <div style={{ width: "380px" }}>
                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} mt={2}>
                  {t("image")}
                </Text>
              </div>
            
                {data?.image ? (
                  <Image _hover={{cursor:'pointer'}} onClick={()=>{
                    window.open(data.image, "_blank");
                  }} src={data?.image} height={"100px"} width={"100px"} />
                ) : null}
             
            </HStack>
            <HStack width={"100%"} alignItems={"flex-start"}>
              <div style={{ width: "380px" }}>
                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} mt={2}>
                  {t("imageAcquisitionDetail")}
                </Text>
              </div>
              <VStack alignItems={"flex-start"}>
                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                    {t("modality")}:
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {data?.testtype}
                  </Text>
                </div>
                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                    {t("category")}:
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {data?.labtestcategory}
                  </Text>
                </div>
                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                    {t("tube")}:
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {data?.labtesttube}
                  </Text>
                </div>
                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                    {t("unit")}:
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {data?.labtestunit}
                  </Text>
                </div>
                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                    {t("dateAndTime")}:
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {`${moment(new Date(Number(data?.expected))).format(
                      "DD/MM/YYYY"
                    )} ${moment(new Date(Number(data?.expected))).format(
                      "hh:mm A"
                    )}`}
                  </Text>
                </div>
                {/* <div>
                <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                {t('bodyPart')}:
                </Text>
                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                  Chest
                </Text>
              </div> */}

                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                    {t("requestType")}:
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {t(data?.requesttype)}
                  </Text>
                </div>

                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                    {t("patientID")}:
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    PT{data?.patient_id}
                  </Text>
                </div>

                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                    {t("patientName")}:
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {data?.patient_firstname ||
                      "" + " " + data?.patient_lastname ||
                      ""}
                  </Text>
                </div>

                <div>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"} fontSize={"14px"}>
                    {t("dob")}:
                  </Text>
                  <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"14px"}>
                    {data?.patient_dob
                      ? moment(new Date(Number(data.patient_dob))).format(
                          "DD/MM/YYYY"
                        )
                      : ""}
                  </Text>
                </div>
              </VStack>
            </HStack>

            <HStack width={"100%"} alignItems={"flex-start"}>
              <div style={{ width: "380px" }}>
                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} mt={2}>
                  {t("imageAnalysis")}
                </Text>
              </div>
              <Textarea
                value={inputData.analysis}
                onChange={(e) =>
                  setInputData((prevState) => {
                    const newState = { ...prevState };
                    newState.analysis = e.target.value;
                    return newState;
                  })
                }
                height={"150px"}
                resize={"none"}
                placeholder={t("imageAnalysisInput")}
              />
            </HStack>

            <HStack width={"100%"} alignItems={"flex-start"}>
              <div style={{ width: "380px" }}>
                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} mt={2}>
                  {t("interpretation")}
                </Text>
              </div>
              <Textarea
                value={inputData.interpretation}
                onChange={(e) =>
                  setInputData((prevState) => {
                    const newState = { ...prevState };
                    newState.interpretation = e.target.value;
                    return newState;
                  })
                }
                height={"150px"}
                resize={"none"}
                placeholder={t("interpretationInput")}
              />
            </HStack>
            <HStack width={"100%"} alignItems={"flex-start"}>
              <div style={{ width: "380px" }}>
                <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} mt={2}>
                  {t("recommendation")}
                </Text>
              </div>
              <Textarea
                value={inputData.recommendation}
                onChange={(e) =>
                  setInputData((prevState) => {
                    const newState = { ...prevState };
                    newState.recommendation = e.target.value;
                    return newState;
                  })
                }
                height={"150px"}
                resize={"none"}
                placeholder={t("recommendationInput")}
              />
            </HStack>
          </VStack>
        </Flex>
      ) : (
        <Center height={"100vh"} width={"100%"}>
          <Spinner />
        </Center>
      )}
    </Sidebar>
  );
}

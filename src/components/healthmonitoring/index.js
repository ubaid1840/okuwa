"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import {
    AddIcon,

} from "@chakra-ui/icons";

import {
    Flex,
    HStack,
    Text,
    useToast,
    VStack,
    Icon,
    InputGroup,
    InputLeftElement,
    Input,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,

    Grid,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { HealthMonitoringCard } from "@/components/ui/HealthMonitoringCard";
import { UserContext } from "@/store/context/UserContext";
import axios from "axios";
import {
    Select as SearchableSelect,
    useChakraSelectProps,
} from "chakra-react-select";
import moment from "moment";
import { showToastFailed } from "@/utils/toastUtils";

export default function HealthMonitoring({ page }) {
    const t = useTranslations("Dictionary");
    const toastIdRef = useRef(null);
    const toast = useToast();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [loading, setLoading] = useState(false);

    const [patients, setPatients] = useState([]);
    const [newRecord, setNewRecord] = useState({
        patient: "",
        patientid: null,
        bpleft: "",
        bpright: "",
        bloodpressure: "",
        heartrate: "",
        temperature: "",
        respiratory: "",
    });
    const { state: UserState } = useContext(UserContext);
    const {colorMode} = useColorMode()
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')

    useEffect(() => {
        if (UserState.value.data?.centerid) {
            fetchData(UserState.value.data?.centerid);
        }
    }, [UserState.value.data]);

    async function fetchData(id) {
        axios
            .post("/api/healthmonitoring/getall", { centerid: id })
            .then((response) => {
                if (response.data.length > 0) {
                    const allData = response.data;
                    const sortedData = allData.sort((a, b) => b.created - a.created);
                    const uniquePatientsMap = new Map();
                    sortedData.forEach((item) => {
                        if (!uniquePatientsMap.has(item.patientid)) {
                            uniquePatientsMap.set(item.patientid, item);
                        }
                    });

                    const uniquePatientsArray = Array.from(uniquePatientsMap.values());
                    setData(uniquePatientsArray);
                }
            });

        axios
            .post("/api/patient/getall", {
                centerid: id,
            })
            .then((response) => {
                setPatients(response.data);
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
            value: newRecord.patient,
            label: newRecord.patient == "" ? t("selectOne") : newRecord.patient,
        },
        onChange: (e) => {
            setNewRecord((prevState) => ({
                ...prevState,
                patient: e.label,
                patientid: e.value,
            }));
        },
    });

    async function handleSaveHealthRecord() {
        await axios
            .post("/api/insert", {
                table: "healthmonitoring",
                columns: [
                    "centerid",
                    "patientid",
                    "bloodpressure",
                    "heartrate",
                    "temperature",
                    "respiratory",
                    "created",
                    "nurseid",
                ],
                values: [
                    UserState.value.data.centerid,
                    newRecord.patientid,
                    newRecord.bloodpressure,
                    Number(newRecord.heartrate),
                    Number(newRecord.temperature),
                    Number(newRecord.respiratory),
                    moment().valueOf(),
                    UserState.value.data.id,
                ],
            })
            .then((response) => {
                setLoading(false);
                onClose();
                fetchData(UserState.value.data.centerid);
            })
            .catch((e) => {
                setLoading(false);
                showToastFailed(
                    toast,
                    toastIdRef,
                    t("Failed"),
                    e?.response?.data?.message
                );
            });
    }

    const sideLinks = GetLinkItems(page);

    return (
        <Sidebar LinkItems={sideLinks}>
            <Flex
                flex={1}
                gap={"20px"}
                p={"32px"}
                flexDir="column"
                overflowX={"auto"}
            >
                <Text color={colorMode === 'dark' && 'gray.300'}variant="heading"> {t("healthMonitoring")}</Text>

                <HStack width={"100%"} p={5} justify={"space-between"}>
                    <div style={{ display: "flex", width: "100%", maxWidth: "600px" }}>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={CiSearch} boxSize={5} color="#667085" />
                            </InputLeftElement>
                            <Input
                                placeholder={t("search")}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </InputGroup>
                    </div>
                    {page == 'nurse' &&
                        <Button
                            leftIcon={<AddIcon mt={"-2px"} boxSize={4} />}
                            onClick={onOpen}
                        >
                            {t("newEntry")}
                        </Button>
                    }
                </HStack>

                <Grid
                    width={"100%"}
                    templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(1, 1fr)",
                        lg: "repeat(2, 1fr)",
                        xl: "repeat(2, 1fr)",
                    }}
                    gap={4}
                    p={4}
                >
                    {data
                        .filter((item) => {
                            const string = `${item?.patient?.firstname || ""} ${item?.patient?.lastname
                                }`;
                            if (
                                string.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                            ) {
                                return item;
                            }
                        })
                        .map((item, index) => (
                            <HealthMonitoringCard key={index} data={item} type={page} colorMode={colorMode} bdColor={bdColor}/>
                        ))}
                </Grid>
            </Flex>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay bg={"#344054B2"} />

                <AlertDialogContent p={5}>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <VStack alignItems={"flex-start"} gap={5} width={"inherit"}>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"}fontSize={"18px"} fontWeight={"500"} >
                                {t("regularCheckup")}
                            </Text>
                            <VStack alignItems={"flex-start"} spacing={0} width={"100%"}>
                                <div>
                                    <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("patient")}</Text>
                                </div>
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
                            </VStack>
                            <VStack alignItems={"flex-start"} spacing={0} width={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("bloodPressure")}</Text>
                                <HStack w={"inherit"} justify={"space-between"}>
                                    <HStack>
                                        <Input
                                            width={"140px"}
                                            value={newRecord.bpleft}
                                            onChange={(e) => {
                                                setNewRecord((prevState) => {
                                                    let newState = { ...prevState };
                                                    newState.bpleft = e.target.value;
                                                    newState.bloodpressure = `${newState.bpleft}/${newState.bpright}`;
                                                    return newState;
                                                });
                                            }}
                                        />
                                        <div>
                                            <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>/</Text>
                                        </div>
                                        <Input
                                            width={"140px"}
                                            value={newRecord.bpright}
                                            onChange={(e) => {
                                                setNewRecord((prevState) => {
                                                    let newState = { ...prevState };
                                                    newState.bpright = e.target.value;
                                                    newState.bloodpressure = `${newState.bpleft}/${newState.bpright}`;
                                                    return newState;
                                                });
                                            }}
                                        />
                                    </HStack>
                                    <div>
                                        <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>mmHg</Text>
                                    </div>
                                </HStack>
                            </VStack>

                            <VStack alignItems={"flex-start"} spacing={0} width={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("heartRate")}</Text>
                                <HStack w={"inherit"} justify={"space-between"}>
                                    <Input
                                        width={"300px"}
                                        value={newRecord.heartrate}
                                        onChange={(e) =>
                                            setNewRecord((prevState) => {
                                                let newState = { ...prevState };
                                                newState.heartrate = e.target.value;
                                                return newState;
                                            })
                                        }
                                    />
                                    <div>
                                        <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>bpm</Text>
                                    </div>
                                </HStack>
                            </VStack>

                            <VStack alignItems={"flex-start"} spacing={0} width={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("temperature")}</Text>
                                <HStack w={"inherit"} justify={"space-between"}>
                                    <Input
                                        width={"300px"}
                                        value={newRecord.temperature}
                                        onChange={(e) =>
                                            setNewRecord((prevState) => {
                                                let newState = { ...prevState };
                                                newState.temperature = e.target.value;
                                                return newState;
                                            })
                                        }
                                    />
                                    <div>
                                        <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>°F</Text>
                                    </div>
                                </HStack>
                            </VStack>

                            <VStack alignItems={"flex-start"} spacing={0} width={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("respiratoryRate")}</Text>
                                <HStack w={"inherit"} justify={"space-between"}>
                                    <Input
                                        width={"300px"}
                                        value={newRecord.respiratory}
                                        onChange={(e) =>
                                            setNewRecord((prevState) => {
                                                let newState = { ...prevState };
                                                newState.respiratory = e.target.value;
                                                return newState;
                                            })
                                        }
                                    />
                                    <div>
                                        <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>bpm</Text>
                                    </div>
                                </HStack>
                            </VStack>
                        </VStack>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <GhostButton onClick={onClose}>
                            {t("cancel")}
                        </GhostButton>
                        <Button
                            isDisabled={
                                !newRecord.patientid ||
                                !newRecord.bpleft ||
                                !newRecord.bpright ||
                                !newRecord.respiratory ||
                                !newRecord.temperature ||
                                !newRecord.heartrate
                            }
                            isLoading={loading}
                            onClick={() => {
                                setLoading(true);
                                handleSaveHealthRecord();
                            }}
                            ml={3}
                        >
                            {t("save")}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Sidebar>
    );
}
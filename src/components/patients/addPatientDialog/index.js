"use client"
import { useColorMode, AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, VStack, HStack, Box, UnorderedList, ListItem, Text, useColorModeValue, useToast, Input, Select } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import {
    Select as SearchableSelect,
    useChakraSelectProps,
} from "chakra-react-select";
import { CountriesList, theme } from "@/data/data";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/config/firebase";
import Button, { GhostButton } from "@/components/ui/Button";
import axios from "axios";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/store/context/UserContext";
import Calendar from "@/components/ui/Calendar";
import InputImageRow from "@/components/ui/InputImageRow";


const AddPatientDialog = ({ onClose, isOpen, allInsurances = [], onSave, loading }) => {
    const t = useTranslations("Dictionary")
    const { colorMode } = useColorMode()
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.600')
    const [imageLoading, setImageLoading] = useState(false)
    const toast = useToast()

    const [patientForm, setPatientForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        number: "",
        address: "",
        insurancenumber: "",
        insuranceprovider: "",
        insuranceexpiry: "",
        percentage: 0,
        gender: "",
        dob: "",
        insuranceid: null,
        insurancetype: "",
        insurancecard: "",
        insurances: []

    });
    const [patientInsurances, setPatientInsurances] = useState({
        insuranceid: null,
        insurancetype: "",
        insurancecard: "",
        insurancenumber: "",
        insuranceprovider: "",
        insuranceexpiry: "",
        insurancepercentage: 0,
    })

    const [code, setCode] = useState({ value: "", label: "" });

    const codeSelectProps = useChakraSelectProps({
        value: code,
        onChange: setCode,
    });

    const customChakraStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: bdColor,
        }),
    };

    async function handleUploadFile(imgLink) {

        try {
            const response = await fetch(imgLink);
            const blob = await response.blob();

            const name = `${new Date().getTime().toString()}-insurancecard.png`;

            const metadata = {
                contentType: "image/png",
            };
            const storageRef = ref(storage, `${patientForm.email}/images/` + name);
            const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                    }
                },
                (error) => {
                    setImageLoading(false)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageLoading(false)
                        setPatientInsurances((prevState) => ({ ...prevState, insurancecard: downloadURL }))
                    });
                }
            );
        } catch (error) {
            setImageLoading(false)
            toast({
                title: "Échoué",
                description: "Erreur lors du téléchargement du fichier vers le stockage",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });

        }
    }

    function handleClearAll() {
        setPatientForm({
            firstname: "",
            lastname: "",
            email: "",
            number: "",
            address: "",
            insurancenumber: "",
            insuranceprovider: "",
            insuranceexpiry: "",
            percentage: 0,
            gender: "",
            dob: "",
            insuranceid: null,
            insurancetype: "",
            insurancecard: "",
            insurances: []

        });
        setPatientInsurances({
            insuranceid: null,
            insurancetype: "",
            insurancecard: "",
            insurancenumber: "",
            insuranceprovider: "",
            insuranceexpiry: "",
            insurancepercentage: 0,
        })

        setCode({ value: "", label: "" });
    }
    return (
        <AlertDialog
            motionPreset="slideInBottom"
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            closeOnOverlayClick={false}
        >
            <AlertDialogOverlay bg={"#344054B2"} />

            <AlertDialogContent width={"100%"} maxW={'80vw'} maxH={'98vh'} overflowY={'auto'}>
                <AlertDialogCloseButton onClick={() => handleClearAll()} />
                <AlertDialogBody>
                    <HStack align={'flex-start'} gap={10}>
                        <VStack alignItems={"flex-start"} gap={5} w={"100%"} py={"10px"}>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"} fontSize={"18px"} fontWeight={"500"} >
                                {t("addNewPatient")}
                            </Text>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#667085"} fontSize={"14px"} fontWeight={"400"} >
                                {t("addNewPatientSubheading")}
                            </Text>
                            <HStack align={'flex-start'} w={'100%'}>
                                <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("firstName")}</Text>
                                    <Input
                                        placeholder={t("inputFirstNamePatient")}
                                        value={patientForm.firstname}
                                        onChange={(e) =>
                                            setPatientForm((prevState) => {
                                                const newState = { ...prevState };
                                                newState.firstname = e.target.value;
                                                return newState;
                                            })
                                        }
                                    />
                                </VStack>

                                <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("lastName")}</Text>
                                    <Input
                                        placeholder={t("inputLastNamePatient")}
                                        value={patientForm.lastname}
                                        onChange={(e) =>
                                            setPatientForm((prevState) => {
                                                const newState = { ...prevState };
                                                newState.lastname = e.target.value;
                                                return newState;
                                            })
                                        }
                                    />
                                </VStack>
                                <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("gender")}</Text>
                                    <Select value={patientForm.gender} onChange={(e) => setPatientForm((prevState) => {
                                        const newState = { ...prevState }
                                        newState.gender = e.target.value
                                        return newState
                                    })}>
                                        <option value={""}>
                                            {t("selectOne")}
                                        </option>
                                        <option value="male">{t("male")}</option>
                                        <option value="female">{t("female")}</option>

                                    </Select>
                                </VStack>
                            </HStack>


                            <HStack align={'flex-start'} w={'100%'}>


                                <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("dob")}</Text>
                                    <Calendar
                                        value={patientForm.dob ? new Date(patientForm.dob) : ""}
                                        onChange={(e) => {
                                            setPatientForm((prevState) => {
                                                const newState = { ...prevState };
                                                newState.dob = new Date(e.value).getTime();
                                                return newState;
                                            })
                                        }} />

                                </VStack>

                                <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("phoneNumber")}</Text>
                                    <HStack align={'flex-start'} w={'inherit'}>
                                        <div style={{ width: "250px" }}>
                                            <SearchableSelect
                                                id="select-code"
                                                useBasicStyles
                                                chakraStyles={customChakraStyles}
                                                colorScheme="blue"
                                                options={CountriesList.map((item) => {
                                                    return {
                                                        value: item.num,
                                                        label: item.num,
                                                    };
                                                })}
                                                {...codeSelectProps}
                                            />
                                        </div>
                                        <Input

                                            placeholder={t("patientPhoneNumberInput")}
                                            onChange={(e) =>
                                                setPatientForm((prevState) => {
                                                    const newState = { ...prevState };
                                                    newState.number = code.value + e.target.value.replace(/[^0-9]/g, '');
                                                    return newState;
                                                })
                                            }
                                        />
                                    </HStack>

                                </VStack>

                            </HStack>


                            <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("email")}</Text>
                                <Input
                                    placeholder={t("patientEmailInput")}
                                    value={patientForm.email}
                                    onChange={(e) =>
                                        setPatientForm((prevState) => {
                                            const newState = { ...prevState };
                                            newState.email = e.target.value;
                                            return newState;
                                        })
                                    }
                                />
                            </VStack>

                            <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("address")}</Text>
                                <Input
                                    placeholder={t("patientAddressInput")}
                                    value={patientForm.address}
                                    onChange={(e) =>
                                        setPatientForm((prevState) => {
                                            const newState = { ...prevState };
                                            newState.address = e.target.value;
                                            return newState;
                                        })
                                    }
                                />
                            </VStack>
                            <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("insurance")}</Text>
                                <Box borderRadius={'6px'} w={'100%'} h={'140px'} overflowY={'auto'} border={'1px solid'} borderColor={bdColor} p={5}>

                                    <UnorderedList

                                        fontSize={"14px"}
                                        fontWeight={"500"}
                                        color={"#344054"}
                                    >
                                        {patientForm?.insurances.length > 0 && patientForm?.insurances.map((item, index) => (
                                            <ListItem key={index}>
                                                {`${item.insuranceprovider} (${item.insurancenumber})`}
                                            </ListItem>
                                        ))

                                        }
                                    </UnorderedList>

                                </Box>
                            </VStack>


                        </VStack>

                        {patientForm.email &&

                            <VStack alignItems={"flex-start"} gap={5} w={"100%"} py={"10px"}>

                                <VStack alignItems={"flex-start"} gap={5} w={"100%"} py={"10px"}>
                                    <HStack align={'flex-start'} w={'100%'}>
                                        <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                            <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("insurance")}</Text>
                                            <Select
                                                value={patientInsurances.insuranceprovider}
                                                onChange={(e) => {
                                                    const selectedIndex = e.target.selectedIndex;
                                                    const selectedOption = e.target.options[selectedIndex];
                                                    const insuranceId = selectedOption.getAttribute('data-id');
                                                    const insuranceName = selectedOption.value;

                                                    setPatientInsurances((prevState) => {
                                                        const newState = { ...prevState }
                                                        newState.insuranceid = Number(insuranceId)
                                                        newState.insuranceprovider = insuranceName
                                                        return newState
                                                    })
                                                }}
                                            >
                                                <option data-id={null} value="">
                                                    {t("selectOne")}
                                                </option>

                                                {allInsurances.length > 0 &&
                                                    allInsurances.map((item, index) => (
                                                        <option key={index} data-id={item.id} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                            </Select>
                                        </VStack>


                                    </HStack>
                                    {patientInsurances.insuranceid &&
                                        <>

                                            <InputImageRow loading={imageLoading} title={t("image")} image={patientInsurances?.insurancecard} onReturn={(file) => {
                                                setImageLoading(true)
                                                handleUploadFile(URL.createObjectURL(file))
                                            }}
                                                onDeleteImage={() => {
                                                    setPatientInsurances((prevState) => {
                                                        const newState = { ...prevState }
                                                        newState.insurancecard = ""
                                                        return newState
                                                    })
                                                }} />



                                            <HStack w={'100%'} align={'flex-start'}>
                                                <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("insuranceNumber")}</Text>
                                                    <Input
                                                        disabled={!patientInsurances.insuranceprovider}
                                                        placeholder={t("patientInsuranceInput")}
                                                        value={patientInsurances.insurancenumber}
                                                        onChange={(e) =>
                                                            setPatientInsurances((prevState) => {
                                                                const newState = { ...prevState }
                                                                newState.insurancenumber = e.target.value
                                                                return newState
                                                            })

                                                        }
                                                    />
                                                </VStack>
                                                <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("type")}</Text>
                                                    <Select disabled={!patientInsurances.insuranceprovider} value={patientInsurances.insurancetype} onChange={(e) =>
                                                        setPatientInsurances((prevState) => {
                                                            const newState = { ...prevState }
                                                            newState.insurancetype = e.target.value
                                                            return newState
                                                        })}>
                                                        <option value={""}>
                                                            {t("selectOne")}
                                                        </option>
                                                        <option value="public">{t("public")}</option>
                                                        <option value="private">{t("private")}</option>

                                                    </Select>
                                                </VStack>
                                            </HStack>

                                            <HStack w={'100%'} align={'flex-start'}>
                                                <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("coveragePercentage")}</Text>
                                                    <Input
                                                        disabled={!patientInsurances.insuranceprovider}
                                                        placeholder={t("coveragePercentageInput")}
                                                        value={patientInsurances.insurancepercentage}
                                                        onChange={(e) => {
                                                            const value = e.target.value.trim();


                                                            if (/^\d*\.?\d*$/.test(value)) {
                                                                setPatientInsurances((prevState) => ({
                                                                    ...prevState,
                                                                    insurancepercentage: value
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                </VStack>
                                                <VStack align={"flex-start"} gap={0} w={"inherit"}>
                                                    <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading">{t("insuranceExpiry")}</Text>
                                                    <Calendar
                                                        disabled={!patientInsurances.insuranceprovider}
                                                        className="custom-datepicker"
                                                        value={patientInsurances.insuranceexpiry ? new Date(patientInsurances.insuranceexpiry) : ""}
                                                        onChange={(e) => {
                                                            setPatientInsurances((prevState) => {
                                                                const newState = { ...prevState }
                                                                newState.insuranceexpiry = new Date(e.value).getTime();
                                                                return newState
                                                            })
                                                        }} />
                                                </VStack>
                                            </HStack>

                                            <Button isDisabled={!patientInsurances.insuranceexpiry || !patientInsurances.insurancecard || !patientInsurances.insuranceid || !patientInsurances.insurancenumber || !patientInsurances.insuranceprovider || !patientInsurances.insurancetype || !patientInsurances.insurancepercentage} w={"100%"} onClick={() => {
                                                let temp = [...patientForm.insurances]
                                                if (temp.length > 0) {
                                                    const exists = temp.some(
                                                        (entry) =>
                                                            entry.insuranceprovider === patientInsurances.insuranceprovider &&
                                                            entry.insurancenumber === patientInsurances.insurancenumber
                                                    );

                                                    if (!exists) {
                                                        temp.push(patientInsurances)
                                                        setPatientForm((prevState) => ({ ...prevState, insurances: [...temp] }))
                                                        setPatientInsurances({ insurancecard: "", insuranceexpiry: '', insuranceid: "", insurancenumber: "", insuranceprovider: "", insurancetype: "", insurancepercentage: 0 })
                                                    }
                                                } else {
                                                    temp.push(patientInsurances)
                                                    setPatientForm((prevState) => ({ ...prevState, insurances: [...temp] }))
                                                    setPatientInsurances({ insurancecard: "", insuranceExpiry: '', insuranceid: "", insurancenumber: "", insuranceprovider: "", insurancetype: "", insurancepercentage: 0 })
                                                }
                                            }}>
                                                {t("add")}
                                            </Button>

                                        </>
                                    }
                                </VStack>



                            </VStack>
                        }
                    </HStack>
                </AlertDialogBody>
                <AlertDialogFooter w={"100%"} justifyContent={"space-between"}>
                    <GhostButton w={"100%"} onClick={()=>{
                        handleClearAll()
                        onClose()}}>
                        {t("cancel")}
                    </GhostButton>
                    <Button
                        isDisabled={!patientForm.firstname || !patientForm.lastname || !patientForm.email || !patientForm.number || !patientForm.gender}
                        isLoading={loading}
                        w={"100%"}
                        ml={3}
                        onClick={() => {
                            onSave(patientForm)
                        }}
                    >
                        {t("save")}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AddPatientDialog
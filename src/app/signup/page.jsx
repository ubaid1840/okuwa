"use client";
import Logo from "@/components/logo";
import {
  Box,
  Flex,
  Image,
  Text,
  VStack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Input,
  Stack,
  Textarea,
  Icon,
  Select,
  HStack,
  Divider,
  Tooltip,
  List,
  ListItem,
  useToast,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Button, { GhostButton } from "@/components/ui/Button";
import { IoIosInformationCircleOutline } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendar } from "react-icons/ci";
import { CountriesList, theme } from "@/data/data";
import {
  Select as SearchableSelect,
  useChakraSelectProps,
} from "chakra-react-select";
import { AddIcon, ChevronDownIcon, MinusIcon } from "@chakra-ui/icons";
import Dropzone from "@/components/DropZone";
import { HospitalContext } from "@/store/context/HospitalContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SocialMediaSelection from "@/components/ui/SocialMediaSelection";
import { geocode, RequestType, setKey } from "react-geocode";
import { MdMyLocation } from "react-icons/md";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db, storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import axios from "@/lib/axiosInstance";
import { FooterOne, FooterTwo } from "@/components/Footer";
import { showToastFailed } from "@/utils/toastUtils";
import Calendar from "@/components/ui/Calendar";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";

export default function Page() {
  const {colorMode} = useColorMode()
  const bgColor  =useColorModeValue(theme.color.background, "gray.900") 
  const t = useTranslations("Dictionary");
  const steps = AllSteps();
  const updateRef = useRef(null);
  const toastIdRef = useRef(null)
  const [startRegistration, setStartRegistration] = useState(false);
  const [date, setDate] = useState(new Date());
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [hospitalForm, setHospitalForm] = useState({
    generalInformation: {
      centerID: "",
      image: "",
      centerName: "",
      description: "",
      centerType: "Selectionner",
      status: "Selectionner",
      foundationDate: new Date().getTime(),
    },
    address: {
      country: "",
      city: "",
      neighborhood: "",
      address: "",
    },
    contact: {
      phoneNumber: "",
      faxNumber: "",
      email: "",
      website: "",
      socialMedia: [],
    },
    manager: {
      directorName: "",
      directorOccupation: "",
      signature: "",
    },
    finances: {
      bankName: "",
      accountNumber: "",
      bankOwnerName: "",
      bankAddress: "",
      bankSwiftCode: "",
      bankIBAN: "",
      mobileMoneyService: "Selectionner",
      mobileMoneyCode: "",
      mobileMoneyName: "",
      taxImage: "",
    },
    approved: false,
  });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const { state: HospitalState, setHospital } = useContext(HospitalContext);
  const router = useRouter();
  const [smm, setSmm] = useState([
    {
      selection: "Facebook",
      input: "",
    },
  ]);

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [insuranceType, setInsuranceType] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [code, setCode] = useState({ value: "", label: "" });
  const toast = useToast();

  const countrySelectProps = useChakraSelectProps({
    value: country,
    onChange: setCountry,
  });

  const codeSelectProps = useChakraSelectProps({
    value: code,
    onChange: setCode,
  });

  const citySelectProps = useChakraSelectProps({
    value: city,
    onChange: setCity,
  });

  const neighborhoodSelectProps = useChakraSelectProps({
    value: state,
    onChange: setState,
  });

  async function fetchLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError("Unable to retrieve your location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }

  // const checkSession = useCheckSession();

  // useEffect(() => {
  //   checkSession()
  // }, []);

  useEffect(() => {
    if (location.lat && location.lng) {
      setKey("AIzaSyCIn1bSbDB5U_jS0eDY9vlrE4PogTsg5lY");
      // Replace with your Google Maps Geocoding API key

      geocode(RequestType.LATLNG, `${location.lat},${location.lng}`, {
        location_type: "ROOFTOP", // Override location type filter for this request.
        enable_address_descriptor: true, // Include address descriptor in response.
      })
        .then(({ results }) => {
          const address = results[0].formatted_address;
          const { city, state, country } = results[0].address_components.reduce(
            (acc, component) => {
              if (component.types.includes("locality"))
                acc.city = component.long_name;
              else if (component.types.includes("administrative_area_level_1"))
                acc.state = component.long_name;
              else if (component.types.includes("country"))
                acc.country = component.long_name;
              return acc;
            },
            {}
          );
          setHospitalForm((prevState) => {
            const newState = { ...prevState };
            newState.address.address = address;
            newState.address.country = country;
            newState.address.city = city;
            newState.address.neighborhood = state;
            return newState;
          });

          setCountry({
            value: country,
            label: country,
          });
          setCity({
            value: city,
            label: city,
          });
          setState({
            value: state,
            label: state,
          });
        })
        .catch(console.error);
    }
  }, [location]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/positions"
        );
        const data = await response.json();
        const countryOptions = data.data.map((country) => ({
          value: country.name,
          label: country.name,
        }));
        setCountries(countryOptions);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }

    fetchCountries();
  }, []);

  const IncompleteIcon = () => {
    const size = "10px";
    return (
      <div
        style={{
          height: size,
          width: size,
          borderRadius: "10px",
          backgroundColor: "#EAECF0",
        }}
      ></div>
    );
  };

  const ActiveIcon = () => {
    const size = "10px";
    return (
      <div
        style={{
          height: size,
          width: size,
          borderRadius: "10px",
          backgroundColor: theme.color.primary,
        }}
      ></div>
    );
  };

  const handleFileChange = async (e, type) => {
    if (e.target.files && e.target.files[0]) {
      setImageLoading(true);
      await uploadFiles(e.target.files[0], type);
    }
  };

  const RenderUpdateText = useCallback(() => {
    return (
      <Text
        onClick={() => {
          if (updateRef.current) updateRef.current.click();
        }}
        _hover={{ cursor: "pointer" }}
        style={{
          color: theme.color.primary,
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Update
      </Text>
    );
  }, [hospitalForm]);

  function handleNext() {
    const index = activeStep;
    if (index != 4) {
      setActiveStep(index + 1);
    }
  }

  function handlePrev() {
    const index = activeStep;
    if (index != 0) {
      setActiveStep(index - 1);
    }
  }

  const customChakraStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: theme.input.border, // Customize the border color here
    }),
  };

  const handleDrop = async (type, file) => {
    if (file) {
      setImageLoading(true);
      await uploadFiles(file, type);
    }
  };

  const TooltipLabel = () => {
    const t = useTranslations("Dictionary");
    return (
      <Box>
        <List spacing={2} fontSize={"12px"} color={'whitesmoke'}>
          <ListItem>
            <b>{t("publicHospital")} </b>
            {t("publicHospitalDescription")}
          </ListItem>
          <ListItem>
            <b>{t("privateHospital")} </b>
            {t("privateHospitalDescription")}
          </ListItem>
          <ListItem>
            <b>{t("clinic")} </b>
            {t("clinicDescription")}
          </ListItem>
          <ListItem>
            <b>{t("diagnosisCenter")} </b>
            {t("diagnosisCenterDescription")}
          </ListItem>
          <ListItem>
            <b>{t("medicalCenter")} </b>
            {t("medicalCenterDescription")}
          </ListItem>
        </List>
      </Box>
    );
  };

  async function handleSignup() {
    let temp = {
      ...hospitalForm.address,
      ...hospitalForm.contact,
      ...hospitalForm.finances,
      ...hospitalForm.generalInformation,
      ...hospitalForm.manager,
      approved: hospitalForm.approved,
    };

    temp.socialMedia = [...smm];
    const num = code.value + temp.phoneNumber;
    temp.phoneNumber = num;
    axios
      .post("/api/newroutes/superadmin", temp)
      .then(async (response) => {
        await sendPasswordResetEmail(auth, temp.email, {
          url: `${window.location.origin}/login`,
        })
          .then(() => {
            setLoading(false);
            router.push("/signup/registrationsuccessfull");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoading(false);
            showToastFailed(toast, toastIdRef, t("Failed"), error.message)
            // ..
          });
      })
      .catch((e) => {
        setLoading(false);
        showToastFailed(toast, toastIdRef, t("Failed"), e?.response?.data?.message)
      });

    // console.log(hospitalForm)
  }

  const uploadFiles = async (item, type) => {
    const name = type + ".png";
    const metadata = {
      contentType: "image/png",
    };
    const storageRef = ref(
      storage,
      `HC${hospitalForm.generalInformation.centerID}/images/` + name
    );
    const uploadTask = uploadBytesResumable(storageRef, item, metadata);
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
        setImageLoading(false);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageLoading(false);
          if (type == "logo") {
            setHospitalForm((prevState) => {
              const newState = { ...prevState };
              newState.generalInformation.image = downloadURL;
              return newState;
            });
          } else if (type == "signature") {
            setHospitalForm((prevState) => {
              const newState = { ...prevState };
              newState.manager.signature = downloadURL;
              return newState;
            });
          } else if (type == "tax") {
            setHospitalForm((prevState) => {
              const newState = { ...prevState };
              newState.finances.taxImage = downloadURL;
              return newState;
            });
          }
        });
      }
    );
  };

  return !startRegistration ? (
    <Flex height="100vh">
       <Box pos={"fixed"} top={5} right={10}>
        <DarkModeSwitcher />
      </Box>
      <Flex flex={1} direction="column" justify="space-between" align="center">
        <VStack
          width={"400px"}
          alignItems={"flex-start"}
          spacing={4}
          justify="center"
          flex={1}
        >
          <Logo />

          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("welcomeToDoctoCare")}</Text>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="description">{t("description1")}</Text>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="description">{t("description2")}</Text>
          <Button width={"100%"} onClick={() => setStartRegistration(true)}>
            {t("startRegistration")}
          </Button>
        </VStack>
        <FooterOne />
      </Flex>
      <Flex flex={1}>
        <Image
          src="/assets/signup.png"
          alt="Full Size Image"
          objectFit="cover"
          height="100%"
        />
      </Flex>
    </Flex>
  ) : (
    <Flex height="100vh">
       <Box pos={"fixed"} top={5} right={10}>
        <DarkModeSwitcher />
      </Box>
      <Flex
        width={"30%"}
        paddingTop={"48px"}
        paddingLeft={"40px"}
        paddingRight={"40px"}
        bg={bgColor}
        direction="column"
        justify="space-between"
        alignItems="center"
      >
        <VStack alignItems={"flex-start"} spacing={10} flex={1}>
          <Logo />
          <Stepper
            index={activeStep}
            orientation="vertical"
            height="400px"
            gap="36px"
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator
                  borderColor={"#EAECF0"}
                  sx={{
                    "[data-status=complete] &": {
                      backgroundColor: `${colorMode === 'light' ? "white" : "gray.300"}`,
                      border: "2px solid",
                      borderColor: theme.color.primary,
                    },
                    "[data-status=active] &": {
                      borderColor: theme.color.primary,
                    },
                    "[data-status=incomplete] &": {
                      borderColor: "#EAECF0",
                    },
                  }}
                >
                  <StepStatus
                    complete={<StepIcon color={theme.color.primary} />}
                    incomplete={<IncompleteIcon />}
                    active={<ActiveIcon />}
                  />
                </StepIndicator>
                <Box>
                  <StepTitle
                    style={{
                      color:
                        activeStep == index ? theme.color.primary : "#344054",
                      fontWeight: "500",
                      fontSize: "16px",
                    }}
                  >
                    {step.title}
                  </StepTitle>
                  <StepDescription
                    style={{
                      color:
                        activeStep == index ? theme.color.primary :  "#667085",
                      fontWeight: "400",
                      fontSize: "16px",
                    }}
                  >
                    {step.description}
                  </StepDescription>
                </Box>
              </Step>
            ))}
          </Stepper>
        </VStack>
        <FooterTwo />
      </Flex>
      <Flex
        width={"70%"}
        justifyContent={"center"}
        overflowY={"auto"}
        paddingTop={"32px"}
      >
        {activeStep == 0 && (
          <VStack alignItems={"flex-start"} width={"50%"} spacing={5}>
            <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("generalInformation")}</Text>
            <Text color={colorMode === 'dark' && 'gray.300'}variant="description" width={"100%"}>
              {t("generalInformationSubheading")}
            </Text>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("healthcareCenterID")}</Text>
              <Input
                isDisabled
                value={`HC${hospitalForm.generalInformation.centerID}`}
              />
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("logo")}</Text>
              {hospitalForm.generalInformation.image ? (
                <HStack spacing={5}>
                  <Box
                    border={"1px solid"}
                    borderColor={theme.input.border}
                    borderRadius={"8px"}
                    display={"flex"}
                    flexDir={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    padding={"16px"}
                  >
                    <Image
                      src={hospitalForm.generalInformation.image}
                      height={"100px"}
                      width={"100px"}
                    />
                  </Box>
                  <Text
                    _hover={{ cursor: "pointer" }}
                    color={theme.input.label}
                    fontSize={"14px"}
                    fontWeight={"500"}
                    onClick={() =>
                      setHospitalForm((prevState) => {
                        const newState = { ...prevState };
                        newState.generalInformation.image = "";
                        return newState;
                      })
                    }
                  >
                    {t("delete")}
                  </Text>
                  <RenderUpdateText />
                  <input
                    style={{ display: "none" }}
                    ref={updateRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "logo")}
                  />
                </HStack>
              ) : (
                <Dropzone
                borderColor={true}
                colorMode={colorMode}
                  loading={imageLoading}
                  onDrop={(file) => handleDrop("logo", file)}
                  title={t("clickToUpload")}
                  subheading={t("dragAndDrop")}
                  description={t("descriptionDropzone")}
                  drag={t("drag")}
                />
              )}
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("healthcareCenterName")}</Text>
              <Input
                placeholder={t("healthcareCenterNameInput")}
                value={hospitalForm.generalInformation.centerName}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.generalInformation.centerName = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("emailAdmin")}</Text>
              <Input
                placeholder={t("emailInput")}
                type="email"
                value={hospitalForm.contact.email}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.contact.email = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("description")}</Text>
              <Textarea
                placeholder={t("healthcareCenterDescriptionInput")}
                value={hospitalForm.generalInformation.description}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.generalInformation.description = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text
                  fontSize={"14px"}
                  fontWeight="500 "
                  color={colorMode == 'light' ? theme.input.label : "gray.300"}
                >
                  {t("type")}
                </Text>
                <Tooltip
                  label={<TooltipLabel />}
                  placement="right"
                  hasArrow
                  padding={4}
                  borderRadius={5}
                  bg={"black"}
                >
                  <span style={{ marginLeft: "4px" }}>
                    <Icon as={IoIosInformationCircleOutline} />
                  </span>
                </Tooltip>
              </div>
              <Select
                value={hospitalForm.generalInformation.centerType}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.generalInformation.centerType = e.target.value;
                    return newState;
                  })
                }
              >
                <option disabled value="Selectionner">
                  Selectionner
                </option>
                <option value="publicHospital">{t("publicHospital")}</option>
                <option value="privateHospital">{t("privateHospital")}</option>
                <option value="clinic">{t("clinic")}</option>
                <option value="diagnosisCenter">{t("diagnosisCenter")}</option>
                <option value="medicalCenter">{t("medicalCenter")}</option>
              </Select>
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>{t("status")}</Text>
              <Select
                value={hospitalForm.generalInformation.status}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.generalInformation.status = e.target.value;
                    return newState;
                  })
                }
              >
                <option disabled value="Selectionner">
                  Selectionner
                </option>
                <option value="private">{t("private")}</option>
                <option value="public">{t("public")}</option>
              </Select>
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("foundationDate")}</Text>
              <Calendar  value={date}
                  onChange={(e) => {
                    setDate(e.value);
                    setHospitalForm((prevState) => {
                      const newState = { ...prevState };
                      newState.generalInformation.foundationDate = new Date(
                        e.value
                      ).getTime();
                      return newState;
                    });
                  }}/>
           
            </Stack>
            <HStack
              justifyContent={"flex-end"}
              width={"100%"}
              paddingBottom={"32px"}
            >
              <div>
                <GhostButton
                  onClick={() => setStartRegistration(false)}
                >
                  {t("cancel")}
                </GhostButton>
              </div>
              <div>
                <Button
                  // isDisabled={isAnyFieldEmpty("generalInformation")}
                  onClick={() => handleNext()}
                >
                  {t("continue")}
                </Button>
              </div>
            </HStack>
          </VStack>
        )}
        {activeStep == 1 && (
          <VStack
            alignItems={"flex-start"}
            width={"50%"}
            spacing={5}
            height={"fit-content"}
            alignSelf={"center"}
          >
            <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("address")}</Text>
            <Text color={colorMode === 'dark' && 'gray.300'}variant="description">{t("addressSubheading")}</Text>
            <Stack dir="column" spacing={1} width={"100%"}>
              <div>
                <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("country")}</Text>
              </div>
              <HStack width={"100%"}>
                <div style={{ width: "100%" }}>
                  <SearchableSelect
                    useBasicStyles
                    chakraStyles={customChakraStyles}
                    colorScheme="blue"
                    options={countries}
                    {...countrySelectProps}
                  />
                </div>
                <Icon
                  as={MdMyLocation}
                  boxSize={5}
                  _hover={{ cursor: "pointer", opacity: 0.7 }}
                  onClick={() => fetchLocation()}
                />
              </HStack>
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("city")}</Text>
              <Input
                value={hospitalForm.address.city}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.address.city = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>

            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("neighborhood")}</Text>
              <Input
                value={hospitalForm.address.neighborhood}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.address.neighborhood = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>

            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("address")}</Text>
              <Textarea
                height={150}
                resize={"none"}
                placeholder={t("addressInput")}
                value={hospitalForm.address.address}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.address.address = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>

            <HStack
              justifyContent={"flex-end"}
              width={"100%"}
              paddingBottom={"32px"}
            >
              <div>
                <GhostButton
                  onClick={() => handlePrev()}
                >
                  {t("back")}
                </GhostButton>
              </div>
              <div>
                <Button
                  // isDisabled={isAnyFieldEmpty("address")}
                  onClick={() => handleNext()}
                >
                  {t("continue")}
                </Button>
              </div>
            </HStack>
          </VStack>
        )}
        {activeStep == 2 && (
          <VStack
            alignItems={"flex-start"}
            width={"50%"}
            spacing={5}
            height={"fit-content"}
            alignSelf={"center"}
          >
            <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("contact")}</Text>
            <Text color={colorMode === 'dark' && 'gray.300'}variant="description">{t("contactSubheading")}</Text>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("phoneNumber")}</Text>
              <HStack>
                <div style={{ width: "200px" }}>
                  <SearchableSelect
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
                  placeholder={t("phoneNumberInput")}
                  type="number"
                  value={hospitalForm.contact.phoneNumber}
                  onChange={(e) =>
                    setHospitalForm((prevState) => {
                      const newState = { ...prevState };
                      newState.contact.phoneNumber = e.target.value;
                      return newState;
                    })
                  }
                />
              </HStack>
            </Stack>

            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("fax")}</Text>
              <Input
                placeholder={t("faxInput")}
                type="number"
                value={hospitalForm.contact.faxNumber}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.contact.faxNumber = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>

            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("website")}</Text>
              <Input
                placeholder={t("websiteInput")}
                type="url"
                value={hospitalForm.contact.website}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.contact.website = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>

            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("socialMedia")}</Text>
              <HStack align={"flex-end"}>
                <VStack width={"100%"} align={"flex-start"}>
                  {smm.map((item, index) => (
                    <SocialMediaSelection
                      key={index}
                      data={item}
                      onChangeInput={(e) => {
                        setSmm((prevState) => {
                          const newState = [...prevState];
                          newState[index].input = e.target.value;
                          return newState;
                        });
                      }}
                      onSMMSelection={(item) => {
                        setSmm((prevState) => {
                          const newState = [...prevState];
                          newState[index].selection = item;
                          return newState;
                        });
                      }}
                    />
                  ))}
                </VStack>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50px",
                  }}
                >
                  <AddIcon
                    mb={3}
                    boxSize={4}
                    color={"green"}
                    _hover={{ cursor: "pointer", opacity: 0.7 }}
                    onClick={() => {
                      let temp = [...smm];
                      temp.push({ selection: "Facebook", input: "" });
                      setSmm([...temp]);
                    }}
                  />
                  {smm.length !== 1 && (
                    <MinusIcon
                      mb={3}
                      boxSize={4}
                      color={"red"}
                      _hover={{ cursor: "pointer", opacity: 0.7 }}
                      onClick={() => {
                        let temp = [...smm];
                        temp.pop();
                        setSmm([...temp]);
                      }}
                    />
                  )}
                </div>
              </HStack>
            </Stack>

            <HStack
              justifyContent={"flex-end"}
              width={"100%"}
              paddingBottom={"32px"}
            >
              <div>
                <GhostButton
                  onClick={() => handlePrev()}
                >
                  {t("back")}
                </GhostButton>
              </div>
              <div>
                <Button
                  // isDisabled={isAnyFieldEmpty("contact")}
                  onClick={() => handleNext()}
                >
                  {t("continue")}
                </Button>
              </div>
            </HStack>
          </VStack>
        )}
        {activeStep == 3 && (
          <VStack
            alignItems={"flex-start"}
            width={"50%"}
            spacing={5}
            height={"fit-content"}
            alignSelf={"center"}
          >
            <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("manager")}</Text>
            <Text color={colorMode === 'dark' && 'gray.300'}variant="description">{t("managerSubheading")}</Text>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading"> {t("directorName")}</Text>
              <Input
                placeholder={t("directorNameInput")}
                value={hospitalForm.manager.directorName}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.manager.directorName = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading"> {t("occupation")}</Text>
              <Input
                placeholder={t("occupationInput")}
                value={hospitalForm.manager.directorOccupation}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.manager.directorOccupation = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading"> {t("signature")}</Text>
              {hospitalForm.manager.signature ? (
                <HStack spacing={5}>
                  <Box
                    border={"1px solid"}
                    borderColor={theme.input.border}
                    borderRadius={"8px"}
                    display={"flex"}
                    flexDir={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    padding={"16px"}
                  >
                    <Image
                      src={hospitalForm.manager.signature}
                      height={"100px"}
                      width={"100px"}
                    />
                  </Box>
                  <Text
                    _hover={{ cursor: "pointer" }}
                    color={theme.input.label}
                    fontSize={"14px"}
                    fontWeight={"500"}
                    onClick={() =>
                      setHospitalForm((prevState) => {
                        const newState = { ...prevState };
                        newState.manager.signature = "";
                        return newState;
                      })
                    }
                  >
                    {t("delete")}
                  </Text>
                  <RenderUpdateText />
                  <input
                    style={{ display: "none" }}
                    ref={updateRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "signature")}
                  />
                </HStack>
              ) : (
                <Dropzone
                borderColor={true}
                colorMode={colorMode}
                  loading={imageLoading}
                  onDrop={(file) => handleDrop("signature", file)}
                  title={t("clickToUpload")}
                  subheading={t("dragAndDrop")}
                  description={t("descriptionDropzone")}
                  drag={t("drag")}
                />
              )}
            </Stack>

            <HStack
              justifyContent={"flex-end"}
              width={"100%"}
              paddingBottom={"32px"}
            >
              <div>
               <GhostButton
                  onClick={() => handlePrev()}
                >
                  {t("back")}
                </GhostButton>
              </div>
              <div>
                <Button
                  // isDisabled={isAnyFieldEmpty("manager")}
                  onClick={() => handleNext()}
                >
                  {t("continue")}
                </Button>
              </div>
            </HStack>
          </VStack>
        )}
        {activeStep == 4 && (
          <VStack alignItems={"flex-start"} width={"50%"} spacing={5}>
            <Text color={colorMode === 'dark' && 'gray.300'}variant="heading"> {t("financesInformation")}</Text>
            <Text color={colorMode === 'dark' && 'gray.300'}variant="description"> {t("managerSubheading")}</Text>
            <Text color={colorMode === 'dark' && 'gray.300'}fontSize={"16px"} fontWeight={"500"}>
              {t("bankAccount")}
            </Text>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("bankName")}</Text>
              <Input
                placeholder={t("bankNameInput")}
                value={hospitalForm.finances.bankName}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.finances.bankName = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>

            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("accountNumber")}</Text>
              <Input
                placeholder={t("accountNumberInput")}
                value={hospitalForm.finances.accountNumber}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.finances.accountNumber = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("nameOfOwner")}</Text>
              <Input
                placeholder={t("nameOfOwnerInput")}
                value={hospitalForm.finances.bankOwnerName}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.finances.bankOwnerName = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("bankAddress")}</Text>
              <Textarea
                height={"150"}
                resize={"none"}
                placeholder={t("bankAddressInput")}
                value={hospitalForm.finances.bankAddress}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.finances.bankAddress = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("swiftCode")}</Text>
              <Input
                placeholder={t("swiftCodeInput")}
                value={hospitalForm.finances.bankSwiftCode}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.finances.bankSwiftCode = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("iban")}</Text>
              <Input
                placeholder={t("ibanInput")}
                value={hospitalForm.finances.bankIBAN}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.finances.bankIBAN = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Divider color={theme.divider.primary} />
            <Text color={colorMode === 'dark' && 'gray.300'}fontSize={"16px"} fontWeight={"500"}>
              {t("mobilePayment")}
            </Text>
            <Stack dir="column" spacing={1} width={"100%"}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text
                  fontSize={"14px"}
                  fontWeight="500 "
                  color={theme.input.label}
                >
                  {t("mobileMoneyService")}
                </Text>
                <Icon ml={1} as={IoIosInformationCircleOutline} />
              </div>
              <Select
                value={hospitalForm.finances.mobileMoneyService}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.finances.mobileMoneyService = e.target.value;
                    return newState;
                  })
                }
              >
                <option disabled value="Selectionner">
                  Selectionner
                </option>
                <option value="Public hospital">PayPal</option>
                <option value="Private hospital">Airtel</option>
              </Select>
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("code")}</Text>
              <Input
                placeholder={t("codeInput")}
                value={hospitalForm.finances.mobileMoneyCode}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.finances.mobileMoneyCode = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("name")}</Text>
              <Input
                placeholder={t("nameInput")}
                value={hospitalForm.finances.mobileMoneyName}
                onChange={(e) =>
                  setHospitalForm((prevState) => {
                    const newState = { ...prevState };
                    newState.finances.mobileMoneyName = e.target.value;
                    return newState;
                  })
                }
              />
            </Stack>
            <Divider color={theme.divider.primary} />
            <Text color={colorMode === 'dark' && 'gray.300'}fontSize={"16px"} fontWeight={"500"}>
              {t("taxInformation")}
            </Text>
            <Stack dir="column" spacing={1} width={"100%"}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">{t("taxInformationScan")}</Text>
              {hospitalForm.finances.taxImage ? (
                <HStack spacing={5}>
                  <Box
                    border={"1px solid"}
                    borderColor={theme.input.border}
                    borderRadius={"8px"}
                    display={"flex"}
                    flexDir={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    padding={"16px"}
                  >
                    <Image
                      src={hospitalForm.finances.taxImage}
                      height={"100px"}
                      width={"100px"}
                    />
                  </Box>
                  <Text
                    _hover={{ cursor: "pointer" }}
                    color={theme.input.label}
                    fontSize={"14px"}
                    fontWeight={"500"}
                    onClick={() =>
                      setHospitalForm((prevState) => {
                        const newState = { ...prevState };
                        newState.finances.taxImage = "";
                        return newState;
                      })
                    }
                  >
                    {t("delete")}
                  </Text>
                  <RenderUpdateText />
                  <input
                    style={{ display: "none" }}
                    ref={updateRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "tax")}
                  />
                </HStack>
              ) : (
                <Dropzone
                borderColor={true}
                colorMode={colorMode}
                  loading={imageLoading}
                  onDrop={(file) => handleDrop("tax", file)}
                  title={t("clickToUpload")}
                  subheading={t("dragAndDrop")}
                  description={t("descriptionDropzone")}
                  drag={t("drag")}
                />
              )}
            </Stack>

            <HStack
              justifyContent={"flex-end"}
              width={"100%"}
              paddingBottom={"32px"}
            >
              <div>
              <GhostButton
                  onClick={() => handlePrev()}
                >
                  {t("back")}
                </GhostButton>
              </div>
              <div>
                <Button
                  isLoading={loading}
                  loadingText="Submitting"
                  onClick={() => {
                    setLoading(true);
                    handleSignup();
                  }}
                  // isDisabled={isAnyFieldEmpty("finances")}
                >
                  {t("finishRegistration")}
                </Button>
              </div>
            </HStack>
          </VStack>
        )}
      </Flex>
    </Flex>
  );
}

function AllSteps() {
  const t = useTranslations("Dictionary");
  const step = [
    {
      title: t("titleStep1"),
      description: t("descriptionStep1"),
    },
    {
      title: t("titleStep2"),
      description: t("descriptionStep2"),
    },
    {
      title: t("titleStep3"),
      description: t("descriptionStep3"),
    },
    {
      title: t("titleStep4"),
      description: t("descriptionStep4"),
    },
    {
      title: t("titleStep5"),
      description: t("descriptionStep5"),
    },
  ];
  return step;
}

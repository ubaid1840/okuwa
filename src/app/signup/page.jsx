"use client";

import Logo from "@/components/ui/shadcn-logo";
import { Button } from "@/components/ui/shadcn-button";
import { Input } from "@/components/ui/shadcn-input";
import { Textarea } from "@/components/ui/shadcn-textarea";
import { Select } from "@/components/ui/shadcn-select";
import { Label } from "@/components/ui/shadcn-label";
import { FooterOne, FooterTwo } from "@/components/ui/shadcn-footer";
import { DarkModeSwitcher } from "@/components/ui/shadcn-dark-mode-switcher";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/shadcn-tooltip";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Info, MapPin, Plus, Minus, Check } from "lucide-react";
import { CountriesList, theme } from "@/data/data";
import Dropzone from "@/components/DropZone";
import { HospitalContext } from "@/store/context/HospitalContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SocialMediaSelection from "@/components/ui/SocialMediaSelection";
import { geocode, RequestType, setKey } from "react-geocode";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import axios from "@/lib/axiosInstance";
import { showToastFailed } from "@/utils/toastUtils";
import Calendar from "@/components/ui/Calendar";
import Image from "next/image";
import { useToast } from "@chakra-ui/react";
import { cn } from "@/lib/utils";

export default function Page() {
  const t = useTranslations("Dictionary");
  const steps = AllSteps();
  const updateRef = useRef(null);
  const toastIdRef = useRef(null);
  const toast = useToast();
  const [startRegistration, setStartRegistration] = useState(false);
  const [date, setDate] = useState(new Date());
  const [activeStep, setActiveStep] = useState(0);
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
  const { state: HospitalState, setHospital } = useContext(HospitalContext);
  const router = useRouter();
  const [smm, setSmm] = useState([
    {
      selection: "Facebook",
      input: "",
    },
  ]);

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [country, setCountry] = useState("");
  const [code, setCode] = useState({ value: "", label: "" });
  const [imageLoading, setImageLoading] = useState(false);

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
          console.error("Unable to retrieve your location");
        }
      );
    }
  }

  useEffect(() => {
    if (location.lat && location.lng) {
      setKey("AIzaSyCIn1bSbDB5U_jS0eDY9vlrE4PogTsg5lY");
      geocode(RequestType.LATLNG, `${location.lat},${location.lng}`, {
        location_type: "ROOFTOP",
        enable_address_descriptor: true,
      })
        .then(({ results }) => {
          const address = results[0].formatted_address;
          const { city, state, country } = results[0].address_components.reduce(
            (acc, component) => {
              if (component.types.includes("locality")) acc.city = component.long_name;
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
          setCountry(country);
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

  const handleFileChange = async (e, type) => {
    if (e.target.files && e.target.files[0]) {
      setImageLoading(true);
      await uploadFiles(e.target.files[0], type);
    }
  };

  const RenderUpdateText = useCallback(() => {
    return (
      <button
        onClick={() => {
          if (updateRef.current) updateRef.current.click();
        }}
        className="text-primary text-sm font-medium hover:opacity-70 cursor-pointer"
      >
        Update
      </button>
    );
  }, [hospitalForm]);

  function handleNext() {
    if (activeStep !== 4) {
      setActiveStep(activeStep + 1);
    }
  }

  function handlePrev() {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1);
    }
  }

  const handleDrop = async (type, file) => {
    if (file) {
      setImageLoading(true);
      await uploadFiles(file, type);
    }
  };

  const TooltipLabel = () => {
    return (
      <div className="text-xs space-y-2">
        <p><strong>{t("publicHospital")}</strong> {t("publicHospitalDescription")}</p>
        <p><strong>{t("privateHospital")}</strong> {t("privateHospitalDescription")}</p>
        <p><strong>{t("clinic")}</strong> {t("clinicDescription")}</p>
        <p><strong>{t("diagnosisCenter")}</strong> {t("diagnosisCenterDescription")}</p>
        <p><strong>{t("medicalCenter")}</strong> {t("medicalCenterDescription")}</p>
      </div>
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
            setLoading(false);
            showToastFailed(toast, toastIdRef, t("Failed"), error.message);
          });
      })
      .catch((e) => {
        setLoading(false);
        showToastFailed(toast, toastIdRef, t("Failed"), e?.response?.data?.message);
      });
  }

  const uploadFiles = async (item, type) => {
    const name = type + ".png";
    const metadata = { contentType: "image/png" };
    const storageRef = ref(
      storage,
      `HC${hospitalForm.generalInformation.centerID}/images/` + name
    );
    const uploadTask = uploadBytesResumable(storageRef, item, metadata);
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        setImageLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageLoading(false);
          if (type === "logo") {
            setHospitalForm((prevState) => ({
              ...prevState,
              generalInformation: { ...prevState.generalInformation, image: downloadURL },
            }));
          } else if (type === "signature") {
            setHospitalForm((prevState) => ({
              ...prevState,
              manager: { ...prevState.manager, signature: downloadURL },
            }));
          } else if (type === "tax") {
            setHospitalForm((prevState) => ({
              ...prevState,
              finances: { ...prevState.finances, taxImage: downloadURL },
            }));
          }
        });
      }
    );
  };

  // Welcome screen before registration
  if (!startRegistration) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="fixed top-5 right-5 z-50">
          <DarkModeSwitcher />
        </div>

        <div className="flex flex-1 flex-col items-center justify-between p-6 lg:p-10">
          <div className="flex w-full max-w-md flex-col items-start justify-center flex-1 gap-4">
            <Logo />
            <h1 className="text-2xl font-semibold text-foreground">
              {t("welcomeToDoctoCare")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("description1")}</p>
            <p className="text-sm text-muted-foreground">{t("description2")}</p>
            <Button className="w-full" onClick={() => setStartRegistration(true)}>
              {t("startRegistration")}
            </Button>
          </div>
          <FooterOne />
        </div>

        <div className="hidden lg:flex flex-1 relative">
          <Image
            src="/assets/signup.png"
            alt="Signup"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    );
  }

  // Registration form with stepper
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="fixed top-5 right-5 z-50">
        <DarkModeSwitcher />
      </div>

      {/* Sidebar with Stepper */}
      <div className="w-full lg:w-[30%] bg-secondary/30 p-6 lg:pt-12 lg:px-10 flex flex-col justify-between">
        <div className="flex flex-col gap-10">
          <Logo />
          
          {/* Stepper - Horizontal on mobile, vertical on desktop */}
          <div className="flex lg:flex-col gap-4 lg:gap-9 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 min-w-max lg:min-w-0">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                      index < activeStep
                        ? "border-primary bg-background"
                        : index === activeStep
                        ? "border-primary bg-background"
                        : "border-muted-foreground/30 bg-background"
                    )}
                  >
                    {index < activeStep ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          index === activeStep ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                      />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block w-0.5 h-9 bg-muted-foreground/20 mt-1" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      index === activeStep ? "text-primary" : "text-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                  <span
                    className={cn(
                      "text-sm hidden lg:block",
                      index === activeStep ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <FooterTwo />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:pt-8 flex justify-center">
        <div className="w-full max-w-lg space-y-5">
          {/* Step 0: General Information */}
          {activeStep === 0 && (
            <>
              <h2 className="text-xl font-semibold text-foreground">
                {t("generalInformation")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("generalInformationSubheading")}
              </p>

              <div className="space-y-2">
                <Label>{t("healthcareCenterID")}</Label>
                <Input
                  disabled
                  value={`HC${hospitalForm.generalInformation.centerID}`}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("logo")}</Label>
                {hospitalForm.generalInformation.image ? (
                  <div className="flex items-center gap-4">
                    <div className="border rounded-lg p-4 flex items-center justify-center">
                      <img
                        src={hospitalForm.generalInformation.image}
                        className="h-24 w-24 object-contain"
                        alt="Logo"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setHospitalForm((prev) => ({
                          ...prev,
                          generalInformation: { ...prev.generalInformation, image: "" },
                        }))
                      }
                      className="text-sm font-medium text-muted-foreground hover:opacity-70"
                    >
                      {t("delete")}
                    </button>
                    <RenderUpdateText />
                    <input
                      style={{ display: "none" }}
                      ref={updateRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "logo")}
                    />
                  </div>
                ) : (
                  <Dropzone
                    borderColor={true}
                    loading={imageLoading}
                    onDrop={(file) => handleDrop("logo", file)}
                    title={t("clickToUpload")}
                    subheading={t("dragAndDrop")}
                    description={t("descriptionDropzone")}
                    drag={t("drag")}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>{t("healthcareCenterName")}</Label>
                <Input
                  placeholder={t("healthcareCenterNameInput")}
                  value={hospitalForm.generalInformation.centerName}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      generalInformation: {
                        ...prev.generalInformation,
                        centerName: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("emailAdmin")}</Label>
                <Input
                  placeholder={t("emailInput")}
                  type="email"
                  value={hospitalForm.contact.email}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("description")}</Label>
                <Textarea
                  placeholder={t("healthcareCenterDescriptionInput")}
                  value={hospitalForm.generalInformation.description}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      generalInformation: {
                        ...prev.generalInformation,
                        description: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label>{t("type")}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <TooltipLabel />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={hospitalForm.generalInformation.centerType}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      generalInformation: {
                        ...prev.generalInformation,
                        centerType: e.target.value,
                      },
                    }))
                  }
                >
                  <option disabled value="Selectionner">Selectionner</option>
                  <option value="publicHospital">{t("publicHospital")}</option>
                  <option value="privateHospital">{t("privateHospital")}</option>
                  <option value="clinic">{t("clinic")}</option>
                  <option value="diagnosisCenter">{t("diagnosisCenter")}</option>
                  <option value="medicalCenter">{t("medicalCenter")}</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("status")}</Label>
                <Select
                  value={hospitalForm.generalInformation.status}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      generalInformation: {
                        ...prev.generalInformation,
                        status: e.target.value,
                      },
                    }))
                  }
                >
                  <option disabled value="Selectionner">Selectionner</option>
                  <option value="private">{t("private")}</option>
                  <option value="public">{t("public")}</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("foundationDate")}</Label>
                <Calendar
                  value={date}
                  onChange={(e) => {
                    setDate(e.value);
                    setHospitalForm((prev) => ({
                      ...prev,
                      generalInformation: {
                        ...prev.generalInformation,
                        foundationDate: new Date(e.value).getTime(),
                      },
                    }));
                  }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 pb-8">
                <Button variant="outline" onClick={() => setStartRegistration(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={handleNext}>{t("continue")}</Button>
              </div>
            </>
          )}

          {/* Step 1: Address */}
          {activeStep === 1 && (
            <>
              <h2 className="text-xl font-semibold text-foreground">{t("address")}</h2>
              <p className="text-sm text-muted-foreground">{t("addressSubheading")}</p>

              <div className="space-y-2">
                <Label>{t("country")}</Label>
                <div className="flex gap-2">
                  <Select
                    className="flex-1"
                    value={hospitalForm.address.country}
                    onChange={(e) =>
                      setHospitalForm((prev) => ({
                        ...prev,
                        address: { ...prev.address, country: e.target.value },
                      }))
                    }
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Select>
                  <button
                    onClick={fetchLocation}
                    className="p-2 hover:opacity-70"
                    title="Use my location"
                  >
                    <MapPin className="h-5 w-5 text-foreground" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("city")}</Label>
                <Input
                  value={hospitalForm.address.city}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("neighborhood")}</Label>
                <Input
                  value={hospitalForm.address.neighborhood}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      address: { ...prev.address, neighborhood: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("address")}</Label>
                <Textarea
                  className="min-h-[150px] resize-none"
                  placeholder={t("addressInput")}
                  value={hospitalForm.address.address}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      address: { ...prev.address, address: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 pb-8">
                <Button variant="outline" onClick={handlePrev}>{t("back")}</Button>
                <Button onClick={handleNext}>{t("continue")}</Button>
              </div>
            </>
          )}

          {/* Step 2: Contact */}
          {activeStep === 2 && (
            <>
              <h2 className="text-xl font-semibold text-foreground">{t("contact")}</h2>
              <p className="text-sm text-muted-foreground">{t("contactSubheading")}</p>

              <div className="space-y-2">
                <Label>{t("phoneNumber")}</Label>
                <div className="flex gap-2">
                  <Select
                    className="w-32"
                    value={code.value}
                    onChange={(e) => setCode({ value: e.target.value, label: e.target.value })}
                  >
                    <option value="">Code</option>
                    {CountriesList.map((item) => (
                      <option key={item.code} value={item.num}>
                        {item.num}
                      </option>
                    ))}
                  </Select>
                  <Input
                    className="flex-1"
                    placeholder={t("phoneNumberInput")}
                    type="tel"
                    value={hospitalForm.contact.phoneNumber}
                    onChange={(e) =>
                      setHospitalForm((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, phoneNumber: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("fax")}</Label>
                <Input
                  placeholder={t("faxInput")}
                  type="tel"
                  value={hospitalForm.contact.faxNumber}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, faxNumber: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("website")}</Label>
                <Input
                  placeholder={t("websiteInput")}
                  type="url"
                  value={hospitalForm.contact.website}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, website: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("socialMedia")}</Label>
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    {smm.map((item, index) => (
                      <SocialMediaSelection
                        key={index}
                        data={item}
                        onChangeInput={(e) => {
                          setSmm((prev) => {
                            const newState = [...prev];
                            newState[index].input = e.target.value;
                            return newState;
                          });
                        }}
                        onSMMSelection={(item) => {
                          setSmm((prev) => {
                            const newState = [...prev];
                            newState[index].selection = item;
                            return newState;
                          });
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 pb-2">
                    <button
                      onClick={() => setSmm([...smm, { selection: "Facebook", input: "" }])}
                      className="p-1 hover:opacity-70"
                    >
                      <Plus className="h-5 w-5 text-green-600" />
                    </button>
                    {smm.length > 1 && (
                      <button
                        onClick={() => setSmm(smm.slice(0, -1))}
                        className="p-1 hover:opacity-70"
                      >
                        <Minus className="h-5 w-5 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 pb-8">
                <Button variant="outline" onClick={handlePrev}>{t("back")}</Button>
                <Button onClick={handleNext}>{t("continue")}</Button>
              </div>
            </>
          )}

          {/* Step 3: Manager */}
          {activeStep === 3 && (
            <>
              <h2 className="text-xl font-semibold text-foreground">{t("manager")}</h2>
              <p className="text-sm text-muted-foreground">{t("managerSubheading")}</p>

              <div className="space-y-2">
                <Label>{t("directorName")}</Label>
                <Input
                  placeholder={t("directorNameInput")}
                  value={hospitalForm.manager.directorName}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      manager: { ...prev.manager, directorName: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("occupation")}</Label>
                <Input
                  placeholder={t("occupationInput")}
                  value={hospitalForm.manager.directorOccupation}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      manager: { ...prev.manager, directorOccupation: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("signature")}</Label>
                {hospitalForm.manager.signature ? (
                  <div className="flex items-center gap-4">
                    <div className="border rounded-lg p-4 flex items-center justify-center">
                      <img
                        src={hospitalForm.manager.signature}
                        className="h-24 w-24 object-contain"
                        alt="Signature"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setHospitalForm((prev) => ({
                          ...prev,
                          manager: { ...prev.manager, signature: "" },
                        }))
                      }
                      className="text-sm font-medium text-muted-foreground hover:opacity-70"
                    >
                      {t("delete")}
                    </button>
                    <RenderUpdateText />
                    <input
                      style={{ display: "none" }}
                      ref={updateRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "signature")}
                    />
                  </div>
                ) : (
                  <Dropzone
                    borderColor={true}
                    loading={imageLoading}
                    onDrop={(file) => handleDrop("signature", file)}
                    title={t("clickToUpload")}
                    subheading={t("dragAndDrop")}
                    description={t("descriptionDropzone")}
                    drag={t("drag")}
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 pb-8">
                <Button variant="outline" onClick={handlePrev}>{t("back")}</Button>
                <Button onClick={handleNext}>{t("continue")}</Button>
              </div>
            </>
          )}

          {/* Step 4: Finances */}
          {activeStep === 4 && (
            <>
              <h2 className="text-xl font-semibold text-foreground">
                {t("financesInformation")}
              </h2>
              <p className="text-sm text-muted-foreground">{t("managerSubheading")}</p>

              <h3 className="text-base font-medium text-foreground">{t("bankAccount")}</h3>

              <div className="space-y-2">
                <Label>{t("bankName")}</Label>
                <Input
                  placeholder={t("bankNameInput")}
                  value={hospitalForm.finances.bankName}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      finances: { ...prev.finances, bankName: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("accountNumber")}</Label>
                <Input
                  placeholder={t("accountNumberInput")}
                  value={hospitalForm.finances.accountNumber}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      finances: { ...prev.finances, accountNumber: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("nameOfOwner")}</Label>
                <Input
                  placeholder={t("nameOfOwnerInput")}
                  value={hospitalForm.finances.bankOwnerName}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      finances: { ...prev.finances, bankOwnerName: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("bankAddress")}</Label>
                <Textarea
                  className="min-h-[150px] resize-none"
                  placeholder={t("bankAddressInput")}
                  value={hospitalForm.finances.bankAddress}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      finances: { ...prev.finances, bankAddress: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("swiftCode")}</Label>
                <Input
                  placeholder={t("swiftCodeInput")}
                  value={hospitalForm.finances.bankSwiftCode}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      finances: { ...prev.finances, bankSwiftCode: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("iban")}</Label>
                <Input
                  placeholder={t("ibanInput")}
                  value={hospitalForm.finances.bankIBAN}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      finances: { ...prev.finances, bankIBAN: e.target.value },
                    }))
                  }
                />
              </div>

              <hr className="border-border" />

              <h3 className="text-base font-medium text-foreground">{t("mobilePayment")}</h3>

              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label>{t("mobileMoneyService")}</Label>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <Select
                  value={hospitalForm.finances.mobileMoneyService}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      finances: { ...prev.finances, mobileMoneyService: e.target.value },
                    }))
                  }
                >
                  <option disabled value="Selectionner">Selectionner</option>
                  <option value="Public hospital">PayPal</option>
                  <option value="Private hospital">Airtel</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("code")}</Label>
                <Input
                  placeholder={t("codeInput")}
                  value={hospitalForm.finances.mobileMoneyCode}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      finances: { ...prev.finances, mobileMoneyCode: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("name")}</Label>
                <Input
                  placeholder={t("nameInput")}
                  value={hospitalForm.finances.mobileMoneyName}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      finances: { ...prev.finances, mobileMoneyName: e.target.value },
                    }))
                  }
                />
              </div>

              <hr className="border-border" />

              <h3 className="text-base font-medium text-foreground">{t("taxInformation")}</h3>

              <div className="space-y-2">
                <Label>{t("taxInformationScan")}</Label>
                {hospitalForm.finances.taxImage ? (
                  <div className="flex items-center gap-4">
                    <div className="border rounded-lg p-4 flex items-center justify-center">
                      <img
                        src={hospitalForm.finances.taxImage}
                        className="h-24 w-24 object-contain"
                        alt="Tax Document"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setHospitalForm((prev) => ({
                          ...prev,
                          finances: { ...prev.finances, taxImage: "" },
                        }))
                      }
                      className="text-sm font-medium text-muted-foreground hover:opacity-70"
                    >
                      {t("delete")}
                    </button>
                    <RenderUpdateText />
                    <input
                      style={{ display: "none" }}
                      ref={updateRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "tax")}
                    />
                  </div>
                ) : (
                  <Dropzone
                    borderColor={true}
                    loading={imageLoading}
                    onDrop={(file) => handleDrop("tax", file)}
                    title={t("clickToUpload")}
                    subheading={t("dragAndDrop")}
                    description={t("descriptionDropzone")}
                    drag={t("drag")}
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 pb-8">
                <Button variant="outline" onClick={handlePrev}>{t("back")}</Button>
                <Button
                  isLoading={loading}
                  loadingText="Submitting"
                  onClick={() => {
                    setLoading(true);
                    handleSignup();
                  }}
                >
                  {t("finishRegistration")}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AllSteps() {
  const t = useTranslations("Dictionary");
  return [
    { title: t("titleStep1"), description: t("descriptionStep1") },
    { title: t("titleStep2"), description: t("descriptionStep2") },
    { title: t("titleStep3"), description: t("descriptionStep3") },
    { title: t("titleStep4"), description: t("descriptionStep4") },
    { title: t("titleStep5"), description: t("descriptionStep5") },
  ];
}

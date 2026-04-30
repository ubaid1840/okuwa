"use client";

import { Button } from "@/components/ui/shadcn-button";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import { ShadcnLogo } from "@/components/ui/shadcn-logo";
import { Input } from "@/components/ui/shadcn-input";
import { Label } from "@/components/ui/shadcn-label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/shadcn-dialog";
import { ShadcnFooterOne } from "@/components/ui/shadcn-footer";
import { ShadcnDarkModeSwitcher } from "@/components/ui/shadcn-dark-mode-switcher";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Search, Check } from "lucide-react";
import { medicalServices } from "./data";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import axios from "@/lib/axiosInstance";
import { useColorMode, useToast } from "@chakra-ui/react";
import { showToastFailed } from "@/utils/toastUtils";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Page() {
  const { colorMode } = useColorMode();
  const t = useTranslations("Dictionary");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentID, setCurrentID] = useState(0);
  const [selected, setSelected] = useState([]);
  const [selectedMedicalCenter, setSelectedMedicalCenter] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const toastIdRef = useRef(null);
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const itemsHeading = [
    "emergencies",
    "intensiveCare",
    "maternity",
    "surgery",
    "radiologyAndMedicalImaging",
  ];

  const itemsSubheading = [
    "emergenciesSubheading",
    "intensiveCareSubheading",
    "maternitySubheading",
    "surgerySubheading",
    "radiologyAndMedicalImagingSubheading",
  ];

  useEffect(() => {
    if (email.includes("@") && email.includes(".")) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }

    if (password.length > 7) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  }, [email, password]);

  function checkExists(data) {
    const temp = selectedMedicalCenter.filter((item) => item === data);
    if (temp.length > 0) return true;
  }

  function removeSelection(name) {
    const temp = selectedMedicalCenter.filter((item) => item !== name);
    setSelectedMedicalCenter([...temp]);
  }

  function handleSelectedOption(name) {
    const temp = selectedMedicalCenter.filter((item) => item === name);
    if (temp.length > 0) {
      removeSelection(name);
    } else {
      const temp = [...selectedMedicalCenter];
      temp.push(name);
      setSelectedMedicalCenter([...temp]);
    }
  }

  async function handleLogin(role) {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "frontDesk") {
          router.push("/frontdesk");
        } else if (role === "doctor") {
          router.push("/doctor");
        } else if (role === "labUser") {
          router.push("/lab");
        } else if (role === "nurse") {
          router.push("/nurse");
        }
      })
      .catch((e) => {
        setLoading(false);
        showToastFailed(toast, toastIdRef, t("Failed"), e.message);
      });
  }

  async function handleLoginInsurance() {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
        router.push("/insurance");
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        showToastFailed(toast, toastIdRef, t("Failed"), e.message);
      });
  }

  async function handleSignIn() {
    if (email == "superadmin@gmail.com") {
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          setLoading(false);
          router.push("/internal");
        })
        .catch((e) => {
          setLoading(false);
          showToastFailed(toast, toastIdRef, t("Failed"), e.message);
        });
    } else {
      try {
        const response = await axios.post("/api/login", { email: email });
        if (response.data?.insuranceid) {
          handleLoginInsurance();
        } else {
          if (response.data?.role) {
            setCurrentID(response.data?.centerid);
            if (response.data?.role === "admin") {
              if (response.data?.settingsData) {
                handleLogin(response.data.role);
              } else {
                setIsOpen(true);
              }
            } else {
              handleLogin(response.data.role);
            }
          } else {
            setLoading(false);
          }
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
        if (e.response && e.response.data) {
          showToastFailed(
            toast,
            toastIdRef,
            t("Failed"),
            e?.response?.data?.message
          );
        } else {
          showToastFailed(toast, toastIdRef, t("Failed"), e.message);
        }
      }
    }
  }

  function handleGetStarted() {
    setIsOpen(false);
    const temp = [...selected, ...selectedMedicalCenter];
    axios
      .post("/api/insert", {
        table: "settings",
        columns: ["centerid", "settings_array"],
        values: [currentID, temp],
      })
      .then(() => {
        handleLogin("admin");
      });
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Dark Mode Switcher */}
      <div className="fixed right-4 top-4 z-50 md:right-10 md:top-5">
        <ShadcnDarkModeSwitcher />
      </div>

      {/* Left Side - Form */}
      <div className="flex flex-1 flex-col items-center justify-between px-4 py-8 lg:px-8">
        <div className="flex w-full max-w-[400px] flex-1 flex-col items-start justify-center gap-5">
          <ShadcnLogo />

          <p className="text-base text-foreground dark:text-gray-300">
            {t("welcomeBackSubheading")}
          </p>

          {/* Email Field */}
          <div className="flex w-full flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground dark:text-gray-300">
              {t("email")}
            </Label>
            <Input
              placeholder={t("emailInput")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Password Field */}
          <div className="flex w-full flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground dark:text-gray-300">
              {t("password")}
            </Label>
            <Input
              placeholder={t("passwordInput")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked)}
              />
              <Label
                htmlFor="remember"
                className="cursor-pointer text-sm font-normal text-foreground dark:text-gray-300"
              >
                {t("rememberMe")}
              </Label>
            </div>
            <Link
              href="/forgetpassword"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("forgetPassword")}
            </Link>
          </div>

          {/* Sign In Button */}
          <Button
            loading={loading}
            onClick={() => {
              setLoading(true);
              handleSignIn();
            }}
            className="h-11 w-full"
            disabled={!isEmailValid || !isPasswordValid}
          >
            {t("signIn")}
          </Button>

          {/* Sign Up Link */}
          <div className="flex w-full items-center justify-center gap-1">
            <span className="text-sm text-muted-foreground dark:text-gray-300">
              {t("noAccount")}
            </span>
            <Link
              href="/signup"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("signUp")}
            </Link>
          </div>
        </div>

        <ShadcnFooterOne />
      </div>

      {/* Right Side - Image */}
      <div className="relative hidden flex-1 lg:block">
        <Image
          src="/assets/login.png"
          alt="Login illustration"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Services Selection Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-[900px] overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:gap-10">
            {/* Left Column - Main Services */}
            <div className="flex w-full flex-col gap-3">
              <div className="flex justify-center">
                <ShadcnLogo />
              </div>
              <h2 className="text-center text-lg font-medium text-foreground dark:text-gray-300">
                {t("selectServicesOffered")}
              </h2>
              <p className="text-center text-sm text-muted-foreground dark:text-gray-400">
                {t("selectServicesOfferedSubheading")}
              </p>

              {itemsHeading.map((item, index) => {
                const isSelected = selected.includes(item);
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex w-full flex-col gap-1 rounded-lg border p-4",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelected((prev) => [...prev, item]);
                          } else {
                            setSelected((prev) =>
                              prev.filter((i) => i !== item)
                            );
                          }
                        }}
                        className="mt-0.5"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={cn(
                            "text-base font-medium",
                            isSelected
                              ? "text-primary"
                              : "text-foreground dark:text-gray-300"
                          )}
                        >
                          {t(item)}
                        </span>
                        <span
                          className={cn(
                            "text-sm",
                            isSelected
                              ? "text-primary/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {itemsSubheading[index]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column - Search Services */}
            <div className="flex w-full flex-col gap-3">
              <h2 className="text-center text-lg font-medium text-foreground dark:text-gray-300">
                {t("couldNotFindCenter")}
              </h2>
              <p className="text-center text-sm text-muted-foreground dark:text-gray-400">
                {t("couldNotFindCenterSubheading")}
              </p>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("search")}
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>

              <div className="flex max-h-[400px] flex-col overflow-y-auto md:max-h-[550px]">
                {medicalServices
                  .filter((item) =>
                    t(item)
                      ?.toLocaleLowerCase()
                      .includes(searchItem.toLocaleLowerCase())
                  )
                  .map((item, index) => {
                    const isSelected = checkExists(item);
                    return (
                      <div
                        key={index}
                        onClick={() => handleSelectedOption(item)}
                        className={cn(
                          "flex w-full cursor-pointer items-center justify-between border-b border-border p-3 transition-colors hover:bg-muted/50",
                          isSelected && "bg-primary/5"
                        )}
                      >
                        <span className="text-sm font-medium text-foreground dark:text-gray-300">
                          {t(item)}
                        </span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleGetStarted} className="h-11 w-full">
              {t("getStarted")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

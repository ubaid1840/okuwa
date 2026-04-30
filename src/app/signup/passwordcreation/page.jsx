"use client";

import { Button } from "@/components/ui/shadcn-button";
import Logo from "@/components/ui/shadcn-logo";
import { Input } from "@/components/ui/shadcn-input";
import { Label } from "@/components/ui/shadcn-label";
import { FooterOne } from "@/components/ui/shadcn-footer";
import { DarkModeSwitcher } from "@/components/ui/shadcn-dark-mode-switcher";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@chakra-ui/react";

export default function Page() {
  const t = useTranslations("Dictionary");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setValidation] = useState([false, false]);
  const [matched, setMatched] = useState(false);
  const [showSuccessfull, setShowSuccessfull] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (password.length > 7) {
      if (validation[0] === false) {
        setValidation((prevState) => {
          const newState = [...prevState];
          newState[0] = true;
          return newState;
        });
      }
    } else {
      if (validation[0] === true) {
        setValidation((prevState) => {
          const newState = [...prevState];
          newState[0] = false;
          return newState;
        });
      }
    }

    if (!/[0-9]/.test(password)) {
      if (validation[1] === true) {
        setValidation((prevState) => {
          const newState = [...prevState];
          newState[1] = false;
          return newState;
        });
      }
    } else {
      if (validation[1] === false) {
        setValidation((prevState) => {
          const newState = [...prevState];
          newState[1] = true;
          return newState;
        });
      }
    }

    if (password === confirmPassword) {
      if (matched === false) setMatched(true);
    } else {
      if (matched === true) setMatched(false);
    }
  }, [password, confirmPassword, validation, matched]);

  function handlePasswordCreation() {
    try {
      const oobCode = new URLSearchParams(window.location.search).get("oobCode");
      const continueUrl = new URLSearchParams(window.location.search).get("continueUrl");
      
      confirmPasswordReset(auth, oobCode, password)
        .then(() => {
          setLoading(false);
          router.push(continueUrl);
        })
        .catch((e) => {
          setLoading(false);
          toast({
            title: "Error",
            description: e.message,
            duration: 3000,
            status: "error",
            isClosable: true,
            position: "top-right",
          });
        });
    } catch (error) {
      setLoading(false);
    }
  }

  return !showSuccessfull ? (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Dark Mode Switcher */}
      <div className="fixed top-5 right-5 z-50">
        <DarkModeSwitcher />
      </div>

      {/* Left Side - Form */}
      <div className="flex flex-1 flex-col items-center justify-between p-6 lg:p-10">
        <div className="flex w-full max-w-md flex-col items-start justify-center flex-1 gap-5">
          <Logo />
          
          <h1 className="text-2xl font-semibold text-foreground">
            {t("setNewPassword")}
          </h1>
          
          <p className="text-sm text-muted-foreground">
            {t("setNewPasswordSubheading")}
          </p>

          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordInput")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("confirmPasswordInput")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 
                className={`h-5 w-5 ${validation[0] ? "text-primary" : "text-muted-foreground/40"}`}
              />
              <span className={`text-sm ${validation[0] ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                {t("passwordValidation1")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 
                className={`h-5 w-5 ${validation[1] ? "text-primary" : "text-muted-foreground/40"}`}
              />
              <span className={`text-sm ${validation[1] ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                {t("passwordValidation2")}
              </span>
            </div>
          </div>

          <Button
            className="w-full"
            isLoading={loading}
            loadingText="Creating"
            disabled={!validation[0] || !validation[1] || !matched}
            onClick={() => {
              setLoading(true);
              handlePasswordCreation();
            }}
          >
            {t("confirmPassword")}
          </Button>
        </div>

        <FooterOne />
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="/assets/password.png"
          alt="Password creation"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  ) : (
    <div className="flex min-h-screen items-center justify-center p-6">
      {/* Dark Mode Switcher */}
      <div className="fixed top-5 right-5 z-50">
        <DarkModeSwitcher />
      </div>

      <div className="flex flex-col items-center gap-5 text-center max-w-md">
        <Image 
          width={210} 
          height={210} 
          src="/assets/Done-pana-1.png"
          alt="Success"
        />
        
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          {t("passwordCreated")}
        </h1>
        
        <p className="text-base text-muted-foreground">
          {t("passwordCreatedSubheading")}
        </p>
        
        <Link href="/login">
          <Button>{t("login")}</Button>
        </Link>
      </div>
    </div>
  );
}

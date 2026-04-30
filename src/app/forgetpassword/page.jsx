"use client";

import { Button } from "@/components/ui/shadcn-button";
import { ShadcnLogo } from "@/components/ui/shadcn-logo";
import { Input } from "@/components/ui/shadcn-input";
import { Label } from "@/components/ui/shadcn-label";
import { ShadcnFooterOne } from "@/components/ui/shadcn-footer";
import { ShadcnDarkModeSwitcher } from "@/components/ui/shadcn-dark-mode-switcher";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useColorMode } from "@chakra-ui/react";
import Image from "next/image";

export default function Page() {
  const { colorMode } = useColorMode();
  const t = useTranslations("Dictionary");
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (email.includes("@") && email.includes(".")) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  }, [email]);

  async function handleResetEmail() {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin,
      });
      setEmailSent(true);
      console.log("email sent");
    } catch (error) {
      console.error("Error sending reset email:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Dark Mode Switcher */}
      <div className="fixed right-4 top-4 z-50 md:right-10 md:top-5">
        <ShadcnDarkModeSwitcher />
      </div>

      {/* Left Side - Image */}
      <div className="relative hidden flex-1 lg:block">
        <Image
          src="/assets/login.png"
          alt="Reset password illustration"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 flex-col items-center justify-between px-4 py-8 lg:px-8">
        <div className="flex w-full max-w-[400px] flex-1 flex-col items-start justify-center gap-5">
          <ShadcnLogo />

          <h1 className="text-2xl font-semibold text-foreground dark:text-gray-300">
            {t("resetPassword")}
          </h1>

          <p className="text-sm text-muted-foreground dark:text-gray-400">
            {t("resetPasswordSubheading")}
          </p>

          {emailSent ? (
            <div className="flex w-full flex-col gap-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <p className="text-sm text-green-700 dark:text-green-400">
                {t("emailSent") || "Password reset email sent! Check your inbox."}
              </p>
              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="w-full"
              >
                {t("sendAgain") || "Send Again"}
              </Button>
            </div>
          ) : (
            <>
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

              {/* Reset Button */}
              <Button
                loading={loading}
                onClick={handleResetEmail}
                className="h-11 w-full"
                disabled={!isEmailValid}
              >
                {t("reset")}
              </Button>
            </>
          )}

          {/* Back to Login Link */}
          <div className="flex w-full items-center justify-center gap-1">
            <span className="text-sm text-muted-foreground dark:text-gray-300">
              {t("loginBack")}
            </span>
            <Link
              href="/login"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("login")}
            </Link>
          </div>
        </div>

        <ShadcnFooterOne />
      </div>
    </div>
  );
}

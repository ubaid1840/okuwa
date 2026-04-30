"use client";

import { Button } from "@/components/ui/shadcn-button";
import { DarkModeSwitcher } from "@/components/ui/shadcn-dark-mode-switcher";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const t = useTranslations("Dictionary");

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      {/* Dark Mode Switcher */}
      <div className="fixed top-5 right-5 z-50">
        <DarkModeSwitcher />
      </div>

      <div className="flex flex-col items-center gap-8 md:gap-10 text-center max-w-lg px-4">
        <Image 
          width={210} 
          height={210} 
          src="/assets/Done-pana-1.png"
          alt="Registration Successful"
          className="w-40 h-40 md:w-52 md:h-52"
        />
        
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          {t("registrationSuccessfull")}
        </h1>
        
        <p className="text-base text-muted-foreground max-w-[70%]">
          {t("registrationSuccessfullSubheading")}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pb-8">
          <Link target="_blank" href="https://gmail.com">
            <Button>
              {t("checkEmail")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

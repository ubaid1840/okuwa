"use client"

import Image from "next/image"

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/assets/Vector.png"
        width={20}
        height={20}
        alt="Okuwa Logo"
      />
      <span className="ml-1 text-primary text-base font-semibold">
        Okuwa
      </span>
    </div>
  )
}

"use client"

import { Mail } from "lucide-react"

export function FooterOne() {
  return (
    <footer className="p-4 px-10 w-full">
      <p className="text-xs text-muted-foreground">
        &copy; Okuwa 2024
      </p>
    </footer>
  )
}

export function FooterTwo() {
  return (
    <footer className="pb-10 w-full flex justify-between">
      <p className="text-xs text-muted-foreground">
        &copy; Okuwa 2024
      </p>
      <div className="flex items-center">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <span className="ml-2 text-xs text-muted-foreground">
          help@Okuwa.com
        </span>
      </div>
    </footer>
  )
}

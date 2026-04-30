"use client"

import { Moon, Sun } from "lucide-react"
import { useColorMode } from "@chakra-ui/react"

export function DarkModeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <button
      onClick={toggleColorMode}
      className="p-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
    >
      {colorMode === "dark" ? (
        <Moon className="h-6 w-6 text-foreground" />
      ) : (
        <Sun className="h-6 w-6 text-foreground" />
      )}
    </button>
  )
}

"use client";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Sidebar from "@/components/sidebar";
import { theme } from "@/data/data";
import GetLinkItems from "@/utils/SidebarItems";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Flex,
  HStack,
  Input,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Settings() {
  const t = useTranslations("Dictionary");
  const sideLinks = GetLinkItems("doctor");
  const hospitalRooms = [
    "General Ward",
    "Private Room",
    "Semi-Private Room",
    "Intensive Care Unit (ICU)",
    "Neonatal Intensive Care Unit (NICU)",
    "Emergency Room (ER)",
    "Operating Room (OR)",
    "Labor and Delivery Room",
    "Recovery Room",
    "Pediatric Room",
    "Maternity Room",
    "Isolation Room",
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [availability, setAvailability] = useState([
    { day: "Monday", available: true },
    { day: "Tuesday", available: false },
    { day: "Wednesday", available: true },
    { day: "Thursday", available: false },
    { day: "Friday", available: true },
    { day: "Saturday", available: false },
    { day: "Sunday", available: true },
  ]);

  const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
  const {colorMode} = useColorMode()

  return (
    <Sidebar LinkItems={sideLinks}>
      <Flex flex={1} gap={"32px"} p={"32px"} flexDir="column">
        <HStack justifyContent={"space-between"}>
          <Text color={colorMode === 'dark' && 'gray.300'}variant="heading">{t("settings")}</Text>
          <HStack>
            <Button onClick={() => {}}>{t("save")}</Button>
          </HStack>
        </HStack>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <Text
            fontSize={"16px"}
            fontWeight={"400"}
            color={theme.text.secondary}
            textAlign={"center"}
          >
            {t("settingsSubheading")}
          </Text>
        </div>
        <HStack width={"100%"} gap={"40px"} align={"flex-start"}>
          <VStack align={"flex-start"}>
            <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"20px"}>
              {t("markYourAvailability")}
            </Text>
            <VStack align={"flex-start"}>
              {availability.map((item, index) => (
                <Checkbox
                  key={index}
                  value={item.available}
                  onChange={(e) =>
                    setAvailability((prevState) => {
                      const newState = [...prevState];
                      newState[index].available = e.target.checked;
                      return newState;
                    })
                  }
                >
                  {item.day}
                </Checkbox>
              ))}
            </VStack>
          </VStack>

          <VStack align={"flex-start"}>
            <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"} fontSize={"20px"}>
              {t("availableTime")}
            </Text>
            <VStack align={"flex-start"} gap={0}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>{t("startTime")}</Text>
             <Input  aria-label="Time" type="time" />
            </VStack>
            <VStack align={"flex-start"} gap={0}>
              <Text color={colorMode === 'dark' && 'gray.300'}variant={"subheading"}>{t("endTime")}</Text>
             <Input  aria-label="Time" type="time" />
            </VStack>
          </VStack>
        </HStack>
      </Flex>

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent width={"400px"}>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <VStack alignItems={"flex-start"} spacing={2}>
              <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"}fontSize={"18px"} fontWeight={"500"} >
                {t("add")}
              </Text>

              <Text color={colorMode === 'dark' && 'gray.300'}variant={"description"}>{t("addNewEntry")}</Text>
             <Input  placeholder={t("addNewEntryInput")} />
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              onClick={onClose}
              border="1px solid"
              borderColor={bdColor}
              backgroundColor="#FFFFFF"
              color="#000000"
            >
              {t("cancel")}
            </Button>
            <Button ml={3}>{t("save")}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}

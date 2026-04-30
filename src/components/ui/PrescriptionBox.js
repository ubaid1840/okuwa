import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, HStack, Icon, IconButton, Image, Input, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue, useDisclosure, VStack } from "@chakra-ui/react"
import Button, { GhostButton } from "./Button"
import PrescriptionCard from "./prescriptionCard"
import { theme } from "@/data/data"
import { FiPlusCircle } from "react-icons/fi"
import { useTranslations } from "next-intl"
import { useState } from "react"

const PrescriptionBox = ({ data, onReturn, onReturnDelete }) => {
    const t = useTranslations("Dictionary")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
    const {colorMode} = useColorMode()
    const [localData, setLocalData] = useState({
        tablet: '',
        frequency: '',
        when: '',
        quantity: '',
        unit: "Unit"
    })

    return (
        <VStack align={"flex-start"} gap={3} width={"100%"}>
            {data.length == 0 ? (
                <VStack
                    width={"100%"}
                    borderRadius={"8px"}
                    border={"1px solid"}
                    borderColor={colorMode == 'light'? "#EAECF0" : "gray.600"}
                    overflow={"hidden"}
                    gap={0}
                >
                    <HStack
                        width={"100%"}
                        justify={"space-between"}
                        bg={colorMode == 'light' ? "#F2F4F7" : "gray.500"}
                        px={"15px"}
                    >
                        <Text
                        color={colorMode == 'dark' && "gray.300"}
                            variant={"subheading"}
                            fontWeight={"600"}
                            fontSize={"16px"}
                        >
                            {t("prescription")} 1
                        </Text>
                        <IconButton
                            isDisabled={data.length === 0}
                            variant={"ghost"}
                            icon={<DeleteIcon color={"red"} boxSize={5} />}
                        />
                    </HStack>
                    <HStack width={"100%"} bg={colorMode == 'light'? "#FFFFFF" : "gray.700"} p={"15px"}>
                        <Button
                            onClick={() => {
                                setLocalData({
                                    tablet: '',
                                   
                                    frequency: '',
                                    when: '',
                                    quantity: '',
                                    unit: "Unit"
                                })
                                onOpen()
                            }}
                            bg={theme.color.lightbackground}
                            color={theme.color.link}
                            width={"100%"}
                            leftIcon={<AddIcon mt={"-2px"} color={theme.color.link} />}
                        >
                            {t("addMedicine")}
                        </Button>
                    </HStack>
                </VStack>
            ) : (
                <>
                    {data.map((eachItem, index) => (
                        <VStack
                            key={index}
                            width={"100%"}
                            borderRadius={"8px"}
                            border={"1px solid"}
                            borderColor={colorMode == 'light' ? "#EAECF0" : 'gray.600'}
                            gap={0}
                        >
                            <HStack
                                width={"100%"}
                                justify={"space-between"}
                                bg={"#F2F4F7"}
                                px={"15px"}
                            >
                                <Text
                                    variant={"subheading"}
                                    fontWeight={"600"}
                                    fontSize={"16px"}
                                >
                                    {`${t("prescription")} ${index + 1}`}
                                </Text>
                                <IconButton
                                    onClick={() => {
                                        const temp = [...data]
                                        const filterTemp = temp.filter((item, ind) => ind !== index)
                                        onReturnDelete([...filterTemp])
                                    }}
                                    isDisabled={data.length === 0}
                                    variant={"ghost"}
                                    icon={<DeleteIcon color={"red"} boxSize={5} />}
                                />
                            </HStack>
                            <PrescriptionCard
                                heading={eachItem.tablet}
                                head1={`${t("frequency")}:`}
                                head2={`${t("when")}:`}
                                head3={`${t("quantity")}:`}
                                value1={eachItem.frequency}
                                value2={eachItem.when}
                                value3={eachItem.quantity}
                                condition={false}
                            />
                        </VStack>
                    ))}
                    <HStack
                        onClick={() => {
                            setLocalData({
                                tablet: '',
                                frequency: '',
                                when: '',
                                quantity: '',
                                unit: "Unit"
                            })
                            onOpen()
                        }}
                        gap={15}
                        _hover={{ cursor: "pointer", opacity: 0.7 }}
                        color={theme.color.primary}
                    >
                        <Icon as={FiPlusCircle} boxSize={5} />
                        <Text
                            variant={"subheading"}
                            fontSize={"16px"}
                            color={"inherit"}
                        >
                            {`${t("addMorePrescription")}`}
                        </Text>
                    </HStack>
                </>
            )}

            <AlertDialog
                motionPreset="slideInBottom"
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay bg={'#344054B2'} />

                <AlertDialogContent width={'400px'}>
                    <AlertDialogHeader>
                        <div
                            style={{
                                height: "25px",
                                width: "25px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#b2d8d8",
                                borderRadius: "50px",
                            }}
                        >
                            <Image
                                height={"18px"}
                                width={"18px"}
                                src="/assets/circle-cut.png"
                            />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <VStack alignItems={"flex-start"} spacing={2}>
                            <Text color={colorMode === 'dark' ? 'gray.300' : "#101828"}fontSize={"18px"} fontWeight={"500"}>
                                {t('addMedicine')}
                            </Text>
                            <VStack align={'flex-start'} gap={1} width={'100%'}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={'subheading'}> {t('medicine')}</Text>
                                <div style={{ width: '100%' }}>
                                  <Input  value={localData.tablet}  onChange={(e) => {
                                            setLocalData((prevState) => {
                                                const newState = { ...prevState }
                                                newState.tablet = e.target.value
                                                return newState
                                            })
                                        }}/>
                                </div>
                            </VStack>
                            
                            <VStack align={'flex-start'} gap={1} width={'100%'}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={'subheading'}> {t('frequency')}</Text>
                                <div style={{ width: '100%' }}>
                               <Input  value={localData.frequency}  onChange={(e) => {
                                            setLocalData((prevState) => {
                                                const newState = { ...prevState }
                                                newState.frequency = e.target.value
                                                return newState
                                            })
                                        }}/>
                                </div>
                            </VStack>
                            <VStack align={'flex-start'} gap={1} width={'100%'}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={'subheading'}> {t('when')}</Text>
                                <div style={{ width: '100%' }}>
                               <Input  value={localData.when}  onChange={(e) => {
                                            setLocalData((prevState) => {
                                                const newState = { ...prevState }
                                                newState.when = e.target.value
                                                return newState
                                            })
                                        }}/>
                                </div>
                            </VStack>
                            <VStack align={'flex-start'} gap={1} width={'100%'}>
                                <Text color={colorMode === 'dark' && 'gray.300'}variant={'subheading'}> {t('quantity')}</Text>
                                <HStack gap={0} width={'100%'}>
                                   <Input  placeholder={t('inputQuantity')} borderRightRadius={0} value={localData.quantity} onChange={(e) => setLocalData((prevState) => {
                                        const newState = { ...prevState }
                                        newState.quantity = e.target.value
                                        return newState
                                    })} />
                                    <Menu >
                                        <MenuButton
                                            width={'120px'}
                                            border={"0px solid"}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                            display={'flex'}
                                        >
                                            <Box
                                                bg={colorMode == 'light' ? '#F2F4F7' : "gray.600"}
                                                display="flex"
                                                height="40px"
                                                border={"1px solid"}
                                                borderTopRightRadius={"5px"}
                                                borderBottomRightRadius={'5px'}
                                                borderColor={bdColor}
                                                alignItems={"center"}
                                                width={'100%'}
                                                borderLeftWidth={0}
                                                borderLeftRadius={'0px'}
                                            >
                                                <Text color={colorMode === 'dark' && 'gray.300'}variant="subheading">
                                                {t('tablet')}
                                                </Text>
                                            </Box>
                                        </MenuButton>
                                    </Menu>
                                </HStack>
                            </VStack>
                        </VStack>
                    </AlertDialogBody>
                    <AlertDialogFooter width={'100%'} alignItems={'flex-start'} justifyContent={'flex-start'}>
                        <GhostButton
                            width={'100%'}
                            onClick={onClose}
                        >
                            {t('cancel')}
                        </GhostButton>
                        <Button onClick={() => {
                            onReturn(localData)
                            onClose()
                        }} width={'100%'} ml={3}>
                            {t('add')}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </VStack>
    )
}

export default PrescriptionBox
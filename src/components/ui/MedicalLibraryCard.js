import { HStack, Icon, VStack, Text, Image, useColorModeValue, useColorMode } from "@chakra-ui/react"
import { CiMedicalCross } from "react-icons/ci"
import { FaArrowRight } from "react-icons/fa"


export const MedicalLibraryCard = ({ data, index, onPress }) => {
    const bgColor = useColorModeValue('#b2d8d8', "#b2d8d8")
    const bdColor = useColorModeValue('#EFF4FF', "inherit")
    const colorMode = useColorMode()

    return (
        <HStack align={'flex-start'} justify={'flex-start'}>
            <div style={{ padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '40px', borderColor: bdColor, border: '8px solid', backgroundColor: bgColor, }}>
                {data.type === 'Diagnosis' ? <Icon as={CiMedicalCross} color={'#155EEF'} boxSize={6} /> :
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
                }
            </div>
            <VStack align={'flex-start'}>
                <Text color={colorMode === 'dark' ? 'gray.500' : 'gray.400'} fontWeight={'500'} fontSize={'20px'}>{data.title}</Text>
                <Text color={colorMode === 'dark' ? 'gray.300' : '#667085'} fontWeight={'400'} fontSize={'16px'}>{data.description.slice(0, 200) + '...'}</Text>
                <HStack _hover={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => onPress(data.id)}>
                    <Text color={'#2970FF'} fontWeight={'500'} fontSize={'16px'}>Learn more</Text>
                    <Icon color={'#2970FF'} as={FaArrowRight} boxSize={5} />
                </HStack>
            </VStack>
        </HStack>
    )
}
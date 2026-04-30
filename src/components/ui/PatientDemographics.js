import { Box, SimpleGrid, Text, Flex, Spacer, Badge, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

const PatientDemographics = ({ demographics }) => {
    const {colorMode} = useColorMode()
    const t = useTranslations("Dictionary")
    const bgColor = useColorModeValue("gray.100", "gray.700")
    return (
        <Box>
            {/* Age Statistics */}
            <SimpleGrid columns={[1, 2]} spacing={6} mb={6}>
                <Flex align="center" justify="center" bg={bgColor} p={5} borderRadius="md">
                    <Box>
                        <Text color={colorMode === 'dark' && 'gray.300'}fontSize="lg" fontWeight="bold">{t("averageAge")}</Text>
                        <Text color={colorMode === 'dark' && 'gray.300'}fontSize="2xl">{demographics.averageAge.toFixed(0)} {t("years")}</Text>
                    </Box>
                    <Spacer />
                    <Badge colorScheme="teal" fontSize="md">{t("median")} {demographics.medianAge} {t("years")}</Badge>
                </Flex>
                <Flex align="center" justify="center" bg={bgColor} p={5} borderRadius="md">
                    <Box>
                        <Text color={colorMode === 'dark' && 'gray.300'}fontSize="lg" fontWeight="bold">{t("ageRange")}</Text>
                        <Text color={colorMode === 'dark' && 'gray.300'}fontSize="2xl">0 - {demographics.ageRange.max} {t("years")}</Text>
                    </Box>
                </Flex>
            </SimpleGrid>
        </Box>
    );
};

export default PatientDemographics;

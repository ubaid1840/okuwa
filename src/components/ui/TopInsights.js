// components/TopInsights.jsx
import { SimpleGrid } from '@chakra-ui/react';
import InsightCard from './InsightCard';
import { FaUserMd, FaStethoscope, FaClock } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

const TopInsights = ({ insights }) => {
    const t = useTranslations("Dictionary")
    const insightsData = [
        { title: t("mostFrequentDoctor"), value: insights.mostFrequentDoctor, icon: FaUserMd },
        { title: t("mostCommonMedicalAct"), value: insights.mostCommonService, icon: FaStethoscope },
        { title: t("averageConsultationDuration"), value: `${insights?.avgConsultationDuration ? Number(insights.avgConsultationDuration).toFixed(0) : 0} minutes`, icon: FaClock },
    ];

    return (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {insightsData.map((insight) => (
                <InsightCard key={insight.title} title={insight.title} value={insight.value} icon={insight.icon} />
            ))}
        </SimpleGrid>
    );
};

export default TopInsights;


import { SimpleGrid } from '@chakra-ui/react';
import MetricCard from './MetricCard';
import { FaDollarSign, FaUserFriends, FaChartLine, FaMoneyCheckAlt, FaPiggyBank, FaHandHoldingUsd, FaWallet } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

const GeneralMetrics = ({ metrics }) => {
  const t = useTranslations("Dictionary")
  const metricData = [
    { title: t("totalConsultations"), value: metrics.totalConsultations, icon: FaUserFriends },
    { title: t("averageCostPerConsultation"), value: `${metrics?.avgCostPerConsultation ? Number(metrics.avgCostPerConsultation).toFixed(2) : 0} CFA`, icon: FaDollarSign },
    { title: t("averagePatientShare"), value: `${metrics?.avgPatientShare ? Number(metrics?.avgPatientShare).toFixed(2) : 0} CFA`, icon: FaMoneyCheckAlt },
    { title: t("averageInsuranceShare"), value: `${metrics?.avgInsuranceShare ? Number(metrics?.avgInsuranceShare).toFixed(2) : 0} CFA`, icon: FaPiggyBank },
    { title: t("totalRevenueGenerated"), value: `${metrics.totalRevenueGenerated} CFA`, icon: FaWallet },
    { title: t("totalInsuranceContribution"), value: `${metrics.totalInsuranceContribution} CFA`, icon: FaHandHoldingUsd },
    { title: t("totalPatientContribution"), value: `${metrics.totalPatientContribution} CFA`, icon: FaChartLine },
  ];

  return (
    <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
      {metricData.map((metric) => (
        <MetricCard key={metric.title} title={metric.title} value={metric.value} icon={metric.icon} />
      ))}
    </SimpleGrid>
  );
};

export default GeneralMetrics;

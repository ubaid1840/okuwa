"use client"
import { BsBuildings, BsClipboardCheck } from "react-icons/bs";
import { GoGraph, GoPeople } from "react-icons/go";
import { PiSuitcaseThin } from "react-icons/pi";
import { CiCalendar, CiClock2, CiHeart, CiStar, CiViewTable } from "react-icons/ci";
import { BiPieChartAlt2, BiMessageRoundedDetail } from "react-icons/bi";
import { FaRegFileAlt } from "react-icons/fa";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { IoMdBook } from "react-icons/io";
import { useTranslations } from "next-intl";
import {  RiHome2Line } from "react-icons/ri";
import { GiVendingMachine } from "react-icons/gi";

const GetLinkItems = (role) => {
    const t = useTranslations("Dictionary")
    switch (role) {
        case 'admin':
            return [
                {
                    name: t('dashboard'),
                    icon: RiHome2Line,
                    path: `/admin/dashboard`,
                },
                {
                    name: t('medicalStaff'),
                    icon: PiSuitcaseThin,
                    path: `/admin/medicalstaff`,
                },
                {
                    name: t('facilityManagement'),
                    icon: BsBuildings,
                    path: `/admin/facilitymanagement`,
                },
                {
                    name: t('task'),
                    icon: BsClipboardCheck,
                    path: `/admin/task`,
                },
                {
                    name: t('feedbackAndReview'),
                    icon: CiStar,
                    path: `/admin/feedbackandreview`,
                },
                {
                    name: t('machine'),
                    icon: GiVendingMachine ,
                    path: `/admin/machine`,
                },
            ];
        case 'nurse':
            return [
                {
                    name: t('taskManagement'),
                    icon: BsClipboardCheck,
                    path: `/nurse/taskmanagement`,
                },
                {
                    name: t('appointments'),
                    icon: CiCalendar,
                    path: `/nurse/appointments`,
                },
                {
                    name: t('patients'),
                    icon: GoPeople,
                    path: `/nurse/patients`,
                },
                // {
                //     name: t('messages'),
                //     icon: BiMessageRoundedDetail,
                //     path: `/nurse/messages`,
                // },
                // {
                //     name: t('medication'),
                //     icon: RiFirstAidKitLine,
                //     path: `/nurse/medication`,
                // },
                {
                    name: t('healthMonitoring'),
                    icon: CiHeart,
                    path: `/nurse/healthmonitoring`,
                },
                {
                    name: t('woundTreatment'),
                    icon: MdOutlineHealthAndSafety,
                    path: `/nurse/woundtreatment`,
                },

                {
                    name: t('medicalLibrary'),
                    icon: IoMdBook,
                    path: `/nurse/medicallibrary`,
                },
            ];
        case 'internal':
            return [
                {
                    name: t('healthcareCenter'),
                    icon: BsBuildings,
                    path: `/internal/healthcarecenter`,
                },

            ];
        case 'frontdesk':
            return [

                {
                    name: t('dashboard'),
                    icon: RiHome2Line,
                    path: `/frontdesk/dashboard`,
                },

                {
                    name: t('appointments'),
                    icon: CiCalendar,
                    path: `/frontdesk/appointments`,
                },
                // {
                //     name: t('report'),
                //     icon: HiOutlineDocumentReport,
                //     path: `/frontdesk/report`,
                // },
                {
                    name: t('patients'),
                    icon: GoPeople,
                    path: `/frontdesk/patients`,
                },
                {
                    name: t('messages'),
                    icon: BiMessageRoundedDetail,
                    path: `/frontdesk/messages`,
                },
                // {
                //     name: t('insuranceAndBilling'),
                //     icon: PiHandCoins,
                //     path: `/frontdesk/insuranceandbilling`,
                // }
            ];
        case 'finance':
            return [
                {
                    name: t('financialReport'),
                    icon: BiPieChartAlt2,
                    path: `/finance/financialreport`,
                },
                // {
                //     name: t('insuranceAndBilling'),
                //     icon: PiHandCoins,
                //     path: `/finance/insuranceandbilling`,
                // },
                // {
                //     name: t('financialStatement'),
                //     icon: FaRegFileAlt,
                //     path: `/finance/financialstatement`,
                // },
                // {
                //     name: t('auditTrail'),
                //     icon: AiOutlineFileSearch,
                //     path: `/finance/audittrail`,
                // }
            ];
        case 'lab':
            return [
                {
                    name: t('testManagement'),
                    icon: CiViewTable,
                    path: `/lab/testmanagement`,
                },
                {
                    name: t('analysisAndReporting'),
                    icon: FaRegFileAlt,
                    path: `/lab/analysisandreporting`,
                },
              
                {
                    name: t('messages'),
                    icon: BiMessageRoundedDetail,
                    path: `/lab/messages`,
                },
            ];
        case 'doctor':
            return [
                {
                    name: t('dashboard'),
                    icon: RiHome2Line,
                    path: `/doctor/dashboard`,
                },
                {
                    name: t('appointments'),
                    icon: CiCalendar,
                    path: `/doctor/appointments`,
                },
                {
                    name: t('patients'),
                    icon: GoPeople,
                    path: `/doctor/patients`,
                },
                {
                    name: t('task'),
                    icon: BsClipboardCheck,
                    path: `/doctor/task`,
                },
                // {
                //     name: t('messages'),
                //     icon: BiMessageRoundedDetail,
                //     path: `/doctor/messages`,
                // },
                // {
                //     name: t('labRequests'),
                //     icon: FaRegFileAlt,
                //     path: `/doctor/labrequests`,
                // },
                {
                    name: t('healthMonitoring'),
                    icon: CiHeart,
                    path: `/doctor/healthmonitoring`,
                },
                {
                    name: t('medicalLibrary'),
                    icon: IoMdBook,
                    path: `/doctor/medicallibrary`,
                },
                {
                    name: t('scheduleManagement'),
                    icon: CiClock2,
                    path: `/doctor/schedulemanagement`,
                },
                {
                    name: t('statistics'),
                    icon: GoGraph,
                    path: `/doctor/statistics`,
                },

            ];
        case 'insurance':
            return [
                {
                    name: t('dashboard'),
                    icon: RiHome2Line,
                    path: `/insurance/dashboard`,
                },


            ];
        default:
            return [];
    }
};

export default GetLinkItems;

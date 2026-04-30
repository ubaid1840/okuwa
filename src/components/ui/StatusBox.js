'use client'

import { useTranslations } from "next-intl"

const StatusBox = ({ item }) => {
    const t = useTranslations("Dictionary")

    return (
        item?.toLocaleLowerCase() == "completed" ? (
            <Status type="green">{item ? t(item) : ""}</Status>
        ) : item?.toLocaleLowerCase() == "scheduled" ? (
            <Status type="blue">{item ? t(item) : ""}</Status>
        ) :
            item?.toLocaleLowerCase() == "available" ? (
                <Status type="green">{item ? t(item) : ""}</Status>
            ) : item?.toLocaleLowerCase() == "notavailable" ? (
                <Status type="red">{item ? t(item) : ""}</Status>
            ) : item?.toLocaleLowerCase() == "uurgent" ? (
                <Status type="red">{item ? t(item) : ""}</Status>
            ) : item?.toLocaleLowerCase() == "high" ? (
                <Status type="red">{item ? t(item) : ""}</Status>
            ) : item?.toLocaleLowerCase() == "medium" ? (
                <Status type="blue">{item ? t(item) : ""}</Status>
            ) : item?.toLocaleLowerCase() == "ongoing" ? (
                <Status type="blue">{item ? t(item) : ""}</Status>
            ) : item?.toLocaleLowerCase() == "low" ? (
                <Status type="yellow">{item ? t(item) : ""}</Status>
            ) : item?.toLocaleLowerCase() == "cancelled" ? (
                <Status type="red">{item ? t(item) : ""}</Status>
            ) : item?.toLocaleLowerCase() == "rejected" ? (
                <Status type="red">{item ? t(item) : ""}</Status>
            ) : item?.toLocaleLowerCase() == "waiting" ? (
                <Status type="yellow">{item ? t(item) : ""}</Status>
            ) : item?.toLocaleLowerCase() == "needreview" ? (
                <Status type="yellow">{item ? t(item) : ""}</Status>
            ) : (
                <Status>{item ? t(item) : ""}</Status>
            )
    )
}

export const Status = ({ children, type }) => {

    return (
        <div
            style={{
                display: "flex",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: type == 'green' ? '#ECFDF3' : type == 'blue' ? '#EFF8FF' : type == 'red' ? '#FEF3F2' : type == 'yellow' ? '#FFFAEB' : "#F2F4F7",
                alignItems: "center",
                paddingInline: "10px",
                color: type == 'green' ? '#027A48' : type == 'blue' ? '#175CD3' : type == 'red' ? '#B42318' : type == 'yellow' ? '#B54708' :  "#344054",
                borderRadius: "50px",
                width: "fit-content",
            }}
        >
            <div
                style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: type == 'green' ? '#12B76A' : type == 'blue' ? '#2E90FA' : type == 'red' ? '#F04438' : type == 'yellow' ? '#F79009' : "#667085",
                    borderRadius: "3px",
                    marginRight: "5px",
                }}
            />
            <div>{children}</div>
        </div>
    )
}
export default StatusBox
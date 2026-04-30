import PatientDetailPage from "@/components/patients/patientdetail";

export default function Page ({params}) {
    const {pid} = params
  return (
    <PatientDetailPage page={"admin"} pid={pid}/>
  )
}
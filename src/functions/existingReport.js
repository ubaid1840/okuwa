import { CreatePdf, CreatePdfNoInsurance } from "./createPDF";
import { CreatePdfHospitalizationPrivate, CreatePdfHospitalizationPublic } from "./createPDFHospitalization";
import { CreatePdfLabPublic, CreatePdfLabPrivate } from "./createPDFLab";


export default async function handleOpenReport(data) {
    console.log(data.report)
    if (data.type === 'hospitalization') {
        if (data.status === 'private') {
            await CreatePdfHospitalizationPrivate(
                "/pdf/CNAMGS-hospitalization-private.pdf",
                "private",
                data.serialno,
                data.report
            );
        } else if (data.status === 'public') {
            await CreatePdfHospitalizationPublic(
                "/pdf/CNAMGS-hospitalization-public.pdf",
                "private",
                data.serialno,
                data.report
            );
        }
    } else if (data.type === 'lab') {
        if (data.status === 'private') {
            await CreatePdfLabPrivate(
                "/pdf/CNAMGS-lab-private.pdf",
                "private",
                data.serialno,
                data.report
            );
        } else if (data.status === 'public') {
            await CreatePdfLabPublic(
                "/pdf/CNAMGS-lab-public.pdf",
                "private",
                data.serialno,
                data.report
            );
        }
    } else if (data.type === 'prescription')
        if (data.report.haveInsurance) {
            if (data.status === 'private') {
                await CreatePdf(
                    "/pdf/CNAMGS-private.pdf",
                    data.report.online,
                    "private",
                    data.serialno,
                    data.report
                )
            } else if (data.status === 'public') {
                await CreatePdf(
                    "/pdf/CNAMGS-public.pdf",
                    data.report.online,
                    "public",
                    data.serialno,
                    data.report
                )
            }
        } else {
            await CreatePdfNoInsurance(data.serialno, data.report)
        }

}
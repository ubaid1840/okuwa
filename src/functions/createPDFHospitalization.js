
import { degrees, PDFDocument, rgb, RotationTypes } from 'pdf-lib';
import JsBarcode from 'jsbarcode';
import moment from 'moment';

async function CreatePdfHospitalizationPrivate(source, type, barcodeValue, data) {

   

    const existingPdfBytes = await fetch(source).then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.arrayBuffer();
    });




    let margin = 0
    const defaultFontSize = 12;
    const textColor = rgb(0, 0, 0);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];

    const { width, height } = page.getSize();
    const letterSpacing = 3.5

    function drawTextWithSpacing(text, x, y) {
        let currentX = x;
        for (const char of text) {
            page.drawText(char, {
                x: currentX,
                y: y - margin,
                size: defaultFontSize,
                color: textColor,
            });
            currentX += defaultFontSize + letterSpacing;
        }
    }

    //center info

    page.drawText(`${barcodeValue}`, {
        x: 320,
        y: height - 60 - margin,
        size: 14,
        color: rgb(1, 0, 0),
    });




    page.drawText(`${data?.center_name || ""}`, {
        x: 20,
        y: height - 133.5 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(`Centre médical`, {
        x: 410,
        y: height - 131 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(data.timein, {
        x: 20,
        y: height - 162 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(data.timeout, {
        x: 265,
        y: height - 162 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(data.numOfDays, {
        x: 515,
        y: height - 162 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    // patient name
    page.drawText(`${data?.patient_firstname || ""} ${data?.patient_lastname || ""}`, {
        x: 20,
        y: height - 240 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(`${data?.patient_number || ""}`, {
        x: 430,
        y: height - 240 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    let dob = data?.patient_dob ? moment(new Date(Number(data?.patient_dob))).format("DD/MM/YYYY") : "--/--/----"
    // let dob = data.patient_dob
    // patient dob
    drawTextWithSpacing(dob.split("/")[0], 16, height - 267)
    drawTextWithSpacing(dob.split("/")[1], 48, height - 267)
    drawTextWithSpacing(dob.split("/")[2], 79, height - 267)

    // patient code
    drawTextWithSpacing(`PT${data?.patient_id}`, 165, height - 267)

    page.drawText(`${data?.insurer_name || ""}`, {
        x: 20,
        y: height - 304 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    drawTextWithSpacing(`${data?.insurer_insurance_number}`, 242, height - 305)

    if (!data.insured) {
        page.drawText(`X`, {
            x: 577,
            y: height - 257.5 - margin,
            size: 10,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 515,
            y: height - 257.5 - margin,
            size: 10,
            color: textColor,
        });
    }

    page.drawText(`${data?.doctor_firstname || ""} ${data?.doctor_lastname || ""}`, {
        x: 20,
        y: height - 352.5 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(`${data?.doctor_number || ""} `, {
        x: 430,
        y: height - 355.5 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(`${data?.doctor_speciality || ""}`, {
        x: 20,
        y: height - 383 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //////////////////////////////////////////

    if (data.full) {
        page.drawText(`X`, {
            x: 150,
            y: height - 450 - margin,
            size: 10,
            color: textColor,
        });
    }

    if (data.ald) {
        page.drawText(`X`, {
            x: 195,
            y: height - 450 - margin,
            size: 10,
            color: textColor,
        });
    }

    if (data.exonere) {
        page.drawText(`X`, {
            x: 247,
            y: height - 450 - margin,
            size: 10,
            color: textColor,
        });
    }



    if (data.accident) {
        page.drawText(`X`, {
            x: 27,
            y: height - 478 - margin,
            size: 10,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 80,
            y: height - 478 - margin,
            size: 10,
            color: textColor,
        });
    }

    if (data.pregnancy) {
        page.drawText(`X`, {
            x: 295,
            y: height - 480 - margin,
            size: 10,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 343,
            y: height - 480 - margin,
            size: 10,
            color: textColor,
        });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${barcodeValue}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return url
}

async function CreatePdfHospitalizationPublic(source, type, barcodeValue, data) {

   

    const existingPdfBytes = await fetch(source).then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.arrayBuffer();
    });




    let margin = 0
    const defaultFontSize = 12;
    const textColor = rgb(0, 0, 0);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];

    const { width, height } = page.getSize();
    const letterSpacing = 3.5

    function drawTextWithSpacing(text, x, y) {
        let currentX = x;
        for (const char of text) {
            page.drawText(char, {
                x: currentX,
                y: y - margin,
                size: defaultFontSize,
                color: textColor,
            });
            currentX += defaultFontSize + letterSpacing;
        }
    }

    //center info

    page.drawText(`${barcodeValue}`, {
        x: 320,
        y: height - 60 - margin,
        size: 14,
        color: rgb(1, 0, 0),
    });

    page.drawText(`${data?.center_name || ""}`, {
        x: 20,
        y: height - 133.5 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(`HC${data?.center_id || ""}`, {
        x: 280,
        y: height - 133.5 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(`Centre médical`, {
        x: 410,
        y: height - 131 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(data.timein, {
        x: 20,
        y: height - 162 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(data.timeout, {
        x: 180,
        y: height - 162 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(data.numOfDays, {
        x: 533,
        y: height - 162 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    // patient name
    page.drawText(`${data?.patient_firstname || ""} ${data?.patient_lastname || ""}`, {
        x: 20,
        y: height - 246 - margin,
        size: defaultFontSize,
        color: textColor,
    });



    let dob = data?.patient_dob ? moment(new Date(Number(data?.patient_dob))).format("DD/MM/YYYY") : "--/--/----"
    // let dob = data.patient_dob
    // patient dob
    drawTextWithSpacing(dob.split("/")[0], 15, height - 277)
    drawTextWithSpacing(dob.split("/")[1], 52, height - 277)
    drawTextWithSpacing(dob.split("/")[2], 88, height - 277)

    // patient code
    drawTextWithSpacing(`PT${data?.patient_id}`, 240, height - 277)

    page.drawText(`${data?.insurer_name || ""}`, {
        x: 20,
        y: height - 304 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    drawTextWithSpacing(`${data?.insurer_insurance_number}`, 242, height - 305)

    if (data.insured) {
        page.drawText(`X`, {
            x: 480,
            y: height - 252 - margin,
            size: 10,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 533,
            y: height - 252 - margin,
            size: 10,
            color: textColor,
        });
    }



    page.drawText(`${data?.doctor_firstname || ""} ${data?.doctor_lastname || ""}`, {
        x: 20,
        y: height - 354 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(`ST${data?.doctor_id || ""} `, {
        x: 242,
        y: height - 357 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    page.drawText(`${data?.doctor_speciality || ""}`, {
        x: 20,
        y: height - 383 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    if (data.doctor_speciality == 'Médecin Généraliste' || data.doctor_speciality == 'General Physician') {
        page.drawText(`X`, {
            x: 533,
            y: height - 358 - margin,
            size: 10,
            color: textColor,
        });
    } else if (data.doctor_speciality == 'Autre' || data.doctor_speciality == 'Other') {
        page.drawText(`X`, {
            x: 533,
            y: height - 383 - margin,
            size: 10,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 533,
            y: height - 370 - margin,
            size: 10,
            color: textColor,
        });
    }




    //////////////////////////////////////////

    if (data.full) {
        page.drawText(`X`, {
            x: 89,
            y: height - 425 - margin,
            size: 10,
            color: textColor,
        });
    }

    if (data.ald) {
        page.drawText(`X`, {
            x: 89,
            y: height - 438 - margin,
            size: 10,
            color: textColor,
        });
    }

    if (data.exonere) {
        page.drawText(`X`, {
            x: 89,
            y: height - 451 - margin,
            size: 10,
            color: textColor,
        });
    }


    if (data.accident) {
        page.drawText(`X`, {
            x: 252,
            y: height - 429 - margin,
            size: 10,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 284,
            y: height - 429 - margin,
            size: 10,
            color: textColor,
        });
    }

    if (data.pregnancy) {

        page.drawText(`X`, {
            x: 400,
            y: height - 431 - margin,
            size: 10,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 400,
            y: height - 443 - margin,
            size: 10,
            color: textColor,
        });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${barcodeValue}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return url
}





export { CreatePdfHospitalizationPrivate, CreatePdfHospitalizationPublic }


import { degrees, PDFDocument, rgb, RotationTypes } from 'pdf-lib';
import JsBarcode from 'jsbarcode';
import moment from 'moment';

async function CreatePdfLabPublic(source, type, barcodeValue, data) {



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

    page.drawText(`${barcodeValue}`, {
        x: 320,
        y: height - 60 - margin,
        size: 14,
        color: rgb(1, 0, 0),
    });

    //center info

    page.drawText(`${data?.patient_firstname || ""} ${data?.patient_lastname || ""}`, {
        x: 20,
        y: height - 133 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    let dob = data?.patient_dob ? moment(new Date(Number(data?.patient_dob))).format("DD/MM/YYYY") : "--/--/----"

    // patient dob
    drawTextWithSpacing(dob.split("/")[0], 14, height - 161)
    drawTextWithSpacing(dob.split("/")[1], 52, height - 161)
    drawTextWithSpacing(dob.split("/")[2], 89, height - 161)

    // patient code
    drawTextWithSpacing(`PT${data?.patient_id}`, 243, height - 165)

    //insurance provider
    page.drawText(`${data?.patient_insuranceprovider}`, {
        x: 20,
        y: height - 195 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //insurance number
    drawTextWithSpacing(`${data?.patient_insurancenumber}`, 242, height - 193)

    //doctor name
    page.drawText(`${data?.doctor_firstname || ""} ${data?.doctor_lastname || ""}`, {
        x: 20,
        y: height - 240 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //doctor code
    page.drawText(`ST${data?.doctor_id}`, {
        x: 270,
        y: height - 245 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //center name
    page.drawText(`${data?.center_name}`, {
        x: 20,
        y: height - 273 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //center code
    page.drawText(`HC${data?.center_id}`, {
        x: 270,
        y: height - 273 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //speciality


    if (data.doctor_specialization == "Médecin Généraliste" || data.doctor_specialization == 'General Physician') {
        page.drawText(`X`, {
            x: 410,
            y: height - 227 - margin,
            size: 8,
            color: textColor,
        });


    } else if (data.doctor_specialization == "Autre" || data.doctor_specialization == 'Other') {
        page.drawText(`X`, {
            x: 410,
            y: height - 256 - margin,
            size: 8,
            color: textColor,
        });


    } else {
        page.drawText(`X`, {
            x: 410,
            y: height - 242 - margin,
            size: 8,
            color: textColor,
        });
    }




    //////////////////////////////////////////

    if (data.full) {
        page.drawText(`X`, {
            x: 100,
            y: height - 315 - margin,
            size: 10,
            color: textColor,
        });
    }

    if (data.ald) {
        page.drawText(`X`, {
            x: 100,
            y: height - 330 - margin,
            size: 10,
            color: textColor,
        });
    }

    if (data.exonere) {
        page.drawText(`X`, {
            x: 100,
            y: height - 345 - margin,
            size: 10,
            color: textColor,
        });
    }




    if (data.accident) {
        page.drawText(`X`, {
            x: 262,
            y: height - 317 - margin,
            size: 10,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 296,
            y: height - 317 - margin,
            size: 10,
            color: textColor,
        });
    }

    page.drawText(`X`, {
        x: 393,
        y: height - 317 - margin,
        size: 10,
        color: textColor,
    });
    page.drawText(`X`, {
        x: 393,
        y: height - 340 - margin,
        size: 10,
        color: textColor,
    });
    // if (data.pregnancy) {


    // } else {

    // }

    let loopHeight = 0
    {
        data.labtest.map((item) => {
            const parseItem = JSON.parse(item)
            page.drawText(`${parseItem.name}`, {
                x: 40,
        y: height - 495.5 - margin - loopHeight,
                size: 10,
                color: textColor,
            });
            loopHeight = loopHeight + 18
        })
    }

    // page.drawText(data.labtest, {
    //     x: 40,
    //     y: height - 495.5 - margin,
    //     size: 10,
    //     color: textColor,
    // });

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

async function CreatePdfLabPrivate(source, type, barcodeValue, data) {



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

    page.drawText(`${data?.patient_firstname || ""} ${data?.patient_lastname || ""}`, {
        x: 20,
        y: height - 137 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    let dob = data?.patient_dob ? moment(new Date(Number(data?.patient_dob))).format("DD/MM/YYYY") : "--/--/----"

    // patient dob
    drawTextWithSpacing(dob.split("/")[0], 20, height - 167)
    drawTextWithSpacing(dob.split("/")[1], 58, height - 167)
    drawTextWithSpacing(dob.split("/")[2], 96, height - 167)

    // patient code
    drawTextWithSpacing(`PT${data?.patient_id}`, 245, height - 167)

    //insurance provider
    page.drawText(`${data?.patient_insuranceprovider}`, {
        x: 20,
        y: height - 195 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //insurance number
    drawTextWithSpacing(`${data?.patient_insurancenumber}`, 245, height - 195)

    //doctor name
    page.drawText(`${data?.doctor_firstname || ""} ${data?.doctor_lastname || ""}`, {
        x: 20,
        y: height - 245 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //doctor code
    page.drawText(`ST${data?.doctor_id}`, {
        x: 250,
        y: height - 245 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //center name
    page.drawText(`${data?.center_name}`, {
        x: 20,
        y: height - 275 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //center code
    page.drawText(`HC${data?.center_id}`, {
        x: 250,
        y: height - 275 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //speciality
    if (data.doctor_specialization == "Médecin Généraliste" || data.doctor_specialization == 'General Physician') {
        page.drawText(`X`, {
            x: 435,
            y: height - 235 - margin,
            size: 8,
            color: textColor,
        });
    } else if (data.doctor_specialization == "Autre" || data.doctor_specialization == 'Other') {
        page.drawText(`X`, {
            x: 435,
            y: height - 255 - margin,
            size: 8,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 435,
            y: height - 245 - margin,
            size: 8,
            color: textColor,
        });
    }




    //////////////////////////////////////////

    if (data.full) {
        page.drawText(`X`, {
            x: 98,
            y: height - 302 - margin,
            size: 10,
            color: textColor,
        });
    }

    if (data.ald) {
        page.drawText(`X`, {
            x: 98,
            y: height - 315 - margin,
            size: 10,
            color: textColor,
        });
    }

    if (data.exonere) {
        page.drawText(`X`, {
            x: 98,
            y: height - 328 - margin,
            size: 10,
            color: textColor,
        });
    }




    if (data.accident) {
        page.drawText(`X`, {
            x: 262,
            y: height - 317 - margin,
            size: 10,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 294,
            y: height - 317 - margin,
            size: 10,
            color: textColor,
        });
    }

    if (data.pregnancy) {

        page.drawText(`X`, {
            x: 406,
            y: height - 317 - margin,
            size: 10,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 406,
            y: height - 330 - margin,
            size: 10,
            color: textColor,
        });
    }

    let loopHeight = 0
    {
        data.labtest.map((item) => {
            const parseItem = JSON.parse(item)
            page.drawText(`${parseItem.name}`, {
                x: 40,
                y: height - 477 - margin - loopHeight,
                size: 10,
                color: textColor,
            });
            loopHeight = loopHeight + 18
        })
    }

    // page.drawText(data.labtest, {
    //     x: 40,
    //     y: height - 477 - margin,
    //     size: 10,
    //     color: textColor,
    // });

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




export { CreatePdfLabPublic, CreatePdfLabPrivate }

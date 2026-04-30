
import { degrees, PDFDocument, rgb, RotationTypes } from 'pdf-lib';
import JsBarcode from 'jsbarcode';
import moment from 'moment';

async function CreatePdf(source, home, type, barcodeValue, data) {
   
    const existingPdfBytes = await fetch(source).then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.arrayBuffer();
    });



   
    let margin = 0
    if (type == 'public') {
        margin = 3
    }
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

    // patient name
    page.drawText(`${data?.patient_firstname || ""} ${data?.patient_lastname || ""}`, {
        x: 20,
        y: height - 137 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    let dob = data?.patient_dob ? moment(new Date(Number(data?.patient_dob))).format("DD/MM/YYYY") : "--/--/----"

    // patient dob
    drawTextWithSpacing(dob.split("/")[0], 12, height - 167)
    drawTextWithSpacing(dob.split("/")[1], 50, height - 167)
    drawTextWithSpacing(dob.split("/")[2], 87, height - 167)

    // patient code
    drawTextWithSpacing(`PT${data?.patient_id}`, 235, height - 167)

    //insurance provider
    // page.drawText(`${data?.patient_insuranceprovider}`, {
    //     x: 20,
    //     y: height - 195 - margin,
    //     size: defaultFontSize,
    //     color: textColor,
    // });

    //insurance number
    drawTextWithSpacing(`${data?.patient_insurancenumber}`, 235, height - 195)

    //doctor name
    page.drawText(`${data?.doctor_firstname || ""} ${data?.doctor_lastname || ""}`, {
        x: 20,
        y: height - 245 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //doctor code
    page.drawText(`ST${data?.doctor_id}`, {
        x: 235,
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
        x: 235,
        y: height - 275 - margin,
        size: defaultFontSize,
        color: textColor,
    });

    //speciality
    if(data.doctor_specialization == "Médecin Généraliste" || data.doctor_specialization == 'General Physician'){
        page.drawText(`X`, {
            x: 427.5,
            y: height - 235 - margin,
            size: 8,
            color: textColor,
        });
    } else if(data.doctor_specialization == "Autre" || data.doctor_specialization == 'Other'){
        page.drawText(`X`, {
            x: 427.5,
            y: height - 255 - margin,
            size: 8,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 427.5,
            y: height - 245 - margin,
            size: 8,
            color: textColor,
        });
    }
   

    // date of consultation

    page.drawText(`${moment(new Date(Number(data?.data.created))).format("DD/MM/YYYY")}`, {
        x: 70,
        y: height - 385 - margin,
        size: defaultFontSize,
        color: textColor,
    });


    // home check
    if (home) {
        page.drawText(`X`, {
            x: 323.5,
            y: height - 385 - margin,
            size: 8,
            color: textColor,
        });
    } else {
        page.drawText(`X`, {
            x: 357,
            y: height - 385 - margin,
            size: 8,
            color: textColor,
        });
    }

    //prescription
    let loopHeight = 0
    {
        data?.data.prescription.map((item) => {
            const parseItem = JSON.parse(item)
            page.drawText(`${parseItem.tablet}`, {
                x: 14,
                y: height - 420 - margin - loopHeight,
                size: 10,
                color: textColor,
            });
            loopHeight = loopHeight + 16
        })
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

async function CreatePdfNoInsurance(barcodeValue, data) {

    let margin = 0
    const baseX = 20
    const baseY = 15

    const pdfDoc = await PDFDocument.create();
    const width = 595; 
    const height = 842;
    const page = pdfDoc.addPage([width, height]); 

   
    const defaultFontSize = 12;
    const textColor = rgb(0, 0, 0);

    page.drawRectangle({
        x: baseX, // X position of the rectangle
        y: height - baseY - 60, // Y position of the rectangle (top of the rectangle)
        width: 6, // Width of the rectangle
        height: 50, // Height of the rectangle
        color: rgb(0, 0, 1), // Blue color for the rectangle
    });

    // center name
    page.drawText(`${data?.center_name}`, {
        x: baseX + 10,
        y: height - baseY - 30,
        size: 20,
        color: textColor,
    });

    // center address

    page.drawText(`${data?.center_address}`, {
        x: baseX + 10,
        y: height - baseY - 43,
        size: 10,
        color: textColor,
    });

    page.drawText(`${data?.center_phonenumber || ""}`, {
        x: baseX + 10,
        y: height - baseY - 56,
        size: 10,
        color: textColor,
    });

    //date

    page.drawText(`Date: ${moment(new Date(Number(data?.data.created))).format("DD/MM/YYYY")}`, {
        x: baseX + 450,
        y: height - baseY - 30,
        size: 10,
        color: textColor,
    });

    const startX = 70; // Starting x position of the table
    const startY = height - baseY - 100; // Starting y position of the table
    const cellWidth = 200; // Width of each cell
    const cellHeight = 18; // Height of each cell
    const firstColumnWidth = 100; // Fixed width of the first column
    const secondColumnWidth = 100; // Fixed width of the second column

    function calculateAge(millis) {
        // Convert milliseconds to a Date object
        const birthDate = new Date(millis);

        // Get the current date
        const today = new Date();

        // Calculate the difference in years
        let age = today.getFullYear() - birthDate.getFullYear();

        // Adjust age if the birth date hasn't occurred yet this year
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const tableData = [
        ['Doctor Name', `${data?.doctor_firstname || ""} ${data?.doctor_lastname || ""}`],
        ['Specialty', `${data?.doctor_specialization || ""}`],
        ['Patient Name', `${data?.patient_firstname || ""} ${data?.patient_lastname || ""}`],
        ['Age', `${data?.patient_dob ? calculateAge(Number(data?.patient_dob)) : ""}`],
        ['D.O.B', `${data?.patient_dob ? moment(new Date(Number(data?.patient_dob))).format("DD/MM/YYYY") : "00/00/0000"}`],
        ['Address', `${data?.patient_address || ""}`],
    ];






    for (let i = 0; i < tableData.length; i++) {
        for (let j = 0; j < tableData[i].length; j++) {
            // Draw cell rectangle
            page.drawRectangle({
                x: startX + j * (j === 0 ? firstColumnWidth : secondColumnWidth),
                y: startY - (i + 1) * cellHeight,
                width: j === 0 ? firstColumnWidth : secondColumnWidth,
                height: cellHeight,
                color: rgb(1, 1, 1), // White color for cells
            });

            // Draw cell text
            page.drawText(tableData[i][j], {
                x: startX + j * (j === 0 ? firstColumnWidth : secondColumnWidth) + 5,
                y: startY - (i + 1) * cellHeight + 5,
                size: defaultFontSize,
                color: textColor,
            });
        }
    }

    //prescription

    let loopHeight = 0
    {
        data?.data.prescription.map((item) => {
            const parseItem = JSON.parse(item)
            page.drawText(`${parseItem.tablet}`, {
                x: baseX + 10,
                y: height - baseY - 300 - loopHeight,
                size: defaultFontSize,
                color: textColor,
            });

            page.drawText(`${data?.frequencytitle} - ${parseItem.frequency}, ${data?.whentitle} - ${parseItem.when}, ${data?.quantitytitle} - ${parseItem.quantity}`, {
                x: baseX + 30,
                y: height - baseY - 312 - loopHeight,
                size: 9,
                color: textColor,
            });
            loopHeight = loopHeight + 35
        })
    }

    
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob); // Create a URL for the blob
    link.href = url; // Set the href to the blob URL
    link.download = `${barcodeValue}.pdf`; // Set the desired filename

    // Append the link to the body (required for Firefox)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);

    // Revoke the object URL to free up resources
    URL.revokeObjectURL(url);
    return url
}



export { CreatePdf, CreatePdfNoInsurance }

'use client'
import { degrees, PDFDocument, rgb, RotationTypes, StandardFonts } from 'pdf-lib';
import JsBarcode from 'jsbarcode';
import moment from 'moment';

export default async function downloadReferal(data) {
    let margin = 0
    const baseX = 20
    const baseY = 15

    const pdfDoc = await PDFDocument.create();
    const width = 595;
    const height = 842;
    const page = pdfDoc.addPage([width, height]);
    const maxWidth = 550;


    const defaultFontSize = 12;
    const textColor = rgb(0, 0, 0);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let currentY = height - baseY - 43;

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

    currentY = drawTextBlock(page, data?.center_address, baseX + 10, currentY, 10, 400, font, textColor, pdfDoc);

    page.drawText(`${data?.center_phonenumber || ""}`, {
        x: baseX + 10,
        y: height - baseY - 56,
        size: 10,
        color: textColor,
    });

    //date

    page.drawText(`Date: ${moment(new Date()).format("DD/MM/YYYY")}`, {
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
        ['Specialty', data?.doctor_specialization || ""],
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
    // Wrapping text function
    function wrapText(text, maxWidth, fontSize, font) {
        // Split the text into paragraphs by newline character
        const paragraphs = text.split('\n');
        let lines = [];
    
        paragraphs.forEach(paragraph => {
            const words = paragraph.split(' ');
            let currentLine = '';
    
            words.forEach(word => {
                const width = font.widthOfTextAtSize(`${currentLine} ${word}`, fontSize);
                if (width < maxWidth) {
                    currentLine += (currentLine === '' ? '' : ' ') + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            });
    
            if (currentLine) {
                lines.push(currentLine);
            }
    
            // Add an empty line to separate paragraphs
            lines.push('');
        });
    
        return lines;
    }

    // Draw text block with automatic line breaks and y-position adjustment
    function drawTextBlock(page, text, x, y, fontSize, maxWidth, font, textColor, pdfDoc) {
        const lines = wrapText(text, maxWidth, fontSize, font);
        const lineHeight = fontSize + 2;
        const pageHeight = page.getHeight();
        const bottomMargin = 30;
    
        lines.forEach((line, index) => {
            // Check if the current y-position + lineHeight exceeds the bottom margin
            if (y - lineHeight < bottomMargin) {
                // Add a new page if the text goes beyond the bottom margin
                page = pdfDoc.addPage([page.getWidth(), pageHeight]);
                y = pageHeight - 30; // Reset y to start at the top of the new page
            }
    
            // Draw the text line
            page.drawText(line, {
                x: x,
                y: y,
                size: fontSize,
                color: textColor,
            });
    
            // Adjust the y-position for the next line
            y -= lineHeight;
        });
    
        return y;
    }

    // Set maximum width for text wrapping
   
    currentY = height - baseY - 270;

    // Draw dynamic content with wrapped text
    currentY = drawTextBlock(page, data.reasonTitle, baseX + 10, currentY, 12, maxWidth, font, textColor, pdfDoc);
    currentY = drawTextBlock(page, data.reason, baseX + 20, currentY - 10, 10, maxWidth, font, textColor, pdfDoc);
    currentY = drawTextBlock(page, data.symptomsTitle, baseX + 10, currentY - 10, 12, maxWidth, font, textColor, pdfDoc);
    currentY = drawTextBlock(page, data.symptoms, baseX + 20, currentY - 10, 10, maxWidth, font, textColor, pdfDoc);
    currentY = drawTextBlock(page, data.presentTitle, baseX + 10, currentY - 10, 12, maxWidth, font, textColor, pdfDoc);
    currentY = drawTextBlock(page, data.present, baseX + 20, currentY - 10, 10, maxWidth, font, textColor, pdfDoc);
    currentY = drawTextBlock(page, data.pastTitle, baseX + 10, currentY - 10, 12, maxWidth, font, textColor, pdfDoc);
    currentY = drawTextBlock(page, data.past, baseX + 20, currentY - 10, 10, maxWidth, font, textColor, pdfDoc);
    currentY = drawTextBlock(page, data.diagnosisTitle, baseX + 10, currentY - 10, 12, maxWidth, font, textColor, pdfDoc);
    currentY = drawTextBlock(page, data.diagnosis, baseX + 20, currentY - 10, 10, maxWidth, font, textColor, pdfDoc);


    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${data.patient_firstname}-referral.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
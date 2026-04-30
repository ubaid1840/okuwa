import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { NextResponse } from 'next/server';

class LogProcessor {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async readData() {
        const fileStream = fs.createReadStream(this.filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        const logData = [];
        let isReading = false; 
        let currentData = null;
        let  i = 1
        for await (const line of rl) {
            if (line.startsWith('P|') && line.includes('AUTO_PID')) {
               
                isReading = true;
                currentData = {
                    Header: {},
                    Patient: {},
                    Order: {},
                    Results: [],
                    Termination: null,
                    logDate: null,
                };
                this.parsePatientData(line, currentData);
            } else if (isReading) {
                if (line.startsWith('L|')) {
                    isReading = false;
                    currentData.Termination = line;
                    logData.push(currentData);
                } else if (line.startsWith('H|')) {
                    this.parseHeaderData(line, currentData);
                } else if (line.startsWith('O|')) {
                    this.parseOrderData(line, currentData);
                } else if (line.startsWith('R|')) {
                    this.parseResultData(line, currentData);
                }
            }

           
            if (!isReading && currentData && currentData.logDate === null) {
                const dateTimeMatch = line.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
                if (dateTimeMatch) {
                    currentData.logDate = dateTimeMatch[0];
                }
            }
            i++
        }

        return logData;
    }

    parseHeaderData(line, data) {
        const segments = line.split('|');
        data.Header = {
            sending_application: segments[3],
            sending_facility: segments[4],
            message_datetime: segments[12],
        };
    }

    parsePatientData(line, data) {
        const segments = line.split('|');
        data.Patient = {
            patient_id: segments[3],
            name: segments[5].replace('^', ' ').trim(),
            gender: segments[8],
            dob: segments[6],
        };
    }

    parseOrderData(line, data) {
        const segments = line.split('|');
        data.Order = {
            order_id: segments[2],
            specimen_type: segments[15],
            sample_collection_date: segments[6],
        };
    }

    parseResultData(line, data) {
        const segments = line.split('|');
        const testResult = {
            test_code: segments[2].slice(3).replace(/\^/g, ' '),
            value: segments[3],
            units: segments[4],
            reference_range: segments[5].replace("^REFERENCE_RANGE", ""),
            abnormal_flag: segments[6],
        };
        data.Results.push(testResult);
    }
}

export async function GET() {
    try {
        const logPath = path.resolve(process.cwd(), 'public/test/logs.txt');
        const logProcessor = new LogProcessor(logPath);

        const logs = await logProcessor.readData();

        return NextResponse.json(logs , { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
    }
}

export const revalidate = 0;

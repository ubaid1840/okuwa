// import { ChatOpenAI } from "@langchain/openai";
// import { z } from "zod";
// import { OpenAIWhisperAudio } from "@langchain/community/document_loaders/fs/openai_whisper_audio";


// const textModel = new ChatOpenAI({
//   model: "gpt-4o",
//   temperature: 0
// });

// // Getting Prescription from parsed data
// async function getPrescription(complaint, medicalHistory, examinationFindings) {

//     const resultData = z.object({
//     diagnosis: z.string().describe("The diagnosis based on examination"),
//     prescription: z.array(z.object({
//         tablet: z.string().describe("tablet name"),
//         frequency: z.string().describe("frequency per day example - (1, 2 or 3 times daily)"),
//         when: z.string().describe("time to take medicine when example - (before meals or after meal)"),
//         quantity: z.string().describe("quantity to be taken each in each dose - (10 tablets)")
//     })).describe("prescription based on the examination and diagnosois, array of objects")
//     });

//     const structuredLlm = textModel.withStructuredOutput(resultData);

//     let prompt = `
//     You are a certified doctor. A patient comes to you with the following complaint:
//     ${complaint}
//     he tells you about his medical history and you perform a physical examination.
//     History:
//     ${medicalHistory}
//     Based on the information provided, you do a examination and list the findings.
//     Examination Findings :
//     ${examinationFindings}

//     Based on the examination findings, you diagnose the patient and write a prescription.
//     Please provide the diagnosis and prescription in response in json format, as shown below:
//     {
//     "diagnosis": "diagnosis",
//     "prescription": [
//         {
//         "tablet": "tablet name 1",
//         "frequency": "frequency per day example - (1, 2 or 3 times daily)",
//         "when": "time to take medicine when example - (before meals or after meal)",
//         "quantity": "quantity to be taken each in each dose - (10 tablets)"
//         },
//         {
//         "tablet": "tablet name 2",
//         "frequency": "frequency per day example - (1, 2 or 3 times daily)",
//         "when": "time to take medicine when example - (before meals or after meal)",
//         "quantity": "quantity to be taken each in each dose - (10 tablets)"
//         }
//         ................
//     ]
//     }
//     `;
//     const res = await structuredLlm.invoke(prompt);
//     return res;
// }

// // let res = await getPrescription(textModel, "Patient complains of headache", "Patient has a history of hypertension", "BP - 140/90, Pulse - 80, Temperature - 98.6");
// // console.log(res);

// // Audio to Text
// async function parseAudioToText(filePath) {

//     const loader = new OpenAIWhisperAudio(filePath);
//     const docs = await loader.load();
//     return docs[0].pageContent;
// }

// // let parsedData = await parseAudioToText("audio1.m4a");
// // console.log(parsedData);

// // Text to json Output
// async function getJsonFromAudioTransl(parsedData) {
//     const resultData = z.object({
//         complaint: z.string().describe("Complaint of the patient"),
//         history: z.string().describe("History described by Patient"),
//         examinationFindings: z.string().describe("Findings of the examination by doctor")
//     });

//     const structuredLlm = textModel.withStructuredOutput(resultData);

//     let prompt = `
//     You are a certified Doctor, Given the narration of a Patient case, you understand the case fully and give a summary of data in json format. The output given by you is concise and gives full understanding of case to the medical staff.Use your experience and knowledge to provide the following information in json format:
//     1. Complaint of the patient
//     2. History described by Patient
//     3. Findings of the examination by doctor
//     Please provide the data in json format, as shown below:
//     {
//         "complaint": "Patient complains of headache",
//         "history": "Patient has a history of hypertension",
//         "examinationFindings": "BP - 140/90, Pulse - 80, Temperature - 98.6"
//     }
    
//     Narration By Doctor:
//     ${parsedData}
//     `;
//     const res = await structuredLlm.invoke(prompt);
//     return res;
// }

// export {getPrescription, parseAudioToText, getJsonFromAudioTransl}

// // let parsedData = `Patient is saying he has been having this headache for the past few days and it's really starting to wear him down. It started out as a mild dull ache in the forehead but now it feels like a constant pressure, almost like a tight band around his head. The pain isn't sharp but it's persistent and sometimes throbs a bit. I have noticed that bright lights and loud noises make it worse and he has been feeling slightly nauseous though I haven't seen him throw up. Patient is saying he hasn't had any head injuries or anything like that recently and he don't usually get headaches this bad. He has been trying to get enough sleep and drink water but it doesn't seem to help much. It is really affecting his ability to focus on work and just get through the day.`;

// // let jsonData = await getJsonFromAudioTransl(textModel, parsedData);
// // console.log(jsonData);
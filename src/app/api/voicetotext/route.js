

import { OpenAIWhisperAudio } from "@langchain/community/document_loaders/fs/openai_whisper_audio";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { tmpdir } from "os";
import { errors } from "@/data/data";

// Initialize OpenAI model
const textModel = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
    try {
        // Read the raw audio data from the request
        const audioData = await req.arrayBuffer(); // Use arrayBuffer to get raw data
        const buffer = Buffer.from(audioData);

        // Save the audio data to a temporary file
        const tempDir = tmpdir();
        const tempFilePath = path.join(tempDir, 'temp-audio.webm');
        
        await fs.writeFile(tempFilePath, buffer);
      
        // Step 1: Convert audio to text
        const transcription = await parseAudioToText(tempFilePath);
      
        // Step 2: Convert transcription text to JSON summary
        const jsonResponse = await getJsonFromAudioTransl(transcription);

        // Clean up: Remove the temporary file after processing
        await fs.unlink(tempFilePath);

        return NextResponse.json(jsonResponse, { status: 200 });
    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message : errors[1] }, { status: 500 });
    }
}

// Function to parse audio to text
async function parseAudioToText(filePath) {
    const loader = new OpenAIWhisperAudio(filePath, { clientOptions: { apiKey: process.env.OPENAI_API_KEY } });
    const docs = await loader.load();
    return docs[0].pageContent;
}

// Function to convert transcription to JSON format
async function getJsonFromAudioTransl(parsedData) {
    const resultData = z.object({
        complaint: z.string().describe("Complaint of the patient "),
        history: z.string().describe("History described by Patient and Doctor"),
        examinationFindings: z.string().describe("Findings of the examination by doctor"),
        patient: z.string().describe("elaborated Summary of Patient conversation (min 2-3 lines)"),
        doctor: z.string().describe("elaborated Summary of Doctor conversation (min 2-3 lines)"),
    });

    const structuredLlm = textModel.withStructuredOutput(resultData);

    let prompt = `
    Vous êtes un écrivain certifié, vous rédigez des résumés expliquant chaque élément du point de vue d'une troisième personne à la voix passive. vous agissez en tant que troisième personne dans la chambre et écrivez patient... médecin..., Compte tenu de la conversation entre un patient et un médecin, vous comprenez parfaitement le cas et rédigez un résumé des données au format json du point de vue d'une troisième personne. Le résultat que vous donnez est concis et donne une compréhension complète du cas au personnel médical. Utilisez votre expérience et vos connaissances pour fournir les informations suivantes au format json:
    1. Plainte
    2.Histoire
    3. Conclusions de l'examen
    4. Résumé élaboré des dialogues avec les patients (min 2-3 lignes)
    5. Résumé élaboré des dialogues du docteur (min 2-3 lignes)

    Veuillez fournir les données au format json, comme indiqué ci-dessous:
 {
        "complaint": "",
        "history": "",
        "examinationFindings": "",
        "patient": "",
        "doctor": "",
    }
    
    conversation entre 

Les valeurs de l'objet json doivent être dans le 
français, les clés doivent être en anglais

Patient et médecin :
    ${parsedData}
    `;
    const res = await structuredLlm.invoke(prompt);
    return res;
}

export const revalidate = 0;

// src/app/api/ai/getPrescription/route.js

import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const textModel = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  const { complaint, medicalHistory, examinationFindings } = await req.json();

  const resultData = z.object({
    diagnosis: z.string().describe("The diagnosis based on examination"),
    prescription: z.array(
      z.object({
        tablet: z.string().describe("tablet name"),
        frequency: z.string().describe("frequency per day example - (1, 2 or 3 times daily)"),
        when: z.string().describe("time to take medicine when example - (before meals or after meal)"),
        quantity: z.string().describe("quantity to be taken each in each dose - (10 tablets)")
      })
    ).describe("prescription based on the examination and diagnosis, array of objects"),
  });

  const structuredLlm = textModel.withStructuredOutput(resultData);

  let prompt = `
    You are a certified doctor. A patient comes to you with the following complaint:
    ${complaint}
    he tells you about his medical history and you perform a physical examination.
    History:
    ${medicalHistory}
    Based on the information provided, you do a examination and list the findings.
    Examination Findings:
    ${examinationFindings}

    Based on the examination findings, you diagnose the patient and write a prescription.
    Response language should be in the language of complaint and provide the diagnosis and prescription in response in json format and , as shown below:
    {
    "diagnosis": "diagnosis",
    "prescription": [
        {
        "tablet": "",
        "frequency": "",
        "when": "",
        "quantity": ""
        },
        {
        "tablet": "",
        "frequency": "",
        "when": "",
        "quantity": ""
        }
        ... more
    ]
    }
  `;

  const res = await structuredLlm.invoke(prompt);
  return new Response(JSON.stringify(res), { status: 200, headers: { "Content-Type": "application/json" } });
}


export const revalidate = 0;
import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the patientid and centerid
    const { patientid, centerid } = await req.json();

    // Validate patientid and centerid
    if (!patientid || !centerid) {
      return NextResponse.json({ message: 'patientID or centerID is missing' }, { status: 400 });
    }

    // Query to check if the patient is already signed up at the center
    const patientSignupCheck = `
      SELECT * FROM patient_signup WHERE patientid = $1 AND centerid = $2
    `;
    const signupResult = await pool.query(patientSignupCheck, [patientid, centerid]);

    // If the patient is already registered at the center, return a message
    if (signupResult.rows.length > 0) {
      return NextResponse.json({ message: 'Patient already added' }, { status: 400 });
    }

    // Query to check if the patient exists in the patient table
    const patientQuery = `
      SELECT * FROM patient WHERE id = $1
    `;
    const patientResult = await pool.query(patientQuery, [patientid]);

    // If no patient is found, return a message
    if (patientResult.rows.length === 0) {
      return NextResponse.json({ message: 'No patient found' }, { status: 404 });
    }

    // Extract patient data

    // Return patient data to the frontend
    return NextResponse.json(
      patientResult.rows[0]
      ,
      { status: 200 }
    );

  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message : errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;

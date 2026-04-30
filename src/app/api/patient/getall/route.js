import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the centerID
    const { centerid } = await req.json();

    // Validate the centerID
    if (!centerid) {
      return NextResponse.json({ message : errors[0] }, { status: 400 });
    }

    // Query to get all entries from the patient_signup table where centerID matches
    const signupResult = await pool.query(
      `SELECT patientid FROM patient_signup WHERE centerid = $1 ORDER BY id DESC`,
      [centerid]
    );

    // Check if there are any patient records for the center
    if (signupResult.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Extract patientids from the result
    const patientIds = signupResult.rows.map(row => row.patientid);

    // Query the patient table for details of all patients with matching patientids
    const patientDetailsResult = await pool.query(
      `SELECT * FROM patient WHERE id = ANY($1::int[])`,
      [patientIds]
    );

    // Return the patient data
    return NextResponse.json(patientDetailsResult.rows, { status: 200 });

  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message : errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the center ID
    const { id } = await req.json();

    // Validate the center ID
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT 
        labrequest.*,
        patient.id AS patient_id,
        patient.email AS patient_email,
        patient.number AS patient_number,
        patient.address AS patient_address,
        patient.firstname AS patient_firstname,
        patient.lastname AS patient_lastname,
        patient.gender AS patient_gender,
        patient.dob AS patient_dob,
        patient.insurances AS patient_insurances,
        staff.firstname AS doctor_firstname,
        staff.id AS doctor_id,
        staff.lastname AS doctor_lastname,
        staff.email AS doctor_email,
        staff.speciality AS doctor_specialization,
        staff.phonenumber AS doctor_phone
      FROM labrequest
      LEFT JOIN patient ON labrequest.patientid = patient.id
      LEFT JOIN staff ON labrequest.doctorid = staff.id
      WHERE labrequest.id = $1
      ORDER BY labrequest.created DESC`,
      [id]
    );

    // Check if there are any entries
    if (result.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Respond with the data including labrequest, patient, doctor, appointment, and center details
    return NextResponse.json(result.rows[0], { status: 200 });

  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

export const revalidate = 0;

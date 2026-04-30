import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the doctor ID
    const { id } = await req.json();
    
    // Validate the doctor ID
    if (!id) {
      return NextResponse.json({ message: 'Doctor ID is required' }, { status: 400 });
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
        staff.phonenumber AS doctor_phone,
        signup.id AS center_id, -- Adding center ID from the signup table
        signup.centername AS center_name,  -- Adding center name from the signup table
        signup.address AS center_address,  -- Adding center address from the signup table
        signup.phonenumber AS center_phone  -- Adding center phone number from the signup table
      FROM labrequest
      LEFT JOIN patient ON labrequest.patientid = patient.id 
      JOIN staff ON labrequest.doctorid = staff.id
      LEFT JOIN signup ON labrequest.centerid = signup.id
      WHERE labrequest.doctorid = $1
      ORDER BY labrequest.created DESC`,
      [id]
    );

    // Check if there are any entries
    if (result.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Respond with the data including medical records, center name, center ID, center address, and center phone
    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

export const revalidate = 0;

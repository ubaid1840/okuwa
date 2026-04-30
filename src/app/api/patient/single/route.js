import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the patient ID and center ID
    const { patientid, centerid } = await req.json();

    // Validate the patient ID and center ID
    if (!patientid || !centerid) {
      return NextResponse.json({ message : errors[0] }, { status: 400 });
    }

    // Check if the patient exists
    const patientCheckQuery = `
      SELECT * FROM patient
      WHERE id = $1
    `;
    const patientCheckResult = await pool.query(patientCheckQuery, [patientid]);

    // If the patient does not exist
    if (patientCheckResult.rows.length === 0) {
      return NextResponse.json({ message: 'Patient introuvable' }, { status: 404 });
    }

    // Fetch patient details
    const patientQuery = `
      SELECT patient.*, signup.centername
      FROM patient
      JOIN patient_signup ON patient.id = patient_signup.patientid
      JOIN signup ON patient_signup.centerid = signup.id
      WHERE patient.id = $1
    `;
    const patientResult = await pool.query(patientQuery, [patientid]);
    const patient = patientResult.rows[0];

    // Fetch all medical records of the patient for the given center, including doctor's information
    const medicalRecordsQuery = `
      SELECT medicalrecord.*, 
             signup.centername,
             staff.firstname AS doctor_firstname,
             staff.lastname AS doctor_lastname
      FROM medicalrecord
      JOIN signup ON medicalrecord.centerid = signup.id
      JOIN appointment ON medicalrecord.appointmentid = appointment.id
      JOIN staff ON appointment.doctorid = staff.id
      WHERE medicalrecord.patientid = $1 AND medicalrecord.centerid = $2
      ORDER BY medicalrecord.created DESC
    `;
    const medicalRecordsResult = await pool.query(medicalRecordsQuery, [patientid, centerid]);
    const medicalRecords = medicalRecordsResult.rows.length > 0 ? medicalRecordsResult.rows : [];

    // Fetch all appointments related to the patient for the given center
    const appointmentsQuery = `
      SELECT appointment.*, 
             staff.firstname AS doctor_firstname, 
             staff.lastname AS doctor_lastname,
             staff.speciality AS doctor_speciality
      FROM appointment
      LEFT JOIN staff ON appointment.doctorid = staff.id  -- Changed to LEFT JOIN to include appointments without doctorid
      WHERE appointment.patientid = $1 AND appointment.centerid = $2
      ORDER BY appointment.appointmentdate DESC, appointment.appointmenttime DESC
    `;
    const appointmentsResult = await pool.query(appointmentsQuery, [patientid, centerid]);
    const appointments = appointmentsResult.rows.length > 0 ? appointmentsResult.rows : [];

    // Fetch lab requests for the patient in the same center, including doctor's information
    const labRequestsQuery = `
      SELECT labrequest.*, 
             staff.firstname AS doctor_firstname,
             staff.lastname AS doctor_lastname,
             staff.speciality AS doctor_speciality
      FROM labrequest
      LEFT JOIN staff ON labrequest.doctorid = staff.id  -- Left join to include lab requests without a doctor
      WHERE labrequest.patientid = $1 AND labrequest.centerid = $2
      ORDER BY labrequest.created DESC
    `;
    const labRequestsResult = await pool.query(labRequestsQuery, [patientid, centerid]);
    const labRequests = labRequestsResult.rows.length > 0 ? labRequestsResult.rows : [];

    // Respond with the patient data, medical records, appointments, and lab requests
    return NextResponse.json(
      {
        patient,
        medicalRecords,
        appointments,
        labRequests
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: "Une erreur s'est produite" }, { status: 500 });
  }
}

export const revalidate = 0;

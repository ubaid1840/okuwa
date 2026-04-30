import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, {params}) {
  try {
    // Parse the request body to get the doctor ID
    const { id } = params
    
    // Validate the doctor ID
    if (!id) {
      return NextResponse.json({ message: errors[0] }, { status: 400 });
    }

    // Query to get all appointments related to the doctor ID, including complete staff (doctor), patient details, and center details
    const appointmentsResult = await pool.query(
      `SELECT 
        appointment.*,
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
      FROM appointment
      LEFT JOIN patient ON appointment.patientid = patient.id  -- Using LEFT JOIN to include appointments without a patient
      JOIN staff ON appointment.doctorid = staff.id
      LEFT JOIN signup ON appointment.centerid = signup.id  -- Join with the signup table using centerid
      WHERE appointment.doctorid = $1
      ORDER BY appointment.appointmentdate DESC, appointment.appointmenttime DESC`,
      [id]
    );

    // Check if there are any entries
    if (appointmentsResult.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Create an array to hold appointment data with medical records
    const appointmentsWithMedicalRecords = [];

    // Fetch medical records for each patient in the appointments
    for (const appointment of appointmentsResult.rows) {
      const patientId = appointment.patient_id;

      if (patientId) {
        // Query to get medical records for the specific patient
        const medicalRecordsResult = await pool.query(
          `SELECT * FROM medicalrecord WHERE patientid = $1`,
          [patientId]
        );

        // Add medical records to the appointment object or an empty array if none found
        appointment.medicalRecords = medicalRecordsResult.rows.length > 0 ? medicalRecordsResult.rows : [];
      } else {
        // If patient is not found, set medicalRecords as empty
        appointment.medicalRecords = [];
      }

      // Add the modified appointment object to the result array
      appointmentsWithMedicalRecords.push(appointment);
    }

    // Respond with the data including medical records, center name, center ID, center address, and center phone
    return NextResponse.json(appointmentsWithMedicalRecords, { status: 200 });

  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;

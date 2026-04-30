import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the center ID, start date, and end date
    const { id, startdate, enddate } = await req.json();

    // Validate the center ID, start date, and end date
    if (!id) {
      return NextResponse.json({ message : errors[0] }, { status: 400 });
    }
    if (!startdate || !enddate) {
      return NextResponse.json({ message : errors[0] }, { status: 400 });
    }

    // Query to get all appointments related to the center ID, including complete staff (doctor), patient, center details, and creator details
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
        doctor.firstname AS doctor_firstname,
        doctor.id AS doctor_id,
        doctor.lastname AS doctor_lastname,
        doctor.email AS doctor_email,
        doctor.speciality AS doctor_specialization,
        doctor.phonenumber AS doctor_phone,
        signup.id AS center_id, -- Adding center ID from the signup table
        signup.centername AS center_name,  -- Adding center name from the signup table
        signup.address AS center_address,  -- Adding center address from the signup table
        signup.phonenumber AS center_phone,  -- Adding center phone number from the signup table
        creator.firstname AS creator_firstname, -- Adding first name of the creator (createdby field)
        creator.lastname AS creator_lastname  -- Adding last name of the creator (createdby field)
      FROM appointment
      LEFT JOIN patient ON appointment.patientid = patient.id  -- Using LEFT JOIN to include appointments without a patient
      JOIN staff AS doctor ON appointment.doctorid = doctor.id  -- Join to get doctor details
      LEFT JOIN staff AS creator ON appointment.createdby = creator.id  -- Join to get creator (createdby) details
      LEFT JOIN signup ON appointment.centerid = signup.id  -- Join with the signup table using centerid
      WHERE appointment.centerid = $1
      AND appointment.appointmentdate BETWEEN $2 AND $3
      ORDER BY appointment.appointmentdate DESC, appointment.appointmenttime DESC`,
      [id, startdate, enddate]
    );

    // Check if there are any entries
    if (appointmentsResult.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Create an array to hold appointment data with medical records
    const appointmentsWithMedicalRecords = [];
    const patientCreatedBy = {}

    // Fetch medical records for each patient in the appointments
    for (const appointment of appointmentsResult.rows) {
      const patientId = appointment.patient_id;

      if (patientId) {
        // Query to get medical records for the specific patient
        const medicalRecordsResult = await pool.query(
          `SELECT * FROM medicalrecord WHERE patientid = $1`,
          [patientId]
        );

        const createdByResult = await pool.query(
            `SELECT * FROM patient_signup WHERE patientid = $1 AND centerid = $2`,
          [patientId, id]
        )

        const fetchedCreated = createdByResult.rows[0]

        if(fetchedCreated.creationcondition == 'admin'){
            appointment.patientCreatedBy = {firstname : "Admin", lastname : ""}
        } else {
            const createdResult = await pool.query(
                `SELECT * FROM staff WHERE id = $1`,
              [fetchedCreated.createdby]
            )
            if(createdResult.rows.length > 0){
                appointment.patientCreatedBy = createdResult.rows[0]
            }
        } 

        // Add medical records to the appointment object or an empty array if none found
        appointment.medicalRecords = medicalRecordsResult.rows.length > 0 ? medicalRecordsResult.rows : [];
      } else {
        // If patient is not found, set medicalRecords as empty
        appointment.medicalRecords = [];
      }

      // Add the modified appointment object to the result array
      appointmentsWithMedicalRecords.push(appointment);
    }

    // Respond with the data including medical records, center name, center ID, center address, center phone, and creator details
    return NextResponse.json(appointmentsWithMedicalRecords, { status: 200 });

  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message : errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;

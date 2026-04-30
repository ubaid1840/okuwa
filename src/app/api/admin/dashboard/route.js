import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the centerID
    const { centerid } = await req.json();

    // Validate the centerID
    if (!centerid) {
      return NextResponse.json({ message: errors[0] }, { status: 400 });
    }

    // Query to get all entries from the appointment, patient, and doctor tables where centerID matches
    const result = await pool.query(
      `SELECT 
          a.id AS appointment_id,
          a.appointmentdate,
          a.reason,
          a.status,
          a.centerid,
          a.invoiced,
          p.id AS patient_id,
          p.firstname AS patient_firstname,
          p.lastname AS patient_lastname,
          p.email AS patient_email,
          p.number AS patient_number,
          p.address AS patient_address,
          d.id AS doctor_id,
          d.firstname AS doctor_firstname,
          d.lastname AS doctor_lastname,
          d.email AS doctor_email,
          d.phonenumber AS doctor_phonenumber,
          d.speciality AS doctor_speciality
       FROM 
          appointment a
       JOIN 
          patient p ON a.patientid = p.id
       LEFT JOIN  -- Use LEFT JOIN to include appointments without a doctor
          staff d ON a.doctorid = d.id
       WHERE 
          a.centerid = $1
       ORDER BY 
          a.id DESC`,
      [centerid]
    );

    // Query to get the total number of appointments for the center
    const totalAppointmentsResult = await pool.query(
      `SELECT COUNT(*) AS total_appointments FROM appointment WHERE centerid = $1`,
      [centerid]
    );

    // Query to get the total number of unique patients for the center
    const totalPatientsResult = await pool.query(
      `SELECT COUNT(DISTINCT patientid) AS total_patients FROM appointment WHERE centerid = $1`,
      [centerid]
    );

    // Query to get the total invoiced amount for the center
    const totalInvoicedResult = await pool.query(
      `SELECT SUM(CAST(invoiced AS DECIMAL)) AS total_invoiced FROM appointment WHERE centerid = $1`,
      [centerid]
    );

    // Extract totals from the queries
    const totalAppointments = totalAppointmentsResult.rows[0].total_appointments;
    const totalPatients = totalPatientsResult.rows[0].total_patients;
    const totalInvoiced = totalInvoicedResult.rows[0].total_invoiced || 0; // Ensure totalInvoiced is 0 if there are no invoiced values

    const staff = await pool.query(
      `SELECT * FROM staff WHERE centerid = $1 ORDER BY id DESC`,
      [centerid]
    );

    // Check if there are any appointments
    if (result.rows.length === 0) {
      return NextResponse.json(
        { appointments: [], total_appointments: totalAppointments, total_patients: totalPatients, total_invoiced: totalInvoiced, staff: staff.rows.length === 0 ? [] : staff.rows },
        { status: 200 }
      );
    }

    // Respond with the data and totals, including total invoiced
    return NextResponse.json(
      { appointments: result.rows, total_appointments: totalAppointments, total_patients: totalPatients, total_invoiced: totalInvoiced, staff: staff.rows.length === 0 ? [] : staff.rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;

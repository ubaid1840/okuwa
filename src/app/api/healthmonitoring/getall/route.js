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

    // Query to get all entries from the healthmonitoring table where centerID matches
    const healthMonitoringResult = await pool.query(
      `SELECT * FROM healthmonitoring WHERE centerid = $1 ORDER BY id DESC`,
      [centerid]
    );

    // Check if there are any health monitoring records for the center
    if (healthMonitoringResult.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Extract patientids and nurseids from the result
    const patientIds = healthMonitoringResult.rows.map(row => row.patientid).filter(id => id);
    const nurseIds = healthMonitoringResult.rows.map(row => row.nurseid).filter(id => id);

    // Query the patient table for details of all patients with matching patientids
    let patientDetailsResult = [];
    if (patientIds.length > 0) {
      patientDetailsResult = await pool.query(
        `SELECT * FROM patient WHERE id = ANY($1::int[])`,
        [patientIds]
      );
    }

    // Query the staff table for details of all nurses with matching nurseids
    let nurseDetailsResult = [];
    if (nurseIds.length > 0) {
      nurseDetailsResult = await pool.query(
        `SELECT * FROM staff WHERE id = ANY($1::int[])`,
        [nurseIds]
      );
    }

    // Create a map for easy lookup of patient and nurse data by their IDs
    const patientMap = new Map();
    const nurseMap = new Map();

    patientDetailsResult.rows.forEach(patient => patientMap.set(patient.id, patient));
    nurseDetailsResult.rows.forEach(nurse => nurseMap.set(nurse.id, nurse));

    // Enrich the healthmonitoring records with patient and nurse details
    const enrichedHealthMonitoring = healthMonitoringResult.rows.map(row => ({
      ...row,
      patient: row.patientid ? patientMap.get(row.patientid) : null,
      nurse: row.nurseid ? nurseMap.get(row.nurseid) : null,
    }));

    // Return the enriched health monitoring data
    return NextResponse.json(enrichedHealthMonitoring, { status: 200 });

  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message : errors[0] }, { status: 500 });
  }
}

export const revalidate = 0;

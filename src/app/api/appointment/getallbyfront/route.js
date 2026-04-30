import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the centerID and createdby
    const { centerid, createdby } = await req.json();

    // Validate the centerID
    if (!centerid) {
      return NextResponse.json({ message: errors[0] }, { status: 400 });
    }

    // Query to get all entries from the appointment table where centerID matches
    const result = await pool.query(
      `SELECT 
          a.id AS appointment_id,
          a.appointmentdate,
          a.appointmenttime,
          a.reason,
          a.reasonid,
          a.service,
          a.status,
          a.centerid,
          a.invoiced,
          a.type,
          a.patientamount,
          a.insuranceamount,
          a.labtestcategory,
          a.labtesttube,
          a.labtestunit,
          a.code,
          a.abbreviation,
          a.globalcheckup,
          a.labuserid,
          a.requestlabtest,
          p.id AS patient_id,
          p.firstname AS patient_firstname,
          p.lastname AS patient_lastname,
          p.email AS patient_email,
          p.number AS patient_number,
          p.address AS patient_address,
          p.insurances AS patient_insurances,
          p.dob AS patient_dob,  -- Fetch patient date of birth
          l.id AS lab_id,
          l.firstname AS lab_firstname,
          l.lastname AS lab_lastname,
          l.speciality AS lab_speciality,
          l.email AS lab_email,
          d.id AS doctor_id,
          d.firstname AS doctor_firstname,
          d.lastname AS doctor_lastname,
          d.email AS doctor_email,
          d.phonenumber AS doctor_phonenumber,
          d.speciality AS doctor_speciality,
          d.roomid AS doctor_roomid,   -- Fetch roomid from doctor (staff)
          r.name AS room_name,         -- Fetch room name from room table
          c.firstname AS createdby_firstname,  -- Fetch firstname of createdby staff
          c.lastname AS createdby_lastname,     -- Fetch lastname of createdby staff
          cn.centername AS center_name
       FROM 
          appointment a
       JOIN 
          patient p ON a.patientid = p.id
        LEFT JOIN 
          staff l ON a.labuserid = l.id
       LEFT JOIN  -- Left join doctor (staff) to get doctor info and roomid
          staff d ON a.doctorid = d.id
       LEFT JOIN  -- Left join room based on roomid from doctor (staff)
          room r ON d.roomid = r.id
          LEFT JOIN  -- Left join staff to get the creator's name (createdby field)
          staff c ON a.createdby = c.id
      LEFT JOIN  -- Left join center to get center name
          signup cn ON a.centerid = cn.id
       WHERE 
          a.centerid = $1 
          AND (a.createdby = $2 OR a.createdby IS NULL)  -- Check for createdby or NULL
       ORDER BY 
          a.id DESC`,
      [centerid, createdby]
    );

    // Check if there are any entries
    if (result.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Respond with the data, including room_name if present
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;

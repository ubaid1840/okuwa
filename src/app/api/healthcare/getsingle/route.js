import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { id } = await req.json(); 

        // Query to get the entry from the signup table
        const signupResult = await pool.query(
            `SELECT * FROM signup WHERE id = $1`,
            [id]
        );

        // Check if there is any entry in signup table
        if (signupResult.rows.length === 0) {
            return NextResponse.json({ message: "No signup record found" }, { status: 404 });
        }

        const centerId = signupResult.rows[0].id;

        // Query to get all entries from the patient_signup table with matching centerid
        const patientResult = await pool.query(
            `SELECT * FROM patient_signup WHERE centerid = $1`,
            [centerId]
        );

        // Query to get all entries from the staff table with matching centerid
        const staffResult = await pool.query(
            `SELECT * FROM staff WHERE centerID = $1`,
            [centerId]
        );

        // Combine the results into a single object to return
        const responseData = {
            signup: signupResult.rows[0],
            patients: patientResult.rows.length,
            staff: staffResult.rows.length,
        };

        // Respond with the combined data
        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message : errors[1] }, { status: 500 });
    }
}

export const revalidate = 0;

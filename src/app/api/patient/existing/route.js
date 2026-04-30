import pool from '@/lib/db'; // Import PostgreSQL pool
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Parse the request body as JSON
        const {
            patientid,
            centerid,
            createdby,
            creationcondition
        } = await req.json();

        // Insert data into the staff table
        const result = await pool.query(
            `INSERT INTO patient_signup (
        patientid, centerid, createdby, creationcondition
      ) VALUES (
        $1, $2, $3
      ) RETURNING *`,
            [
                patientid,
                centerid,
                createdby,
                creationcondition
            ]
        );

        return NextResponse.json(
            { message: 'patient added successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating patient:', error);
        return NextResponse.json(
            { message: 'Failed to create patient' },
            { status: 500 }
        );
    }
}

export const revalidate = 0;

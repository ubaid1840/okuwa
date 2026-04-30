import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        const { id, cid } = params
      
        const patientSignupCheck = `
      SELECT * FROM patient_signup WHERE patientid = $1 AND centerid = $2
    `;
        const signupResult = await pool.query(patientSignupCheck, [id, cid]);
        if (signupResult.rows.length > 0) {
            return NextResponse.json({ message: "Patient déjà ajouté" }, { status: 400 });
        }
        const patientQuery = `
      SELECT * FROM patient WHERE id = $1
    `;
        const patientResult = await pool.query(patientQuery, [id]);
        if (patientResult.rows.length === 0) {
            return NextResponse.json({ message: "Aucun patient trouvé" }, { status: 404 });
        }
        return NextResponse.json(
            patientResult.rows[0]
            ,
            { status: 200 }
        );

    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message: errors[1] }, { status: 500 });
    }
}

export async function POST(req, {params}) {
    try {
       const {id, cid} = params
        const {
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
                id,
                cid,
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

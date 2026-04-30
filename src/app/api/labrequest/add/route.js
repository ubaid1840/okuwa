import pool from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(req) {
    try {

        const {
            centerid,
            patientid,
            requesttype,
            testtype,
            priority,
            created,
            expected,
            status,
            image,
            doctorid
        } = await req.json();

        if (!centerid) {
            return NextResponse.json(
                { message: 'Failed' },
                { status: 500 }
            );
        }

        // Insert data into the staff table
        const result = await pool.query(
            `INSERT INTO labrequest (
         centerid, patientid, requesttype, testtype, priority, created, expected, status, image, doctorid
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *`,
            [
                centerid,
                patientid,
                requesttype,
                testtype,
                priority,
                created,
                expected,
                status,
                image,
                doctorid
            ]
        );

        // Return the newly created staff record
        const newStaff = result.rows[0];

        return NextResponse.json(
            {
                message: 'lab request added'
            },
            { status: 200 }
        );
    } catch (error) {
        console.log('Error creating staff:', error);
        return NextResponse.json(
            { message: 'Failed' },
            { status: 500 }
        );
    }
}

export const revalidate = 0;

import pool from '@/lib/db'; // Import PostgreSQL pool
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Parse the request body as JSON
        const {
            centerid,
            doctorid,
            day,
            starttime,
            endtime,
        } = await req.json();

        const check = await pool.query(
            `SELECT * FROM schedulemanagement WHERE doctorid = $1 AND starttime = $2`,
            [doctorid, starttime]
        )

        if (check.rows.length != 0) {
            return NextResponse.json(
                { message: 'schedule added' },
                { status: 200 }
            );
        }
        // Insert data into the staff table
        const result = await pool.query(
            `INSERT INTO schedulemanagement (
       centerid, doctorid, day, starttime, endtime
      ) VALUES (
        $1, $2, $3, $4, $5
      ) RETURNING *`,
            [
                centerid,
                doctorid,
                day,
                starttime,
                endtime]
        );

        // Return the newly created staff record
        const newStaff = result.rows[0];
        return NextResponse.json(
            { message: 'schedule added', newStaff },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed' },
            { status: 500 }
        );
    }
}

export const revalidate = 0;

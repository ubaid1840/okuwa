import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Parse the request body to get the centerID
        const { id } = await req.json();

        // Validate the centerID
        if (!id) {
            return NextResponse.json({ message: errors[0] }, { status: 400 });
        }

        // Query to get all entries from the healthmonitoring table where centerID matches
        const results = await pool.query(
            `SELECT * FROM feedback WHERE centerid = $1 ORDER BY id DESC`,
            [id]
        );

        if (results.rows.length === 0) {
            return NextResponse.json([], { status: 200 });
        } else {
            return NextResponse.json(results.rows, { status: 200 });
        }



    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message: errors[0] }, { status: 500 });
    }
}

export const revalidate = 0;

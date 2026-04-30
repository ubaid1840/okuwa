
import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        const { id } = params
        const { searchParams } = new URL(req.url);
        const day = searchParams.get('day');

        if (day) {
            const result = await pool.query(
                `SELECT * FROM schedulemanagement WHERE doctorid = $1 AND day = $2`,
                [id, day]
            );
            if (result.rows.length === 0) {
                return NextResponse.json([], { status: 200 });
            }
            return NextResponse.json(result.rows, { status: 200 });
        } else {
            const result = await pool.query(
                `SELECT * FROM schedulemanagement WHERE doctorid = $1`,
                [id]
            );

            if (result.rows.length === 0) {
                return NextResponse.json([], { status: 200 });
            }
            return NextResponse.json(result.rows, { status: 200 });
        }


    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message: errors[1] }, { status: 500 });
    }
}

export const revalidate = 0;

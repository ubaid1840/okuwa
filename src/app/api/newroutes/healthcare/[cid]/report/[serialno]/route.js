import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { errors } from '@/data/data';

export async function GET(req, { params }) {
    try {
        const { cid, serialno } = params
        if (!serialno) {
            return NextResponse.json({ message: errors[0] }, { status: 400 });
        }
        const result = await pool.query(
            `SELECT * FROM report WHERE centerid = $1 AND serialno = $2 ORDER BY id DESC`,
            [cid, serialno]
        );
        if (result.rows.length === 0) {
            return NextResponse.json({ data: null }, { status: 200 });
        }
        return NextResponse.json({ data: result.rows[0] }, { status: 200 });

    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message: errors[1] }, { status: 500 });
    }
}


export async function POST(req, { params }) {
    try {
        const { cid, serialno } = params
        const { data, type, appointmentid, status } = await req.json()
        if (!data || !type || !appointmentid) {
            return NextResponse.json({ message: errors[0] }, { status: 400 });
        }
        const result = await pool.query(
            `INSERT INTO report (
        serialno, report, appointmentid, centerid, type, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      ) RETURNING *`,
            [serialno, data, appointmentid, cid, type, status]
        );

        return NextResponse.json({}, { status: 200 });

    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message: errors[1] }, { status: 500 });
    }
}

export const revalidate = 0
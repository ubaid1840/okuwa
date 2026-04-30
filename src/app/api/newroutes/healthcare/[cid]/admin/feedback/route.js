import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, {params}) {
    try {
        const { cid } = params
        if (!cid) {
            return NextResponse.json({ message: errors[0] }, { status: 400 });
        }
        const results = await pool.query(
            `SELECT * FROM feedback WHERE centerid = $1 ORDER BY id DESC`,
            [cid]
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

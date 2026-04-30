import { errors } from '@/data/data';
import pool from '@/lib/db'; // Import PostgreSQL pool
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        const { cid } = params
        const result = await pool.query(
            `SELECT * FROM settings WHERE centerid = $1`,
            [cid]
        );
        if (result.rows.length === 0) {
            return NextResponse.json(
                {},
                { status: 200 }
            );
        }


        return NextResponse.json(
            result.rows[0],
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { message: errors[1] },
            { status: 500 }
        );
    }
}

export const revalidate = 0;

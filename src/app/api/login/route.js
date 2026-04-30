import { errors } from '@/data/data';
import pool from '@/lib/db'; // Import PostgreSQL pool
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {

        const { email } = await req.json()
        const result = await pool.query(
            `SELECT * FROM usermanagement WHERE email = $1`,
            [email]
        );

        const insuranceResult = await pool.query(
            `SELECT * FROM insurance_users WHERE email = $1`,
            [email]
        );


        if (result.rows.length === 0 && insuranceResult.rows.length === 0) {
            return NextResponse.json(
                { message: "emailNotFound" },
                { status: 400 }
            );
        }

        if(result.rows.length > 0) {
            const data = result.rows[0];
            const newQuery = await pool.query(
                `SELECT * FROM signup WHERE id = $1`,
                [data.centerid]
            );
    
            if (newQuery.rows.length === 0) {
                return NextResponse.json(
                    { message: "notRegistered" },
                    { status: 400 }
                );
            }
    
            if (newQuery.rows[0].approved == false) {
                return NextResponse.json(
                    { message: "centerNotApproved" },
                    { status: 400 }
                );
            }
    
            const settings = await pool.query(
                `SELECT * FROM settings WHERE centerid = $1`,
                [newQuery.rows[0].id]
            );
            if (settings.rows.length === 0) {
                return NextResponse.json(
                    result.rows[0],
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    { ...result.rows[0], settingsData: settings.rows[0] },
                    { status: 200 }
                );
            }
        } else {
            return NextResponse.json(
                insuranceResult.rows[0],
                { status: 200 }
            );
        }
        

    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { message : errors[1] },
            { status: 500 }
        );
    }
}

export const revalidate = 0;

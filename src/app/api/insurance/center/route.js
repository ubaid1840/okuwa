import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { insurance_id } = await req.json();

        const signupInsuranceResult = await pool.query(
            `SELECT signup_id FROM signup_insurance WHERE insurance_id = $1`,
            [insurance_id]
        );

        if (signupInsuranceResult.rows.length === 0) {
            return NextResponse.json({ message: "No signup records found for this insurance." }, { status: 400 });
        }

        const signupIds = signupInsuranceResult.rows.map(row => row.signup_id);

        let finalData = [];

        for (let signup_id of signupIds) {

            const signupResult = await pool.query(
                `SELECT * FROM signup WHERE id = $1`,
                [signup_id]
            );

            if (signupResult.rows.length === 0) {
                continue;
            }

            const centerDetails = signupResult.rows[0];

            finalData.push({
                centerDetails: centerDetails,
            });
        }

        // Return the final data
        return NextResponse.json(finalData, { status: 200 });

    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
    }
}

export const revalidate = 0;

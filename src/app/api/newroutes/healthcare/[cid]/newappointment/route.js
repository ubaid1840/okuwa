import { errors } from '@/data/data';
import pool from '@/lib/db'; // Import PostgreSQL pool
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        const { cid } = params
        const resultsettings = await pool.query(
            `SELECT * FROM settings WHERE centerid = $1`,
            [cid]
        );

        const resultstaff = await pool.query(
            `SELECT 
                s.*, 
                r.name AS room_name 
             FROM 
                staff s
             LEFT JOIN 
                room r 
             ON 
                s.roomid = r.id
             WHERE 
                s.centerid = $1
             ORDER BY 
                s.id DESC`,
            [cid]
        );


        const patientresult = await pool.query(
            `SELECT patientid FROM patient_signup WHERE centerid = $1 ORDER BY id DESC`,
            [cid]
        );

        let patientDetailsResult

        if (patientresult.rows.length !== 0) {
            const patientIds = patientresult.rows.map(row => row.patientid);

            patientDetailsResult = await pool.query(
                `SELECT * FROM patient WHERE id = ANY($1::int[])`,
                [patientIds]
            );
        }


        const insuranceresult = await pool.query(
            `SELECT insurance_id FROM signup_insurance WHERE signup_id = $1 ORDER BY id DESC`,
            [cid]
        );


        let patientForInsurances

        if (insuranceresult.rows.length !== 0) {
            const patientIds = insuranceresult.rows.map(row => row.insurance_id);

            patientForInsurances = await pool.query(
                `SELECT * FROM insurance WHERE id = ANY($1::int[])`,
                [patientIds]
            );
        }

        const result = await pool.query(
            `SELECT * FROM reason WHERE centerid = $1`,
            [cid]
        );

        return NextResponse.json({
            settings: result.rows.length === 0 ? {} : resultsettings.rows[0],
            staff: resultstaff.rows.length === 0 ? [] : resultstaff.rows,
            patient: patientDetailsResult ? patientDetailsResult.rows : [],
            insurance: patientForInsurances ? patientForInsurances.rows : [],
            reason: result.rows.length === 0 ? [] : result.rows

        },
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

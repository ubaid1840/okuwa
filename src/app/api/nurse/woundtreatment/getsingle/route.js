import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Parse the request body to get the centerID
        const { id } = await req.json();

        // Validate the centerID
        if (!id) {
            return NextResponse.json({ message: 'Paramètres manquants' }, { status: 400 });
        }

        // Query to get all entries from the woundtreatment table where centerID matches
        const result = await pool.query(
            `SELECT 
                a.id AS wound_id,
                a.centerid,
                a.patientid,
                a.created,
                a.nurseid,
                a.status,
                a.wound,
                p.id AS patient_id,
                p.firstname AS patient_firstname,
                p.lastname AS patient_lastname,
                p.dob AS patient_dob,
                p.gender AS patient_gender,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', wd.id,
                            'woundtreatment_id', wd.woundtreatment_id,
                            'created', wd.created,
                            'image', wd.image,
                            'note', wd.note
                        )
                    ) FILTER (WHERE wd.id IS NOT NULL), '[]'
                ) AS woundtreatment_details
            FROM 
                woundtreatment a
            LEFT JOIN 
                patient p ON a.patientid = p.id
            LEFT JOIN 
                woundtreatment_detail wd ON a.id = wd.woundtreatment_id
            WHERE 
                a.id = $1
            GROUP BY 
                a.id, p.id
            ORDER BY 
                a.id DESC`,
            [id]
        );

        // Check if there are any entries
        if (result.rows.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Respond with the data including the woundtreatment details
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message: "Une erreur s'est produite" }, { status: 500 });
    }
}

export const revalidate = 0;

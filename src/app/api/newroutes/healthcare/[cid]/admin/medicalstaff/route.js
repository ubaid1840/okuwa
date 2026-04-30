import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function GET(req, { params }) {
    try {

        const { cid } = params
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('get');

        if (!cid) {
            return NextResponse.json({ message: 'Failed' }, { status: 400 });
        }

        if (type && type === 'facility') {
            const result = await pool.query(
                `SELECT * FROM room WHERE centerid = $1 ORDER BY id DESC`,
                [cid]
            );

            return NextResponse.json(
                result.rows,
                { status: 200 }
            );
        } else {
            const result = await pool.query(
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
            if (result.rows.length === 0) {
                return NextResponse.json([], { status: 200 });
            }
            return NextResponse.json(result.rows, { status: 200 });
        }

    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message: 'Failed' }, { status: 500 });
    }
}

export async function POST(req, { params }) {
    try {
        let userRecord
        const { cid } = params
        const {
            picture,
            firstname,
            lastname,
            dob,
            gender,
            phonenumber,
            email,
            homeaddress,
            officeaddress,
            speciality,
            qualification,
            medicalschool,
            training,
            fellowship,
            workhistory,
            role,
            status,
            roomid
        } = await req.json();

        try {
            const password = "1234qwer";
            userRecord = await admin.auth().createUser({
                email,
                password
            });
        } catch (firebaseError) {
            if (firebaseError.code === 'auth/email-already-exists') {
                console.log('User already exists in Firebase, proceeding to check the staff entry...');
            } else {
                console.error('Firebase error:', firebaseError);
                return NextResponse.json(
                    { message: "chec des informations d'identification de l'utilisateur" },
                    { status: 500 }
                );
            }
        }
        const check = await pool.query(
            `SELECT * FROM usermanagement WHERE email = $1`,
            [email]
        );

        if (check.rows.length !== 0) {
            if (check.rows[0].centerid === cid) {
                return NextResponse.json(
                    { message: "Personnel déjà inscrit" },
                    { status: 400 }
                );
            } else {
                return NextResponse.json(
                    { message: "Personnel déjà inscrit auprès d'autres" },
                    { status: 400 }
                );
            }
        }
        const result = await pool.query(
            `INSERT INTO staff (
          picture, firstname, lastname, dob, gender, phonenumber, email,
          homeaddress, officeaddress, speciality, qualification, medicalschool,
          training, fellowship, workhistory, centerID, role, status, roomid
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        ) RETURNING *`,
            [
                picture,
                firstname,
                lastname,
                dob,
                gender,
                phonenumber,
                email,
                homeaddress,
                officeaddress,
                speciality,
                qualification,
                medicalschool,
                training,
                fellowship,
                workhistory,
                cid,
                role,
                status,
                roomid
            ]
        );

        const fullName = firstname + " " + lastname;
        await pool.query(
            `INSERT INTO usermanagement (
          centerid, role, email, name
        ) VALUES (
          $1, $2, $3, $4
        ) RETURNING *`,
            [
                cid,
                role,
                email,
                fullName
            ]
        );

        return NextResponse.json(
            {
                message: 'Staff created successfully'
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating staff:', error);
        return NextResponse.json(
            { message: "Erreur lors de la création du personnel" },
            { status: 500 }
        );
    }
}

export const revalidate = 0;

import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
import { errors } from '@/data/data';

export async function POST(req, {params}) {
  try {
    const {cid} = params
    const {
      firstname,
      lastname,
      email,
      number,
      address,
      dob,
      gender,
      createdby,
      creationcondition,
      insurances
    } = await req.json();

    let userRecord;
    
    try {
      const password = "1234qwer";
      userRecord = await admin.auth().createUser({
        email,
        password
      });
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/email-already-exists') {
        console.log('User already exists in Firebase, proceeding to patient check...');
      } else {
        console.error('Firebase error:', firebaseError);
        return NextResponse.json(
          { message: "Échec des informations d'identification de l'utilisateur" },
          { status: 500 }
        );
      }
    }
    const emailCheckResult = await pool.query(
      `SELECT * FROM patient WHERE email = $1`,
      [email]
    );

    if (emailCheckResult.rows.length > 0) {
      return NextResponse.json(
        { message: "Email déjà enregistré dans le patient" },
        { status: 400 }
      );
    }
    const result = await pool.query(
      `INSERT INTO patient (
        email, number, address, firstname, lastname, dob, gender, insurances
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING *`,
      [
        email,
        number,
        address,
        firstname,
        lastname,
        dob,
        gender,
        insurances
      ]
    );
    const newPatient = result.rows[0];
    await pool.query(
      `INSERT INTO patient_signup (
        centerid, patientid, createdby, creationcondition
      ) VALUES (
        $1, $2, $3, $4
      )`,
      [
        cid,
        newPatient.id,
        createdby,
        creationcondition 
      ]
    );

    return NextResponse.json(
      newPatient,
      { status: 200 }
    );

  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { message: "Erreur lors de la création du patient" },
      { status: 500 }
    );
  }
}


export async function GET(req, {params}) {
  try {
    const { cid } = params
   if (!cid) {
      return NextResponse.json({ message : errors[0] }, { status: 400 });
    }
    const result = await pool.query(
      `SELECT patientid FROM patient_signup WHERE centerid = $1 ORDER BY id DESC`,
      [cid]
    );
    if (result.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    const patientIds = result.rows.map(row => row.patientid);
    const patientDetailsResult = await pool.query(
      `SELECT * FROM patient WHERE id = ANY($1::int[])`,
      [patientIds]
    );
    return NextResponse.json(patientDetailsResult.rows, { status: 200 });

  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message : errors[1] }, { status: 500 });
  }
}



export const revalidate = 0;

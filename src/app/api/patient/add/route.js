import pool from '@/lib/db'; // Import PostgreSQL pool
import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function POST(req) {
  try {
    const {
      firstname,
      lastname,
      email,
      number,
      address,
      centerid,
      dob,
      gender,
      createdby,
      creationcondition,
      insurances
    } = await req.json();

    let userRecord;
    
    // Try to create user in Firebase first
    try {
      const password = "1234qwer";
      userRecord = await admin.auth().createUser({
        email,
        password
      });
    } catch (firebaseError) {
      // If user already exists in Firebase, continue with the flow
      if (firebaseError.code === 'auth/email-already-exists') {
        console.log('User already exists in Firebase, proceeding to patient check...');
      } else {
        // If any other error occurs, return an error response
        console.error('Firebase error:', firebaseError);
        return NextResponse.json(
          { message: "Échec des informations d'identification de l'utilisateur" },
          { status: 500 }
        );
      }
    }

    // Check if the email already exists in the patient table
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

    // Insert data into the patient table
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

    // Return the newly created patient record
    const newPatient = result.rows[0];

    // Insert into patient_signup table
    await pool.query(
      `INSERT INTO patient_signup (
        centerid, patientid, createdby, creationcondition
      ) VALUES (
        $1, $2, $3, $4
      )`,
      [
        centerid,
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

export const revalidate = 0;

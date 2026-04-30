import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function POST(req) {
  try {
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
      centerID,
      role,
      status,
      roomid
    } = await req.json();

    let userRecord;

    // Attempt to create user in Firebase first
    try {
      const password = "1234qwer";
      userRecord = await admin.auth().createUser({
        email,
        password
      });
    } catch (firebaseError) {
      // Handle the case where the user already exists in Firebase
      if (firebaseError.code === 'auth/email-already-exists') {
        console.log('User already exists in Firebase, proceeding to check the staff entry...');
      } else {
        // Any other Firebase error should return an error response
        console.error('Firebase error:', firebaseError);
        return NextResponse.json(
          { message: "chec des informations d'identification de l'utilisateur" },
          { status: 500 }
        );
      }
    }

    // Check if the email already exists in the usermanagement table
    const check = await pool.query(
      `SELECT * FROM usermanagement WHERE email = $1`,
      [email]
    );

    if (check.rows.length !== 0) {
      if (check.rows[0].centerid === centerID) {
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

    // Insert data into the staff table
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
        centerID,
        role,
        status,
        roomid
      ]
    );

    // Return the newly created staff record
    const newStaff = result.rows[0];
    const fullName = firstname + " " + lastname;

    // Insert into usermanagement table
    const userTable = await pool.query(
      `INSERT INTO usermanagement (
        centerid, role, email, name
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING *`,
      [
        centerID,
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

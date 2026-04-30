import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the email
    const { email } = await req.json();

    // Validate the email
    if (!email) {
      return NextResponse.json({ message: "L'e-mail est manquant" }, { status: 400 });
    }

    // Query the usermanagement table to find the centerid and role for the given email
    const userManagementResult = await pool.query(
      `SELECT * FROM usermanagement WHERE email = $1`,
      [email]
    );

    const insuranceResult = await pool.query(
      `SELECT * FROM insurance_users WHERE email = $1`,
      [email]
    );

    // Check if the user exists in usermanagement
    if (userManagementResult.rows.length === 0 && insuranceResult.rows.length === 0) {
      return NextResponse.json({ message: "E-mail introuvable" }, { status: 404 });
    }

    if (userManagementResult.rows.length > 0) {
      const { centerid, role } = userManagementResult.rows[0];

      // If the role is 'admin', return the usermanagement row along with center details from the signup table
      if (role === 'admin') {
        const adminResult = await pool.query(
          `SELECT usermanagement.*,
          signup.centername AS center_name, 
        signup.address AS center_address, 
        signup.phonenumber AS center_phonenumber
           FROM usermanagement 
           LEFT JOIN signup ON usermanagement.centerid = signup.id
           WHERE usermanagement.email = $1`,
          [email]
        );
        return NextResponse.json(adminResult.rows[0], { status: 200 });
      }

      // If the role is not 'admin', query the staff table using the centerid and email
      const staffResult = await pool.query(
        `SELECT staff.*, 
        signup.centername AS center_name, 
        signup.address AS center_address, 
        signup.phonenumber AS center_phonenumber
  FROM staff
  LEFT JOIN signup ON staff.centerid = signup.id
  WHERE staff.centerid = $1 AND staff.email = $2`,
        [centerid, email]
      );

      // Check if the staff record exists for the center and email
      if (staffResult.rows.length === 0) {
        return NextResponse.json({ message: 'Enregistrement introuvable' }, { status: 404 });
      }

      // Return the staff row with center details
      return NextResponse.json(staffResult.rows[0], { status: 200 });
    } else {
      return NextResponse.json(insuranceResult.rows[0], { status: 200 });
    }



  } catch (error) {
    console.error('Processing Error:', error);
    return NextResponse.json({ message: "Une erreur s'est produite" }, { status: 500 });
  }
}

export const revalidate = 0;

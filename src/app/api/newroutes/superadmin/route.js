import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function GET() {
    try {
    const result = await pool.query(
        `SELECT * FROM signup ORDER BY id DESC`
      );
      if (result.rows.length === 0) {
        return NextResponse.json([]  , { status: 200 });
      }
      return NextResponse.json(result.rows , { status: 200 });
    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message : errors[1] }, { status: 500 });
    }
}


export async function POST(req) {
  try {
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return NextResponse.json({ message: 'Invalid JSON format' }, { status: 400 });
    }
    const {

      image,
      centerName,
      description,
      centerType,
      status,
      foundationDate,
      country,
      city,
      neighborhood,
      address,
      phoneNumber,
      faxNumber,
      email,
      website,
      socialMedia,
      directorName,
      directorOccupation,
      signature,
      bankName,
      accountNumber,
      bankOwnerName,
      bankAddress,
      bankSwiftCode,
      bankIBAN,
      mobileMoneyService,
      mobileMoneyCode,
      mobileMoneyName,
      taxImage,
      approved
    } = requestBody

    const check = await pool.query(
      `SELECT * FROM signup WHERE email = $1`,
      [email]
    );

    if (check.rows.length != 0) {
      return NextResponse.json({ message: "emailAlreadyRegistered" }, { status: 404 });
    }

    // Insert data into the signup table
    const result = await pool.query(
      `INSERT INTO signup (
               image, centerName, description, type, status, foundationDate,
              country, city, neighborhood, address, phoneNumber, faxNumber, email, website,
              socialMedia, directorName, directorOccupation, signature, bankName, accountNumber,
              bankOwnerName, bankAddress, bankSwiftCode, bankIBAN, mobileMoneyService, mobileMoneyCode,
              mobileMoneyName, taxImage, approved
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
              $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
            ) RETURNING *`,
      [
        image, centerName, description, centerType, status, foundationDate,
        country, city, neighborhood, address, phoneNumber, faxNumber, email, website,
        socialMedia, directorName, directorOccupation, signature, bankName, accountNumber,
        bankOwnerName, bankAddress, bankSwiftCode, bankIBAN, mobileMoneyService, mobileMoneyCode,
        mobileMoneyName, taxImage, approved
      ]
    );

    const newUser = result.rows[0];
    const role = "admin"
    const userTable = await pool.query(
      `INSERT INTO usermanagement (
             centerid, name, role, email
          ) VALUES (
            $1, $2, $3, $4
          ) RETURNING *`,
      [
        newUser.id, directorName, role, email
      ]
    );
    const returnUserTabel = userTable.rows[0]
    const password = "1234qwer"
    const userRecord = await admin.auth().createUser({
      email,
      password
    });
    return NextResponse.json({ newUser: newUser, userTable: returnUserTabel }, { status: 200 });
  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: 'errorOccured' }, { status: 500 });
  }
}

export const revalidate = 0;
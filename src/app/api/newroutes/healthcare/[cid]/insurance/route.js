import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, {params}) {
  try {
    const { cid } = params
    if (!cid) {
      return NextResponse.json({ message: 'centerID is required' }, { status: 400 });
    }
    const signupResult = await pool.query(
      `SELECT insurance_id FROM signup_insurance WHERE signup_id = $1 ORDER BY id DESC`,
      [cid]
    );
    if (signupResult.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    const patientIds = signupResult.rows.map(row => row.insurance_id);
    const patientDetailsResult = await pool.query(
      `SELECT * FROM insurance WHERE id = ANY($1::int[])`,
      [patientIds]
    );
    return NextResponse.json(patientDetailsResult.rows, { status: 200 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

export const revalidate = 0;
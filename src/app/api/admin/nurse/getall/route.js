import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the centerID
    const { centerid } = await req.json();

    // Validate the centerID
    if (!centerid) {
      return NextResponse.json({ message : errors[0] }, { status: 400 });
    }

    // Query to get all entries from the staff table where centerID matches
    const result = await pool.query(
        `SELECT * from staff
        WHERE centerid = $1 AND role = 'nurse'
        ORDER BY firstname ASC`,
        [centerid]
      );

    // Check if there are any entries
    if (result.rows.length === 0) {
      return NextResponse.json([] , { status: 200 });
    }

    // Respond with the data
    return NextResponse.json(result.rows , { status: 200 });
  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;
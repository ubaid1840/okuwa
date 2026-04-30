import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the centerID
    const { centerID } = await req.json();

    // Validate the centerID
    if (!centerID) {
      return NextResponse.json({ message : errors[0] }, { status: 400 });
    }

    // Query to get all entries from the staff table where centerID matches
    const result = await pool.query(
      `SELECT * FROM room WHERE centerid = $1`,
      [centerID]
    );

    return NextResponse.json({total : result.rows.length} , { status: 200 });
  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message : errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;

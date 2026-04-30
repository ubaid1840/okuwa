import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get doctorid and centerid
    const { doctorid, centerid } = await req.json();

    // Validate the input data
    if (!doctorid || !centerid) {
      return NextResponse.json({ message: errors[0] }, { status: 400 });
    }

    // Query to fetch all appointments with the specified doctorid and centerid
    const result = await pool.query(
      `SELECT * FROM appointment WHERE doctorid = $1 AND centerid = $2`,
      [doctorid, centerid]
    );

    // Check if there are any appointments
    if (result.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Respond with the fetched appointment data
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;
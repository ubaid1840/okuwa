import { errors } from '@/data/data';
import pool from '@/lib/db'; // Import PostgreSQL pool
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Extract the centerID from the request query parameters
    const { id } = await req.json()

    // Query to fetch the row from the settings table where centerID matches
    const result = await pool.query(
      `SELECT * FROM reason WHERE centerid = $1`,
      [id]
    );

    // Check if a row is found
    if (result.rows.length === 0) {
      return NextResponse.json(
        [],
        { status: 200 }
      );
    }
    return NextResponse.json(
      result.rows,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { message: errors[1] },
      { status: 500 }
    );
  }
}

export const revalidate = 0;

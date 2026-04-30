import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the centerID
    const { centerID } = await req.json();

    // Validate the centerID
    if (!centerID) {
      return NextResponse.json({ message: 'Failed' }, { status: 400 });
    }

    // Query to get all entries from the staff table where centerID matches
    const result = await pool.query(
      `SELECT 
          s.*, 
          r.name AS room_name 
       FROM 
          staff s
       LEFT JOIN 
          room r 
       ON 
          s.roomid = r.id
       WHERE 
          s.centerid = $1
       ORDER BY 
          s.id DESC`,
      [centerID]
    );

    // Check if there are any entries
    if (result.rows.length === 0) {
      return NextResponse.json([] , { status: 200 });
    }

    // Respond with the data
    return NextResponse.json(result.rows , { status: 200 });
  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: 'Failed' }, { status: 500 });
  }
}

export const revalidate = 0;

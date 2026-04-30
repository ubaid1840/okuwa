import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the appointment ID
    const { id } = await req.json();

    // Validate the ID
    if (!id) {
      return NextResponse.json({ message: 'Failed' }, { status: 400 });
    }

    // Delete the appointment from the table
    const result = await pool.query(
      `DELETE FROM room WHERE id = $1 RETURNING *`,
      [id]
    );

    // Check if any row was deleted
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Failed' }, { status: 404 });
    }

    // Respond with a success message
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: 'Failed' }, { status: 500 });
  }
}

export const revalidate = 0;

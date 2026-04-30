import { errors } from '@/data/data';
import pool from '@/lib/db'; // Import PostgreSQL pool
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body as JSON
    const { centerID, approved } = await req.json(); // Get centerID and approved status from the request body

    // Check if centerID is provided
    if (!centerID) {
      return NextResponse.json(
        { message: 'centerID is required' },
        { status: 400 }
      );
    }

    // Update the approved status for the given centerID
    const result = await pool.query(
      `UPDATE signup SET approved = $1 WHERE id = $2 RETURNING *`,
      [approved, centerID]
    );

    // If no rows were affected, the centerID does not exist
    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: 'Center not found' },
        { status: 404 }
      );
    }

    // Return the updated center data
    const updatedCenter = result.rows[0];
    return NextResponse.json(
      { message: 'Approved status updated successfully', updatedCenter },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating approved status:', error);
    return NextResponse.json(
      { message : errors[1] },
      { status: 500 }
    );
  }
}

export const revalidate = 0;

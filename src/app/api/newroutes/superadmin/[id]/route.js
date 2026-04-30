import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, {params}) {
    try {
        const { id } = params; 

        // Query to get the entry from the signup table
        const signupResult = await pool.query(
            `SELECT * FROM signup WHERE id = $1`,
            [id]
        );

        // Check if there is any entry in signup table
        if (signupResult.rows.length === 0) {
            return NextResponse.json({ message: "No signup record found" }, { status: 404 });
        }

        const centerId = signupResult.rows[0].id;

        // Query to get all entries from the patient_signup table with matching centerid
        const patientResult = await pool.query(
            `SELECT * FROM patient_signup WHERE centerid = $1`,
            [centerId]
        );

        // Query to get all entries from the staff table with matching centerid
        const staffResult = await pool.query(
            `SELECT * FROM staff WHERE centerID = $1`,
            [centerId]
        );

        const roomResults = await pool.query(
            `SELECT * FROM room WHERE centerid = $1`,
            [centerId]
        )

        // Combine the results into a single object to return
        const responseData = {
            signup: signupResult.rows[0],
            patients: patientResult.rows.length,
            staff: staffResult.rows.length,
            total : roomResults.rows.length
        };

        // Respond with the combined data
        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message : errors[1] }, { status: 500 });
    }
}

export async function PUT(req, {params}) {
    try {
        const {id} = params
      // Parse the request body as JSON
      const { approved } = await req.json(); // Get centerID and approved status from the request body
  
      // Check if centerID is provided
      if (!id) {
        return NextResponse.json(
          { message: 'centerID is required' },
          { status: 400 }
        );
      }
  
      // Update the approved status for the given centerID
      const result = await pool.query(
        `UPDATE signup SET approved = $1 WHERE id = $2 RETURNING *`,
        [approved, id]
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

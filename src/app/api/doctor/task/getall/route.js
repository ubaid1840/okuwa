import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the centerID
    const { centerid, id } = await req.json();

    // Validate the centerID
    if (!centerid || !id) {
      return NextResponse.json({ message : errors[0] }, { status: 400 });
    }

    // Query to get all entries from the staff table where centerID matches
    const result = await pool.query(
        `SELECT 
          task.id AS task_id, 
          task.deadline, 
          task.priority, 
          task.status, 
          task.task, 
          task.created, 
          staff.id AS staff_id, 
          staff.firstname, 
          staff.lastname, 
          staff.gender, 
          staff.dob
        FROM task
        LEFT JOIN staff ON task.nurseid = staff.id
        WHERE task.centerid = $1 AND assignedby = $2 AND admin = FALSE
        ORDER BY task.id DESC`,
        [centerid, id]
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
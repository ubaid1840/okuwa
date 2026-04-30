import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the centerID and nurseID
    const { centerid, nurseid } = await req.json();

    // Validate the centerID and nurseID
    if (!centerid || !nurseid) {
      return NextResponse.json({ message: errors[0] }, { status: 400 });
    }

    // Query to get all entries from the task table where centerID and nurseID match, along with the admin column
    const result = await pool.query(
      `SELECT 
        task.id AS task_id, 
        task.deadline, 
        task.priority, 
        task.status, 
        task.task, 
        task.created, 
        task.assignedby,
        task.admin
      FROM task
      WHERE task.centerid = $1 AND task.nurseid = $2
      ORDER BY task.id DESC`,
      [centerid, nurseid]
    );

    // Check if there are any entries
    if (result.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Prepare an array to hold tasks with nurse information
    const tasksWithNurseInfo = await Promise.all(result.rows.map(async (task) => {
      const assignedById = task.assignedby;
      let nurseInfo;

      // Check if the task is assigned by an admin or a nurse
      if (task.admin) {
        // If admin is true, set nurse information to "Admin"
        nurseInfo = { firstname: "Admin", lastname: "" }; // You can customize the lastname if needed
      } else {
        // If admin is false, find nurse information
        const nurseResult = await pool.query(
          `SELECT firstname, lastname 
          FROM staff 
          WHERE id = $1`, 
          [assignedById]
        );

        // Check if the nurse was found
        if (nurseResult.rows.length > 0) {
          nurseInfo = nurseResult.rows[0];
        } else {
          nurseInfo = { firstname: "Unknown", lastname: "" }; // Default if no nurse found
        }
      }

      // Return the task with the corresponding nurse information
      return {
        ...task,
        assignedby_firstname: nurseInfo.firstname,
        assignedby_lastname: nurseInfo.lastname
      };
    }));

    // Respond with the data
    return NextResponse.json(tasksWithNurseInfo, { status: 200 });
  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message: errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;

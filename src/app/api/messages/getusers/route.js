import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the email and id
    const { email, id } = await req.json();

    // Validate the email and id
    if (!email || !id) {
      return NextResponse.json({ message: 'email or id is missing' }, { status: 400 });
    }

    // Query to get all entries from the usermanagement table
    const result = await pool.query(
      `SELECT * FROM usermanagement WHERE centerid = $1 AND email != $2 ORDER BY id DESC`,
      [id, email]
    );

    // Check if there are any entries
    if (result.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Initialize the response objects
    let admin = [];
    const otherUsers = [];

    // Separate admin and other users
    for (const user of result.rows) {
      if (user.role === 'admin') {
        admin.push(user);
      } else {
        otherUsers.push({ email: user.email, centerid: user.centerid });
      }
    }

    

    // If there are no other users, return immediately with only the admin if it exists
    if (otherUsers.length === 0) {
      return NextResponse.json([...admin, ...otherUsers], { status: 200 });
    }

    // Query staff for other users' details
    const staffPromises = otherUsers.map(async (user) => {
      const staffResult = await pool.query(
        `SELECT * FROM staff WHERE email = $1 AND centerid = $2`,
        [user.email, user.centerid]
      );
      return {...staffResult.rows[0] };
    });

    // Wait for all staff queries to resolve
    const enrichedOtherUsers = await Promise.all(staffPromises);

    // Create response object conditionally based on the existence of admin
    const response = [...admin, ...enrichedOtherUsers]

    // Respond with the combined data
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Processing Error:", error);
    return NextResponse.json({ message : errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;

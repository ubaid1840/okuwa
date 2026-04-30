
import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
      const { email } = await req.json(); 
         // Query to get the last entry's ID from the signup table
         const result = await pool.query(
          `SELECT * FROM staff WHERE email = $1`,
          [email]
        );
  
      // Check if there is any entry
      if (result.rows.length === 0) {
        return NextResponse.json([], { status: 200 });
      }
  
      // Respond with the last entry ID
      return NextResponse.json( result.rows[0] , { status: 200 });
    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message: errors[1] }, { status: 500 });
    }
}

export const revalidate = 0;

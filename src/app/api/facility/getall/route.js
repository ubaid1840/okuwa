import { errors } from '@/data/data';
import pool from '@/lib/db'; // Import PostgreSQL pool connection
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { centerid } = await req.json();
    if (!centerid) {
      return NextResponse.json({ message: errors[0] }, { status: 400 });
    }
    const result = await pool.query(
        `SELECT * FROM room WHERE centerid = $1 ORDER BY id DESC`,
        [centerid]
      );
    
    return NextResponse.json(
        result.rows,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { message: errors[1] },
      { status: 500 }
    );
  }
}

export const revalidate = 0;
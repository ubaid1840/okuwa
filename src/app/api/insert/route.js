
import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the table name, columns, and values
    const { table, columns, values } = await req.json();

    // Validate the input
    if (!table || !columns || !values || columns.length !== values.length) {
      return NextResponse.json({ message : errors[0] }, { status: 400 });
    }

    // Form the column names part of the query dynamically
    const columnsQuery = columns.join(', ');

    // Form the values part of the query dynamically ($1, $2, ...)
    const valuesQuery = values.map((_, idx) => `$${idx + 1}`).join(', ');

    // Form the dynamic SQL query
    const query = `INSERT INTO ${table} (${columnsQuery}) VALUES (${valuesQuery}) RETURNING *`;

    // Execute the query using the pool
    const insertResult = await pool.query(query, values);

    // Check if insertion was successful
    if (insertResult.rowCount === 0) {
      return NextResponse.json({ message : errors[1] }, { status: 400 });
    }

    // Respond with success message and inserted data
    return NextResponse.json({ message: 'Insert successful', data: insertResult.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error executing insert query:', error);
    return NextResponse.json({ message: errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;

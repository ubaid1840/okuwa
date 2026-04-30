// /pages/api/update.js

import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the table name, columns, values, and conditions
    const { table, columns, values, conditions, conditionOperator = 'AND' } = await req.json();

    // Validate the input
    if (!table || !columns || !values || !conditions) {
      return NextResponse.json({ message : errors[0] }, { status: 400 });
    }

    // Form the SET part of the query dynamically based on the columns and values provided
    const setQuery = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');

    // Handle conditions (single or multiple)
    let conditionQuery = '';
    let conditionValues = [];

    if (Array.isArray(conditions)) {
      // Handle multiple conditions
      conditionQuery = conditions
        .map((cond, idx) => `${cond.column} ${cond.operator} $${columns.length + idx + 1}`)
        .join(` ${conditionOperator} `);
      conditionValues = conditions.map(cond => cond.value);
    } else if (typeof conditions === 'object') {
      // Handle a single condition
      conditionQuery = `${conditions.column} ${conditions.operator} $${columns.length + 1}`;
      conditionValues = [conditions.value];
    } else {
      return NextResponse.json({ message : errors[1] }, { status: 400 });
    }

    // Combine the values for both the SET and WHERE clauses
    const queryValues = [...values, ...conditionValues];

    // Form the dynamic SQL query
    const query = `UPDATE ${table} SET ${setQuery} WHERE ${conditionQuery}`;
    // Execute the query using the pool
    const updateResult = await pool.query(query, queryValues);

    // Check if any row was updated
    if (updateResult.rowCount === 0) {
      return NextResponse.json({ message : errors[1] }, { status: 404 });
    }

    // Respond with success message
    return NextResponse.json({ message: 'Update successful' }, { status: 200 });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ message : errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;

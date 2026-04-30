// /pages/api/delete.js

import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get the table name and conditions
    const { table, conditions, conditionOperator = 'AND' } = await req.json();

    // Validate the input
    if (!table || !conditions) {
      return NextResponse.json({ message: errors[0] }, { status: 400 });
    }

    // Handle conditions (single or multiple)
    let conditionQuery = '';
    let conditionValues = [];
    
    if (Array.isArray(conditions)) {
      conditionQuery = conditions.map((cond, idx) => `${cond.column} ${cond.operator} $${idx + 1}`).join(` ${conditionOperator} `);
      conditionValues = conditions.map(cond => cond.value);
    } else if (typeof conditions === 'object') {
      conditionQuery = `${conditions.column} ${conditions.operator} $1`;
      conditionValues = [conditions.value];
    } else {
      return NextResponse.json({ message: 'Format de conditions invalide' }, { status: 400 });
    }

    // Form the dynamic SQL query
    const query = `DELETE FROM ${table} WHERE ${conditionQuery}`;

    // Execute the query using the pool
    const deleteResult = await pool.query(query, conditionValues);

    // Check if any row was deleted
    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ message: errors[1] }, { status: 404 });
    }

    // Respond with success message
    return NextResponse.json({ message: 'Delete successful' }, { status: 200 });
  } catch (error) {
    console.error('Error executing delete query:', error);
    return NextResponse.json({ message: errors[1] }, { status: 500 });
  }
}

export const revalidate = 0;

import { errors } from '@/data/data';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        const { cid } = params
        if (!cid) {
            return NextResponse.json({ message: errors[0] }, { status: 400 });
        }

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
        WHERE task.centerid = $1
        ORDER BY task.id DESC`,
            [cid]
        );

        if (result.rows.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const nurseresult = await pool.query(
            `SELECT * from staff
            WHERE centerid = $1 AND role = 'nurse'
            ORDER BY firstname ASC`,
            [cid]
          );

      
        return NextResponse.json({task : result.rows, nurse : nurseresult.rows}, { status: 200 });
    } catch (error) {
        console.error("Processing Error:", error);
        return NextResponse.json({ message: errors[1] }, { status: 500 });
    }
}

export const revalidate = 0;
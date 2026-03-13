// app/api/interviews/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Interview from '@/models/Interview';

export async function GET() {
  await dbConnect();
  try {
    const interviews = await Interview.find({}).sort({ interviewDate: 1 });
    return NextResponse.json(interviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const interview = await Interview.create(body);
    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 });
  }
}
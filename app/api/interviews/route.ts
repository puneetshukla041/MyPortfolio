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

// --- NEW: Handle Edits ---
export async function PUT(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 });
    }

    const updatedInterview = await Interview.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updatedInterview, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
  }
}

// --- NEW: Handle Deletions ---
export async function DELETE(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 });
    }

    await Interview.findByIdAndDelete(_id);
    return NextResponse.json({ message: 'Interview deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete interview' }, { status: 500 });
  }
}
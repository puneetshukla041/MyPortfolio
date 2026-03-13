import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Interview from '@/models/Interview';

// --- NEW: Helper to prevent MongoDB Date crashes ---
const cleanData = (data: any) => {
  if (data.rounds && Array.isArray(data.rounds)) {
    data.rounds = data.rounds.map((round: any) => ({
      ...round,
      // If the date is an empty string, convert it to null so MongoDB doesn't crash
      interviewDate: round.interviewDate === "" ? null : round.interviewDate
    }));
  }
  return data;
};

export async function GET() {
  await dbConnect();
  try {
    // Updated sort to use 'updatedAt' since interviewDate is no longer at the root
    const interviews = await Interview.find({}).sort({ updatedAt: -1 });
    return NextResponse.json(interviews);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const cleanedBody = cleanData(body); // Clean the empty dates
    
    const interview = await Interview.create(cleanedBody);
    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error); // This will print the exact DB error in your terminal!
    return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 });
    }

    const cleanedData = cleanData(updateData); // Clean the empty dates
    
    const updatedInterview = await Interview.findByIdAndUpdate(_id, cleanedData, { new: true });
    return NextResponse.json(updatedInterview, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
  }
}

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
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: 'Failed to delete interview' }, { status: 500 });
  }
}
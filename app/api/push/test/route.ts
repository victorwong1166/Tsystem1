import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return mock response instead of actual push test
    return NextResponse.json({
      success: true,
      message: "Push notification test not configured yet",
      data: { supported: true, configured: false }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}

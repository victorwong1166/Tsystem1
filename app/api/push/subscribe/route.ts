import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Return mock response instead of actual push subscription
    return NextResponse.json({
      success: true,
      message: "Push notification subscription not configured yet",
      data: { subscribed: false }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}

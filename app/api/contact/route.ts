import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const emailPattern = /^\S+@\S+\.\S+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (name.length < 2 || name.length > 80)
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    if (!emailPattern.test(email) || email.length > 160)
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    if (message.length < 10 || message.length > 4000)
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });

    const docRef = await addDoc(collection(db, "contacts"), {
      name,
      email,
      message,
      status: "unread",
      createdAt: serverTimestamp(),
    });
    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit message" },
      { status: 500 },
    );
  }
}

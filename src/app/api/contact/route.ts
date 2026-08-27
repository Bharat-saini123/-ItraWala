import { prisma } from "@/lib/prisma";
import { sendContactFormEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const phoneDigits = String(phone).replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 },
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Save message to database
    const savedMessage = await prisma.message.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    // Send email to admin
    await sendContactFormEmail({
      name: savedMessage.name,
      email: savedMessage.email,
      phone: savedMessage.phone,
      subject: savedMessage.subject,
      message: savedMessage.message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! We'll get back to you soon.",
        messageId: savedMessage.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ALLOWED_FOLDERS = [
  "portfolio/profile",
  "portfolio/projects",
  "portfolio/media",
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const folderValue = formData.get("folder");

    // =========================================================
    // VALIDATE FILE
    // =========================================================

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No file was provided.",
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Only JPG, PNG and WebP images are allowed.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Image size must be less than 5MB.",
        },
        { status: 400 },
      );
    }

    // =========================================================
    // VALIDATE FOLDER
    // =========================================================

    const folder =
      typeof folderValue === "string" && ALLOWED_FOLDERS.includes(folderValue)
        ? folderValue
        : "portfolio/media";

    // =========================================================
    // FILE → BUFFER
    // =========================================================

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // =========================================================
    // CLOUDINARY UPLOAD
    // =========================================================

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      width?: number;
      height?: number;
      format?: string;
      bytes?: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",

          // Cloudinary akan mengoptimalkan format
          // yang cocok untuk delivery.
          quality: "auto",
          fetch_format: "auto",
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload failed."));
            return;
          }

          resolve({
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            bytes: uploadResult.bytes,
          });
        },
      );

      uploadStream.end(buffer);
    });

    // =========================================================
    // RESPONSE
    // =========================================================

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload image.",
      },
      { status: 500 },
    );
  }
}

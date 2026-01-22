import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload image from local path to Cloudinary
 * @param localPath - Path to local image file (e.g., "public/assets/logo/logo.png")
 * @param folder - Cloudinary folder name (e.g., "tefamart/campus")
 * @returns Cloudinary upload result with secure_url
 */
export async function uploadImageToCloudinary(
  localPath: string,
  folder: string,
): Promise<CloudinaryUploadResult> {
  try {
    // Resolve the absolute path
    const absolutePath = path.resolve(process.cwd(), localPath);

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    console.log(`   📤 Uploading ${path.basename(localPath)}...`);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(absolutePath, {
      folder: folder,
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    console.log(`   ✅ Uploaded successfully: ${result.secure_url}`);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error(`   ❌ Error uploading ${localPath}:`, error);
    throw error;
  }
}

/**
 * Upload multiple images from a directory
 * @param directoryPath - Path to directory containing images
 * @param folder - Cloudinary folder name
 * @returns Array of Cloudinary upload results
 */
export async function uploadImagesFromDirectory(
  directoryPath: string,
  folder: string,
): Promise<CloudinaryUploadResult[]> {
  const absolutePath = path.resolve(process.cwd(), directoryPath);

  if (!fs.existsSync(absolutePath)) {
    console.warn(`   ⚠️  Directory not found: ${absolutePath}`);
    return [];
  }

  const files = fs.readdirSync(absolutePath);
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
  });

  const results: CloudinaryUploadResult[] = [];

  for (const file of imageFiles) {
    const filePath = path.join(directoryPath, file);
    try {
      const result = await uploadImageToCloudinary(filePath, folder);
      results.push(result);
    } catch (error) {
      console.error(`   ❌ Failed to upload ${file}`);
    }
  }

  return results;
}

/**
 * Get all image files from a directory
 * @param directoryPath - Path to directory
 * @returns Array of image file names
 */
export function getImageFiles(directoryPath: string): string[] {
  const absolutePath = path.resolve(process.cwd(), directoryPath);

  if (!fs.existsSync(absolutePath)) {
    return [];
  }

  const files = fs.readdirSync(absolutePath);
  return files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
  });
}

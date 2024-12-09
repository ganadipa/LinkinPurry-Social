import { injectable } from "inversify";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

@injectable()
export class FileService {
  static Visibility = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE",
  } as const;

  private readonly uploadPath =
    process.env.ENVIRONMENT === "docker"
      ? "/var/www/uploads"
      : path.join(__dirname, "../../uploads/public");
  private readonly publicPath = path.join(this.uploadPath, "public");
  private readonly privatePath = path.join(this.uploadPath, "private");

  constructor() {
    this.initializeDirectories();
  }

  private async initializeDirectories(): Promise<void> {
    await fs.mkdir(this.uploadPath, { recursive: true });
    await fs.mkdir(this.publicPath, { recursive: true });
    await fs.mkdir(this.privatePath, { recursive: true });
  }

  private generateFileName(originalName: string): string {
    console.log(this.uploadPath);
    console.log(this.publicPath);
    console.log(this.privatePath);
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString("hex");
    const extension = path.extname(originalName);
    return `${timestamp}-${randomString}${extension}`;
  }

  public async upload(file: File, visibility: FileVisibility): Promise<string> {
    if (!file) {
      throw new Error("No file provided");
    }

    const fileName = this.generateFileName(file.name);
    const targetPath =
      visibility === "PUBLIC"
        ? path.join(this.publicPath, fileName)
        : path.join(this.privatePath, fileName);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(targetPath, buffer);

      const path =
        visibility === "PUBLIC"
          ? `/${fileName}`
          : `/uploads/private/${fileName}`;

      return `${path}`;
    } catch (error) {
      console.error("File upload error:", error);
      throw new Error("Failed to upload file");
    }
  }

  public async delete(filePath: string): Promise<void> {
    try {
      // Remove leading slash if present
      const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

      // Check if it's a private path
      if (cleanPath.startsWith("uploads/private/")) {
        const fileName = cleanPath.split("/").pop();
        if (!fileName) throw new Error("Invalid file path");
        const fullPath = path.join(this.privatePath, fileName);
        await fs.access(fullPath);
        await fs.unlink(fullPath);
      } else {
        // It's a public file
        const fullPath = path.join(this.publicPath, cleanPath);
        await fs.access(fullPath);
        await fs.unlink(fullPath);
      }
    } catch (error) {
      console.error("File deletion error:", error);
      throw new Error("Failed to delete file");
    }
  }
}

export type FileVisibility =
  (typeof FileService.Visibility)[keyof typeof FileService.Visibility];

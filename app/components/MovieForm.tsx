"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

if (
  !process.env.NEXT_PUBLIC_AWS_REGION ||
  !process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
  !process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
) {
  throw new Error("Missing AWS environment variables");
}

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const movieSchema = z.object({
  title: z.string().nonempty("Title is required"),
  year: z
    .number()
    .int("Year must be an integer")
    .positive("Year must be a positive integer")
    .refine((val) => val.toString().length === 4, {
      message: "Year must be a 4-digit number",
    }),
  fileUrl: z.string().url("Invalid file URL"),
});

interface MovieFormProps {
  initialData?: {
    title: string;
    year: number;
    fileUrl: string;
  };
  onSubmit: (formData: {
    title: string;
    year: number;
    fileUrl: string;
  }) => Promise<void>;
  showDeleteButton?: boolean;
  onDelete?: () => Promise<void>;
}

const MovieForm: React.FC<MovieFormProps> = ({
  initialData,
  onSubmit,
  showDeleteButton = false,
  onDelete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(initialData?.title || "");
  const [year, setYear] = useState(initialData?.year?.toString() || "");
  const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || "");
  const [errors, setErrors] = useState<{
    title?: string;
    year?: string;
    file?: string;
  }>({});

  const router = useRouter();

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setYear("");
    setFileUrl("");
    setErrors({});
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const deleteFileFromS3 = async (fileUrl: string) => {
    const fileName = fileUrl.split("/").pop();
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: fileName,
    };

    try {
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
    }
  };

  const uploadFileToS3 = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: `${Date.now()}_${file.name}`,
      Body: buffer,
      ContentType: file.type,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      const fileUrl = `https://${params.Bucket}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${params.Key}`;
      return fileUrl;
    } catch (error) {
      alert("Error uploading file to S3:");
      resetForm();
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newFileUrl = fileUrl;
    if (file) {
      if (fileUrl) {
        await deleteFileFromS3(fileUrl);
      }
      newFileUrl = (await uploadFileToS3(file)) || "";
    }

    const formData = {
      title,
      year: parseInt(year, 10),
      fileUrl: newFileUrl,
    };

    const validation = movieSchema.safeParse(formData);

    if (!validation.success) {
      const newErrors: { title?: string; year?: string } = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0] === "title") {
          newErrors.title = error.message;
        } else if (error.path[0] === "year") {
          newErrors.year = error.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);
    resetForm();
  };

  const handleDelete = async () => {
    if (fileUrl) {
      await deleteFileFromS3(fileUrl);
    }
    if (onDelete) {
      await onDelete();
    }

    resetForm();
    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-12"
    >
      {/* Form Inputs */}
      <div className="flex flex-col gap-6 order-1 md:order-2">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-3 bg-input text-white rounded-lg border ${
              errors.title ? "border-red-500" : "border-white"
            }`}
          />
          {errors.title && <p className="text-red-500 mt-1">{errors.title}</p>}
        </div>
        <div>
          <input
            type="number"
            placeholder="Publishing year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`w-full p-3 bg-input text-white rounded-lg border ${
              errors.year ? "border-red-500" : "border-white"
            }`}
          />
          {errors.year && <p className="text-error mt-1">{errors.year}</p>}
        </div>
        {/* Buttons for desktop view */}
        <div className="hidden md:flex gap-6 mt-6">
          {showDeleteButton && (
            <button
              type="button"
              className="w-1/2 py-3 font-bold border border-red-600 text-error rounded-lg hover:bg-red-700 hover:text-white flex items-center justify-center"
              onClick={handleDelete}
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </button>
          )}
          <button
            type="button"
            className="w-1/2 py-3 font-bold border border-white text-white rounded-lg hover:bg-gray-700"
            onClick={() => {
              resetForm();
              router.push("/");
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 py-3 font-bold bg-primary text-white rounded-lg hover:bg-green-500"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div
        {...getRootProps()}
        className={`w-full h-80 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer bg-input ${
          errors.file ? "border-red-500" : "border-gray-500"
        } order-2 md:order-1`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="text-white flex flex-col items-center">
            <p>{file.name}</p>
            <Image
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="mt-4 max-h-40"
            />
          </div>
        ) : (
          <div className="text-white flex flex-col items-center">
            {fileUrl && (
              <Image
                src={fileUrl}
                alt="Current Image"
                className="mt-4 max-h-40"
              />
            )}
            <p>📂 Drop an image here to replace</p>
          </div>
        )}
        {errors.file && <p className="text-error mt-1">{errors.file}</p>}
      </div>

      {/* Buttons for mobile view */}
      <div className="flex gap-6 mt-6 md:hidden order-3">
        {showDeleteButton && (
          <button
            type="button"
            className="w-1/2 py-3 font-bold border border-red-600 text-error rounded-lg hover:bg-red-700 hover:text-white flex items-center justify-center"
            onClick={handleDelete}
          >
            <TrashIcon className="h-5 w-5 mr-2" />
          </button>
        )}
        <button
          type="button"
          className="w-1/2 py-3 font-bold border border-white text-white rounded-lg hover:bg-gray-700"
          onClick={() => {
            resetForm();
            router.push("/");
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-1/2 py-3 font-bold bg-primary text-white rounded-lg hover:bg-green-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default MovieForm;

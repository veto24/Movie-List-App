"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";

// Define the Zod schema for user input validation
const userSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, any>>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const router = useRouter();

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const result = userSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = result.error.errors.reduce(
        (acc: Record<string, any>, error) => {
          acc[error.path[0] as string] = error.message;
          return acc;
        },
        {}
      );
      setErrors(formattedErrors);
      return;
    }

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result.data),
        }
      );

      const resultData = await response.json();
      if (response.ok) {
        console.log("Signup success");
        router.push("/sign-in");
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: resultData.error,
        }));
      }
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "An unexpected error occurred. Please try again.",
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg shadow-sm w-full max-w-md">
        <h1 className="text-5xl font-bold mb-6 text-center text-white">
          Sign Up
        </h1>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`bg-input border mt-1 text-white block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm ${
                errors.email ? "border-error" : "border-transparent"
              }`}
              required
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`bg-input border mt-1 text-white block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm ${
                errors.password ? "border-error" : "border-transparent"
              }`}
              required
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Confirm Password"
              id="confirm-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`bg-input border mt-1 text-white block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm ${
                errors.confirmPassword ? "border-error" : "border-transparent"
              }`}
              required
            />
            {errors.confirmPassword && (
              <p className="text-error text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            href="/sign-in"
            className="text-primary hover:text-primary-dark text-sm"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

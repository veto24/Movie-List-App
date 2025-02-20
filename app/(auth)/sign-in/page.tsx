"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";

// Define the Zod schema for user input validation
const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    console.log(process.env.NEXTAUTH_SECRET); // temporary
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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

    const signInData = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (signInData?.error) {
      console.log("signInData.error", signInData.error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Invalid credentials",
      }));
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg shadow-sm w-full max-w-md">
        <h1 className="text-5xl font-bold mb-6 text-center text-white">
          Sign In
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`bg-input mt-1 border text-white block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm ${
                errors.email ? "border-error" : "border-transparent"
              }`}
              required
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <input
              type="password"
              id="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`bg-input mt-1 text-white block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm ${
                errors.password ? "border-error" : "border-transparent"
              }`}
              required
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="mb-6 flex items-center justify-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 text-white block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            href="/sign-up"
            className="text-primary hover:text-primary-dark text-sm"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

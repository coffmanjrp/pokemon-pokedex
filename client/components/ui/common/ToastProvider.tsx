"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options
        className: "",
        duration: 4000,
        style: {
          background: "#363636",
          color: "#fff",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        },

        // Custom styles for different types
        success: {
          duration: 3000,
          style: {
            background: "#10B981", // Green
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10B981",
          },
        },

        error: {
          duration: 5000,
          style: {
            background: "#EF4444", // Red
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#EF4444",
          },
        },

        loading: {
          duration: 30000, // 30 seconds timeout instead of Infinity
          style: {
            background: "#3B82F6", // Blue
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#3B82F6",
          },
        },
      }}
    />
  );
}

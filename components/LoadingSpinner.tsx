import React from "react"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-screen py-10">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2"
            />
          </svg>
        </div>
      </div>
      <span className="ml-4 text-blue-300 text-lg font-semibold animate-pulse">Loading...</span>
    </div>
  )
}

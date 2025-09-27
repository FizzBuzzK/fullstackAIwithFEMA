"use client";

import { useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";


type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void; // provided by Next.js to re-render the route
};


/**
 * ==========================================================
 * @param param0 
 * @returns 
 * ==========================================================
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {

  useEffect(() => {
    console.error(error);
  }, [error]);

  //==========================================================
  return (
    <section className="bg-blue-50 min-h-screen flex-grow">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-24 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <div className="flex justify-center">
            <FaExclamationCircle className="text-orange-600 text-8xl fa-5x" />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold mt-4 mb-2">Something Went Wrong</h1>

            <p className="text-gray-500 text-xl mb-10">
              {error?.message ?? "An unexpected error occurred."}
              {error?.digest ? 
              (
                <span className="block mt-2 text-sm text-gray-400">Ref: {error.digest}</span>
              ) : 
              null}
            </p>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => reset()}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded"
              >
                Try Again
              </Button>

              <Link
                href="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-4 px-6 rounded"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow"></div>
    </section>

  );
  
}





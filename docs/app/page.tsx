"use client";

// Libraries:
import Head from "next/head";
import { Button } from "@chakra-ui/react";
import Link from "next/link";

// Main Page:
export default function MainPage() {
  // Render:
  return (
    <div>
      <Head>
        <title>Tally Sync</title>
        <meta name="description" content="Sync Data with Tally" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black h-[100vh]">
        <h2 className="py-10 text-[72px] font-bold text-transparent text-center bg-clip-text bg-gradient-to-r from-blue-500 via-purple-700 to-purple-900">
          Statement Analyzer
        </h2>

        <div className="mt-32 mx-auto w-1/2 flex flex-row justify-around gap-20">
          <div className="p-10 border- rounded-lg">
            <Button colorScheme="orange">Prequisites</Button>
          </div>
          <div className="p-10 border- rounded-lg">
            <Button colorScheme="blue">How To Use</Button>
          </div>
          <div className="p-10 border- rounded-lg">
            <Link href="/tool">
              <Button colorScheme="green">Go To App</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

// Libraries:
import Head from "next/head";
import { useState } from "react";
import { Button, Textarea } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import convert from "xml-js";

// Main:
export default function Home() {
  // convertToJSON
  const toast = useToast();
  let [value, setValue] = useState("");
  function convertToJSON(e: any) {
    let XmlData = e.target.value;
    let JsonData = "Processing...";
    try {
      JsonData = convert.xml2json(XmlData, { compact: true, spaces: 4 });
    } catch (error) {
      JsonData = "-- ERROR --";
    }
    setValue(JsonData);
  }
  function copyValue() {
    navigator.clipboard.writeText(value).then(
      () => {
        toast({
          duration: 3000,
          status: "success",
          title: "Copied to Clipboard",
          containerStyle: { marginBottom: "5vh" },
        });
      },
      () => {
        toast({
          status: "error",
          duration: 3000,
          title: "Failed to Copy",
          containerStyle: { marginBottom: "5vh" },
        });
      }
    );
  }

  // Render:
  return (
    <div>
      <Head>
        <title>XML Convertor</title>
        <meta name="description" content="XML to JSON using xml-js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-12 mx-auto w-3/4 flex flex-row gap-32">
        <Textarea
          placeholder="XML Input"
          onChange={convertToJSON}
          resize="none"
          h="90vh"
          border="2px"
          borderColor="gray"
        />

        <div className="mt-[35vh] flex flex-col gap-10">
          <Button colorScheme="teal" size="lg" px={16}>
            Convert to JSON
          </Button>
          <Button colorScheme="green" size="lg" px={16} onClick={copyValue}>
            Copy
          </Button>
        </div>

        <Textarea
          placeholder="JSON Output"
          value={value}
          resize="none"
          disabled
          h="90vh"
          border="2px"
          borderColor="gray"
        />
      </main>
    </div>
  );
}

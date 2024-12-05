// Types:
import type { MouseEventHandler, ReactNode } from "react";
type COLOR_WORKAROUND = "sky" | "red" | "blue" | "green" | "purple"; // keyof DefaultColors;
type Button = {
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  colorScheme?: COLOR_WORKAROUND;
};
interface SimpleButton extends Button {
  onClick?: (ev: MouseEventHandler<HTMLButtonElement>) => any;
}
interface ContexualButton extends Button {
  onClick?: (ev: MouseEventHandler<HTMLButtonElement>) => Promise<void>;
  content: { loading: string; stale: string };
}
type ButtonProps = SimpleButton | ContexualButton;

// Libraries:
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";
import colors from "tailwindcss/colors";
import { DefaultColors } from "tailwindcss/types/generated/colors";

// Component
export default function Button(props: ButtonProps) {
  // State Manager:
  const [LOADING, SET_LOADING] = useState(false);

  // Event Handler:
  const SubmitHandler = (e: any) => {
    if (props.onClick === undefined) return;
    try {
      SET_LOADING(true);
      props
        .onClick(e)
        .then(() => {
          SET_LOADING(false);
        })
        .catch(() => {
          SET_LOADING(false);
        });
    } catch (err) {
      SET_LOADING(false);
    }
  };

  // Color Schema:
  const COLOR = (() => {
    // { bg: colors[props.colorScheme || "sky"][600], text: "#fff" };
    switch (props.colorScheme || "sky") {
      case "red":
        return "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-600/60";
      case "sky":
        return "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 disabled:bg-sky-600/60";
      case "blue":
        return "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-600/60";
      case "green":
        return "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-green-600/60";
      case "purple":
        return "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 disabled:bg-purple-600/60";
    }
  })();

  // Render:
  return (
    <button
      onClick={SubmitHandler}
      disabled={LOADING || props?.disabled}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${COLOR} ${props.className}`}
    >
      <Spinner
        mr="2"
        size="sm"
        verticalAlign="-2px"
        display={LOADING ? "inline-block" : "none"}
      />
      {props.children
        ? props.children
        : LOADING
        ? // @ts-ignore
          props.content.loading
        : // @ts-ignore
          props.content.stale}
    </button>
  );
}

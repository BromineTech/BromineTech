"use client"
import { locales } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

export enum EditorType {
  SingleLine,
  MultiLine
}

interface TextEditorProps {
  type: EditorType;
}

export default function TextEditor({ type }: TextEditorProps) {
  const locale = locales["en"];
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        content: "Welcome to this demo!",
      },
    ],
    dictionary: {
      ...locale,
      placeholders: {
        ...locale.placeholders,
        emptyDocument: "", // Remove placeholder for empty document
        default: "",       // Remove default placeholder
        heading: "",       // Remove heading placeholder
      },
    },
  });


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (type === EditorType.SingleLine && e.key === "Enter") {
      e.preventDefault();
    }
  };


  return <BlockNoteView editor={editor} formattingToolbar={false} slashMenu={false} sideMenu={false} onKeyDown={handleKeyDown} />;
}

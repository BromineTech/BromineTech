
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs, defaultStyleSpecs } from "@blocknote/core";
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
  const schema = BlockNoteSchema.create({
    blockSpecs: defaultBlockSpecs,
    inlineContentSpecs: defaultInlineContentSpecs,
    styleSpecs: defaultStyleSpecs,
  });

  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "heading",
        props: { level: 1 },
        content: "Welcome to this demo!",
      },
    ],
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (type === EditorType.SingleLine && e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <BlockNoteView
      editor={editor}
      formattingToolbar={false}
      slashMenu={false}
      sideMenu={false}
      onKeyDown={handleKeyDown}
    />
  );
}

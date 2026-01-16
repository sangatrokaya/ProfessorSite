import {
  Bold,
  Italic,
  Underline,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  RotateCcw,
  RotateCw,
  Eraser,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const Btn = ({ onClick, active, disabled, children }) => (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "outline"}
      disabled={disabled}
      onClick={onClick}
      className="h-8 px-2"
    >
      {children}
    </Button>
  );

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 border-b bg-background p-2">
      {/* Undo / Redo */}
      <Btn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <RotateCcw size={16} />
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <RotateCw size={16} />
      </Btn>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Headings */}
      <Btn
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={16} />
      </Btn>

      <Btn
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </Btn>

      <Btn
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </Btn>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Inline formatting */}
      <Btn
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </Btn>

      <Btn
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </Btn>

      <Btn
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={16} />
      </Btn>

      <Btn
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={16} />
      </Btn>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists */}
      <Btn
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </Btn>

      <Btn
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </Btn>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Blocks */}
      <Btn
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </Btn>

      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus size={16} />
      </Btn>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Clear formatting */}
      <Btn
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
      >
        <Eraser size={16} />
      </Btn>
    </div>
  );
};

export default EditorToolbar;

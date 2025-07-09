import React, { useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { Node, mergeAttributes } from '@tiptap/core'
import { createYjsInstance } from '@/yjs/yjs-setup'

type TextEditorProps = {
  type?: 'singleLine' | 'multiline'
  docId: string
  user: {
    name: string
    color: string
  }
}

// Optional single-line node (visual styling)
const SingleLineNode = Node.create({
  name: 'singleLine',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'div' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0]
  },
})

const TextEditor: React.FC<TextEditorProps> = ({ type = 'multiline', docId, user }) => {
  const isSingleLine = type === 'singleLine'

  const { ydoc, provider, yXmlFragment } = useMemo(
    () => createYjsInstance(docId, user),
    [docId, user.name] // Avoid re-initializing on re-render
  )

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        ...(isSingleLine ? { hardBreak: false } : {}),
      }),
      ...(isSingleLine ? [SingleLineNode] : []),
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({ provider, user }),
    ],
    content: 'Start collaborating!',
    editorProps: {
      handleKeyDown(view, event) {
        if (isSingleLine && event.key === 'Enter') {
          event.preventDefault()
          return true
        }
        return false
      },
      attributes: {
        class: `prose prose-sm sm:prose h-full lg:prose-lg xl:prose-2xl mx-auto focus:outline-none text-black ${
          isSingleLine ? 'single-line-editor' : ''
        }`,
      },
    },
    injectCSS: true,
    editable: true,
    autofocus: true,
    immediatelyRender: false,
  })

  if (!editor) return null

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Collaborative Editor ({type})</h2>
      <div className="border rounded-lg p-4 bg-white">
        <style jsx global>{`
          .ProseMirror {
            padding: 1rem;
            outline: none;
          }

          .ProseMirror p {
            margin: 0;
          }

          .ProseMirror .collaboration-cursor__caret {
            position: relative;
            margin-left: -1px;
            margin-right: -1px;
            border-left: 1px solid #000;
            border-right: 1px solid #000;
            pointer-events: none;
          }

          .ProseMirror .collaboration-cursor__label {
            position: absolute;
            top: -1.4em;
            left: -1px;
            font-size: 12px;
            font-weight: 600;
            color: #fff;
            padding: 0.1rem 0.3rem;
            border-radius: 3px;
            pointer-events: none;
          }

          .single-line-editor {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
          }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TextEditor

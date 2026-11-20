"use client"

import { useEffect, useState } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { Bold, Code2, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Pilcrow, Quote, Redo2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sanitizeBlogHtml } from "@/lib/blog-content"

type Props = { value: string; onChange: (value: string) => void }

export function BlogContentEditor({ value, onChange }: Props) {
  const [mode, setMode] = useState<"visual" | "source">("visual")
  const [preview, setPreview] = useState(false)
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Link.configure({ openOnClick: false, protocols: ["http", "https", "mailto"] }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: value || "",
    onUpdate: ({ editor: current }) => onChange(sanitizeBlogHtml(current.getHTML())),
    editorProps: { attributes: { class: "blog-rich-content min-h-56 px-4 py-3 outline-none focus:outline-none" } },
  })

  useEffect(() => {
    if (editor && mode === "visual" && editor.getHTML() !== (value || "")) {
      editor.commands.setContent(value || "", { emitUpdate: false })
    }
  }, [editor, value, mode])

  const setSource = (next: string) => onChange(next)
  const switchMode = (next: "visual" | "source") => {
    if (next === mode) return
    if (mode === "visual" && editor) onChange(sanitizeBlogHtml(editor.getHTML()))
    setMode(next)
  }

  const addLink = () => {
    if (!editor) return
    const current = editor.getAttributes("link").href as string | undefined
    const href = window.prompt("Link-Adresse (https://, http:// oder mailto:)", current || "https://")
    if (href === null) return
    if (!/^(https?:\/\/|mailto:|\/|#)/i.test(href.trim())) {
      window.alert("Bitte eine gültige http(s)-, mailto- oder relative Adresse eingeben.")
      return
    }
    if (!href.trim()) editor.chain().focus().unsetLink().run()
    else editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run()
  }

  const addImage = () => {
    if (!editor) return
    const src = window.prompt("Bild-URL (https://)")
    if (!src) return
    if (!/^https?:\/\//i.test(src.trim())) {
      window.alert("Bitte eine gültige Bild-URL mit http:// oder https:// eingeben.")
      return
    }
    const alt = window.prompt("Alternativtext für das Bild", "") ?? ""
    editor.chain().focus().setImage({ src: src.trim(), alt }).run()
  }

  const toolbar = [
    { label: "Absatz", icon: Pilcrow, run: () => editor?.chain().focus().setParagraph().run(), active: editor?.isActive("paragraph") },
    { label: "H1", icon: Heading2, run: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), active: editor?.isActive("heading", { level: 1 }) },
    { label: "H2", icon: Heading2, run: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }) },
    { label: "H3", icon: Heading3, run: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive("heading", { level: 3 }) },
    { label: "H4", icon: Heading3, run: () => editor?.chain().focus().toggleHeading({ level: 4 }).run(), active: editor?.isActive("heading", { level: 4 }) },
    { label: "Fett", icon: Bold, run: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold") },
    { label: "Kursiv", icon: Italic, run: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic") },
    { label: "Aufzählung", icon: List, run: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive("bulletList") },
    { label: "Nummerierte Liste", icon: ListOrdered, run: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive("orderedList") },
    { label: "Zitat", icon: Quote, run: () => editor?.chain().focus().toggleBlockquote().run(), active: editor?.isActive("blockquote") },
    { label: "Link", icon: Link2, run: addLink, active: editor?.isActive("link") },
    { label: "Bild", icon: ImagePlus, run: addImage, active: editor?.isActive("image") },
  ]

  return (
    <section className="overflow-hidden rounded-lg border" aria-label="Blog-Inhalt bearbeiten">
      <div className="flex flex-col gap-2 border-b bg-muted/40 p-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1" role="toolbar" aria-label="Textformatierung">
            {toolbar.map(({ label, icon: Icon, run, active }) => (
              <Button key={label} type="button" size="sm" variant={active ? "secondary" : "ghost"} aria-label={label} title={label} onClick={run} disabled={!editor} className="px-2">
                <Icon className="size-4" />
              </Button>
            ))}
            <Button type="button" size="sm" variant="ghost" aria-label="Rückgängig" title="Rückgängig" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor} className="px-2"><Undo2 className="size-4" /></Button>
            <Button type="button" size="sm" variant="ghost" aria-label="Wiederholen" title="Wiederholen" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor} className="px-2"><Redo2 className="size-4" /></Button>
          </div>
          <div className="flex gap-1">
            <Button type="button" size="sm" variant={mode === "visual" ? "secondary" : "ghost"} onClick={() => switchMode("visual")}>Görsel düzenleme</Button>
            <Button type="button" size="sm" variant={mode === "source" ? "secondary" : "ghost"} onClick={() => switchMode("source")}><Code2 className="mr-1 size-4" />HTML kaynağı</Button>
          </div>
        </div>
      </div>
      {preview ? (
        <div className="blog-rich-content min-h-56 p-4" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(value) }} />
      ) : mode === "source" ? (
        <Textarea aria-label="HTML kaynağı" value={value} onChange={(event) => setSource(event.target.value)} rows={11} className="min-h-56 resize-y rounded-none border-0 font-mono text-sm focus-visible:ring-0" placeholder="<p>Dein Beitragstext ...</p>" />
      ) : (
        <EditorContent editor={editor} />
      )}
      <div className="flex flex-col gap-2 border-t p-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Erlaubt: h1, h2, h3, h4, p, ul, ol, li, a, strong, em, img, blockquote</p>
        <Button type="button" size="sm" variant={preview ? "secondary" : "outline"} onClick={() => setPreview(!preview)}>{preview ? "Zur Bearbeitung" : "Vorschau anzeigen"}</Button>
      </div>
    </section>
  )
}

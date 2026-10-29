"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Eye, Search, FileText, X, ImageIcon, ExternalLink } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  image_url: string | null
  category: string | null
  tags: string[]
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  "Ratgeber",
  "Sicherheit",
  "Gerüstarten",
  "Branchennews",
  "Tipps & Tricks",
  "Rechtliches",
]

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    image_url: "",
    category: "",
    tags: [] as string[],
    is_published: false,
  })
  const [tagInput, setTagInput] = useState("")

  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast({ title: "Fehler", description: "Blog-Beiträge konnten nicht geladen werden", variant: "destructive" })
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  const openCreateDialog = () => {
    setEditingPost(null)
    setFormData({
      title: "",
      slug: "",
      summary: "",
      content: "",
      image_url: "",
      category: "",
      tags: [],
      is_published: false,
    })
    setTagInput("")
    setIsDialogOpen(true)
  }

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      summary: post.summary || "",
      content: post.content || "",
      image_url: post.image_url || "",
      category: post.category || "",
      tags: post.tags || [],
      is_published: post.is_published,
    })
    setTagInput("")
    setIsDialogOpen(true)
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingPost ? prev.slug : generateSlug(title),
    }))
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({ title: "Fehler", description: "Titel ist erforderlich", variant: "destructive" })
      return
    }
    if (!formData.slug.trim()) {
      toast({ title: "Fehler", description: "Slug ist erforderlich", variant: "destructive" })
      return
    }

    setSaving(true)

    const postData = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      summary: formData.summary.trim(),
      content: formData.content,
      image_url: formData.image_url.trim() || null,
      category: formData.category || null,
      tags: formData.tags,
      is_published: formData.is_published,
      published_at: formData.is_published ? new Date().toISOString() : null,
    }

    if (editingPost) {
      // Update
      const { error } = await supabase
        .from("blog_posts")
        .update({ ...postData, updated_at: new Date().toISOString() })
        .eq("id", editingPost.id)

      if (error) {
        toast({ title: "Fehler", description: error.message, variant: "destructive" })
      } else {
        toast({ title: "Erfolg", description: "Beitrag wurde aktualisiert" })
        setIsDialogOpen(false)
        fetchPosts()
      }
    } else {
      // Create
      const { error } = await supabase
        .from("blog_posts")
        .insert([postData])

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Fehler", description: "Ein Beitrag mit diesem Slug existiert bereits", variant: "destructive" })
        } else {
          toast({ title: "Fehler", description: error.message, variant: "destructive" })
        }
      } else {
        toast({ title: "Erfolg", description: "Beitrag wurde erstellt" })
        setIsDialogOpen(false)
        fetchPosts()
      }
    }

    setSaving(false)
  }

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Möchten Sie den Beitrag "${post.title}" wirklich löschen?`)) {
      return
    }

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", post.id)

    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Erfolg", description: "Beitrag wurde gelöscht" })
      fetchPosts()
    }
  }

  const togglePublished = async (post: BlogPost) => {
    const newStatus = !post.is_published
    const { error } = await supabase
      .from("blog_posts")
      .update({
        is_published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.id)

    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Erfolg", description: newStatus ? "Beitrag veröffentlicht" : "Beitrag als Entwurf gespeichert" })
      fetchPosts()
    }
  }

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || post.category === filterCategory
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "published" && post.is_published) ||
      (filterStatus === "draft" && !post.is_published)
    return matchesSearch && matchesCategory && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Blog-Beiträge</h2>
          <p className="text-muted-foreground">
            {posts.length} Beiträge insgesamt, {posts.filter(p => p.is_published).length} veröffentlicht
          </p>
        </div>
        <Button onClick={openCreateDialog} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Neuer Beitrag
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Beiträge suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="published">Veröffentlicht</SelectItem>
                <SelectItem value="draft">Entwurf</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Lade Beiträge...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {posts.length === 0 ? "Noch keine Beiträge vorhanden" : "Keine Beiträge gefunden"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Beitrag</TableHead>
                  <TableHead className="hidden md:table-cell">Kategorie</TableHead>
                  <TableHead className="hidden md:table-cell">Datum</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt=""
                            className="h-10 w-14 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-14 bg-muted rounded flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium line-clamp-1">{post.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{post.summary}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {post.category ? (
                        <Badge variant="secondary">{post.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDate(post.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={post.is_published ? "default" : "secondary"}
                        className={post.is_published ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {post.is_published ? "Veröffentlicht" : "Entwurf"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {post.is_published && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(post)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Beitrag bearbeiten" : "Neuer Beitrag"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Titel des Beitrags"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="url-freundlicher-slug"
              />
              <p className="text-xs text-muted-foreground">
                URL: /blog/{formData.slug || "..."}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Zusammenfassung</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Kurze Zusammenfassung des Beitrags"
                rows={2}
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image_url">Bild-URL</Label>
              <div className="flex gap-2">
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={formData.image_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              {formData.image_url && (
                <div className="mt-2 relative w-full max-w-xs h-32 bg-muted rounded overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt="Vorschau"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                </div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Kategorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Tag hinzufügen"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Hinzufügen
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-muted rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Content (HTML) */}
            <div className="space-y-2">
              <Label htmlFor="content">Inhalt (HTML)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="<h2>Überschrift</h2><p>Inhalt...</p>"
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Unterstützte Tags: h2, h3, p, ul, ol, li, a, strong, em, img, blockquote
              </p>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="is_published" className="font-medium">Veröffentlichen</Label>
                <p className="text-sm text-muted-foreground">
                  Der Beitrag wird sofort öffentlich sichtbar
                </p>
              </div>
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              {saving ? "Speichert..." : editingPost ? "Aktualisieren" : "Erstellen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

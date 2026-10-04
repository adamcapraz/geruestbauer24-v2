import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type EditablePageProps = {
  title: string
  content: string
  fallbackTitle: string
  fallbackContent?: string
}

export function EditablePage({ title, content, fallbackTitle, fallbackContent }: EditablePageProps) {
  const pageTitle = title.trim() || fallbackTitle
  const pageContent = content.trim() || fallbackContent

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-slate-900 px-4 py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">{pageTitle}</h1>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-3xl border-border">
          <CardHeader>
            <CardTitle>{pageTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            {pageContent ? (
              <div className="whitespace-pre-wrap text-muted-foreground">{pageContent}</div>
            ) : (
              <p className="text-muted-foreground">Diese Seite enthält derzeit noch keinen Inhalt.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

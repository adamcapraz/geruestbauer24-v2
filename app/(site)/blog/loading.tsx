import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-slate-900 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-4 bg-slate-700" />
            <Skeleton className="h-6 w-96 mx-auto bg-slate-700" />
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <Skeleton className="h-4 w-32" />
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

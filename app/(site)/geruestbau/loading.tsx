import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-sidebar-background py-12 px-4">
        <div className="container mx-auto">
          <Skeleton className="h-10 w-96 mx-auto mb-4 bg-sidebar-accent" />
          <Skeleton className="h-6 w-64 mx-auto mb-8 bg-sidebar-accent" />
          <Skeleton className="h-16 w-full max-w-4xl mx-auto bg-sidebar-accent" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <Skeleton className="h-6 w-24 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-6 w-48" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="glass-card xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-56" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <Skeleton className="h-6 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

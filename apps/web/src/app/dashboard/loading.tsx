export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-fortress-steel rounded-lg w-48" />
        <div className="h-4 bg-fortress-steel/60 rounded w-64" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-fortress-navy rounded-xl border border-fortress-border" />
        ))}
      </div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 h-80 bg-fortress-navy rounded-xl border border-fortress-border" />
        <div className="lg:col-span-2 h-80 bg-fortress-navy rounded-xl border border-fortress-border" />
      </div>
    </div>
  )
}

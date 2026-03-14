import { Card, CardContent } from '@/components/ui/card'

type StatsCardProps = {
  title: string
  value: string | number
  icon: string
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </CardContent>
    </Card>
  )
}

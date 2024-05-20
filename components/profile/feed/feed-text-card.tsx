import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type FeedTextCardProps = {
  title: string
  caption: string
  created_at: string
}

export const FeedTextCard = ({ title, caption }: FeedTextCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{caption}</CardContent>
    </Card>
  )
}

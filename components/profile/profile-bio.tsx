import Link from "next/link"
import { Facebook, Globe, Instagram, Twitter, Youtube } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "../ui/button"

const ICONS: any = {
  website: <Globe className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
}

export const ProfileBio = ({
  bio,
  social_links,
}: {
  bio: string
  social_links: any[]
}) => {
  return (
    <Card className="h-fit md:sticky md:top-4">
      <CardHeader>
        <CardTitle>Bio</CardTitle>
      </CardHeader>
      <CardContent>
        <p
          dangerouslySetInnerHTML={{
            __html: bio ? bio.replace(/\n/g, "<br />") : "",
          }}
        ></p>
        {social_links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {social_links
              .filter((link) => link.value)
              .map((link) => (
                <Button variant={"outline"} size={"sm"} key={link.type} asChild>
                  <Link href={link.value} target="_blank">
                    {ICONS[link.type] || <Globe className="h-4 w-4" />}
                    <span className="ml-2">{link.name}</span>
                  </Link>
                </Button>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

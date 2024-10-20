import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <section className="relative z-10 mx-auto flex w-full max-w-[980px] flex-col items-start justify-center gap-8 px-4 py-8 text-center md:pt-16">
      <h1 className="mx-auto inline-block bg-gradient-to-r from-primary via-purple-500 to-indigo-400 bg-clip-text text-4xl font-black leading-tight tracking-tighter text-transparent md:text-5xl lg:leading-[1.1]">
        All you need to make money <br /> doing what you love
      </h1>
      <p className="w-full text-xl md:text-2xl">
        Join 1M+ creators getting donations, memberships and sales from fans!
      </p>
      <form action={'/register'} method="GET" className="mx-auto">
        <div className="flex items-center justify-between rounded-lg p-4 shadow-xl">
          <div className="flex items-center">
            <div className="font-bold">ko-dev-eta.vercel.app/</div>
            <input type="text" placeholder="username" name="username" className="outline-none" pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$" required />
          </div>
          <Button type="submit">
            Get Started
          </Button>
        </div>
      </form>
      <p className="mx-auto text-center text-sm">
        <Link href={'https://github.com/roberthgnz/ko-dev'} target="_blank">
          Open source
        </Link>, Ko-fi clone built with Next.js, Supabase, and Tailwind CSS.
      </p>
    </section>
  )
}

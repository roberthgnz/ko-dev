<h1 align="center">Full-Stack WebApp | Ko-fi + Patreon Clone</h1>
<p align="center">A full-stack web application inspired by Ko-fi and Patreon, built with Next.js, Tailwind CSS, and Supabase.</p>

<div align="center">
    <a href="https://ko-dev-eta.vercel.app">
     <img src="https://github.com/roberthgnz/ko-dev/assets/63687573/9588f81f-aafe-412a-a87d-f265fa6c695b">
    </a>
</div>

<div align="center">

![Svelte Badge](https://img.shields.io/badge/Next.js-000000?logo=nextjs&logoColor=fff&style=flat)
![GitHub stars](https://img.shields.io/github/stars/roberthgnz/ko-dev)
![GitHub issues](https://img.shields.io/github/issues/roberthgnz/ko-dev)
![GitHub forks](https://img.shields.io/github/forks/roberthgnz/ko-dev)
![GitHub PRs](https://img.shields.io/github/issues-pr/roberthgnz/ko-dev)
![Tailwind CSS Badge](https://img.shields.io/badge/PayPal-0079C1?logo=paypal&logoColor=fff&style=flat)

</div>

## 🛠️ Stack

- [**Next.js**](https://nextjs.org/) - The React Framework for the Web
- [**Typescript**](https://www.typescriptlang.org/) - JavaScript with syntax for types.
- [**Tailwindcss**](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
- [**Supabase**](https://supabase.com/) - The Open Source Firebase Alternative.
- [**PayPal**](https://www.paypal.com/en/home) - JavaScript SDK for PayPal RESTful APIs.
- [**Prettier**](https://prettier.io/) + [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) - An opinionated code formatter.

## ✨ Features

- 🔐 **Authentication** - Sign in with email or Google.

- 👤 **Profile** - Update your profile information.

- 📊 **Dashboard** - Manage your subscriptions.

- 💳 **Subscriptions** - Offer subscription plans to your supporters. (PayPal support).

- ⚙️ **Settings** - Manage your account settings.

- 🔒 **Post Privacy** - Choose who can see your posts (public, private, or followers).

- 👥 **User following** - Follow other users and see their posts.

- 👍 **Post Likes** - Like posts and see who liked them.

- 💬 **Post Comments** - Comment on posts and see who commented.

- 🔄 **Post Sharing** - Share posts with your followers.

## 🚀 Getting Started

You will need:

- [Node.js 18+ (recommended 20 LTS)](https://nodejs.org/en/).
- [Git](https://git-scm.com/).

1. [Fork](https://github.com/roberthgnz/ko-dev/fork) this repository and clone it locally:

```bash
git clone git@github.com:your_username/ko-dev.git
```

2. Install dependencies:

```bash
# Install pnpm globally if you don't have it:
npm install -g pnpm

# and install dependencies:
pnpm install
```

5. (Optional) If you want to run locally, you will need to create a `.env` file in the root of the project with the following variables:

- [Create a Supabase account](https://supabase.com/dashboard/projects).
- [Create a PayPal account](https://www.paypal.com/es/webapps/mpp/account-selection).

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
```

## ✌️ Contributing

<a href="https://github.com/roberthgnz/ko-dev/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=roberthgnz/ko-dev" />
</a>

<p></p>

## 🔑 License

- [MIT](https://github.com/roberthgnz/ko-dev/blob/main/LICENSE).

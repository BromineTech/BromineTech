This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Auth0 Integration

This project uses [Auth0](https://auth0.com/) for authentication. To run locally, you must set up the following environment variables in a `.env.local` file in the `client/` directory:

```
AUTH0_SECRET=your-random-secret
AUTH0_BASE_URL=http://localhost:3001
AUTH0_ISSUER_BASE_URL=https://YOUR_AUTH0_DOMAIN
AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_AUTH0_CLIENT_SECRET
```

- You can generate a secret with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Get the other values from your Auth0 dashboard.

## Auth0 Login/Logout
- Login: `/api/auth/login`
- Logout: `/api/auth/logout`

See [Auth0 Next.js SDK Quickstart](https://auth0.com/docs/quickstart/webapp/nextjs) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

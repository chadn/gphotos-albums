# GPhotos Albums

View a list of all your Google Photos Albums all in one place.
Sort by name, number of items in each, or the default sort (which is usually most recently updated first but google will not confirm)

## Overview

This project has several purposes (see [About](#about) for details and current status). The main one is to provide a single page where every one of your google photos albums is listed. Surprisingly this is not something google provides in their photos apps nor in the web interface. Personally I have several hundred albums and find that the ability to browse item names enables more consistency with organizing and naming of albums

The project's latest tech stack currently includes

- Node.js 20+
- Next.js 14 with App Router
- React 18
- TypeScript 5
- AuthJS (next-auth ver 5) for Google OAuth2 authentication and authorization for Google Photos.
- Tailwind CSS 3
- And a lot of bells and whistles for easier VS Code development and CI/CD
  - Vercel for easy next.js deployment and testing, [view deployed src](https://gphotos-albums.vercel.app/_src) (requires vercel login)
  - Jest — Configured for unit testing
  - ESLint — Find and fix problems in your code, also will **auto sort** your imports
  - Prettier — Format your code consistently
  - Husky & Lint Staged — Run scripts on your staged files before they are committed
  - [Conventional Commit Lint](https://github.com/conventional-changelog/commitlint/#what-is-commitlint) — Make sure you & your teammates follow conventional commit
  - [Github Actions](https://docs.github.com/en/actions) — Lint your code on PR [example lint.yml workflow](https://github.com/chadn/gphotos-albums/blob/main/.github/workflows/lint.yml)
  - and more from [Next.js + Tailwind CSS + TypeScript starter and boilerplate](https://github.com/theodorusclarence/ts-nextjs-tailwind-starter)

The original version was built using node.js, express, and passport for Google OAuth.

### Versions

Summary of differences between versions. See [CHANGELOG.md](CHANGELOG.md) for details.

| Tech                                                                                                 | [v 1.0](https://github.com/chadn/gphotos-albums/tree/final-express.js-ejs) | [v 1.5](https://github.com/chadn/gphotos-albums/tree/v1.5) | v 2.0 |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------- | ----- |
| node.js                                                                                              | ✅                                                                         | ✅                                                         | ✅    |
| npm                                                                                                  | ✅                                                                         |                                                            |       |
| express.js                                                                                           | ✅                                                                         |                                                            |       |
| passport auth                                                                                        | ✅                                                                         |                                                            |       |
| handsontable.js                                                                                      | ✅                                                                         | ✅                                                         |       |
| jquery.js                                                                                            | ✅                                                                         | ✅                                                         |       |
| album-details.js                                                                                     | ✅                                                                         | ✅                                                         |       |
| pnpm                                                                                                 |                                                                            | ✅                                                         | ✅    |
| react                                                                                                |                                                                            | ✅                                                         | ✅    |
| next.js                                                                                              |                                                                            | ✅                                                         | ✅    |
| typescript                                                                                           |                                                                            | ✅                                                         | ✅    |
| authjs 5 beta                                                                                        |                                                                            | ✅                                                         |       |
| authjs 5 release                                                                                     |                                                                            |                                                            | ✅    |
| [Google Photos Library API](https://developers.google.com/photos/library/guides/get-started-library) | ✅                                                                         | ✅                                                         |       |
| [Google Photos Picker API](https://developers.google.com/photos/picker/guides/media-items)           |                                                                            |                                                            | ✅    |

Note authjs is still in beta and some hacks are currently in the code, to be revisited after it is out of beta.
Also note photos API is changing in 2025. Version 2.0 will address these issues.

## Using

This uses Google OAuth2 authentication (google login with email) and authorization (ask for read only access to your google photos).

Start at either

- [gphotos.samo.org](https://gphotos.samo.org/) currently still running original 1.0 version with express
- [gphotos-albums.vercel.app](https://gphotos-albums.vercel.app/) currently running 1.5 version with express

Note when logging in with google, there will be several steps. A couple of the steps are mentioned below in order to make some people more at ease with this flow.

After choosing which google account to use, you will be presented with a screenshot like the following because my website app has not been officially verifited. It is OK and safe to proceed.
Must click `Advanced` (which changes to `Hide Advanced`) and then click [Go to gphotos-albums.vercel.app (unsafe)](https://gphotos-albums.vercel.app).
![google-auth-unverified-unsafe-vercel](https://github.com/user-attachments/assets/83edf07f-33e0-4fc9-89a1-91acfc37f1cf)

After that, you will be notified of the permissions requested. It's all readonly, and you can click continue. Here are the permissions explanded out:
![google-oauth-permissions-window-vercel](https://github.com/user-attachments/assets/0935e249-5769-4d6f-a3a9-fccc3b79aa06)

## Goals

Goals of the Project

- Solve my personal need to list all my google photos albums in one place
- Experiment with Google authentication and photos API
- Demonstrate my coding skills
  - Making this available on github.com
  - Full stack skills demonstrated - see tech stack in [Overview](#overview) above
  - Focus on using the latest most popular Full stack and FED tech.
- Demonstrate how a project can migrate in stages to React.js framework
  - React.js is a powerful library and can be daunting. In my case, I wanted to show how a project can be ported to React + Next.js in stages by preserving the javascript files that did much of the heavy lifting in my original express.js. So I planned for version 1.5 that had a bit of the old code working with new code, see [versions](#versions) below.

More background
https://chadnorwood.com/2024/04/11/google-photos-api-and-flickr/

## Setup

Feel free to fork https://github.com/chadn/gphotos-albums/

Want to make a change? make a PR - but reach out before doing too much work

## Project Architecture

### Directory Structure

```
src/
├── app/                   # Next.js 14 App Router pages and API routes
│   ├── api/               # API route handlers
│   ├── albums/            # Albums page
│   ├── components/        # Page-specific components
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── buttons/            # Button components
│   │   ├── Button.tsx       # Base button component
│   │   ├── IconButton.tsx   # Button with icon
│   │   └── TextButton.tsx   # Text-only button
│   ├── links/               # Link components
│   │   ├── ArrowLink.tsx    # Link with arrow indicator
│   │   ├── ButtonLink.tsx   # Link styled as button
│   │   ├── IconLink.tsx     # Link with icon
│   │   ├── PrimaryLink.tsx  # Primary styled link
│   │   ├── UnderlineLink.tsx # Link with underline effect
│   │   └── UnstyledLink.tsx # Base link component
│   ├── AlbumsTable.tsx   # Albums list display component
│   ├── ItemsCount.tsx    # Counter for items
│   ├── LoginButton.tsx   # Authentication button
│   ├── NavBar.tsx        # Navigation component
│   ├── NextImage.tsx     # Optimized image component
│   └── Skeleton.tsx      # Loading placeholder
├── lib/                  # Core utilities and configurations
│   ├── auth.config.ts    # Authentication configuration
│   ├── googleApi.ts      # Google Photos API integration
│   └── utils.ts          # Utility functions
├── styles/               # Global styles and Tailwind configuration
├── types/                # TypeScript type definitions
├── constant/             # Constants and configuration
├── middleware.ts         # Next.js middleware for auth and routing
└── routes.ts             # Route definitions
```

### Key Components

1. **Authentication Flow**

   - Uses Auth.js (formerly NextAuth.js) for Google OAuth2
   - Middleware-based route protection
   - Secure token handling and refresh mechanism

1. **Google Photos Integration**

   - REST API integration with Google Photos Library API
   - Token refresh handling
   - Rate limiting and error handling
   - Caching for performance optimization

1. **Frontend Architecture**

   - React 18 with Next.js 14 App Router
   - Server and Client Components
   - Tailwind CSS for styling
   - Responsive design
   - Accessibility features

1. **Next.js Route Groups**

   - Authentication-required routes in `(auth)` group
   - Public routes at root level
   - API routes in `api` directory

1. **Next.js Middleware Protection**

   ```typescript
   // middleware.ts handles route protection
   - Protected routes require authentication
   - API routes have CORS and rate limiting
   - Auth routes handle OAuth flow
   ```

1. **Development Tools**
   - TypeScript for type safety
   - ESLint and Prettier for code quality
   - Jest for testing
   - Husky for git hooks
   - Conventional commits

### Performance Optimizations

- Server-side rendering where appropriate
- Image optimization with Next.js Image component
- API response caching
- Lazy loading of components
- Optimized bundle size

### Security Measures

- OAuth2 with secure token handling
- Protected API routes
- Environment variable management
- CORS configuration
- CSP headers

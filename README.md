# Lendsqr Frontend Assessment

A pixel-faithful implementation of the Lendsqr admin dashboard, built as a Senior Frontend Engineer assessment submission.

**Live URL:** https://philemon-eniola-lendsqr-fe-test.vercel.app

**GitHub:** https://github.com/mcenny/lendsqr-fe-test

---

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in VITE_API_BASE_URL and VITE_JG_TOKEN from your json-generator.com template

# Start dev server
npm run dev

# Run tests
npm test

# Typecheck
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

**Node requirement:** 18 or later.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 with Vite |
| Language | TypeScript (strict mode) |
| Styling | SCSS with BEM naming |
| Data fetching | TanStack Query v5 |
| Routing | React Router v6 |
| Persistent storage | idb-keyval (IndexedDB) |
| Mock API | json-generator.com (500 records, client-side filtering) |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel |

---

## Architecture

```
src/
  components/
    layout/         # DashboardLayout, Sidebar, TopBar
    ui/             # Shared components: StatCard, StatusPill, ErrorBoundary
  lib/
    api/            # API client + typed fetchers (users.ts)
    cache/          # idb-keyval adapter (read/write user cache)
  pages/
    Login/          # /login
    Users/          # /users — stat cards + table with filter + pagination
    UserDetails/    # /users/:id — profile card + General Details tab
      components/
        GeneralDetails/  # Personal Info, Education, Socials, Guarantors sections
  styles/
    abstracts/      # Variables, mixins (auto-imported by Vite)
  test/             # Shared test utilities and providers
  App.tsx
  main.tsx
```

The app follows a **page-owns-data** pattern: each page fetches its own data with TanStack Query. Shared components receive props only, with no direct API calls.

---

## Pages

### `/login`
Standalone auth page. Two-column layout with illustration. Validates email format and minimum password length on blur and on submit. On success, navigates to `/users`.

### `/users`
Dashboard landing page. Fetches 500 users from json-generator.com once and applies filtering and pagination client-side. Filter panel opens per-column on filter icon click. Row action menu provides View Details, Blacklist, and Activate options. Both filter state and current page are URL-synced so the view survives a refresh and is shareable.

### `/users/:id`
User detail page. Implements a cache-first strategy: checks IndexedDB first, falls back to the API, then writes the result back to the cache. The General Details tab is fully implemented with four sections. Other tabs show a placeholder.

---

## Testing

Tests live next to the components they cover in `*.test.tsx` files. The test suite uses `@testing-library/react` with a custom `renderWithProviders` wrapper that supplies `QueryClientProvider` and `MemoryRouter`.

Key patterns:
- `vi.mock` is used for module-level mocks (ESM-safe for Vitest)
- Cache and idb-keyval are mocked in all page tests to avoid jsdom IndexedDB limitations
- Tests assert behavior, not implementation (no snapshot tests)

```bash
npm test          # watch mode
npm test -- --run # single pass (CI)
```

---

## Decisions

See [DECISIONS.md](DECISIONS.md) for architecture decisions and trade-offs.

---

## Approach

The line in the assessment brief that I treated as the most important sentence in the document was: "Some details are intentionally left out of this instruction set. We feel the candidate should be able to spot and address them." Every inferred requirement listed in DECISIONS.md came from reading the brief through that lens. Empty states, error states with retry, URL-synced filters, and the protected route guard are all things the Figma does not draw but a working admin console needs.

Most of the patterns here are things I have shipped in production before. I have used TanStack Query regularly in my role at Filmmakers Mart, and the URL-synced filter and pagination state is a pattern I enjoy building. The experience of applying a filter, navigating into a detail page, and coming back to exactly where you left off is one of those small things that makes a product feel polished. It is something I have implemented across several marketplace projects.

The one genuinely new thing in this build was IndexedDB. I knew the concept but had not implemented it in a project before. Using idb-keyval made the learning curve manageable, and spending time on the cache-first with background revalidation strategy on the User Details page ended up being the part of this project I am most proud of.
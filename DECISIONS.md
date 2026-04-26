# Decisions and Trade-offs

Architecture and tool decisions made during the Lendsqr Frontend Assessment. Each entry covers what was chosen, what was not chosen, and the reasoning.

---

## 1. Data source: app.json-generator.com with client-side filtering

**Decision:** Use app.json-generator.com to generate 500 user records with the full nested schema and serve them from a persistent API URL. Filtering and pagination are applied client-side.

**Why json-generator.com over mocky.io:** Both are recommended options in the assessment brief. mocky.io serves static JSON that you upload manually, meaning any schema change requires re-uploading the file. json-generator.com uses a template with its own generator syntax, so the 500-record dataset can be regenerated at any time by re-running the template. It also provides a persistent authenticated API URL, which behaves like a real REST endpoint rather than a static file host.

**Why not static JSON bundled in the repo:** A static file grows the bundle and ties data updates to code deploys.

**Client-side filtering trade-offs:**

- All 500 records are fetched on first page load (~50-100 KB). Acceptable for this dataset size.
- A module-level in-memory cache (`_allUsers`) in `src/lib/api/users.ts` ensures the network request happens once per browser session regardless of how many times filters change.
- `getUserById(id)` uses the same cache, so navigating from the users list to a detail page never makes a second network request.
- Server-side filtering is the right call for datasets in the tens of thousands or for fields like availability and pricing that change frequently. For a fixed assessment dataset of 500 records, adding an API filtering layer would have introduced latency and complexity with no real benefit.

---

## 2. Persistent storage: idb-keyval over localStorage

**Decision:** Use `idb-keyval` for caching individual user records in IndexedDB.

**What it does:** When a user detail page is first visited, the app fetches from the API and stores the record in IndexedDB with the user ID as the key. On subsequent visits, the cached record is returned immediately while TanStack Query revalidates in the background.

**Why not localStorage:**

- localStorage is synchronous and blocks the main thread on large payloads.
- The assessment brief explicitly says not to use localStorage.
- IndexedDB is asynchronous and designed for structured data.

**Why idb-keyval over raw IndexedDB:**

- The raw IndexedDB API requires managing database connections, transaction lifecycle, object stores, and cursor iteration. For a key-value cache, this is 50-100 lines of boilerplate.
- `idb-keyval` reduces that to two function calls: `get(key)` and `set(key, value)`.

**Trade-off:** `idb-keyval` is an additional dependency (~1.2 KB gzipped). That is an acceptable cost given the reduction in complexity.

This was my first time using IndexedDB directly in a project. I had used localStorage before, but its synchronous and size-limited nature is a real problem once payloads grow. idb-keyval made the learning curve manageable. One thing I noticed is that idb-keyval uses a single default store, so I added a `user:` prefix to all keys to avoid any potential collision if other data were cached in the same store later. In a production app I would also add a cleanup strategy, since IndexedDB persists indefinitely until cleared and stale records from deleted users would otherwise sit in storage forever.

---

## 3. Data fetching: TanStack Query v5

**Decision:** Use TanStack Query for all remote data fetching.

**Why:**

- Handles loading, error, and success states without manual `useState` boilerplate.
- Provides stale-while-revalidate caching out of the box.
- `queryKey` makes cache invalidation explicit and predictable.
- The `enabled` flag lets queries be deferred until their required parameters are available (`enabled: !!id` on the user details query).

**Alternatives rejected:**

- `useEffect` with `fetch` and manual state requires writing the same loading and error pattern on every page.
- SWR is a similar option, but TanStack Query has better TypeScript inference and more control over background refetch behavior.

One thing I was careful about here was the `initialData` option on the User Details query. Providing `initialData` from the already-loaded users list cache means TanStack Query treats the data as fresh and skips the loading state entirely when navigating from the list, which is the right experience. The trade-off is that it makes the background revalidation in the `useEffect` load-bearing: without it, a user who navigates directly to a detail page from a bookmark would never get a fresh fetch if the cache already held a record from a previous visit.

---

## 4. Styling: SCSS with BEM naming

**Decision:** Use SCSS with BEM (Block-Element-Modifier) class naming. No CSS Modules, no Tailwind, no CSS-in-JS.

**Why SCSS:**

- The assessment requires SCSS explicitly.
- Variables and mixins are defined in `src/styles/abstracts/` and auto-imported by Vite's `additionalData` config, so every SCSS file has access to the design tokens without a manual import.

**Why BEM:**

- BEM class names are self-documenting. `.user-details__nav` immediately communicates which block and which element.
- No naming collisions because block names scope all child elements.
- No runtime cost (unlike CSS-in-JS).

The one discipline BEM requires is committing to flat class structures rather than nesting selectors for specificity. Vite's `additionalData` config auto-imports the abstracts into every SCSS file, which removes the repetitive import boilerplate that usually comes with SCSS in multi-file projects. That setup was one of the first things I wired up and it kept the individual component stylesheets clean throughout.

---

## 5. Error boundary: class component

**Decision:** Implement `ErrorBoundary` as a class component.

**Why a class:** React's `getDerivedStateFromError` and `componentDidCatch` lifecycle methods are only available on class components. There is no function component equivalent in React 18. The `react-error-boundary` library wraps this in a hook-friendly API, but adding a dependency to replace five lines of a class is not justified here.

**What it does:** Wraps the entire app at the `App.tsx` level. If any uncaught render error propagates to the boundary, it renders a centered fallback UI with a "Refresh page" button that calls `window.location.reload()`.

In production, I would add at least two more boundaries beyond the app root: one around the main layout shell so a crash on one page does not take down the sidebar, and one around any third-party embeds or widgets that are outside your control. For error reporting I would integrate Sentry at the `componentDidCatch` level, capturing the error and component stack while still showing the friendly fallback UI to the user rather than logging silently and leaving them on a blank screen.

---

## 6. Testing strategy

**Decision:** TDD (test-first) for all pages and shared components. Integration tests against real DOM using React Testing Library.

**What is tested:**

- Each page renders its key content in the success state.
- Loading and error states render the correct UI.
- User interactions (tab switching, filter toggle, pagination) produce the expected DOM changes.
- Form validation fires at the right times.

**What is not tested:**

- Snapshot tests. Snapshots become stale and do not assert behavior.
- Implementation details (internal state, specific class names, internal function calls).

**Mocking strategy:**

- API calls are mocked at the module level with `vi.mock('@/lib/api/users')`. This avoids real network requests and makes tests deterministic.
- `idb-keyval` cache functions are mocked in page tests because jsdom does not implement IndexedDB.
- `react-router-dom`'s `useParams` is mocked to return a known ID in route-dependent tests.

My rule is to test behavior the user experiences, not implementation details. If I rename an internal state variable or split a component into two, no tests should break unless something visible changed. The negative-path tests here were the most valuable: verifying that the retry button appears on a network failure, that a 404 shows a back link rather than a broken page, and that the filter reset actually clears the URL params rather than just resetting the form fields.

---

## 7. URL-synced filter and pagination state

**Decision:** Persist filter values and current page in URL query parameters.

**Why:**

- Without URL sync, refreshing the page resets filters and pagination to page 1.
- URL state is shareable. A reviewer or colleague can open the exact same filtered view.
- This is an inferred requirement. The assessment brief says "some details are intentionally left out" and expects candidates to identify them.

**Implementation:** `useSearchParams` from React Router reads and writes the query string. Filter form fields are controlled by URL params. Submitting the filter form updates the URL, which triggers the TanStack Query fetch with the new params.

URL state is a pattern I genuinely enjoy implementing because of the experience it gives users. Applying a filter, navigating into a detail, and coming back to exactly the same filtered and paginated view is the kind of thing that makes a product feel considered.

The edge case worth noting here is that the `returnSearch` string is passed via React Router navigation state, which means it only works if the user navigates through the app. If they copy the User Details URL and open it in a new tab, there is no state, and the Back to Users link falls back to the plain `/users` route. That is intentional: the URL itself does not encode where the user came from, only the navigation action does.

---

## 8. Intentionally left out details that were addressed

The assessment brief notes that some requirements are deliberately omitted to see if the candidate identifies and addresses them. These were identified and built:

- **Empty state:** Users table shows a message and reset action when filters return zero results.
- **Error state with retry:** Users page and User Details page both have error states with a retry action, not just a "something went wrong" message.
- **Loading skeleton:** The users table shows a skeleton loader that mirrors the table column structure while data is fetching. Spinners were explicitly avoided.
- **Responsive layout:** The dashboard sidebar collapses on mobile. The users table switches to a card layout below 768px. The user details profile card hides the vertical dividers below 640px.
- **Accessible interactive elements:** Filter panel and action menu close on Escape key and on outside click. Tab list uses `role="tablist"` and `aria-selected`. Back link uses `aria-label`.
- **Focus styles:** All interactive elements have a visible focus ring via a shared `focus-visible` mixin (outline only on keyboard navigation, not mouse).
- **`ErrorBoundary` at app root:** Prevents uncaught render errors from showing a blank screen with no explanation.
- **Protected route guard:** The brief does not specify a route guard but the Login page is meaningless without one. A `ProtectedRoute` component checks a `sessionStorage` flag and redirects unauthenticated users to `/login`. No real auth is needed, but the guard must exist.
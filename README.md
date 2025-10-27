# Frontend ITKAN

## Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, icons, etc.
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API and external services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── eslint.config.js    # ESLint configuration
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MohamedAbdrabou12/Itkan-Academy-FE.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Integrated Libraries

### React Query (TanStack Query)

**Purpose**: Server state management, data fetching, and caching.

**Configuration** (in `src/services/queryClient.ts`):

```typescript
{
  gcTime: 24 hours,      // Cache time
  staleTime: 5 minutes,  // How long data is considered fresh
  retry: 2               // Retry failed requests
}
```

### React Router

**Purpose**: Client-side routing and navigation.

**Routing Structure**:

- **Guest routes**: Accessible only when NOT authenticated (login, register)
- **Protected routes**: Require authentication and specific roles
- **Fallback routes**: unauthorized (403) and not found (404)

**Route Guards**:

- `GuestOnlyRoute`: Redirects authenticated users to their home
- `RoleBasedRoute`: Validates user role before allowing access

### React Toastify

**Purpose**: User-friendly toast notifications.

**Configuration** (in `App.tsx`):

- Position: top-right
- Auto-close: 5 seconds
- Theme: light
- Pause on hover and focus loss

### Tailwind CSS

**Purpose**: Utility-first CSS framework for rapid UI development.

**Best Practices**:

- Use utility classes directly in JSX
- Extract repeated patterns into custom components
- Use responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- Leverage Tailwind's state variants (hover, focus, active, etc.)
- Use the `className` prop for conditional classes

### TypeScript

**Purpose**: Type safety and improved developer experience.

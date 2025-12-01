# Agents.md

This file provides guidance to coding agents when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm generate` - Generate static site
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint linter
- `pnpm lint . --fix` - Run ESLint with automatic fixes

## Project Architecture

This is a Nuxt 4 blog application that serves as a client for a WordPress backend via REST API.

### Key Technologies
- **Nuxt 4**: Vue.js meta-framework with SSR
- **Pinia**: State management
- **TypeScript**: Type safety with strict checking enabled
- **ESLint**: Code linting with stylistic rules
- **PostCSS**: CSS processing with custom media queries and nesting

### Project Structure
- `app/` - Main application code
  - `components/` - Vue components (AppHeader, AppFooter, PostItem, PostInfo)
  - `pages/` - File-based routing (index, post/[id], category/[slug])
  - `composables/` - Reusable composition functions
  - `plugins/` - Nuxt plugins
  - `assets/styles/` - CSS stylesheets with custom fonts
- `shared/` - Shared utilities and types
  - `types/wordpress.d.ts` - WordPress REST API type definitions
  - `utils/siteInfo.ts` - Site configuration
- `_OLD/` - Legacy code (excluded from TypeScript and ESLint)

### WordPress Integration
- Uses `useCustomFetch` composable for WordPress REST API calls
- Fetches posts, categories, and media from WordPress backend
- Supports both server-side and client-side API calls
- WordPress site URL configured via `NUXT_PUBLIC_WP_SITE_URL` environment variable

### Styling System
- Uses sanitize.css for CSS normalization
- Custom font loading for NeueFrutiger and KintoSans fonts
- CSS custom properties for theming
- PostCSS with custom media queries and nesting rules
- Dynamic accent color system that changes on route navigation

### Build Configuration
- Production builds use Terser minification with console dropping
- Source maps disabled in production
- TypeScript type checking enabled during build
- ESLint integration with Nuxt module

### Development Notes
- The `update-color.client.ts` plugin dynamically changes accent colors and favicon on route changes
- WordPress types are globally available via the `WordPress` namespace
- Husky is configured for git hooks with lint-staged

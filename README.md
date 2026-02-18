# Galaxy Gaming Club 🎮

A modern React website for a gaming club, connected to Contentful CMS for content management.

## Features

- 🎯 **Modern UI** - Glass-effect navbar, smooth animations, responsive design
- 🎮 **Events** - Tournament listings with filtering and registration
- 🕹️ **Games** - Game catalog with categories and search
- 💰 **Pricing** - Membership plans with feature comparison
- 📸 **Gallery** - Photo gallery with lightbox view
- 💬 **Feedback** - User feedback system with star ratings
- 📧 **Contact** - Contact form with FAQ section
- 🔧 **Admin Dashboard** - Content overview and management

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast builds and development
- **React Router** for client-side routing
- **Contentful** CMS integration with caching
- **CSS3** with custom animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Contentful account (optional - mock data included)

### Installation

1. Clone the repository:

```bash
cd galaxy
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Add your Contentful credentials to `.env`:

```
VITE_CONTENTFUL_SPACE_ID=your_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token
```

5. Start the development server:

```bash
npm run dev
```

6. Open http://localhost:3000 in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contentful Content Models

Set up the following content types in Contentful:

### Hero Content

- `title` (Short text)
- `subtitle` (Short text)
- `ctaPrimary` (Short text)
- `ctaSecondary` (Short text)
- `backgroundImage` (Media)

### Event Item

- `title` (Short text)
- `description` (Long text)
- `date` (Date and time)
- `location` (Short text)
- `image` (Media)
- `category` (Short text)
- `maxParticipants` (Integer)
- `currentParticipants` (Integer)
- `prizePool` (Short text)
- `isFeatured` (Boolean)

### Game Item

- `title` (Short text)
- `description` (Long text)
- `image` (Media)
- `category` (Short text)
- `platforms` (Short text, list)
- `isFeatured` (Boolean)

### Pricing Plan

- `name` (Short text)
- `price` (Number)
- `period` (Short text)
- `features` (Short text, list)
- `isPopular` (Boolean)
- `ctaText` (Short text)

### Gallery Item

- `title` (Short text)
- `image` (Media)
- `category` (Short text)
- `date` (Date)
- `photographer` (Short text)

### Contact Info

- `address` (Short text)
- `phone` (Short text)
- `email` (Short text)
- `socialLinks` (JSON object)
- `openingHours` (JSON object)

### FAQ Item

- `question` (Short text)
- `answer` (Long text)
- `category` (Short text)
- `order` (Integer)

## Deployment

### Vercel

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

## Project Structure

```
galaxy/
├── public/
│   └── icon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx/.css
│   │   ├── Footer.tsx/.css
│   │   ├── Hero.tsx/.css
│   │   └── AdminDashboard.tsx/.css
│   ├── pages/
│   │   ├── Home.tsx/.css
│   │   ├── About.tsx/.css
│   │   ├── Events.tsx/.css
│   │   ├── Games.tsx/.css
│   │   ├── Pricing.tsx/.css
│   │   ├── Gallery.tsx/.css
│   │   ├── Feedback.tsx/.css
│   │   └── Contact.tsx/.css
│   ├── hooks/
│   │   └── useContentful.ts
│   ├── services/
│   │   └── contentful.ts
│   ├── types/
│   │   └── contentful.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Color Palette

| Variable            | Color   | Usage                 |
| ------------------- | ------- | --------------------- |
| `--bg-primary`      | #1B153F | Main background       |
| `--bg-secondary`    | #2A1E5C | Secondary background  |
| `--brand-primary`   | #B84CFF | Primary brand color   |
| `--brand-secondary` | #D66BFF | Secondary brand color |
| `--accent`          | #FF77E9 | Accent highlights     |
| `--text-primary`    | #F5EEFF | Primary text          |
| `--text-secondary`  | #B8B1D9 | Secondary text        |

## License

MIT License

# Honesty Engineering Consultancy - Official Website

A premium, high-performance website for **Honesty Engineering Consultancy**, a Govt. Approved 1st Class Contractor & BEPZA Enlisted company based in Bangladesh.

## 🚀 Project Overview

Modern, responsive, SEO-optimized website built with **Next.js 16** featuring green/blue design theme, advanced scroll animations, and comprehensive showcase of services, products, and achievements.

## ✨ Key Features

- **Premium Design**: Custom green/blue palette, glassmorphism effects
- **Advanced Animations**: Framer Motion scroll reveals, parallax effects, interactive service wheel
- **Comprehensive Sections**: Hero, About, CEO Message, Turnkey, Gallery, Products, Success Stories, Clients, Contact
- **SEO Optimized**: JSON-LD, semantic HTML5, OpenGraph tags
- **SSG Ready**: Static Site Generation for shared hosting (Hostinger compatible)
- **Certificate Viewer**: PDF viewer for official certificates
- **WhatsApp Integration**: Floating WhatsApp button for quick contact

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Fonts**: Google Fonts (Poppins, Inter, Satisfy)

## 📂 Project Structure

```
honesty-engineering/
├── src/
│   ├── app/                    # Next.js pages & layouts
│   │   ├── page.tsx            # Homepage
│   │   ├── layout.tsx          # Root layout
│   │   ├── certification/      # Certification page
│   │   ├── gallery/            # Full gallery page
│   │   └── services/           # Services page
│   ├── components/
│   │   ├── animations/         # Animation components
│   │   ├── layout/             # Header, Footer, ClientLayout
│   │   ├── sections/           # Page sections (Hero, About, etc.)
│   │   └── ui/                 # Reusable UI components
│   ├── config/                 # Site configuration
│   ├── data/                   # Static data (services, clients, etc.)
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript type definitions
├── public/
│   ├── certificates/           # PDF certificates
│   └── images/                 # Static images
│       ├── about/
│       ├── clients/
│       ├── gallery/
│       ├── hero/
│       ├── products/
│       ├── projects/
│       ├── services/
│       └── team/
├── .htaccess                   # Apache config for shared hosting
├── vercel.json                 # Vercel deployment config
└── next.config.ts              # Next.js configuration (SSG enabled)
```

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📦 Production Build

```bash
# Create static build
npm run build

# Output: ./out directory
```

## 🌐 Deployment

### Hostinger Shared Hosting

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to Hostinger:**
   - Open Hostinger hPanel → File Manager
   - Navigate to `public_html`
   - Delete existing files (backup if needed)
   - Upload ALL contents from `./out` folder
   - Upload `.htaccess` file to `public_html` root

3. **Enable SSL:**
   - Go to SSL/TLS in hPanel
   - Enable free SSL certificate
   - In `.htaccess`, uncomment the HTTPS redirect lines

4. **Verify:**
   - Visit your domain
   - Check browser console for errors
   - Test all pages and navigation

### Vercel (Recommended for Preview)

1. Push to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically

## � Code Notes

### Hidden "All Our Services" Section

The "All Our Services" grid section in the Services page is currently **commented out** and not displayed on the website, but the code is preserved for future use.

**Location:** `src/components/sections/Services.tsx` (around line 225)

**How to Restore:**
1. Open `src/components/sections/Services.tsx`
2. Find the commented section (look for "ALL OUR SERVICES SECTION - COMMENTED OUT")
3. Remove the opening `{/*` comment tag
4. Remove the closing `*/}` comment tag
5. Save the file

The section will automatically appear on the website showing a grid of all 8 service categories that users can click to view details.

## �🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.htaccess` | Apache config: caching, compression, security headers, URL rewriting |
| `vercel.json` | Vercel deployment settings |
| `next.config.ts` | Static export, image optimization |

## 🛡️ Security Features (via .htaccess)

- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: enabled
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: restrictive defaults

## 📄 License

Proprietary - **Honesty Engineering Consultancy**

---

*Powered by [Zyrotech Bangladesh](https://zyrotech.io)*

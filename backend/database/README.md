# Honesty Engineering - Database & API Documentation

## 📋 Overview

This document provides comprehensive information about the database structure and API integration for the Honesty Engineering website.

### Architecture
- **Frontend**: Next.js with Static Site Generation (SSG)
- **Backend**: PHP REST API
- **Database**: MySQL
- **Hosting**: Shared Hosting (Static files + PHP API)

## 🗄️ Database Structure

### Core Tables (25 tables)

#### 1. **Site Configuration**
- `site_config` - General site settings, contact info, credentials
- `settings` - Key-value store for dynamic settings
- `seo_meta` - SEO metadata for different pages

#### 2. **Content Management**
- `hero_section` - Hero section content
- `hero_stats` - Statistics displayed in hero
- `about_section` - About section content
- `about_features` - About section features list
- `ceo_info` - CEO information and message
- `team_members` - Team members information

#### 3. **Services & Products**
- `service_categories` - Service categories (Electrical, Civil, etc.)
- `services` - Individual services under each category
- `product_categories` - Product categories
- `products` - Products/Equipment

#### 4. **Projects & Gallery**
- `projects` - Success stories and project details
- `project_images` - Multiple images for each project
- `gallery_categories` - Gallery filter categories
- `gallery` - Gallery images with categorization

#### 5. **Clients & Testimonials**
- `clients` - Client logos and information
- `testimonials` - Client testimonials and reviews
- `certifications` - Company certifications

#### 6. **User Interaction**
- `contact_inquiries` - Contact form submissions
- `navigation_menu` - Dynamic navigation menu

#### 7. **Admin & Management**
- `admin_users` - Admin panel users
- `activity_log` - Admin activity tracking
- `media_library` - Centralized media management

## 🚀 Setup Instructions

### Step 1: Create Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database and import schema
mysql -u root -p < database/schema.sql

# (Optional) Import sample data
mysql -u root -p < database/sample-data.sql
```

### Step 2: Configure Database Connection

Create a file `api/config/database.php`:

```php
<?php
return [
    'host' => 'localhost',
    'database' => 'honesty_engineering',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
];
```

### Step 3: API Endpoints Structure

The API will be organized as:

```
api/
├── config/
│   ├── database.php         # Database connection config
│   └── cors.php             # CORS configuration
├── includes/
│   ├── Database.php         # Database connection class
│   └── Response.php         # JSON response helper
├── endpoints/
│   ├── site-config.php      # GET site configuration
│   ├── hero.php             # GET hero section data
│   ├── about.php            # GET about section data
│   ├── services.php         # GET services data
│   ├── products.php         # GET products data
│   ├── projects.php         # GET projects data
│   ├── clients.php          # GET clients data
│   ├── gallery.php          # GET gallery images
│   ├── testimonials.php     # GET testimonials
│   └── contact.php          # POST contact form
└── index.php                # API router
```

## 📡 API Endpoints

### Public Endpoints (No Authentication Required)

#### GET `/api/site-config`
Returns site configuration, contact info, social links
```json
{
  "success": true,
  "data": {
    "site_name": "Honesty Engineering",
    "tagline": "GOVT. APPROVED 1st CLASS CONTRACTOR",
    "email": "info@honestyengineeringbd.com",
    ...
  }
}
```

#### GET `/api/hero`
Returns hero section data with stats
```json
{
  "success": true,
  "data": {
    "hero": {...},
    "stats": [...]
  }
}
```

#### GET `/api/about`
Returns about section with features
```json
{
  "success": true,
  "data": {
    "about": {...},
    "features": [...]
  }
}
```

#### GET `/api/services`
Returns all services grouped by category
```json
{
  "success": true,
  "data": [
    {
      "category": "Electrical Works",
      "services": [...]
    }
  ]
}
```

#### GET `/api/services/{category-slug}`
Returns services for specific category

#### GET `/api/products`
Returns all products grouped by category
```json
{
  "success": true,
  "data": [
    {
      "category": "Equipment",
      "products": [...]
    }
  ]
}
```

#### GET `/api/projects`
Returns all projects/success stories
- Query params: `?featured=1` (only featured projects)

#### GET `/api/projects/{id}`
Returns single project with all images

#### GET `/api/clients`
Returns all active clients
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Rich Cotton Apparels Ltd",
      "logo": "🌿",
      "website": "..."
    }
  ]
}
```

#### GET `/api/gallery`
Returns gallery images
- Query params: `?category=construction`

#### GET `/api/testimonials`
Returns all active testimonials

#### GET `/api/ceo`
Returns CEO information and message

#### GET `/api/team`
Returns team members

#### GET `/api/certifications`
Returns company certifications

#### GET `/api/navigation`
Returns navigation menu items

#### POST `/api/contact`
Submit contact form
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+880...",
  "subject": "Project Inquiry",
  "message": "..."
}
```

### Response Format

All responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "code": 400
}
```

## 🔐 Admin Panel Endpoints (Authentication Required)

Admin endpoints require Bearer token authentication:

```
Authorization: Bearer {token}
```

### Authentication

#### POST `/api/admin/login`
```json
{
  "username": "admin",
  "password": "password"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "super_admin"
  }
}
```

### Admin CRUD Operations

All content tables have standard CRUD endpoints:

- `GET /api/admin/{resource}` - List all
- `GET /api/admin/{resource}/{id}` - Get single
- `POST /api/admin/{resource}` - Create new
- `PUT /api/admin/{resource}/{id}` - Update
- `DELETE /api/admin/{resource}/{id}` - Delete

Resources: `services`, `products`, `projects`, `clients`, `gallery`, `testimonials`, etc.

## 📝 Static Site Generation (SSG) Integration

### Build-time Data Fetching

In your Next.js components, fetch data at build time:

```typescript
// Example: pages/index.tsx
export async function generateStaticParams() {
  const response = await fetch('https://yourdomain.com/api/site-config');
  const data = await response.json();
  return data;
}

export async function getStaticProps() {
  // Fetch all necessary data
  const [siteConfig, hero, about, services, projects, clients] = await Promise.all([
    fetch('https://yourdomain.com/api/site-config').then(r => r.json()),
    fetch('https://yourdomain.com/api/hero').then(r => r.json()),
    fetch('https://yourdomain.com/api/about').then(r => r.json()),
    fetch('https://yourdomain.com/api/services').then(r => r.json()),
    fetch('https://yourdomain.com/api/projects').then(r => r.json()),
    fetch('https://yourdomain.com/api/clients').then(r => r.json()),
  ]);

  return {
    props: {
      siteConfig: siteConfig.data,
      hero: hero.data,
      about: about.data,
      services: services.data,
      projects: projects.data,
      clients: clients.data,
    },
    revalidate: 3600, // Rebuild every hour
  };
}
```

### Deployment Workflow

1. **Admin updates content** → Database updated
2. **Trigger rebuild** → Webhook or manual
3. **Next.js fetches API data** → At build time
4. **Generate static HTML** → With updated content
5. **Deploy static files** → To shared hosting

### Rebuild Options

**Option 1: Webhook (Recommended)**
- Admin panel triggers webhook after content update
- Vercel/Netlify rebuilds automatically

**Option 2: Scheduled Builds**
- Set up cron job to rebuild daily/hourly
- Use GitHub Actions or hosting platform scheduler

**Option 3: Manual Rebuild**
- Admin clicks "Rebuild Site" button
- Triggers deployment via API

## 🖼️ Image Upload Strategy

### For Shared Hosting

1. **Admin Panel Upload:**
   - Images uploaded via admin panel
   - Stored in `/public/assets/images/` directory
   - Path saved in database

2. **Organized Structure:**
   ```
   public/assets/images/
   ├── hero/
   ├── about/
   ├── services/
   ├── products/
   ├── projects/
   ├── clients/
   ├── gallery/
   ├── team/
   └── certifications/
   ```

3. **Image Processing:**
   - PHP handles upload and validation
   - Generate thumbnails for gallery
   - Optimize images (optional: using ImageMagick)

## 🔒 Security Best Practices

1. **SQL Injection Prevention:**
   - Use prepared statements (PDO)
   - Never concatenate user input in queries

2. **XSS Protection:**
   - Sanitize all output
   - Use `htmlspecialchars()` for display

3. **CSRF Protection:**
   - Implement CSRF tokens for forms
   - Validate origin headers

4. **File Upload Security:**
   - Validate file types (whitelist)
   - Check file size limits
   - Store outside web root if possible
   - Generate random filenames

5. **Authentication:**
   - Use JWT or session-based auth
   - Hash passwords with `password_hash()`
   - Implement rate limiting

6. **API Rate Limiting:**
   - Limit requests per IP
   - Prevent abuse of contact form

## 📊 Database Backup

Regular backup strategy:

```bash
# Daily backup script
mysqldump -u username -p honesty_engineering > backup_$(date +%Y%m%d).sql

# Compress backup
gzip backup_$(date +%Y%m%d).sql
```

## 🔄 Migration Strategy

When schema changes:

1. Create migration file: `migrations/2026_02_04_add_column.sql`
2. Apply to production database
3. Update API endpoints if needed
4. Rebuild static site

## 📞 Support & Maintenance

- Database: MySQL 5.7+ required
- PHP: Version 7.4+ recommended (8.0+ preferred)
- SSL: Required for production
- Backup: Daily automated backups recommended

## 🎯 Performance Optimization

1. **Database Indexes:** Already added to frequently queried columns
2. **API Caching:** Implement Redis/Memcached for API responses
3. **Image CDN:** Use CDN for image delivery
4. **Gzip Compression:** Enable on server
5. **Query Optimization:** Use EXPLAIN to optimize slow queries

## 📝 Changelog

- **2026-02-04:** Initial database schema created
- 25 tables with complete structure
- Sample data included
- API documentation prepared

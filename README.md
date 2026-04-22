# EventFlow ERP

Modern event operations platform with role-based dashboards for admins, vendors, and customers. This project is built as a React single-page application and includes seeded data for immediate local testing.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Build](https://img.shields.io/badge/Build-react--scripts%205.0.1-09b43a)](https://www.npmjs.com/package/react-scripts)

## Overview

EventFlow ERP streamlines event service workflows across three user groups:

- Admins monitor platform activity, approve vendors, and manage users, orders, and products.
- Vendors publish and manage service listings, track product status, and process order requests.
- Users explore services, add items to cart, checkout, and track order history.

## Demo Credentials

Use the following seeded accounts to test all roles:

| Role   | Email                | Password  |
| ------ | -------------------- | --------- |
| Admin  | admin@eventflow.com  | admin123  |
| User   | rahul@example.com    | user123   |
| Vendor | vendor@starstage.com | vendor123 |

## Core Features

### Admin

- Live dashboard with users, vendors, orders, and revenue metrics.
- User management with status control (active or inactive).
- Vendor application review and approval workflow.
- Full order oversight with status updates.
- Product management (add, edit, and delete).

### Vendor

- Vendor dashboard with activity and revenue context.
- Product catalog management.
- New service/item creation with category and pricing.
- Product availability tracking.
- Order request handling with status updates.

### User

- Service browsing with category and search support.
- Vendor discovery.
- Cart and quantity management.
- Checkout with address and payment method support.
- Order history and status tracking.
- Custom service request submission.

## Tech Stack

- React 18
- React Scripts 5 (Create React App)
- Lucide React icons
- Context API for global state management

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 8+

### Installation

```bash
npm install
```

### Run Locally

```bash
npm start
```

Open http://localhost:3000 in your browser.

## Available Scripts

```bash
npm start   # Start development server
npm test    # Run test runner
npm run build   # Create production build
```

## Deployment

This project includes configuration for both Netlify and Vercel.

### Netlify

- Build command: `npm run build`
- Publish directory: `build`
- SPA redirect configured in `netlify.toml`

### Vercel

- SPA rewrite configured in `vercel.json`

## Project Structure

```text
src/
    App.js                       # App router and role-based page rendering
    index.js                     # React entry point
    index.css                    # Global styles
    components/
        Layout.js                  # Sidebar and layout shell
        UI.js                      # Shared UI elements
    context/
        AppContext.js              # Global app state and seeded data
    pages/
        AuthPage.js                # Login and signup
        AdminDashboard.js          # Admin dashboard
        AdminUsers.js              # User management
        AdminVendors.js            # Vendor management
        AdminOrdersProducts.js     # Orders and products admin screens
        VendorPages.js             # Vendor workflow pages
        UserPages.js               # User workflow pages
```

## Notes

- The app currently uses in-memory seeded state from `src/context/AppContext.js`.
- Data resets on page refresh or restart.
- No backend/database is required to run the current version locally.

## License

No license has been specified yet.

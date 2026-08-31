# KhadiTrace - API Integration Guide

## Overview

This document explains the API structure and how to connect real API endpoints to replace the mock data.

## Current Setup

All API-related code is centralized in a single file: **`src/services/api.js`**

This makes it easy to:

- Switch from mock data to real APIs
- Change endpoints without touching component code
- Manage API authentication and base URLs in one place

## API Endpoints to Implement

### 1. Get Product Details

**Current Mock:** `fetchProductData(productId)`
**Replace with real API call:**

```javascript
export const fetchProductData = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
  return response.json();
};
```

**Expected Response Format:**

```javascript
{
  id: "BGS-SR-0145",
  name: "Khadi Silk Plain Saree",
  description: "Handspun and Handwoven Khadi Saree Made From 100% Mulberry Silk",
  imageUrl: "https://...",
  videoUrl: "https://...",
  productionDate: "12 Aug 2026",
  origin: "Karnataka, India",
  category: "Textile/Saree",
  material: "100% Mulberry Silk",
  specifications: "6.25m X 1.14m",
  weight: "500-550g",
  spinningDetails: "Handspun",
  weaveDetails: "Handwoven",
  style: "Plain Weave",
  productionLocation: "BGS Facility, Murugmalla",
  productionDate: "28 08 2026",
  institution: {
    name: "Bharati Gramodyog Sangha",
    description: "...",
    certificates: [...],
    badges: [...]
  },
  productionSteps: [
    { id: 1, label: "Raw material source", value: "Chikkaballapura, KA" },
    // ... more steps
  ],
  productionStory: "This product uses 100% natural Mulberry silk...",
  isVerified: true
}
```

### 2. Get Production Journey

**Current Mock:** `fetchProductionJourney(productId)`
**Replace with real API call:**

```javascript
export const fetchProductionJourney = async (productId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/products/${productId}/journey`,
  );
  return response.json();
};
```

**Expected Response Format:**

```javascript
{
  productId: "BGS-SR-0145",
  steps: [
    { id: 1, label: "Raw material source", value: "Chikkaballapura, KA" },
    // ... more steps
  ],
  story: "This product uses 100% natural Mulberry silk...",
  locations: [
    { name: "Chikkaballapura, KA", process: "Raw material source" },
    // ... more locations
  ]
}
```

### 3. Share Product Passport

**Current Mock:** `shareProductPassport(productId, options)`
**Replace with real API call:**

```javascript
export const shareProductPassport = async (productId, options = {}) => {
  const response = await fetch(
    `${API_BASE_URL}/api/products/${productId}/share`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    },
  );
  return response.json();
};
```

**Expected Response Format:**

```javascript
{
  success: true,
  message: "Passport shared successfully",
  productId: "BGS-SR-0145",
  shareToken: "share_BGS-SR-0145_1234567890"
}
```

### 4. Verify Product Authenticity

**Current Mock:** `verifyProductAuthenticity(productId)`
**Replace with real API call:**

```javascript
export const verifyProductAuthenticity = async (productId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/products/${productId}/verify`,
  );
  return response.json();
};
```

**Expected Response Format:**

```javascript
{
  productId: "BGS-SR-0145",
  isVerified: true,
  verificationDate: "2026-08-31T10:30:00Z",
  certificate: "KVIC Certified"
}
```

## How to Switch to Real APIs

1. **Update API_BASE_URL** in `src/services/api.js`:

   ```javascript
   const API_BASE_URL = "https://api.yourdomain.com"; // Change this
   ```

2. **Replace each function's implementation** with the real fetch calls shown above

3. **Add error handling** if needed (currently using basic error handling)

4. **Handle authentication** if required:

   ```javascript
   const headers = {
     "Content-Type": "application/json",
     Authorization: `Bearer ${token}`, // Add if needed
   };
   ```

5. **Test with your backend** by running:
   ```bash
   npm run dev
   ```

## URL Parameters (QR Code Scanning)

When a QR code is scanned, it directs users to:

```
http://localhost:5174/?id=BGS-SR-0145
```

or

```
http://localhost:5174/?productId=BGS-SR-0145
```

The app automatically extracts this product ID and fetches all data for that product.

## Features Implemented

✅ **PIP Video with Scroll Detection**

- Video appears in fixed position (bottom-right) when user scrolls
- Video auto-plays and loops (muted)
- Video disappears when user scrolls to the main video section
- Has close button to manually hide

✅ **Production Journey Modal**

- Shows all production steps in a beautiful modal
- Displays production story
- Scrollable content

✅ **Share Passport**

- Calls API to share product passport
- Shows loading state while processing
- Displays success/error alerts

✅ **Dynamic Product Data**

- All content fetched from API
- Supports different products via URL parameter
- Error handling and loading states

## File Structure

```
src/
├── services/
│   └── api.js          ← All API calls here
├── App.jsx             ← Main component (uses API data)
├── App.css             ← Styling (PIP, modal, etc.)
└── components/
    ├── header.jsx
    └── footer.jsx
```

## Environment Variables (Optional)

You can create a `.env` file to manage API URL:

```
VITE_API_URL=https://api.yourdomain.com
```

Then update `api.js`:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.khaditrace.com";
```

## Testing Mock APIs

The current setup uses mock data with 500-600ms delays to simulate real API calls.
All functions are asynchronous and use Promises, so switching to real APIs requires no changes to the component code.

---

**For questions or changes to API structure, edit only `src/services/api.js`**

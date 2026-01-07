# SVMMS - HTML/CSS/JavaScript Conversion Documentation

This document provides a complete guide to converting the React-based SVMMS application to plain HTML, CSS, and JavaScript.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Global Styles](#global-styles)
3. [JavaScript Utilities](#javascript-utilities)
4. [Pages Implementation](#pages-implementation)
5. [Components](#components)
6. [API Integration](#api-integration)
7. [Authentication](#authentication)
8. [Local Storage Management](#local-storage-management)

---

## Project Structure

```
svmms-html/
├── index.html                    # Landing page
├── css/
│   ├── styles.css               # Global styles
│   ├── components.css           # Reusable component styles
│   └── utilities.css            # Utility classes
├── js/
│   ├── main.js                  # Main application logic
│   ├── api.js                   # API integration (Axios alternative)
│   ├── auth.js                  # Authentication handling
│   ├── utils.js                 # Utility functions
│   ├── router.js                # Client-side routing
│   └── components.js            # Reusable component functions
├── pages/
│   ├── auth.html                # Login/Register page
│   ├── admin-dashboard.html     # Admin dashboard
│   ├── customer-dashboard.html  # Customer dashboard
│   ├── service-center.html      # Service center dashboard
│   ├── vehicle-registration.html
│   ├── service-booking.html
│   ├── job-card-detail.html
│   ├── invoice-detail.html
│   ├── profile.html
│   ├── user-management.html
│   ├── supplier-management.html
│   ├── mechanic-performance.html
│   └── reviews-ratings.html
├── assets/
│   └── images/
└── data/
    └── mock-data.js             # Mock data for testing
```

---

## Global Styles (css/styles.css)

```css
/* ========================================
   CSS Variables - Design System Tokens
   ======================================== */

:root {
  /* Colors - Premium Automotive Theme */
  --background: 220 14% 10%;
  --foreground: 210 20% 98%;
  
  --card: 220 13% 14%;
  --card-foreground: 210 20% 98%;
  
  --popover: 220 13% 14%;
  --popover-foreground: 210 20% 98%;
  
  --primary: 210 100% 50%;
  --primary-foreground: 210 20% 98%;
  
  --secondary: 220 13% 18%;
  --secondary-foreground: 210 20% 98%;
  
  --muted: 220 13% 18%;
  --muted-foreground: 215 20% 65%;
  
  --accent: 220 13% 22%;
  --accent-foreground: 210 20% 98%;
  
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 20% 98%;
  
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
  
  --border: 220 13% 22%;
  --input: 220 13% 22%;
  --ring: 210 100% 50%;
  
  --radius: 0.5rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Poppins', var(--font-sans);
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}

/* Light theme override */
[data-theme="light"] {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
}

/* ========================================
   Reset & Base Styles
   ======================================== */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  line-height: 1.6;
  min-height: 100vh;
}

a {
  color: hsl(var(--primary));
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: hsl(var(--primary) / 0.8);
}

img {
  max-width: 100%;
  height: auto;
}

/* ========================================
   Typography
   ======================================== */

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.2;
}

h1 { font-size: 2.25rem; }
h2 { font-size: 1.875rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }
h5 { font-size: 1.125rem; }
h6 { font-size: 1rem; }

.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }

.text-muted {
  color: hsl(var(--muted-foreground));
}

/* ========================================
   Layout Utilities
   ======================================== */

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }

.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

@media (min-width: 640px) {
  .sm\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

/* Spacing */
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }

.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-4 { margin: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }

.w-full { width: 100%; }
.h-full { height: 100%; }
.min-h-screen { min-height: 100vh; }

/* ========================================
   Animation Keyframes
   ======================================== */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-fade-in {
  animation: fadeIn var(--transition-normal) ease-out;
}

.animate-slide-up {
  animation: slideUp var(--transition-slow) ease-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

---

## Components CSS (css/components.css)

```css
/* ========================================
   Button Component
   ======================================== */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.btn-primary:hover:not(:disabled) {
  background-color: hsl(var(--primary) / 0.9);
}

.btn-secondary {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.btn-secondary:hover:not(:disabled) {
  background-color: hsl(var(--secondary) / 0.8);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid hsl(var(--border));
  color: hsl(var(--foreground));
}

.btn-outline:hover:not(:disabled) {
  background-color: hsl(var(--accent));
}

.btn-ghost {
  background-color: transparent;
  color: hsl(var(--foreground));
}

.btn-ghost:hover:not(:disabled) {
  background-color: hsl(var(--accent));
}

.btn-destructive {
  background-color: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
}

.btn-destructive:hover:not(:disabled) {
  background-color: hsl(var(--destructive) / 0.9);
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-icon {
  padding: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
}

/* ========================================
   Card Component
   ======================================== */

.card {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem 1.5rem 0;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(var(--card-foreground));
}

.card-description {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  margin-top: 0.25rem;
}

.card-content {
  padding: 1.5rem;
}

.card-footer {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ========================================
   Input Component
   ======================================== */

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--foreground));
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: hsl(var(--input));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  color: hsl(var(--foreground));
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
}

.input::placeholder {
  color: hsl(var(--muted-foreground));
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-error {
  border-color: hsl(var(--destructive));
}

.input-error-message {
  font-size: 0.75rem;
  color: hsl(var(--destructive));
}

/* Textarea */
.textarea {
  min-height: 80px;
  resize: vertical;
}

/* ========================================
   Select Component
   ======================================== */

.select {
  position: relative;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: hsl(var(--input));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  color: hsl(var(--foreground));
  cursor: pointer;
}

.select-content {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background-color: hsl(var(--popover));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
  display: none;
}

.select-content.open {
  display: block;
}

.select-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.select-item:hover {
  background-color: hsl(var(--accent));
}

.select-item.selected {
  background-color: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
}

/* ========================================
   Badge Component
   ======================================== */

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
}

.badge-default {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.badge-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.badge-success {
  background-color: hsl(var(--success) / 0.2);
  color: hsl(var(--success));
}

.badge-warning {
  background-color: hsl(var(--warning) / 0.2);
  color: hsl(var(--warning));
}

.badge-destructive {
  background-color: hsl(var(--destructive) / 0.2);
  color: hsl(var(--destructive));
}

.badge-outline {
  background-color: transparent;
  border: 1px solid hsl(var(--border));
}

/* ========================================
   Table Component
   ======================================== */

.table-container {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid hsl(var(--border));
}

.table th {
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  background-color: hsl(var(--muted) / 0.5);
}

.table tr:hover {
  background-color: hsl(var(--muted) / 0.5);
}

/* ========================================
   Tabs Component
   ======================================== */

.tabs {
  width: 100%;
}

.tabs-list {
  display: flex;
  border-bottom: 1px solid hsl(var(--border));
  gap: 0;
}

.tab-trigger {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-trigger:hover {
  color: hsl(var(--foreground));
}

.tab-trigger.active {
  color: hsl(var(--primary));
  border-bottom-color: hsl(var(--primary));
}

.tab-content {
  padding: 1.5rem 0;
  display: none;
}

.tab-content.active {
  display: block;
}

/* ========================================
   Modal/Dialog Component
   ======================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-normal);
}

.modal-overlay.open {
  opacity: 1;
  visibility: visible;
}

.modal {
  background-color: hsl(var(--card));
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.95);
  transition: transform var(--transition-normal);
}

.modal-overlay.open .modal {
  transform: scale(1);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid hsl(var(--border));
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.modal-description {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  margin-top: 0.25rem;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid hsl(var(--border));
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: hsl(var(--muted-foreground));
}

/* ========================================
   Toast/Notification Component
   ======================================== */

.toast-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  min-width: 300px;
  max-width: 400px;
  animation: slideUp var(--transition-normal) ease-out;
}

.toast-success {
  border-left: 4px solid hsl(var(--success));
}

.toast-error {
  border-left: 4px solid hsl(var(--destructive));
}

.toast-warning {
  border-left: 4px solid hsl(var(--warning));
}

.toast-info {
  border-left: 4px solid hsl(var(--info));
}

.toast-title {
  font-weight: 600;
  font-size: 0.875rem;
}

.toast-description {
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  margin-top: 0.25rem;
}

.toast-close {
  margin-left: auto;
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: hsl(var(--muted-foreground));
}

/* ========================================
   Avatar Component
   ======================================== */

.avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  background-color: hsl(var(--muted));
}

.avatar-sm { width: 2rem; height: 2rem; }
.avatar-lg { width: 3rem; height: 3rem; }
.avatar-xl { width: 4rem; height: 4rem; }

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
}

/* ========================================
   Progress Component
   ======================================== */

.progress {
  position: relative;
  width: 100%;
  height: 0.5rem;
  background-color: hsl(var(--secondary));
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: hsl(var(--primary));
  border-radius: 9999px;
  transition: width var(--transition-normal);
}

/* ========================================
   Checkbox & Radio Components
   ======================================== */

.checkbox-group,
.radio-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox,
.radio {
  width: 1rem;
  height: 1rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--input));
  cursor: pointer;
  transition: all var(--transition-fast);
}

.checkbox { border-radius: 0.25rem; }
.radio { border-radius: 50%; }

.checkbox:checked,
.radio:checked {
  background-color: hsl(var(--primary));
  border-color: hsl(var(--primary));
}

/* ========================================
   Switch/Toggle Component
   ======================================== */

.switch {
  position: relative;
  width: 2.75rem;
  height: 1.5rem;
  background-color: hsl(var(--input));
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.switch.active {
  background-color: hsl(var(--primary));
}

.switch-thumb {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: white;
  border-radius: 50%;
  transition: transform var(--transition-fast);
}

.switch.active .switch-thumb {
  transform: translateX(1.25rem);
}

/* ========================================
   Sidebar Component
   ======================================== */

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: hsl(var(--card));
  border-right: 1px solid hsl(var(--border));
  display: flex;
  flex-direction: column;
  z-index: 40;
  transition: transform var(--transition-normal);
}

.sidebar.collapsed {
  transform: translateX(-100%);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid hsl(var(--border));
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid hsl(var(--border));
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: hsl(var(--muted-foreground));
  transition: all var(--transition-fast);
}

.sidebar-nav-item:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--foreground));
}

.sidebar-nav-item.active {
  background-color: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
}

.sidebar-nav-item svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Main content with sidebar */
.main-with-sidebar {
  margin-left: 250px;
  min-height: 100vh;
  transition: margin-left var(--transition-normal);
}

@media (max-width: 768px) {
  .main-with-sidebar {
    margin-left: 0;
  }
}

/* ========================================
   Calendar Component
   ======================================== */

.calendar {
  padding: 1rem;
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.calendar-title {
  font-weight: 600;
}

.calendar-nav {
  display: flex;
  gap: 0.5rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
}

.calendar-day-header {
  padding: 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
}

.calendar-day {
  padding: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.calendar-day:hover {
  background-color: hsl(var(--accent));
}

.calendar-day.selected {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.calendar-day.today {
  border: 1px solid hsl(var(--primary));
}

.calendar-day.disabled {
  color: hsl(var(--muted-foreground));
  cursor: not-allowed;
}

/* ========================================
   Skeleton Loading Component
   ======================================== */

.skeleton {
  background: linear-gradient(
    90deg,
    hsl(var(--muted)) 25%,
    hsl(var(--muted) / 0.5) 50%,
    hsl(var(--muted)) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: var(--radius);
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text {
  height: 1rem;
  margin-bottom: 0.5rem;
}

.skeleton-title {
  height: 1.5rem;
  width: 60%;
  margin-bottom: 0.75rem;
}

.skeleton-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.skeleton-card {
  height: 200px;
}
```

---

## JavaScript Utilities (js/utils.js)

```javascript
// ========================================
// Utility Functions
// ========================================

/**
 * Class names utility (similar to clsx/cn)
 */
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format date
 */
function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format time
 */
function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Generate unique ID
 */
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Deep clone object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Scroll to element
 */
function scrollToElement(element, offset = 0) {
  const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

/**
 * Copy to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Get URL parameters
 */
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

/**
 * Set URL parameter
 */
function setUrlParam(key, value) {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cn,
    formatCurrency,
    formatDate,
    formatTime,
    generateId,
    debounce,
    throttle,
    deepClone,
    isInViewport,
    scrollToElement,
    copyToClipboard,
    getUrlParams,
    setUrlParam
  };
}
```

---

## API Integration (js/api.js)

```javascript
// ========================================
// API Configuration and Helper Functions
// ========================================

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Get authentication token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Set authentication token to localStorage
 */
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

/**
 * Remove authentication token from localStorage
 */
function removeAuthToken() {
  localStorage.removeItem('authToken');
}

/**
 * Get default headers for API requests
 */
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Handle API response
 */
async function handleResponse(response) {
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      removeAuthToken();
      window.location.href = '/pages/auth.html';
      return;
    }
    
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * API object with all endpoints
 */
const api = {
  // ========================================
  // Authentication Endpoints
  // ========================================
  auth: {
    async login(email, password) {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(response);
    },
    
    async register(userData) {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    },
    
    async logout() {
      removeAuthToken();
      localStorage.removeItem('user');
      window.location.href = '/pages/auth.html';
    },
    
    async getCurrentUser() {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    }
  },
  
  // ========================================
  // Vehicle Endpoints
  // ========================================
  vehicles: {
    async getAll() {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getById(id) {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getByCustomer(customerId) {
      const response = await fetch(`${API_BASE_URL}/vehicles/customer/${customerId}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async create(vehicleData) {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(vehicleData)
      });
      return handleResponse(response);
    },
    
    async update(id, vehicleData) {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(vehicleData)
      });
      return handleResponse(response);
    },
    
    async delete(id) {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(response);
    }
  },
  
  // ========================================
  // Service Booking Endpoints
  // ========================================
  bookings: {
    async getAll() {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getById(id) {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getByCustomer(customerId) {
      const response = await fetch(`${API_BASE_URL}/bookings/customer/${customerId}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getByStatus(status) {
      const response = await fetch(`${API_BASE_URL}/bookings/status/${status}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async create(bookingData) {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bookingData)
      });
      return handleResponse(response);
    },
    
    async updateStatus(id, status) {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(response);
    },
    
    async cancel(id) {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: getHeaders()
      });
      return handleResponse(response);
    }
  },
  
  // ========================================
  // Job Card Endpoints
  // ========================================
  jobCards: {
    async getAll() {
      const response = await fetch(`${API_BASE_URL}/job-cards`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getById(id) {
      const response = await fetch(`${API_BASE_URL}/job-cards/${id}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getByMechanic(mechanicId) {
      const response = await fetch(`${API_BASE_URL}/job-cards/mechanic/${mechanicId}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async create(jobCardData) {
      const response = await fetch(`${API_BASE_URL}/job-cards`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(jobCardData)
      });
      return handleResponse(response);
    },
    
    async update(id, jobCardData) {
      const response = await fetch(`${API_BASE_URL}/job-cards/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(jobCardData)
      });
      return handleResponse(response);
    },
    
    async updateStatus(id, status) {
      const response = await fetch(`${API_BASE_URL}/job-cards/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(response);
    },
    
    async addPart(id, partData) {
      const response = await fetch(`${API_BASE_URL}/job-cards/${id}/parts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(partData)
      });
      return handleResponse(response);
    }
  },
  
  // ========================================
  // Inventory Endpoints
  // ========================================
  inventory: {
    async getAll() {
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getById(id) {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getLowStock() {
      const response = await fetch(`${API_BASE_URL}/inventory/low-stock`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async create(partData) {
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(partData)
      });
      return handleResponse(response);
    },
    
    async update(id, partData) {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(partData)
      });
      return handleResponse(response);
    },
    
    async updateStock(id, quantity) {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}/stock`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ quantity })
      });
      return handleResponse(response);
    },
    
    async delete(id) {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(response);
    }
  },
  
  // ========================================
  // Invoice Endpoints
  // ========================================
  invoices: {
    async getAll() {
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getById(id) {
      const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getByCustomer(customerId) {
      const response = await fetch(`${API_BASE_URL}/invoices/customer/${customerId}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async create(invoiceData) {
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(invoiceData)
      });
      return handleResponse(response);
    },
    
    async updatePaymentStatus(id, status) {
      const response = await fetch(`${API_BASE_URL}/invoices/${id}/payment`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(response);
    }
  },
  
  // ========================================
  // User Management Endpoints (Admin)
  // ========================================
  users: {
    async getAll() {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getById(id) {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getByRole(role) {
      const response = await fetch(`${API_BASE_URL}/users/role/${role}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async create(userData) {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    },
    
    async update(id, userData) {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    },
    
    async delete(id) {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async updateStatus(id, status) {
      const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(response);
    }
  },
  
  // ========================================
  // Supplier Endpoints
  // ========================================
  suppliers: {
    async getAll() {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getById(id) {
      const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async create(supplierData) {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(supplierData)
      });
      return handleResponse(response);
    },
    
    async update(id, supplierData) {
      const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(supplierData)
      });
      return handleResponse(response);
    },
    
    async delete(id) {
      const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(response);
    }
  },
  
  // ========================================
  // Reviews Endpoints
  // ========================================
  reviews: {
    async getAll() {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getByService(serviceId) {
      const response = await fetch(`${API_BASE_URL}/reviews/service/${serviceId}`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async create(reviewData) {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reviewData)
      });
      return handleResponse(response);
    },
    
    async respond(id, response) {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}/respond`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ response })
      });
      return handleResponse(res);
    }
  },
  
  // ========================================
  // Analytics Endpoints
  // ========================================
  analytics: {
    async getDashboardStats() {
      const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getRevenueStats(startDate, endDate) {
      const response = await fetch(
        `${API_BASE_URL}/analytics/revenue?start=${startDate}&end=${endDate}`,
        { headers: getHeaders() }
      );
      return handleResponse(response);
    },
    
    async getServiceStats() {
      const response = await fetch(`${API_BASE_URL}/analytics/services`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getMechanicPerformance() {
      const response = await fetch(`${API_BASE_URL}/analytics/mechanics`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    },
    
    async getInventoryStats() {
      const response = await fetch(`${API_BASE_URL}/analytics/inventory`, {
        headers: getHeaders()
      });
      return handleResponse(response);
    }
  }
};

// Make api globally available
window.api = api;
```

---

## Authentication Handler (js/auth.js)

```javascript
// ========================================
// Authentication Handler
// ========================================

const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

const auth = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
  
  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
  
  /**
   * Get user role
   */
  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },
  
  /**
   * Check if user has specific role
   */
  hasRole(role) {
    return this.getUserRole() === role;
  },
  
  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await api.auth.login(email, password);
      
      if (response.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Register user
   */
  async register(userData) {
    try {
      const response = await api.auth.register(userData);
      
      if (response.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/pages/auth.html';
  },
  
  /**
   * Redirect based on role
   */
  redirectToDashboard() {
    const role = this.getUserRole();
    
    switch (role) {
      case 'ADMIN':
        window.location.href = '/pages/admin-dashboard.html';
        break;
      case 'MECHANIC':
        window.location.href = '/pages/service-center.html';
        break;
      case 'CUSTOMER':
        window.location.href = '/pages/customer-dashboard.html';
        break;
      default:
        window.location.href = '/pages/auth.html';
    }
  },
  
  /**
   * Protect page - redirect if not authenticated
   */
  requireAuth(allowedRoles = []) {
    if (!this.isAuthenticated()) {
      window.location.href = '/pages/auth.html';
      return false;
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(this.getUserRole())) {
      this.redirectToDashboard();
      return false;
    }
    
    return true;
  }
};

// Make auth globally available
window.auth = auth;
```

---

## Component JavaScript (js/components.js)

```javascript
// ========================================
// Reusable Component Functions
// ========================================

const components = {
  // ========================================
  // Toast Notifications
  // ========================================
  toast: {
    container: null,
    
    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    },
    
    show(options) {
      this.init();
      
      const { title, description, type = 'info', duration = 5000 } = options;
      
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          ${description ? `<div class="toast-description">${description}</div>` : ''}
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      
      this.container.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },
    
    success(title, description) {
      this.show({ title, description, type: 'success' });
    },
    
    error(title, description) {
      this.show({ title, description, type: 'error' });
    },
    
    warning(title, description) {
      this.show({ title, description, type: 'warning' });
    },
    
    info(title, description) {
      this.show({ title, description, type: 'info' });
    }
  },
  
  // ========================================
  // Modal/Dialog
  // ========================================
  modal: {
    open(modalId) {
      const overlay = document.getElementById(modalId);
      if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    },
    
    close(modalId) {
      const overlay = document.getElementById(modalId);
      if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    },
    
    create(options) {
      const { id, title, description, content, footer } = options;
      
      const modal = document.createElement('div');
      modal.id = id;
      modal.className = 'modal-overlay';
      modal.onclick = (e) => {
        if (e.target === modal) this.close(id);
      };
      
      modal.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            ${description ? `<p class="modal-description">${description}</p>` : ''}
            <button class="modal-close" onclick="components.modal.close('${id}')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">${content}</div>
          ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
        </div>
      `;
      
      document.body.appendChild(modal);
      return modal;
    }
  },
  
  // ========================================
  // Select Dropdown
  // ========================================
  select: {
    init(selectElement) {
      const trigger = selectElement.querySelector('.select-trigger');
      const content = selectElement.querySelector('.select-content');
      const items = selectElement.querySelectorAll('.select-item');
      const valueDisplay = trigger.querySelector('.select-value');
      const hiddenInput = selectElement.querySelector('input[type="hidden"]');
      
      trigger.onclick = () => {
        content.classList.toggle('open');
      };
      
      items.forEach(item => {
        item.onclick = () => {
          items.forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');
          valueDisplay.textContent = item.textContent;
          if (hiddenInput) {
            hiddenInput.value = item.dataset.value;
          }
          content.classList.remove('open');
          
          // Trigger change event
          selectElement.dispatchEvent(new CustomEvent('change', {
            detail: { value: item.dataset.value, text: item.textContent }
          }));
        };
      });
      
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!selectElement.contains(e.target)) {
          content.classList.remove('open');
        }
      });
    },
    
    getValue(selectElement) {
      const hiddenInput = selectElement.querySelector('input[type="hidden"]');
      return hiddenInput ? hiddenInput.value : null;
    },
    
    setValue(selectElement, value) {
      const item = selectElement.querySelector(`[data-value="${value}"]`);
      if (item) {
        item.click();
      }
    }
  },
  
  // ========================================
  // Tabs
  // ========================================
  tabs: {
    init(tabsElement) {
      const triggers = tabsElement.querySelectorAll('.tab-trigger');
      const contents = tabsElement.querySelectorAll('.tab-content');
      
      triggers.forEach(trigger => {
        trigger.onclick = () => {
          const targetId = trigger.dataset.tab;
          
          triggers.forEach(t => t.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));
          
          trigger.classList.add('active');
          document.getElementById(targetId).classList.add('active');
        };
      });
    }
  },
  
  // ========================================
  // Switch/Toggle
  // ========================================
  switch: {
    init(switchElement) {
      switchElement.onclick = () => {
        switchElement.classList.toggle('active');
        const isActive = switchElement.classList.contains('active');
        
        switchElement.dispatchEvent(new CustomEvent('change', {
          detail: { checked: isActive }
        }));
      };
    },
    
    isChecked(switchElement) {
      return switchElement.classList.contains('active');
    },
    
    setChecked(switchElement, checked) {
      if (checked) {
        switchElement.classList.add('active');
      } else {
        switchElement.classList.remove('active');
      }
    }
  },
  
  // ========================================
  // Loading Spinner
  // ========================================
  loading: {
    show(container) {
      const spinner = document.createElement('div');
      spinner.className = 'loading-spinner';
      spinner.innerHTML = `
        <svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
      `;
      container.appendChild(spinner);
      return spinner;
    },
    
    hide(spinner) {
      if (spinner) {
        spinner.remove();
      }
    }
  },
  
  // ========================================
  // Calendar
  // ========================================
  calendar: {
    currentDate: new Date(),
    selectedDate: null,
    
    init(calendarElement, options = {}) {
      this.element = calendarElement;
      this.onSelect = options.onSelect || (() => {});
      this.disabledDates = options.disabledDates || [];
      this.render();
    },
    
    render() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      let html = `
        <div class="calendar-header">
          <button class="btn btn-ghost btn-icon" onclick="components.calendar.prevMonth()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <span class="calendar-title">${monthNames[month]} ${year}</span>
          <button class="btn btn-ghost btn-icon" onclick="components.calendar.nextMonth()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <div class="calendar-grid">
      `;
      
      // Day headers
      dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
      });
      
      // Empty cells before first day
      for (let i = 0; i < firstDay; i++) {
        html += `<div class="calendar-day disabled"></div>`;
      }
      
      // Days of month
      const today = new Date();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
        const isPast = date < new Date(today.setHours(0, 0, 0, 0));
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isSelected) classes += ' selected';
        if (isPast) classes += ' disabled';
        
        html += `<div class="${classes}" data-date="${date.toISOString()}" onclick="components.calendar.selectDate('${date.toISOString()}')">${day}</div>`;
      }
      
      html += `</div>`;
      
      this.element.innerHTML = html;
    },
    
    prevMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render();
    },
    
    nextMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render();
    },
    
    selectDate(dateStr) {
      const date = new Date(dateStr);
      if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;
      
      this.selectedDate = date;
      this.render();
      this.onSelect(date);
    },
    
    getSelectedDate() {
      return this.selectedDate;
    }
  },
  
  // ========================================
  // Data Table
  // ========================================
  table: {
    create(options) {
      const { columns, data, onRowClick, actions } = options;
      
      let html = `
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                ${columns.map(col => `<th>${col.header}</th>`).join('')}
                ${actions ? '<th>Actions</th>' : ''}
              </tr>
            </thead>
            <tbody>
      `;
      
      data.forEach((row, index) => {
        html += `<tr data-index="${index}" ${onRowClick ? 'style="cursor: pointer;"' : ''}>`;
        columns.forEach(col => {
          const value = row[col.key];
          html += `<td>${col.render ? col.render(value, row) : value}</td>`;
        });
        
        if (actions) {
          html += `<td><div class="flex gap-2">`;
          actions.forEach(action => {
            html += `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); (${action.onClick.toString()})(${JSON.stringify(row)})">${action.label}</button>`;
          });
          html += `</div></td>`;
        }
        
        html += `</tr>`;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
      
      return html;
    }
  },
  
  // ========================================
  // Pagination
  // ========================================
  pagination: {
    create(options) {
      const { currentPage, totalPages, onPageChange } = options;
      
      let html = '<nav class="pagination"><ul class="pagination-list">';
      
      // Previous button
      html += `
        <li>
          <button class="btn btn-ghost btn-sm" ${currentPage === 1 ? 'disabled' : ''} onclick="(${onPageChange.toString()})(${currentPage - 1})">
            Previous
          </button>
        </li>
      `;
      
      // Page numbers
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
          html += `
            <li>
              <button class="btn ${i === currentPage ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="(${onPageChange.toString()})(${i})">
                ${i}
              </button>
            </li>
          `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
          html += `<li><span class="px-2">...</span></li>`;
        }
      }
      
      // Next button
      html += `
        <li>
          <button class="btn btn-ghost btn-sm" ${currentPage === totalPages ? 'disabled' : ''} onclick="(${onPageChange.toString()})(${currentPage + 1})">
            Next
          </button>
        </li>
      `;
      
      html += '</ul></nav>';
      
      return html;
    }
  }
};

// Make components globally available
window.components = components;
```

---

## Page Example: Login Page (pages/auth.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="SVMMS - Login to your account">
  <title>Login | SVMMS</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
  
  <!-- Styles -->
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="../css/components.css">
  
  <style>
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, hsl(var(--background)) 0%, hsl(220 14% 15%) 100%);
    }
    
    .auth-card {
      width: 100%;
      max-width: 400px;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .auth-logo {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(210 100% 40%) 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }
    
    .auth-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .auth-subtitle {
      color: hsl(var(--muted-foreground));
      font-size: 0.875rem;
    }
    
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
    }
    
    .auth-footer a {
      color: hsl(var(--primary));
      font-weight: 500;
    }
    
    .auth-tabs {
      display: flex;
      margin-bottom: 1.5rem;
      border-radius: var(--radius);
      background: hsl(var(--muted));
      padding: 0.25rem;
    }
    
    .auth-tab {
      flex: 1;
      padding: 0.5rem;
      text-align: center;
      font-size: 0.875rem;
      font-weight: 500;
      border: none;
      background: transparent;
      color: hsl(var(--muted-foreground));
      cursor: pointer;
      border-radius: calc(var(--radius) - 2px);
      transition: all var(--transition-fast);
    }
    
    .auth-tab.active {
      background: hsl(var(--background));
      color: hsl(var(--foreground));
    }
    
    .form-panel {
      display: none;
    }
    
    .form-panel.active {
      display: block;
    }
  </style>
</head>
<body>
  <div class="auth-container">
    <div class="auth-card">
      <div class="card">
        <div class="card-content p-6">
          <div class="auth-header">
            <div class="auth-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h1 class="auth-title">Welcome to SVMMS</h1>
            <p class="auth-subtitle">Smart Vehicle Maintenance Management</p>
          </div>
          
          <div class="auth-tabs">
            <button class="auth-tab active" data-panel="login" onclick="switchPanel('login')">Login</button>
            <button class="auth-tab" data-panel="register" onclick="switchPanel('register')">Register</button>
          </div>
          
          <!-- Login Form -->
          <div id="login-panel" class="form-panel active">
            <form id="login-form" class="auth-form" onsubmit="handleLogin(event)">
              <div class="input-group">
                <label class="input-label" for="login-email">Email</label>
                <input 
                  type="email" 
                  id="login-email" 
                  class="input" 
                  placeholder="name@example.com"
                  required
                >
              </div>
              
              <div class="input-group">
                <label class="input-label" for="login-password">Password</label>
                <input 
                  type="password" 
                  id="login-password" 
                  class="input" 
                  placeholder="••••••••"
                  required
                >
              </div>
              
              <button type="submit" class="btn btn-primary w-full" id="login-btn">
                Sign In
              </button>
            </form>
            
            <div class="auth-footer">
              <a href="#">Forgot your password?</a>
            </div>
          </div>
          
          <!-- Register Form -->
          <div id="register-panel" class="form-panel">
            <form id="register-form" class="auth-form" onsubmit="handleRegister(event)">
              <div class="input-group">
                <label class="input-label" for="register-name">Full Name</label>
                <input 
                  type="text" 
                  id="register-name" 
                  class="input" 
                  placeholder="John Doe"
                  required
                >
              </div>
              
              <div class="input-group">
                <label class="input-label" for="register-email">Email</label>
                <input 
                  type="email" 
                  id="register-email" 
                  class="input" 
                  placeholder="name@example.com"
                  required
                >
              </div>
              
              <div class="input-group">
                <label class="input-label" for="register-phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="register-phone" 
                  class="input" 
                  placeholder="+1 (555) 000-0000"
                  required
                >
              </div>
              
              <div class="input-group">
                <label class="input-label" for="register-password">Password</label>
                <input 
                  type="password" 
                  id="register-password" 
                  class="input" 
                  placeholder="••••••••"
                  required
                  minlength="8"
                >
              </div>
              
              <div class="input-group">
                <label class="input-label" for="register-confirm">Confirm Password</label>
                <input 
                  type="password" 
                  id="register-confirm" 
                  class="input" 
                  placeholder="••••••••"
                  required
                >
              </div>
              
              <button type="submit" class="btn btn-primary w-full" id="register-btn">
                Create Account
              </button>
            </form>
            
            <div class="auth-footer">
              By creating an account, you agree to our <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Scripts -->
  <script src="../js/utils.js"></script>
  <script src="../js/api.js"></script>
  <script src="../js/auth.js"></script>
  <script src="../js/components.js"></script>
  
  <script>
    // Check if already logged in
    if (auth.isAuthenticated()) {
      auth.redirectToDashboard();
    }
    
    // Switch between login and register panels
    function switchPanel(panel) {
      // Update tabs
      document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.panel === panel);
      });
      
      // Update panels
      document.querySelectorAll('.form-panel').forEach(p => {
        p.classList.toggle('active', p.id === `${panel}-panel`);
      });
    }
    
    // Handle login form submission
    async function handleLogin(event) {
      event.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const button = document.getElementById('login-btn');
      
      button.disabled = true;
      button.textContent = 'Signing in...';
      
      try {
        const result = await auth.login(email, password);
        
        if (result.success) {
          components.toast.success('Welcome back!', 'Login successful');
          setTimeout(() => auth.redirectToDashboard(), 1000);
        } else {
          components.toast.error('Login failed', result.error);
        }
      } catch (error) {
        components.toast.error('Error', 'An unexpected error occurred');
      } finally {
        button.disabled = false;
        button.textContent = 'Sign In';
      }
    }
    
    // Handle register form submission
    async function handleRegister(event) {
      event.preventDefault();
      
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const phone = document.getElementById('register-phone').value;
      const password = document.getElementById('register-password').value;
      const confirm = document.getElementById('register-confirm').value;
      const button = document.getElementById('register-btn');
      
      if (password !== confirm) {
        components.toast.error('Error', 'Passwords do not match');
        return;
      }
      
      button.disabled = true;
      button.textContent = 'Creating account...';
      
      try {
        const result = await auth.register({
          name,
          email,
          phone,
          password,
          role: 'CUSTOMER'
        });
        
        if (result.success) {
          components.toast.success('Account created!', 'Welcome to SVMMS');
          setTimeout(() => auth.redirectToDashboard(), 1000);
        } else {
          components.toast.error('Registration failed', result.error);
        }
      } catch (error) {
        components.toast.error('Error', 'An unexpected error occurred');
      } finally {
        button.disabled = false;
        button.textContent = 'Create Account';
      }
    }
  </script>
</body>
</html>
```

---

## Page Example: Admin Dashboard (pages/admin-dashboard.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="SVMMS Admin Dashboard">
  <title>Admin Dashboard | SVMMS</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="../css/components.css">
  
  <style>
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }
    
    .dashboard-main {
      flex: 1;
      margin-left: 250px;
      transition: margin-left var(--transition-normal);
    }
    
    @media (max-width: 768px) {
      .dashboard-main {
        margin-left: 0;
      }
    }
    
    .dashboard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid hsl(var(--border));
      background: hsl(var(--card));
    }
    
    .dashboard-content {
      padding: 1.5rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
    }
    
    @media (min-width: 640px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (min-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(4, 1fr); }
    }
    
    .stat-card {
      padding: 1.5rem;
    }
    
    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    
    .stat-title {
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
    }
    
    .stat-value {
      font-size: 1.875rem;
      font-weight: 700;
    }
    
    .stat-change {
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
    
    .stat-change.positive { color: hsl(var(--success)); }
    .stat-change.negative { color: hsl(var(--destructive)); }
    
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    
    @media (min-width: 1024px) {
      .charts-grid { grid-template-columns: 2fr 1fr; }
    }
    
    .recent-section {
      margin-top: 1.5rem;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    
    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="flex items-center gap-3">
          <div class="auth-logo" style="width: 40px; height: 40px; margin: 0;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <span class="font-semibold">SVMMS Admin</span>
        </div>
      </div>
      
      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <a href="admin-dashboard.html" class="sidebar-nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </a>
          <a href="user-management.html" class="sidebar-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            User Management
          </a>
          <a href="supplier-management.html" class="sidebar-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 3h22v18H1z"/>
              <path d="M1 9h22"/>
              <path d="M1 15h22"/>
              <path d="M8 3v18"/>
              <path d="M16 3v18"/>
            </svg>
            Suppliers
          </a>
          <a href="mechanic-performance.html" class="sidebar-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Performance
          </a>
          <a href="reviews-ratings.html" class="sidebar-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Reviews
          </a>
        </nav>
      </div>
      
      <div class="sidebar-footer">
        <button class="btn btn-ghost w-full justify-start" onclick="auth.logout()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="dashboard-main">
      <header class="dashboard-header">
        <div>
          <h1 class="text-xl font-semibold">Dashboard Overview</h1>
          <p class="text-sm text-muted">Welcome back, Admin</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn btn-ghost btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <div class="avatar">
            <span class="avatar-fallback">A</span>
          </div>
        </div>
      </header>
      
      <div class="dashboard-content">
        <!-- Stats Cards -->
        <div class="stats-grid" id="stats-grid">
          <!-- Stats will be loaded dynamically -->
        </div>
        
        <!-- Charts Section -->
        <div class="charts-grid">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Revenue Overview</h3>
              <p class="card-description">Monthly revenue for the current year</p>
            </div>
            <div class="card-content">
              <div id="revenue-chart" style="height: 300px;">
                <!-- Chart placeholder -->
                <div class="skeleton skeleton-card"></div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Service Distribution</h3>
              <p class="card-description">Services by type</p>
            </div>
            <div class="card-content">
              <div id="service-chart" style="height: 300px;">
                <!-- Chart placeholder -->
                <div class="skeleton skeleton-card"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent Section -->
        <div class="recent-section">
          <div class="section-header">
            <h2 class="section-title">Recent Bookings</h2>
            <a href="#" class="btn btn-ghost btn-sm">View All</a>
          </div>
          <div class="card">
            <div class="card-content p-0" id="recent-bookings">
              <!-- Table will be loaded dynamically -->
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  
  <!-- Scripts -->
  <script src="../js/utils.js"></script>
  <script src="../js/api.js"></script>
  <script src="../js/auth.js"></script>
  <script src="../js/components.js"></script>
  
  <script>
    // Protect page - admin only
    if (!auth.requireAuth(['ADMIN'])) {
      // Will redirect automatically
    }
    
    // Load dashboard data
    async function loadDashboard() {
      try {
        // Load stats
        loadStats();
        
        // Load recent bookings
        loadRecentBookings();
      } catch (error) {
        components.toast.error('Error', 'Failed to load dashboard data');
      }
    }
    
    function loadStats() {
      // Mock stats data
      const stats = [
        { title: 'Total Revenue', value: '$48,250', change: '+12.5%', positive: true, icon: 'dollar' },
        { title: 'Active Jobs', value: '23', change: '+5', positive: true, icon: 'wrench' },
        { title: 'Customers', value: '1,429', change: '+8.2%', positive: true, icon: 'users' },
        { title: 'Pending Invoices', value: '12', change: '-3', positive: false, icon: 'file' }
      ];
      
      const statsGrid = document.getElementById('stats-grid');
      statsGrid.innerHTML = stats.map(stat => `
        <div class="card stat-card">
          <div class="stat-header">
            <span class="stat-title">${stat.title}</span>
          </div>
          <div class="stat-value">${stat.value}</div>
          <div class="stat-change ${stat.positive ? 'positive' : 'negative'}">
            ${stat.change} from last month
          </div>
        </div>
      `).join('');
    }
    
    function loadRecentBookings() {
      // Mock bookings data
      const bookings = [
        { id: 'BK-001', customer: 'John Smith', vehicle: 'Toyota Camry', service: 'Oil Change', status: 'Completed', date: '2024-01-15' },
        { id: 'BK-002', customer: 'Sarah Johnson', vehicle: 'Honda Civic', service: 'Brake Inspection', status: 'In Progress', date: '2024-01-15' },
        { id: 'BK-003', customer: 'Mike Wilson', vehicle: 'Ford F-150', service: 'Engine Diagnostic', status: 'Pending', date: '2024-01-14' },
        { id: 'BK-004', customer: 'Emily Brown', vehicle: 'BMW X5', service: 'Full Service', status: 'Scheduled', date: '2024-01-16' },
        { id: 'BK-005', customer: 'David Lee', vehicle: 'Mercedes C300', service: 'Tire Rotation', status: 'Completed', date: '2024-01-13' }
      ];
      
      const tableHtml = components.table.create({
        columns: [
          { key: 'id', header: 'Booking ID' },
          { key: 'customer', header: 'Customer' },
          { key: 'vehicle', header: 'Vehicle' },
          { key: 'service', header: 'Service' },
          { 
            key: 'status', 
            header: 'Status',
            render: (value) => {
              const colors = {
                'Completed': 'badge-success',
                'In Progress': 'badge-primary',
                'Pending': 'badge-warning',
                'Scheduled': 'badge-default'
              };
              return `<span class="badge ${colors[value] || 'badge-default'}">${value}</span>`;
            }
          },
          { key: 'date', header: 'Date' }
        ],
        data: bookings
      });
      
      document.getElementById('recent-bookings').innerHTML = tableHtml;
    }
    
    // Initialize
    loadDashboard();
  </script>
</body>
</html>
```

---

## Additional Pages Structure

The following pages would follow similar patterns:

### pages/customer-dashboard.html
- Protected for CUSTOMER role
- Shows upcoming appointments, service history
- Quick booking form
- Vehicle list

### pages/service-center.html
- Protected for MECHANIC role
- Shows assigned jobs, job queue
- Job card management
- Parts requisition

### pages/vehicle-registration.html
- Form to add/edit vehicles
- Vehicle list with details
- Service history per vehicle

### pages/service-booking.html
- Multi-step booking form
- Calendar for date selection
- Service type selection
- Time slot selection

### pages/job-card-detail.html
- Detailed job card view
- Task checklist
- Parts management
- Notes and updates

### pages/invoice-detail.html
- Invoice summary
- Line items (labor + parts)
- Payment status
- Print/download functionality

### pages/profile.html
- User profile management
- Password change
- Notification preferences
- Two-factor authentication

### pages/user-management.html (Admin)
- User list with filters
- Add/edit user modal
- Role assignment
- Status management

### pages/supplier-management.html (Admin)
- Supplier directory
- Add/edit supplier
- Parts catalog per supplier
- Order history

### pages/mechanic-performance.html (Admin)
- Performance metrics
- Charts and statistics
- Individual mechanic cards
- Skill ratings

### pages/reviews-ratings.html
- Customer reviews list
- Rating statistics
- Response management
- Filter by rating/date

---

## Mock Data (data/mock-data.js)

```javascript
// ========================================
// Mock Data for Development
// ========================================

const mockData = {
  users: [
    { id: 1, name: 'Admin User', email: 'admin@svmms.com', role: 'ADMIN', status: 'ACTIVE' },
    { id: 2, name: 'John Mechanic', email: 'john@svmms.com', role: 'MECHANIC', status: 'ACTIVE' },
    { id: 3, name: 'Sarah Customer', email: 'sarah@example.com', role: 'CUSTOMER', status: 'ACTIVE' }
  ],
  
  vehicles: [
    { id: 1, customerId: 3, make: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'ABC-1234', vin: '1HGBH41JXMN109186' },
    { id: 2, customerId: 3, make: 'Honda', model: 'Civic', year: 2019, licensePlate: 'XYZ-5678', vin: '2HGFB2F50CH123456' }
  ],
  
  services: [
    { id: 1, name: 'Oil Change', price: 49.99, duration: 30 },
    { id: 2, name: 'Brake Inspection', price: 29.99, duration: 45 },
    { id: 3, name: 'Full Service', price: 199.99, duration: 120 },
    { id: 4, name: 'Tire Rotation', price: 39.99, duration: 30 },
    { id: 5, name: 'Engine Diagnostic', price: 89.99, duration: 60 }
  ],
  
  bookings: [
    { id: 1, customerId: 3, vehicleId: 1, serviceId: 1, date: '2024-01-20', time: '09:00', status: 'SCHEDULED' },
    { id: 2, customerId: 3, vehicleId: 2, serviceId: 3, date: '2024-01-15', time: '10:00', status: 'COMPLETED' }
  ],
  
  spareParts: [
    { id: 1, name: 'Oil Filter', partNumber: 'OF-001', quantity: 50, price: 12.99, minStock: 10 },
    { id: 2, name: 'Brake Pads (Front)', partNumber: 'BP-001', quantity: 20, price: 45.99, minStock: 5 },
    { id: 3, name: 'Air Filter', partNumber: 'AF-001', quantity: 35, price: 18.99, minStock: 10 },
    { id: 4, name: 'Spark Plugs (Set of 4)', partNumber: 'SP-001', quantity: 15, price: 32.99, minStock: 5 }
  ],
  
  suppliers: [
    { id: 1, name: 'AutoParts Plus', email: 'orders@autopartsplus.com', phone: '555-0101', rating: 4.8 },
    { id: 2, name: 'Quality Parts Co', email: 'sales@qualityparts.com', phone: '555-0102', rating: 4.5 }
  ],
  
  reviews: [
    { id: 1, customerId: 3, serviceId: 2, rating: 5, comment: 'Excellent service! Very professional.', date: '2024-01-10' }
  ]
};

// Mock API for development without backend
const mockApi = {
  auth: {
    login(email, password) {
      const user = mockData.users.find(u => u.email === email);
      if (user) {
        return Promise.resolve({
          token: 'mock-jwt-token-' + user.id,
          user: user
        });
      }
      return Promise.reject(new Error('Invalid credentials'));
    },
    
    register(userData) {
      const newUser = {
        id: mockData.users.length + 1,
        ...userData,
        status: 'ACTIVE'
      };
      mockData.users.push(newUser);
      return Promise.resolve({
        token: 'mock-jwt-token-' + newUser.id,
        user: newUser
      });
    }
  },
  
  vehicles: {
    getAll() {
      return Promise.resolve(mockData.vehicles);
    },
    getByCustomer(customerId) {
      return Promise.resolve(mockData.vehicles.filter(v => v.customerId === customerId));
    }
  },
  
  bookings: {
    getAll() {
      return Promise.resolve(mockData.bookings);
    },
    create(data) {
      const newBooking = { id: mockData.bookings.length + 1, ...data };
      mockData.bookings.push(newBooking);
      return Promise.resolve(newBooking);
    }
  },
  
  inventory: {
    getAll() {
      return Promise.resolve(mockData.spareParts);
    },
    getLowStock() {
      return Promise.resolve(mockData.spareParts.filter(p => p.quantity <= p.minStock));
    }
  }
};

// Use mock API during development
if (!window.location.hostname.includes('api')) {
  window.api = mockApi;
}
```

---

## Router (js/router.js)

```javascript
// ========================================
// Simple Client-Side Router
// ========================================

const router = {
  routes: {},
  
  register(path, handler) {
    this.routes[path] = handler;
  },
  
  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  },
  
  handleRoute() {
    const path = window.location.pathname;
    const handler = this.routes[path];
    
    if (handler) {
      handler();
    } else {
      // 404 handling
      window.location.href = '/pages/not-found.html';
    }
  },
  
  init() {
    window.addEventListener('popstate', () => this.handleRoute());
    this.handleRoute();
  }
};

// Make router globally available
window.router = router;
```

---

## Summary

This documentation provides:

1. **Complete CSS framework** matching the React design system
2. **JavaScript utilities** for common operations
3. **API integration** with fetch for backend communication
4. **Authentication handler** with JWT token management
5. **Reusable components** (toast, modal, select, tabs, etc.)
6. **Page templates** for all SVMMS modules
7. **Mock data** for development without backend
8. **Simple router** for SPA-like navigation

To implement the full application:

1. Create the folder structure as outlined
2. Copy the CSS and JS files
3. Create each HTML page following the templates
4. Connect to your Spring Boot backend by updating `API_BASE_URL`
5. Replace mock data with real API calls

This provides a complete foundation for building the SVMMS application using vanilla HTML, CSS, and JavaScript.

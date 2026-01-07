# Test Login Credentials

## Quick Test Users

### Admin User (Auto-created)
- **Email**: admin@admin.com
- **Password**: admin123
- **Redirects to**: `/admin`
- **Quick Access**: Click "Use Admin Credentials" button on login page

### Test Customer
- **Email**: customer@test.com
- **Password**: password123
- **Redirects to**: `/customer`

### Test Service Center
- **Email**: service@test.com
- **Password**: password123
- **Redirects to**: `/service-center`

## Testing Steps

1. **Start both servers**:
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd auto-serve-hub
   npm run dev
   ```

2. **Go to**: http://localhost:5173

3. **Test Login Flow**:
   - Click "Get Started" or "Sign In"
   - Click "Use Admin Credentials" button for quick admin login
   - OR manually enter admin credentials above
   - Should redirect to appropriate dashboard

4. **Test Registration**:
   - Click "Sign Up" tab
   - Select user type: Customer, Service Center, or Admin
   - Create new account
   - Should show success message

5. **Test Admin Features**:
   - Login as admin
   - Access User Management: `/admin/users`
   - View Inventory: `/inventory`
   - Check Mechanic Performance: `/admin/mechanics`
   - Review Customer Feedback: `/reviews`

6. **Test Login/Logout Flow**:
   - Login with any role
   - Check user avatar appears in header
   - Click avatar to see dropdown menu
   - Test "Dashboard" and "Profile" links
   - Click "Log out" to test logout functionality
   - Verify redirect to home page

## Expected Behavior

- ✅ Login shows "Redirecting to dashboard..."
- ✅ Successful redirect to role-based page
- ✅ Token stored in localStorage
- ✅ Protected routes work
- ✅ User avatar/dropdown appears in header
- ✅ Logout clears session and redirects to home

## Login/Logout Features

### Navigation Component
- **Logged Out**: Shows "Sign In" and "Get Started" buttons
- **Logged In**: Shows user avatar with dropdown menu

### User Dropdown Menu
- **User Info**: Name and role with colored icon
- **Dashboard**: Quick link to role-based dashboard
- **Profile**: Link to profile settings
- **Logout**: Clears session and redirects to home

### Role-Based Features
- **Customer**: Green car icon, links to `/customer`
- **Service Center**: Blue wrench icon, links to `/service-center`
- **Admin**: Red shield icon, links to `/admin`

## Troubleshooting

### "Redirecting but not redirected"
- Check browser console for errors
- Verify backend is running on port 5000
- Check network tab for API calls

### Backend Connection Error
- Ensure MongoDB is running
- Check backend console for errors
- Verify .env file settings

### Frontend Issues
- Clear localStorage: `localStorage.clear()`
- Check React DevTools
- Verify API base URL in api.ts
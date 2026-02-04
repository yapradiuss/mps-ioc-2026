# Environment Setup for IOC Dashboard

## Google Maps API Key Configuration

The IOC Dashboard uses Google Maps to display real-time zone monitoring. You need to configure a Google Maps API key to enable the map functionality.

### Step 1: Get Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

### Step 2: Create .env.local File

Create a file named `.env.local` in the root of your project:

```bash
# In the project root directory
touch .env.local
```

### Step 3: Add Your API Key

Open `.env.local` and add:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied from Google Cloud Console.

### Step 4: Restart Development Server

After adding the API key, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## Example .env.local File

```env
# Google Maps API Key for IOC Dashboard
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Note: This is just an example format
# Replace with your actual API key from Google Cloud Console
```

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to version control (it's already in .gitignore)
- Keep your API key secure and don't share it publicly
- Consider restricting your API key to specific domains in production
- For production, set up proper API key restrictions in Google Cloud Console

## Troubleshooting

### Map not showing?

1. **Check the browser console** for errors
2. **Verify your API key** is correct in `.env.local`
3. **Ensure Maps JavaScript API** is enabled in Google Cloud Console
4. **Restart the dev server** after adding the API key
5. **Clear browser cache** and refresh the page

### "Google Maps Not Configured" message?

This means either:
- `.env.local` file doesn't exist
- The API key variable name is incorrect
- The dev server wasn't restarted after adding the key

## Map Features

Once configured, the IOC Dashboard map will show:

- **Hybrid View:** Satellite imagery with street labels
- **Central Marker:** Main MPSepang Operations Center (red)
- **Zone Markers:**
  - Zone A - Main Facility (green)
  - Zone B - Data Center (green)
  - Zone C - Perimeter (orange - alert status)
  - Zone D - Parking Area (green)
- **Controls:** Zoom, Street View, Map Type, Fullscreen

## Default Location

The map is centered on:
- **Latitude:** 2.7608
- **Longitude:** 101.7380
- **Location:** Sepang International Circuit, Malaysia
- **Zoom Level:** 15

You can customize these coordinates in `src/app/ioc-dashboard/page.tsx`.

## Vercel Deployment

For builds on Vercel, set these **Environment Variables** in your project (Settings → Environment Variables):

| Variable | Description | Example |
|----------|--------------|---------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (required for map) | Your key from Google Cloud Console |
| `NEXT_PUBLIC_API_URL` | Backend API base URL (single URL) | `https://your-backend.vercel.app` or `http://43.217.149.217:3001` |
- Use a **single** URL for `NEXT_PUBLIC_API_URL` in production (no commas).
- **Cron (CCTV refresh):** A cron runs every 10 minutes and hits `/api/cron/cctv-refresh` automatically (Next.js only, no Express, no secret required).
- Add them for **Production**, **Preview**, and **Development** as needed.
- Redeploy after changing env vars so the build picks them up.

---

For more information, see:
- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)


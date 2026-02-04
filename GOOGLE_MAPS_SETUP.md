# Google Maps Setup Guide

## Quick Fix for "Map Not Loading"

### Step 1: Create .env.local File

In your project root directory (where package.json is), create a file named `.env.local`:

```bash
# Create the file
touch .env.local
```

Or create it manually in your code editor.

### Step 2: Add Your API Key

Open `.env.local` and add this line:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyYourActualAPIKeyHere
```

**Replace `AIzaSyYourActualAPIKeyHere` with your actual Google Maps API key.**

### Step 3: Get Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. **Create a New Project** (or select existing):
   - Click "Select a project" at the top
   - Click "New Project"
   - Name it "MPSepang IOC" or similar
   - Click "Create"

4. **Enable Maps JavaScript API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API"
   - Click on it
   - Click "Enable"

5. **Create API Key**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key that appears
   - (Optional) Click "Restrict Key" to secure it

6. **Paste into .env.local**:
   - Replace the placeholder with your actual key

### Step 4: Restart Development Server

**IMPORTANT:** You MUST restart the dev server after adding the API key!

```bash
# Stop the server (press Ctrl+C in terminal)

# Then restart it
npm run dev
```

### Step 5: Check the IOC Dashboard

Navigate to: `http://localhost:3000/ioc-dashboard`

You should now see the map loading!

---

## Troubleshooting

### Still seeing "Map Loading Error"?

#### Check 1: Verify .env.local Location
The `.env.local` file must be in the **project root**, not in any subdirectory.

```
your-project/
├── .env.local          ← Here (same level as package.json)
├── package.json
├── src/
└── ...
```

#### Check 2: Verify File Name
- Must be exactly `.env.local` (with the dot at the start)
- Not `env.local` or `.env-local` or `.env`

#### Check 3: Check API Key Format
```env
# Correct format:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Wrong formats (missing parts):
GOOGLE_MAPS_API_KEY=...                    ❌ (missing NEXT_PUBLIC_)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=           ❌ (no value)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key   ❌ (placeholder text)
```

#### Check 4: Browser Console
Open browser DevTools (F12) and check the Console tab for errors:

- **"RefererNotAllowedMapError"**: Your API key has domain restrictions
  - Go to Google Cloud Console
  - Edit your API key restrictions
  - Allow `localhost:3000` for development

- **"InvalidKeyMapError"**: Your API key is wrong
  - Double-check you copied the entire key
  - Make sure there are no extra spaces

- **"REQUEST_DENIED"**: Maps JavaScript API not enabled
  - Go back to Step 3.4 and enable the API

#### Check 5: Restart Server
Did you restart the dev server after creating .env.local?

```bash
# Stop (Ctrl+C) and restart:
npm run dev
```

---

## Example .env.local File

```env
# Google Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Other environment variables (if any)
# NEXT_PUBLIC_OTHER_VAR=value
```

---

## Map Features

Once loaded, you'll see:

- **📍 Central Red Marker**: MPSepang Operations Center
- **🟢 Green Markers**: Secure zones (A, B, D)
- **🟠 Orange Marker**: Alert zone (C)
- **🗺️ Hybrid View**: Satellite + street labels
- **🎛️ Controls**: Zoom, pan, street view, fullscreen

---

## Security Notes

### For Development:
- ✅ Use `.env.local` (already in .gitignore)
- ✅ Keep API key unrestricted or allow localhost

### For Production:
- ⚠️ Set up API key restrictions
- ⚠️ Restrict to your domain only
- ⚠️ Enable billing in Google Cloud
- ⚠️ Set daily quotas

---

## Cost Information

**Good News:** Google Maps offers free tier:
- **$200 free credit per month**
- Maps JavaScript API: ~$7 per 1000 loads
- Your IOC dashboard likely stays within free tier

[Check Google Maps Pricing](https://cloud.google.com/maps-platform/pricing)

---

## Need Help?

### Check these files:
- `ENV_SETUP.md` - Detailed environment setup
- Console logs - Browser DevTools (F12)
- Terminal - Dev server output

### Common Issues:
1. ❌ .env.local not created → Create it
2. ❌ API key not added → Add it
3. ❌ Server not restarted → Restart it
4. ❌ Wrong API key → Get new one from Google
5. ❌ API not enabled → Enable "Maps JavaScript API"

---

**Still stuck?** Check the browser console (F12) for specific error messages!


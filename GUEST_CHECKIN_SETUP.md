# Guest Check-In System

A beautiful, interactive guest check-in page that allows guests to search their name in your Google Spreadsheet and find their assigned table number.

## Features

- 🔍 **Real-time Search** - Guests can type their name and see autocomplete suggestions
- 📋 **Google Sheets Integration** - Pull guest list and table numbers directly from a Google Spreadsheet
- 🎨 **Responsive Design** - Works great on mobile, tablet, and desktop
- ⚡ **Fast Performance** - Guests data is fetched once on page load
- 🔒 **Secure** - Uses Google Service Account for read-only access

## Setup Instructions

### 1. Create a Google Sheets API Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create a Service Account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the account details
   - Create a JSON key
   - Download the JSON file

### 2. Prepare Your Google Spreadsheet

1. Create a Google Spreadsheet with your guest list
2. Format it as follows:
   - **Column A**: Guest Names
   - **Column B**: Table Numbers
   - Optional: Include a header row

Example:

```
Name          Table
John Doe      1
Jane Smith    2
Bob Johnson   3
```

3. Share the spreadsheet with your service account email (found in the JSON file as `client_email`)

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in the values from your Google Service Account JSON file:
   - `GOOGLE_TYPE`: "service_account"
   - `GOOGLE_PROJECT_ID`: from the JSON file
   - `GOOGLE_PRIVATE_KEY_ID`: from the JSON file
   - `GOOGLE_PRIVATE_KEY`: from the JSON file (include the `\n` escape sequences)
   - `GOOGLE_CLIENT_EMAIL`: from the JSON file
   - `GOOGLE_CLIENT_ID`: from the JSON file
   - `GOOGLE_AUTH_URI`: "https://accounts.google.com/o/oauth2/auth"
   - `GOOGLE_TOKEN_URI`: "https://oauth2.googleapis.com/token"
   - `GOOGLE_AUTH_PROVIDER_X509_CERT_URL`: "https://www.googleapis.com/oauth2/v1/certs"
   - `GOOGLE_CLIENT_X509_CERT_URL`: from the JSON file

3. Set your spreadsheet details:
   - `GOOGLE_SPREADSHEET_ID`: Extract from your spreadsheet URL
     - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - `GOOGLE_SHEET_RANGE`: The range containing your data (e.g., "Sheet1!A:B")

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/check-in` to see the check-in page.

## How It Works

1. **Data Loading**: When a guest opens the page, it fetches the guest list from the Google Sheet via the `/api/guests` endpoint
2. **Search**: As they type their name, the page filters the guest list and shows matching names
3. **Selection**: Clicking a suggestion or selecting from the dropdown displays their table number
4. **Display**: A highlighted card shows the guest's name and assigned table number

## File Structure

- `/app/check-in/page.tsx` - The main check-in page component (client-side)
- `/app/api/guests/route.ts` - API endpoint to fetch guests from Google Sheets
- `.env.local` - Environment variables (not committed to git)
- `.env.local.example` - Template for environment variables

## Styling

The page uses Tailwind CSS for styling. You can customize the colors and layout in the component:

- Primary color: Blue (adjust `focus:border-blue-500`, `focus:ring-blue-200`, etc.)
- Success color: Green (adjust `from-green-50`, `border-green-200`, etc.)
- Fonts: Adjust text sizes and weights as needed

## Troubleshooting

### "GOOGLE_SPREADSHEET_ID is not configured"

- Make sure `.env.local` exists and has `GOOGLE_SPREADSHEET_ID` set

### "Failed to fetch guests"

- Check that the service account email has access to the spreadsheet
- Verify all Google credentials in `.env.local` are correct
- Check browser console (F12) for detailed error messages

### No suggestions appearing

- Make sure your spreadsheet has data in columns A and B
- Check that the `GOOGLE_SHEET_RANGE` matches your sheet layout

### API returns empty list

- Verify the service account has been shared with the spreadsheet
- Check the sheet name in `GOOGLE_SHEET_RANGE` (e.g., "Sheet1" vs "Guest List")

## Performance

- Guest data is fetched once when the page loads
- Filtering is done client-side (fast, no API calls during search)
- Works offline after initial load
- Suggestions are limited to visible results only

## Security Notes

- Service account credentials are only used server-side in the API route
- Credentials are not exposed to the browser
- The Google Sheet only needs read-only access
- Consider using GitHub Secrets or similar for production deployments

## Customization Ideas

- Add a confirmation screen after selection
- Send a notification/email upon check-in
- Track who has checked in
- Add photos or additional guest info
- Support multiple events or dates
- Add QR code scanning

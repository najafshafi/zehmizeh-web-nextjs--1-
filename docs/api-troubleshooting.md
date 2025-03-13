# API Connectivity Troubleshooting Guide

This guide will help you diagnose and fix API connectivity issues in the ZehMizeh application.

## Quick Diagnostic Check

You can run a quick diagnostic check directly from your browser console with:

```javascript
window.apiDiagnostic.test()
```

This will check:
- Your internet connection
- The API configuration
- Connectivity to key endpoints

## Common Error Messages

### "Network error - Please check your connection"

This error typically indicates that the browser failed to complete the API request.

#### Possible Causes:

1. **Internet Connection Issues**
   - Your device is offline or has unstable internet
   - Your network has firewall rules blocking API connections
   - DNS resolution problems

2. **CORS Configuration Issues**
   - Cross-Origin Resource Sharing (CORS) headers are missing or incorrect
   - Your browser is blocking cross-origin requests

3. **API Server Issues**
   - The API server is down or unreachable
   - The API server is taking too long to respond (timeout)

#### Troubleshooting Steps:

1. **Check your internet connection**
   - Verify you're online by visiting other websites
   - Try using a different network (e.g., switch from WiFi to mobile data)
   - Run `window.apiDiagnostic.connection()` in console

2. **Verify the API URL configuration**
   - Check that `NEXT_PUBLIC_BACKEND_API` is set correctly
   - Run `window.apiDiagnostic.apiConfig()` in console

3. **Test specific endpoints**
   - Run `window.apiDiagnostic.endpoint('/auth/login', true)` to test the login endpoint
   - Check the browser Network tab for failed requests

## Environment Configuration

The API URL must be correctly configured for the application to work. This is set via the `NEXT_PUBLIC_BACKEND_API` environment variable.

### Local Development

Create or update a `.env.local` file in the project root with:

```
NEXT_PUBLIC_BACKEND_API=https://api.zehmizeh.com
```

### Production

Make sure the environment variable is set in your hosting provider's dashboard.

## Developer Tools

### Network Tab

1. Open your browser's developer tools (F12 or right-click and select "Inspect")
2. Go to the "Network" tab
3. Look for failed requests (red entries)
4. Check the "Response" tab for error messages
5. Look at the "Headers" tab for request details

### Console Logging

We've added extensive console logging for API requests. To see it:

1. Open browser developer tools (F12)
2. Go to the "Console" tab
3. Look for logs prefixed with "API Request" or "API Error"

## CORS Issues

If you're seeing errors like:

```
Access to fetch at '[API URL]' from origin '[YOUR SITE]' has been blocked by CORS policy
```

This is a CORS configuration issue. Solutions:

1. Ensure the backend API has CORS configured to allow requests from your domain
2. For local development, consider using a CORS proxy

## Timeout Issues

If requests are timing out, it could be:

1. The API server is under heavy load
2. Your internet connection is slow
3. The API operation is complex and needs more time

Try increasing the timeout in the API client configuration.

## Browser Issues

Sometimes browser extensions or settings can interfere with API requests:

1. Try in incognito/private browsing mode
2. Disable browser extensions
3. Clear browser cache and cookies

## Server-Side API Calls

If your issue is with server-side API calls:

1. Check server logs for errors
2. Verify server-side environment variables are set correctly
3. Check for network configuration issues on your server

## Contact Support

If you've tried all the steps above and still have issues, please contact support with:

1. The results of the diagnostic check
2. Screenshots of error messages
3. Description of what you were doing when the error occurred
4. Your browser and operating system information
5. Network environment information

You can run `window.apiDiagnostic.test()` and share the output with support.

## API Status Page

Check the API status page for known issues: https://status.zehmizeh.com 
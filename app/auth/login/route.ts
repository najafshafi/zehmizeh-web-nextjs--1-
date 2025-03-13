import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import axios from 'axios';

// Redirect GET requests from /auth/login to /login
export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  const redirectUrl = searchParams ? `/login?${searchParams}` : '/login';
  
  return NextResponse.redirect(new URL(redirectUrl, url.origin));
}

// Handle POST requests for API calls to /auth/login
export async function POST(request: Request) {
  console.log('Received login request');
  
  try {
    // Get API URL from environment variable
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API;
    if (!apiUrl) {
      console.error('API URL not configured');
      return NextResponse.json(
        { message: 'API configuration error', error: 'NEXT_PUBLIC_BACKEND_API is not set' },
        { status: 500 }
      );
    }

    console.log(`Using API URL: ${apiUrl}`);
    
    // Get request body
    const body = await request.json();
    console.log('Request payload:', { 
      email: body.email_id ? '****' : undefined, 
      has_password: !!body.password
    });
    
    // Set up a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      // Forward the request to the actual API
      const loginEndpoint = `${apiUrl}/auth/login`;
      console.log(`Forwarding to: ${loginEndpoint}`);
      
      const response = await axios.post(loginEndpoint, body, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });
      
      console.log('API response status:', response.status);
      
      // Return the API response
      return NextResponse.json(response.data, { 
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Content-Type': 'application/json'
        }
      });
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      console.error('Error during API request:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        return NextResponse.json(
          { message: 'API request timed out', error: 'Request took too long to complete' },
          { status: 504 }
        );
      }
      
      if (!error.response) {
        // Network error
        console.error('Network error details:', {
          code: error.code,
          message: error.message,
          stack: error.stack?.split('\n')[0]
        });
        
        return NextResponse.json(
          { message: 'Network error - Please check your connection', error: error.message },
          { status: 502 }
        );
      }
      
      // Return the error response from the API
      console.error('API error response:', {
        status: error.response?.status,
        data: error.response?.data
      });
      
      return NextResponse.json(error.response.data, { 
        status: error.response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error: any) {
    console.error('Unhandled error in login route:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
} 
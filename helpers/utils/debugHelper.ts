/**
 * ZehMizeh API Troubleshooting Utility
 * This module provides debugging functions for API connectivity issues.
 */

// Test the internet connection
export async function testConnection() {
  try {
    const online = navigator.onLine;
    console.log(`Browser reports online status: ${online ? 'Online' : 'Offline'}`);
    
    if (!online) {
      return {
        success: false,
        message: 'Browser reports that you are offline. Please check your internet connection.',
      };
    }
    
    const startTime = performance.now();
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
    });
    const endTime = performance.now();
    
    return {
      success: true,
      message: `Connected to the internet. Response time: ${Math.round(endTime - startTime)}ms`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to the internet: ${error instanceof Error ? error.message : String(error)}`,
      error,
    };
  }
}

// Test API configuration
export function testApiConfig() {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API;
  
  if (!apiUrl) {
    return {
      success: false,
      message: 'API URL is not configured. Set NEXT_PUBLIC_BACKEND_API in your environment variables.',
    };
  }
  
  try {
    // Validate URL format
    new URL(apiUrl);
    return {
      success: true,
      message: `API URL is correctly formatted: ${apiUrl}`,
      apiUrl,
    };
  } catch (error) {
    return {
      success: false,
      message: `API URL is not a valid URL: ${apiUrl}`,
      error,
      apiUrl,
    };
  }
}

// Test specific API endpoint
export async function testApiEndpoint(endpoint: string, isPost = false) {
  const { success, message, apiUrl } = testApiConfig();
  
  if (!success) {
    return { success, message };
  }
  
  try {
    const url = `${apiUrl}${endpoint}`;
    const startTime = performance.now();
    let response;
    
    if (isPost) {
      // For POST endpoint, just test with minimal payload
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ test: true }),
      });
    } else {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
    }
    
    const endTime = performance.now();
    
    return {
      success: true,
      message: `Connected to API endpoint: ${url} | Status: ${response.status} | Time: ${Math.round(endTime - startTime)}ms`,
      status: response.status,
      endpoint: url,
      responseTime: Math.round(endTime - startTime),
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to API endpoint: ${apiUrl}${endpoint}`,
      error: error instanceof Error ? error.message : String(error),
      endpoint: `${apiUrl}${endpoint}`,
    };
  }
}

// Get system diagnostic information
export function getSystemInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
    timestamp: new Date().toISOString(),
    onlineStatus: navigator.onLine ? 'Online' : 'Offline',
    deviceMemory: navigator.deviceMemory || 'unknown',
    nextEnv: process.env.NODE_ENV,
    apiUrl: process.env.NEXT_PUBLIC_BACKEND_API || 'Not configured',
  };
}

// Run a complete diagnostic check
export async function runDiagnostic() {
  console.group('ZehMizeh API Diagnostic Check');
  
  const systemInfo = getSystemInfo();
  console.log('System Information:', systemInfo);
  
  const connectionTest = await testConnection();
  console.log(`Internet Connection: ${connectionTest.success ? '✅' : '❌'} ${connectionTest.message}`);
  
  const apiConfig = testApiConfig();
  console.log(`API Configuration: ${apiConfig.success ? '✅' : '❌'} ${apiConfig.message}`);
  
  if (apiConfig.success) {
    const loginEndpoint = await testApiEndpoint('/auth/login', true);
    console.log(`Login Endpoint: ${loginEndpoint.success ? '✅' : '❌'} ${loginEndpoint.message}`);
    
    const userEndpoint = await testApiEndpoint('/user/get');
    console.log(`User Endpoint: ${userEndpoint.success ? '✅' : '❌'} ${userEndpoint.message}`);
  }
  
  console.groupEnd();
  
  return {
    systemInfo,
    connectionTest,
    apiConfig,
    timestamp: new Date().toISOString(),
  };
}

// Export a global diagnostic function for use in browser console
if (typeof window !== 'undefined') {
  (window as any).apiDiagnostic = {
    test: runDiagnostic,
    connection: testConnection,
    apiConfig: testApiConfig,
    endpoint: testApiEndpoint,
    systemInfo: getSystemInfo,
  };
  
  console.log(
    '%c ZehMizeh API Diagnostic Tool Available',
    'background: #f8f9fa; color: #0d6efd; padding: 5px; border-radius: 3px; font-weight: bold;'
  );
  console.log(
    'Use window.apiDiagnostic.test() to run a full diagnostic check.'
  );
} 
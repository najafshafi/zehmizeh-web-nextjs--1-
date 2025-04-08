"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/helpers/http/index";
import {
  getToken,
  getTokenTimeRemaining,
  isTokenExpired,
  forceTokenExpiration,
} from "@/helpers/services/auth";
import { AxiosError } from "axios";

export default function TokenTestPage() {
  const [tokenInfo, setTokenInfo] = useState({
    token: "",
    refreshToken: "",
    timeRemaining: null as number | null,
    isExpired: false,
  });

  const [testCallResult, setTestCallResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Update token info periodically
  useEffect(() => {
    const updateTokenInfo = () => {
      setTokenInfo({
        token: getToken() || "No token found",
        refreshToken:
          localStorage.getItem("refresh_token") || "No refresh token found",
        timeRemaining: getTokenTimeRemaining(),
        isExpired: isTokenExpired(),
      });
    };

    // Update immediately and then every second
    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to make a test API call
  const makeTestApiCall = async () => {
    setIsLoading(true);
    try {
      // Call a secure endpoint that requires authentication
      const response = await apiClient.get("/user/get");
      setTestCallResult(JSON.stringify(response.data, null, 2));
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      setTestCallResult(
        `Error: ${axiosError.message}\n${JSON.stringify(axiosError.response?.data || {}, null, 2)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to force token expiration
  const expireToken = () => {
    forceTokenExpiration();
  };

  return (
    <div className="container mx-auto py-10 px-4 pt-[130px] bg-secondary flex flex-col ">
      <h1 className="text-3xl font-bold mb-6">Token Refresh Test Page</h1>

      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Current Token Information
        </h2>
        <div className="space-y-2">
          <p>
            <strong>Token:</strong> {tokenInfo.token.substring(0, 20)}...
          </p>
          <p>
            <strong>Refresh Token:</strong>{" "}
            {tokenInfo.refreshToken.substring(0, 20)}...
          </p>
          <p>
            <strong>Time Remaining:</strong>{" "}
            {tokenInfo.timeRemaining !== null
              ? `${tokenInfo.timeRemaining} seconds`
              : "Unknown"}
          </p>
          <p>
            <strong>Is Expired:</strong> {tokenInfo.isExpired ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={makeTestApiCall}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Make Test API Call"}
        </button>

        <button
          onClick={expireToken}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
        >
          Force Token Expiration (5 seconds)
        </button>
      </div>

      {testCallResult && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">API Call Result</h2>
          <pre className="bg-white p-4 rounded overflow-auto max-h-96">
            {testCallResult}
          </pre>
        </div>
      )}

      <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          How to Test Token Refresh
        </h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Make a test API call to verify your current authentication</li>
          <li>
            Click &quot;Force Token Expiration&quot; to simulate an expired
            token
          </li>
          <li>Wait 5 seconds until the token expires</li>
          <li>
            Make another API call - the system should automatically refresh your
            token
          </li>
          <li>
            Check the &quot;Current Token Information&quot; section to see if a
            new token was issued
          </li>
        </ol>
      </div>
    </div>
  );
}

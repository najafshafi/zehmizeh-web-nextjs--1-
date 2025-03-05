"use client";

import React from "react";

const Spinner: React.FC = () => (
  <div
    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-gray-700 dark:text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

export default Spinner;
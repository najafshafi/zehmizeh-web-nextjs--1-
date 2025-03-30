export const matchStaticRoutes = (
  routePaths: string[],
  locationPathName: string
) => {
  return routePaths.includes(locationPathName);
};

export const matchDynamicRoutes = (
  routePaths: string[],
  locationPathName: string
) => {
  return routePaths.some((routePath) => {
    return locationPathName.includes(routePath);
  });
};

// Helper to check if a path is a freelancer profile route
export const isFreelancerProfileRoute = (path: string): boolean => {
  // console.log("isFreelancerProfileRoute checking path:", path);

  // First check for the standard pattern
  const standardPattern = /^\/freelancer\/[^\/]+$/;
  const isStandard = standardPattern.test(path);

  // Also check for other possible patterns
  const altPattern = /\/freelancer\/[^\/]+/;
  const isAlt = altPattern.test(path);

  // console.log("Standard match:", isStandard, "Alt match:", isAlt);

  // Return true for any pattern that matches to be more permissive
  return isStandard || isAlt;
};

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

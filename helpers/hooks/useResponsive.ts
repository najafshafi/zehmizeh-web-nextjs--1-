import { useMediaQuery } from 'react-responsive';
function useResponsive() {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  const isIpadPro = useMediaQuery({ minWidth: 991, maxWidth: 1250 });
  const isIpadProOnlyMaxWidth = useMediaQuery({ maxWidth: 1250 });
  const isLaptop = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  return {
    isDesktop,
    isTablet,
    isMobile,
    isNotMobile,
    isIpadPro,
    isIpadProOnlyMaxWidth,
    isLaptop,
  };
}

export const breakpoints = {
  mobile: 'screen and (max-width: 767px)',
  tablet: 'screen and (max-width: 991px)',
  desktop: 'screen and (min-width: 992px)',
  laptop: 'screen and (max-width:1250px)',
};

export const gridBreakpoints = {
  xs: 'screen and (max-width: 0)',
  sm: 'screen and (max-width: 576px)',
  md: 'screen and (max-width: 768px)',
  lg: 'screen and (max-width: 992px)',
  xl: 'screen and (max-width: 1200px)',
  xxl: 'screen and (max-width: 1400px)',
};

export default useResponsive;

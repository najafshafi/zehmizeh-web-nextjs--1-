import { useEffect } from 'react';

type TuseWebSpellChecker = (
  condition?: boolean,
  dependecies?: unknown[]
) => void;

export const useWebSpellChecker: TuseWebSpellChecker = (
  condition = true,
  dependecies = []
) => {
  useEffect(() => {
    const domElement = document.querySelector('#wsc-check');
    if (
      !condition ||
      !domElement ||
      !process.env.REACT_APP_WSC_WPROOFREADER_SERVICE_ID ||
      process.env.REACT_APP_WSC_WPROOFREADER_SERVICE_ID === 'null'
    )
      return;
    window?.WEBSPELLCHECKER?.init?.({
      container: domElement,
    });

    return () => {
      window?.WEBSPELLCHECKER?.destroyAll?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependecies);
};

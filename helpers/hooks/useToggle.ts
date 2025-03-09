import { useState } from 'react';

function useToggle() {
  const [value, setValue] = useState(false);
  return {
    value,
    toggle: () => setValue(!value),
    close: () => setValue(false),
  };
}
export default useToggle;

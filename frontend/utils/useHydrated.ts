import React from "react";

/**
 * This is needed to prevent hydration issues
 * Workaround due to how zustand stores work asynchronously
 * https://github.com/pmndrs/zustand/issues/324
 * @returns
 */
export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = React.useState<boolean>(false);

  React.useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Update the state with the current value
    const updateMatches = () => {
      setMatches(media.matches);
    };

    // Set the initial value
    updateMatches();

    // Add the listener for subsequent changes
    media.addEventListener('change', updateMatches);

    // Remove the listener when the component unmounts
    return () => {
      media.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
}

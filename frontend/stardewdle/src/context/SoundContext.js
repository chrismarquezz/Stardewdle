import { createContext, useContext, useState } from "react";

// Create context
const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}

// Custom hook to use in any component
export function useSound() {
  return useContext(SoundContext);
}

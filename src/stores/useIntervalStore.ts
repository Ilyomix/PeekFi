import { create } from 'zustand';

// Define the state and actions for the interval store
type IntervalState = {
  selectedInterval: string;
  setSelectedInterval: (interval: string) => void;
};

/**
 * Custom hook to manage the selected interval state.
 * The state is persisted using local storage.
 */
const useIntervalStore = create<IntervalState>()((set) => ({
  selectedInterval: '1D', // Default interval
  /**
   * Sets the selected interval.
   * @param {string} interval - The new interval to set.
   */
  setSelectedInterval: (interval) => set({ selectedInterval: interval })
}));

export default useIntervalStore;

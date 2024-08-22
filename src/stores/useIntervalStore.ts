import { persist } from 'zustand/middleware';
import { create } from 'zustand';

type IntervalState = {
  selectedInterval: string;
  setSelectedInterval: (interval: string) => void;
};

const useIntervalStore = create<IntervalState>()(
  persist(
    (set) => ({
      selectedInterval: '1d',
      setSelectedInterval: (interval) => set({ selectedInterval: interval })
    }),
    {
      name: 'interval-storage',
    }
  )
);

export default useIntervalStore;

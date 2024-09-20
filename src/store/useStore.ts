import { PersistStorage, persist } from 'zustand/middleware';

import { create } from 'zustand';

interface Schedule {
  name: string;
  isSupervisor: boolean;
  selectedDates: Date[];
  formattedDates: string[];
}

interface Store {
  schedules: Schedule[];
  addSchedule: (schedule: Schedule) => void;
}

const customSessionStorage: PersistStorage<Store> = {
  getItem: (name) => {
    const value = sessionStorage.getItem(name);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },
  setItem: (name, value) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name);
  },
};

const useStore = create<Store>()(
  persist(
    (set) => ({
      schedules: [],
      addSchedule: (schedule) =>
        set((state) => ({
          schedules: [...state.schedules, schedule],
        })),
    }),
    {
      name: 'schedules-storage',
      storage: customSessionStorage,
    }
  )
);

export default useStore;

import { PersistStorage, persist } from 'zustand/middleware';

import { create } from 'zustand';

interface Schedule {
  name: string;
  isSupervisor: boolean;
  selectedDates: string[];
  formattedDates: string[];
}

interface Store {
  schedules: Schedule[];
  month: string;
  addSchedule: (schedule: Schedule) => void;
  setMonth: (month: string) => void;
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
      month: '',
      addSchedule: (schedule) => {
        const selectedDates = schedule.formattedDates
          .map((date) => {
            const parts = date.match(/(\d+)월\s(\d+)일/);
            if (parts) {
              const month = parseInt(parts[1], 10) - 1;
              const day = parseInt(parts[2], 10);

              const dateObj = new Date(new Date().getFullYear(), month, day);
              dateObj.setDate(dateObj.getDate() + 1);

              const formattedDate = dateObj.toISOString().split('T')[0];
              return formattedDate;
            }
            return null;
          })
          .filter((date) => date !== null) as string[];

        set((state) => ({
          schedules: [...state.schedules, { ...schedule, selectedDates }],
        }));
      },
      setMonth: (month) => set({ month }),
    }),
    {
      name: 'schedules-storage',
      storage: customSessionStorage,
    }
  )
);

export default useStore;

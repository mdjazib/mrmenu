import { create } from 'zustand'

export const useStore = create((set) => ({
    route: "/",
    setRoute: (value) => set(() => ({ route: value })),
}))
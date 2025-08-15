import { create } from 'zustand'

export const useStore = create((set) => ({
    route: { href: "/", title: "" },
    setRoute: (value) => set(() => ({ route: value })),
}))
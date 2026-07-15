import { create } from "zustand";
import api from "../api/axiosClient";

const useAuthStore = create((set, get) => ({
    email: "",
    setEmail: (email) => set({ email }),

    password: "",
    setPassword: (password) => set({ password }),

    loading: false,
    error: null,

    user: JSON.parse(localStorage.getItem("authUser") || "null"),

    clearForm: () => {
        set({
            password: "",
            email: "",
            error: null,
        });
    },

    login: async () => {
        set({ loading: true, error: null });
        try {
            const { email, password } = get();

            const response = await api.post(
                "/user/authUser",
                { email, password }
            );

            const { accessToken, user } = response.data.res;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("authUser", JSON.stringify(user));

            set({ error: null, user });
            return true;
        } catch (error) {
            if (error.response) {
                set({ error: error.response.data.error || "Error en el login" });
            } else if (error.request) {
                set({ error: "No se recibió respuesta del servidor" });
            } else {
                set({ error: error.message });
            }
            return false;
        } finally {
            set({ loading: false });
        }
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authUser");
        set({ user: null });
    },
}));

export default useAuthStore;

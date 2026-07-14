import { create } from "zustand";
import api from "../api/axiosClient";

const useAuthStore = create((set, get) => ({
    email: "",
    setEmail: (email) => set({ email }),

    password: "",
    setPassword: (password) => set({ password }),

    loading: false,
    error: null,

    clearForm: () => {
        console.log("clearForm ejecutado desde el authStore");
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
            console.log("Intentando login con:", { email, password });

            const response = await api.post(
                "/user/authUser",

                {
                    email,
                    password,
                }
            );

            console.log("Login exitoso:", response.data);
            set({ error: null });
        } catch (error) {
            if (error.response) {
                console.error("Error en el login:", error.response.data);
                set({ error: error.response.data.error || "Error en el login" });
            } else if (error.request) {
                console.error(
                    "Error en el login: No se recibió respuesta del servidor"
                );
                set({ error: "No se recibió respuesta del servidor" });
            } else {
                console.error("Error en el login:", error.message);
                set({ error: error.message });
            }
        } finally {
            set({ loading: false });
        }
    },
}));

export default useAuthStore;
import { create } from "zustand";
import api from "../../api/axiosClient";

const useServiceStore = create((set, get) => ({
  services: [],
  loading: false,
  error: null,

  serviceList: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/service/showServices", filters);

      set({ services: response.data, error: null });
    } catch (error) {
      if (error.response) {
        console.error("Error al obtener servicios:", error.response.data);
        set({ error: error.response.data.error || "Error al obtener servicios" });
      } else if (error.request) {
        console.error("Error al obtener servicios: No se recibió respuesta del servidor");
        set({ error: "No se recibió respuesta del servidor" });
      } else {
        console.error("Error al obtener servicios:", error.message);
        set({ error: error.message });
      }
    } finally {
      set({ loading: false });
    }
  },

  postService: async (name, images, category, description, brandId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(
        "/service/newService",
        { name, images, category, description, brandId }
      );

      set((state) => ({
        services: [...state.services, response.data],
        error: null,
      }));
      console.log("Servicio posteado exitosamente");
    } catch (error) {
      if (error.response) {
        console.error("Error al postear Servicio:", error.response.data);
        set({
          error: error.response.data.error || "Error al postear Servicio",
        });
      } else if (error.request) {
        console.error(
          "Error al postear Servicio: No se recibió respuesta del servidor"
        );
        set({ error: "No se recibió respuesta del servidor" });
      } else {
        console.error("Error al postear Servicio:", error.message);
        set({ error: error.message });
      }
    } finally {
      set({ loading: false });
    }
  },

  updateService: async (id, name, images, category, description, brandId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(
        `/service/updateService/${id}`,
        { name, images, category, description, brandId }
      );

      set((state) => ({
        services: state.services.map((service) =>
          service.id === id ? response.data : service
        ),
        error: null,
      }));
      console.log("Servicio modificado exitosamente");
    } catch (error) {
      if (error.response) {
        console.error("Error al modificar Servicio:", error.response.data);
        set({
          error: error.response.data.error || "Error al modificar Servicio",
        });
      } else if (error.request) {
        console.error(
          "Error al modificar Servicio: No se recibió respuesta del servidor"
        );
        set({ error: "No se recibió respuesta del servidor" });
      } else {
        console.error("Error al modificar Servicio:", error.message);
        set({ error: error.message });
      }
    } finally {
      set({ loading: false });
    }
  },

  deleteService: async (id) => {
    set({ loading: true, error: null });
    try {
      console.log("Intentando eliminar este Servicio");

      await api.delete(`/service/deleteService/${id}`);

      set((state) => ({
        services: state.services.filter((service) => service.id !== id),
        error: null,
      }));
      console.log("Servicio eliminado exitosamente");
    } catch (error) {
      if (error.response) {
        console.error("Error al eliminar este Servicio:", error.response.data);
        set({ error: error.response.data.error || "Error en el login" });
      } else if (error.request) {
        console.error(
          "Error al eliminar este Servicio: No se recibió respuesta del servidor"
        );
        set({ error: "No se recibió respuesta del servidor" });
      } else {
        console.error("Error al eliminar este Servicio:", error.message);
        set({ error: error.message });
      }
    } finally {
      set({ loading: false });
    }
  },
}));

export default useServiceStore;

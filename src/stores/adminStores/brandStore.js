import { create } from "zustand";
import axios from "axios";

const useBrandStore = create((set, get) => ({
  brands: [],
  loading: false,
  error: null,

  brandList: async () => {
    set({ loading: true, error: null });
    try {
      console.log("Intentando obtener las Marcas");

      const response = await axios.get(
        "http://localhost:3000/brand/showBrands"
      );

      set({ brands: response.data, error: null });
      console.log("Marcas obtenidos exitosamente");
    } catch (error) {
      if (error.response) {
        console.error("Error al obtener Marcas:", error.response.data);
        set({ error: error.response.data.error || "Error en el login" });
      } else if (error.request) {
        console.error(
          "Error al obtener Marcas: No se recibió respuesta del servidor"
        );
        set({ error: "No se recibió respuesta del servidor" });
      } else {
        console.error("Error al obtener Marcas:", error.message);
        set({ error: error.message });
      }
    } finally {
      set({ loading: false });
    }
  },

  postBrand: async (name, logo) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('logo', logo);

      const response = await axios.post(
        "http://localhost:3000/brand/newBrand",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        brands: [...state.brands, response.data],
        error: null,
      }));
      console.log("Marca posteada exitosamente");
    } catch (error) {
      if (error.response) {
        console.error("Error al postear Marca:", error.response.data);
        set({ error: error.response.data.error || "Error al postear Marca" });
      } else if (error.request) {
        console.error(
          "Error al postear Marca: No se recibió respuesta del servidor"
        );
        set({ error: "No se recibió respuesta del servidor" });
      } else {
        console.error("Error al postear Marca:", error.message);
        set({ error: error.message });
      }
    } finally {
      set({ loading: false });
    }
  },

  deleteBrand: async (id) => {
    set({ loading: true, error: null });
    try {
      console.log("Intentando eliminar esta Marca");

      await axios.delete(`http://localhost:3000/brand/deleteBrand/${id}`);

      set((state) => ({
        brands: state.brands.filter((brand) => brand.id !== id),
        error: null,
      }));
      console.log("Marca eliminada exitosamente");
    } catch (error) {
      if (error.response) {
        console.error("Error al eliminar esta Marca:", error.response.data);
        set({ error: error.response.data.error || "Error al eliminar Marca" });
      } else if (error.request) {
        console.error(
          "Error al eliminar esta Marca: No se recibió respuesta del servidor"
        );
        set({ error: "No se recibió respuesta del servidor" });
      } else {
        console.error("Error al eliminar esta Marca:", error.message);
        set({ error: error.message });
      }
    } finally {
      set({ loading: false });
    }
  },
}));

export default useBrandStore;

import { create } from "zustand";
import api from "../../api/axiosClient";

const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  brands: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: true,

  getProducts: async (page = 1, limit = 10) => {
    try {
      const res = await api.post(`/product/showProducts?page=${page}&limit=${limit}`);
      const data = res.data;
  
      set((state) => ({
        products: page === 1 ? data.products : [...state.products, ...data.products],
        hasMore: data.hasMore,
        currentPage: page,
      }));
    } catch (err) {
      console.error("Error al obtener productos:", err);
      set({ error: "Error al obtener productos." });
    }
  },

  productList: async (filters = {}, page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(
        `/product/showProducts?page=${page}&limit=${limit}`,
        filters
      );

      set({
        products: response.data.products || [],
        hasMore: response.data.hasMore,
        error: null,
      });
      console.log({"Productos obtenidos exitosamente": response.data.products});
    } catch (error) {
      if (error.response) {
        console.error("Error al obtener productos:", error.response.data);
        set({ error: error.response.data.error || "Error en el login" });
      } else if (error.request) {
        console.error(
          "Error al obtener productos: No se recibió respuesta del servidor"
        );
        set({ error: "No se recibió respuesta del servidor" });
      } else {
        console.error("Error al obtener productos:", error.message);
        set({ error: error.message });
      }
    } finally {
      set({ loading: false });
    }
  },

  getCategories: async () => {
    const { products } = get();
  
    // Verifica si los productos ya están disponibles
    if (!products || products.length === 0) {
      console.warn("No products found. Waiting for products to be loaded...");
      return;
    }
  
    // Extrae categorías únicas usando un Set
    const categories = [...new Set(products.map((product) => product.category))];
  
    console.log("Extracted unique categories:", categories);
  
    // Actualiza el estado con las categorías únicas
    set({ categories });
  },
  
  

  postProduct: async (name, images, category, description, brandId) => {
    set({ loading: true, error: null });
    try {
      const response = 
      await api.post("/product/newProduct", {
        name,
        images: Array.isArray(images) ? images : [],
        category,
        description,
        brandId,
      });

      set((state) => ({
        products: [...state.products, response.data],
        error: null,
      }));
      console.log("Producto posteado exitosamente");
    } catch (error) {
      if (error.response) {
        console.error("Error al postear Producto:", error.response.data);
        set({
          error: error.response.data.error || "Error al postear Producto",
        });
      } else if (error.request) {
        console.error(
          "Error al postear Producto: No se recibió respuesta del servidor"
        );
        set({ error: "No se recibió respuesta del servidor" });
      } else {
        console.error("Error al postear Producto:", error.message);
        set({ error: error.message });
      }
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, name, images, category, description, brandId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(
        `/product/updateProduct/${id}`,
        { name, images, category, description, brandId }
      );

      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? response.data : product
        ),
        error: null,
      }));
      console.log("Producto modificado exitosamente");
    } catch (error) {
      if (error.response) {
        console.error("Error al modificar Producto:", error.response.data);
        set({
          error: error.response.data.error || "Error al modificar Producto",
        });
      } else if (error.request) {
        console.error(
          "Error al modificar Producto: No se recibió respuesta del servidor"
        );
        set({ error: "No se recibió respuesta del servidor" });
      } else {
        console.error("Error al modificar Producto:", error.message);
        set({ error: error.message });
      }
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      console.log("Intentando eliminar este Producto");

      await api.delete(`/product/deleteProduct/${id}`);

      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        error: null,
      }));
      console.log("Producto eliminado exitosamente");
    } catch (error) {
      if (error.response) {
        console.error("Error al eliminar este Producto:", error.response.data);
        set({ error: error.response.data.error || "Error en el login" });
      } else if (error.request) {
        console.error(
          "Error al eliminar este Producto: No se recibió respuesta del servidor"
        );
        set({ error: "No se recibió respuesta del servidor" });
      } else {
        console.error("Error al eliminar este Producto:", error.message);
        set({ error: error.message });
      }
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProductStore;

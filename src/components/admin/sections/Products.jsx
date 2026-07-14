import React, { useState, useEffect } from "react";
import { FaPen, FaTrashAlt, FaTimes } from "react-icons/fa";
import useProductStore from "../../../stores/adminStores/productStore";
import useBrandStore from "../../../stores/adminStores/brandStore";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import CloudinaryUpload from "../../common/CloudinaryUpload";
import styles from "./Products.module.css";
import { useInView } from 'react-intersection-observer';


const cld = new Cloudinary({ cloud: { cloudName: "alphacode" } });

function Products() {
  const {
    products,
    getProducts,
    hasMore,
    currentPage,
    postProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  } = useProductStore();

  const [ref, inView] = useInView({
    threshold: 1,
  });

  const { brands, brandList } = useBrandStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [name, setName] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [category, setCategory] = useState("");
  const [brandId, setBrandId] = useState("");
  const [description, setDescription] = useState("");
  const [uploadMode, setUploadMode] = useState("upload");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    getProducts(1);
  }, []);

  useEffect(() => {
    if (inView && hasMore) {
      getProducts(currentPage + 1);
    }
  }, [inView, hasMore, currentPage]);

  const handleAddProduct = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    brandList();
    resetForm();
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setName(product.name);
      setUploadedImages(product.images || []);
      setCategory(product.category);
      setBrandId(product.brandId);
      setDescription(product.description);
      setSelectedProductId(id);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setUploadedImages([]);
    setName("");
    setCategory("");
    setDescription("");
    setImageUrl("");
  };

  const handleDelete = (id) => deleteProduct(id);

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSaveProduct = async () => {
    if (name.trim() && uploadedImages.length > 0 && category && description && brandId) {
      const imageUrls = uploadedImages.map((id) =>
        typeof id === "string" && id.startsWith("http")
          ? id
          : `https://res.cloudinary.com/alphacode/image/upload/${id}`
      );

      const formattedName = capitalize(name);
      const formattedDescription = capitalize(description);

      if (isEditing && selectedProductId) {
        await updateProduct(selectedProductId, formattedName, imageUrls, category, formattedDescription, brandId);
      } else {
        await postProduct(formattedName, imageUrls, category, formattedDescription, brandId);
      }

      handleCloseModal();
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const getTransformedImage = (imageId) =>
    cld.image(imageId).format("auto").quality("auto").resize(auto().gravity(autoGravity()).width(500).height(500));

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Productos</h2>
        <div className={styles.addProduct}>
          <button onClick={handleAddProduct} className={styles.addBtn}>Añadir</button>
        </div>
      </div>

      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <div className={styles.itemImages}>
              {product.images?.slice(0, 2).map((img, i) => (
                <img key={i} src={img} alt={product.name} className={styles.itemThumb} />
              ))}
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{product.name}</span>
              <span className={styles.itemCategory}>{product.category}</span>
            </div>
            <div className={styles.actions}>
              <button onClick={() => handleEdit(product.id)} className={styles.editBtn} aria-label="Editar producto"><FaPen /></button>
              <button onClick={() => handleDelete(product.id)} className={styles.deleteBtn} aria-label="Eliminar producto"><FaTrashAlt /></button>
            </div>
          </div>
        ))}
          {hasMore && <div ref={ref} className={styles.scrollLoader}>Cargando más...</div>}

      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button onClick={handleCloseModal} className={styles.closeBtn}><FaTimes /></button>
            <h2>{isEditing ? "Editar Producto" : "Ingresar Producto"}</h2>

            <label>Nombre del Producto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />

            <label>Imágenes (máximo 5)</label>
            <div className={styles.uploadModeToggle}>
              <button onClick={() => setUploadMode("upload")} className={uploadMode === "upload" ? styles.activeToggle : ""}>Subir archivo</button>
              <button onClick={() => setUploadMode("url")} className={uploadMode === "url" ? styles.activeToggle : ""}>Ingresar URL</button>
            </div>

            {uploadMode === "upload" && (
              <div className="cloudinary-dropzone">
                <CloudinaryUpload uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />
              </div>
            )}

            {uploadMode === "url" && (
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Pega una URL de Cloudinary"
                  className={styles.input}
                />
                <button
                  onClick={() => {
                    if (imageUrl) {
                      setUploadedImages([...uploadedImages, imageUrl]);
                      setImageUrl("");
                    }
                  }}
                  className={styles.addBtn}
                >
                  Agregar
                </button>
              </div>
            )}

            <label>Ingresar Categoría</label>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option value="Tazas y Aros">Tazas y Aros</option>
              <option value="Capuchones">Capuchones</option>
              <option value="Deflectores">Deflectores</option>
              <option value="Capuchones">Capuchones</option>
              <option value="Bocinas">Bocinas</option>
              <option value="Accesorios Varios">Accesorios Varios</option>
              <option value="Protector de faros">Protector de faros</option>
            </select>

            <label>Marca</label>
            <select
              className={styles.select}
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
            >
              <option value="">Seleccione...</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>

            <label>Descripción del Producto</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <button onClick={handleSaveProduct} className={styles.saveBtn}>
              {isEditing ? "Actualizar" : "Aceptar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;

import React, { useState, useEffect } from "react";
import { FaPen, FaTrashAlt, FaTimes } from "react-icons/fa";
import useBrandStore from "../../../stores/adminStores/brandStore";
import styles from "./Brands.module.css";

function Brands() {
  const {
    brands,
    brandList,
    postBrand,
    updateBrand,
    deleteBrand,
    loading,
    error,
  } = useBrandStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  useEffect(() => {
    brandList();
  }, [brandList]);

  const handleDelete = (id) => {
    deleteBrand(id);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleAddBrand = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const brand = brands.find((b) => b.id === id);
    if (brand) {
      setNewBrand(brand.name);
      setSelectedImage(null);
      setImageBase64(brand.logo);
      setIsModalOpen(true);
      setIsEditing(true);
      setSelectedBrandId(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setImageBase64("");
    setNewBrand("");
  };

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error al convertir la imagen:", error);
    };
  };

  const handleSaveBrand = async () => {
    if (newBrand.trim()) {
      if (isEditing && selectedBrandId) {
        await updateBrand(selectedBrandId, newBrand, imageBase64);
      } else {
        await postBrand(newBrand, imageBase64); // imageBase64 puede ser vacío y está bien
      }
      setNewBrand("");
      setImageBase64("");
      setSelectedImage(null);
      setSelectedBrandId(null);
      setIsModalOpen(false);
    } else {
      alert("Por favor, ingrese un nombre de marca.");
    }    
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      convertToBase64(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageBase64("");
  };

  if (loading) {
    return <div>Cargando marcas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Marcas</h2>
        <div className={styles.addbrand}>
          <button onClick={handleAddBrand} className={styles.addBtn}>
            Añadir
          </button>
        </div>
      </div>
      <div className={styles.brandList}>
        {brands.map((brand) => (
          <div key={brand.id} className={styles.brandItem}>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{brand.name}</span>
            </div>
            <div className={styles.actions}>
              <button
                onClick={() => handleEdit(brand.id)}
                className={styles.editBtn}
              >
                <FaPen />
              </button>
              <button
                onClick={() => handleDelete(brand.id)}
                className={styles.deleteBtn}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button onClick={handleCloseModal} className={styles.closeBtn}>
              <FaTimes />
            </button>
            <h2>{isEditing ? "Editar Marca" : "Ingresar Marca"}</h2>
            <label>Nombre de la Marca</label>
            <input
              type="text"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              className={styles.input}
            />

            {/* <label>Ingresar Logo</label>
            <div className={styles.uploadWrapper}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className={styles.uploadInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" className={styles.uploadBtn}>
                Seleccione logo
              </label>
            </div>

            {selectedImage && (
              <div className={styles.preview}>
                <p>Vista previa:</p>
                <div className={styles.imagePreviewContainer}>
                  <div className={styles.previewItem}>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt={`Vista previa`}
                      style={{ width: "100px", height: "100px" }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      className={styles.removeImageBtn}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              </div>
            )} */}
            <button onClick={handleSaveBrand} className={styles.saveBtn}>
            {isEditing ? "Actualizar" : "Aceptar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Brands;

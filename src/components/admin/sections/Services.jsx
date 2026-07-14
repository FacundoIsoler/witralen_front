import React, { useState, useEffect } from "react";
import { FaPen, FaTrashAlt, FaTimes } from "react-icons/fa";
import useServiceStore from "../../../stores/adminStores/serviceStore";
import useBrandStore from "../../../stores/adminStores/brandStore";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";
import styles from "./Services.module.css";

const cld = new Cloudinary({
  cloud: {
    cloudName: "alphacode",
  },
});

function Services() {
  const {
    services,
    serviceList,
    postService,
    updateService,
    deleteService,
    loading,
    error,
  } = useServiceStore();
  const { brands, brandList } = useBrandStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [name, setName] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");

  useEffect(() => {
    serviceList();
  }, [serviceList]);

  const handleAddService = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    brandList();
    resetForm();
  };

  const handleEdit = (id) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      setName(service.name);
      setUploadedImages(service.images || []); 
      setCategory(service.category);
      setBrandId(service.brandId);
      setDescription(service.description);
      setSelectedServiceId(id);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUploadedImages([]);
    setName("");
    setCategory("");
    setDescription("");
  };

  const resetForm = () => {
    setUploadedImages([]);
    setName("");
    setCategory("");
    setDescription("");
  };

  const handleDelete = (id) => {
    deleteService(id);
  };

  const handleSaveService = async () => {
    if (
      (name.trim() &&
        (uploadedImages?.length || 0) > 0 &&
        category &&
        description,
      brandId)
    ) {
      const imageUrls = uploadedImages.map(
        (publicId) =>
          `https://res.cloudinary.com/alphacode/image/upload/${publicId}`
      );

      if (isEditing && selectedServiceId) {
        await updateService(
          selectedServiceId,
          name,
          imageUrls,
          category,
          description,
          brandId
        );
      } else {
        await postService(name, imageUrls, category, description, brandId);
      }

      handleCloseModal();
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const uploadPromises = files
      .slice(0, 5 - (uploadedImages?.length || 0))
      .map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Witralen");

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/alphacode/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();
          return data.public_id; // Guardar solo el `public_id` de la imagen
        } catch (error) {
          console.error("Error al cargar la imagen:", error);
          return null;
        }
      });

    const newImageIds = await Promise.all(uploadPromises);
    setUploadedImages((prev) => [
      ...prev,
      ...newImageIds.filter((id) => id !== null),
    ]);
  };

  // Generar una imagen transformada para mostrar en el frontend
  const getTransformedImage = (imageId) => {
    return cld
      .image(imageId)
      .format("auto") // Optimiza formato
      .quality("auto") // Optimiza calidad
      .resize(auto().gravity(autoGravity()).width(500).height(500)); // Redimensiona y auto-corta
  };

  if (loading) {
    return <div>Cargando servicios...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Servicios</h2>
        <div className={styles.addService}>
          <button onClick={handleAddService} className={styles.addBtn}>
            Añadir
          </button>
        </div>
      </div>
      <div className={styles.serviceList}>
        {services.map((service) => (
          <div key={service.id} className={styles.serviceItem}>
            <div className={styles.itemImages}>
              {service.images?.slice(0, 2).map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={service.name} className={styles.itemThumb} />
              ))}
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{service.name}</span>
              <span className={styles.itemCategory}>{service.category}</span>
            </div>
            <div className={styles.actions}>
              <button
                onClick={() => handleEdit(service.id)}
                className={styles.editBtn}
                aria-label="Editar servicio"
              >
                <FaPen />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className={styles.deleteBtn}
                aria-label="Eliminar servicio"
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
            <h2>{isEditing ? "Editar Servicio" : "Ingresar Servicio"}</h2>
            <label>Nombre del Servicio</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />

            <label>Ingresar Imágenes (máximo 5)</label>
            <div className={styles.uploadWrapper}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className={styles.uploadInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" className={styles.uploadBtn}>
                Seleccione imágenes
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div className={styles.preview}>
                <p>Vista previa:</p>
                <div className={styles.imagePreviewContainer}>
                  {uploadedImages.map((imageId, index) => (
                    <div key={index} className={styles.previewItem}>
                      <AdvancedImage
                        cldImg={getTransformedImage(imageId)}
                        alt={`Vista previa ${index}`}
                        style={{ width: "100px", height: "100px" }}
                      />
                      <button
                        onClick={() =>
                          setUploadedImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className={styles.removeImageBtn}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label>Ingresar Categoría</label>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option value="categoria1">Categoría 1</option>
              <option value="categoria2">Categoría 2</option>
            </select>

            <label>Marca relacionada</label>
            <select
              className={styles.select}
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
            >
              <option value="">Seleccione...</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <label>Descripción del Servicio</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <button onClick={handleSaveService} className={styles.saveBtn}>
              {isEditing ? "Actualizar" : "Aceptar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;

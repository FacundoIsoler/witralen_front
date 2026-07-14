import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import SearchBar from '../searchBar/SearchBar';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
    const location = useLocation();
    const { product } = location.state || {}; 

    const [selectedImage, setSelectedImage] = useState(
        Array.isArray(product?.images) ? product.images[0] : product?.image || 'https://via.placeholder.com/300'
    );

    if (!product) {
        return <div>Producto no encontrado</div>;
    }

    return (
        <div className={styles.mainScreen}>
            <Sidebar />
            <div className={styles.content}>
                <div className={styles.detailContainer}>
                    <div className={styles.leftSection}>
                        {/* Imagen principal */}
                        <img
                            className={styles.mainImage}
                            src={selectedImage}
                            alt={product.name}
                        />
                        <div className={styles.brandContainer}>
                            <span className={styles.brandLabel}>Marca</span>
                            <span className={styles.brandName}>{product.brand?.name || 'N/A'}</span>
                        </div>
                    </div>
                    <div className={styles.rightSection}>
                        <h2 className={styles.subtitle}>Descripción</h2>
                        <p className={styles.description}>{product.description}</p>
                    </div>
                    {/* Sección de miniaturas */}
                    <div className={styles.thumbnailSection}>
                        {(product.images || []).map((img, index) => (
                            <img
                                key={index}
                                className={`${styles.thumbnail} ${selectedImage === img ? styles.activeThumbnail : ''
                                    }`}
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

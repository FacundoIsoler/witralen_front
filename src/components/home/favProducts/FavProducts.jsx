import { useNavigate } from 'react-router-dom';
import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "./FavProducts.module.css";
import useProductStore from "../../../stores/adminStores/productStore";

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3, slidesToSlide: 3 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2, slidesToSlide: 2 },
    mobile: { breakpoint: { max: 767, min: 0 }, items: 1, slidesToSlide: 1 }
};

const CustomLeftArrow = ({ onClick }) => (
    <div className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`} onClick={onClick}>
        {"<"}
    </div>
);

const CustomRightArrow = ({ onClick }) => (
    <div className={`${styles.carouselArrow} ${styles.carouselArrowRight}`} onClick={onClick}>
        {">"}
    </div>
);

const FavProducts = () => {
    const { products, productList, loading } = useProductStore();
    const navigate = useNavigate();

    useEffect(() => {
        productList();
    }, []);

    const handleProductClick = (product) => {
        navigate(`/products/${product.id}`, { state: { product } });
    };


    return (
        <div className={styles.container}>
            <h3 className={styles.title}>NOVEDADES</h3>
            <div className={styles.carouselContainer}>
                {loading ? (
                    <p>Cargando productos...</p>
                ) : (
                    <Carousel
                        responsive={responsive}
                        autoPlay={true}
                        swipeable={true}
                        draggable={true}
                        showDots={false}
                        infinite={true}
                        partialVisible={false}
                        dotListClass={styles.customDotListStyle}
                        customLeftArrow={<CustomLeftArrow />}
                        customRightArrow={<CustomRightArrow />}
                    >
                        {products.map((product) => (
                            <div className={styles.productCard} key={product.id}>
                                {console.log(product)}
                                <img
                                    src={product.images?.[0] || "https://via.placeholder.com/300x300"}
                                    alt={product.name}
                                    className={styles.productImage}
                                />
                                <h2 className={styles.productName}>{product.name}</h2>
                                <button
                                    className={styles.productButton}
                                    onClick={() => handleProductClick(product)}
                                >
                                    Ver Producto
                                </button>
                            </div>
                        ))}
                    </Carousel>
                )}
            </div>
        </div>
    );
};

export default FavProducts;

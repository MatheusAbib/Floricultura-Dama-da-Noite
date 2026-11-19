import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import ProductList from '../../components/ProductList/ProductList';
import ProductModal from '../../components/ProductModal/ProductModal';
import Newsletter from '../../components/Newsletter/Newsletter';
import Categories from '../../components/Categories/Categories';
import Footer from '../../components/Footer/Footer';
import { presentesProducts } from '../../data/presentesData';
import { categories } from '../../data/categories';
import '../Home/Home.scss';

const presentesSlides = [
    {
        image: "/Floricultura-Dama-da-Noite/assets/Carrossel/Presente-flores.jpg",
        title: "Presentes",
        subtitle: "Encontre o presente perfeito para a sua ocasião",
        buttonText: "Ver Coleção",
        buttonLink: "#product-grid"
    },
    {
        image: "/Floricultura-Dama-da-Noite/assets/Carrossel/Food-gift.png",
        title: "Presentes que Encantam",
        subtitle: "Surpreenda quem você ama com nossos arranjos exclusivos",
        buttonText: "Ver Presentes",
        buttonLink: "#product-grid"
    }
];

function Presentes() {
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addedProductId, setAddedProductId] = useState(null);
    const { addToCart, addMultipleToCart } = useCart();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedProductId(product.id);

        setTimeout(() => {
            setAddedProductId(null);
        }, 2000);
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <i className="bi bi-flower1 loading-logo" />
            </div>
        );
    }

    return (
        <div className="presentes-page">
            <HeroCarousel page="presentes" slides={presentesSlides} />

            <Categories categories={categories} />

            <section className="promo-section" id="promocao">
                <div className="promo-section-inner">
                    <div className="promo-heading">
                        <span className="promo-heading-line" />
                        <span>Para quem faz parte da sua história</span>
                    </div>

                    <div className="promo-banner">
                        <img
                            src="/Floricultura-Dama-da-Noite/assets/Carrossel/irmao.webp"
                            alt="Presentes especiais para o Dia do Irmão"
                            className="promo-image"
                        />
                    </div>

                    <div className="promo-bottom">
                        <span>Gestos de carinho para celebrar quem você ama</span>

                        <span className="promo-bottom-decoration">
                            <i className="bi bi-gift" aria-hidden="true" />
                        </span>
                    </div>
                </div>
            </section>

            <section className="home-catalog-section">
                <ProductList
                    products={presentesProducts}
                    onAddToCart={handleAddToCart}
                    title="Acervo de presentes"
                    onOpenModal={openModal}
                    addedProductId={addedProductId}
                    itemsPerPage={8}
                />
            </section>

            <Newsletter />

            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={closeModal}
                onAddToCart={addToCart}
                onAddMultiple={addMultipleToCart}
            />

            <Footer />
        </div>
    );
}

export default Presentes;
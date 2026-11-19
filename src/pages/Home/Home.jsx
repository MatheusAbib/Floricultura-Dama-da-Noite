import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { products, invernoProducts, testimonials } from '../../data/products';
import { categories } from '../../data/categories';
import { useCart } from '../../context/CartContext';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import ProductList from '../../components/ProductList/ProductList';
import ProductModal from '../../components/ProductModal/ProductModal';
import ProductCard from '../../components/ProductCard/ProductCard';
import Newsletter from '../../components/Newsletter/Newsletter';
import Categories from '../../components/Categories/Categories';
import Testimonials from '../../components/Testimonials/Testimonials';
import Footer from '../../components/Footer/Footer';
import './Home.scss';

function Home() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addedProductId, setAddedProductId] = useState(null);
    const { addToCart, addMultipleToCart } = useCart();
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) return;

        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);

        if (!element) return;

        const offset = 100;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top: Math.max(0, top),
            behavior: 'smooth'
        });
    }, [location.hash]);

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

    return (
        <div className="home-page">
            <HeroCarousel />

            <Categories categories={categories} />

            <section className="promo-section" id="promocao">
                <div className="promo-section-inner">
                    <div className="promo-heading">
                        <span className="promo-heading-line" />
                        <span>Uma ocasião especial</span>
                    </div>

                    <div className="promo-banner">
                        <img
                            src="/Floricultura-Dama-da-Noite/assets/Carrossel/astromelia.webp"
                            alt="Presenteie com astromélias e aproveite 30% de desconto"
                            className="promo-image"
                        />
                    </div>

                    <div className="promo-bottom">
                        <span>Flores para transformar pequenos momentos</span>
                        <span className="promo-bottom-decoration">
                            <i className="bi bi-flower1" aria-hidden="true" />
                        </span>
                    </div>
                </div>
            </section>

            <section className="home-catalog-section" id="lista-plantas">
                <ProductList
                    products={products}
                    title="Acervo de plantas"
                    onAddToCart={handleAddToCart}
                    onOpenModal={openModal}
                    addedProductId={addedProductId}
                    itemsPerPage={12}
                />
            </section>

            <section className="products-section" aria-labelledby="winter-collection-title">
                <div className="products-section-intro">
                    <div className="products-section-heading">
                        <span className="products-section-index">01 / COLEÇÃO ESPECIAL</span>
                        <h2 id="winter-collection-title">A beleza de cada estação</h2>
                    </div>

                    <p>
                        Uma seleção especial de plantas para trazer vida,
                        cor e aconchego aos seus espaços.
                    </p>
                </div>

                <div className="products-banner">
                    <img
                        src="/Floricultura-Dama-da-Noite/assets/Carrossel/coleção-de-inverno.jpg"
                        alt="Coleção de inverno com orquídeas azuis"
                        className="promo-image"
                    />
                </div>

                <div className="products-collection-meta">
                    <span>Seleção da estação</span>
                    <span>{String(invernoProducts.length).padStart(2, '0')} espécies selecionadas</span>
                </div>

                <div className="products-grid" id="inverno-grid">
                    {invernoProducts.map((product) => (
                        <ProductCard
                            product={product}
                            searchTerm=""
                            onAddToCart={handleAddToCart}
                            onOpenModal={openModal}
                            addedProductId={addedProductId}
                            key={product.id}
                        />
                    ))}
                </div>
            </section>

            <Testimonials testimonials={testimonials} />

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

export default Home;
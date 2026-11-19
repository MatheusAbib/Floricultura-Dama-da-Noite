
import React, { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { renderRating } from '../../utils/renderRating';
import { useFavorites } from '../../context/FavoritesContext';
import ProductImageGallery from '../ProductImageGallery/ProductImageGallery';
import './ProductModal.scss';

const iconMap = {
    tipo: 'bi bi-tag',
    uva: 'bi bi-cup-straw',
    safra: 'bi bi-calendar-event',
    teorAlcoolico: 'bi bi-percent',
    volume: 'bi bi-cup-straw',
    harmonizacao: 'bi bi-egg-fried',
    tamanho: 'bi bi-rulers',
    material: 'bi bi-box',
    cores: 'bi bi-palette',
    inclui: 'bi bi-gift',
    recomendacao: 'bi bi-info-circle',
    variedades: 'bi bi-grid-3x3-gap',
    tipos: 'bi bi-list-ul',
    peso: 'bi bi-arrow-down-up',
    embalagem: 'bi bi-box-seam',
    validade: 'bi bi-clock-history',
    itens: 'bi bi-list-check',
    petiscos: 'bi bi-cup-straw',
    cervejas: 'bi bi-cup-straw',
    flores: 'bi bi-flower1',
    altura: 'bi bi-rulers',
    embrulho: 'bi bi-gift',
    acompanha: 'bi bi-envelope-paper',
    durabilidade: 'bi bi-clock',
    quantidade: 'bi bi-hash',
    formato: 'bi bi-grid-3x3-gap',
    origem: 'bi bi-globe-americas',
    frase: 'bi bi-chat-quote'
};

const labelMap = {
    tipo: 'Tipo',
    uva: 'Uva',
    safra: 'Safra',
    teorAlcoolico: 'Teor alcoólico',
    volume: 'Volume',
    harmonizacao: 'Harmonização',
    tamanho: 'Tamanho',
    material: 'Material',
    cores: 'Cores',
    inclui: 'Inclui',
    recomendacao: 'Recomendação',
    variedades: 'Variedades',
    tipos: 'Tipos',
    peso: 'Peso',
    embalagem: 'Embalagem',
    validade: 'Validade',
    itens: 'Itens',
    petiscos: 'Petiscos',
    cervejas: 'Cervejas',
    flores: 'Flores',
    altura: 'Altura',
    embrulho: 'Embrulho',
    acompanha: 'Acompanha',
    durabilidade: 'Durabilidade',
    quantidade: 'Quantidade',
    formato: 'Formato',
    origem: 'Origem',
    frase: 'Frase'
};

const categoryMap = {
    plantas: 'Plantas & natureza',
    flores: 'Flores & arranjos',
    inverno: 'Coleção de inverno',
    sementes: 'Sementes & cultivo',
    presentes: 'Presentes especiais',
    vasos: 'Vasos & decoração'
};

const careFields = [
    { key: 'light', icon: 'bi bi-brightness-high', label: 'Luminosidade' },
    { key: 'water', icon: 'bi bi-droplet', label: 'Rega' },
    { key: 'humidity', icon: 'bi bi-wind', label: 'Umidade' },
    { key: 'temperature', icon: 'bi bi-thermometer-half', label: 'Temperatura' },
    { key: 'care', icon: 'bi bi-heart', label: 'Cuidados' },
    { key: 'toxicity', icon: 'bi bi-exclamation-triangle', label: 'Toxicidade' }
];

function ProductModal({
    product,
    isOpen,
    onClose,
    onAddToCart,
    onAddMultiple
}) {
    const [quantity, setQuantity] = useState(1);
    const { toggleFavorite, isFavorite } = useFavorites();
    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousFocusRef = useRef(null);

    const productId = product?.id;
    const isFav = product ? isFavorite(productId) : false;

    useEffect(() => {
        if (!isOpen) return;

        setQuantity(1);
    }, [isOpen, productId]);

    useEffect(() => {
        if (!isOpen || !product) return;

        previousFocusRef.current = document.activeElement;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        closeButtonRef.current?.focus();

        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onClose();
                return;
            }

            if (event.key !== 'Tab') return;

            const focusableElements = modalRef.current?.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );

            if (!focusableElements?.length) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);

            if (previousFocusRef.current?.isConnected) {
                previousFocusRef.current.focus();
            }
        };
    }, [isOpen, product, onClose]);

    if (!isOpen || !product) return null;

    const images = product.images?.length
        ? product.images
        : product.image
            ? [product.image]
            : [];

    const isPlanta = [
        'plantas',
        'flores',
        'inverno',
        'sementes'
    ].includes(product.category);

    const categoryLabel =
        categoryMap[product.category] ||
        product.category ||
        'Nossa coleção';

    const stockIsDefined =
        product.stock !== undefined &&
        product.stock !== null &&
        product.stock !== '';

    const stock = stockIsDefined
        ? Math.max(0, Number(product.stock) || 0)
        : null;

    const isOutOfStock =
        Boolean(product.outOfStock) ||
        (stock !== null && stock === 0);

    const stockLimit = stock === null ? 99 : stock;

    const stockClass = isOutOfStock
        ? 'out-of-stock'
        : stock !== null && stock <= 10
            ? 'low-stock'
            : 'in-stock';

    const stockText = isOutOfStock
        ? 'Produto esgotado'
        : stock === null
            ? 'Disponível para compra'
            : stock === 1
                ? 'Última unidade disponível'
                : `${stock} unidades disponíveis`;

    const handleQuantityChange = change => {
        setQuantity(previous =>
            Math.max(1, Math.min(stockLimit, previous + change))
        );
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        if (onAddMultiple) {
            onAddMultiple(product, quantity);
        } else if (onAddToCart) {
            for (let index = 0; index < quantity; index++) {
                onAddToCart(product);
            }
        }

        onClose();
    };

    const handleToggleFavorite = () => {
        toggleFavorite(product);
    };

    const getDetailsConfig = details => {
        if (!details) {
            return {
                title: '',
                items: []
            };
        }

        if (isPlanta) {
            const items = careFields
                .filter(field => details[field.key])
                .map(field => ({
                    ...field,
                    value: details[field.key]
                }));

            return {
                title: 'Cuidados & cultivo',
                items
            };
        }

        const items = Object.entries(details)
            .filter(([, value]) =>
                value !== null &&
                value !== undefined &&
                value !== ''
            )
            .map(([key, value]) => ({
                key,
                icon: iconMap[key] || 'bi bi-info-circle',
                label: labelMap[key] ||
                    key.charAt(0).toUpperCase() + key.slice(1),
                value
            }));

        return {
            title: 'Características do produto',
            items
        };
    };

    const detailsConfig = getDetailsConfig(product.details);

    const favoriteButton = (
        <button
            type="button"
            className={`modal-fav ${isFav ? 'is-active' : ''}`}
            onClick={handleToggleFavorite}
            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={isFav}
        >
            <i
                className={`bi ${isFav ? 'bi-heart-fill' : 'bi-heart'}`}
                aria-hidden="true"
            />
        </button>
    );

    return (
        <div
            className="product-modal-overlay"
            onMouseDown={event => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                ref={modalRef}
                className="product-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-modal-title"
            >
                <button
                    ref={closeButtonRef}
                    type="button"
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Fechar detalhes do produto"
                >
                    <i className="bi bi-x-lg" aria-hidden="true" />
                </button>

                <div className="product-modal-topline">
                    <div className="product-modal-brand">
                        <i className="bi bi-flower1" aria-hidden="true" />
                        <span>Dama da Noite</span>
                    </div>

                    <span className="product-modal-topline-label">
                        Nossa coleção
                    </span>
                </div>

                <div className="product-modal-content">
                    <div className="product-modal-visual">
                        <div className="product-modal-gallery">
                            <ProductImageGallery
                                images={images}
                                alt={product.name}
                                productName={product.name}
                                actionSlot={favoriteButton}
                            />
                        </div>
                    </div>

                    <div className="product-modal-info">
                        <header className="product-modal-heading">
                            <div className="product-modal-category">
                                <span className="product-modal-category-line" />
                                <span>{categoryLabel}</span>
                            </div>

                            <h2
                                id="product-modal-title"
                                className="product-modal-title"
                            >
                                {product.name}
                            </h2>

                            {product.rating > 0 && (
                                <div
                                    className="product-modal-rating"
                                    aria-label={`Avaliação ${product.rating} de 5`}
                                >
                                    <div
                                        className="product-modal-stars"
                                        aria-hidden="true"
                                    >
                                        {renderRating(product.rating).map((star, index) => (
                                            <i
                                                key={index}
                                                className={`bi ${star}`}
                                            />
                                        ))}
                                    </div>

                                    <span className="product-modal-rating-value">
                                        {product.rating}
                                    </span>
                                </div>
                            )}
                        </header>

                        <div className="product-modal-purchase-summary">
                            <div className="product-modal-price-group">
                                <span className="product-modal-price-label">
                                    Valor do produto
                                </span>

                                <div className="product-modal-prices">
                                    {product.oldPrice && (
                                        <span className="product-modal-old-price">
                                            {formatCurrency(product.oldPrice)}
                                        </span>
                                    )}

                                    <span className="product-modal-price">
                                        {formatCurrency(product.price)}
                                    </span>
                                </div>
                            </div>

                            <div className={`product-modal-stock ${stockClass}`}>
                                <i
                                    className={`bi ${
                                        isOutOfStock
                                            ? 'bi-x-circle'
                                            : stockClass === 'low-stock'
                                                ? 'bi-exclamation-circle'
                                                : 'bi-check-circle'
                                    }`}
                                    aria-hidden="true"
                                />

                                <span>{stockText}</span>
                            </div>
                        </div>

                        {product.description && (
                            <div className="product-modal-section">
                                <div className="product-modal-section-heading">
                                    <span className="product-modal-section-index">
                                        01
                                    </span>

                                    <h3>
                                        {isPlanta ? 'Sobre esta planta' : 'Sobre este produto'}
                                    </h3>
                                </div>

                                <p className="product-modal-description">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {detailsConfig.items.length > 0 && (
                            <div className="product-modal-section">
                                <div className="product-modal-section-heading">
                                    <span className="product-modal-section-index">
                                        {product.description ? '02' : '01'}
                                    </span>

                                    <h3>{detailsConfig.title}</h3>
                                </div>

                                {isPlanta ? (
                                    <div className="product-modal-care-grid">
                                        {detailsConfig.items.map(item => (
                                            <div
                                                key={item.key}
                                                className="product-modal-care-item"
                                            >
                                                <div className="product-modal-care-icon">
                                                    <i
                                                        className={item.icon}
                                                        aria-hidden="true"
                                                    />
                                                </div>

                                                <div className="product-modal-care-text">
                                                    <span className="product-modal-care-label">
                                                        {item.label}
                                                    </span>

                                                    <span className="product-modal-care-value">
                                                        {item.value}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="product-modal-details">
                                        {detailsConfig.items.map(item => (
                                            <div
                                                key={item.key}
                                                className="product-modal-detail-item"
                                            >
                                                <div className="product-modal-detail-label">
                                                    <i
                                                        className={item.icon}
                                                        aria-hidden="true"
                                                    />

                                                    <span>{item.label}</span>
                                                </div>

                                                <span className="product-modal-detail-value">
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="product-modal-purchase">
                    <div className="product-modal-purchase-heading">
                        <span>Seu pedido</span>

                        <i
                            className="bi bi-bag"
                            aria-hidden="true"
                        />
                    </div>

                    <div className="product-modal-purchase-controls">
                        <div className="product-modal-quantity">
                            <span className="product-modal-quantity-label">
                                Quantidade
                            </span>

                            <div className="product-modal-quantity-control">
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1 || isOutOfStock}
                                    aria-label="Diminuir quantidade"
                                >
                                    <i
                                        className="bi bi-dash"
                                        aria-hidden="true"
                                    />
                                </button>

                                <span aria-live="polite">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={
                                        isOutOfStock ||
                                        quantity >= stockLimit
                                    }
                                    aria-label="Aumentar quantidade"
                                >
                                    <i
                                        className="bi bi-plus"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="product-modal-add"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                        >
                            <i
                                className={`bi ${
                                    isOutOfStock
                                        ? 'bi-bag-x'
                                        : 'bi-bag-plus'
                                }`}
                                aria-hidden="true"
                            />

                            <span>
                                {isOutOfStock
                                    ? 'Produto indisponível'
                                    : 'Adicionar ao carrinho'}
                            </span>

                            {!isOutOfStock && (
                                <i
                                    className="bi bi-arrow-up-right product-modal-add-arrow"
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ProductModal;

import React, { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { renderRating } from '../../utils/renderRating';
import { useFavorites } from '../../context/FavoritesContext';
import './ProductCard.scss';

function ProductCard({
    product,
    searchTerm = '',
    onAddToCart,
    onOpenModal,
    addedProductId = null,
    showBadge = true,
    showRating = true,
    showActions = true
}) {
    const [isAdded, setIsAdded] = useState(false);
    const addedTimeoutRef = useRef(null);
    const { toggleFavorite, isFavorite } = useFavorites();

    const isFav = isFavorite(product.id);
    const isOutOfStock = Boolean(product.outOfStock || product.stock === 0);
    const justAdded = isAdded || addedProductId === product.id;

    useEffect(() => {
        return () => {
            if (addedTimeoutRef.current) {
                clearTimeout(addedTimeoutRef.current);
            }
        };
    }, []);

    const handleAddToCart = () => {
        if (isOutOfStock || justAdded || !onAddToCart) return;

        onAddToCart(product);
        setIsAdded(true);

        if (addedTimeoutRef.current) {
            clearTimeout(addedTimeoutRef.current);
        }

        addedTimeoutRef.current = setTimeout(() => {
            setIsAdded(false);
        }, 2000);
    };

    const handleToggleFavorite = () => {
        toggleFavorite(product);
    };

    const highlightText = (text, term) => {
        const value = String(text ?? '');
        const normalizedTerm = term.trim();

        if (!normalizedTerm) return value;

        const escapedTerm = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedTerm})`, 'gi');

        return value.split(regex).map((part, index) =>
            index % 2 === 1 ? (
                <mark key={index} className="product-highlight">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    const badgeLabels = {
        new: 'Novidade',
        bestseller: 'Mais vendido',
        sale: 'Oferta'
    };

    const badgeLabel = badgeLabels[product.badge];
    const hasDiscount = Number(product.oldPrice) > Number(product.price);

    const discountPercentage = hasDiscount
        ? Math.round(
            ((Number(product.oldPrice) - Number(product.price)) /
                Number(product.oldPrice)) * 100
        )
        : 0;

    return (
        <article className={`product-card ${isOutOfStock ? 'is-out-of-stock' : ''}`}>
            <div className="product-card-media">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-image"
                    loading="lazy"
                    onClick={() => onOpenModal?.(product)}
                    decoding="async"
                />

                <div className="product-card-media-top">
                    <div className="product-card-badges">
                        {showBadge && badgeLabel && (
                            <span className={`product-card-badge badge-${product.badge}`}>
                                {badgeLabel}
                            </span>
                        )}

                        {showBadge && hasDiscount && discountPercentage > 0 && (
                            <span className="product-card-discount">
                                -{discountPercentage}%
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        className={`product-card-fav ${isFav ? 'is-active' : ''}`}
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
                </div>

                {isOutOfStock && (
                    <span className="product-card-stock-label">
                        Indisponível
                    </span>
                )}
            </div>

            <div className="product-card-body">
                <div className="product-card-info">
                    <h3 className="product-card-name">
                        {highlightText(product.name, searchTerm)}
                    </h3>

                    {showRating && (
                        <div
                            className="product-card-rating"
                            aria-label={`Avaliação: ${Number(product.rating) || 0} de 5 estrelas`}
                        >
                            <div className="product-card-stars" aria-hidden="true">
                                {renderRating(product.rating).map((star, index) => (
                                    <i key={index} className={`bi ${star}`} />
                                ))}
                            </div>

                            {product.rating != null && (
                                <span className="product-card-rating-value">
                                    {Number(product.rating).toLocaleString('pt-BR', {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1
                                    })}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="product-card-bottom">
                    <div className="product-card-pricing">
                        <div className="product-card-price-top">
                            {hasDiscount ? (
                                <span className="product-card-old">
                                    {formatCurrency(product.oldPrice)}
                                </span>
                            ) : (
                                <span
                                    className="product-card-old is-placeholder"
                                    aria-hidden="true"
                                />
                            )}
                        </div>

                        <span className="product-card-price">
                            {formatCurrency(product.price)}
                        </span>
                    </div>

                    {showActions && (
                        <div className="product-card-actions">
                            <button
                                type="button"
                                className="product-card-btn product-card-btn-ghost"
                                onClick={() => onOpenModal?.(product)}
                                disabled={!onOpenModal}
                                title="Ver detalhes"
                                aria-label={`Ver detalhes de ${product.name}`}
                            >
                                <i className="bi bi-eye" aria-hidden="true" />
                            </button>

                            <button
                                type="button"
                                className={`product-card-btn product-card-btn-primary ${justAdded ? 'is-added' : ''} ${isOutOfStock ? 'is-out' : ''}`}
                                onClick={handleAddToCart}
                                disabled={justAdded || isOutOfStock || !onAddToCart}
                                aria-label={
                                    isOutOfStock
                                        ? `${product.name} esgotado`
                                        : justAdded
                                            ? `${product.name} adicionado ao carrinho`
                                            : `Adicionar ${product.name} ao carrinho`
                                }
                            >
                                {isOutOfStock ? (
                                    <>
                                        <i className="bi bi-slash-circle" aria-hidden="true" />
                                        <span>Esgotado</span>
                                    </>
                                ) : justAdded ? (
                                    <>
                                        <i className="bi bi-check2" aria-hidden="true" />
                                        <span>Adicionado</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-bag-plus" aria-hidden="true" />
                                        <span>Adicionar</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

export default ProductCard;
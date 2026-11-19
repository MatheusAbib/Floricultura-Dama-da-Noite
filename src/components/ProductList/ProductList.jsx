import React, { useState, useEffect, useMemo, useRef } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.scss';

const SORT_OPTIONS = [
    { value: 'price-asc', label: 'Menor preço', icon: 'bi-sort-numeric-down' },
    { value: 'price-desc', label: 'Maior preço', icon: 'bi-sort-numeric-down-alt' },
    { value: 'name-asc', label: 'Nome (A–Z)', icon: 'bi-sort-alpha-down' },
    { value: 'name-desc', label: 'Nome (Z–A)', icon: 'bi-sort-alpha-down-alt' },
    { value: 'rating-desc', label: 'Melhor avaliação', icon: 'bi-star' }
];

function ProductList({
    products,
    title,
    onAddToCart,
    onOpenModal,
    addedProductId,
    itemsPerPage = 12
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const sortRef = useRef(null);
    const listRef = useRef(null);

    const safeItemsPerPage = Math.max(1, itemsPerPage);

    useEffect(() => {
        if (!isDropdownOpen) return;

        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isDropdownOpen]);

    const filteredProducts = useMemo(() => {
        const term = searchTerm.trim().toLocaleLowerCase('pt-BR');

        if (!term) return products;

        return products.filter((product) => {
            const searchableText = [
                product.name,
                product.description,
                product.category
            ]
                .filter(Boolean)
                .join(' ')
                .toLocaleLowerCase('pt-BR');

            return searchableText.includes(term);
        });
    }, [products, searchTerm]);

    const sortedProducts = useMemo(() => {
        const result = [...filteredProducts];

        switch (sortType) {
            case 'price-asc':
                return result.sort((a, b) => a.price - b.price);

            case 'price-desc':
                return result.sort((a, b) => b.price - a.price);

            case 'name-asc':
                return result.sort((a, b) =>
                    a.name.localeCompare(b.name, 'pt-BR')
                );

            case 'name-desc':
                return result.sort((a, b) =>
                    b.name.localeCompare(a.name, 'pt-BR')
                );

            case 'rating-desc':
                return result.sort((a, b) =>
                    (Number(b.rating) || 0) - (Number(a.rating) || 0)
                );

            default:
                return result;
        }
    }, [filteredProducts, sortType]);

    const totalProducts = sortedProducts.length;
    const totalPages = Math.ceil(totalProducts / safeItemsPerPage);
    const safeCurrentPage = Math.min(
        currentPage,
        Math.max(1, totalPages)
    );

    const startIndex = (safeCurrentPage - 1) * safeItemsPerPage;
    const currentProducts = sortedProducts.slice(
        startIndex,
        startIndex + safeItemsPerPage
    );

    const firstItem = totalProducts > 0 ? startIndex + 1 : 0;
    const lastItem = Math.min(
        startIndex + safeItemsPerPage,
        totalProducts
    );

    const activeSort = SORT_OPTIONS.find(
        (option) => option.value === sortType
    );

    const hasActiveFilters = Boolean(searchTerm.trim() || sortType);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleSort = (value) => {
        setSortType(value);
        setCurrentPage(1);
        setIsDropdownOpen(false);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSortType('');
        setCurrentPage(1);
        setIsDropdownOpen(false);
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages || page === safeCurrentPage) {
            return;
        }

        setCurrentPage(page);

        if (listRef.current) {
            const offset = 100;
            const top =
                listRef.current.getBoundingClientRect().top +
                window.scrollY -
                offset;

            window.scrollTo({
                top: Math.max(0, top),
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth'
            });
        }
    };

    const getVisiblePages = () => {
        const maxVisiblePages = 5;
        const visibleCount = Math.min(maxVisiblePages, totalPages);

        let startPage = Math.max(
            1,
            safeCurrentPage - Math.floor(visibleCount / 2)
        );

        let endPage = Math.min(
            totalPages,
            startPage + visibleCount - 1
        );

        startPage = Math.max(
            1,
            endPage - visibleCount + 1
        );

        return Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => startPage + index
        );
    };

    const visiblePages = getVisiblePages();

    return (
        <section className="product-list" id="product-grid" ref={listRef}>
            <header className="product-list-header">
                <div className="product-list-heading">
                    <div className="product-list-eyebrow">
                        <span className="product-list-eyebrow-line" />
                        <span>Nosso acervo</span>
                    </div>

                    <h2 className="product-list-title">{title}</h2>

                    <p className="product-list-description">
                        Explore nossa seleção e encontre algo especial para você.
                    </p>
                </div>

                <div className="product-list-summary">
                    <span className="product-list-summary-number">
                        {String(products.length).padStart(2, '0')}
                    </span>

                    <span className="product-list-summary-label">
                        {products.length === 1 ? 'Produto' : 'Produtos'}
                        <span>no acervo</span>
                    </span>
                </div>
            </header>

            <div className="product-list-toolbar">
                <div className="product-list-search">
                    <i
                        className="bi bi-search product-list-search-icon"
                        aria-hidden="true"
                    />

                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => handleSearch(event.target.value)}
                        placeholder="O que você está procurando?"
                        aria-label="Buscar produtos"
                        className="product-list-search-input"
                    />

                    {searchTerm && (
                        <button
                            type="button"
                            className="product-list-search-clear"
                            onClick={() => handleSearch('')}
                            aria-label="Limpar busca"
                        >
                            <i className="bi bi-x-lg" aria-hidden="true" />
                        </button>
                    )}
                </div>

                <div className="product-list-toolbar-actions">
                    <div className="product-list-sort" ref={sortRef}>
                        <button
                            type="button"
                            className={`product-list-sort-trigger ${sortType ? 'is-active' : ''}`}
                            onClick={() => setIsDropdownOpen((value) => !value)}
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="true"
                        >
                            <i className="bi bi-sliders2" aria-hidden="true" />

                            <span>
                                {activeSort ? activeSort.label : 'Ordenar por'}
                            </span>

                            <i
                                className={`bi bi-chevron-down product-list-sort-chevron ${isDropdownOpen ? 'is-open' : ''}`}
                                aria-hidden="true"
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="product-list-sort-menu">
                                <span className="product-list-sort-heading">
                                    Organizar produtos
                                </span>

                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`product-list-sort-option ${sortType === option.value ? 'is-active' : ''}`}
                                        onClick={() => handleSort(option.value)}
                                    >
                                        <i
                                            className={`bi ${option.icon}`}
                                            aria-hidden="true"
                                        />

                                        <span>{option.label}</span>

                                        {sortType === option.value && (
                                            <i
                                                className="bi bi-check2 product-list-sort-check"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </button>
                                ))}

                                {sortType && (
                                    <button
                                        type="button"
                                        className="product-list-sort-reset"
                                        onClick={() => handleSort('')}
                                    >
                                        Limpar ordenação
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="product-list-results">
                <div className="product-list-results-info" aria-live="polite">
                    <span className="product-list-results-line" />

                    <span>
                        {totalProducts === 0
                            ? 'Nenhum produto encontrado'
                            : `${totalProducts} ${totalProducts === 1 ? 'produto encontrado' : 'produtos encontrados'}`}
                    </span>
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        className="product-list-clear-filters"
                        onClick={clearFilters}
                    >
                        <i className="bi bi-x-circle" aria-hidden="true" />
                        Limpar filtros
                    </button>
                )}
            </div>

            {currentProducts.length === 0 ? (
                <div className="product-grid-empty">
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <i className="bi bi-search" aria-hidden="true" />
                        </div>

                        <span className="empty-state-eyebrow">
                            Nenhum resultado
                        </span>

                        <h3 className="empty-state-title">
                            Não encontramos o que você procura
                        </h3>

                        <p className="empty-state-text">
                            Experimente buscar por outro nome ou explore
                            todos os produtos disponíveis.
                        </p>

                        <button
                            type="button"
                            className="empty-state-btn"
                            onClick={clearFilters}
                        >
                            Ver todos os produtos
                            <i className="bi bi-arrow-right" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="product-grid">
                    {currentProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            searchTerm={searchTerm}
                            onAddToCart={onAddToCart}
                            onOpenModal={onOpenModal}
                            addedProductId={addedProductId}
                        />
                    ))}
                </div>
            )}

            {totalProducts > 0 && (
                <footer className="product-list-footer">
                    <div className="product-list-footer-info">
                        <span className="product-list-footer-eyebrow">
                            Explorando o acervo
                        </span>

                        <p>
                            Exibindo <strong>{firstItem}–{lastItem}</strong> de{' '}
                            <strong>{totalProducts}</strong> produtos
                        </p>
                    </div>

                    {totalPages > 1 && (
                        <nav
                            className="pagination-container"
                            aria-label="Paginação de produtos"
                        >
                            <button
                                type="button"
                                className="page-btn page-btn-arrow"
                                onClick={() => goToPage(safeCurrentPage - 1)}
                                disabled={safeCurrentPage === 1}
                                aria-label="Página anterior"
                            >
                                <i className="bi bi-arrow-left" aria-hidden="true" />
                            </button>

                            {visiblePages[0] > 1 && (
                                <>
                                    <button
                                        type="button"
                                        className="page-btn"
                                        onClick={() => goToPage(1)}
                                        aria-label="Ir para página 1"
                                    >
                                        1
                                    </button>

                                    {visiblePages[0] > 2 && (
                                        <span className="page-dots">…</span>
                                    )}
                                </>
                            )}

                            {visiblePages.map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    className={`page-btn ${safeCurrentPage === page ? 'is-active' : ''}`}
                                    onClick={() => goToPage(page)}
                                    aria-label={`Ir para página ${page}`}
                                    aria-current={safeCurrentPage === page ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            ))}

                            {visiblePages[visiblePages.length - 1] < totalPages && (
                                <>
                                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                                        <span className="page-dots">…</span>
                                    )}

                                    <button
                                        type="button"
                                        className="page-btn"
                                        onClick={() => goToPage(totalPages)}
                                        aria-label={`Ir para página ${totalPages}`}
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                className="page-btn page-btn-arrow"
                                onClick={() => goToPage(safeCurrentPage + 1)}
                                disabled={safeCurrentPage === totalPages}
                                aria-label="Próxima página"
                            >
                                <i className="bi bi-arrow-right" aria-hidden="true" />
                            </button>
                        </nav>
                    )}
                </footer>
            )}
        </section>
    );
}

export default ProductList;
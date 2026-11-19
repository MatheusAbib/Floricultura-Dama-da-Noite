
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatCurrency } from '../../utils/formatCurrency';
import ProductModal from '../ProductModal/ProductModal';
import './Navbar.scss';

const initialUserData = {
    nome: 'Maria José',
    email: 'usuario@email.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    senha: '********',
    confirmarsenha: '',
    cartao: '**** **** **** 1234',
    bandeira: 'Visa',
    validade: '12/26',
    cvv: ''
};

const productLinks = [
    { label: 'Plantas', path: '/', icon: 'bi-flower1' },
    { label: 'Presentes', path: '/presentes', icon: 'bi-gift' },
    { label: 'Vasos', path: '/vasos', icon: 'bi-basket2' },
    { label: 'Sementes', path: '/sementes', icon: 'bi-flower2' }
];
function Navbar() {
    const location = useLocation();

    const {
        cartCount,
        addToCart,
        addMultipleToCart,
        showNotification
    } = useCart();

    const {
        favorites,
        favoritesCount,
        toggleFavorite
    } = useFavorites();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showFavoritesModal, setShowFavoritesModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [userData, setUserData] = useState(() => {
        try {
            const saved = localStorage.getItem('userProfile');

            if (saved) {
                return {
                    ...initialUserData,
                    ...JSON.parse(saved),
                    cvv: ''
                };
            }
        } catch {
            return initialUserData;
        }

        return initialUserData;
    });

    const [editData, setEditData] = useState({ ...userData });

    const dropdownTimeout = useRef(null);
    const profileTimeout = useRef(null);
    const favoritesModalRef = useRef(null);
    const profileModalRef = useRef(null);
    const logoutModalRef = useRef(null);

    const itemsPerPage = 7;

    const totalPages = Math.ceil(favorites.length / itemsPerPage);
    const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const currentFavorites = favorites.slice(startIndex, startIndex + itemsPerPage);

    const hasOpenModal =
        showProfileModal ||
        showFavoritesModal ||
        showLogoutModal ||
        isProductModalOpen;

    const isProductRoute = productLinks.some(
        item => item.path !== '/' && location.pathname === item.path
    );

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 900px)');

        const handleChange = event => {
            setIsMobile(event.matches);

            if (!event.matches) {
                setIsMobileMenuOpen(false);
                setIsDropdownOpen(false);
                setIsProfileOpen(false);
            }
        };

        setIsMobile(mq.matches);
        mq.addEventListener('change', handleChange);

        return () => mq.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        return () => {
            if (dropdownTimeout.current) {
                clearTimeout(dropdownTimeout.current);
            }

            if (profileTimeout.current) {
                clearTimeout(profileTimeout.current);
            }
        };
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
        setIsProfileOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (currentPage > Math.max(totalPages, 1)) {
            setCurrentPage(Math.max(totalPages, 1));
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        if (!hasOpenModal && !isMobileMenuOpen) {
            return;
        }

        const handleEscape = event => {
            if (event.key !== 'Escape') {
                return;
            }

            if (isProductModalOpen) {
                setIsProductModalOpen(false);
                setSelectedProduct(null);
                return;
            }

            if (showLogoutModal) {
                setShowLogoutModal(false);
                return;
            }

            if (showProfileModal) {
                setShowProfileModal(false);
                return;
            }

            if (showFavoritesModal) {
                setShowFavoritesModal(false);
                return;
            }

            setIsMobileMenuOpen(false);
        };

        window.addEventListener('keydown', handleEscape);

        return () => window.removeEventListener('keydown', handleEscape);
    }, [
        hasOpenModal,
        isMobileMenuOpen,
        isProductModalOpen,
        showLogoutModal,
        showProfileModal,
        showFavoritesModal
    ]);

    const closeDropdown = () => {
        if (dropdownTimeout.current) {
            clearTimeout(dropdownTimeout.current);
            dropdownTimeout.current = null;
        }

        setIsDropdownOpen(false);
    };

    const closeProfile = () => {
        if (profileTimeout.current) {
            clearTimeout(profileTimeout.current);
            profileTimeout.current = null;
        }

        setIsProfileOpen(false);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const closeAll = () => {
        closeMobileMenu();
        closeDropdown();
        closeProfile();
    };

    const toggleMobileMenu = () => {
        closeDropdown();
        closeProfile();
        setIsMobileMenuOpen(previous => !previous);
    };

    const openDropdown = () => {
        if (isMobile) return;

        if (dropdownTimeout.current) {
            clearTimeout(dropdownTimeout.current);
            dropdownTimeout.current = null;
        }

        closeProfile();
        setIsDropdownOpen(true);
    };

    const scheduleCloseDropdown = () => {
        if (isMobile) return;

        if (dropdownTimeout.current) {
            clearTimeout(dropdownTimeout.current);
        }

        dropdownTimeout.current = setTimeout(() => {
            setIsDropdownOpen(false);
            dropdownTimeout.current = null;
        }, 180);
    };

    const toggleDropdown = event => {
        event.preventDefault();

        if (dropdownTimeout.current) {
            clearTimeout(dropdownTimeout.current);
            dropdownTimeout.current = null;
        }

        closeProfile();
        setIsDropdownOpen(previous => !previous);
    };

    const openProfile = () => {
        if (isMobile) return;

        if (profileTimeout.current) {
            clearTimeout(profileTimeout.current);
            profileTimeout.current = null;
        }

        closeDropdown();
        setIsProfileOpen(true);
    };

    const scheduleCloseProfile = () => {
        if (isMobile) return;

        if (profileTimeout.current) {
            clearTimeout(profileTimeout.current);
        }

        profileTimeout.current = setTimeout(() => {
            setIsProfileOpen(false);
            profileTimeout.current = null;
        }, 180);
    };

    const toggleProfile = () => {
        if (profileTimeout.current) {
            clearTimeout(profileTimeout.current);
            profileTimeout.current = null;
        }

        closeDropdown();
        setIsProfileOpen(previous => !previous);
    };

    const handleEditClick = () => {
        setEditData({ ...userData, cvv: '' });
        setShowProfileModal(true);
        closeAll();
    };

    const handleSaveProfile = () => {
        const updatedData = {
            ...editData,
            cvv: ''
        };

        setUserData(updatedData);

        localStorage.setItem(
            'userProfile',
            JSON.stringify(updatedData)
        );

        setShowProfileModal(false);
        showNotification('Perfil atualizado com sucesso!', 'success');
    };

    const handleLogout = () => {
        setShowLogoutModal(false);
        closeAll();
        showNotification('Você saiu da sua conta.', 'info');
    };

    const handleFavorites = () => {
        setCurrentPage(1);
        setShowFavoritesModal(true);
        closeAll();
    };

    const handleRemoveFavorite = productId => {
        const product = favorites.find(item => item.id === productId);

        if (!product) return;

        toggleFavorite(product);
    };

    const openProductModal = product => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        setSelectedProduct(null);
    };

    const goToPage = page => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            favoritesModalRef.current?.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const maxVisiblePages = 5;

        let startPage = Math.max(
            1,
            safeCurrentPage - Math.floor(maxVisiblePages / 2)
        );

        let endPage = Math.min(
            totalPages,
            startPage + maxVisiblePages - 1
        );

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(
                1,
                endPage - maxVisiblePages + 1
            );
        }

        const pages = [];

        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }

        return (
            <nav
                className="favorites-pagination"
                aria-label="Paginação dos favoritos"
            >
                <button
                    type="button"
                    className={`page-btn ${safeCurrentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => goToPage(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    aria-label="Página anterior"
                >
                    <i className="bi bi-chevron-left" aria-hidden="true" />
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            type="button"
                            className="page-btn"
                            onClick={() => goToPage(1)}
                            aria-label="Ir para a página 1"
                        >
                            1
                        </button>

                        {startPage > 2 && (
                            <span className="page-dots" aria-hidden="true">
                                <i className="bi bi-three-dots" />
                            </span>
                        )}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        type="button"
                        className={`page-btn ${safeCurrentPage === page ? 'active' : ''}`}
                        onClick={() => goToPage(page)}
                        aria-label={`Ir para a página ${page}`}
                        aria-current={safeCurrentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <span className="page-dots" aria-hidden="true">
                                <i className="bi bi-three-dots" />
                            </span>
                        )}

                        <button
                            type="button"
                            className="page-btn"
                            onClick={() => goToPage(totalPages)}
                            aria-label={`Ir para a página ${totalPages}`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    type="button"
                    className={`page-btn ${safeCurrentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => goToPage(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    aria-label="Próxima página"
                >
                    <i className="bi bi-chevron-right" aria-hidden="true" />
                </button>
            </nav>
        );
    };

    return (
        <>
            <header className="site-header">
                <div
                    className={`site-backdrop ${isMobileMenuOpen ? 'is-open' : ''}`}
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                />

                <div className="site-header-inner">
                    <Link
                        className="site-brand"
                        to="/"
                        onClick={closeAll}
                        aria-label="Dama da Noite - Página inicial"
                    >
                        <i
                            className="bi bi-flower1 site-brand-symbol"
                            aria-hidden="true"
                        />

                        <span className="site-brand-text">
                            <span className="site-brand-title">
                                Dama da <span className="site-brand-dot">Noite.</span>
                            </span>

                            <span className="site-brand-caption">
                                Floricultura
                            </span>
                        </span>
                    </Link>

                    <button
                        className={`site-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
                        type="button"
                        onClick={toggleMobileMenu}
                        aria-expanded={isMobileMenuOpen}
                        aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                        aria-controls="site-main-nav"
                    >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                    </button>

                    <nav
                        id="site-main-nav"
                        className={`site-nav ${isMobileMenuOpen ? 'is-open' : ''}`}
                        aria-label="Navegação principal"
                    >
                        <ul className="site-nav-list">
                            <li className="site-nav-item">
                                <NavLink
                                    className="site-nav-link"
                                    to="/"
                                    onClick={closeAll}
                                    end
                                >
                                    Principal
                                </NavLink>
                            </li>

                            <li
                                className={`site-nav-item site-nav-has-menu ${isDropdownOpen ? 'is-open' : ''}`}
                                onMouseEnter={openDropdown}
                                onMouseLeave={scheduleCloseDropdown}
                            >
                                <button
                                    className={`site-nav-link site-nav-trigger ${isProductRoute ? 'active' : ''}`}
                                    type="button"
                                    onClick={toggleDropdown}
                                    aria-expanded={isDropdownOpen}
                                    aria-controls="site-products-menu"
                                >
                                    Produtos

                                    <i
                                        className={`bi bi-chevron-down site-nav-caret ${isDropdownOpen ? 'is-open' : ''}`}
                                        aria-hidden="true"
                                    />
                                </button>

                                <ul
                                    id="site-products-menu"
                                    className={`site-submenu ${isDropdownOpen ? 'is-open' : ''}`}
                                    onMouseEnter={openDropdown}
                                    onMouseLeave={scheduleCloseDropdown}
                                >
                                    {productLinks.map(item => (
                                        <li key={item.label}>
                                            <Link
                                                className="site-submenu-link"
                                                to={item.path}
                                                onClick={closeAll}
                                            >
                                                <i
                                                    className={`bi ${item.icon}`}
                                                    aria-hidden="true"
                                                />
                                                <span>{item.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            <li className="site-nav-item">
                                <NavLink
                                    className="site-nav-link"
                                    to="/contato"
                                    onClick={closeAll}
                                >
                                    Fale Conosco
                                </NavLink>
                            </li>

                            <li className="site-nav-item">
                                <NavLink
                                    className="site-nav-link"
                                    to="/quem-somos"
                                    onClick={closeAll}
                                >
                                    Quem Somos
                                </NavLink>
                            </li>
                        </ul>

                        <div className="site-actions">
                            <button
                                className="site-action"
                                type="button"
                                onClick={handleFavorites}
                                aria-label={`Meus favoritos, ${favoritesCount} produtos`}
                                title="Meus favoritos"
                            >
                                <i
                                    className="bi bi-heart"
                                    aria-hidden="true"
                                />

                                {favoritesCount > 0 && (
                                    <span className="site-action-badge">
                                        {favoritesCount}
                                    </span>
                                )}
                            </button>

                            <Link
                                to="/carrinho"
                                className="site-action"
                                onClick={closeAll}
                                aria-label={`Carrinho, ${cartCount} produtos`}
                                title="Meu carrinho"
                            >
                                <i
                                    className="bi bi-cart3"
                                    aria-hidden="true"
                                />

                                {cartCount > 0 && (
                                    <span className="site-action-badge">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <div
                                className={`site-action-menu ${isProfileOpen ? 'is-open' : ''}`}
                                onMouseEnter={openProfile}
                                onMouseLeave={scheduleCloseProfile}
                            >
                                <button
                                    className="site-action"
                                    type="button"
                                    onClick={toggleProfile}
                                    aria-label="Minha conta"
                                    aria-expanded={isProfileOpen}
                                    aria-controls="site-profile-menu"
                                    title="Minha conta"
                                >
                                    <i
                                        className="bi bi-person-circle"
                                        aria-hidden="true"
                                    />
                                </button>

                                <ul
                                    id="site-profile-menu"
                                    className={`site-submenu site-submenu-profile ${isProfileOpen ? 'is-open' : ''}`}
                                    onMouseEnter={openProfile}
                                    onMouseLeave={scheduleCloseProfile}
                                >
                                    <li>
                                        <button
                                            type="button"
                                            className="site-submenu-link"
                                            onClick={handleEditClick}
                                        >
                                            <i
                                                className="bi bi-person-vcard"
                                                aria-hidden="true"
                                            />
                                            <span>Meu Perfil</span>
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            type="button"
                                            className="site-submenu-link is-danger"
                                            onClick={() => {
                                                closeAll();
                                                setShowLogoutModal(true);
                                            }}
                                        >
                                            <i
                                                className="bi bi-box-arrow-right"
                                                aria-hidden="true"
                                            />
                                            <span>Sair</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            {showProfileModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowProfileModal(false)}
                >
                    <div
                        ref={profileModalRef}
                        className="modal-box modal-large modal-profile"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="profile-modal-title"
                        onClick={event => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="modal-close-x"
                            onClick={() => setShowProfileModal(false)}
                            aria-label="Fechar perfil"
                        >
                            <i className="bi bi-x-lg" aria-hidden="true" />
                        </button>

                        <div className="profile-modal-heading">
                            <div className="profile-modal-emblem">
                                <i className="bi bi-person" aria-hidden="true" />
                            </div>

                            <div>
                                <span className="profile-modal-eyebrow">
                                    Área do cliente
                                </span>

                                <h3
                                    className="modal-title"
                                    id="profile-modal-title"
                                >
                                    Meu Perfil
                                </h3>

                                <p className="profile-modal-description">
                                    Atualize suas informações pessoais e seus dados de contato.
                                </p>
                            </div>
                        </div>

                        <div className="profile-section-heading">
                            <i
                                className="bi bi-person-lines-fill"
                                aria-hidden="true"
                            />
                            <span>Dados pessoais</span>
                        </div>

                        <div className="row g-3 profile-fields">
                            <div className="col-md-6">
                                <label htmlFor="profile-nome" className="form-label">
                                    Nome Completo
                                </label>

                                <input
                                    id="profile-nome"
                                    type="text"
                                    className="form-control"
                                    value={editData.nome}
                                    onChange={event => setEditData({
                                        ...editData,
                                        nome: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="profile-cpf" className="form-label">
                                    CPF
                                </label>

                                <input
                                    id="profile-cpf"
                                    type="text"
                                    className="form-control"
                                    value={editData.cpf}
                                    onChange={event => setEditData({
                                        ...editData,
                                        cpf: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="profile-email" className="form-label">
                                    E-mail
                                </label>

                                <input
                                    id="profile-email"
                                    type="email"
                                    className="form-control"
                                    value={editData.email}
                                    onChange={event => setEditData({
                                        ...editData,
                                        email: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="profile-telefone" className="form-label">
                                    Telefone
                                </label>

                                <input
                                    id="profile-telefone"
                                    type="tel"
                                    className="form-control"
                                    value={editData.telefone}
                                    onChange={event => setEditData({
                                        ...editData,
                                        telefone: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="profile-senha" className="form-label">
                                    Senha
                                </label>

                                <input
                                    id="profile-senha"
                                    type="password"
                                    className="form-control"
                                    value={editData.senha}
                                    onChange={event => setEditData({
                                        ...editData,
                                        senha: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="profile-confirmarsenha" className="form-label">
                                    Confirmar Senha
                                </label>

                                <input
                                    id="profile-confirmarsenha"
                                    type="password"
                                    className="form-control"
                                    value={editData.confirmarsenha}
                                    onChange={event => setEditData({
                                        ...editData,
                                        confirmarsenha: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-12 mt-2">
                                <hr />
                                <h5 className="modal-subtitle">Endereço</h5>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="profile-endereco" className="form-label">
                                    Endereço
                                </label>

                                <input
                                    id="profile-endereco"
                                    type="text"
                                    className="form-control"
                                    value={editData.endereco}
                                    onChange={event => setEditData({
                                        ...editData,
                                        endereco: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="profile-cidade" className="form-label">
                                    Cidade
                                </label>

                                <input
                                    id="profile-cidade"
                                    type="text"
                                    className="form-control"
                                    value={editData.cidade}
                                    onChange={event => setEditData({
                                        ...editData,
                                        cidade: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="profile-estado" className="form-label">
                                    Estado
                                </label>

                                <input
                                    id="profile-estado"
                                    type="text"
                                    className="form-control"
                                    value={editData.estado}
                                    onChange={event => setEditData({
                                        ...editData,
                                        estado: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="profile-cep" className="form-label">
                                    CEP
                                </label>

                                <input
                                    id="profile-cep"
                                    type="text"
                                    className="form-control"
                                    value={editData.cep}
                                    onChange={event => setEditData({
                                        ...editData,
                                        cep: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-12 mt-2">
                                <hr />
                                <h5 className="modal-subtitle">Cartão Cadastrado</h5>
                            </div>

                            <div className="col-md-5">
                                <label htmlFor="profile-cartao" className="form-label">
                                    Número
                                </label>

                                <input
                                    id="profile-cartao"
                                    type="text"
                                    className="form-control"
                                    value={editData.cartao}
                                    onChange={event => setEditData({
                                        ...editData,
                                        cartao: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="profile-bandeira" className="form-label">
                                    Bandeira
                                </label>

                                <input
                                    id="profile-bandeira"
                                    type="text"
                                    className="form-control"
                                    value={editData.bandeira}
                                    onChange={event => setEditData({
                                        ...editData,
                                        bandeira: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="profile-validade" className="form-label">
                                    Validade
                                </label>

                                <input
                                    id="profile-validade"
                                    type="text"
                                    className="form-control"
                                    value={editData.validade}
                                    onChange={event => setEditData({
                                        ...editData,
                                        validade: event.target.value
                                    })}
                                />
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="profile-cvv" className="form-label">
                                    CVV
                                </label>

                                <input
                                    id="profile-cvv"
                                    type="password"
                                    className="form-control"
                                    value={editData.cvv}
                                    onChange={event => setEditData({
                                        ...editData,
                                        cvv: event.target.value
                                    })}
                                    maxLength={4}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setShowProfileModal(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="btn-primary"
                                onClick={handleSaveProfile}
                            >
                                Salvar alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showFavoritesModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowFavoritesModal(false)}
                >
                    <div
                        ref={favoritesModalRef}
                        className="modal-box modal-favorites"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="favorites-modal-title"
                        onClick={event => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="modal-close-x"
                            onClick={() => setShowFavoritesModal(false)}
                            aria-label="Fechar favoritos"
                        >
                            <i className="bi bi-x-lg" aria-hidden="true" />
                        </button>

                        <div className="favorites-modal-heading">
                            <p className="favorites-modal-eyebrow">
                                <span className="favorites-modal-eyebrow-line" />
                                Sua seleção especial
                            </p>

                            <h3
                                className="modal-title"
                                id="favorites-modal-title"
                            >
                                Meus <em>favoritos.</em>
                            </h3>

                            <p className="favorites-modal-description">
                                Um cantinho para guardar as flores, plantas e presentes
                                que você mais gostou.
                            </p>

                            <div className="favorites-modal-total">
                                <i className="bi bi-heart" aria-hidden="true" />

                                <span>
                                    {favoritesCount === 1
                                        ? '1 produto salvo'
                                        : `${favoritesCount} produtos salvos`}
                                </span>
                            </div>
                        </div>

                        {favorites.length === 0 ? (
                            <div className="favorites-empty-state">
                                <div className="favorites-empty-icon">
                                    <i
                                        className="bi bi-heart"
                                        aria-hidden="true"
                                    />
                                </div>

                                <h4>Sua lista está esperando por você.</h4>

                                <p>
                                    Ainda não há produtos favoritos. Explore nossa
                                    floricultura e guarde os que mais combinam com você.
                                </p>

                                <Link
                                    to="/"
                                    className="favorites-empty-link"
                                    onClick={() => setShowFavoritesModal(false)}
                                >
                                    Explorar produtos
                                    <i
                                        className="bi bi-arrow-up-right"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="favorites-list">
                                    {currentFavorites.map(item => (
                                        <article
                                            key={item.id}
                                            className="favorites-item"
                                            
                                        >
                                            <div className="favorites-image-wrap">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="favorites-thumb"
                                                    loading="lazy"
                                                    onClick={() => openProductModal(item)}
                                                />
                                            </div>

                                            <div className="favorites-info">
                                                <span className="favorites-item-label">
                                                    Selecionado por você
                                                </span>

                                                <h4 className="favorites-name">
                                                    {item.name}
                                                </h4>

                                                <span className="favorites-price">
                                                    {formatCurrency(item.price)}
                                                </span>
                                            </div>

                                            <div className="favorites-actions">
                                                <button
                                                    type="button"
                                                    className="favorites-action"
                                                    onClick={() => openProductModal(item)}
                                                    title="Ver detalhes"
                                                    aria-label={`Ver detalhes de ${item.name}`}
                                                >
                                                    <i
                                                        className="bi bi-eye"
                                                        aria-hidden="true"
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="favorites-action is-danger"
                                                    onClick={() => handleRemoveFavorite(item.id)}
                                                    title="Remover dos favoritos"
                                                    aria-label={`Remover ${item.name} dos favoritos`}
                                                >
                                                    <i
                                                        className="bi bi-heart-fill"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                <div className="favorites-footer">
                                    {renderPagination()}

                                    <p className="favorites-count">
                                        Mostrando {startIndex + 1}–{Math.min(
                                            startIndex + itemsPerPage,
                                            favorites.length
                                        )} de {favorites.length} produtos
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <ProductModal
                product={selectedProduct}
                isOpen={isProductModalOpen}
                onClose={closeProductModal}
                onAddToCart={addToCart}
                onAddMultiple={addMultipleToCart}
            />

            {showLogoutModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowLogoutModal(false)}
                >
                    <div
                        ref={logoutModalRef}
                        className="modal-box modal-small"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="logout-modal-title"
                        onClick={event => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="modal-close-x"
                            onClick={() => setShowLogoutModal(false)}
                            aria-label="Fechar"
                        >
                            <i className="bi bi-x-lg" aria-hidden="true" />
                        </button>

                        <div className="modal-confirm">
                            <i
                                className="bi bi-box-arrow-right modal-confirm-icon"
                                aria-hidden="true"
                            />

                            <h4
                                className="modal-title"
                                id="logout-modal-title"
                            >
                                Deseja sair?
                            </h4>

                            <p className="modal-text">
                                Tem certeza que deseja sair da sua conta?
                            </p>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="btn-primary"
                                onClick={handleLogout}
                            >
                                Confirmar saída
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;

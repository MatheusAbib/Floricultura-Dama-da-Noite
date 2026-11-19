import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import ProductModal from '../../components/ProductModal/ProductModal';
import Footer from '../../components/Footer/Footer';
import { products } from '../../data/products';
import { sementesProducts } from '../../data/sementesData';
import { presentesProducts } from '../../data/presentesData';
import { vasosProducts } from '../../data/vasosData';
import './Carrinho.scss';

const initialFormData = {
    name: '',
    address: '',
    city: '',
    state: '',
    zip: ''
};

const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
    'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
    'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const allProducts = [
    ...products,
    ...sementesProducts,
    ...presentesProducts,
    ...vasosProducts
];

function Carrinho() {
    const {
        cart,
        addToCart,
        addMultipleToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        showNotification
    } = useCart();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [showClearModal, setShowClearModal] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState(() => {
        try {
            const saved = localStorage.getItem('shippingFormData');

            if (saved) {
                return {
                    ...initialFormData,
                    ...JSON.parse(saved)
                };
            }
        } catch (error) {
            return initialFormData;
        }

        return initialFormData;
    });

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('shippingFormData', JSON.stringify(formData));
    }, [formData]);

    const itemCount = cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    const totals = useMemo(() => {
        const subtotal = getCartTotal();
        const shipping = subtotal > 100 ? 0 : 15;
        const discount = subtotal > 150 ? subtotal * 0.1 : 0;

        return {
            subtotal,
            shipping,
            discount,
            total: subtotal + shipping - discount
        };
    }, [cart, getCartTotal]);

    const freeShippingRemaining = Math.max(0, 100.01 - totals.subtotal);
    const hasFreeShipping = totals.shipping === 0;
    const shippingProgress = Math.min(
        100,
        (totals.subtotal / 100.01) * 100
    );

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleZipChange = (event) => {
        const digits = event.target.value.replace(/\D/g, '').slice(0, 8);
        const formatted = digits.length > 5
            ? `${digits.slice(0, 5)}-${digits.slice(5)}`
            : digits;

        setFormData((previous) => ({
            ...previous,
            zip: formatted
        }));
    };

    const handleQuantityChange = (item, quantity) => {
        if (quantity < 1 || quantity > 10) return;

        updateQuantity(item.id, quantity);

        showNotification(
            `Quantidade de ${item.name} atualizada para ${quantity}`,
            'success'
        );
    };

    const confirmRemove = () => {
        if (!itemToRemove) return;

        removeFromCart(itemToRemove.id);
        showNotification(
            `${itemToRemove.name} removido do carrinho!`,
            'success'
        );

        setItemToRemove(null);
    };

    const handleClearCart = () => {
        clearCart();
        showNotification('Carrinho limpo com sucesso!', 'success');
        setShowClearModal(false);
    };

    const openModal = (item) => {
        const fullProduct = allProducts.find(
            (product) => product.id === item.id
        );

        setSelectedProduct(fullProduct || item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleCheckout = (event) => {
        event.preventDefault();

        if (cart.length === 0) return;

        localStorage.setItem('customerData', JSON.stringify(formData));
        localStorage.setItem('cart', JSON.stringify(cart));

        navigate('/pagamento');
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <i className="bi bi-flower1 loading-logo" />
            </div>
        );
    }

    return (
        <div className="carrinho-page">
            <main className="cart-container">
                <div className="cart-intro">
                    <div className="cart-intro-copy">
                        <div className="cart-eyebrow">
                            <span className="cart-eyebrow-line" />
                            <span>Seu pedido</span>
                        </div>

                        <h1 className="cart-title">
                            Seu carrinho<span>.</span>
                        </h1>

                        <p className="cart-subtitle">
                            Confira suas escolhas e prepare tudo para a entrega.
                        </p>
                    </div>

                    <Link to="/" className="cart-back-link">
                        <i className="bi bi-arrow-left" aria-hidden="true" />
                        Continuar explorando
                    </Link>
                </div>

                <div className="cart-progress">
                    <div className="cart-progress-step is-current">
                        <span className="cart-progress-number">01</span>
                        <span>Carrinho</span>
                    </div>

                    <span className="cart-progress-divider" />

                    <div className="cart-progress-step">
                        <span className="cart-progress-number">02</span>
                        <span>Pagamento</span>
                    </div>

                    <span className="cart-progress-divider" />

                    <div className="cart-progress-step">
                        <span className="cart-progress-number">03</span>
                        <span>Confirmação</span>
                    </div>
                </div>

                {cart.length === 0 ? (
                    <section className="cart-empty">
                        <div className="cart-empty-art">
                            <div className="cart-empty-art-inner">
                                <i className="bi bi-bag-heart" aria-hidden="true" />
                            </div>
                            <span className="cart-empty-art-decoration decoration-one" />
                            <span className="cart-empty-art-decoration decoration-two" />
                        </div>

                        <div className="cart-empty-content">
                            <span className="cart-section-eyebrow">
                                Sua seleção está esperando
                            </span>

                            <h2>Ainda não há flores por aqui.</h2>

                            <p>
                                Explore nosso acervo e escolha plantas, flores
                                e presentes para tornar qualquer momento especial.
                            </p>

                            <Link to="/" className="cart-primary-button">
                                Explorar produtos
                                <i className="bi bi-arrow-up-right" aria-hidden="true" />
                            </Link>
                        </div>
                    </section>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-content">
                            <section className="cart-products-section">
                                <div className="cart-section-heading">
                                    <div>
                                        <span className="cart-section-eyebrow">
                                            Suas escolhas
                                        </span>

                                        <h2>Produtos selecionados</h2>
                                    </div>

                                    <span className="cart-items-counter">
                                        {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                                    </span>
                                </div>

                                <div className="cart-products">
                                    {cart.map((item) => (
                                        <article className="cart-product" key={item.id}>
                                            <button
                                                type="button"
                                                className="cart-product-image-button"
                                                onClick={() => openModal(item)}
                                                aria-label={`Ver detalhes de ${item.name}`}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="cart-product-image"
                                                />
                                            </button>

                                            <div className="cart-product-details">
                                                <div className="cart-product-heading">
                                                    <div className="cart-product-description">
                                                        <span className="cart-product-label">
                                                            Selecionado para você
                                                        </span>

                                                        <h3>{item.name}</h3>

                                                        <span className="cart-product-code">
                                                            Ref. {item.id}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="cart-product-remove"
                                                        onClick={() => setItemToRemove(item)}
                                                        aria-label={`Remover ${item.name} do carrinho`}
                                                        title="Remover produto"
                                                    >
                                                        <i className="bi bi-trash3" aria-hidden="true" />
                                                    </button>
                                                </div>

                                                <div className="cart-product-unit-price">
                                                    Valor unitário
                                                    <strong>{formatCurrency(item.price)}</strong>
                                                </div>

                                                <div className="cart-product-footer">
                                                    <div className="cart-product-quantity-group">
                                                        <span className="cart-product-field-label">
                                                            Quantidade
                                                        </span>

                                                        <div className="cart-quantity">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                aria-label={`Diminuir quantidade de ${item.name}`}
                                                            >
                                                                <i className="bi bi-dash" aria-hidden="true" />
                                                            </button>

                                                            <span aria-live="polite">
                                                                {item.quantity}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                                disabled={item.quantity >= 10}
                                                                aria-label={`Aumentar quantidade de ${item.name}`}
                                                            >
                                                                <i className="bi bi-plus" aria-hidden="true" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="cart-product-subtotal">
                                                        <span className="cart-product-field-label">
                                                            Total do produto
                                                        </span>

                                                        <strong>
                                                            {formatCurrency(item.price * item.quantity)}
                                                        </strong>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="cart-product-details-link"
                                                    onClick={() => openModal(item)}
                                                >
                                                    Ver detalhes
                                                    <i className="bi bi-arrow-up-right" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                <div className="cart-products-actions">
                                    <Link to="/" className="cart-text-link">
                                        <i className="bi bi-arrow-left" aria-hidden="true" />
                                        Continuar comprando
                                    </Link>

                                    <button
                                        type="button"
                                        className="cart-clear-button"
                                        onClick={() => setShowClearModal(true)}
                                    >
                                        <i className="bi bi-trash3" aria-hidden="true" />
                                        Esvaziar carrinho
                                    </button>
                                </div>
                            </section>

                            <section className="cart-delivery-section">
                                <div className="cart-section-heading">
                                    <div>
                                        <span className="cart-section-eyebrow">
                                            Próximo passo
                                        </span>

                                        <h2>Dados de entrega</h2>
                                    </div>

                                    <div className="cart-delivery-icon">
                                        <i className="bi bi-truck" aria-hidden="true" />
                                    </div>
                                </div>

                                <p className="cart-delivery-description">
                                    Informe onde deseja receber seu pedido.
                                    Esses dados serão utilizados na finalização da compra.
                                </p>

                                <form
                                    id="cart-checkout-form"
                                    className="cart-delivery-form"
                                    onSubmit={handleCheckout}
                                >
                                    <div className="cart-field">
                                        <label htmlFor="customer-name">
                                            Nome completo <span>*</span>
                                        </label>

                                        <input
                                            id="customer-name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Nome de quem receberá o pedido"
                                            autoComplete="name"
                                            required
                                        />
                                    </div>

                                    <div className="cart-field">
                                        <label htmlFor="customer-address">
                                            Endereço de entrega <span>*</span>
                                        </label>

                                        <input
                                            id="customer-address"
                                            name="address"
                                            type="text"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Rua, número e complemento"
                                            autoComplete="street-address"
                                            required
                                        />
                                    </div>

                                    <div className="cart-field-row">
                                        <div className="cart-field">
                                            <label htmlFor="customer-city">
                                                Cidade <span>*</span>
                                            </label>

                                            <input
                                                id="customer-city"
                                                name="city"
                                                type="text"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="Sua cidade"
                                                autoComplete="address-level2"
                                                required
                                            />
                                        </div>

                                        <div className="cart-field">
                                            <label htmlFor="customer-state">
                                                Estado <span>*</span>
                                            </label>

                                            <select
                                                id="customer-state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                autoComplete="address-level1"
                                                required
                                            >
                                                <option value="">Selecione</option>

                                                {states.map((state) => (
                                                    <option key={state} value={state}>
                                                        {state}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="cart-field cart-field-zip">
                                        <label htmlFor="customer-zip">
                                            CEP <span>*</span>
                                        </label>

                                        <input
                                            id="customer-zip"
                                            name="zip"
                                            type="text"
                                            inputMode="numeric"
                                            value={formData.zip}
                                            onChange={handleZipChange}
                                            placeholder="00000-000"
                                            autoComplete="postal-code"
                                            maxLength={9}
                                            pattern="[0-9]{5}-[0-9]{3}"
                                            title="Informe um CEP no formato 00000-000"
                                            required
                                        />
                                    </div>
                                </form>
                            </section>
                        </div>

                        <aside className="cart-sidebar">
                            <div className="cart-summary">
                                <div className="cart-summary-header">
                                    <span className="cart-section-eyebrow">
                                        Sua compra
                                    </span>

                                    <h2>Resumo do pedido</h2>

                                    <p>
                                        Confira os valores antes de continuar.
                                    </p>
                                </div>

                                <div className="cart-summary-items">
                                    <div className="cart-summary-row">
                                        <span>
                                            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
                                        </span>
                                        <strong>{formatCurrency(totals.subtotal)}</strong>
                                    </div>

                                    <div className="cart-summary-row">
                                        <span>Entrega</span>
                                        <strong className={hasFreeShipping ? 'is-free' : ''}>
                                            {hasFreeShipping
                                                ? 'Grátis'
                                                : formatCurrency(totals.shipping)}
                                        </strong>
                                    </div>

                                    <div className="cart-summary-row">
                                        <span>Desconto</span>
                                        <strong className={totals.discount > 0 ? 'is-discount' : ''}>
                                            {totals.discount > 0
                                                ? `− ${formatCurrency(totals.discount)}`
                                                : '—'}
                                        </strong>
                                    </div>
                                </div>

                                <div className="cart-summary-total">
                                    <span>Total do pedido</span>
                                    <strong>{formatCurrency(totals.total)}</strong>
                                </div>

                                <div className="cart-shipping-benefit">
                                    <div className="cart-shipping-benefit-heading">
                                        <i className="bi bi-truck" aria-hidden="true" />

                                        <span>
                                            {hasFreeShipping
                                                ? 'Você ganhou frete grátis!'
                                                : `Faltam ${formatCurrency(freeShippingRemaining)} para frete grátis`}
                                        </span>
                                    </div>

                                    <div
                                        className="cart-shipping-progress"
                                        role="progressbar"
                                        aria-valuenow={Math.round(shippingProgress)}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label="Progresso para frete grátis"
                                    >
                                        <span style={{ width: `${shippingProgress}%` }} />
                                    </div>
                                </div>

                                {totals.discount > 0 && (
                                    <div className="cart-discount-note">
                                        <i className="bi bi-check-circle" aria-hidden="true" />
                                        Desconto de 10% aplicado ao pedido.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    form="cart-checkout-form"
                                    className="cart-primary-button cart-checkout-button"
                                >
                                    Ir para pagamento
                                    <i className="bi bi-arrow-right" aria-hidden="true" />
                                </button>

                                <p className="cart-checkout-note">
                                    <i className="bi bi-shield-check" aria-hidden="true" />
                                    Revise seus dados antes de prosseguir.
                                </p>
                            </div>

                            <div className="cart-sidebar-message">
                                <i className="bi bi-flower1" aria-hidden="true" />

                                <p>
                                    Cada escolha é uma forma de demonstrar carinho.
                                </p>
                            </div>
                        </aside>
                    </div>
                )}
            </main>

            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={closeModal}
                onAddToCart={addToCart}
                onAddMultiple={addMultipleToCart}
            />

            {itemToRemove && (
                <div
                    className="cart-dialog-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setItemToRemove(null);
                        }
                    }}
                >
                    <div
                        className="cart-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cart-remove-title"
                    >
                        <button
                            type="button"
                            className="cart-dialog-close"
                            onClick={() => setItemToRemove(null)}
                            aria-label="Fechar"
                        >
                            <i className="bi bi-x-lg" aria-hidden="true" />
                        </button>

                        <div className="cart-dialog-icon">
                            <i className="bi bi-trash3" aria-hidden="true" />
                        </div>

                        <span className="cart-section-eyebrow">
                            Confirmar alteração
                        </span>

                        <h2 id="cart-remove-title">
                            Remover este produto?
                        </h2>

                        <p>
                            Deseja remover <strong>{itemToRemove.name}</strong> da
                            sua seleção?
                        </p>

                        <div className="cart-dialog-actions">
                            <button
                                type="button"
                                className="cart-dialog-cancel"
                                onClick={() => setItemToRemove(null)}
                            >
                                Manter produto
                            </button>

                            <button
                                type="button"
                                className="cart-dialog-confirm"
                                onClick={confirmRemove}
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showClearModal && (
                <div
                    className="cart-dialog-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setShowClearModal(false);
                        }
                    }}
                >
                    <div
                        className="cart-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cart-clear-title"
                    >
                        <button
                            type="button"
                            className="cart-dialog-close"
                            onClick={() => setShowClearModal(false)}
                            aria-label="Fechar"
                        >
                            <i className="bi bi-x-lg" aria-hidden="true" />
                        </button>

                        <div className="cart-dialog-icon">
                            <i className="bi bi-bag-x" aria-hidden="true" />
                        </div>

                        <span className="cart-section-eyebrow">
                            Confirmar alteração
                        </span>

                        <h2 id="cart-clear-title">
                            Esvaziar seu carrinho?
                        </h2>

                        <p>
                            Todos os produtos selecionados serão removidos.
                            Essa ação não pode ser desfeita.
                        </p>

                        <div className="cart-dialog-actions">
                            <button
                                type="button"
                                className="cart-dialog-cancel"
                                onClick={() => setShowClearModal(false)}
                            >
                                Manter produtos
                            </button>

                            <button
                                type="button"
                                className="cart-dialog-confirm"
                                onClick={handleClearCart}
                            >
                                Esvaziar carrinho
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Carrinho;
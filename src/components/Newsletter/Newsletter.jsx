
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './Newsletter.scss';

function Newsletter() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const { showNotification } = useCart();

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!emailValido) {
            setError(true);
            return;
        }

        setError(false);
        showNotification('Inscrição realizada com sucesso! Você receberá nossas novidades.', 'success');
        setEmail('');
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-frame">
                <div className="newsletter-content">
                    <div className="newsletter-text-column">
                        <p className="newsletter-eyebrow">
                            <span className="newsletter-eyebrow-line" />
                            Fique por dentro
                        </p>

                        <h2 className="newsletter-title">
                            Um pouco mais de{' '}
                            <em className="newsletter-hand">natureza</em>
                            {' '}na sua caixa de entrada.
                        </h2>

                        <p className="newsletter-text">
                            Novidades da floricultura, inspirações para presentear
                            e dicas para cuidar das suas plantas. Tudo isso,
                            de vez em quando, no seu e-mail.
                        </p>

                    </div>

                    <div className="newsletter-form-column">
                        <div className="newsletter-form-heading">
                            <span className="newsletter-form-number">01 / NOVEDADES</span>
                            <h3>Faça parte da nossa lista</h3>
                            <p>Inscreva-se para receber nossas novidades.</p>
                        </div>

                        <form className="newsletter-form" onSubmit={handleSubmit}>
                            <div className="newsletter-field">
                                <label htmlFor="newsletter-email" className="newsletter-label">
                                    Seu melhor e-mail
                                </label>

                                <div className="newsletter-input-group">
                                    <input
                                        id="newsletter-email"
                                        type="email"
                                        className={`newsletter-input ${error ? 'is-invalid' : ''}`}
                                        placeholder="voce@email.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError(false);
                                        }}
                                        aria-invalid={error}
                                        aria-describedby={error ? 'newsletter-error' : undefined}
                                        required
                                    />

                                    <button className="newsletter-btn" type="submit">
                                        <span>Inscrever-se</span>
                                        <i className="bi bi-arrow-up-right" aria-hidden="true" />
                                    </button>
                                </div>

                                {error && (
                                    <p id="newsletter-error" className="newsletter-error">
                                        Por favor, insira um e-mail válido.
                                    </p>
                                )}
                            </div>

                            <label className="newsletter-check">
                                <input
                                    type="checkbox"
                                    className="newsletter-checkbox"
                                    required
                                />
                                <span className="newsletter-check-label">
                                    Concordo em receber comunicações da Floricultura Dama da Noite.
                                </span>
                            </label>
                        </form>
                    </div>
                </div>

                <div className="newsletter-frame-footer">
                    <span>Floricultura Dama da Noite</span>
                    <i className="bi bi-flower1" aria-hidden="true" />
                    <span>Flores, plantas e afeto</span>
                </div>
            </div>
        </section>
    );
}

export default Newsletter;

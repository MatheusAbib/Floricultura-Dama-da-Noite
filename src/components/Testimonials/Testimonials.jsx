
import React from 'react';
import './Testimonials.scss';

function Testimonials({ testimonials = [] }) {
    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <div className="testimonials-heading">
                        <p className="testimonials-eyebrow">
                            <span className="testimonials-eyebrow-line" />
                            Quem já adotou
                        </p>

                        <h2 className="testimonials-title">
                            Histórias que florescem{' '}
                            <em className="testimonials-hand">por aqui.</em>
                        </h2>

                        <p className="testimonials-description">
                            Cada planta encontra um novo lar. E cada cliente
                            tem uma história para compartilhar.
                        </p>
                    </div>

                    <div className="testimonials-header-decoration" aria-hidden="true">
                        <i className="bi bi-chat-quote" />
                        <span>Palavras de quem confia na gente</span>
                    </div>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <article
                            className="testimonial-card"
                            key={testimonial.id ?? index}
                        >
                            <div className="testimonial-card-top">
                                <span className="testimonial-number">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <i
                                    className="bi bi-quote testimonial-quote"
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="testimonial-card-content">
                                <p className="testimonial-text">
                                    {testimonial.text}
                                </p>
                            </div>

                            <div className="testimonial-author">
                                <img
                                    src={testimonial.image}
                                    className="testimonial-author-img"
                                    alt={testimonial.author}
                                    loading="lazy"
                                    decoding="async"
                                />

                                <div className="testimonial-author-info">
                                    <h3 className="testimonial-author-name">
                                        {testimonial.author}
                                    </h3>

                                    <p className="testimonial-author-location">
                                        <i
                                            className="bi bi-geo-alt"
                                            aria-hidden="true"
                                        />
                                        {testimonial.location}
                                    </p>
                                </div>

                                <i
                                    className="bi bi-flower1 testimonial-author-decoration"
                                    aria-hidden="true"
                                />
                            </div>
                        </article>
                    ))}
                </div>

                <div className="testimonials-footer">
                    <span className="testimonials-footer-line" />

                    <div className="testimonials-footer-message">
                        <i className="bi bi-flower1" aria-hidden="true" />
                        <span>Feito com carinho, compartilhado com afeto.</span>
                    </div>

                    <span className="testimonials-footer-line" />
                </div>
            </div>
        </section>
    );
}

export default Testimonials;

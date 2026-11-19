
import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HeroCarousel.scss';

const BASE = '/Floricultura-Dama-da-Noite/assets/Carrossel/';

const slides = {
    home: [
        {
            eyebrow: 'Flores frescas e arranjos',
            title: 'Flores para',
            highlight: 'cada ocasião.',
            description: 'Escolha entre flores, buquês e arranjos para presentear, decorar ou simplesmente levar mais cor para casa.',
            buttonLabel: 'Conhecer flores',
            buttonLink: '#lista-plantas',
            image: `${BASE}campo-de-flores.jpg`,
            imageAlt: 'Campo de flores coloridas',
            theme: 'floral',
            category: 'Flores & arranjos'
        },
        {
            eyebrow: 'Plantas ornamentais',
            title: 'Sua casa pede',
            highlight: 'mais verde.',
            description: 'Plantas para salas, varandas e pequenos espaços. Encontre espécies que combinam com seu ambiente.',
            buttonLabel: 'Explorar plantas',
            buttonLink: '#lista-plantas',
            image: `${BASE}Plantas-variadas.jpg`,
            imageAlt: 'Plantas ornamentais em vasos',
            theme: 'botanical',
            category: 'Plantas & decoração'
        },
        {
            eyebrow: 'Buquês e presentes',
            title: 'Flores dizem',
            highlight: 'muita coisa.',
            description: 'Buquês, arranjos e combinações para aniversários, agradecimentos e outras ocasiões especiais.',
            buttonLabel: 'Escolher presente',
            buttonLink: '/presentes',
            image: `${BASE}Presente-flores.jpg`,
            imageAlt: 'Arranjo floral para presente',
            theme: 'gifts',
            category: 'Presentes & flores'
        }
    ],
    sementes: [
        {
            eyebrow: 'Sementes para cultivo',
            title: 'Seu jardim',
            highlight: 'começa aqui.',
            description: 'Escolha sementes de flores e plantas para cultivar em vasos, canteiros ou no quintal.',
            buttonLabel: 'Ver sementes',
            buttonLink: '#product-grid',
            image: `${BASE}Sementes.jpg`,
            imageAlt: 'Seleção de sementes para cultivo',
            theme: 'botanical',
            category: 'Sementes & cultivo'
        },
        {
            eyebrow: 'Flores e jardinagem',
            title: 'Da semente',
            highlight: 'à primeira flor.',
            description: 'Explore variedades para plantar, acompanhar o crescimento e montar seu próprio jardim.',
            buttonLabel: 'Explorar variedades',
            buttonLink: '#product-grid',
            image: `${BASE}Banner-Sementes.jpg`,
            imageAlt: 'Sementes para jardinagem',
            theme: 'floral',
            category: 'Jardinagem'
        }
    ],
    presentes: [
        {
            eyebrow: 'Flores para presentear',
            title: 'Um buquê',
            highlight: 'diz muito.',
            description: 'Encontre arranjos e buquês para aniversários, comemorações ou para surpreender alguém.',
            buttonLabel: 'Escolher presente',
            buttonLink: '#product-grid',
            image: `${BASE}Presente-flores.jpg`,
            imageAlt: 'Presente com flores',
            theme: 'gifts',
            category: 'Buquês & presentes'
        },
        {
            eyebrow: 'Cestas e kits especiais',
            title: 'Flores, doces',
            highlight: 'e companhia.',
            description: 'Conheça combinações de flores, chocolates e outros itens para montar um presente completo.',
            buttonLabel: 'Ver kits',
            buttonLink: '#product-grid',
            image: `${BASE}Food-gift.png`,
            imageAlt: 'Kit especial para presente',
            theme: 'floral',
            category: 'Cestas & kits'
        }
    ],
    vasos: [
        {
            eyebrow: 'Vasos decorativos',
            title: 'O vaso certo',
            highlight: 'faz diferença.',
            description: 'Modelos de diferentes tamanhos e estilos para acomodar suas plantas e complementar a decoração.',
            buttonLabel: 'Ver modelos',
            buttonLink: '#product-grid',
            image: `${BASE}Vasos-diversos.png`,
            imageAlt: 'Coleção de vasos decorativos',
            theme: 'botanical',
            category: 'Vasos & decoração'
        },
        {
            eyebrow: 'Vasos recicláveis',
            title: 'Novos usos,',
            highlight: 'novos vasos.',
            description: 'Explore opções produzidas com materiais reaproveitados para cultivar plantas de outra maneira.',
            buttonLabel: 'Conhecer vasos',
            buttonLink: '#product-grid',
            image: `${BASE}Vasos-Reciclaveis.jpg`,
            imageAlt: 'Vasos produzidos com materiais recicláveis',
            theme: 'gifts',
            category: 'Vasos recicláveis'
        }
    ]
};

function HeroCarousel({ page = 'home' }) {
    const currentSlides = slides[page] || slides.home;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [reducedMotion, setReducedMotion] = useState(false);
    const touchStartX = useRef(null);
    const carouselId = useId().replace(/:/g, '');
    const total = currentSlides.length;

    useEffect(() => {
        setActiveIndex(0);
    }, [page]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const updateMotion = () => {
            setReducedMotion(mediaQuery.matches);
        };

        updateMotion();
        mediaQuery.addEventListener('change', updateMotion);

        return () => {
            mediaQuery.removeEventListener('change', updateMotion);
        };
    }, []);

    useEffect(() => {
        const updateVisibility = () => {
            setIsVisible(document.visibilityState === 'visible');
        };

        document.addEventListener('visibilitychange', updateVisibility);

        return () => {
            document.removeEventListener('visibilitychange', updateVisibility);
        };
    }, []);

    useEffect(() => {
        if (isPaused || !isVisible || reducedMotion || total < 2) {
            return;
        }

        const interval = window.setInterval(() => {
            setActiveIndex(index => (index + 1) % total);
        }, 6500);

        return () => window.clearInterval(interval);
    }, [isPaused, isVisible, reducedMotion, total, page]);

    const goToSlide = index => {
        setActiveIndex((index + total) % total);
    };

    const nextSlide = () => {
        setActiveIndex(index => (index + 1) % total);
    };

    const previousSlide = () => {
        setActiveIndex(index => (index - 1 + total) % total);
    };

    const handleTouchStart = event => {
        touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = event => {
        if (touchStartX.current === null) return;

        const difference = touchStartX.current - event.changedTouches[0].clientX;

        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                nextSlide();
            } else {
                previousSlide();
            }
        }

        touchStartX.current = null;
    };

    const renderButton = slide => {
        const content = (
            <>
                <span>{slide.buttonLabel}</span>
                <i className="bi bi-arrow-up-right" aria-hidden="true" />
            </>
        );

        if (slide.buttonLink.startsWith('#')) {
            return (
                <a href={slide.buttonLink} className="hero-cta">
                    {content}
                </a>
            );
        }

        return (
            <Link to={slide.buttonLink} className="hero-cta">
                {content}
            </Link>
        );
    };

    return (
        <section
            className={`hero-carousel hero-campaign hero-campaign--${page}`}
            aria-label="Coleções em destaque"
            aria-roledescription="carrossel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={event => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsPaused(false);
                }
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="hero-campaign-stage">
                {currentSlides.map((slide, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <div
                            key={`${page}-${index}`}
                            id={`${carouselId}-slide-${index}`}
                            className={`hero-slide hero-slide--${slide.theme} ${isActive ? 'is-active' : ''}`}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${index + 1} de ${total}`}
                            aria-hidden={!isActive}
                            inert={!isActive}
                        >
                            <div className="hero-visual">
                                <img
                                    src={slide.image}
                                    alt={slide.imageAlt}
                                    className="hero-image"
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                    fetchPriority={index === 0 ? 'high' : 'auto'}
                                />

                                <span
                                    className="hero-image-overlay"
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="hero-campaign-inner">
                                <div className="hero-content">
                                    <div className="hero-content-inner">
                                        <div className="hero-eyebrow">
                                            <span className="hero-eyebrow-line" />
                                            <span>{slide.eyebrow}</span>
                                        </div>

                                        <h1 className="hero-title">
                                            <span>{slide.title}</span>
                                            <em>{slide.highlight}</em>
                                        </h1>

                                        <p className="hero-description">
                                            {slide.description}
                                        </p>

                                        {renderButton(slide)}
                                    </div>
                                </div>
                            </div>

                            <div className="hero-slide-category">
                                <span className="hero-slide-category-line" />
                                <span>{slide.category}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {total > 1 && (
                <div className="hero-campaign-navigation">
                    <button
                        type="button"
                        className="hero-nav-arrow hero-nav-arrow--prev"
                        onClick={previousSlide}
                        aria-label="Slide anterior"
                    >
                        <i className="bi bi-arrow-left" aria-hidden="true" />
                    </button>

                    <div
                        className="hero-campaign-indicators"
                        role="group"
                        aria-label="Selecionar destaque"
                    >
                        {currentSlides.map((slide, index) => (
                            <button
                                key={`${page}-indicator-${index}`}
                                type="button"
                                className={`hero-campaign-indicator ${index === activeIndex ? 'is-active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Ir para destaque ${index + 1}`}
                                aria-current={index === activeIndex ? 'true' : undefined}
                            >
                                <span className="hero-indicator-number">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <span className="hero-indicator-line" />
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="hero-nav-arrow hero-nav-arrow--next"
                        onClick={nextSlide}
                        aria-label="Próximo slide"
                    >
                        <i className="bi bi-arrow-right" aria-hidden="true" />
                    </button>
                </div>
            )}
        </section>
    );
}

export default HeroCarousel;

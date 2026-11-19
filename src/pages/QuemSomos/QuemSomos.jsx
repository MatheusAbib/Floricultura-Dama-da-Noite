
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '../../components/FadeIn/FadeIn';
import Footer from '../../components/Footer/Footer';
import './QuemSomos.scss';

const milestones = [
    {
        year: '2018',
        title: 'Abertura',
        description: 'Loja aberta em uma sala alugada no centro, com um balcão de flores de corte e um freezer de bebidas.'
    },
    {
        year: '2019',
        title: 'Primeira contratação',
        description: 'Entrou a primeira florista fixa. Ampliamos o horário de atendimento e passamos a abrir aos sábados.'
    },
    {
        year: '2020',
        title: 'Loja online',
        description: 'Com as restrições sanitárias, criamos o site para pedidos por telefone e entrega. A operação passou a funcionar sem contato.'
    },
    {
        year: '2022',
        title: 'Mudança de endereço',
        description: 'Saímos do ponto alugado e inauguramos o espaço atual, com 120 m² e estacionamento próprio.'
    },
    {
        year: '2023',
        title: 'Centro de distribuição',
        description: 'Inauguramos o galpão de separação e expedição, o que permitiu reduzir o prazo de entrega para o mesmo dia em toda a região.'
    }
];

function QuemSomos() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="loading-overlay">
                <i className="bi bi-flower1 loading-logo" aria-hidden="true" />
            </div>
        );
    }

    return (
        <div className="quem-somos-page">
            <main>
                <section className="qs-hero">
                    <div className="qs-hero-content">
                        <FadeIn direction="down">
                            <p className="qs-eyebrow qs-eyebrow-light">
                                <span className="qs-eyebrow-line" />
                                Desde 2018
                            </p>
                        </FadeIn>

                        <FadeIn direction="up" delay={100}>
                            <h1 className="qs-hero-title">
                                Sobre a <em className="qs-hand">floricultura.</em>
                            </h1>
                        </FadeIn>

                        <FadeIn direction="up" delay={200}>
                            <p className="qs-hero-text">
                                Flores, plantas e presentes fazem parte da nossa
                                história em Mogi das Cruzes desde 2018.
                            </p>
                        </FadeIn>
                    </div>

                    <div className="qs-hero-bottom" aria-hidden="true">
                        <span>Floricultura Dama da Noite</span>
                        <i className="bi bi-flower1" />
                        <span>Mogi das Cruzes · SP</span>
                    </div>
                </section>

                <section className="qs-intro-section">
                    <div className="qs-intro-inner">
                        <div className="qs-intro-heading">
                            <FadeIn direction="up">
                                <p className="qs-eyebrow">
                                    <span className="qs-eyebrow-line" />
                                    01 / A floricultura
                                </p>

                                <h2 className="qs-section-title">
                                    O que <em className="qs-hand">fazemos.</em>
                                </h2>
                            </FadeIn>
                        </div>

                        <div className="qs-intro-content">
                            <FadeIn direction="up" delay={100}>
                                <p className="qs-intro-lead">
                                    Trabalhamos com flores, plantas e presentes
                                    para diferentes momentos do dia a dia.
                                </p>
                            </FadeIn>

                            <FadeIn direction="up" delay={200}>
                                <p>
                                    A Dama da Noite trabalha com plantas, flores
                                    de corte, vasos, sementes e presentes montados.
                                    A maior parte do que vendemos sai do nosso
                                    próprio cultivo ou de produtores da região.
                                </p>

                                <p>
                                    Atendemos em loja e por entrega. Pedidos até
                                    as 15h saem no mesmo dia para Mogi das Cruzes
                                    e cidades vizinhas. Arranjos personalizados
                                    precisam de 24h de antecedência.
                                </p>
                            </FadeIn>

                            <FadeIn direction="up" delay={300}>
                                <Link to="/contato" className="qs-cta">
                                    <span>Fale conosco</span>
                                    <i className="bi bi-arrow-up-right" aria-hidden="true" />
                                </Link>
                            </FadeIn>
                        </div>
                    </div>

                    <div className="qs-intro-footer">
                        <span>Desde 2018</span>
                        <span className="qs-intro-footer-line" />
                        <i className="bi bi-flower1" aria-hidden="true" />
                        <span className="qs-intro-footer-line" />
                        <span>Feito em Mogi das Cruzes</span>
                    </div>
                </section>

                <section className="qs-location-section">
                    <div className="qs-location-inner">
                        <div className="qs-location-heading">
                            <FadeIn direction="up">
                                <p className="qs-eyebrow">
                                    <span className="qs-eyebrow-line" />
                                    02 / Nossa loja
                                </p>

                                <h2 className="qs-section-title">
                                    Um lugar para <em className="qs-hand">visitar.</em>
                                </h2>

                                <p className="qs-location-description">
                                    Nosso espaço de 120 m² fica na Rua Jurandyr
                                    de Oliveira, com estacionamento na frente
                                    e atendimento de segunda a sábado.
                                </p>

                                <p className="qs-location-description">
                                    Vasos decorativos, ferramentas de jardinagem
                                    e itens para presente ficam na área da frente.
                                </p>
                            </FadeIn>
                        </div>

                        <div className="qs-location-panel">
                            <div className="qs-location-panel-top">
                                <span>Visite a Dama da Noite</span>
                                <i className="bi bi-geo-alt" aria-hidden="true" />
                            </div>

                            <div className="qs-location-panel-content">
                                <span className="qs-location-label">
                                    Nosso endereço
                                </span>

                                <h3>
                                    Mogi das <em className="qs-hand">Cruzes.</em>
                                </h3>

                                <address className="qs-location-address">
                                    Rua Jurandyr de Oliveira, 83
                                    <span>Mogi das Cruzes - SP</span>
                                    <span>CEP 08773-000</span>
                                </address>
                            </div>

                            <a
                                className="qs-location-link"
                                href="https://www.google.com/maps/search/?api=1&query=Rua+Jurandyr+de+Oliveira+83+Mogi+das+Cruzes+SP"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ver localização
                                <i className="bi bi-arrow-up-right" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </section>

                <section className="qs-timeline-section">
                    <div className="qs-timeline-inner">
                        <div className="qs-timeline-header">
                            <FadeIn direction="up">
                                <p className="qs-eyebrow">
                                    <span className="qs-eyebrow-line" />
                                    03 / Nossa trajetória
                                </p>

                                <h2 className="qs-section-title">
                                    Uma história construída <em className="qs-hand">aos poucos.</em>
                                </h2>

                                <p className="qs-timeline-description">
                                    Alguns dos momentos que marcaram o crescimento
                                    da nossa floricultura.
                                </p>
                            </FadeIn>
                        </div>

                        <ol className="qs-timeline">
                            {milestones.map((milestone, index) => (
                                <li className="qs-timeline-item" key={milestone.year}>
                                    <span className="qs-timeline-index">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <span className="qs-timeline-year">
                                        {milestone.year}
                                    </span>

                                    <div className="qs-timeline-body">
                                        <h3 className="qs-timeline-title">
                                            {milestone.title}
                                        </h3>

                                        <p>{milestone.description}</p>
                                    </div>

                                </li>
                            ))}
                        </ol>

                        <div className="qs-timeline-footer">
                            <i className="bi bi-flower1" aria-hidden="true" />
                            <span>Continuamos cultivando nossa história.</span>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default QuemSomos;

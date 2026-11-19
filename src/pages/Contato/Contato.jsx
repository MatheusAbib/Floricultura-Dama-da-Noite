
import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import FadeIn from '../../components/FadeIn/FadeIn';
import Footer from '../../components/Footer/Footer';
import './Contato.scss';

const initialFormData = {
    nome: '',
    email: '',
    telefone: '',
    assunto: 'Dúvida',
    mensagem: ''
};

const contactChannels = [
    {
        number: '01',
        icon: 'bi-telephone',
        title: 'Telefone',
        description: 'Para conversar diretamente com nossa equipe.',
        lines: [
            '(11) 4799-9999',
            'Segunda a sexta, 9h às 18h',
            'Sábado, 9h às 13h'
        ],
        link: 'tel:+551147999999',
        linkLabel: 'Ligar para a loja'
    },
    {
        number: '02',
        icon: 'bi-envelope',
        title: 'E-mail',
        description: 'Para dúvidas, sugestões e solicitações.',
        lines: [
            'contato@damadanoite.com.br',
            'suporte@damadanoite.com.br',
            'Resposta em até 24h úteis'
        ],
        link: 'mailto:contato@damadanoite.com.br',
        linkLabel: 'Enviar e-mail'
    },
    {
        number: '03',
        icon: 'bi-geo-alt',
        title: 'Nossa loja',
        description: 'Venha conhecer nosso espaço pessoalmente.',
        lines: [
            'Rua Jurandyr de Oliveira, 46',
            'Mogi das Cruzes - SP',
            'CEP 08773-000'
        ],
        link: 'https://www.google.com/maps/search/?api=1&query=Rua+Jurandyr+de+Oliveira+46+Mogi+das+Cruzes+SP',
        linkLabel: 'Ver localização'
    }
];

const frequentlyAskedQuestions = [
    {
        question: 'Qual o prazo de resposta?',
        answer: 'Respondemos todas as mensagens em até 24h úteis. Para urgências, ligue para a loja.'
    },
    {
        question: 'Quais os horários de atendimento?',
        answer: 'De segunda a sexta, das 9h às 18h. Aos sábados, das 9h às 13h. Fechado aos domingos e feriados.'
    },
    {
        question: 'Posso visitar a loja física?',
        answer: 'Sim. Estamos na Rua Jurandyr de Oliveira, 46, em Mogi das Cruzes. Se quiser atendimento dedicado, ligue antes e agendamos.'
    },
    {
        question: 'Como rastrear um pedido?',
        answer: 'Enviamos o código de rastreio por e-mail após a confirmação. Se não chegou, chame no telefone ou WhatsApp com o número do pedido.'
    }
];

function Contato() {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(initialFormData);
    const { showNotification } = useCart();
    const formRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        showNotification(
            'Mensagem registrada no formulário. O envio ainda não está integrado a um serviço de atendimento.',
            'info'
        );

        formRef.current?.reset();
        setFormData(initialFormData);
    };

    const handleReset = () => {
        formRef.current?.reset();
        setFormData(initialFormData);
        showNotification('Formulário limpo.', 'info');
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <i className="bi bi-flower1 loading-logo" aria-hidden="true" />
            </div>
        );
    }

    return (
        <div className="contato-page">
            <main>
                <section className="ct-hero">
                    <div className="ct-hero-content">
                        <FadeIn direction="down">
                            <p className="ct-eyebrow ct-eyebrow-light">
                                <span className="ct-eyebrow-line" />
                                Atendimento Dama da Noite
                            </p>
                        </FadeIn>

                        <FadeIn direction="up" delay={100}>
                            <h1 className="ct-hero-title">
                                Fale <em className="ct-hand">conosco.</em>
                            </h1>
                        </FadeIn>

                        <FadeIn direction="up" delay={200}>
                            <p className="ct-hero-text">
                                Tem alguma dúvida sobre nossos produtos, pedidos
                                ou entregas? Estamos aqui para ajudar.
                            </p>
                        </FadeIn>
                    </div>

                    <div className="ct-hero-bottom" aria-hidden="true">
                        <span>Floricultura Dama da Noite</span>
                        <i className="bi bi-flower1" />
                        <span>Atendimento e cuidado</span>
                    </div>
                </section>

                <section className="ct-form-section">
                    <div className="ct-form-inner">
                        <div className="ct-form-intro">
                            <FadeIn direction="up">
                                <p className="ct-eyebrow">
                                    <span className="ct-eyebrow-line" />
                                    01 / Sua mensagem
                                </p>

                                <h2 className="ct-section-title">
                                    Como podemos <em className="ct-hand">ajudar?</em>
                                </h2>

                                <p className="ct-form-description">
                                    Seja para tirar uma dúvida, falar sobre um pedido
                                    ou compartilhar uma sugestão, este espaço é seu.
                                </p>
                            </FadeIn>

                            <div className="ct-form-highlights">
                                <div className="ct-form-highlight">
                                    <span className="ct-highlight-icon">
                                        <i className="bi bi-clock" aria-hidden="true" />
                                    </span>

                                    <div>
                                        <strong>Resposta em até 24h úteis</strong>
                                        <p>Retornamos durante nosso horário de atendimento.</p>
                                    </div>
                                </div>

                                <div className="ct-form-highlight">
                                    <span className="ct-highlight-icon">
                                        <i className="bi bi-telephone" aria-hidden="true" />
                                    </span>

                                    <div>
                                        <strong>Precisa falar com a loja?</strong>
                                        <p>Entre em contato pelo telefone (11) 4799-9999.</p>
                                    </div>
                                </div>

                                <div className="ct-form-highlight">
                                    <span className="ct-highlight-icon">
                                        <i className="bi bi-geo-alt" aria-hidden="true" />
                                    </span>

                                    <div>
                                        <strong>Atendimento presencial</strong>
                                        <p>Estamos em Mogi das Cruzes, São Paulo.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="ct-form-signature">
                                <i className="bi bi-flower1" aria-hidden="true" />
                                <span>Será um prazer conversar com você.</span>
                            </div>
                        </div>

                        <div className="ct-form-panel">
                            <div className="ct-form-panel-header">
                                <div>
                                    <span className="ct-panel-eyebrow">
                                        Formulário de contato
                                    </span>

                                    <h3>Envie sua mensagem</h3>

                                    <p>Preencha os campos abaixo para continuar.</p>
                                </div>

                                <span className="ct-panel-icon" aria-hidden="true">
                                    <i className="bi bi-envelope-paper" />
                                </span>
                            </div>

                            <form
                                ref={formRef}
                                onSubmit={handleSubmit}
                                id="contatoForm"
                                className="ct-form"
                            >
                                <div className="ct-form-row">
                                    <div className="ct-field">
                                        <label htmlFor="txtNome" className="ct-label">
                                            Nome completo <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            id="txtNome"
                                            name="nome"
                                            className="ct-input"
                                            placeholder="Como podemos te chamar?"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            autoComplete="name"
                                            required
                                        />
                                    </div>

                                    <div className="ct-field">
                                        <label htmlFor="txtEmail" className="ct-label">
                                            E-mail <span>*</span>
                                        </label>

                                        <input
                                            type="email"
                                            id="txtEmail"
                                            name="email"
                                            className="ct-input"
                                            placeholder="voce@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="ct-form-row">
                                    <div className="ct-field">
                                        <label htmlFor="txtTelefone" className="ct-label">
                                            Telefone <span className="ct-optional">(opcional)</span>
                                        </label>

                                        <input
                                            type="tel"
                                            id="txtTelefone"
                                            name="telefone"
                                            className="ct-input"
                                            placeholder="(11) 90000-0000"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            autoComplete="tel"
                                        />
                                    </div>

                                    <div className="ct-field">
                                        <label htmlFor="txtAssunto" className="ct-label">
                                            Assunto
                                        </label>

                                        <select
                                            id="txtAssunto"
                                            name="assunto"
                                            className="ct-input ct-select"
                                            value={formData.assunto}
                                            onChange={handleChange}
                                        >
                                            <option value="Dúvida">Dúvida</option>
                                            <option value="Sugestão">Sugestão</option>
                                            <option value="Reclamação">Reclamação</option>
                                            <option value="Elogio">Elogio</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="ct-field">
                                    <label htmlFor="txtMensagem" className="ct-label">
                                        Sua mensagem <span>*</span>
                                    </label>

                                    <textarea
                                        id="txtMensagem"
                                        name="mensagem"
                                        className="ct-input ct-textarea"
                                        placeholder="Conte um pouco mais sobre o que você precisa..."
                                        value={formData.mensagem}
                                        onChange={handleChange}
                                        rows={6}
                                        required
                                    />
                                </div>

                                <div className="ct-form-bottom">
                                    <p className="ct-required-note">
                                        <span>*</span> Campos obrigatórios
                                    </p>

                                    <div className="ct-actions">
                                        <button
                                            type="button"
                                            className="ct-btn ct-btn-ghost"
                                            onClick={handleReset}
                                        >
                                            Limpar
                                        </button>

                                        <button
                                            type="submit"
                                            className="ct-btn ct-btn-primary"
                                        >
                                            Enviar mensagem
                                            <i
                                                className="bi bi-arrow-up-right ct-btn-icon"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                <section className="ct-info-section">
                    <div className="ct-info-inner">
                        <div className="ct-info-header">
                            <div>
                                <p className="ct-eyebrow">
                                    <span className="ct-eyebrow-line" />
                                    02 / Outros canais
                                </p>

                                <h2 className="ct-section-title">
                                    Estamos por <em className="ct-hand">perto.</em>
                                </h2>
                            </div>

                            <p className="ct-info-description">
                                Prefere outro jeito de conversar? Escolha o canal
                                que for mais conveniente para você.
                            </p>
                        </div>

                        <div className="ct-info-grid">
                            {contactChannels.map((channel) => (
                                <article className="ct-info-card" key={channel.number}>
                                    <div className="ct-info-card-top">
                                        <span className="ct-info-number">
                                            {channel.number}
                                        </span>

                                        <i
                                            className={`bi ${channel.icon} ct-info-icon`}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <h3 className="ct-info-title">
                                        {channel.title}
                                    </h3>

                                    <p className="ct-info-card-description">
                                        {channel.description}
                                    </p>

                                    <div className="ct-info-lines">
                                        {channel.lines.map((line, index) => (
                                            <p
                                                key={line}
                                                className={`ct-info-line ${index > 0 ? 'ct-info-line-muted' : ''}`}
                                            >
                                                {line}
                                            </p>
                                        ))}
                                    </div>

                                    <a
                                        href={channel.link}
                                        className="ct-info-link"
                                        target={channel.link.startsWith('https:') ? '_blank' : undefined}
                                        rel={channel.link.startsWith('https:') ? 'noopener noreferrer' : undefined}
                                    >
                                        {channel.linkLabel}
                                        <i className="bi bi-arrow-up-right" aria-hidden="true" />
                                    </a>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="ct-faq-section">
                    <div className="ct-faq-inner">
                        <div className="ct-faq-intro">
                            <FadeIn direction="up">
                                <p className="ct-eyebrow">
                                    <span className="ct-eyebrow-line" />
                                    03 / Dúvidas comuns
                                </p>

                                <h2 className="ct-section-title">
                                    Perguntas <em className="ct-hand">frequentes.</em>
                                </h2>

                                <p className="ct-faq-description">
                                    Reunimos algumas respostas que podem ajudar você.
                                </p>
                            </FadeIn>
                        </div>

                        <div className="ct-faq-list">
                            {frequentlyAskedQuestions.map((item, index) => (
                                <details className="ct-faq-item" key={item.question}>
                                    <summary className="ct-faq-question">
                                        <span className="ct-faq-number">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        <span className="ct-faq-question-text">
                                            {item.question}
                                        </span>

                                        <span className="ct-faq-icon" aria-hidden="true">
                                            <i className="bi bi-plus" />
                                        </span>
                                    </summary>

                                    <div className="ct-faq-answer">
                                        <p>{item.answer}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Contato;

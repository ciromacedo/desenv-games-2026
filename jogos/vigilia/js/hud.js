//=============================
// VIGÍLIA - HUD
//
// Único arquivo que mexe nos elementos HTML por cima do jogo:
// vidas, luz, objetivo, legenda das falas, barra do chefe, transições e painéis.
//=============================
(function (V) {
    'use strict';

    const TEMPO_DA_CORTINA = 0.95;     // igual à transição de opacidade no CSS
    const el = {};
    let numeroDaLegenda = 0;

    function iniciar() {
        ['vidas', 'luz', 'objetivo', 'legenda', 'dano', 'transicao', 'hud-chefe', 'vida-chefe',
            'painel-titulo', 'painel-fim', 'botao-comecar', 'botao-de-novo'].forEach(function (id) {
            el[id] = document.getElementById(id);
        });
    }

    function criar(etiqueta, texto) {
        const elemento = document.createElement(etiqueta);
        elemento.textContent = texto;
        return elemento;
    }

    /* ---------- falas e objetivo ---------- */

    // Mostra uma fala do roteiro ({ quem, texto, duracao, vilao }) na legenda.
    function falar(fala) {
        const legenda = el.legenda;
        legenda.replaceChildren();
        if (fala.quem) legenda.append(criar('em', fala.quem));
        legenda.append(fala.texto);
        legenda.classList.toggle('vilao', fala.vilao);
        legenda.classList.add('visivel');

        const numero = ++numeroDaLegenda;
        V.Agenda.depois(fala.duracao, function () {
            if (numero === numeroDaLegenda) legenda.classList.remove('visivel');
        });
    }

    function objetivo(texto) {
        el.objetivo.replaceChildren();
        if (texto) el.objetivo.append(criar('small', 'Objetivo'), texto);
    }

    /* ---------- medidores ---------- */

    function vidas(restantes) {
        el.vidas.replaceChildren();
        for (let i = 0; i < V.CONFIG.GATO.VIDAS; i++) {
            const marca = document.createElement('i');
            if (i >= restantes) marca.className = 'perdida';
            el.vidas.append(marca);
        }
    }

    function luz(porcentagem) {
        el.luz.style.width = porcentagem + '%';
    }

    function mostrarChefe(visivel) {
        el['hud-chefe'].classList.toggle('ativo', visivel);
    }

    function vidaDoChefe(fracao) {
        el['vida-chefe'].style.width = (fracao * 100) + '%';
    }

    /* ---------- efeitos de tela cheia ---------- */

    function dano(forca, segundos) {
        el.dano.style.opacity = forca;
        V.Agenda.depois(segundos, function () { el.dano.style.opacity = 0; });
    }

    // Fecha a tela com uma cor, chama noEscuro() com tudo coberto e reabre depois de "espera".
    function cortina(cor, texto, espera, noEscuro) {
        const cortinaEl = el.transicao;
        cortinaEl.style.background = cor;
        cortinaEl.style.color = cor === '#fff' ? '#2a2030' : '';
        cortinaEl.textContent = texto || '';
        cortinaEl.style.opacity = 1;
        V.Agenda.depois(TEMPO_DA_CORTINA, function () {
            noEscuro();
            V.Agenda.depois(espera, function () { cortinaEl.style.opacity = 0; });
        });
    }

    function abrirCortina() {
        el.transicao.style.opacity = 0;
    }

    /* ---------- painéis ---------- */

    function esconderPaineis() {
        el['painel-titulo'].hidden = true;
        el['painel-fim'].hidden = true;
    }

    function mostrarFim() {
        el['painel-fim'].hidden = false;
        el['botao-de-novo'].focus();
    }

    function aoPedirInicio(acao) {
        el['botao-comecar'].addEventListener('click', acao);
        el['botao-de-novo'].addEventListener('click', acao);
    }

    V.Hud = {
        iniciar, falar, objetivo, vidas, luz, mostrarChefe, vidaDoChefe,
        dano, cortina, abrirCortina, esconderPaineis, mostrarFim, aoPedirInicio
    };
})(window.Vigilia);

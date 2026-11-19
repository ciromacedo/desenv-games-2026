//=============================
// VIGÍLIA - entrada
//
// Junta teclado, mouse e botões de toque numa interface só.
// "segurada" vale enquanto a tecla está apertada; "apertou" só no quadro do aperto.
// O ataque sai do botão esquerdo do mouse, na direção do cursor.
//=============================
(function (V) {
    'use strict';

    const TECLAS_QUE_ROLAM_A_PAGINA = [' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
    const BOTAO_ESQUERDO = 0;

    const seguradas = {};
    const recemApertadas = {};
    const mouse = { x: 0, y: 0 };
    let ataquePedido = null;      // null, 'mouse' ou 'toque'
    let canvas = null;

    function apertar(tecla) {
        if (!seguradas[tecla]) recemApertadas[tecla] = true;
        seguradas[tecla] = true;
    }

    function soltar(tecla) {
        seguradas[tecla] = false;
    }

    function soltarTudo() {
        Object.keys(seguradas).forEach(soltar);
    }

    function guardarPosicaoDoMouse(evento) {
        const area = canvas.getBoundingClientRect();
        mouse.x = (evento.clientX - area.left) / area.width * V.CONFIG.LARGURA;
        mouse.y = (evento.clientY - area.top) / area.height * V.CONFIG.ALTURA;
    }

    function ligarTeclado() {
        window.addEventListener('keydown', function (evento) {
            const tecla = evento.key.toLowerCase();
            if (TECLAS_QUE_ROLAM_A_PAGINA.includes(tecla)) evento.preventDefault();
            apertar(tecla);
        });
        window.addEventListener('keyup', function (evento) {
            soltar(evento.key.toLowerCase());
        });
        window.addEventListener('blur', soltarTudo);
    }

    function ligarMouse() {
        window.addEventListener('mousemove', guardarPosicaoDoMouse);
        canvas.addEventListener('mousedown', function (evento) {
            if (evento.button !== BOTAO_ESQUERDO) return;
            evento.preventDefault();
            guardarPosicaoDoMouse(evento);
            ataquePedido = 'mouse';
        });
    }

    function ligarToque(botoes) {
        botoes.forEach(function (botao) {
            const tecla = botao.dataset.tecla;
            botao.addEventListener('pointerdown', function (evento) {
                evento.preventDefault();
                if (botao.dataset.acao === 'atacar') ataquePedido = 'toque';
                else apertar(tecla);
            });
            if (!tecla) return;
            ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (nome) {
                botao.addEventListener(nome, function () { soltar(tecla); });
            });
        });
    }

    function iniciar(elementoCanvas, botoesDeToque) {
        canvas = elementoCanvas;
        ligarTeclado();
        ligarMouse();
        ligarToque(botoesDeToque);
    }

    function segurada() {
        return Array.from(arguments).some(function (tecla) { return seguradas[tecla]; });
    }

    function apertou() {
        return Array.from(arguments).some(function (tecla) { return recemApertadas[tecla]; });
    }

    // Direção pedida pelo jogador; na diagonal o vetor é encurtado para não andar mais rápido.
    function eixo() {
        const x = (segurada('d', 'arrowright') ? 1 : 0) - (segurada('a', 'arrowleft') ? 1 : 0);
        const y = (segurada('s', 'arrowdown') ? 1 : 0) - (segurada('w', 'arrowup') ? 1 : 0);
        const tamanho = Math.hypot(x, y) || 1;
        return { x: x / tamanho, y: y / tamanho };
    }

    function interagiu() {
        return apertou('e', 'enter');
    }

    // Devolve o ataque pedido neste quadro: null, 'mouse' (mirar no cursor) ou 'toque'.
    function ataque() {
        return ataquePedido;
    }

    function posicaoDoMouse() {
        return { x: mouse.x, y: mouse.y };
    }

    // Chamar no fim de cada quadro: esquece o que só vale por um quadro.
    function terminarQuadro() {
        Object.keys(recemApertadas).forEach(function (tecla) { delete recemApertadas[tecla]; });
        ataquePedido = null;
    }

    V.Entrada = { iniciar, eixo, interagiu, ataque, posicaoDoMouse, terminarQuadro };
})(window.Vigilia);

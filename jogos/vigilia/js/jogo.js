//=============================
// VIGÍLIA - o jogo
//
// Último arquivo a carregar: liga tudo. Cuida do laço principal (atualizar e
// desenhar a cada quadro), de qual capítulo está em cena e de pequenos serviços
// que os capítulos usam (congelar o jogador, tremer a tela, "uma vez só").
//=============================
(function (V) {
    'use strict';

    const PARADO = { x: 0, y: 0 };
    const QUEDA_DO_TREMOR = 9;       // quanto o tremor diminui por segundo
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gato = V.Gato.estado;
    const estado = {
        modo: 'titulo',              // 'titulo', 'jogando' ou 'fim'
        capitulo: null,
        congelado: true,             // jogador sem controle (cenas e transições)
        tremor: 0,
        jaVistos: {}
    };
    let instanteAnterior = 0;

    /* ---------- serviços para os capítulos ---------- */

    function irPara(capitulo, opcoes) {
        estado.capitulo = capitulo;
        capitulo.entrar(opcoes);
        V.Particulas.limpar();
        V.Tela.centralizar(gato, capitulo.cenario);
    }

    function congelar(sim) {
        estado.congelado = sim;
    }

    function tremer(forca) {
        estado.tremor = Math.max(estado.tremor, forca);
    }

    // Executa a ação só na primeira vez que este "id" aparece na partida.
    function umaVez(id, acao) {
        if (estado.jaVistos[id]) return;
        estado.jaVistos[id] = true;
        acao();
    }

    function interagiu() {
        return !estado.congelado && V.Entrada.interagiu();
    }

    function terminar() {
        estado.modo = 'fim';
        V.Hud.mostrarFim();
    }

    /* ---------- partida ---------- */

    function comecar() {
        V.Agenda.limpar();
        estado.jaVistos = {};
        gato.vidas = V.CONFIG.GATO.VIDAS;
        V.Hud.vidas(gato.vidas);
        V.Hud.esconderPaineis();
        V.Hud.abrirCortina();
        irPara(V.CapituloVigilia);
        estado.modo = 'jogando';
        estado.congelado = false;
        V.Agenda.depois(0.7, function () { V.Hud.falar(V.ROTEIRO.QUARTO.ABERTURA); });
    }

    function anguloAteOCursor() {
        const cursor = V.Tela.paraMundo(V.Entrada.posicaoDoMouse());
        const origem = V.Gato.centro();
        return Math.atan2(cursor.y - origem.y, cursor.x - origem.x);
    }

    // Botão esquerdo do mouse: golpe na direção do cursor. No toque: para onde o gato olha.
    function tratarAtaque() {
        const pedido = V.Entrada.ataque();
        if (!pedido || estado.congelado || !V.Gato.podeAtacar()) return;
        const angulo = pedido === 'mouse' ? anguloAteOCursor() : V.Gato.anguloDeFrente();
        V.Gato.atacar(angulo);
        estado.capitulo.aoAtacar(angulo);
    }

    /* ---------- laço principal ---------- */

    function atualizar(dt) {
        V.Agenda.atualizar(dt);
        V.Paleta.atualizar(dt);
        if (estado.modo !== 'jogando') return;

        const capitulo = estado.capitulo;
        const eixo = estado.congelado ? PARADO : V.Entrada.eixo();
        V.Gato.atualizar(dt, eixo, capitulo.cenario, capitulo.limites());
        tratarAtaque();
        capitulo.atualizar(dt);
        V.Particulas.atualizar(dt);
        V.Tela.seguir(gato, estado.capitulo.cenario, dt);
        estado.tremor = Math.max(0, estado.tremor - dt * QUEDA_DO_TREMOR);
    }

    function desenharDica(ponto, tempo) {
        if (!ponto || estado.congelado) return;
        const x = Math.round(ponto.x);
        const y = Math.round(ponto.y + Math.sin(tempo * 4) * 1.5);
        V.Tela.retangulo(x - 5, y - 5, 11, 11, V.CORES.OSSO);
        V.Tela.retangulo(x - 4, y - 4, 9, 9, V.CORES.TINTA);
        V.Tela.texto('E', x + 0.5, y - 2, V.CORES.OSSO);
    }

    // Quem está mais "embaixo" na tela é desenhado por último e fica na frente.
    function desenharPorProfundidade(capitulo, tempo) {
        capitulo.cenario.objetos
            .concat(capitulo.atores(), [{ base: gato.y, desenhar: V.Gato.desenhar }])
            .sort(function (a, b) { return a.base - b.base; })
            .forEach(function (objeto) { objeto.desenhar(tempo); });
    }

    function desenhar(tempo) {
        const capitulo = estado.capitulo;
        const cenario = capitulo.cenario;

        V.Tela.comecarMundo(semMovimento ? 0 : estado.tremor);
        cenario.desenharFundo(tempo);
        desenharPorProfundidade(capitulo, tempo);
        if (cenario.desenharFrente) cenario.desenharFrente(tempo);
        V.Palavras.desenhar();
        V.Particulas.desenhar();
        desenharDica(capitulo.dica(), tempo);
        V.Tela.terminarMundo();
        V.Tela.vinheta(V.Paleta.cor('vinheta'));
    }

    function quadro(milissegundos) {
        const tempo = milissegundos / 1000;
        const dt = Math.min(V.CONFIG.QUADRO_MAXIMO, tempo - instanteAnterior);
        instanteAnterior = tempo;

        atualizar(dt);
        desenhar(tempo);
        V.Entrada.terminarQuadro();
        window.requestAnimationFrame(quadro);
    }

    function iniciar() {
        const canvas = document.getElementById('tela');
        V.Hud.iniciar();
        V.Tela.iniciar(canvas);
        V.Entrada.iniciar(canvas, document.querySelectorAll('#toque button'));
        V.Hud.aoPedirInicio(comecar);
        V.Hud.vidas(gato.vidas);
        irPara(V.CapituloVigilia);        // o quarto aparece atrás da tela de título
        window.requestAnimationFrame(quadro);
    }

    V.Jogo = { irPara, congelar, tremer, umaVez, interagiu, terminar };

    iniciar();
})(window.Vigilia);

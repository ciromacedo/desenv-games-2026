//=============================
// VIGÍLIA - cenário: o quarto
//
// Só geometria e desenho (a história do quarto está em capitulos/vigilia.js).
// Visto de cima, com a parede do fundo aparecendo de frente no topo da tela.
// "abertura" vai de 0 (cortinas fechadas, pesadelo sobre a cama) a 1 (manhã).
//=============================
(function (V) {
    'use strict';

    const T = V.Tela;
    const cor = V.Paleta.cor;

    const LARGURA = 384;
    const ALTURA = 216;
    const ALTURA_DA_PAREDE = 48;
    const TEMPO_PARA_ABRIR = 2.4;

    const JANELA = { x: 160, y: 6, w: 64, h: 34 };
    const MESA = { x: 40, y: 44, w: 64, h: 20 };
    const CAMA = { x: 304, y: 74, w: 58, h: 72 };
    const CAIXAS = { x: 12, y: 176, w: 26, h: 20 };

    const ESCURO = '#0a0911';
    const COR_DA_TELA = '#7f9be0';
    const CORES_DAS_BRUMAS = ['#3a0a22', '#1a0616', '#5a0f1c', '#12040e'];

    let abertura = 0;
    let aberturaAlvo = 0;

    function preparar(comEsperanca) {
        abertura = 0;
        aberturaAlvo = 0;
        if (comEsperanca) V.Agenda.depois(0.7, function () { aberturaAlvo = 1; });
    }

    function atualizar(dt) {
        abertura = V.Util.aproximar(abertura, aberturaAlvo, dt / TEMPO_PARA_ABRIR);
    }

    /* ---------- parede ---------- */

    function desenharVaralDeFotos() {
        T.linha(28, 13, 124, 16, '#2f2a44');
        [0, 1, 4, 6].forEach(function (i) {     // algumas fotos foram arrancadas
            const x = 32 + i * 14;
            T.retangulo(x, 15 + (i % 2), 7, 9, '#3a3550');
            T.retangulo(x + 1, 16 + (i % 2), 5, 7, '#2b2740');
        });
    }

    function desenharJanela() {
        const j = JANELA;
        T.retangulo(j.x - 3, j.y - 3, j.w + 6, j.h + 6, ESCURO);
        T.retangulo(j.x, j.y, j.w, j.h, cor('vidro'));
        T.retangulo(j.x + j.w / 2 - 1, j.y, 2, j.h, ESCURO);
        T.retangulo(j.x, j.y + j.h / 2 - 1, j.w, 2, ESCURO);

        const larguraDaCortina = V.Util.misturar(j.w / 2 + 4, 9, abertura);
        T.retangulo(j.x - 4, j.y - 4, larguraDaCortina, j.h + 10, cor('destaque'));
        T.retangulo(j.x + j.w + 4 - larguraDaCortina, j.y - 4, larguraDaCortina, j.h + 10, cor('destaque'));
        T.retangulo(j.x - 7, j.y - 6, j.w + 14, 2, '#07060c');
    }

    function desenharPrateleira() {
        T.retangulo(262, 26, 66, 3, cor('movel'));
        T.retangulo(266, 16, 4, 10, '#2a2440');
        T.retangulo(271, 18, 3, 8, cor('destaque'));
        T.retangulo(276, 21, 12, 5, '#22203a');
        T.retangulo(300, 12, 18, 14, '#201c30');
        T.retangulo(302, 14, 14, 10, '#2f2a44');
    }

    function desenharParede() {
        T.retangulo(0, 0, LARGURA, ALTURA_DA_PAREDE, cor('parede'));
        T.retangulo(0, ALTURA_DA_PAREDE - 5, LARGURA, 5, cor('rodape'));
        desenharVaralDeFotos();
        desenharJanela();
        desenharPrateleira();
    }

    /* ---------- chão ---------- */

    function desenharTabuas() {
        const ALTURA_DA_TABUA = 12;
        T.retangulo(0, ALTURA_DA_PAREDE, LARGURA, ALTURA - ALTURA_DA_PAREDE, cor('piso'));
        for (let y = ALTURA_DA_PAREDE, fileira = 0; y < ALTURA; y += ALTURA_DA_TABUA, fileira++) {
            T.retangulo(0, y, LARGURA, 1, cor('fresta'));
            for (let x = fileira % 2 ? 22 : 54; x < LARGURA; x += 64) {
                T.retangulo(x, y, 1, ALTURA_DA_TABUA, cor('fresta'));
            }
        }
    }

    // A luz da manhã cai da janela sobre o chão, abrindo-se como um leque.
    function desenharFeixeDeLuz() {
        if (abertura <= 0) return;
        const topo = ALTURA_DA_PAREDE;
        const fundo = 168;
        T.comAlfa(0.22 * abertura, function () {
            for (let y = topo; y < fundo; y++) {
                const t = (y - topo) / (fundo - topo);
                const esquerda = V.Util.misturar(JANELA.x + 4, JANELA.x - 34, t);
                const direita = V.Util.misturar(JANELA.x + JANELA.w - 4, JANELA.x + JANELA.w + 34, t);
                T.retangulo(esquerda, y, direita - esquerda, 1, '#ffd9a0');
            }
        });
    }

    function desenharBagunca(tempo) {
        // brilho frio do monitor no chão
        T.comAlfa(0.1 + 0.03 * Math.sin(tempo * 7), function () { T.elipse(72, 70, 36, 22, '#8fb0ff'); });
        // tapete
        T.comAlfa(0.5, function () { T.elipse(190, 128, 62, 26, cor('destaque')); });
        // manta largada
        T.elipse(120, 176, 12, 6, cor('manta'));
        T.elipse(131, 172, 8, 5, cor('manta'));
        // papéis
        T.comAlfa(0.7, function () {
            T.retangulo(196, 96, 5, 6, '#cfc9de');
            T.retangulo(206, 101, 6, 5, '#cfc9de');
        });
        // foto rasgada ao meio
        T.retangulo(146, 147, 6, 7, '#cfc9de');
        T.retangulo(147, 148, 4, 4, '#57506f');
        T.ponto(151, 149, cor('piso'));
        T.ponto(151, 152, cor('piso'));
        // celular com a luz de notificação piscando
        T.retangulo(233, 168, 7, 4, ESCURO);
        T.comAlfa(0.5 + 0.5 * Math.sin(tempo * 4), function () { T.ponto(238, 169, V.CORES.LUA); });
    }

    function desenharFundo(tempo) {
        desenharParede();
        desenharTabuas();
        desenharBagunca(tempo);
        desenharFeixeDeLuz();
    }

    /* ---------- móveis (entram na ordenação por profundidade) ---------- */

    function desenharMesa(tempo) {
        const m = MESA;
        T.retangulo(m.x, m.y, m.w, m.h - 6, cor('movel'));
        T.retangulo(m.x, m.y + m.h - 6, m.w, 5, cor('movelSombra'));
        T.retangulo(m.x + 1, m.y + m.h - 1, 3, 6, cor('movelSombra'));
        T.retangulo(m.x + m.w - 4, m.y + m.h - 1, 3, 6, cor('movelSombra'));
        // monitor ligado
        T.retangulo(m.x + 30, m.y - 3, 4, 6, ESCURO);
        T.retangulo(m.x + 20, m.y - 20, 24, 17, ESCURO);
        const tremulando = Math.sin(tempo * 13) > 0.92 ? 0.6 : 0.9;
        T.comAlfa(tremulando, function () { T.retangulo(m.x + 22, m.y - 18, 20, 13, COR_DA_TELA); });
        // canecas e prato esquecidos
        T.retangulo(m.x + 50, m.y + 3, 4, 5, '#3a3550');
        T.retangulo(m.x + 56, m.y + 5, 4, 4, '#2f2a44');
        T.elipse(m.x + 10, m.y + 7, 6, 2, '#3a3550');
    }

    function desenharCaixas() {
        const c = CAIXAS;
        T.retangulo(c.x, c.y, c.w, c.h, '#221c30');
        T.retangulo(c.x, c.y, c.w, 5, '#2f2a44');
        T.retangulo(c.x + 4, c.y - 12, 18, 12, '#262036');
        T.retangulo(c.x + 4, c.y - 12, 18, 4, '#352e4d');
    }

    function desenharGarotaDormindo(alfa) {
        const c = CAMA;
        T.comAlfa(alfa, function () {
            T.elipse(c.x + c.w / 2, c.y + 48, 15, 22, cor('manta'));       // corpo sob a manta
            T.elipse(c.x + c.w / 2 + 2, c.y + 13, 8, 5, '#2e1a12');        // cabelo no travesseiro
            T.retangulo(c.x + c.w / 2 - 2, c.y + 14, 5, 4, '#b99680');
        });
    }

    function desenharGarotaAcordada(alfa) {
        T.comAlfa(alfa, function () {
            T.sprite('garotaAcordada', CAMA.x + 2, CAMA.y + 62);
        });
    }

    function desenharCama() {
        const c = CAMA;
        T.retangulo(c.x - 3, c.y - 10, c.w + 6, 12, cor('movel'));                 // cabeceira
        T.retangulo(c.x - 3, c.y, c.w + 6, c.h, cor('movelSombra'));               // estrado
        T.retangulo(c.x, c.y, c.w, c.h - 3, cor('colchao'));
        T.retangulo(c.x + 12, c.y + 4, c.w - 24, 14, cor('travesseiro'));
        T.retangulo(c.x, c.y + 24, c.w, c.h - 28, cor('manta'));
        T.retangulo(c.x, c.y + 24, c.w, 3, cor('travesseiro'));                    // dobra do lençol
        desenharGarotaDormindo(1 - abertura);
        desenharGarotaAcordada(abertura);
    }

    const objetos = [
        { base: MESA.y + MESA.h, desenhar: desenharMesa },
        { base: CAIXAS.y + CAIXAS.h, desenhar: desenharCaixas },
        { base: CAMA.y + CAMA.h, desenhar: desenharCama }
    ];

    const obstaculos = [
        { x: MESA.x, y: MESA.y, w: MESA.w, h: MESA.h + 2 },
        { x: CAIXAS.x, y: CAIXAS.y, w: CAIXAS.w, h: CAIXAS.h },
        { x: CAMA.x - 3, y: CAMA.y - 8, w: CAMA.w + 6, h: CAMA.h + 8 }
    ];

    /* ---------- por cima de tudo ---------- */

    // O que pesa sobre o sono dela: manchas escuras que só o gato vê.
    function desenharFrente(tempo) {
        const forca = 1 - abertura;
        if (forca <= 0) return;
        const cx = CAMA.x + CAMA.w / 2;
        const cy = CAMA.y + 26;
        CORES_DAS_BRUMAS.forEach(function (corDaBruma, i) {
            const fase = tempo * (0.5 + i * 0.13) + i * 1.7;
            const x = cx + Math.cos(fase) * (10 + i * 3) + (i - 1.5) * 9;
            const y = cy + Math.sin(fase * 1.3) * 7 - i * 5;
            T.comAlfa(0.6 * forca, function () { T.elipse(x, y, 16 - i * 2, 7 - i, corDaBruma); });
        });
    }

    V.Quarto = {
        LARGURA, ALTURA,
        limites: { x0: 8, y0: ALTURA_DA_PAREDE + 6, x1: LARGURA - 8, y1: ALTURA - 4 },
        // Pontos que a história usa para saber onde o gato está.
        PONTOS: {
            ENTRADA: { x: 44, y: 150 },
            CENTRO: { x: 190, y: 130 },
            TELA: { x: 72, y: 72 },
            FOTO: { x: 149, y: 151 },
            CELULAR: { x: 236, y: 170 },
            BEIRA_DA_CAMA: { x: CAMA.x - 6, y: CAMA.y + 44 }
        },
        obstaculos, objetos, preparar, atualizar, desenharFundo, desenharFrente
    };
})(window.Vigilia);

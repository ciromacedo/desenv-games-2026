//=============================
// VIGÍLIA - cenário: a lembrança (sala de estar do sonho)
//
// Só geometria e desenho (a história do sonho está em capitulos/memoria.js).
// As cores vêm da paleta; "horror" (0 a 1) liga os detalhes que só existem no
// pesadelo: quadros riscados, flores murchas, a fenda no sol, os fios da marionete.
//=============================
(function (V) {
    'use strict';

    const T = V.Tela;
    const cor = V.Paleta.cor;

    const LARGURA = 720;
    const ALTURA = 232;
    const ALTURA_DA_PAREDE = 60;
    const TEMPO_DE_MUDANCA = 1.6;
    const PARALAXE_DO_CEU = 0.12;

    const JANELAS = [60, 230, 400, 570].map(function (x) { return { x: x, y: 8, w: 60, h: 40 }; });
    const QUADROS = [166, 336, 506, 666].map(function (x) { return { x: x, y: 16, w: 18, h: 22 }; });
    const RELOGIO = { x: 24, y: 26, raio: 8 };
    const PEDESTAL = { x: 183, y: 88, w: 14, h: 14 };
    const SOFA = { x: 280, y: 64, w: 100, h: 24 };
    const MESA = { x: 432, y: 124, w: 90, h: 26 };
    const PLANTAS = [{ x: 22, y: 86 }, { x: 700, y: 88 }, { x: 26, y: 224 }, { x: 696, y: 224 }, { x: 540, y: 82 }];
    const EX = { x: 606, y: 142 };
    const GAROTA = { x: 646, y: 142 };

    const LUZ_QUENTE = '#ffe9b8';
    const HALO_FRIO = '#8fb0ff';

    let horror = 0;
    let horrorAlvo = 0;
    let vasoNoLugar = true;
    let exPresente = true;
    const obstaculos = [];

    function preparar() {
        horror = horrorAlvo = 0;
        vasoNoLugar = true;
        exPresente = true;
        obstaculos.splice(0, obstaculos.length, ...montarObstaculos());
    }

    function montarObstaculos() {
        const lista = [
            { x: PEDESTAL.x, y: PEDESTAL.y, w: PEDESTAL.w, h: PEDESTAL.h },
            { x: SOFA.x, y: SOFA.y - 4, w: SOFA.w, h: SOFA.h + 2 },
            { x: MESA.x, y: MESA.y, w: MESA.w, h: MESA.h },
            { x: GAROTA.x - 5, y: GAROTA.y - 5, w: 10, h: 5 },
            { x: EX.x - 5, y: EX.y - 5, w: 10, h: 5, dono: 'ex' }
        ];
        PLANTAS.forEach(function (p) { lista.push({ x: p.x - 5, y: p.y - 6, w: 10, h: 6 }); });
        return lista;
    }

    function atualizar(dt) {
        horror = V.Util.aproximar(horror, horrorAlvo, dt / TEMPO_DE_MUDANCA);
    }

    /* ---------- mudanças que a história provoca ---------- */

    function revelarPesadelo() { horrorAlvo = 1; }
    function amanhecer() { horrorAlvo = 0; }
    function retirarVaso() { vasoNoLugar = false; }

    function retirarEx() {
        exPresente = false;
        const indice = obstaculos.findIndex(function (o) { return o.dono === 'ex'; });
        if (indice >= 0) obstaculos.splice(indice, 1);
    }

    /* ---------- parede ---------- */

    function desenharCeu(j) {
        const FAIXAS = 4;
        const centro = j.x + j.w / 2;
        // o sol anda um pouco com a câmera: dá sensação de distância
        const solX = centro + (T.camera.x + V.CONFIG.LARGURA / 2 - centro) * PARALAXE_DO_CEU;
        const solY = j.y + 18;

        T.recortar(j.x, j.y, j.w, j.h, function () {
            for (let i = 0; i < FAIXAS; i++) {
                T.retangulo(j.x, j.y + i * j.h / FAIXAS, j.w, j.h / FAIXAS, V.Paleta.entre('ceuAlto', 'ceuBaixo', i / (FAIXAS - 1)));
            }
            T.elipse(solX, solY, 8, 8, cor('sol'));
            T.comAlfa(horror, function () { T.elipse(solX, solY, 1, 6, V.CORES.BREU); });
            T.elipse(j.x + 14, j.y + j.h + 2, 22, 10, cor('morro'));
            T.elipse(j.x + 46, j.y + j.h + 3, 24, 9, cor('morro'));
        });
    }

    function desenharJanela(j) {
        desenharCeu(j);
        T.comAlfa(1 - horror * 0.6, function () {
            T.retangulo(j.x - 2, j.y - 2, j.w + 4, 2, V.CORES.CREME);
            T.retangulo(j.x - 2, j.y + j.h, j.w + 4, 2, V.CORES.CREME);
            T.retangulo(j.x - 2, j.y, 2, j.h, V.CORES.CREME);
            T.retangulo(j.x + j.w, j.y, 2, j.h, V.CORES.CREME);
            T.retangulo(j.x + j.w / 2, j.y, 1, j.h, V.CORES.CREME);
            T.retangulo(j.x, j.y + j.h / 2, j.w, 1, V.CORES.CREME);
        });
        T.retangulo(j.x - 9, j.y - 5, 8, j.h + 12, cor('destaque'));
        T.retangulo(j.x + j.w + 1, j.y - 5, 8, j.h + 12, cor('destaque'));
    }

    function desenharRetratoFeliz(q) {
        T.retangulo(q.x + 2, q.y + 2, q.w - 4, q.h - 4, V.CORES.CREME);
        T.retangulo(q.x + 4, q.y + 7, 4, 4, '#5a3320');
        T.retangulo(q.x + 10, q.y + 6, 4, 4, '#2a1d17');
        T.retangulo(q.x + 3, q.y + 12, 6, 8, '#f2c94c');
        T.retangulo(q.x + 9, q.y + 11, 6, 9, '#27344f');
    }

    function desenharRetratoRiscado(q) {
        T.retangulo(q.x + 2, q.y + 2, q.w - 4, q.h - 4, '#12060a');
        T.linha(q.x + 3, q.y + 4, q.x + 14, q.y + 18, V.CORES.FERIDA);
        T.linha(q.x + 14, q.y + 4, q.x + 4, q.y + 17, V.CORES.FERIDA);
        T.linha(q.x + 3, q.y + 11, q.x + 14, q.y + 12, V.CORES.FERIDA);
    }

    function desenharQuadro(q) {
        const assombrado = horror > 0.5;
        const queda = assombrado ? 2 : 0;     // no pesadelo o quadro despenca de um lado
        // arandela acima do quadro
        T.comAlfa(0.35 * (1 - horror), function () { T.elipse(q.x + q.w / 2, q.y - 8, 12, 9, LUZ_QUENTE); });
        T.retangulo(q.x + q.w / 2 - 2, q.y - 10, 4, 5, cor('movel'));

        T.retangulo(q.x, q.y + queda, q.w, q.h, cor('movel'));
        const moldura = { x: q.x, y: q.y + queda, w: q.w, h: q.h };
        if (assombrado) desenharRetratoRiscado(moldura);
        else desenharRetratoFeliz(moldura);
        if (assombrado) T.retangulo(q.x, q.y, q.w / 2, 2, cor('parede'));   // canto que caiu
    }

    // No pesadelo o ponteiro dispara, girando para trás.
    function desenharRelogio(tempo) {
        const r = RELOGIO;
        const voltasPorSegundo = horror > 0.5 ? 1.4 : 0.16;
        const angulo = -tempo * voltasPorSegundo * Math.PI * 2;
        T.elipse(r.x, r.y, r.raio + 1, r.raio + 1, cor('movel'));
        T.elipse(r.x, r.y, r.raio - 1, r.raio - 1, V.CORES.CREME);
        T.linha(r.x, r.y, r.x + Math.cos(angulo) * 5, r.y + Math.sin(angulo) * 5, '#2a1d17');
        T.linha(r.x, r.y, r.x + 3, r.y, '#2a1d17');
    }

    function desenharParede(tempo) {
        T.retangulo(0, 0, LARGURA, ALTURA_DA_PAREDE, cor('parede'));
        T.retangulo(0, ALTURA_DA_PAREDE - 6, LARGURA, 6, cor('rodape'));
        T.comAlfa(0.5, function () { T.retangulo(0, ALTURA_DA_PAREDE - 7, LARGURA, 1, V.CORES.CREME); });
        JANELAS.forEach(desenharJanela);
        QUADROS.forEach(desenharQuadro);
        desenharRelogio(tempo);
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

    function desenharFundo(tempo) {
        desenharParede(tempo);
        desenharTabuas();
        T.comAlfa(0.55, function () { T.elipse(340, 154, 92, 30, cor('destaque')); });   // tapete
    }

    /* ---------- móveis e personagens (ordenados por profundidade) ---------- */

    // O vaso quebrado "falha" de vez em quando: ele não pertence a este lugar.
    function desenharPedestal(tempo) {
        const p = PEDESTAL;
        T.retangulo(p.x + 1, p.y + 2, p.w - 2, p.h - 2, cor('movelSombra'));
        T.retangulo(p.x, p.y - 4, p.w, 7, cor('movel'));
        if (!vasoNoLugar) return;

        const centro = p.x + p.w / 2;
        const falha = (tempo % 2.2) < 0.12 ? 2 : ((tempo + 1.2) % 2.2) < 0.1 ? -2 : 0;
        T.comAlfa(0.22 + 0.12 * Math.sin(tempo * 4), function () { T.elipse(centro, p.y - 8, 13, 11, HALO_FRIO); });
        T.sprite('vasoQuebrado', centro + falha, p.y - 2);
        T.ponto(p.x - 3, p.y + 12, V.CORES.OSSO);
        T.ponto(p.x + p.w + 2, p.y + 10, V.CORES.OSSO);
        T.ponto(p.x + p.w + 4, p.y + 13, V.CORES.OSSO);
    }

    function desenharSofa() {
        const s = SOFA;
        const encosto = V.Paleta.entre('destaque', 'movelSombra', 0.35);
        T.retangulo(s.x, s.y - 8, s.w, 14, encosto);
        T.retangulo(s.x + 4, s.y + 4, s.w - 8, s.h - 6, cor('destaque'));
        T.retangulo(s.x, s.y, 6, s.h - 2, encosto);
        T.retangulo(s.x + s.w - 6, s.y, 6, s.h - 2, encosto);
        T.retangulo(s.x + 2, s.y + s.h - 2, 3, 3, cor('movelSombra'));
        T.retangulo(s.x + s.w - 5, s.y + s.h - 2, 3, 3, cor('movelSombra'));
        T.comAlfa(0.85 * (1 - horror), function () { T.retangulo(s.x + 14, s.y + 4, 16, 9, V.CORES.CREME); });
    }

    function desenharVela(x, y, tempo) {
        const tremor = Math.sin(tempo * 14 + x) > 0 ? 1 : 0;
        T.comAlfa(0.3 * (1 - horror), function () { T.elipse(x + 1, y - 8, 10, 8, LUZ_QUENTE); });
        T.retangulo(x, y - 6, 2, 8, V.CORES.CREME);
        T.retangulo(x, y - 9 - tremor, 2, 3 + tremor, cor('chama'));
    }

    // Flores viçosas no sonho; murchas e caídas no pesadelo.
    function desenharFlores(x, y) {
        const murcha = horror > 0.5;
        T.retangulo(x - 3, y, 6, 7, V.CORES.LUA);
        if (murcha) {
            T.linha(x, y, x + 5, y - 3, '#4d7a45');
            T.retangulo(x + 5, y - 2, 3, 3, cor('destaque'));
            T.ponto(x + 8, y + 2, cor('destaque'));
        } else {
            T.retangulo(x, y - 7, 1, 7, '#4d7a45');
            T.retangulo(x - 1, y - 11, 3, 4, cor('destaque'));
            T.retangulo(x - 4, y - 8, 3, 3, cor('destaque'));
            T.retangulo(x + 2, y - 8, 3, 3, cor('destaque'));
        }
    }

    function desenharMesaPosta(tempo) {
        const m = MESA;
        T.retangulo(m.x + 3, m.y + m.h - 2, 3, 6, cor('movel'));
        T.retangulo(m.x + m.w - 6, m.y + m.h - 2, 3, 6, cor('movel'));
        T.retangulo(m.x, m.y, m.w, m.h - 6, cor('toalha'));
        T.retangulo(m.x, m.y + m.h - 6, m.w, 5, V.Paleta.entre('toalha', 'movel', 0.35));
        desenharVela(m.x + 12, m.y + 6, tempo);
        desenharVela(m.x + m.w - 14, m.y + 6, tempo);
        desenharFlores(m.x + m.w / 2, m.y + 5);
    }

    function desenharPlanta(p) {
        const caida = 4 * horror;
        const altura = 1 - 0.4 * horror;
        T.elipse(p.x - 5, p.y - 13 + caida, 5, 7 * altura, cor('planta'));
        T.elipse(p.x + 5, p.y - 14 + caida, 5, 8 * altura, cor('planta'));
        T.elipse(p.x, p.y - 19 + caida * 1.5, 4, 9 * altura, cor('planta'));
        T.retangulo(p.x - 5, p.y - 8, 10, 8, cor('vaso'));
        T.retangulo(p.x - 6, p.y - 9, 12, 2, cor('vaso'));
    }

    function desenharEx() {
        if (exPresente) T.sprite('ex', EX.x, EX.y);
    }

    function desenharFiosDaMarionete(tempo) {
        const TRACO = 6;
        const corrida = Math.floor(tempo * 12);
        [[-6, -30], [-1, -4], [5, 26], [9, 60]].forEach(function (fio) {
            const x0 = GAROTA.x + fio[0];
            const x1 = GAROTA.x + fio[1];
            const y0 = GAROTA.y - 7;
            for (let y = y0; y > 0; y--) {
                if ((y + corrida) % TRACO < 3) continue;
                T.ponto(V.Util.misturar(x0, x1, (y0 - y) / y0), y, V.CORES.FERIDA);
            }
        });
    }

    function desenharGarota(tempo) {
        T.comAlfa(1 - horror, function () { T.sprite('garota', GAROTA.x, GAROTA.y); });
        T.comAlfa(horror, function () {
            desenharFiosDaMarionete(tempo);
            T.sprite('garotaMarionete', GAROTA.x, GAROTA.y);
        });
    }

    const objetos = [
        { base: PEDESTAL.y + PEDESTAL.h, desenhar: desenharPedestal },
        { base: SOFA.y + SOFA.h, desenhar: desenharSofa },
        { base: MESA.y + MESA.h, desenhar: desenharMesaPosta },
        { base: EX.y, desenhar: desenharEx },
        { base: GAROTA.y, desenhar: desenharGarota }
    ].concat(PLANTAS.map(function (planta) {
        return { base: planta.y, desenhar: function () { desenharPlanta(planta); } };
    }));

    V.Sonho = {
        LARGURA, ALTURA,
        limites: { x0: 8, y0: ALTURA_DA_PAREDE + 6, x1: LARGURA - 8, y1: ALTURA - 4 },
        // Na luta o gato e a Máscara ficam presos na metade direita da sala.
        ARENA: { x0: 300, y0: ALTURA_DA_PAREDE + 10, x1: LARGURA - 16, y1: ALTURA - 6 },
        // Pontos que a história usa para saber onde o gato está.
        PONTOS: {
            ENTRADA: { x: 40, y: 150 },
            VASO: { x: PEDESTAL.x + PEDESTAL.w / 2, y: PEDESTAL.y + PEDESTAL.h + 4 },
            EX: EX,
            GAROTA: GAROTA,
            RETORNO_DA_LUTA: { x: 400, y: 170 },
            RETORNO_DA_MASCARA: { x: 640, y: 130 }
        },
        obstaculos, objetos, preparar, atualizar,
        revelarPesadelo, amanhecer, retirarVaso, retirarEx, desenharFundo
    };
})(window.Vigilia);

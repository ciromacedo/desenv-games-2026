//=============================
// VIGÍLIA - a Máscara (chefe)
//
// Máquina de estados do vilão:
//   perseguir -> preparar -> investir -> cansar -> perseguir ...
//   (com pouca vida, às vezes "conjurar" palavras antes de preparar a investida)
// Encostar nele machuca, menos quando está cansado: é a hora de bater.
//=============================
(function (V) {
    'use strict';

    const C = V.CONFIG.MASCARA;
    const ATRITO_EMPURRAO = 0.01;
    const VIDA_DA_FURIA = C.VIDA / 2;
    const VIDA_DO_DESESPERO = 3;          // abaixo disso lança duas palavras por vez
    const GOLPES_POR_RACHADURA = 2.4;
    const OLHO_CALMO = '#ffffff';
    const OLHO_EM_ATAQUE = '#ff2a4a';

    // Pixels (coluna, linha no sprite) que escurecem a cada rachadura da máscara.
    const RACHADURAS = [
        [[11, 2], [11, 3], [12, 3]],
        [[9, 5], [10, 6], [10, 7]],
        [[14, 5], [13, 6], [14, 7]],
        [[11, 5], [12, 6], [11, 6]]
    ];
    const OLHOS = [[10, 4], [13, 4]];

    const mascara = {
        x: 0, y: 0,
        vida: C.VIDA,
        estado: 'perseguir',
        tempo: 0,
        direcao: { x: 1, y: 0 },     // rumo travado da investida
        invencivel: 0,
        empurrao: { x: 0, y: 0 },
        conjurou: false,
        visivel: false,
        ativa: false,
        opacidade: 1,
        rastro: []
    };
    let arena = null;

    function mudarEstado(estado, tempo) {
        mascara.estado = estado;
        mascara.tempo = tempo;
    }

    // Coloca a Máscara em cena, parada. "limites" é a área da luta.
    function surgir(x, y, limites) {
        arena = limites;
        Object.assign(mascara, {
            x: x, y: y, vida: C.VIDA, invencivel: 0, conjurou: false,
            visivel: true, ativa: false, opacidade: 1, rastro: []
        });
        mascara.empurrao.x = mascara.empurrao.y = 0;
        mudarEstado('perseguir', 1.6);
    }

    function despertar() {
        mascara.ativa = true;
    }

    function parar() {
        mascara.ativa = false;
    }

    function sumir() {
        mascara.visivel = false;
        mascara.ativa = false;
    }

    function centro() {
        return { x: mascara.x, y: mascara.y - C.ALTURA_CENTRO };
    }

    function emFuria() {
        return mascara.vida <= VIDA_DA_FURIA;
    }

    /* ---------- estados ---------- */

    function perseguir(dt, rumo) {
        const velocidade = emFuria() ? C.VELOCIDADE_FURIA : C.VELOCIDADE;
        mascara.x += rumo.x * velocidade * dt;
        mascara.y += rumo.y * velocidade * dt;
        if (mascara.tempo > 0) return;

        if (emFuria() && !mascara.conjurou && Math.random() < C.CHANCE_CONJURAR) {
            mascara.conjurou = true;
            mudarEstado('conjurar', C.TEMPO_CONJURAR);
        } else {
            mascara.conjurou = false;
            mascara.direcao = rumo;
            mudarEstado('preparar', emFuria() ? C.TEMPO_PREPARO_FURIA : C.TEMPO_PREPARO);
        }
    }

    function conjurar(alvo) {
        if (mascara.tempo > 0) return;
        V.Palavras.lancar(mascara, V.Util.rumo(mascara, alvo));
        if (mascara.vida <= VIDA_DO_DESESPERO) {
            V.Agenda.depois(0.42, function () {
                if (mascara.ativa) V.Palavras.lancar(mascara, V.Util.rumo(mascara, alvo));
            });
        }
        mudarEstado('perseguir', V.Util.aleatorio(0.9, 1.5));
    }

    function investir(dt) {
        mascara.rastro.push({ x: mascara.x, y: mascara.y });
        if (mascara.rastro.length > 4) mascara.rastro.shift();
        mascara.x += mascara.direcao.x * C.VELOCIDADE_INVESTIDA * dt;
        mascara.y += mascara.direcao.y * C.VELOCIDADE_INVESTIDA * dt;
        if (mascara.tempo <= 0) {
            mascara.rastro = [];
            mudarEstado('cansar', C.TEMPO_CANSACO);
        }
    }

    // "alvo" é o gato; aoTocar(direcao) é chamado quando a Máscara encosta nele.
    function atualizar(dt, alvo, aoTocar) {
        mascara.tempo -= dt;
        mascara.invencivel -= dt;
        mascara.x += mascara.empurrao.x * dt;
        mascara.y += mascara.empurrao.y * dt;
        const freio = Math.pow(ATRITO_EMPURRAO, dt);
        mascara.empurrao.x *= freio;
        mascara.empurrao.y *= freio;

        const rumo = V.Util.rumo(mascara, alvo);
        switch (mascara.estado) {
            case 'perseguir': perseguir(dt, rumo); break;
            case 'conjurar': conjurar(alvo); break;
            case 'preparar': if (mascara.tempo <= 0) mudarEstado('investir', C.TEMPO_INVESTIDA); break;
            case 'investir': investir(dt); break;
            case 'cansar': if (mascara.tempo <= 0) mudarEstado('perseguir', V.Util.aleatorio(1.1, 2)); break;
        }

        mascara.x = V.Util.limitar(mascara.x, arena.x0, arena.x1);
        mascara.y = V.Util.limitar(mascara.y, arena.y0, arena.y1);

        const raio = mascara.estado === 'investir' ? C.RAIO_TOQUE_INVESTIDA : C.RAIO_TOQUE;
        if (mascara.estado !== 'cansar' && V.Util.distancia(mascara, alvo) < raio) aoTocar(rumo);
    }

    function vulneravel() {
        return mascara.invencivel <= 0;
    }

    // Leva um golpe vindo de "direcao". Devolve a vida que sobrou.
    function receberGolpe(direcao) {
        mascara.vida--;
        mascara.invencivel = C.INVENCIVEL_APOS_GOLPE;
        mascara.empurrao.x = direcao.x * C.EMPURRAO_GOLPE;
        mascara.empurrao.y = direcao.y * C.EMPURRAO_GOLPE;
        return mascara.vida;
    }

    function desvanecer(dt) {
        mascara.opacidade = Math.max(0, mascara.opacidade - dt / 1.6);
        if (mascara.opacidade === 0) mascara.visivel = false;
    }

    /* ---------- desenho ---------- */

    function emAtaque() {
        return ['preparar', 'investir', 'conjurar'].includes(mascara.estado);
    }

    function deslocamentoDaPose() {
        if (mascara.estado === 'preparar') return { x: -mascara.direcao.x * 2, y: -mascara.direcao.y * 2 };
        if (mascara.estado === 'cansar') return { x: 0, y: 2 };
        return { x: 0, y: 0 };
    }

    function desenharRosto(canto) {
        const corDoOlho = emAtaque() ? OLHO_EM_ATAQUE : OLHO_CALMO;
        if (mascara.estado !== 'cansar') {
            OLHOS.forEach(function (olho) { V.Tela.ponto(canto.x + olho[0], canto.y + olho[1], corDoOlho); });
        }
        const rachaduras = Math.floor((C.VIDA - mascara.vida) / GOLPES_POR_RACHADURA);
        RACHADURAS.slice(0, rachaduras).forEach(function (pixels) {
            pixels.forEach(function (p) { V.Tela.ponto(canto.x + p[0], canto.y + p[1], V.CORES.BREU); });
        });
    }

    function desenhar(tempo) {
        if (!mascara.visivel) return;
        const pose = deslocamentoDaPose();
        const flutuar = Math.round(Math.sin(tempo * 2.4));
        const piscando = mascara.invencivel > 0 && Math.floor(tempo * 30) % 2;

        V.Tela.comAlfa(0.5 * mascara.opacidade, function () {
            V.Tela.elipse(mascara.x, mascara.y, 12, 3, '#000');
        });
        mascara.rastro.forEach(function (ponto, i) {
            V.Tela.comAlfa(0.12 * (i + 1), function () { V.Tela.sprite('mascara', ponto.x, ponto.y); });
        });
        V.Tela.comAlfa(mascara.opacidade * (piscando ? 0.35 : 1), function () {
            const canto = V.Tela.sprite('mascara', mascara.x + pose.x, mascara.y + pose.y + flutuar);
            desenharRosto(canto);
        });
    }

    V.Mascara = {
        estado: mascara, surgir, despertar, parar, sumir, centro,
        atualizar, vulneravel, receberGolpe, desvanecer, desenhar
    };
})(window.Vigilia);

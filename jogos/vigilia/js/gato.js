//=============================
// VIGÍLIA - o gato (jogador)
//
// Guarda o estado do gato e sabe movê-lo, fazê-lo atacar e desenhá-lo.
// (x, y) é o ponto dos pés, visto de cima.
//=============================
(function (V) {
    'use strict';

    const C = V.CONFIG.GATO;
    const CAIXA = { LARGURA: 10, ALTURA: 5 };       // área dos pés usada na colisão
    const ATRITO_EMPURRAO = 0.004;
    const RITMO_DO_PASSO = 9;
    const RAIO_DO_GOLPE = { DENTRO: 10, FORA: 15 };

    const gato = {
        x: 0, y: 0,
        direcao: 'baixo',        // 'baixo', 'cima' ou 'lado'
        espelhado: false,        // de lado, olhando para a esquerda
        vidas: C.VIDAS,
        armado: false,           // carrega o caco de porcelana
        invencivel: 0,
        golpe: 0,                // tempo que resta do golpe em andamento
        recarga: 0,
        anguloDoGolpe: 0,
        empurrao: { x: 0, y: 0 },
        passo: 0,
        andando: false
    };

    function posicionar(x, y) {
        Object.assign(gato, {
            x: x, y: y, direcao: 'lado', espelhado: false,
            invencivel: 0, golpe: 0, recarga: 0, passo: 0, andando: false
        });
        gato.empurrao.x = gato.empurrao.y = 0;
    }

    function centro() {
        return { x: gato.x, y: gato.y - C.ALTURA_CENTRO };
    }

    /* ---------- movimento ---------- */

    function caixaEm(x, y) {
        return { x: x - CAIXA.LARGURA / 2, y: y - CAIXA.ALTURA, w: CAIXA.LARGURA, h: CAIXA.ALTURA };
    }

    function livre(x, y, cenario) {
        const caixa = caixaEm(x, y);
        return !cenario.obstaculos.some(function (obstaculo) {
            return V.Util.retangulosSeCruzam(caixa, obstaculo);
        });
    }

    function olharPara(dx, dy) {
        if (Math.abs(dx) >= Math.abs(dy)) {
            gato.direcao = 'lado';
            gato.espelhado = dx < 0;
        } else {
            gato.direcao = dy > 0 ? 'baixo' : 'cima';
        }
    }

    // "eixo" é a direção pedida pelo jogador; "limites" é a área onde o gato pode andar.
    function atualizar(dt, eixo, cenario, limites) {
        const vx = eixo.x * C.VELOCIDADE + gato.empurrao.x;
        const vy = eixo.y * C.VELOCIDADE + gato.empurrao.y;

        // Um eixo por vez: assim o gato desliza ao longo dos móveis em vez de travar.
        const novoX = V.Util.limitar(gato.x + vx * dt, limites.x0, limites.x1);
        if (livre(novoX, gato.y, cenario)) gato.x = novoX;
        const novoY = V.Util.limitar(gato.y + vy * dt, limites.y0, limites.y1);
        if (livre(gato.x, novoY, cenario)) gato.y = novoY;

        gato.andando = eixo.x !== 0 || eixo.y !== 0;
        if (gato.andando) {
            gato.passo += dt * RITMO_DO_PASSO;
            if (gato.golpe <= 0) olharPara(eixo.x, eixo.y);
        }

        const freio = Math.pow(ATRITO_EMPURRAO, dt);
        gato.empurrao.x *= freio;
        gato.empurrao.y *= freio;
        gato.invencivel -= dt;
        gato.golpe -= dt;
        gato.recarga -= dt;
    }

    /* ---------- combate ---------- */

    function podeAtacar() {
        return gato.recarga <= 0;
    }

    function atacar(angulo) {
        gato.golpe = C.DURACAO_GOLPE;
        gato.recarga = C.RECARGA_GOLPE;
        gato.anguloDoGolpe = angulo;
        olharPara(Math.cos(angulo), Math.sin(angulo));
    }

    // Ângulo para onde o gato está virado (usado no ataque por toque, sem cursor).
    function anguloDeFrente() {
        if (gato.direcao === 'baixo') return Math.PI / 2;
        if (gato.direcao === 'cima') return -Math.PI / 2;
        return gato.espelhado ? Math.PI : 0;
    }

    function ferir(direcao) {
        gato.vidas--;
        gato.invencivel = C.INVENCIVEL_APOS_DANO;
        empurrar(direcao.x * C.EMPURRAO_DANO, direcao.y * C.EMPURRAO_DANO);
    }

    function empurrar(vx, vy) {
        gato.empurrao.x = vx;
        gato.empurrao.y = vy;
    }

    /* ---------- desenho ---------- */

    function nomeDoSprite() {
        const quadro = gato.andando && Math.floor(gato.passo) % 2 ? '2' : '1';
        const direcao = gato.direcao.charAt(0).toUpperCase() + gato.direcao.slice(1);
        return 'gato' + direcao + quadro;
    }

    function desenharCaco() {
        if (!gato.armado || gato.direcao === 'cima') return;
        const lado = gato.direcao === 'lado' ? (gato.espelhado ? -1 : 1) : 0;
        const x = gato.x + lado * 9 + (lado === 0 ? 3 : 0);
        const y = gato.y - (lado === 0 ? 2 : 5);
        V.Tela.retangulo(x - 1, y, 3, 1, V.CORES.OSSO);
        V.Tela.ponto(x + lado, y - 1, V.CORES.OSSO);
        V.Tela.ponto(x - lado, y + 1, V.CORES.LUA);
    }

    // O golpe é um arco que varre da esquerda para a direita de onde o gato mirou.
    function desenharGolpe() {
        if (gato.golpe <= 0) return;
        const origem = centro();
        const avanco = Math.min(1, (1 - gato.golpe / C.DURACAO_GOLPE) * 1.8);
        const inicio = gato.anguloDoGolpe - C.ABERTURA_GOLPE;
        const fim = inicio + C.ABERTURA_GOLPE * 2 * avanco;
        const cor = gato.armado ? V.CORES.OSSO : V.CORES.NEVOA;

        for (let angulo = inicio; angulo <= fim; angulo += 0.07) {
            // mais grosso no meio do arco, fino nas pontas
            const meio = 1 - Math.abs(angulo - gato.anguloDoGolpe) / C.ABERTURA_GOLPE;
            const dentro = V.Util.misturar(RAIO_DO_GOLPE.FORA - 1, RAIO_DO_GOLPE.DENTRO, meio);
            for (let raio = dentro; raio <= RAIO_DO_GOLPE.FORA; raio++) {
                V.Tela.ponto(origem.x + Math.cos(angulo) * raio, origem.y + Math.sin(angulo) * raio, cor);
            }
        }
    }

    function desenhar(tempo) {
        V.Tela.comAlfa(0.35, function () {
            V.Tela.elipse(gato.x, gato.y, 6, 2, '#000');
        });
        const piscando = gato.invencivel > 0 && Math.floor(tempo * 24) % 2;
        V.Tela.comAlfa(piscando ? 0.3 : 1, function () {
            V.Tela.sprite(nomeDoSprite(), gato.x, gato.y, gato.direcao === 'lado' && gato.espelhado);
            desenharCaco();
        });
        desenharGolpe();
    }

    V.Gato = {
        estado: gato, posicionar, centro, atualizar,
        podeAtacar, atacar, anguloDeFrente, ferir, empurrar, desenhar
    };
})(window.Vigilia);

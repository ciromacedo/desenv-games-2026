//=============================
// VIGÍLIA - palavras que ferem
//
// Os projéteis da Máscara: palavras que voam em linha reta até o gato.
// O gato pode cortá-las com o golpe.
//=============================
(function (V) {
    'use strict';

    const C = V.CONFIG.PALAVRAS;
    const FOLGA_FORA_DO_CENARIO = 40;
    const ALTURA_DE_VOO = 6;          // as palavras voam um pouco acima do chão

    let palavras = [];

    function lancar(origem, direcao) {
        const texto = V.Util.sortear(C.LISTA);
        const velocidade = V.Util.aleatorio(C.VELOCIDADE_MINIMA, C.VELOCIDADE_MAXIMA);
        palavras.push({
            texto: texto,
            x: origem.x + direcao.x * 14,
            y: origem.y - ALTURA_DE_VOO + direcao.y * 10,
            vx: direcao.x * velocidade,
            vy: direcao.y * velocidade,
            meiaLargura: V.Fonte.largura(texto) / 2
        });
    }

    function saiuDoCenario(palavra, cenario) {
        return palavra.x < -FOLGA_FORA_DO_CENARIO || palavra.x > cenario.LARGURA + FOLGA_FORA_DO_CENARIO ||
            palavra.y < -FOLGA_FORA_DO_CENARIO || palavra.y > cenario.ALTURA + FOLGA_FORA_DO_CENARIO;
    }

    function encosta(palavra, alvo) {
        return Math.abs(palavra.x - alvo.x) < palavra.meiaLargura + 3 && Math.abs(palavra.y - alvo.y) < 6;
    }

    // aoAtingir(direcao) deve devolver true se o gato realmente levou o dano.
    function atualizar(dt, centroDoGato, cenario, aoAtingir) {
        palavras = palavras.filter(function (palavra) {
            palavra.x += palavra.vx * dt;
            palavra.y += palavra.vy * dt;
            if (saiuDoCenario(palavra, cenario)) return false;
            if (!encosta(palavra, centroDoGato)) return true;
            const direcao = V.Util.rumo({ x: 0, y: 0 }, { x: palavra.vx, y: palavra.vy });
            return !aoAtingir(direcao);
        });
    }

    // Desfaz as palavras que estiverem dentro do arco do golpe.
    function cortar(origem, angulo, alcance, abertura) {
        palavras = palavras.filter(function (palavra) {
            if (!V.Util.dentroDoArco(origem, angulo, palavra, alcance, abertura)) return true;
            V.Particulas.explodir(palavra.x, palavra.y, 6, V.CORES.FERIDA, 60);
            return false;
        });
    }

    function desenhar() {
        palavras.forEach(function (palavra) {
            V.Tela.texto(palavra.texto, palavra.x, palavra.y - V.Fonte.ALTURA / 2, V.CORES.OSSO, V.CORES.FERIDA);
        });
    }

    function limpar() {
        palavras = [];
    }

    V.Palavras = { lancar, atualizar, cortar, desenhar, limpar };
})(window.Vigilia);

//=============================
// VIGÍLIA - partículas
//
// Estilhaços que saltam de um ponto e somem (cacos de porcelana, faíscas).
//=============================
(function (V) {
    'use strict';

    const MAXIMO = 120;
    const ATRITO = 0.05;      // fração da velocidade que sobra depois de 1 segundo

    let particulas = [];

    function explodir(x, y, quantidade, cor, velocidade) {
        for (let i = 0; i < quantidade && particulas.length < MAXIMO; i++) {
            const angulo = V.Util.aleatorio(0, Math.PI * 2);
            const impulso = V.Util.aleatorio(velocidade * 0.3, velocidade);
            particulas.push({
                x: x, y: y,
                vx: Math.cos(angulo) * impulso,
                vy: Math.sin(angulo) * impulso,
                vida: V.Util.aleatorio(0.4, 0.9),
                tamanho: Math.random() < 0.3 ? 2 : 1,
                cor: cor
            });
        }
    }

    function atualizar(dt) {
        const freio = Math.pow(ATRITO, dt);
        particulas = particulas.filter(function (p) {
            p.vida -= dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= freio;
            p.vy *= freio;
            return p.vida > 0;
        });
    }

    function desenhar() {
        particulas.forEach(function (p) {
            V.Tela.comAlfa(p.vida * 3, function () {
                V.Tela.retangulo(p.x, p.y, p.tamanho, p.tamanho, p.cor);
            });
        });
    }

    function limpar() {
        particulas = [];
    }

    V.Particulas = { explodir, atualizar, desenhar, limpar };
})(window.Vigilia);

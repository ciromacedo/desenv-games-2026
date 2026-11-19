//=============================
// VIGÍLIA - capítulo: a vigília no quarto
//
// A história que acontece no quarto, em dois momentos:
//   - antes do sonho: o gato observa o quarto e sobe na cama para entrar no sonho;
//   - depois do sonho ("com esperança"): a cortina abre e o gato vai até ela.
// Todo capítulo oferece: cenario, entrar, atualizar, limites, atores, dica, aoAtacar.
//=============================
(function (V) {
    'use strict';

    const QUARTO = V.Quarto;
    const FALAS = V.ROTEIRO.QUARTO;
    const OBJETIVOS = V.ROTEIRO.OBJETIVOS;
    const LUZ_APOS_A_PRIMEIRA_MEMORIA = 20;      // em %
    const X_PERTO_DA_CAMA = 262;
    const ALTURA_DA_DICA = 30;

    // Coisas que o gato comenta ao passar perto, uma única vez.
    const OBSERVACOES = [
        { id: 'tela', ponto: QUARTO.PONTOS.TELA, raio: 30, fala: FALAS.TELA },
        { id: 'foto', ponto: QUARTO.PONTOS.FOTO, raio: 18, fala: FALAS.FOTO },
        { id: 'celular', ponto: QUARTO.PONTOS.CELULAR, raio: 18, fala: FALAS.CELULAR }
    ];

    const gato = V.Gato.estado;
    let comEsperanca = false;

    function entrar(opcoes) {
        comEsperanca = Boolean(opcoes && opcoes.comEsperanca);
        V.Paleta.definir('quarto');
        QUARTO.preparar(comEsperanca);
        V.Hud.mostrarChefe(false);
        gato.armado = false;

        if (comEsperanca) {
            V.Gato.posicionar(QUARTO.PONTOS.CENTRO.x, QUARTO.PONTOS.CENTRO.y);
            V.Agenda.depois(0.7, function () { V.Paleta.transicionar('esperanca', 1.8); });
            V.Agenda.depois(1.5, function () { V.Hud.falar(FALAS.MANHA); });
            V.Hud.luz(LUZ_APOS_A_PRIMEIRA_MEMORIA);
            V.Hud.objetivo(OBJETIVOS.IR_ATE_ELA);
        } else {
            V.Gato.posicionar(QUARTO.PONTOS.ENTRADA.x, QUARTO.PONTOS.ENTRADA.y);
            V.Hud.luz(0);
            V.Hud.objetivo(OBJETIVOS.ENTRAR_NO_SONHO);
        }
    }

    function pertoDaCama() {
        return V.Util.distancia(gato, QUARTO.PONTOS.BEIRA_DA_CAMA) < V.CONFIG.ALCANCE_INTERACAO;
    }

    function narrarObservacoes() {
        OBSERVACOES.forEach(function (observacao) {
            if (V.Util.distancia(gato, observacao.ponto) < observacao.raio) {
                V.Jogo.umaVez(observacao.id, function () { V.Hud.falar(observacao.fala); });
            }
        });
        if (gato.x > X_PERTO_DA_CAMA) {
            V.Jogo.umaVez('cama', function () { V.Hud.falar(FALAS.CAMA); });
        }
    }

    function adormecer() {
        V.Jogo.congelar(true);
        V.Hud.objetivo('');
        V.Hud.falar(FALAS.DORMIR);
        V.Hud.cortina('#000', '', 0.7, function () {
            V.Jogo.irPara(V.CapituloMemoria);
            V.Jogo.congelar(false);
        });
    }

    function encerrar() {
        V.Jogo.congelar(true);
        V.Hud.objetivo('');
        V.Particulas.explodir(gato.x, gato.y - 8, 8, V.CORES.BRASA, 50);
        V.Hud.falar(FALAS.FINAL);
        V.Agenda.depois(4.2, V.Jogo.terminar);
    }

    function atualizar(dt) {
        QUARTO.atualizar(dt);
        if (!comEsperanca) narrarObservacoes();
        if (pertoDaCama() && V.Jogo.interagiu()) {
            if (comEsperanca) encerrar();
            else adormecer();
        }
    }

    function dica() {
        if (!pertoDaCama()) return null;
        const beira = QUARTO.PONTOS.BEIRA_DA_CAMA;
        return { x: beira.x, y: beira.y - ALTURA_DA_DICA };
    }

    V.CapituloVigilia = {
        cenario: QUARTO,
        entrar, atualizar, dica,
        limites: function () { return QUARTO.limites; },
        atores: function () { return []; },
        aoAtacar: function () { /* no quarto não há o que atacar */ }
    };
})(window.Vigilia);

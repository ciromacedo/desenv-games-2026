//=============================
// VIGÍLIA - capítulo: a memória (o sonho)
//
// A história dentro do sonho, em quatro fases:
//   lembranca -> o gato explora a tarde perfeita e acha o vaso quebrado;
//   revelacao -> o golpe com o caco desfaz a lembrança e a Máscara aparece;
//   luta      -> a luta contra a Máscara;
//   vitoria   -> a máscara quebra e a sala amanhece.
//=============================
(function (V) {
    'use strict';

    const SONHO = V.Sonho;
    const FALAS = V.ROTEIRO.SONHO;
    const OBJETIVOS = V.ROTEIRO.OBJETIVOS;
    const C_GATO = V.CONFIG.GATO;
    const VIDA_DA_MASCARA = V.CONFIG.MASCARA.VIDA;
    const ALTURA_DO_PEITO = 8;
    const ALTURA_DA_DICA = 44;

    // Falas disparadas conforme o gato avança pela sala (uma vez cada).
    const LEMBRANCAS = [
        { id: 'lembranca1', x: 120, fala: FALAS.LEMBRANCA_1 },
        { id: 'lembranca2', x: 300, fala: FALAS.LEMBRANCA_2 },
        { id: 'lembranca3', x: 430, fala: FALAS.LEMBRANCA_3 },
        { id: 'lembranca4', x: 520, fala: FALAS.LEMBRANCA_4, soDesarmado: true }
    ];
    // Provocações quando a vida da Máscara chega a estes valores.
    const PROVOCACOES = { 7: FALAS.PROVOCACAO_1, 4: FALAS.PROVOCACAO_2 };

    const gato = V.Gato.estado;
    const mascara = V.Mascara.estado;
    let fase = 'lembranca';

    function entrar() {
        fase = 'lembranca';
        V.Paleta.definir('sonho');
        SONHO.preparar();
        V.Mascara.sumir();
        V.Palavras.limpar();
        V.Gato.posicionar(SONHO.PONTOS.ENTRADA.x, SONHO.PONTOS.ENTRADA.y);
        gato.armado = false;
        gato.vidas = C_GATO.VIDAS;
        V.Hud.vidas(gato.vidas);
        V.Hud.objetivo(OBJETIVOS.EXPLORAR);
        V.Agenda.depois(0.9, function () { V.Hud.falar(FALAS.ABERTURA); });
    }

    /* ---------- fase: lembrança ---------- */

    function pertoDoVaso() {
        return !gato.armado && V.Util.distancia(gato, SONHO.PONTOS.VASO) < V.CONFIG.ALCANCE_INTERACAO;
    }

    function pegarCaco() {
        gato.armado = true;
        SONHO.retirarVaso();
        V.Particulas.explodir(SONHO.PONTOS.VASO.x, SONHO.PONTOS.VASO.y - 22, 12, V.CORES.OSSO, 70);
        V.Hud.falar(FALAS.VASO_PEGO);
        V.Hud.objetivo(OBJETIVOS.LEVAR_CACO);
    }

    function explorar() {
        if (pertoDoVaso()) {
            V.Jogo.umaVez('vasoVisto', function () { V.Hud.falar(FALAS.VASO_VISTO); });
            if (V.Jogo.interagiu()) pegarCaco();
        }
        LEMBRANCAS.forEach(function (lembranca) {
            if (gato.x < lembranca.x || (lembranca.soDesarmado && gato.armado)) return;
            V.Jogo.umaVez(lembranca.id, function () { V.Hud.falar(lembranca.fala); });
        });
    }

    function golpearLembranca(origem, angulo) {
        const peitoDoEx = { x: SONHO.PONTOS.EX.x, y: SONHO.PONTOS.EX.y - ALTURA_DO_PEITO };
        if (!V.Util.dentroDoArco(origem, angulo, peitoDoEx, C_GATO.ALCANCE_GOLPE, C_GATO.ABERTURA_GOLPE)) return;
        if (gato.armado) revelar();
        else V.Hud.falar(FALAS.GARRAS);
    }

    /* ---------- fase: revelação ---------- */

    function revelar() {
        const ex = SONHO.PONTOS.EX;
        fase = 'revelacao';
        V.Jogo.congelar(true);
        V.Jogo.tremer(8);
        V.Hud.objetivo('');
        V.Hud.dano(0.9, 0.5);
        V.Hud.falar(FALAS.REVELACAO);
        V.Particulas.explodir(ex.x, ex.y - 12, 22, V.CORES.OSSO, 120);

        V.Paleta.transicionar('pesadelo', 1.8);
        SONHO.revelarPesadelo();
        SONHO.retirarEx();
        V.Mascara.surgir(ex.x, ex.y, SONHO.ARENA);
        V.Gato.empurrar(-140, 0);
        V.Agenda.depois(2.6, comecarLuta);
    }

    /* ---------- fase: luta ---------- */

    function comecarLuta() {
        fase = 'luta';
        V.Jogo.congelar(false);
        V.Mascara.despertar();
        V.Hud.mostrarChefe(true);
        V.Hud.vidaDoChefe(1);
        V.Hud.objetivo(OBJETIVOS.QUEBRAR_MASCARA);
    }

    function golpearMascara(origem, angulo) {
        V.Palavras.cortar(origem, angulo, C_GATO.ALCANCE_GOLPE, C_GATO.ABERTURA_GOLPE);

        const centro = V.Mascara.centro();
        const acertou = V.Util.dentroDoArco(origem, angulo, centro, C_GATO.ALCANCE_GOLPE, C_GATO.ABERTURA_GOLPE);
        if (!acertou || !V.Mascara.vulneravel()) return;

        const vida = V.Mascara.receberGolpe({ x: Math.cos(angulo), y: Math.sin(angulo) });
        V.Jogo.tremer(4);
        V.Particulas.explodir(centro.x, centro.y - 12, 10, V.CORES.OSSO, 90);
        V.Hud.vidaDoChefe(vida / VIDA_DA_MASCARA);
        if (PROVOCACOES[vida]) V.Hud.falar(PROVOCACOES[vida]);
        if (vida <= 0) vencer();
    }

    // Devolve true se o gato levou o dano (false se estava invencível).
    function ferirGato(direcao) {
        if (fase !== 'luta' || gato.invencivel > 0) return false;
        V.Gato.ferir(direcao);
        V.Hud.vidas(gato.vidas);
        V.Hud.dano(0.8, 0.35);
        V.Jogo.tremer(5);
        if (gato.vidas <= 0) serExpulso();
        return true;
    }

    // Sem vidas, o pesadelo expulsa o gato e a luta recomeça.
    function serExpulso() {
        V.Jogo.congelar(true);
        V.Mascara.parar();
        V.Hud.cortina('#000', FALAS.DERROTA, 1.7, function () {
            const pontos = SONHO.PONTOS;
            V.Palavras.limpar();
            V.Gato.posicionar(pontos.RETORNO_DA_LUTA.x, pontos.RETORNO_DA_LUTA.y);
            gato.vidas = C_GATO.VIDAS;
            gato.invencivel = 1;
            V.Hud.vidas(gato.vidas);
            V.Mascara.surgir(pontos.RETORNO_DA_MASCARA.x, pontos.RETORNO_DA_MASCARA.y, SONHO.ARENA);
            V.Hud.vidaDoChefe(1);
            V.Agenda.depois(1.7, function () {
                V.Jogo.congelar(false);
                V.Mascara.despertar();
            });
        });
    }

    /* ---------- fase: vitória ---------- */

    function estilhacarMascara() {
        const CORES = [V.CORES.OSSO, '#12060a'];
        for (let i = 0; i < 5; i++) {
            V.Agenda.depois(i * 0.18, function () {
                const x = mascara.x + V.Util.aleatorio(-8, 8);
                const y = mascara.y - V.Util.aleatorio(4, 26);
                V.Particulas.explodir(x, y, 14, CORES[i % 2], 130);
            });
        }
    }

    function vencer() {
        fase = 'vitoria';
        V.Jogo.congelar(true);
        V.Jogo.tremer(9);
        V.Mascara.parar();
        V.Palavras.limpar();
        V.Hud.objetivo('');
        V.Hud.mostrarChefe(false);
        estilhacarMascara();

        V.Agenda.depois(0.9, function () {
            V.Paleta.transicionar('alvorada', 1.8);
            SONHO.amanhecer();
        });
        V.Agenda.depois(2.2, function () { V.Hud.falar(FALAS.LIBERTACAO); });
        V.Agenda.depois(5.6, function () {
            V.Hud.cortina('#fff', '', 0.9, function () {
                V.Jogo.irPara(V.CapituloVigilia, { comEsperanca: true });
                V.Jogo.congelar(false);
            });
        });
    }

    /* ---------- interface do capítulo ---------- */

    function atualizar(dt) {
        SONHO.atualizar(dt);
        if (fase === 'lembranca') explorar();
        if (mascara.ativa) V.Mascara.atualizar(dt, gato, ferirGato);
        if (fase === 'vitoria') V.Mascara.desvanecer(dt);
        V.Palavras.atualizar(dt, V.Gato.centro(), SONHO, ferirGato);
    }

    function aoAtacar(angulo) {
        const origem = V.Gato.centro();
        if (fase === 'lembranca') golpearLembranca(origem, angulo);
        else if (fase === 'luta') golpearMascara(origem, angulo);
    }

    function dica() {
        if (fase !== 'lembranca' || !pertoDoVaso()) return null;
        return { x: SONHO.PONTOS.VASO.x, y: SONHO.PONTOS.VASO.y - ALTURA_DA_DICA };
    }

    function limites() {
        return fase === 'luta' ? SONHO.ARENA : SONHO.limites;
    }

    function atores() {
        return [{ base: mascara.y, desenhar: V.Mascara.desenhar }];
    }

    V.CapituloMemoria = { cenario: SONHO, entrar, atualizar, aoAtacar, dica, limites, atores };
})(window.Vigilia);

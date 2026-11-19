//=============================
// VIGÍLIA - paletas de cena
//
// O cenário é desenhado com "nomes de cor" (parede, piso, móvel...). Trocar a
// paleta muda o clima da cena inteira, e a transição mistura as duas aos poucos:
// é assim que o sonho dourado vira pesadelo sem redesenhar nada.
//=============================
(function (V) {
    'use strict';

    const PALETAS = {
        quarto: {
            parede: '#2e2842', rodape: '#1f1a2e', piso: '#262033', fresta: '#1a1524',
            movel: '#3d3458', movelSombra: '#292240', destaque: '#4a2038', manta: '#463c60',
            vidro: '#1b2440', colchao: '#4a4468', travesseiro: '#6a6388', vinheta: 0.7
        },
        esperanca: {
            parede: '#57506f', rodape: '#443e5a', piso: '#5a474a', fresta: '#46373a',
            movel: '#6a5560', movelSombra: '#4a3a48', destaque: '#a3566a', manta: '#8a7ab0',
            vidro: '#ffd9a0', colchao: '#8d86a8', travesseiro: '#cfc9de', vinheta: 0.35
        },
        sonho: {
            parede: '#f3d9b1', rodape: '#e6c08e', piso: '#b9794a', fresta: '#9c6238',
            movel: '#7a4a2e', movelSombra: '#5e3822', destaque: '#c9483b', planta: '#5d8a4e',
            ceuAlto: '#ff9e7a', ceuBaixo: '#ffe2a8', sol: '#fff3c4', morro: '#d9826a',
            vaso: '#3d2a22', chama: '#ffb347', toalha: '#fff8ea', vinheta: 0.3
        },
        pesadelo: {
            parede: '#2a1420', rodape: '#1c0c16', piso: '#22101a', fresta: '#140810',
            movel: '#100609', movelSombra: '#070304', destaque: '#5a0f1c', planta: '#1c1a14',
            ceuAlto: '#0a0206', ceuBaixo: '#4a0716', sol: '#c2263d', morro: '#12060a',
            vaso: '#050305', chama: '#6fa8ff', toalha: '#6b5a5e', vinheta: 0.85
        },
        alvorada: {
            parede: '#fff6e0', rodape: '#f3e3bd', piso: '#e2c69a', fresta: '#cfae7e',
            movel: '#b99263', movelSombra: '#9a7648', destaque: '#e58a7a', planta: '#7fb26a',
            ceuAlto: '#cfeaff', ceuBaixo: '#fff2c9', sol: '#ffffff', morro: '#a9cfa0',
            vaso: '#8a6a4a', chama: '#ffb347', toalha: '#ffffff', vinheta: 0.1
        }
    };

    let origem = PALETAS.quarto;
    let destino = PALETAS.quarto;
    let progresso = 1;
    let duracao = 1;
    let atual = {};

    function paraRgb(hex) {
        const n = parseInt(hex.slice(1), 16);
        return [n >> 16, (n >> 8) & 255, n & 255];
    }

    function paraHex(canais) {
        return '#' + canais.map(function (c) { return Math.round(c).toString(16).padStart(2, '0'); }).join('');
    }

    function misturarCores(hexA, hexB, t) {
        const a = paraRgb(hexA);
        const b = paraRgb(hexB);
        return paraHex(a.map(function (canal, i) { return V.Util.misturar(canal, b[i], t); }));
    }

    // Mistura um item da paleta, que pode ser cor (texto) ou número (ex.: vinheta).
    function misturarItem(a, b, t) {
        if (a === undefined) return b;
        return typeof b === 'number' ? V.Util.misturar(a, b, t) : misturarCores(a, b, t);
    }

    function recalcular() {
        atual = {};
        Object.keys(destino).forEach(function (chave) {
            atual[chave] = misturarItem(origem[chave], destino[chave], progresso);
        });
    }

    function definir(nome) {
        origem = destino = PALETAS[nome];
        progresso = 1;
        recalcular();
    }

    function transicionar(nome, segundos) {
        // Parte da mistura atual, para não dar salto se uma transição interromper outra.
        origem = atual;
        destino = PALETAS[nome];
        progresso = 0;
        duracao = segundos;
    }

    function atualizar(dt) {
        if (progresso >= 1) return;
        progresso = Math.min(1, progresso + dt / duracao);
        recalcular();
    }

    // Cor (ou número) atual para um nome da paleta.
    function cor(chave) {
        return atual[chave];
    }

    // Cor intermediária entre dois nomes da paleta (usada no degradê do céu).
    function entre(chaveA, chaveB, t) {
        return misturarCores(atual[chaveA], atual[chaveB], t);
    }

    recalcular();

    V.Paleta = { definir, transicionar, atualizar, cor, entre };
})(window.Vigilia);

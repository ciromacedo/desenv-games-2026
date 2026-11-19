//=============================
// VIGÍLIA - sprites em pixel art
//
// Cada sprite é uma lista de linhas de texto: cada letra é um pixel e a legenda
// "cores" diz qual cor a letra vale ("." é transparente). Na primeira vez que um
// sprite é pedido ele é pintado num canvas pequeno, que fica guardado para reuso.
// "contorno" desenha uma borda de 1 pixel em volta, para o sprite não sumir no fundo.
//=============================
(function (V) {
    'use strict';

    const PELO = '#07070c';
    const CORES_GATO = { k: PELO, y: '#ffd84a' };
    const CONTORNO_GATO = '#4a4a6a';

    const CORES_GAROTA = { h: '#5a3320', s: '#e9bd9a', e: '#2a1d17', d: '#f2c94c' };

    const LINHAS_GAROTA = [
        '...hhhh...',
        '..hhhhhh..',
        '..hsssshh.',
        '..hsesesh.',
        '..hsssshh.',
        '..hhsshh..',
        '.hhddddhh.',
        '.h.dddd.h.',
        '..sdddds..',
        '..sdddds..',
        '...dddd...',
        '..dddddd..',
        '..dddddd..',
        '.dddddddd.',
        '.dddddddd.',
        '...s..s...',
        '...s..s...',
        '...s..s...'
    ];

    const DEFINICOES = {
        gatoBaixo1: {
            cores: CORES_GATO, contorno: CONTORNO_GATO,
            linhas: [
                '.k......k...',
                '.kk....kk...',
                '.kkkkkkkk...',
                '.kykkkkyk...',
                '.kykkkkyk...',
                '.kkkkkkkk...',
                '..kkkkkk....',
                '..kkkkkk..k.',
                '..kkkkkk.kk.',
                '..kkkkkkkk..',
                '..kk..kk....'
            ]
        },
        gatoBaixo2: {
            cores: CORES_GATO, contorno: CONTORNO_GATO,
            linhas: [
                '.k......k...',
                '.kk....kk...',
                '.kkkkkkkk...',
                '.kykkkkyk...',
                '.kykkkkyk...',
                '.kkkkkkkk...',
                '..kkkkkk....',
                '..kkkkkk.k..',
                '..kkkkkk.kk.',
                '..kkkkkkkk..',
                '...k..k.....'
            ]
        },
        gatoCima1: {
            cores: CORES_GATO, contorno: CONTORNO_GATO,
            linhas: [
                '.k......k...',
                '.kk....kk...',
                '.kkkkkkkk...',
                '.kkkkkkkk...',
                '.kkkkkkkk...',
                '.kkkkkkkk...',
                '..kkkkkk....',
                '..kkkkkk..k.',
                '..kkkkkk.kk.',
                '..kkkkkkkk..',
                '..kk..kk....'
            ]
        },
        gatoCima2: {
            cores: CORES_GATO, contorno: CONTORNO_GATO,
            linhas: [
                '.k......k...',
                '.kk....kk...',
                '.kkkkkkkk...',
                '.kkkkkkkk...',
                '.kkkkkkkk...',
                '.kkkkkkkk...',
                '..kkkkkk....',
                '..kkkkkk.k..',
                '..kkkkkk.kk.',
                '..kkkkkkkk..',
                '...k..k.....'
            ]
        },
        gatoLado1: {
            cores: CORES_GATO, contorno: CONTORNO_GATO,
            linhas: [
                '...........k.k..',
                '...........kkkk.',
                '.k.........kkyk.',
                'k..........kkkkk',
                'k..kkkkkkkkkkkk.',
                'k.kkkkkkkkkkkk..',
                '.kkkkkkkkkkkk...',
                '..kkkkkkkkkkk...',
                '..kkkkkkkkkkk...',
                '..kk.k...kk.k...'
            ]
        },
        gatoLado2: {
            cores: CORES_GATO, contorno: CONTORNO_GATO,
            linhas: [
                '...........k.k..',
                '...........kkkk.',
                'k..........kkyk.',
                'k..........kkkkk',
                '.k.kkkkkkkkkkkk.',
                '.kkkkkkkkkkkkk..',
                '.kkkkkkkkkkkk...',
                '..kkkkkkkkkkk...',
                '..kkkkkkkkkkk...',
                '...kk....k.kk...'
            ]
        },

        garota: { cores: CORES_GAROTA, linhas: LINHAS_GAROTA },

        // No quarto ela usa o mesmo desenho, com um moletom lilás.
        garotaAcordada: {
            cores: Object.assign({}, CORES_GAROTA, { d: '#6f6a8f' }),
            linhas: LINHAS_GAROTA
        },

        // No pesadelo: caída, presa por fios, como uma marionete.
        garotaMarionete: {
            cores: { h: '#2e1a12', s: '#b99680', d: '#8a7430' },
            linhas: [
                '....hhhh..',
                '...hhhhhh.',
                '...hhsshh.',
                '...hhssh..',
                '..hdddd...',
                '.hddddddd.',
                '.ddddddddd',
                '.ddddddddd'
            ]
        },

        ex: {
            cores: { h: '#2a1d17', s: '#e3b28c', e: '#2a1d17', w: '#f3efe8', p: '#27344f', r: '#c9483b', g: '#4d7a45', k: '#14141c' },
            linhas: [
                '...hhhh.....',
                '..hhhhhh....',
                '..hssssh....',
                '..sesses....',
                '..ssssss....',
                '...ssss.....',
                '..wwwwww.rr.',
                '.wwwwwwwwrrr',
                '.wwwwwwwsgr.',
                '.wwwwwww.g..',
                '.swwwwww.g..',
                '..wwwwww....',
                '..pppppp....',
                '..pp..pp....',
                '..pp..pp....',
                '..pp..pp....',
                '..pp..pp....',
                '..kk..kk....'
            ]
        },

        // A Máscara. Os olhos (linha 4, colunas 10 e 13) são pintados à parte.
        mascara: {
            cores: { k: '#050305', m: '#f4efe6' }, contorno: '#5a0f1c',
            linhas: [
                '..........kkkk..........',
                '.........kkkkkk.........',
                '........kkmmmmkk........',
                '........kmmmmmkk........',
                '........kmkmmkmk........',
                '........kmmmmmmk........',
                '........kmmmmmmk........',
                '........kmmkkmmk........',
                '........kkmmmmkk........',
                '.......kkkkkkkkkk.......',
                '....kkkkkkkkkkkkkkkk....',
                '...kkkkkkkkkkkkkkkkkk...',
                '..kkk.kkkkkkkkkkkk.kkk..',
                '..kk..kkkkkkkkkkkk..kk..',
                '..kk..kkkkkkkkkkkk..kk..',
                '..kk..kkkkkkkkkkkk..kk..',
                '..kk.kkkkkkkkkkkkkk.kk..',
                '..kk.kkkkkkkkkkkkkk.kk..',
                '.kkk.kkkkkkkkkkkkkk.kkk.',
                '.k.k.kkkkkkkkkkkkkk.k.k.',
                '.....kkkkkkkkkkkkkk.....',
                '....kkkkkkkkkkkkkkkk....',
                '....kkkkkkkkkkkkkkkk....',
                '....kkkkkkkkkkkkkkkk....',
                '...kkkkkkkkkkkkkkkkkk...',
                '...kkkkkkkkkkkkkkkkkk...',
                '...kkkkkkkkkkkkkkkkkk...',
                '...kk.kkk.kkkk.kkk.kk...',
                '...k...k...kk...k...k...'
            ]
        },

        // O objeto que não pertence à lembrança.
        vasoQuebrado: {
            cores: { w: '#f6f1e7', b: '#4a6fb0', c: '#8d87a6' }, contorno: '#9fb4e8',
            linhas: [
                '..w.w..w',
                '.wwcwwww',
                '.wwcwww.',
                'wwwwcwww',
                'wbbbbbbw',
                'wwwwwwww',
                'wwwwwwww',
                '.wwwwww.',
                '..wwww..'
            ]
        }
    };

    const guardados = {};

    function larguraDe(linhas) {
        return Math.max.apply(null, linhas.map(function (linha) { return linha.length; }));
    }

    function pintar(definicao) {
        const linhas = definicao.linhas;
        const largura = larguraDe(linhas);
        const altura = linhas.length;
        const margem = definicao.contorno ? 1 : 0;

        const canvas = document.createElement('canvas');
        canvas.width = largura + margem * 2;
        canvas.height = altura + margem * 2;
        const ctx = canvas.getContext('2d');

        function cheio(x, y) {
            return y >= 0 && y < altura && (linhas[y][x] || '.') !== '.';
        }

        if (definicao.contorno) {
            ctx.fillStyle = definicao.contorno;
            for (let y = -1; y <= altura; y++) {
                for (let x = -1; x <= largura; x++) {
                    const encostado = cheio(x - 1, y) || cheio(x + 1, y) || cheio(x, y - 1) || cheio(x, y + 1);
                    if (!cheio(x, y) && encostado) ctx.fillRect(x + margem, y + margem, 1, 1);
                }
            }
        }

        for (let y = 0; y < altura; y++) {
            for (let x = 0; x < largura; x++) {
                if (!cheio(x, y)) continue;
                ctx.fillStyle = definicao.cores[linhas[y][x]];
                ctx.fillRect(x + margem, y + margem, 1, 1);
            }
        }

        canvas.margem = margem;
        return canvas;
    }

    function espelharCanvas(original) {
        const canvas = document.createElement('canvas');
        canvas.width = original.width;
        canvas.height = original.height;
        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(original, 0, 0);
        canvas.margem = original.margem;
        return canvas;
    }

    // Devolve o canvas do sprite (já pintado), normal ou espelhado na horizontal.
    function obter(nome, espelhado) {
        const chave = nome + (espelhado ? ':espelhado' : '');
        if (!guardados[chave]) {
            guardados[chave] = espelhado ? espelharCanvas(obter(nome, false)) : pintar(DEFINICOES[nome]);
        }
        return guardados[chave];
    }

    V.Sprites = { obter };
})(window.Vigilia);

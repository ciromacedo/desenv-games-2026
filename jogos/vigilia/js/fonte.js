//=============================
// VIGÍLIA - fonte de pixels
//
// Letras de 5 pixels de altura para o texto desenhado dentro da cena
// (as palavras que a Máscara lança e a dica "E"). Só existem as letras usadas.
//=============================
(function (V) {
    'use strict';

    const ALTURA = 5;
    const ESPACO_ENTRE_LETRAS = 1;

    const GLIFOS = {
        'A': ['010', '101', '111', '101', '101'],
        'C': ['011', '100', '100', '100', '011'],
        'D': ['110', '101', '101', '101', '110'],
        'E': ['111', '100', '110', '100', '111'],
        'F': ['111', '100', '110', '100', '100'],
        'G': ['011', '100', '101', '101', '011'],
        'I': ['111', '010', '010', '010', '111'],
        'L': ['100', '100', '100', '100', '111'],
        'M': ['10001', '11011', '10101', '10001', '10001'],
        'N': ['1001', '1101', '1011', '1001', '1001'],
        'O': ['111', '101', '101', '101', '111'],
        'P': ['110', '101', '110', '100', '100'],
        'R': ['110', '101', '110', '101', '101'],
        'S': ['011', '100', '010', '001', '110'],
        'T': ['111', '010', '010', '010', '010'],
        'U': ['101', '101', '101', '101', '111'],
        'X': ['101', '101', '010', '101', '101'],
        'Z': ['111', '001', '010', '100', '111'],
        ' ': ['00', '00', '00', '00', '00']
    };

    // Letras acentuadas reaproveitam o desenho da letra base.
    const ACENTUADAS = { 'É': 'E' };

    function glifo(letra) {
        return GLIFOS[ACENTUADAS[letra] || letra] || GLIFOS[' '];
    }

    function largura(texto) {
        let total = 0;
        for (const letra of texto) total += glifo(letra)[0].length + ESPACO_ENTRE_LETRAS;
        return total - ESPACO_ENTRE_LETRAS;
    }

    // Chama pintar(x, y) para cada pixel aceso do texto, a partir de (x0, y0).
    function percorrer(texto, x0, y0, pintar) {
        let x = x0;
        for (const letra of texto) {
            const linhas = glifo(letra);
            linhas.forEach(function (linha, y) {
                for (let i = 0; i < linha.length; i++) {
                    if (linha[i] === '1') pintar(x + i, y0 + y);
                }
            });
            if (ACENTUADAS[letra]) pintar(x + 1, y0 - 2);   // acento agudo
            x += linhas[0].length + ESPACO_ENTRE_LETRAS;
        }
    }

    V.Fonte = { ALTURA, largura, percorrer };
})(window.Vigilia);

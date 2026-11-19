//=============================
// VIGÍLIA - funções matemáticas de apoio
//=============================
(function (V) {
    'use strict';

    function limitar(valor, minimo, maximo) {
        return Math.max(minimo, Math.min(maximo, valor));
    }

    function aleatorio(minimo, maximo) {
        return minimo + Math.random() * (maximo - minimo);
    }

    function sortear(lista) {
        return lista[Math.floor(Math.random() * lista.length)];
    }

    function misturar(a, b, t) {
        return a + (b - a) * t;
    }

    // Anda de "valor" até "alvo" sem passar dele.
    function aproximar(valor, alvo, passo) {
        return valor < alvo ? Math.min(alvo, valor + passo) : Math.max(alvo, valor - passo);
    }

    function distancia(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    // Vetor de tamanho 1 que aponta de "origem" para "destino".
    function rumo(origem, destino) {
        const dx = destino.x - origem.x;
        const dy = destino.y - origem.y;
        const tamanho = Math.hypot(dx, dy) || 1;
        return { x: dx / tamanho, y: dy / tamanho };
    }

    function diferencaAngular(a, b) {
        return Math.atan2(Math.sin(a - b), Math.cos(a - b));
    }

    // O alvo está dentro da "fatia de pizza" do golpe?
    function dentroDoArco(origem, angulo, alvo, alcance, abertura) {
        const d = distancia(origem, alvo);
        if (d > alcance) return false;
        if (d < 8) return true;       // colado no alvo: acerta em qualquer direção
        const anguloAlvo = Math.atan2(alvo.y - origem.y, alvo.x - origem.x);
        return Math.abs(diferencaAngular(anguloAlvo, angulo)) <= abertura;
    }

    function retangulosSeCruzam(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    V.Util = {
        limitar, aleatorio, sortear, misturar, aproximar,
        distancia, rumo, diferencaAngular, dentroDoArco, retangulosSeCruzam
    };
})(window.Vigilia);

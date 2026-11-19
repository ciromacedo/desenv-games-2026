//=============================
// VIGÍLIA - configurações
//
// Todos os arquivos do jogo penduram o que exportam em window.Vigilia.
// Este é o primeiro a carregar: guarda só números e cores de ajuste, sem lógica.
// Distâncias em pixels da tela interna (320x180); tempos em segundos.
//=============================
(function (V) {
    'use strict';

    V.CONFIG = {
        LARGURA: 320,
        ALTURA: 180,
        QUADRO_MAXIMO: 0.033,          // limite do passo de tempo (evita saltos se a aba travar)
        ALCANCE_INTERACAO: 30,

        GATO: {
            VELOCIDADE: 80,
            VIDAS: 9,
            ALCANCE_GOLPE: 34,
            ABERTURA_GOLPE: 1.0,       // meio-ângulo do golpe, em radianos
            DURACAO_GOLPE: 0.18,
            RECARGA_GOLPE: 0.42,
            INVENCIVEL_APOS_DANO: 1.3,
            EMPURRAO_DANO: 170,
            ALTURA_CENTRO: 5           // do chão até o meio do corpo (origem do golpe)
        },

        MASCARA: {
            VIDA: 10,
            VELOCIDADE: 26,
            VELOCIDADE_FURIA: 38,
            VELOCIDADE_INVESTIDA: 190,
            TEMPO_PREPARO: 0.7,
            TEMPO_PREPARO_FURIA: 0.5,
            TEMPO_INVESTIDA: 0.48,
            TEMPO_CANSACO: 1.05,       // janela em que o gato pode bater sem risco
            TEMPO_CONJURAR: 0.7,
            CHANCE_CONJURAR: 0.65,
            RAIO_TOQUE: 15,
            RAIO_TOQUE_INVESTIDA: 22,
            INVENCIVEL_APOS_GOLPE: 0.45,
            EMPURRAO_GOLPE: 80,
            ALTURA_CENTRO: 12
        },

        PALAVRAS: {
            LISTA: ['CULPA', 'SOZINHA', 'EXAGERADA', 'NINGUÉM', 'SUA CULPA', 'FICA', 'INGRATA'],
            VELOCIDADE_MINIMA: 80,
            VELOCIDADE_MAXIMA: 100
        }
    };

    // Cores que não mudam com a cena (as que mudam ficam em paleta.js).
    V.CORES = {
        TINTA: '#06050b',
        OSSO: '#f4efe6',
        LUA: '#9fb4e8',
        BRASA: '#ffcf8a',
        FERIDA: '#c2263d',
        NEVOA: '#8d87a6',
        CREME: '#fff8ea',
        BREU: '#050305'
    };
})(window.Vigilia = window.Vigilia || {});

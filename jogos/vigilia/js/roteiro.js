//=============================
// VIGÍLIA - roteiro
//
// Todo o texto da história fica aqui, separado da lógica.
// Cada fala é { quem, texto, duracao (s), vilao }.
//=============================
(function (V) {
    'use strict';

    const NARRADOR = '';
    const ELE = 'Ele';
    const ELA = 'Ela';

    function fala(quem, texto, duracao, vilao) {
        return { quem: quem, texto: texto, duracao: duracao || 4.6, vilao: Boolean(vilao) };
    }

    V.ROTEIRO = {
        QUARTO: {
            ABERTURA: fala(NARRADOR, 'Três semanas. As cortinas nunca abrem.'),
            TELA: fala(NARRADOR, 'A tela ainda acesa. Ninguém olha para ela há dias.'),
            FOTO: fala(NARRADOR, 'Uma foto rasgada ao meio. Uma das metades sumiu.'),
            CELULAR: fala(NARRADOR, '37 mensagens não lidas. Ela não responde ninguém.'),
            CAMA: fala(NARRADOR, 'Algo pesa sobre o sono dela. Você consegue ver. Ela não.'),
            DORMIR: fala(NARRADOR, 'Você fecha os olhos junto dela.', 2.4),
            MANHA: fala(NARRADOR, 'O quarto respira. Uma fresta de manhã entra pela cortina.'),
            FINAL: fala(ELA, 'Você ficou comigo o tempo todo, não ficou?', 3.8)
        },

        SONHO: {
            ABERTURA: fala(NARRADOR, 'Uma tarde dourada. Tudo no lugar. Tudo perfeito demais.'),
            VASO_VISTO: fala(NARRADOR, 'Um vaso de porcelana quebrado, numa sala onde nada está fora do lugar.'),
            VASO_PEGO: fala(NARRADOR, 'O caco não pertence a esta memória. Ele corta o que é falso.'),
            GARRAS: fala(NARRADOR, 'Suas garras atravessam a lembrança como fumaça. Procure algo que não pertence a este lugar.', 4.2),
            LEMBRANCA_1: fala(ELE, 'Lembra desse dia? Você estava tão feliz.'),
            LEMBRANCA_2: fala(ELA, 'Eu... estava?'),
            LEMBRANCA_3: fala(ELE, 'Você não precisa de mais ninguém. Só de mim.'),
            LEMBRANCA_4: fala(ELE, 'Que gato insistente. Tira ele daqui, amor.'),
            REVELACAO: fala(ELE, 'VOCÊ NÃO É NADA SEM MIM.', 3.2, true),
            PROVOCACAO_1: fala(ELE, 'Sem mim você não é ninguém.', 3, true),
            PROVOCACAO_2: fala(ELE, 'Você vai voltar. Você sempre volta.', 3, true),
            LIBERTACAO: fala(ELA, 'Não era amor. Era medo.', 3.6),
            DERROTA: 'O pesadelo expulsou você. Gatos têm nove vidas.'
        },

        OBJETIVOS: {
            ENTRAR_NO_SONHO: 'Suba na cama e entre no sonho dela.',
            IR_ATE_ELA: 'Vá até ela.',
            EXPLORAR: 'Explore a lembrança. Algo aqui não pertence a ela.',
            LEVAR_CACO: 'Leve o caco até ele e ataque.',
            QUEBRAR_MASCARA: 'Quebre a máscara. Ataque quando ele se cansar depois da investida.'
        }
    };
})(window.Vigilia);

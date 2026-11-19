//=============================
// VIGÍLIA - tela
//
// Único arquivo que fala com o canvas. Oferece formas simples (retângulo, elipse,
// linha, sprite, texto) sempre em pixels inteiros, e cuida da câmera.
//=============================
(function (V) {
    'use strict';

    const LARGURA = V.CONFIG.LARGURA;
    const ALTURA = V.CONFIG.ALTURA;
    const SUAVIDADE_CAMERA = 4.5;

    let canvas = null;
    let ctx = null;
    const camera = { x: 0, y: 0 };

    function iniciar(elemento) {
        canvas = elemento;
        canvas.width = LARGURA;
        canvas.height = ALTURA;
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
    }

    /* ---------- câmera ---------- */

    function alvoDaCamera(foco, cenario) {
        return {
            x: V.Util.limitar(foco.x - LARGURA / 2, 0, cenario.LARGURA - LARGURA),
            y: V.Util.limitar(foco.y - ALTURA / 2, 0, cenario.ALTURA - ALTURA)
        };
    }

    function seguir(foco, cenario, dt) {
        const alvo = alvoDaCamera(foco, cenario);
        const passo = Math.min(1, dt * SUAVIDADE_CAMERA);
        camera.x += (alvo.x - camera.x) * passo;
        camera.y += (alvo.y - camera.y) * passo;
    }

    function centralizar(foco, cenario) {
        Object.assign(camera, alvoDaCamera(foco, cenario));
    }

    // Converte um ponto da tela (em pixels do canvas) para a posição no cenário.
    function paraMundo(ponto) {
        return { x: ponto.x + camera.x, y: ponto.y + camera.y };
    }

    /* ---------- quadro ---------- */

    // Limpa a tela e passa a desenhar em coordenadas do cenário.
    function comecarMundo(tremor) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, LARGURA, ALTURA);
        const tx = (Math.random() - 0.5) * tremor;
        const ty = (Math.random() - 0.5) * tremor;
        ctx.translate(-Math.round(camera.x + tx), -Math.round(camera.y + ty));
    }

    // Volta a desenhar em coordenadas da tela (efeitos por cima de tudo).
    function terminarMundo() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /* ---------- formas ---------- */

    function retangulo(x, y, largura, altura, cor) {
        ctx.fillStyle = cor;
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(largura), Math.round(altura));
    }

    function ponto(x, y, cor) {
        retangulo(x, y, 1, 1, cor);
    }

    // Elipse preenchida, feita de linhas horizontais (fica "serrilhada", como pixel art).
    function elipse(cx, cy, raioX, raioY, cor) {
        ctx.fillStyle = cor;
        for (let dy = -raioY; dy <= raioY; dy++) {
            const meia = Math.round(raioX * Math.sqrt(1 - (dy * dy) / (raioY * raioY + 0.01)));
            ctx.fillRect(Math.round(cx - meia), Math.round(cy + dy), meia * 2, 1);
        }
    }

    function linha(x0, y0, x1, y1, cor) {
        const passos = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
        ctx.fillStyle = cor;
        for (let i = 0; i <= passos; i++) {
            const t = i / passos;
            ctx.fillRect(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), 1, 1);
        }
    }

    // Tudo o que "desenhar" pintar sai com a transparência pedida.
    function comAlfa(alfa, desenhar) {
        const anterior = ctx.globalAlpha;
        ctx.globalAlpha = anterior * V.Util.limitar(alfa, 0, 1);
        desenhar();
        ctx.globalAlpha = anterior;
    }

    // Tudo o que "desenhar" pintar fica preso dentro do retângulo.
    function recortar(x, y, largura, altura, desenhar) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, largura, altura);
        ctx.clip();
        desenhar();
        ctx.restore();
    }

    // Desenha um sprite apoiado no chão: (centroX, base) é o ponto dos pés.
    // Devolve o canto do desenho, para quem quiser pintar detalhes por cima.
    function sprite(nome, centroX, base, espelhado) {
        const imagem = V.Sprites.obter(nome, espelhado);
        const x = Math.round(centroX - imagem.width / 2);
        const y = Math.round(base - imagem.height + imagem.margem);
        ctx.drawImage(imagem, x, y);
        return { x: x + imagem.margem, y: y + imagem.margem };
    }

    // Texto na fonte de pixels, centralizado em x. "contorno" é opcional.
    function texto(conteudo, centroX, y, cor, contorno) {
        const x = Math.round(centroX - V.Fonte.largura(conteudo) / 2);
        if (contorno) {
            ctx.fillStyle = contorno;
            V.Fonte.percorrer(conteudo, x, Math.round(y), function (px, py) {
                ctx.fillRect(px - 1, py - 1, 3, 3);
            });
        }
        ctx.fillStyle = cor;
        V.Fonte.percorrer(conteudo, x, Math.round(y), function (px, py) {
            ctx.fillRect(px, py, 1, 1);
        });
    }

    // Escurece as bordas da tela. Chamar depois de terminarMundo().
    function vinheta(forca) {
        const degrade = ctx.createRadialGradient(
            LARGURA / 2, ALTURA / 2, ALTURA * 0.42,
            LARGURA / 2, ALTURA / 2, LARGURA * 0.62
        );
        degrade.addColorStop(0, 'rgba(0,0,0,0)');
        degrade.addColorStop(1, 'rgba(0,0,0,' + forca + ')');
        ctx.fillStyle = degrade;
        ctx.fillRect(0, 0, LARGURA, ALTURA);
    }

    V.Tela = {
        camera, iniciar, seguir, centralizar, paraMundo, comecarMundo, terminarMundo,
        retangulo, ponto, elipse, linha, comAlfa, recortar, sprite, texto, vinheta
    };
})(window.Vigilia);

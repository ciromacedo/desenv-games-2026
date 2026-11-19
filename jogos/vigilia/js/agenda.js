//=============================
// VIGÍLIA - agenda
//
// Substitui o setTimeout: as tarefas correm no relógio do próprio jogo,
// então podem ser todas canceladas de uma vez ao reiniciar.
//=============================
(function (V) {
    'use strict';

    let tarefas = [];

    function depois(segundos, acao) {
        tarefas.push({ falta: segundos, acao: acao });
    }

    function atualizar(dt) {
        const vencidas = [];
        tarefas = tarefas.filter(function (tarefa) {
            tarefa.falta -= dt;
            if (tarefa.falta > 0) return true;
            vencidas.push(tarefa);
            return false;
        });
        // Executa depois de filtrar: uma ação pode agendar outras sem bagunçar a lista.
        vencidas.forEach(function (tarefa) { tarefa.acao(); });
    }

    function limpar() {
        tarefas = [];
    }

    V.Agenda = { depois, atualizar, limpar };
})(window.Vigilia);

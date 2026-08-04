# REGRAS_DE_NEGOCIO_DASHBOARD_TIMER_VIEW.md
# Documento de regras de negócio para a tela principal do Timer (Dashboard)

## RF - Requisitos Funcionais
- RF001: Timer configurável entre 25min e 60min
- RF002: Botão +5min para incrementar tempo (apenas quando timer estiver parado/pausado)
- RF003: Iniciar/pausar/continuar sessão
- RF004: Shader animation ao redor do cronômetro proporcional ao tempo restante
- RF005: Alarme + notificação ao final da sessão
- RF006: Exibir Current Flow (Focus Score) e Focus Rank

## RN - Regras de Negócio
- RN001: Timer não pode ser menor que 25min nem maior que 60min
- RN002: Botão +5min só funciona se timer não estiver em execução ativa
- RN003: Ao finalizar sessão, exibir resumo das tasks concluídas naquela sessão
- RN004: Focus Rank é baseado no Focus Score acumulado do usuário

## US - User Stories
- US001: Como usuário, quero iniciar um timer de foco para estruturar meu tempo de estudo
- US002: Como usuário, quero adicionar 5min ao timer caso precise de mais tempo
- US003: Como usuário, quero receber um alarme quando meu tempo de foco acabar
# REGRAS_DE_NEGOCIO_STUDY_TASK_VIEW.md
# Documento de regras de negócio para a tela de Gerenciamento de Tarefas

## RF - Requisitos Funcionais
- RF001: Criar, editar, excluir e marcar tarefas como concluídas
- RF002: Definir prioridade das tarefas
- RF003: Drag-and-drop para reordenar tarefas
- RF004: Filtrar tarefas por nome
- RF005: Exibir daily goal (pomodoros concluídos no dia)
- RF006: Contador de sessões concluídas por tarefa

## RN - Regras de Negócio
- RN001: Tarefas são associadas a categorias
- RN002: Alterações na lista de tarefas refletem em tempo real nas métricas do analytics
- RN003: Conclusão de tarefa atualiza imediatamente o progresso do daily goal
- RN004: Ordenação das tarefas é persistida no banco de dados

## US - User Stories
- US001: Como usuário, quero adicionar tarefas para organizar o que preciso estudar
- US002: Como usuário, quero reordenar minhas tarefas por prioridade
- US003: Como usuário, quero marcar tarefas como concluídas para acompanhar meu progresso
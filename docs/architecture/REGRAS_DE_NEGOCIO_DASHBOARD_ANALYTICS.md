# REGRAS_DE_NEGOCIO_DASHBOARD_ANALYTICS.md
# Documento de regras de negócio para a tela de Analytics/Histórico

## RF - Requisitos Funcionais
- RF001: Exibir métricas dos últimos 7 dias
- RF002: Gráfico semanal de horas estudadas
- RF003: Listar sessões recentes (3 por padrão)
- RF004: Exportar métricas em CSV
- RF005: Exibir classificação de intensidade das sessões

## RN - Regras de Negócio
- RN001: Intensidade classificada em 4 faixas: Low Focus / Moderate / High Intensity / Perfect Focus
- RN002: Daily streak calculado a partir de dias consecutivos com pelo menos 1 sessão
- RN003: Focus score calculado como média de produtividade das sessões
- RN004: Dados são sempre recalculados a partir do histórico bruto, nunca armazenados como contadores fixos

## US - User Stories
- US001: Como usuário, quero ver minhas métricas de produtividade para acompanhar meu progresso
- US002: Como usuário, quero exportar meus dados para ter um backup local
- US003: Como usuário, quero ver minha sequência de dias estudados para me manter motivado
// TODO: Implementar página de detalhes de sessão específica - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_DASHBOARD_ANALYTICS.md
type Props = {
  params: {
    sessionId: string;
  };
};

export default function SessionDetailPage({ params }: Props) {
  return <div>Session Detail Page: {params.sessionId}</div>;
}

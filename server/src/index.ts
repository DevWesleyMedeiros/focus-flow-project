import { app } from "./app";
import { prisma } from "./db";

const PORT = process.env["PORT"] || 3000;

async function main() {
  await prisma.$connect();
  console.log("✅ Conectado ao PostgreSQL via Prisma");

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
}

main().catch(async (e) => {
  console.error("❌ Erro ao iniciar servidor:", e);
  await prisma.$disconnect();
  process.exit(1);
});

// TODO: Arquivo de entrada do servidor - iniciar o Express na porta definida
import { PrismaClient } from "@prisma/client";
import { app } from "./app";

const prisma = new PrismaClient();
const PORT = process.env.PORT || 8080;

async function main() {
  // Testar conexão com o banco
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

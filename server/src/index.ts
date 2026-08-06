import { app } from "./app";
import { connection, prisma } from "./db";

const PORT = process.env["NEXTAUTH_URL"] || 3000;

async function main() {
  await connection();
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

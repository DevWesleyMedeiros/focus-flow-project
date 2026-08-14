// arquivo que conecta meu cliente prisma com meu backend

import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma";

const connectionString = `${process.env["DATABASE_URL"]}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export { prisma };

// função que cria uma conexão com meu BD
export async function connection() {
  try {
    await prisma.$connect();
    console.log("Conectado com o meu Banco de Dados");
  } catch (error) {
    console.log(error);
  }
}

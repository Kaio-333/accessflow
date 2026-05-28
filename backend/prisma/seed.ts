import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcrypt"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
    const senhaHugo = await bcrypt.hash("123456", 10)
    const senhaMaria = await bcrypt.hash("123456", 10)

    await prisma.users.create({
        data: {
            email: "hugo@example.com",
            password: senhaHugo,
            profile: {
                create: {
                    name: "Hugo",
                    contrast: 4,
                    font: 3,
                    animations: true,
                    feedback: "Tema acessível ativado",
                },
            },
        },
    });
    await prisma.users.create({
        data: {
            email: "maria@example.com",
            password: senhaMaria,
            profile: {
                create: {
                    name: "Maria",
                    contrast: 2,
                    font: 1,
                    animations: false,
                    feedback: "Prefere menos animações",
                },
            },
        },
    });
    console.log("Seed executado com sucesso!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.users.create({
        data: {
            email: "hugo@example.com",
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
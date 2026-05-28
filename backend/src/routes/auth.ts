import { Router } from "express"
import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { createUser } from "../controllers/userController.js"
import { prisma } from "../lib/prisma.js"

const router = Router()

function signToken(userId: number, email: string): string {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET não configurado")
    }
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}

// POST /auth/register
router.post("/register", async (req: Request, res: Response) => {
    const { email, password, name, contrast, font, animations, feedback } = req.body

    if (!email || !password || !name) {
        res.status(400).json({ error: "email, password e name são obrigatórios" })
        return
    }

    try {
        const user = await createUser(
            email,
            password,
            name,
            contrast !== undefined ? Number(contrast) : undefined,
            font !== undefined ? Number(font) : undefined,
            animations !== undefined ? Boolean(animations) : undefined,
            feedback
        )
        const token = signToken(user.id, user.email)
        res.status(201).json({ token })
    } catch (err: any) {
        if (err.code === "P2002") {
            res.status(400).json({ error: "Email já cadastrado" })
            return
        }
        res.status(500).json({ error: "Erro interno" })
    }
})

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ error: "email e password são obrigatórios" })
        return
    }

    try {
        const user = await prisma.users.findUnique({ where: { email } })

        if (!user) {
            res.status(401).json({ error: "Credenciais inválidas" })
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            res.status(401).json({ error: "Credenciais inválidas" })
            return
        }

        const token = signToken(user.id, user.email)
        res.status(200).json({ token })
    } catch {
        res.status(500).json({ error: "Erro interno" })
    }
})

export default router

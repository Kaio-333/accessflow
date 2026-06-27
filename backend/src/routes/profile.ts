import { Router } from "express"
import type { Response } from "express"
import { auth } from "../middleware/auth.js"
import type { AuthRequest } from "../middleware/auth.js"
import { createProfile, getProfile, getProfilesByUser } from "../controllers/profileController.js"

const router = Router()

// All profile routes require authentication
router.use(auth)

// GET /profiles -> lista os perfis do usuário autenticado
router.get("/", async (req: AuthRequest, res: Response) => {
    if (!req.userId) {
        res.status(401).json({ error: "Não autenticado" })
        return
    }

    try {
        const profiles = await getProfilesByUser(req.userId)
        res.status(200).json({ profiles })
    } catch {
        res.status(500).json({ error: "Erro interno" })
    }
})

// POST /profiles -> cria um novo perfil para o usuário autenticado
router.post("/", async (req: AuthRequest, res: Response) => {
    if (!req.userId) {
        res.status(401).json({ error: "Não autenticado" })
        return
    }

    const { name, contrast, font, animations, feedback } = req.body

    if (!name || typeof name !== "string" || !name.trim()) {
        res.status(400).json({ error: "name é obrigatório" })
        return
    }

    try {
        const profile = await createProfile(
            req.userId,
            name.trim(),
            Number.isInteger(contrast) ? contrast : 1,
            Number.isInteger(font) ? font : 3,
            typeof animations === "boolean" ? animations : true,
            typeof feedback === "string" ? feedback : ""
        )
        res.status(201).json({ profile })
    } catch {
        res.status(500).json({ error: "Erro interno" })
    }
})

// GET /profiles/:id -> um perfil específico do usuário autenticado
router.get("/:id", async (req: AuthRequest, res: Response) => {
    if (!req.userId) {
        res.status(401).json({ error: "Não autenticado" })
        return
    }

    const id = Number(req.params.id)
    if (!Number.isInteger(id)) {
        res.status(400).json({ error: "id inválido" })
        return
    }

    try {
        const profile = await getProfile(req.userId, id)
        if (!profile) {
            res.status(404).json({ error: "Perfil não encontrado" })
            return
        }
        res.status(200).json({ profile })
    } catch {
        res.status(500).json({ error: "Erro interno" })
    }
})

export default router

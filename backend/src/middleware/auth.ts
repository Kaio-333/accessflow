import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
    userId?: number
    userEmail?: string
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
    if (!process.env.JWT_SECRET) {
        res.status(500).json({ error: "Configuração do servidor inválida" })
        return
    }

    const header = req.headers.authorization

    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token não fornecido" })
        return
    }

    const token = header.split(" ")[1]

    if (!token) {
        res.status(401).json({ error: "Token não fornecido" })
        return
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as {
            userId: number
            email: string
        }
        req.userId = payload.userId
        req.userEmail = payload.email
        next()
    } catch {
        res.status(401).json({ error: "Token inválido ou expirado" })
    }
}

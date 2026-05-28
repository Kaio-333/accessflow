import { prisma } from "../lib/prisma.js"
import bcrypt from "bcrypt"

// GET ALL
export async function getUsers() {
    const users = await prisma.users.findMany({
        include: { profile: true }
    })
    return users
}

// GET BY ID
export async function getUserById(id: number) {
    const user = await prisma.users.findUnique({
        where: { id },
        include: { profile: true }
    })
    return user
}

// CREATE
export async function createUser(email: string, password: string, name: string) {
    const senhaHash = await bcrypt.hash(password, 10)
    const user = await prisma.users.create({
        data: {
            email,
            password: senhaHash,
            profile: {
                create: {
                    name,
                    contrast: 1,
                    font: 1,
                    animations: true,
                    feedback: "",
                },
            },
        },
        include: { profile: true }
    })
    return user
}

// UPDATE
export async function updateUser(id: number, email?: string, password?: string) {
    const data: { email?: string, password?: string } = {}

    if (email) data.email = email
    if (password) data.password = await bcrypt.hash(password, 10)

    const user = await prisma.users.update({
        where: { id },
        data,
        include: { profile: true }
    })
    return user
}

// DELETE
export async function deleteUser(id: number) {
    await prisma.profile.deleteMany({
        where: { userId: id }
    })
    const user = await prisma.users.delete({
        where: { id }
    })
    return user
}
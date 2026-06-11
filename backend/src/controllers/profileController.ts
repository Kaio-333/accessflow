import { prisma } from "../lib/prisma.js"

// LIST BY USER
export async function getProfilesByUser(userId: number) {
    const profiles = await prisma.profile.findMany({
        where: { userId },
        orderBy: { id: "asc" }
    })

    return profiles
}

// GET BY ID
export async function getProfile(userId: number, id: number) {
    const profile = await prisma.profile.findFirst({
        where: {
            id,
            userId
        }
    })

    return profile
}

// CREATE
export async function createProfile(
    userId: number,
    name: string,
    contrast: number,
    font: number,
    animations: boolean,
    feedback: string
) {
    const profile = await prisma.profile.create({
        data: {
            userId,
            name,
            contrast,
            font,
            animations,
            feedback
        }
    })

    return profile
}

// UPDATE
export async function updateProfile(
    userId: number,
    id: number,
    data: {
        name?: string
        contrast?: number
        font?: number
        animations?: boolean
        feedback?: string
    }
) {
    const profile = await prisma.profile.updateMany({
        where: {
            id,
            userId
        },
        data
    })

    return profile
}

// DELETE
export async function deleteProfile(userId: number, id: number) {
    return await prisma.profile.deleteMany({
        where: {
            id,
            userId
        }
    })
}

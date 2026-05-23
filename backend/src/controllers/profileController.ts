import { prisma } from "../lib/prisma.js"

// GET BY ID
export async function getProfile(userId: number, id: number) {
    const profile = await prisma.profile.findUnique({
        where: { 
            id,
            userId  
        },
        include: { user: true }
    })
    return profile
}

// CREATE
export async function createProfile(userId: number, id: number, name: string, contrast: number, font: number, animations: boolean, feedback: string) {
    const profile = await prisma.profile.create({
        data: {
            id,
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
export async function updateProfile(userId: number, id: number, name?: string, contrast?: number, font?: number, animations?: boolean, feedback?: string) {
    const data: { name?: string, contrast?: number, font?: number, animations?: boolean, feedback?: string } = {}

    if (name !== undefined) data.name = name
    if (contrast !== undefined) data.contrast = contrast
    if (font !== undefined) data.font = font
    if (animations !== undefined) data.animations = animations
    if (feedback !== undefined) data.feedback = feedback

    const profile = await prisma.profile.update({
        where: { id }, 
        data
    })
    return profile
}

// DELETE
export async function deleteProfile(userId: number, id: number) {
    await prisma.profile.delete({
        where: { id }  
    })
}
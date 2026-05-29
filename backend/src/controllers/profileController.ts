import { prisma } from "../lib/prisma.js"
import { Font, Contrast } from "@prisma/client"

// GET BY ID
export async function getProfile(userId: number, id: number) {
    const profile = await prisma.profile.findFirst({
        where: {
            id,
            userId
        },
        include: {
            user: true
        }
    })

    return profile
}

// CREATE
export async function createProfile(
    userId: number,
    name: string,
    font: Font,
    size_font: number,
    letter_spacing: number,
    line_height: number,
    contrast: Contrast,
    focus_mode: boolean,
    highlight_links: boolean,
    animations: boolean,
    remove_animations: boolean,
    reading_ruler: boolean,
    reading_progress: boolean,
    feedback: string
) {
    const profile = await prisma.profile.create({
        data: {
            userId,
            name,
            font,
            size_font,
            letter_spacing,
            line_height,
            contrast,
            focus_mode,
            highlight_links,
            animations,
            remove_animations,
            reading_ruler,
            reading_progress,
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
        font?: Font
        size_font?: number
        letter_spacing?: number
        line_height?: number
        contrast?: Contrast
        focus_mode?: boolean
        highlight_links?: boolean
        animations?: boolean
        remove_animations?: boolean
        reading_ruler?: boolean
        reading_progress?: boolean
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
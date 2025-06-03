"use server"

import { revalidatePath } from "next/cache"
import { type PromoCode, mockPromoCodes, getEffectivePromoCodeStatus, type PromoCodeStatus } from "./types"

const promoCodesStore: PromoCode[] = [...mockPromoCodes]

export async function getPromoCodes(
  page = 1,
  limit = 10,
  searchTerm?: string,
  statusFilter?: PromoCodeStatus | "All",
): Promise<{ promoCodes: PromoCode[]; totalCount: number; totalPages: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredPromoCodes = promoCodesStore.map((pc) => ({ ...pc, effectiveStatus: getEffectivePromoCodeStatus(pc) }))

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase()
    filteredPromoCodes = filteredPromoCodes.filter(
      (pc) =>
        pc.code.toLowerCase().includes(lowerSearchTerm) ||
        (pc.description && pc.description.toLowerCase().includes(lowerSearchTerm)),
    )
  }

  if (statusFilter && statusFilter !== "All") {
    filteredPromoCodes = filteredPromoCodes.filter((pc) => getEffectivePromoCodeStatus(pc) === statusFilter)
  }

  // Sort by creation date descending
  filteredPromoCodes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const totalCount = filteredPromoCodes.length
  const totalPages = Math.ceil(totalCount / limit)
  const paginatedPromoCodes = filteredPromoCodes.slice((page - 1) * limit, page * limit)

  return { promoCodes: paginatedPromoCodes, totalCount, totalPages }
}

export async function addPromoCodeAction(
  promoCodeData: Omit<PromoCode, "id" | "timesUsed" | "createdAt" | "updatedAt">,
): Promise<{ success: boolean; message: string; promoCode?: PromoCode }> {
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Check for duplicate code
  if (promoCodesStore.some((pc) => pc.code.toLowerCase() === promoCodeData.code.toLowerCase())) {
    return { success: false, message: `Promo code "${promoCodeData.code}" already exists.` }
  }

  const newId = `PC${String(Date.now()).slice(-6)}` // More unique ID
  const currentDate = new Date().toISOString()
  const newPromoCode: PromoCode = {
    ...promoCodeData,
    id: newId,
    timesUsed: 0,
    createdAt: currentDate,
    updatedAt: currentDate,
  }
  promoCodesStore.unshift(newPromoCode)
  revalidatePath("/dashboard/promocodes")
  return { success: true, message: "Promo code added successfully!", promoCode: newPromoCode }
}

export async function updatePromoCodeAction(
  promoCodeId: string,
  promoCodeData: Partial<Omit<PromoCode, "id" | "timesUsed" | "createdAt" | "updatedAt">>,
): Promise<{ success: boolean; message: string; promoCode?: PromoCode }> {
  await new Promise((resolve) => setTimeout(resolve, 700))
  const promoCodeIndex = promoCodesStore.findIndex((pc) => pc.id === promoCodeId)

  if (promoCodeIndex === -1) {
    return { success: false, message: "Promo code not found." }
  }

  // Check for duplicate code if code is being changed
  if (promoCodeData.code && promoCodeData.code.toLowerCase() !== promoCodesStore[promoCodeIndex].code.toLowerCase()) {
    if (
      promoCodesStore.some((pc) => pc.id !== promoCodeId && pc.code.toLowerCase() === promoCodeData.code?.toLowerCase())
    ) {
      return { success: false, message: `Promo code "${promoCodeData.code}" already exists.` }
    }
  }

  const currentDate = new Date().toISOString()
  promoCodesStore[promoCodeIndex] = {
    ...promoCodesStore[promoCodeIndex],
    ...promoCodeData,
    updatedAt: currentDate,
  }
  revalidatePath("/dashboard/promocodes")
  return { success: true, message: "Promo code updated successfully!", promoCode: promoCodesStore[promoCodeIndex] }
}

// Deactivate/Activate instead of hard delete
export async function togglePromoCodeStatusAction(
  promoCodeId: string,
  isActive: boolean,
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const promoCodeIndex = promoCodesStore.findIndex((pc) => pc.id === promoCodeId)
  if (promoCodeIndex === -1) {
    return { success: false, message: "Promo code not found." }
  }
  promoCodesStore[promoCodeIndex].isActive = isActive
  promoCodesStore[promoCodeIndex].updatedAt = new Date().toISOString()
  revalidatePath("/dashboard/promocodes")
  return { success: true, message: `Promo code ${isActive ? "activated" : "deactivated"} successfully. `}
}

export async function generateUniquePromoCodeString(length = 8, prefix = ""): Promise<string>  {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let attempts = 0
  while (attempts < 100) {
    // Prevent infinite loop
    let result = prefix
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    if (!promoCodesStore.some((pc) => pc.code.toLowerCase() === result.toLowerCase())) {
      return result
    }
    attempts++
  }
  // Fallback if unique not found after 100 attempts (highly unlikely for reasonable length)
  return `${prefix}${Date.now().toString().slice(-length)}`
}
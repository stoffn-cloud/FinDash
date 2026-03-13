'use server';

// Verander dit:
// import { prisma } from "@/lib/prisma"; 

// Naar dit (directe import om types te dwingen):
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { revalidatePath } from "next/cache";

/**
 * Voegt een nieuwe holding toe aan de database
 */
export async function addUserHolding(data: {
  ticker_id: number;
  price: number;
  amount: number;
  purchase_date: string;
}) {
  try {
    // We gebruiken 'userHolding' omdat je model 'UserHolding' heet in schema.prisma
    await prisma.userHolding.create({
      data: {
        ticker_id: Number(data.ticker_id),
        quantity: Number(data.amount),
        purchasePrice: Number(data.price),
        purchaseDate: new Date(data.purchase_date),
      },
    });
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Prisma Create Error:", error);
    return { success: false, error: "Kon holding niet toevoegen" };
  }
}

/**
 * Verwijdert een specifieke holding op basis van ID
 */
export async function deleteUserHolding(id: number) {
  try {
    await prisma.userHolding.delete({
      where: { id: Number(id) }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Prisma Delete Error:", error);
    return { success: false, error: "Kon holding niet verwijderen" };
  }
}

/**
 * Wist de volledige tabel (Danger Zone actie)
 * Deze functie lost de error in je SettingsTab op!
 */
export async function resetToDemo() {
  try {
    // Wist alle records uit de user_holdings tabel
    await prisma.userHolding.deleteMany({});
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Prisma Reset Error:", error);
    return { success: false, error: "Kon database niet legen" };
  }
}
'use server'

import db from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import { Category } from '@/types'

export async function createCategory(name: string) {
   try {
      const category = await db.category.create({
         data: { name },
      })
      return category
   } catch (error) {
      console.error('Failed to create category:', error)
      return { success: false, error: 'Failed to create category' }
   }
}

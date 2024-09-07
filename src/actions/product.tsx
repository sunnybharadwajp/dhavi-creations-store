'use server'

import { revalidatePath } from 'next/cache'
import { ProductFormData, ApiResponse, Product } from '@/types'
import { PrismaClient } from '@prisma/client'
import { generateSKU } from '@/lib/utils'

const prisma = new PrismaClient()

export async function addProduct(
   formData: ProductFormData
): Promise<ApiResponse<Product>> {
   try {
      const sku = generateSKU(formData.name, formData.categoryId)
      const newProduct = await prisma.product.create({
         data: {
            name: formData.name,
            description: formData.description,
            categoryId: formData.categoryId,
            price: formData.price,
            stock: formData.stock,
            sku: sku,
            coverImageIndex: 0,
         },
         include: {
            category: true,
            images: true,
         },
      })

      revalidatePath('/products')

      return {
         success: true,
         data: newProduct as Product,
      }
   } catch (error) {
      console.error('Failed to add product:', error)
      return {
         success: false,
         error: 'Failed to add product. Please try again.',
      }
   }
}

'use server'

import db from '@/lib/db/prisma'
import { put, del } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

export const createImage = async (formData: any) => {
   const file: any = formData.get('image-file')

   if (file.size > 0) {
      const uploadFile = await put(`dhavi/products/${file.name}`, file, {
         access: 'public',
         token: process.env.BLOB_READ_WRITE_TOKEN,
      })

      return {
         url: uploadFile.url,
      }
   } else {
      throw new Error()
   }
}

export const deleteImageBlob = async (url: any) => {
   try {
      const response = await del(url.toString(), {
         token: process.env.BLOB_READ_WRITE_TOKEN,
      })
   } catch (error) {
      console.error(error)
   }
}

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Category, ProductFormData } from '@/types'
import { addProduct } from '@/actions/product'
import { useToast } from '@/hooks/use-toast'
import { createCategory } from '@/actions/category'

const formSchema = z.object({
   name: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
   }),
   description: z.string().min(10, {
      message: 'Description must be at least 10 characters.',
   }),
   categoryId: z.number(),
   price: z.number().positive(),
   stock: z.number().int().nonnegative(),
   // Remove sku from the schema
})

type AddProductFormProps = {
   categories: { id: number; name: string }[]
}

export default function AddProductForm({ categories }: AddProductFormProps) {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: '',
         description: '',
         categoryId: 0,
         price: 0,
         stock: 0,
      },
   })

   async function onSubmit(values: z.infer<typeof formSchema>) {
      const response = await addProduct(values)
      if (response.success) {
         // Handle successful submission (e.g., show a success message, redirect)
      } else {
         // Handle error (e.g., show an error message)
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Name</FormLabel>
                     <FormControl>
                        <Input placeholder="Product name" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Description</FormLabel>
                     <FormControl>
                        <Textarea
                           placeholder="Product description"
                           {...field}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="categoryId"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Category</FormLabel>
                     <Select
                        onValueChange={(value) =>
                           field.onChange(parseInt(value))
                        }
                        value={field.value.toString()}
                     >
                        <FormControl>
                           <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {categories.map((category) => (
                              <SelectItem
                                 key={category.id}
                                 value={category.id.toString()}
                              >
                                 {category.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="price"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Price</FormLabel>
                     <FormControl>
                        <Input
                           type="number"
                           step="0.01"
                           {...field}
                           onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                           }
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="stock"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Stock</FormLabel>
                     <FormControl>
                        <Input
                           type="number"
                           {...field}
                           onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                           }
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit">Submit</Button>
         </form>
      </Form>
   )
}

// Update the ProductFormData type
type ExtendedProductFormData = ProductFormData & {
   newCategory?: string
}

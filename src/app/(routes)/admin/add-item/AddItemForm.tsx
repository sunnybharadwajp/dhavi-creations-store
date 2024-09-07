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
   name: z.string().min(1, 'Name is required'),
   description: z.string(),
   categoryId: z.string(),
   newCategory: z.string().optional(),
   price: z.number().min(0),
   stock: z.number().int().min(0),
})

type AddProductFormProps = {
   categories: { id: number; name: string }[]
}

export default function AddProductForm({ categories }: AddProductFormProps) {
   const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const { toast } = useToast()

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: '',
         description: '',
         categoryId: '',
         newCategory: '',
         price: 0,
         stock: 0,
      },
   })

   async function onSubmit(values: z.infer<typeof formSchema>) {
      setIsSubmitting(true)
      let categoryId = values.categoryId

      if (values.categoryId === 'new' && values.newCategory) {
         const newCategoryResult = await createCategory(values.newCategory)
         if ('id' in newCategoryResult) {
            categoryId = newCategoryResult.id.toString()
         } else {
            throw new Error(newCategoryResult.error)
         }
      }

      const productData: ExtendedProductFormData = {
         name: values.name,
         description: values.description,
         categoryId: parseInt(categoryId),
         price: values.price,
         stock: values.stock,
         newCategory: values.newCategory,
      }

      const result = await addProduct(productData)
      console.log(result)
      setIsSubmitting(false)

      if (result.success) {
         toast({
            title: 'Product added successfully',
            description: `${result.data?.name} has been added to the inventory.`,
         })
         form.reset()
      } else {
         toast({
            title: 'Error',
            description: result.error || 'An unknown error occurred',
            variant: 'destructive',
         })
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
                        onValueChange={(value) => {
                           field.onChange(value)
                           setShowNewCategoryInput(value === 'new')
                        }}
                        defaultValue={field.value}
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
                           <SelectItem value="new">Add New Category</SelectItem>
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
               )}
            />
            {showNewCategoryInput && (
               <FormField
                  control={form.control}
                  name="newCategory"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>New Category</FormLabel>
                        <FormControl>
                           <Input placeholder="Enter new category" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            )}
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
            <Button type="submit" disabled={isSubmitting}>
               {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
         </form>
      </Form>
   )
}

// Update the ProductFormData type
type ExtendedProductFormData = ProductFormData & {
   newCategory?: string
}

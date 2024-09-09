'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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
import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from '@/components/ui/drawer'
import { useToast } from '@/hooks/use-toast'
import { SquareArrowOutUpRight } from 'lucide-react'

import { addProduct } from '@/actions/product'
import { createCategory } from '@/actions/category'
import { createImage } from '@/actions/image'

import { Category, ProductFormData } from '@/types'

const formSchema = z.object({
   name: z.string().min(1, 'Name is required'),
   description: z.string(),
   categoryId: z.string(),
   newCategory: z.string().optional(),
   price: z.number().min(0),
   stock: z.number().int().min(0),
})

type CreateProductFormProps = {
   categories: { id: number; name: string }[]
}

export default function CreateProductForm({
   categories,
}: CreateProductFormProps) {
   const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
   const [isSubmitting, setIsSubmitting] = useState(false)
   let [imgUrls, setImgUrls] = useState<string[]>([])
   let [coverImageIndex, setCoverImageIndex] = useState<number>(0)
   let [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

   const uploadImage = async (event: any) => {
      event.preventDefault()
      const formData = new FormData(event.target)
      const data = await createImage(formData)
      setImgUrls([...imgUrls, data.url])
      setIsDialogOpen(false)
   }

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
      <>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
               </Button>
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
                              <SelectItem value="new">
                                 Add New Category
                              </SelectItem>
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
                              <Input
                                 placeholder="Enter new category"
                                 {...field}
                              />
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
            </form>
         </Form>
         <div className="image-drawer pb-20 bg-white">
            <span className="inline-block mr-4">Images</span>

            {imgUrls.map((url, i) => (
               <div
                  key={url}
                  className={`
						relative image-listing block py-3 pl-3 pr-10 mt-2 text-sm 
						bg-slate-100 truncate border-2 rounded-sm hover:cursor-pointer
						${i === coverImageIndex ? 'border-green-200' : 'border-slate-200'}
					`}
                  onClick={() => setCoverImageIndex(i)}
               >
                  <span key={url} className="">
                     {url}
                  </span>
                  <a
                     href={url}
                     target="_blank"
                     className="absolute right-3 top-3"
                  >
                     <SquareArrowOutUpRight size="18" />
                  </a>
               </div>
            ))}
            <div className="drawer">
               <Drawer open={isDialogOpen}>
                  <DrawerTrigger asChild>
                     <Button
                        variant="outline"
                        onClick={() => {
                           setIsDialogOpen(true)
                        }}
                     >
                        Add Image
                     </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                     <DrawerHeader>
                        <div className="max-w-2xl m-auto text-center">
                           <DrawerTitle className="">
                              Upload a new Image
                           </DrawerTitle>
                        </div>
                        <DrawerDescription></DrawerDescription>
                     </DrawerHeader>

                     <DrawerFooter>
                        <div className="max-w-2xl m-auto text-center">
                           <form
                              onSubmit={(event) => uploadImage(event)}
                              className="inventory-form"
                           >
                              <Input
                                 className="mb-6"
                                 type="file"
                                 name="image-file"
                              />
                              <Button type="submit" className="mr-4">
                                 Upload Image
                              </Button>
                              <DrawerClose asChild>
                                 <Button
                                    variant="outline"
                                    onClick={() => {
                                       setIsDialogOpen(false)
                                    }}
                                 >
                                    Cancel
                                 </Button>
                              </DrawerClose>
                           </form>
                        </div>
                     </DrawerFooter>
                  </DrawerContent>
               </Drawer>
            </div>
         </div>
      </>
   )
}

// Update the ProductFormData type
type ExtendedProductFormData = ProductFormData & {
   newCategory?: string
}

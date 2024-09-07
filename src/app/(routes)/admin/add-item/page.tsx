import AddItemForm from './AddItemForm'
import db from '@/lib/db/prisma'

export default async function AddItem() {
   const categories = await db.category.findMany()
   const categoryData = categories.map((category) => ({
      id: category.id,
      name: category.name,
   }))

   return (
      <div className="max-w-2xl mx-auto p-8">
         <h1 className="text-2xl font-bold mb-4">Add a new item</h1>
         <AddItemForm categories={categoryData} />
      </div>
   )
}

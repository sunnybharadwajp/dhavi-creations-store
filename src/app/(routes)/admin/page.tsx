import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Admin() {
   return (
      <>
         <ul>
            <li>
               <Button variant="link">
                  <Link href="/admin/create-product">Add a new Item</Link>
               </Button>
            </li>
         </ul>
      </>
   )
}

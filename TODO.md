Data model:

Product:

-  id
-  name
-  description
-  category
-  price
-  stock
-  images (Image[])
-  coverImageIndex
-  sku
-  createdAt
-  updatedAt

Image:

-  id
-  url
-  productId
-  createdAt
-  updatedAt

Category:

-  id
-  name
-  description
-  createdAt
-  updatedAt

Customer:

-  id
-  name
-  email
-  phone
-  address
-  city
-  postalCode
-  country
-  createdAt
-  updatedAt

User:

-  id
-  username (email)
-  password_hash
-  sessions (Session[])
-  role (admin, customer)
-  createdAt
-  updatedAt

Session:

-  id
-  userId
-  expiresAt
-  user (User)

Order: (made of multiple OrderItems)

-  id
-  customerId
-  orderItems (OrderItem[])
-  totalPrice
-  status
-  createdAt
-  updatedAt

OrderItem:

-  id
-  orderId
-  productId
-  quantity
-  price
-  createdAt
-  updatedAt

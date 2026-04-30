# Derleng API Endpoints

## Base URL

http://localhost:5000/api

Production:
https://derleng-web-application-platform.onrender.com/api
---

# Authentication

POST /auth/send-code  
POST /auth/register  
POST /auth/login  
POST /auth/admin-create-user (Admin)

---

# Users

GET /users (Admin)  
GET /users/stats (Admin)  
GET /users/:id  
PUT /users/:id  
DELETE /users/:id  
PUT /users/change-password  
POST /users/change-email/request  
POST /users/change-email/verify  
POST /users/upload-profile

---

# Products

POST /products (Admin)  
GET /products  
GET /products/:id  
PUT /products/:id (Admin)  
DELETE /products/:id (Admin)

---

# Product Categories

POST /product-categories (Admin)  
GET /product-categories  
PUT /product-categories/:id (Admin)  
DELETE /product-categories/:id (Admin)

---

# Orders

POST /orders  
GET /orders/user/:userId  
GET /orders/admin/all (Admin)  
PUT /orders/:id/status (Admin)

---

# Posts

POST /posts  
GET /posts  
GET /posts/top  
GET /posts/:id  
GET /posts/user/:userId  
GET /posts/category/:categoryId  
GET /posts/province/:provinceId  
PUT /posts/:id  
DELETE /posts/:id

---

# Comments

POST /comments  
GET /comments  
PUT /comments/:id  
DELETE /comments/:id

---

# Likes

POST /likes/toggle  
GET /likes/count  
GET /likes/is-liked

---

# Favorites

POST /favorites/toggle  
GET /favorites

---

# Provinces

GET /provinces  
GET /provinces/search  
POST /provinces/create (Admin)  
PUT /provinces/:id (Admin)  
DELETE /provinces/:id (Admin)

---

# Community Posts

POST /community-posts (Admin)  
GET /community-posts  
GET /community-posts/:id  
GET /community-posts/province/:provinceId  
PUT /community-posts/:id (Admin)  
DELETE /community-posts/:id (Admin)

---

# Community Services

POST /services/community/:communityId/service (Admin)  
GET /services/community/:communityId/service  
PUT /services/service/:serviceId (Admin)  
DELETE /services/service/:serviceId (Admin)

---

# Bookings

POST /bookings  
GET /bookings/my-bookings  
GET /bookings/:id  
GET /bookings (Admin)  
GET /bookings/stats (Admin)  
PUT /bookings/:id/status (Admin)  
DELETE /bookings/:id (Admin)

---

# Notifications

GET /notifications

---

# Authorization

Use Header:

Authorization: Bearer <JWT_SECRET>
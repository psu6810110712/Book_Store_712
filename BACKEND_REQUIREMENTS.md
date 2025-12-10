# Backend Requirements Checklist

## 📋 Required API Endpoints

### ✅ Already Implemented (Assumed)

#### Books API
- [ ] `GET /api/book` - Get all books
- [ ] `POST /api/book` - Create new book
- [ ] `PATCH /api/book/:id` - Update book
- [ ] `DELETE /api/book/:id` - Delete book
- [ ] `POST /api/book/:id/like` - Like a book

#### Categories API
- [ ] `GET /api/book-category` - Get all categories
- [ ] `POST /api/book-category` - Create category
- [ ] `PATCH /api/book-category/:id` - Update category
- [ ] `DELETE /api/book-category/:id` - Delete category

#### Authentication API
- [ ] `POST /api/auth/login` - Login with username/password

---

## ⚠️ NEW Endpoint Required

### Critical for Edit Page

#### `GET /api/book/:id` - Get Single Book

**Why needed**: The EditBookPage needs to fetch a single book's data when the page loads.

**Example Implementation (NestJS)**:

```typescript
// books.controller.ts
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.booksService.findOne(+id);
}
```

```typescript
// books.service.ts
async findOne(id: number) {
  const book = await this.bookRepository.findOne({
    where: { id },
    relations: ['category'], // Include category relation
  });
  
  if (!book) {
    throw new NotFoundException(`Book with ID ${id} not found`);
  }
  
  return book;
}
```

**Expected Response**:
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel...",
  "price": 12.99,
  "stock": 50,
  "isbn": "978-0-7432-7356-5",
  "coverUrl": "https://example.com/gatsby.jpg",
  "likeCount": 42,
  "category": {
    "id": 2,
    "name": "Fiction"
  },
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-10T15:30:00Z"
}
```

---

## 🧪 Testing Your Endpoints

### Use this checklist to test all endpoints:

#### Books Endpoints

**1. Get all books**
```bash
curl http://localhost:3000/api/book
```

**2. Get single book** ⚠️ NEW
```bash
curl http://localhost:3000/api/book/1
```

**3. Create book**
```bash
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -H "Authorization: bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "description": "A test book",
    "price": 19.99,
    "stock": 100,
    "isbn": "123-4567890123",
    "coverUrl": "https://example.com/cover.jpg",
    "categoryId": 1
  }'
```

**4. Update book**
```bash
curl -X PATCH http://localhost:3000/api/book/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: bearer YOUR_TOKEN" \
  -d '{
    "title": "Updated Title",
    "price": 24.99
  }'
```

**5. Delete book**
```bash
curl -X DELETE http://localhost:3000/api/book/1 \
  -H "Authorization: bearer YOUR_TOKEN"
```

**6. Like book**
```bash
curl -X POST http://localhost:3000/api/book/1/like \
  -H "Authorization: bearer YOUR_TOKEN"
```

#### Categories Endpoints

**1. Get all categories**
```bash
curl http://localhost:3000/api/book-category
```

**2. Create category**
```bash
curl -X POST http://localhost:3000/api/book-category \
  -H "Content-Type: application/json" \
  -H "Authorization: bearer YOUR_TOKEN" \
  -d '{"name": "Science Fiction"}'
```

**3. Update category**
```bash
curl -X PATCH http://localhost:3000/api/book-category/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: bearer YOUR_TOKEN" \
  -d '{"name": "Sci-Fi"}'
```

**4. Delete category**
```bash
curl -X DELETE http://localhost:3000/api/book-category/1 \
  -H "Authorization: bearer YOUR_TOKEN"
```

#### Authentication Endpoint

**1. Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

---

## 📝 Expected Responses

### Success Responses

**Get Single Book** (200 OK):
```json
{
  "id": 1,
  "title": "Book Title",
  "author": "Author Name",
  "category": { "id": 1, "name": "Fiction" },
  ...
}
```

**Create/Update Book** (201 Created / 200 OK):
```json
{
  "id": 5,
  "title": "New Book",
  ...
}
```

**Delete Book** (200 OK or 204 No Content):
```json
{
  "message": "Book deleted successfully"
}
```

### Error Responses

**Not Found** (404):
```json
{
  "statusCode": 404,
  "message": "Book with ID 999 not found",
  "error": "Not Found"
}
```

**Unauthorized** (401):
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Validation Error** (400):
```json
{
  "statusCode": 400,
  "message": ["price must be a positive number"],
  "error": "Bad Request"
}
```

---

## 🔐 Authentication Notes

### Protected Endpoints

These endpoints should require authentication:
- ✅ POST /api/book
- ✅ PATCH /api/book/:id
- ✅ DELETE /api/book/:id
- ✅ POST /api/book/:id/like
- ✅ POST /api/book-category
- ✅ PATCH /api/book-category/:id
- ✅ DELETE /api/book-category/:id

### Public Endpoints

These can be public (or protected, your choice):
- GET /api/book
- GET /api/book/:id ⚠️ NEW
- GET /api/book-category
- POST /api/auth/login

---

## 🚨 Common Issues & Solutions

### Issue: 404 on GET /api/book/:id

**Solution**: Add the endpoint to your controller

```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.booksService.findOne(+id);
}
```

### Issue: Category not included in response

**Solution**: Add relations to query

```typescript
return this.bookRepository.findOne({
  where: { id },
  relations: ['category'], // ← Add this
});
```

### Issue: Can't update book - "id is not allowed"

**Solution**: Frontend already strips these fields, but ensure backend accepts PATCH correctly

```typescript
@Patch(':id')
async update(
  @Param('id') id: string,
  @Body() updateBookDto: UpdateBookDto,
) {
  return this.booksService.update(+id, updateBookDto);
}
```

### Issue: Delete category fails - "Category is in use"

**Solution**: Add proper error handling

```typescript
async remove(id: number) {
  const booksInCategory = await this.bookRepository.count({
    where: { categoryId: id }
  });
  
  if (booksInCategory > 0) {
    throw new BadRequestException(
      `Cannot delete category. ${booksInCategory} book(s) are using it.`
    );
  }
  
  await this.categoryRepository.delete(id);
}
```

---

## ✅ Quick Start Checklist

Before testing the frontend:

1. [ ] Backend server is running on `http://localhost:3000`
2. [ ] All book endpoints working
3. [ ] **NEW: GET /api/book/:id endpoint added** ⚠️
4. [ ] All category endpoints working
5. [ ] Login endpoint working
6. [ ] Test credentials available (admin/password)
7. [ ] Database has some sample data

---

## 🎯 Sample Test Data

### Categories
```sql
INSERT INTO category (name) VALUES 
  ('Fiction'),
  ('Science'),
  ('Technology'),
  ('History'),
  ('Biography');
```

### Books
```sql
INSERT INTO book (title, author, description, price, stock, isbn, coverUrl, categoryId) VALUES 
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'A classic American novel', 12.99, 50, '978-0-7432-7356-5', 'https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg', 1),
  ('1984', 'George Orwell', 'Dystopian social science fiction', 14.99, 75, '978-0-452-28423-4', 'https://covers.openlibrary.org/b/isbn/9780452284234-M.jpg', 1),
  ('A Brief History of Time', 'Stephen Hawking', 'Cosmology for the general reader', 18.99, 30, '978-0-553-38016-3', 'https://covers.openlibrary.org/b/isbn/9780553380163-M.jpg', 2);
```

---

## 📞 Support

If endpoints aren't working:

1. Check backend console for errors
2. Verify database connection
3. Check authentication middleware
4. Review CORS settings
5. Ensure proper DTO validation

**Good luck! 🚀**

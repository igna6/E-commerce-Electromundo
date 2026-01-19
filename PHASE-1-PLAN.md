# Phase 1 Implementation Plan: Product Management & Categories

**Project**: E-commerce Electromundo
**Phase**: 1 of 7
**Focus**: Product Management & Categories
**Estimated Time**: 1-2 weeks
**Status**: COMPLETE (January 2026)

---

## Table of Contents
1. [Overview](#overview)
2. [Current State Analysis](#current-state-analysis)
3. [Implementation Steps](#implementation-steps)
4. [Task Breakdown](#task-breakdown)
5. [Testing & Verification](#testing--verification)

---

## Overview

### Objectives
- Build complete product catalog with CRUD operations
- Implement category management system
- Add product search and filtering capabilities
- Enable product sorting
- Enhance product detail pages

### What We're Building
- **Backend**: Category CRUD routes, enhanced product routes, search/filter logic, validation
- **Frontend**: Category navigation, product search, filters, sorting, enhanced product display

### Success Criteria
- [ ] Products can be created, read, updated, and deleted via API
- [ ] Categories can be managed via API
- [ ] Products can be filtered by category, price range
- [ ] Products can be searched by name/description
- [ ] Products can be sorted multiple ways
- [ ] Frontend displays categories and allows filtering
- [ ] Product detail page shows complete information

---

## Current State Analysis

### What Already Exists ✅

**Backend**:
- ✅ Database schema for products and categories
- ✅ GET `/api/products` with pagination
- ✅ Soft delete support (deletedAt field)
- ✅ Database connection and Drizzle ORM setup

**Frontend**:
- ✅ Product listing component with pagination
- ✅ Product detail page structure
- ✅ Product type definition
- ✅ Products service with getProducts
- ✅ API client utility
- ✅ Loading/error/empty states for products

### What Needs to Be Built 🔨

**Backend**:
- 🔨 Category CRUD routes
- 🔨 Product CRUD routes (POST, PUT, DELETE)
- 🔨 GET `/api/products/:id` - Single product
- 🔨 Search and filter logic
- 🔨 Sorting logic
- 🔨 Validation schemas (Zod)

**Frontend**:
- 🔨 Category navigation/filter components
- 🔨 Search bar component
- 🔨 Price filter component
- 🔨 Sort dropdown component
- 🔨 Enhanced product detail page
- 🔨 Category service
- 🔨 Enhanced product service (CRUD methods)

---

## Implementation Steps

The implementation is divided into 4 main groups that can be done sequentially or in parallel:

### Group 1: Backend - Category Management (Start Here)
Tasks: 1.1 → 1.2 → 1.3 → 1.4

### Group 2: Backend - Product Enhancement
Tasks: 2.1 → 2.2 → 2.3 → 2.4 → 2.5

### Group 3: Frontend - Category & Navigation
Tasks: 3.1 → 3.2 → 3.3

### Group 4: Frontend - Search, Filter, & Display
Tasks: 4.1 → 4.2 → 4.3 → 4.4 → 4.5

**Recommended Order**:
- Backend-first: Group 1 → Group 2 → Group 3 → Group 4
- Feature-by-feature: 1.1→3.1→3.2, then 2.1→4.1→4.2, etc.

---

## Task Breakdown

## GROUP 1: Backend - Category Management

### Task 1.1: Create Category Validation Schema

**File**: `server/src/validators/category.ts` (new)

**Purpose**: Define Zod schemas for category validation

**Implementation**:
```typescript
import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  description: z.string().optional().nullable(),
})

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional().nullable(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
```

**Dependencies**: None

**Verification**:
- [ ] File created at correct path
- [ ] Schemas export correctly
- [ ] Type inference works

---

### Task 1.2: Create Category Routes

**File**: `server/src/routes/categories.ts` (new)

**Purpose**: CRUD API endpoints for categories

**Implementation**:
```typescript
import { Router } from 'express'
import { count, eq, isNull } from 'drizzle-orm'
import db from '../db/db.ts'
import { productCategoriesTable } from '../db/schema.ts'
import { createCategorySchema, updateCategorySchema } from '../validators/category.ts'

const router = Router()

// GET /api/categories - List all categories
router.get('/', async (req, res) => {
  try {
    const categories = await db
      .select()
      .from(productCategoriesTable)
      .where(isNull(productCategoriesTable.deletedAt))
      .orderBy(productCategoriesTable.name)

    res.json({ data: categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// GET /api/categories/:id - Get single category
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const category = await db
      .select()
      .from(productCategoriesTable)
      .where(eq(productCategoriesTable.id, id))
      .where(isNull(productCategoriesTable.deletedAt))
      .limit(1)

    if (!category[0]) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json({ data: category[0] })
  } catch (error) {
    console.error('Error fetching category:', error)
    res.status(500).json({ error: 'Failed to fetch category' })
  }
})

// POST /api/categories - Create category
router.post('/', async (req, res) => {
  try {
    const validatedData = createCategorySchema.parse(req.body)

    const newCategory = await db
      .insert(productCategoriesTable)
      .values(validatedData)
      .returning()

    res.status(201).json({ data: newCategory[0] })
  } catch (error) {
    console.error('Error creating category:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid category data', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to create category' })
  }
})

// PUT /api/categories/:id - Update category
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const validatedData = updateCategorySchema.parse(req.body)

    const updatedCategory = await db
      .update(productCategoriesTable)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(productCategoriesTable.id, id))
      .where(isNull(productCategoriesTable.deletedAt))
      .returning()

    if (!updatedCategory[0]) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json({ data: updatedCategory[0] })
  } catch (error) {
    console.error('Error updating category:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid category data', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to update category' })
  }
})

// DELETE /api/categories/:id - Soft delete category
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const deletedCategory = await db
      .update(productCategoriesTable)
      .set({ deletedAt: new Date() })
      .where(eq(productCategoriesTable.id, id))
      .where(isNull(productCategoriesTable.deletedAt))
      .returning()

    if (!deletedCategory[0]) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({ error: 'Failed to delete category' })
  }
})

export default router
```

**Dependencies**: Task 1.1 completed

**Verification**:
- [ ] All 5 routes created (GET all, GET one, POST, PUT, DELETE)
- [ ] Validation works
- [ ] Soft delete implemented
- [ ] Error handling in place

---

### Task 1.3: Register Category Routes in App

**File**: `server/src/app.ts` (update)

**Purpose**: Mount category routes in Express app

**Changes**:
1. Import category router: `import categoriesRouter from './routes/categories.ts'`
2. Add route: `app.use('/api/categories', categoriesRouter)`

**Location**: Add after line 33 (after products router)

**Implementation**:
```typescript
// Add import at top with other imports
import categoriesRouter from './routes/categories.ts'

// Add route after products router
app.use('/api/categories', categoriesRouter)
```

**Dependencies**: Task 1.2 completed

**Verification**:
- [ ] Categories routes accessible at `/api/categories`
- [ ] No errors on server restart

---

### Task 1.4: Test Category Routes

**Tool**: Use Thunder Client, Postman, or curl

**Tests to Run**:

1. **GET /api/categories**
   - Should return empty array initially: `{ data: [] }`

2. **POST /api/categories**
   ```json
   {
     "name": "Smartphones",
     "description": "Mobile phones and accessories"
   }
   ```
   - Should return 201 with created category

3. **GET /api/categories**
   - Should return array with created category

4. **PUT /api/categories/1**
   ```json
   {
     "description": "Updated description"
   }
   ```
   - Should return updated category

5. **DELETE /api/categories/1**
   - Should return success message
   - GET should no longer return this category

**Dependencies**: Task 1.3 completed

**Verification**:
- [ ] All CRUD operations work
- [ ] Validation errors show correctly
- [ ] 404 errors for missing categories
- [ ] Soft delete works

---

## GROUP 2: Backend - Product Enhancement

### Task 2.1: Create Product Validation Schema

**File**: `server/src/validators/product.ts` (new)

**Purpose**: Define Zod schemas for product validation

**Implementation**:
```typescript
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  price: z.number().int().positive('Price must be positive'),
  description: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  category: z.number().int().positive().optional().nullable(),
})

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  price: z.number().int().positive().optional(),
  description: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  category: z.number().int().positive().optional().nullable(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
```

**Dependencies**: None

**Verification**:
- [ ] Schemas validate correctly
- [ ] Price must be positive integer
- [ ] Name is required for creation

---

### Task 2.2: Add Single Product Endpoint

**File**: `server/src/routes/products.ts` (update)

**Purpose**: Add GET /api/products/:id endpoint

**Implementation**:
Add this route before the GET / route (specific routes before generic):

```typescript
import { eq, isNull } from 'drizzle-orm' // Add eq to imports

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' })
    }

    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .where(isNull(productsTable.deletedAt))
      .limit(1)

    if (!product[0]) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ data: product[0] })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})
```

**Dependencies**: None

**Verification**:
- [ ] GET /api/products/1 returns single product
- [ ] Returns 404 for non-existent product
- [ ] Returns 400 for invalid ID

---

### Task 2.3: Add Product CRUD Operations

**File**: `server/src/routes/products.ts` (update)

**Purpose**: Add POST, PUT, DELETE endpoints for products

**Implementation**:
Add these routes after the GET routes:

```typescript
import { createProductSchema, updateProductSchema } from '../validators/product.ts'

// POST /api/products - Create product
router.post('/', async (req, res) => {
  try {
    const validatedData = createProductSchema.parse(req.body)

    const newProduct = await db
      .insert(productsTable)
      .values(validatedData)
      .returning()

    res.status(201).json({ data: newProduct[0] })
  } catch (error) {
    console.error('Error creating product:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid product data', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const validatedData = updateProductSchema.parse(req.body)

    const updatedProduct = await db
      .update(productsTable)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(productsTable.id, id))
      .where(isNull(productsTable.deletedAt))
      .returning()

    if (!updatedProduct[0]) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ data: updatedProduct[0] })
  } catch (error) {
    console.error('Error updating product:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid product data', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// DELETE /api/products/:id - Soft delete product
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const deletedProduct = await db
      .update(productsTable)
      .set({ deletedAt: new Date() })
      .where(eq(productsTable.id, id))
      .where(isNull(productsTable.deletedAt))
      .returning()

    if (!deletedProduct[0]) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})
```

**Dependencies**: Task 2.1 completed

**Verification**:
- [ ] Can create products via POST
- [ ] Can update products via PUT
- [ ] Can soft delete products via DELETE
- [ ] Validation works correctly

---

### Task 2.4: Add Search and Filter Logic

**File**: `server/src/routes/products.ts` (update)

**Purpose**: Enhance GET / route with search, filter, and sort

**Implementation**:
Replace the existing GET / route with this enhanced version:

```typescript
import { and, asc, desc, gte, ilike, lte, or } from 'drizzle-orm' // Add to imports

router.get('/', async (req, res) => {
  try {
    // Pagination
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12))
    const offset = (page - 1) * limit

    // Search and filters
    const search = req.query.search as string
    const category = req.query.category ? parseInt(req.query.category as string) : undefined
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined
    const sortBy = (req.query.sortBy as string) || 'newest'

    // Build where conditions
    const conditions = [isNull(productsTable.deletedAt)]

    // Search by name or description
    if (search) {
      conditions.push(
        or(
          ilike(productsTable.name, `%${search}%`),
          ilike(productsTable.description, `%${search}%`)
        )
      )
    }

    // Filter by category
    if (category) {
      conditions.push(eq(productsTable.category, category))
    }

    // Filter by price range
    if (minPrice !== undefined) {
      conditions.push(gte(productsTable.price, minPrice))
    }
    if (maxPrice !== undefined) {
      conditions.push(lte(productsTable.price, maxPrice))
    }

    // Determine sort order
    let orderBy
    switch (sortBy) {
      case 'price-asc':
        orderBy = asc(productsTable.price)
        break
      case 'price-desc':
        orderBy = desc(productsTable.price)
        break
      case 'name':
        orderBy = asc(productsTable.name)
        break
      case 'newest':
      default:
        orderBy = desc(productsTable.createdAt)
        break
    }

    // Execute queries
    const [products, totalResult] = await Promise.all([
      db
        .select()
        .from(productsTable)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(productsTable)
        .where(and(...conditions)),
    ])

    const total = totalResult[0]?.count ?? 0
    const totalPages = Math.ceil(total / limit)

    res.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})
```

**Dependencies**: None

**Verification**:
- [ ] Search by name works
- [ ] Category filter works
- [ ] Price filters work
- [ ] Sorting works
- [ ] Can combine multiple filters

---

### Task 2.5: Test Product Routes

**Tests to Run**:

1. **Create Product**
   ```json
   POST /api/products
   {
     "name": "iPhone 15 Pro",
     "price": 99999,
     "description": "Latest iPhone model",
     "category": 1
   }
   ```

2. **Get Single Product**
   ```
   GET /api/products/1
   ```

3. **Search Products**
   ```
   GET /api/products?search=iphone
   ```

4. **Filter by Category**
   ```
   GET /api/products?category=1
   ```

5. **Filter by Price**
   ```
   GET /api/products?minPrice=50000&maxPrice=150000
   ```

6. **Sort Products**
   ```
   GET /api/products?sortBy=price-asc
   ```

7. **Combined Filters**
   ```
   GET /api/products?category=1&minPrice=50000&sortBy=price-desc&search=pro
   ```

**Dependencies**: Tasks 2.1-2.4 completed

**Verification**:
- [ ] All CRUD operations work
- [ ] Search returns relevant results
- [ ] Filters work individually and combined
- [ ] Sorting changes order correctly

---

## GROUP 3: Frontend - Category & Navigation

### Task 3.1: Create Category Type

**File**: `web/src/types/category.ts` (new)

**Purpose**: TypeScript type for categories

**Implementation**:
```typescript
export type Category = {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}
```

**Dependencies**: None

**Verification**:
- [ ] Type exports correctly
- [ ] Matches backend schema

---

### Task 3.2: Create Category Service

**File**: `web/src/services/categories.service.ts` (new)

**Purpose**: API client for category operations

**Implementation**:
```typescript
import { apiRequest } from './api'
import type { Category } from '../types/category'

export async function getCategories(): Promise<{ data: Category[] }> {
  return apiRequest<{ data: Category[] }>('/api/categories')
}

export async function getCategory(id: number): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>(`/api/categories/${id}`)
}

export async function createCategory(data: {
  name: string
  description?: string | null
}): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCategory(
  id: number,
  data: Partial<{ name: string; description: string | null }>
): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteCategory(id: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/api/categories/${id}`, {
    method: 'DELETE',
  })
}
```

**Dependencies**: Task 3.1 completed

**Verification**:
- [ ] Service methods export correctly
- [ ] API calls formatted properly

---

### Task 3.3: Update Product Type

**File**: `web/src/types/product.ts` (update)

**Purpose**: Add category field to Product type

**Implementation**:
```typescript
export type Product = {
  id: number
  name: string
  price: number
  description: string | null
  image: string | null
  category: number | null  // Add this line
  createdAt: string        // Add this line
  updatedAt: string        // Add this line
}
```

**Dependencies**: None

**Verification**:
- [ ] Product type includes category
- [ ] Product type includes timestamps

---

## GROUP 4: Frontend - Search, Filter, & Display

### Task 4.1: Enhanced Product Service

**File**: `web/src/services/products.service.ts` (update)

**Purpose**: Add CRUD methods and filter support

**Implementation**:
```typescript
import { apiRequest } from './api'
import type { Product } from '../types/product'
import type { PaginatedResponse } from '../types/api'

export type GetProductsParams = {
  page?: number
  limit?: number
  search?: string
  category?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name'
}

export type ProductsResponse = PaginatedResponse<Product> & {
  filters?: {
    search?: string
    category?: number
    minPrice?: number
    maxPrice?: number
    sortBy?: string
  }
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams()

  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.search) queryParams.append('search', params.search)
  if (params.category) queryParams.append('category', params.category.toString())
  if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString())
  if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString())
  if (params.sortBy) queryParams.append('sortBy', params.sortBy)

  const queryString = queryParams.toString()
  const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`

  return apiRequest<ProductsResponse>(endpoint)
}

export async function getProduct(id: number): Promise<{ data: Product }> {
  return apiRequest<{ data: Product }>(`/api/products/${id}`)
}

export async function createProduct(data: {
  name: string
  price: number
  description?: string | null
  image?: string | null
  category?: number | null
}): Promise<{ data: Product }> {
  return apiRequest<{ data: Product }>('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProduct(
  id: number,
  data: Partial<{
    name: string
    price: number
    description: string | null
    image: string | null
    category: number | null
  }>
): Promise<{ data: Product }> {
  return apiRequest<{ data: Product }>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/api/products/${id}`, {
    method: 'DELETE',
  })
}
```

**Dependencies**: Task 3.3 completed

**Verification**:
- [ ] All CRUD methods available
- [ ] Filter params work
- [ ] Query string built correctly

---

### Task 4.2: Create Category Filter Component

**File**: `web/src/components/CategoryFilter.tsx` (new)

**Purpose**: Display categories for filtering

**Implementation**:
```typescript
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/services/categories.service'
import { Button } from '@/components/ui/button'

type CategoryFilterProps = {
  selectedCategory?: number
  onCategoryChange: (categoryId: number | undefined) => void
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  if (isLoading) {
    return <div className="flex gap-2">Loading categories...</div>
  }

  const categories = data?.data || []

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === undefined ? 'default' : 'outline'}
        onClick={() => onCategoryChange(undefined)}
        size="sm"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category.id)}
          size="sm"
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
```

**Dependencies**: Task 3.2 completed

**Verification**:
- [ ] Categories load and display
- [ ] Can select category
- [ ] "All" button clears filter

---

### Task 4.3: Create Search and Sort Controls

**File**: `web/src/components/ProductControls.tsx` (new)

**Purpose**: Search bar, price filters, and sort dropdown

**Implementation**:
```typescript
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ProductControlsProps = {
  search: string
  onSearchChange: (search: string) => void
  minPrice?: number
  maxPrice?: number
  onPriceChange: (min?: number, max?: number) => void
  sortBy: string
  onSortChange: (sort: string) => void
}

export default function ProductControls({
  search,
  onSearchChange,
  minPrice,
  maxPrice,
  onPriceChange,
  sortBy,
  onSortChange,
}: ProductControlsProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Price Range */}
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min price"
          value={minPrice ?? ''}
          onChange={(e) =>
            onPriceChange(
              e.target.value ? parseInt(e.target.value) : undefined,
              maxPrice
            )
          }
        />
        <Input
          type="number"
          placeholder="Max price"
          value={maxPrice ?? ''}
          onChange={(e) =>
            onPriceChange(
              minPrice,
              e.target.value ? parseInt(e.target.value) : undefined
            )
          }
        />
        {(minPrice !== undefined || maxPrice !== undefined) && (
          <Button
            variant="outline"
            onClick={() => onPriceChange(undefined, undefined)}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Sort */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="name">Name A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

**Dependencies**: None

**Verification**:
- [ ] Search input works
- [ ] Price inputs work
- [ ] Sort dropdown works
- [ ] Clear price filter works

---

### Task 4.4: Update ProductsList Component

**File**: `web/src/sections/products/ProductsList/ProductsList.tsx` (update)

**Purpose**: Integrate filters and search

**Implementation**:
Add state for filters and connect to components:

```typescript
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/services/products.service'
import CategoryFilter from '@/components/CategoryFilter'
import ProductControls from '@/components/ProductControls'
import ProductCard from './components/ProductCard'
import ProductsPagination from './components/ProductsPagination'
import ProductsLoading from './components/ProductsLoading'
import ProductsError from './components/ProductsError'
import ProductsEmpty from './components/ProductsEmpty'

export default function ProductsList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<number | undefined>()
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [sortBy, setSortBy] = useState('newest')

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, search, category, minPrice, maxPrice, sortBy],
    queryFn: () =>
      getProducts({
        page,
        limit: 12,
        search: search || undefined,
        category,
        minPrice,
        maxPrice,
        sortBy: sortBy as any,
      }),
  })

  const handlePriceChange = (min?: number, max?: number) => {
    setMinPrice(min)
    setMaxPrice(max)
    setPage(1) // Reset to first page
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1) // Reset to first page
  }

  const handleCategoryChange = (cat?: number) => {
    setCategory(cat)
    setPage(1) // Reset to first page
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setPage(1) // Reset to first page
  }

  if (isLoading) return <ProductsLoading />
  if (error) return <ProductsError />
  if (!data?.data?.length) return <ProductsEmpty />

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-3xl font-bold">Products</h2>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <CategoryFilter
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
        />
        <ProductControls
          search={search}
          onSearchChange={handleSearchChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {data.pagination && (
        <ProductsPagination
          currentPage={page}
          totalPages={data.pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
```

**Dependencies**: Tasks 4.2, 4.3 completed

**Verification**:
- [ ] Filters display correctly
- [ ] Search updates products
- [ ] Category filter works
- [ ] Price filter works
- [ ] Sort changes order
- [ ] Pagination resets on filter change

---

### Task 4.5: Update Product Detail Page

**File**: `web/src/sections/products/ProductDetail/ProductDetail.tsx` (create or update)

**Purpose**: Show complete product information

**Implementation**:
```typescript
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '@/services/products.service'
import { getCategory } from '@/services/categories.service'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ProductDetailProps = {
  productId: number
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
  })

  const product = productData?.data

  const { data: categoryData } = useQuery({
    queryKey: ['category', product?.category],
    queryFn: () => getCategory(product!.category!),
    enabled: !!product?.category,
  })

  if (productLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          {categoryData?.data && (
            <p className="text-sm text-muted-foreground">
              {categoryData.data.name}
            </p>
          )}

          <h1 className="text-4xl font-bold">{product.name}</h1>

          <p className="text-3xl font-bold">
            ${(product.price / 100).toFixed(2)}
          </p>

          {product.description && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          <Button size="lg" className="w-full md:w-auto">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**Dependencies**: Task 4.1 completed

**Verification**:
- [ ] Product details display
- [ ] Category shows if present
- [ ] Price formatted correctly
- [ ] Image shows or placeholder
- [ ] Add to Cart button present (not functional yet)

---

## Testing & Verification

### Backend Testing Checklist

**Category Endpoints**:
- [ ] GET /api/categories returns all categories
- [ ] GET /api/categories/:id returns single category
- [ ] POST /api/categories creates category
- [ ] PUT /api/categories/:id updates category
- [ ] DELETE /api/categories/:id soft deletes category
- [ ] Validation errors return 400
- [ ] Missing resources return 404

**Product Endpoints**:
- [ ] GET /api/products returns paginated products
- [ ] GET /api/products/:id returns single product
- [ ] POST /api/products creates product
- [ ] PUT /api/products/:id updates product
- [ ] DELETE /api/products/:id soft deletes product
- [ ] Search by name works
- [ ] Search by description works
- [ ] Category filter works
- [ ] Price min filter works
- [ ] Price max filter works
- [ ] Sorting works (newest, price-asc, price-desc, name)
- [ ] Can combine multiple filters

### Frontend Testing Checklist

**Category Features**:
- [ ] Categories load and display
- [ ] Can filter by category
- [ ] "All" button clears category filter
- [ ] Category shows on product detail

**Search & Filter**:
- [ ] Search input updates products
- [ ] Min price filter works
- [ ] Max price filter works
- [ ] Can clear price filters
- [ ] Sort dropdown works
- [ ] Filters work together

**Product Display**:
- [ ] Products show in grid
- [ ] Pagination works
- [ ] Product detail page shows all info
- [ ] Loading states show
- [ ] Error states show
- [ ] Empty states show

**Responsive Design**:
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Filters accessible on mobile

### Integration Testing

Create some test data and verify the complete flow:

1. **Create Categories**:
   - Smartphones
   - Laptops
   - Tablets
   - Accessories

2. **Create Products** (at least 15):
   - Assign to different categories
   - Various price ranges ($50 - $2000)
   - Some with descriptions, some without
   - Some with images, some without

3. **Test Workflows**:
   - Browse all products
   - Filter by category
   - Search for product
   - Sort by price
   - Combine filters
   - View product details
   - Navigate pagination

### Performance Testing

- [ ] Product list loads in < 1 second
- [ ] Search responds quickly (< 500ms)
- [ ] Filters don't cause UI lag
- [ ] Pagination is smooth

---

## Success Criteria

Phase 1 is complete when:

- [ ] All backend routes working and tested
- [ ] All frontend components working
- [ ] Categories can be managed
- [ ] Products can be created, updated, deleted
- [ ] Search finds products by name/description
- [ ] Category filter works
- [ ] Price filter works
- [ ] Sorting works
- [ ] Product detail page shows complete info
- [ ] Pagination works with filters
- [ ] No console errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] Code follows project patterns and conventions

---

## Next Steps After Phase 1

Once Phase 1 is complete:

1. **Review and Test**: Ensure everything works smoothly
2. **Create Test Data**: Add products and categories for Phase 2 testing
3. **Move to Phase 2**: Begin implementing shopping cart functionality
4. **Document**: Update any learnings or changes made during implementation

---

## Notes & Tips

**Development Tips**:
- Test backend routes with Thunder Client/Postman before building frontend
- Use React Query DevTools to debug queries
- Start server and frontend together for testing
- Create sample data early to test with realistic scenarios

**Common Issues**:
- Price stored as integer (cents), display as dollars
- Remember to reset page to 1 when filters change
- Soft deletes need `isNull(deletedAt)` in all queries
- Query params need proper encoding

**Code Quality**:
- Follow existing TypeScript patterns
- Use Zod for all validation
- Handle all error cases
- Add loading states for better UX

---

**Ready to Start?** Begin with Group 1, Task 1.1!

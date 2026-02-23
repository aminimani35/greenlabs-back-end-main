# Blog Categories & Tags - Quick Reference

## 🎯 Overview

Blog posts now support separate **Category** and **Tag** entities with full CRUD operations, all under the **Blog** Swagger tag.

## 📊 Entity Structure

### BlogCategory
- `id` (UUID) - Unique identifier
- `name` (string) - Category name
- `slug` (string, unique) - URL-friendly identifier
- `description` (text) - Category description
- `color` (hex code) - Visual color identifier
- `icon` (string) - Icon identifier
- `parentId` (UUID, nullable) - Parent category for hierarchies
- `postCount` (number) - Number of posts in this category
- `isActive` (boolean) - Active status
- `displayOrder` (number) - Sort order
- **Relationship:** Many-to-many with BlogPost

### BlogTag
- `id` (UUID) - Unique identifier
- `name` (string) - Tag name
- `slug` (string, unique) - URL-friendly identifier
- `description` (text) - Tag description
- `color` (hex code) - Visual color identifier
- `postCount` (number) - Number of posts with this tag
- `isActive` (boolean) - Active status
- **Relationship:** Many-to-many with BlogPost

### BlogPost Updates
- `tags` - Changed from `string[]` to `BlogTag[]`
- `categories` - Changed from `string[]` to `BlogCategory[]`

## 🚀 API Endpoints

### Categories

#### Create Category
```http
POST /api/blog/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Technology",
  "slug": "technology",
  "description": "Articles about technology",
  "color": "#3498db",
  "icon": "tech-icon",
  "parentId": null,
  "displayOrder": 1,
  "isActive": true
}
```
**Required:** `admin`, `editor` | Permission: `blog:create`

#### Get All Categories
```http
GET /api/blog/categories?page=1&limit=50&isActive=true&search=tech
```
**Public** - No authentication required

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `isActive` - Filter by active status
- `parentId` - Filter by parent category (use "null" for root categories)
- `search` - Search in name and description

#### Get Top Categories
```http
GET /api/blog/categories/top?limit=10
```
**Public** - Returns categories with most posts

#### Get Category by ID
```http
GET /api/blog/categories/:id
```
**Public**

#### Get Category by Slug
```http
GET /api/blog/categories/slug/:slug
```
**Public**

#### Update Category
```http
PUT /api/blog/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "isActive": false
}
```
**Required:** `admin`, `editor` | Permission: `blog:update`

#### Delete Category
```http
DELETE /api/blog/categories/:id
Authorization: Bearer <token>
```
**Required:** `admin` | Permission: `blog:delete`

---

### Tags

#### Create Tag
```http
POST /api/blog/tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "JavaScript",
  "slug": "javascript",
  "description": "All about JavaScript",
  "color": "#f39c12",
  "isActive": true
}
```
**Required:** `admin`, `editor` | Permission: `blog:create`

#### Get All Tags
```http
GET /api/blog/tags?page=1&limit=50&isActive=true&search=java
```
**Public** - No authentication required

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `isActive` - Filter by active status
- `search` - Search in name and description

#### Get Popular Tags
```http
GET /api/blog/tags/popular?limit=20
```
**Public** - Returns tags with most posts

#### Get Tag by ID
```http
GET /api/blog/tags/:id
```
**Public**

#### Get Tag by Slug
```http
GET /api/blog/tags/slug/:slug
```
**Public**

#### Update Tag
```http
PUT /api/blog/tags/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Tag",
  "color": "#e74c3c"
}
```
**Required:** `admin`, `editor` | Permission: `blog:update`

#### Delete Tag
```http
DELETE /api/blog/tags/:id
Authorization: Bearer <token>
```
**Required:** `admin` | Permission: `blog:delete`

---

### Blog Posts (Updated)

#### Create Blog Post with Categories & Tags
```http
POST /api/blog
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Blog Post",
  "excerpt": "Short description",
  "content": "Full content here...",
  "authorName": "John Doe",
  "categoryIds": ["category-uuid-1", "category-uuid-2"],
  "tagIds": ["tag-uuid-1", "tag-uuid-2", "tag-uuid-3"],
  "status": "published",
  "isFeatured": false
}
```

**Changed Fields:**
- `categories` → `categoryIds` (array of UUIDs)
- `tags` → `tagIds` (array of UUIDs)

#### Update Blog Post
```http
PUT /api/blog/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoryIds": ["new-category-uuid"],
  "tagIds": ["new-tag-uuid-1", "new-tag-uuid-2"]
}
```

## 🔧 Usage Examples

### Using curl

```bash
# Login and get token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aminimani95@proton.me","password":"Ar@d1260621"}' \
  | jq -r '.access_token')

# Create a category
CATEGORY_ID=$(curl -X POST http://localhost:3000/api/blog/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Technology",
    "slug": "technology",
    "description": "Tech articles",
    "color": "#3498db",
    "isActive": true
  }' | jq -r '.id')

# Create a tag
TAG_ID=$(curl -X POST http://localhost:3000/api/blog/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript",
    "slug": "javascript",
    "color": "#f39c12",
    "isActive": true
  }' | jq -r '.id')

# Create blog post with category and tag
curl -X POST http://localhost:3000/api/blog \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Getting Started with JavaScript\",
    \"excerpt\": \"Learn JavaScript basics\",
    \"content\": \"# Introduction\\n\\nJavaScript is...\",
    \"authorName\": \"John Doe\",
    \"categoryIds\": [\"$CATEGORY_ID\"],
    \"tagIds\": [\"$TAG_ID\"],
    \"status\": \"published\"
  }"

# Get all categories
curl http://localhost:3000/api/blog/categories

# Get popular tags
curl http://localhost:3000/api/blog/tags/popular?limit=10

# Get top categories
curl http://localhost:3000/api/blog/categories/top?limit=5
```

## 🎨 Frontend Integration Example

```typescript
// Fetch categories and tags for form
const [categories, setCategories] = useState([]);
const [tags, setTags] = useState([]);

useEffect(() => {
  fetch('/api/blog/categories?isActive=true')
    .then(res => res.json())
    .then(data => setCategories(data.categories));

  fetch('/api/blog/tags?isActive=true')
    .then(res => res.json())
    .then(data => setTags(data.tags));
}, []);

// Create blog post
const createPost = async (formData) => {
  const response = await fetch('/api/blog', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      authorName: formData.author,
      categoryIds: formData.selectedCategories, // Array of UUIDs
      tagIds: formData.selectedTags, // Array of UUIDs
      status: 'draft'
    })
  });
  
  return response.json();
};
```

## 📋 Key Features

✅ **Hierarchical Categories** - Support for parent-child relationships
✅ **Color Coding** - Visual identification with hex colors
✅ **Icons** - Custom icon support for categories
✅ **Post Counting** - Automatic tracking of posts per category/tag
✅ **Slug-based URLs** - SEO-friendly unique identifiers
✅ **Active/Inactive** - Toggle visibility without deletion
✅ **Display Order** - Custom sorting for categories
✅ **Search & Filter** - Advanced filtering capabilities
✅ **Popular/Top Lists** - Get most used tags and categories
✅ **Full CRUD** - Complete create, read, update, delete operations

## 🔐 Permissions

All category and tag operations use existing blog permissions:
- `blog:create` - Create categories/tags (admin, editor)
- `blog:read` - Read categories/tags (public)
- `blog:update` - Update categories/tags (admin, editor)
- `blog:delete` - Delete categories/tags (admin only)

## 🎯 Best Practices

1. **Use Slugs** - Always provide unique, SEO-friendly slugs
2. **Color Consistency** - Use consistent color schemes for related items
3. **Hierarchies** - Use parent categories for better organization
4. **Active Status** - Deactivate instead of delete when possible
5. **Post Counts** - Rely on automatic counting, don't manually update
6. **Validation** - Slug uniqueness is enforced at database level

## 🗂️ Database Schema

### Tables Created
- `blog_categories` - Category entity table
- `blog_tags` - Tag entity table
- `blog_post_categories` - Many-to-many junction table
- `blog_post_tags` - Many-to-many junction table

### Indexes
- Unique index on `blog_categories.slug`
- Unique index on `blog_tags.slug`

## ✅ Migration Notes

**Breaking Changes:**
- Blog posts now use `categoryIds` and `tagIds` instead of string arrays
- `tags` and `categories` fields are now entity relationships
- Old string array data will need to be migrated to new entities

**Backward Compatibility:**
- DTOs validate UUID arrays instead of string arrays
- API endpoints return full entity objects with metadata

## 🚀 Next Steps

Your blog module now has complete category and tag management. All endpoints are documented in Swagger UI at:

```
http://localhost:3000/api/docs
```

Look for the **Blog** tag to find all category and tag endpoints.

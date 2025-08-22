# Code Snippets for Sanity API Operations

This folder contains reusable code examples for common Sanity API operations. Each snippet is tested and documented.

## 📁 Available Snippets

### Content Creation

- `create-post.ts` - Create a new blog post
- `create-page.ts` - Create a new page
- `create-person.ts` - Create a new person/author
- `create-category.ts` - Create a new category

### Content Updates

- `update-post.ts` - Update existing post
- `update-page.ts` - Update existing page
- `patch-document.ts` - Generic patch operation

### Media Management

- `upload-image.ts` - Upload image to Sanity
- `upload-file.ts` - Upload any file type
- `delete-asset.ts` - Delete media assets

### Bulk Operations

- `bulk-create.ts` - Create multiple documents
- `bulk-update.ts` - Update multiple documents
- `bulk-delete.ts` - Delete multiple documents

### Query Operations

- `query-posts.ts` - Query posts with filters
- `query-pages.ts` - Query pages
- `query-relationships.ts` - Query related documents

## 📝 Usage Guidelines

1. **Copy the snippet** to your project
2. **Modify variables** as needed for your use case
3. **Test thoroughly** before production use
4. **Log your usage** in the logging folder
5. **Report issues** or improvements

## 🔧 Common Patterns

### Authentication

```typescript
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
});
```

### Error Handling

```typescript
try {
  const result = await client.create(doc);
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error.message);
  // Log to your logging system
}
```

## 📊 Snippet Statistics

- **Total Snippets**: 0
- **Most Used**: TBD
- **Success Rate**: TBD
- **Last Updated**: [Current Date]

---

**Note**: Always test snippets in a development environment before using in production.

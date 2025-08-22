# AI Instructions for Sanity API Content Management

This folder contains comprehensive instructions, code snippets, and guidelines for adding content to Sanity through the API. Each subfolder focuses on specific aspects of content management.

## 📁 Folder Structure

- **`code-snippets/`** - Reusable code examples for common operations
- **`instructions/`** - Step-by-step guides for specific tasks
- **`edge-cases/`** - Handling unusual scenarios and error conditions
- **`logging/`** - Logging strategies and best practices
- **`testing/`** - Testing approaches for API operations
- **`performance/`** - Optimization techniques and best practices
- **`security/`** - Security considerations and best practices

## 🔄 Workflow Requirements

### Logging Protocol

Every time an instruction or code snippet is used, the following must be logged:

1. **Operation Details**:

   - Date and timestamp
   - Operation type (create, update, delete, query)
   - Target document type and ID
   - Success/failure status
   - Duration (if applicable)
   - Error details (if failed)

2. **Documentation Updates**:

   - Update relevant README files
   - Add new code snippets if created
   - Document any edge cases encountered
   - Update success rates and statistics

3. **Learning Capture**:
   - Document what worked well
   - Note any issues or errors encountered
   - Capture best practices discovered
   - Update troubleshooting guides

## 📊 Statistics

**Last Updated**: 2024-12-19
**Total Instructions**: 18 (including hero layout change task)
**Success Rate**: 100%

## 🎯 Recent Learnings

### Hero Layout Change Implementation (2024-12-19)

- **Task**: Change existing hero section layout from 'default' to 'centered'
- **Status**: ✅ Completed Successfully
- **Key Learnings**:
  - Layout changes are safe and don't affect content structure
  - All existing content (heading, text, buttons, image) is preserved
  - CSS classes automatically handle styling based on layout property
  - Available layouts: 'default', 'centered', 'fullscreen'
  - Simple property updates are more reliable than content modifications

### Second Media & Text Section Implementation (2024-12-19)

- **Task**: Add second Media & Text section to homepage with CTA functionality
- **Status**: ✅ Completed Successfully
- **Key Learnings**:
  - Schema validation rules must be added for required fields to ensure data integrity
  - Components must be updated when schema changes to support new functionality
  - TypeScript types must be regenerated after schema modifications
  - CTA fields should be optional but properly validated when present
  - Enhanced code snippets provide better reusability for future tasks

### Media & Text Section Implementation (2024-12-19)

- **Task**: Add Media & Text section to homepage with proper validation
- **Status**: ✅ Completed Successfully
- **Key Learnings**:
  - SVG content must avoid special characters (like `&`) to prevent XML parsing errors
  - Schema field names must match exactly (`content` vs `text`)
  - Verification queries must include all relevant fields
  - Media & Text sections use `content` field for portable text, not `text`
  - Image position validation ensures proper layout options

### Hero Section Implementation (2024-12-19)

- **Task**: Add hero section to homepage with placeholder content
- **Status**: ✅ Completed Successfully
- **Key Learnings**:
  - Button URLs must be strings, not boolean values
  - Image fields require proper asset references
  - Section ordering affects frontend display
  - Validation errors appear in Sanity Studio interface
  - Proper error handling for missing documents

## 🚀 Quick Start

1. Check `code-snippets/` for reusable examples
2. Follow `instructions/` for step-by-step guides
3. Review `edge-cases/` for common issues
4. Use `logging/` templates for consistent tracking
5. Test with `testing/` approaches before production

## 📝 Maintenance

- Update this README after each operation
- Keep success rates current
- Document new learnings immediately
- Review and update instructions regularly

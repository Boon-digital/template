# Button URL Validation Edge Case

## Issue Description

When creating hero sections (or any sections with buttons) through the Sanity API, button URLs must be proper string values, not boolean values.

## Error Message

```
Invalid property value
The property value is stored as a value type that does not match the expected type.

Developer info
The value of this property must be of type string according to the schema.

Mismatching value types typically occur when the schema has recently been changed.

The current value (true)
true
```

## Root Cause

The button link structure expects a `href` field of type `string`, but the code was setting it to a boolean `true` value.

## Incorrect Implementation

```javascript
// ❌ WRONG - This causes validation errors
buttons: [
  {
    _key: 'button-001',
    _type: 'button',
    variant: 'primary',
    text: 'Get Started',
    link: {
      _type: 'link',
      type: 'external',
      external: true,
      href: true, // ❌ Boolean value instead of string
    },
  },
];
```

## Correct Implementation

```javascript
// ✅ CORRECT - Proper string URLs
buttons: [
  {
    _key: 'button-001',
    _type: 'button',
    variant: 'primary',
    text: 'Get Started',
    link: {
      _type: 'link',
      type: 'external',
      external: true,
      href: 'https://example.com/get-started', // ✅ String URL
    },
  },
];
```

## Prevention Strategy

### 1. Validation Function

```javascript
function validateButtonUrls(buttons) {
  if (!Array.isArray(buttons)) return false;

  return buttons.every((button) => {
    const url = button.link?.href;
    return typeof url === 'string' && url.length > 0;
  });
}
```

### 2. Pre-flight Check

```javascript
// Before sending to API
if (!validateButtonUrls(heroSection.buttons)) {
  throw new Error('Button URLs must be valid strings');
}
```

### 3. Type Checking

```javascript
// Always validate URL types
if (typeof button1Url !== 'string' || typeof button2Url !== 'string') {
  throw new Error('Button URLs must be strings, not booleans or other types');
}
```

## Related Schema Structure

The button link schema expects:

```typescript
interface ButtonLink {
  _type: 'link';
  type: 'external' | 'internal';
  external: boolean;
  href: string; // Must be string, not boolean
}
```

## Testing

### Test Cases

1. **Valid URLs**: `"https://example.com/action"` ✅
2. **Boolean URLs**: `true` ❌
3. **Null URLs**: `null` ❌
4. **Empty Strings**: `""` ⚠️ (valid but may not work as expected)
5. **Undefined URLs**: `undefined` ❌

### Verification Script

```javascript
async function verifyButtonUrls() {
  const homePage = await client.fetch('*[_type == "homePage"][0]');
  const heroSection = homePage.pageSections.find((s) => s._type === 'hero');

  if (heroSection.buttons) {
    heroSection.buttons.forEach((button, index) => {
      const url = button.link?.href;
      if (typeof url !== 'string') {
        console.warn(`⚠️ Button ${index + 1} has invalid URL type:`, typeof url);
      } else {
        console.log(`✅ Button ${index + 1}: "${button.text}" -> ${url}`);
      }
    });
  }
}
```

## Resolution Steps

1. **Identify the Issue**: Check Sanity Studio for validation errors
2. **Locate Problematic Data**: Use verification script to find invalid URLs
3. **Fix the Data**: Update button URLs to proper string values
4. **Validate**: Run verification script to confirm fixes
5. **Prevent Recurrence**: Add validation to creation scripts

## Impact

- **Frontend**: Buttons may not render or function correctly
- **API**: Validation errors prevent document updates
- **Studio**: Error messages appear in Sanity Studio interface
- **User Experience**: Broken navigation and functionality

## Related Issues

- [Image Field Validation](./image-field-validation.md)
- [Asset Reference Errors](./asset-reference-errors.md)
- [Schema Type Mismatches](./schema-type-mismatches.md)

## Date Documented

**2024-12-19** - Based on hero section implementation task

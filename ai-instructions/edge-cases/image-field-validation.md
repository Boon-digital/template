# Image Field Validation Edge Case

## Issue Description

When adding images to Sanity documents through the API, image fields require proper asset references or should be omitted entirely. Setting image fields to `null` or invalid values causes validation errors.

## Error Message

```
Invalid property value
The property value is stored as a value type that does not match the expected type.

Developer info
The value of this property must be of type image according to the schema.

Mismatching value types typically occur when the schema has recently been changed.

The current value (null)
null
```

## Root Cause

The image field schema expects either:

1. A proper image asset reference with `_type: 'image'` and `asset: { _ref: 'image-id' }`
2. The field to be omitted entirely (not set to `null`)

## Incorrect Implementation

```javascript
// ❌ WRONG - This causes validation errors
heroSection.image = null; // Invalid: null value

// ❌ WRONG - Missing required fields
heroSection.image = {
  _type: 'image',
  // Missing asset reference
};

// ❌ WRONG - Invalid asset reference
heroSection.image = {
  _type: 'image',
  asset: 'invalid-reference', // Should be object with _ref
};
```

## Correct Implementation

### Option 1: Upload and Reference Image Asset

```javascript
// ✅ CORRECT - Upload image first, then reference it
const imageAsset = await client.assets.upload('image', imageBuffer, {
  filename: 'hero-image.jpg',
  contentType: 'image/jpeg',
});

heroSection.image = {
  _type: 'image',
  alt: 'Hero section image',
  asset: {
    _type: 'reference',
    _ref: imageAsset._id, // Reference the uploaded asset
  },
};
```

### Option 2: Omit Image Field Entirely

```javascript
// ✅ CORRECT - Don't include image field if not needed
const heroSection = {
  _type: 'hero',
  heading: 'Welcome',
  text: [...],
  buttons: [...]
  // No image field - this is valid
};
```

### Option 3: Use Existing Asset Reference

```javascript
// ✅ CORRECT - Reference existing asset
heroSection.image = {
  _type: 'image',
  alt: 'Hero section image',
  asset: {
    _type: 'reference',
    _ref: 'image-existing-asset-id',
  },
};
```

## Asset Upload Process

### 1. Upload Image Asset

```javascript
async function uploadImage(imageBuffer, filename) {
  const imageAsset = await client.assets.upload('image', imageBuffer, {
    filename: filename,
    contentType: 'image/jpeg', // or appropriate MIME type
  });

  console.log('✅ Image uploaded:', imageAsset._id);
  return imageAsset;
}
```

### 2. Create Image Reference

```javascript
function createImageReference(assetId, altText) {
  return {
    _type: 'image',
    alt: altText,
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
  };
}
```

### 3. Complete Implementation

```javascript
async function addImageToSection(section, imageBuffer, altText) {
  // Upload the image
  const imageAsset = await uploadImage(imageBuffer, 'section-image.jpg');

  // Add image reference to section
  section.image = createImageReference(imageAsset._id, altText);

  return section;
}
```

## Validation Strategy

### 1. Pre-upload Validation

```javascript
function validateImageData(imageBuffer) {
  if (!Buffer.isBuffer(imageBuffer)) {
    throw new Error('Image data must be a Buffer');
  }

  if (imageBuffer.length === 0) {
    throw new Error('Image buffer cannot be empty');
  }

  return true;
}
```

### 2. Post-upload Verification

```javascript
async function verifyImageReference(imageRef) {
  if (!imageRef || !imageRef.asset || !imageRef.asset._ref) {
    throw new Error('Invalid image reference structure');
  }

  // Verify asset exists
  const asset = await client.getDocument(imageRef.asset._ref);
  if (!asset) {
    throw new Error('Referenced image asset does not exist');
  }

  return true;
}
```

## Common Image Types

### SVG Images

```javascript
const svgContent = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">
    Placeholder Image
  </text>
</svg>`;

const svgAsset = await client.assets.upload('image', Buffer.from(svgContent), {
  filename: 'placeholder.svg',
  contentType: 'image/svg+xml',
});
```

### JPEG/PNG Images

```javascript
const imageAsset = await client.assets.upload('image', imageBuffer, {
  filename: 'hero-image.jpg',
  contentType: 'image/jpeg',
});
```

## Error Handling

### 1. Asset Upload Errors

```javascript
try {
  const imageAsset = await client.assets.upload('image', imageBuffer, options);
} catch (error) {
  if (error.message.includes('Invalid image')) {
    console.error('❌ Invalid image format or corrupted file');
  } else if (error.message.includes('File too large')) {
    console.error('❌ Image file is too large');
  } else {
    console.error('❌ Upload failed:', error.message);
  }
  throw error;
}
```

### 2. Reference Errors

```javascript
try {
  await verifyImageReference(imageRef);
} catch (error) {
  console.error('❌ Image reference validation failed:', error.message);
  // Remove invalid image reference
  delete section.image;
}
```

## Testing

### Test Cases

1. **Valid Image Upload**: Upload JPEG/PNG/SVG ✅
2. **Null Image Field**: `image: null` ❌
3. **Missing Asset Reference**: Incomplete image object ❌
4. **Invalid Asset ID**: Non-existent asset reference ❌
5. **Omitted Image Field**: No image field at all ✅

### Verification Script

```javascript
async function verifyImageFields() {
  const homePage = await client.fetch('*[_type == "homePage"][0]');
  const heroSection = homePage.pageSections.find((s) => s._type === 'hero');

  if (heroSection.image) {
    console.log('✅ Image field present');
    console.log('- Alt text:', heroSection.image.alt);
    console.log('- Asset ID:', heroSection.image.asset._ref);

    // Verify asset exists
    try {
      const asset = await client.getDocument(heroSection.image.asset._ref);
      console.log('✅ Referenced asset exists:', asset.url);
    } catch (error) {
      console.error('❌ Referenced asset not found');
    }
  } else {
    console.log('ℹ️ No image field (this is valid)');
  }
}
```

## Resolution Steps

1. **Identify Invalid Images**: Check Sanity Studio for validation errors
2. **Upload Missing Assets**: Upload images that don't exist
3. **Fix References**: Update image references to point to valid assets
4. **Remove Invalid Fields**: Delete image fields with invalid references
5. **Validate**: Run verification script to confirm fixes

## Impact

- **Frontend**: Images may not display or cause rendering errors
- **API**: Validation errors prevent document updates
- **Studio**: Error messages appear in Sanity Studio interface
- **Performance**: Broken image references can cause loading issues

## Related Issues

- [Button URL Validation](./button-url-validation.md)
- [Asset Reference Errors](./asset-reference-errors.md)
- [Schema Type Mismatches](./schema-type-mismatches.md)

## Date Documented

**2024-12-19** - Based on hero section implementation task

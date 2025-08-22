# How to Add a Hero Section to Homepage via Sanity API

## Overview

This guide walks through the process of adding a hero section to a homepage through the Sanity API, based on learnings from successful implementation (2024-12-19).

## Prerequisites

- Sanity project with write permissions
- `SANITY_API_WRITE_TOKEN` in `.env.local`
- Node.js environment with `@sanity/client` installed
- Existing hero section schema in Sanity

## Step-by-Step Process

### Step 1: Verify Environment Setup

```bash
# Check if environment variables are available
node -e "
require('dotenv').config({ path: '.env.local' });
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log('Token exists:', !!process.env.SANITY_API_WRITE_TOKEN);
"
```

### Step 2: Create Sanity Client

```javascript
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
```

### Step 3: Check Existing Homepage

```javascript
async function checkHomepage() {
  const homePage = await client.fetch('*[_type == "homePage"][0]');

  if (!homePage) {
    console.log('❌ No homePage document found');
    return null;
  }

  console.log('✅ HomePage found:', homePage._id);
  console.log('Current sections:', homePage.pageSections?.length || 0);

  return homePage;
}
```

### Step 4: Create Hero Section Structure

```javascript
function createHeroSection(options = {}) {
  const {
    heading = 'Welcome to Our Amazing Platform',
    text = 'Discover amazing features and possibilities that will transform your experience.',
    button1Text = 'Get Started',
    button1Url = 'https://example.com/get-started',
    button2Text = 'Learn More',
    button2Url = 'https://example.com/learn-more',
  } = options;

  // CRITICAL: Validate button URLs are strings
  if (typeof button1Url !== 'string' || typeof button2Url !== 'string') {
    throw new Error('Button URLs must be strings, not booleans');
  }

  return {
    _type: 'hero',
    _key: `hero-section-${Date.now()}`,
    heading: heading,
    text: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: text,
          },
        ],
      },
    ],
    buttons: [
      {
        _key: `button-${Date.now()}-1`,
        _type: 'button',
        variant: 'primary',
        text: button1Text,
        link: {
          _type: 'link',
          type: 'external',
          external: true,
          href: button1Url, // Must be string URL
        },
      },
      {
        _key: `button-${Date.now()}-2`,
        _type: 'button',
        variant: 'secondary',
        text: button2Text,
        link: {
          _type: 'link',
          type: 'external',
          external: true,
          href: button2Url, // Must be string URL
        },
      },
    ],
  };
}
```

### Step 5: Add Image (Optional)

```javascript
async function addImageToHero(heroSection, imageBuffer, altText) {
  if (!imageBuffer) {
    console.log('ℹ️ No image provided, skipping image upload');
    return heroSection;
  }

  try {
    // Upload image asset
    const imageAsset = await client.assets.upload('image', imageBuffer, {
      filename: 'hero-image.jpg',
      contentType: 'image/jpeg',
    });

    console.log('✅ Image uploaded:', imageAsset._id);

    // Add image reference to hero section
    heroSection.image = {
      _type: 'image',
      alt: altText,
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
    };

    return heroSection;
  } catch (error) {
    console.error('❌ Image upload failed:', error.message);
    // Continue without image
    return heroSection;
  }
}
```

### Step 6: Add Hero Section to Homepage

```javascript
async function addHeroToHomepage(heroSection) {
  const homePage = await checkHomepage();

  if (!homePage) {
    // Create new homePage
    console.log('📝 Creating new homePage with hero section...');

    const result = await client.create({
      _type: 'homePage',
      name: 'Homepage',
      pageSections: [heroSection],
    });

    console.log('✅ HomePage created:', result._id);
    return result;
  }

  // Add to existing homePage
  console.log('📝 Adding hero section to existing homePage...');

  const updatedSections = [heroSection, ...homePage.pageSections];

  const result = await client.patch(homePage._id).set({ pageSections: updatedSections }).commit();

  console.log('✅ Hero section added:', result._id);
  return result;
}
```

### Step 7: Verify the Result

```javascript
async function verifyHeroSection() {
  const query = `*[_type == "homePage"][0]{
    _id,
    _type,
    name,
    pageSections[]{
      _key,
      _type,
      heading,
      text,
      buttons[]{
        _key,
        _type,
        variant,
        text,
        link{
          _type,
          type,
          external,
          href
        }
      },
      image{
        _type,
        alt,
        asset->{
          _id,
          url
        }
      }
    }
  }`;

  const homePage = await client.fetch(query);

  if (!homePage) {
    console.log('❌ No homePage found');
    return false;
  }

  const heroSection = homePage.pageSections.find((s) => s._type === 'hero');

  if (!heroSection) {
    console.log('❌ No hero section found');
    return false;
  }

  console.log('✅ Hero section verified:');
  console.log('- Heading:', heroSection.heading);
  console.log('- Text:', heroSection.text?.[0]?.children?.[0]?.text);
  console.log('- Buttons:', heroSection.buttons?.length || 0);
  console.log('- Image:', heroSection.image ? 'Present' : 'Not present');

  // Validate button URLs
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

  return true;
}
```

### Step 8: Complete Implementation

```javascript
async function addHeroSectionToHomepage(options = {}) {
  try {
    console.log('🚀 Starting hero section addition...');

    // Step 1: Create hero section
    const heroSection = createHeroSection(options);
    console.log('✅ Hero section structure created');

    // Step 2: Add image if provided
    if (options.imageBuffer) {
      await addImageToHero(heroSection, options.imageBuffer, options.imageAlt);
    }

    // Step 3: Add to homepage
    await addHeroToHomepage(heroSection);

    // Step 4: Verify
    await verifyHeroSection();

    console.log('🎉 Hero section added successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error adding hero section:', error);
    throw error;
  }
}
```

## Usage Example

```javascript
// Basic usage
await addHeroSectionToHomepage({
  heading: 'Welcome to Our Platform',
  text: 'Experience the future of content management.',
  button1Text: 'Start Now',
  button1Url: 'https://example.com/start',
  button2Text: 'Documentation',
  button2Url: 'https://example.com/docs',
});

// With image
const imageBuffer = fs.readFileSync('./hero-image.jpg');
await addHeroSectionToHomepage({
  heading: 'Welcome to Our Platform',
  text: 'Experience the future of content management.',
  button1Text: 'Start Now',
  button1Url: 'https://example.com/start',
  button2Text: 'Documentation',
  button2Url: 'https://example.com/docs',
  imageBuffer: imageBuffer,
  imageAlt: 'Platform hero image',
});
```

## Common Issues and Solutions

### Issue 1: Button URL Validation Error

- **Error**: "Invalid property value" for button URLs
- **Cause**: URLs set to boolean `true` instead of strings
- **Solution**: Always use string URLs like `"https://example.com/action"`

### Issue 2: Image Field Validation Error

- **Error**: "Invalid property value" for image field
- **Cause**: Image field set to `null` or invalid reference
- **Solution**: Upload image asset first, then reference it properly

### Issue 3: HomePage Not Found

- **Error**: No homePage document exists
- **Solution**: Script will automatically create one if it doesn't exist

### Issue 4: Section Not Displaying

- **Cause**: Section order or frontend caching
- **Solution**: Check section order and clear frontend cache

## Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Sanity client can connect and authenticate
- [ ] Hero section structure is valid
- [ ] Button URLs are strings, not booleans
- [ ] Image assets upload successfully (if provided)
- [ ] HomePage document is created/updated
- [ ] Hero section appears in verification query
- [ ] No validation errors in Sanity Studio

## Success Criteria

- ✅ Hero section created with all required fields
- ✅ Button URLs are proper strings
- ✅ Image uploaded and linked (if provided)
- ✅ No validation errors in Sanity Studio
- ✅ Section appears in homepage query results
- ✅ Frontend can display the section (after cache clear)

## Related Documentation

- [Button URL Validation Edge Case](../edge-cases/button-url-validation.md)
- [Image Field Validation Edge Case](../edge-cases/image-field-validation.md)
- [Hero Section Code Snippet](../code-snippets/create-hero-section.js)
- [Hero Section Task Log](../logging/hero-section-task.log.md)

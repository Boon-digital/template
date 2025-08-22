const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

/**
 * Reusable function to create a Media & Text section with CTA functionality
 * Based on learnings from second Media & Text section task (2024-12-19)
 *
 * @param {Object} options - Configuration options
 * @param {string} options.heading - Section heading (required)
 * @param {string} options.text - Section content text (required)
 * @param {string} options.imagePosition - 'left' or 'right' (default: 'left')
 * @param {string} options.imageAlt - Alt text for the image (required)
 * @param {Object} options.cta - Call-to-action object (optional)
 * @param {string} options.cta.label - CTA button label (required if cta provided)
 * @param {string} options.cta.url - CTA button URL (required if cta provided)
 * @param {string} options.svgContent - Custom SVG content for placeholder image
 * @param {string} options.filename - Custom filename for uploaded image
 */
async function createMediaTextSectionWithCTA(options = {}) {
  const {
    heading = 'Discover Our Innovative Features',
    text = 'Dive deep into your data with our intuitive analytics dashboard. Track progress, gain insights, and make smarter decisions with ease.',
    imagePosition = 'left', // 'left' or 'right'
    imageAlt = 'Product feature screenshot',
    cta = null, // { label: 'Explore Features', url: '/features' }
    svgContent = null,
    filename = 'media-text-placeholder.svg',
  } = options;

  // Create Sanity client with write permissions
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
  });

  try {
    console.log('🚀 Creating Media & Text section with CTA...');

    // Validate required fields
    if (!heading) {
      throw new Error('Heading is required');
    }
    if (!text) {
      throw new Error('Text content is required');
    }
    if (!imageAlt) {
      throw new Error('Image alt text is required');
    }

    // Validate image position
    if (!['left', 'right'].includes(imagePosition)) {
      throw new Error('Image position must be either "left" or "right"');
    }

    // Validate CTA if provided
    if (cta) {
      if (!cta.label || !cta.url) {
        throw new Error('CTA must have both label and url properties');
      }
      if (typeof cta.url !== 'string') {
        throw new Error('CTA URL must be a string');
      }
    }

    // Create default SVG placeholder if not provided
    const defaultSvgContent = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="16">
        Media and Text Section Image
      </text>
      <text x="50%" y="70%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">
        Replace with your image in Sanity Studio
      </text>
    </svg>`;

    const finalSvgContent = svgContent || defaultSvgContent;

    // Upload placeholder image (LEARNING: Must be proper asset reference)
    console.log('📤 Uploading placeholder image...');
    const imageAsset = await client.assets.upload('image', Buffer.from(finalSvgContent), {
      filename: filename,
      contentType: 'image/svg+xml',
    });

    console.log('✅ Image uploaded successfully! Asset ID:', imageAsset._id);

    // Create Media & Text section structure with CTA support
    const mediaTextSection = {
      _type: 'mediaText',
      _key: `media-text-${Date.now()}`,
      heading: heading,
      content: [
        {
          _key: `content-${Date.now()}`,
          _type: 'block',
          children: [
            {
              _key: `span-${Date.now()}`,
              _type: 'span',
              text: text,
            },
          ],
          style: 'normal',
        },
      ],
      imagePosition: imagePosition,
      image: {
        _type: 'image',
        alt: imageAlt,
        asset: {
          _type: 'reference',
          _ref: imageAsset._id,
        },
      },
      // Add CTA if provided
      ...(cta && { cta: cta }),
    };

    // Check if homePage document exists
    const homePage = await client.fetch('*[_type == "homePage"][0]');

    if (!homePage) {
      console.log('❌ No homePage document found. Creating one...');

      // Create new homePage with Media & Text section
      const result = await client.create({
        _type: 'homePage',
        name: 'Homepage',
        pageSections: [mediaTextSection],
      });

      console.log('✅ HomePage created with Media & Text section:', result._id);
      return result;
    }

    // Add Media & Text section to existing homePage
    const updatedSections = [...homePage.pageSections, mediaTextSection];

    const result = await client.patch(homePage._id).set({ pageSections: updatedSections }).commit();

    console.log('✅ Media & Text section with CTA added to existing homePage:', result._id);
    return result;
  } catch (error) {
    console.error('❌ Error creating Media & Text section with CTA:', error);
    throw error;
  }
}

/**
 * Verification function to check Media & Text section with CTA structure
 */
async function verifyMediaTextSectionWithCTA() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
  });

  try {
    const query = `*[_type == "homePage"][0]{
      _id,
      _type,
      name,
      pageSections[]{
        _key,
        _type,
        heading,
        content,
        imagePosition,
        image{
          _type,
          alt,
          asset->{
            _id,
            url
          }
        },
        cta{
          label,
          url
        }
      }
    }`;

    const homePage = await client.fetch(query);

    if (!homePage) {
      console.log('❌ No homePage document found');
      return null;
    }

    const mediaTextSections = homePage.pageSections.filter((s) => s._type === 'mediaText');

    console.log(`📊 Found ${mediaTextSections.length} Media & Text sections:`);

    mediaTextSections.forEach((section, index) => {
      console.log(`\n--- Section ${index + 1} ---`);
      console.log('- Heading:', section.heading);
      console.log('- Image Position:', section.imagePosition);
      console.log('- Content:', section.content?.[0]?.children?.[0]?.text);
      console.log('- Image Alt:', section.image?.alt);
      console.log('- CTA:', section.cta ? `${section.cta.label} -> ${section.cta.url}` : 'None');
    });

    return mediaTextSections;
  } catch (error) {
    console.error('❌ Error verifying Media & Text sections:', error);
    throw error;
  }
}

// Example usage
async function example() {
  try {
    // Create Media & Text section with CTA
    await createMediaTextSectionWithCTA({
      heading: 'Discover Our Innovative Features',
      text: 'Dive deep into your data with our intuitive analytics dashboard. Track progress, gain insights, and make smarter decisions with ease.',
      imagePosition: 'right',
      imageAlt: 'Product Analytics Dashboard - Interactive data visualization and insights',
      cta: {
        label: 'Explore Features',
        url: '/features',
      },
      filename: 'product-analytics-dashboard.svg',
    });

    // Verify the creation
    await verifyMediaTextSectionWithCTA();
  } catch (error) {
    console.error('Example failed:', error);
  }
}

module.exports = { createMediaTextSectionWithCTA, verifyMediaTextSectionWithCTA, example };

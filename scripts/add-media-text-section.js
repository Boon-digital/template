const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

/**
 * Script to add a Media & Text section to the homepage
 * Based on learnings from previous tasks and established patterns
 */
async function addMediaTextSection(options = {}) {
  const {
    heading = 'Welcome to Our Community',
    text = 'Join our vibrant community and discover amazing opportunities. We provide the tools and resources you need to succeed in your journey.',
    imagePosition = 'left', // 'left' or 'right'
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
    console.log('🚀 Creating Media & Text section...');

    // Validate image position
    if (!['left', 'right'].includes(imagePosition)) {
      throw new Error('Image position must be either "left" or "right"');
    }

    // Create a simple SVG placeholder image
    const svgContent = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="16">
        Media and Text Section Image
      </text>
      <text x="50%" y="70%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">
        Replace with your image in Sanity Studio
      </text>
    </svg>`;

    // Upload placeholder image (LEARNING: Must be proper asset reference)
    console.log('📤 Uploading placeholder image...');
    const imageAsset = await client.assets.upload('image', Buffer.from(svgContent), {
      filename: 'media-text-placeholder.svg',
      contentType: 'image/svg+xml',
    });

    console.log('✅ Image uploaded successfully! Asset ID:', imageAsset._id);

    // Create Media & Text section structure
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
        alt: 'Media & Text section image - Replace with your image in Sanity Studio',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id,
        },
      },
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

    // Check if Media & Text section already exists
    const existingMediaText = homePage.pageSections?.find(
      (section) => section._type === 'mediaText',
    );

    if (existingMediaText) {
      console.log('⚠️ Media & Text section already exists. Updating with new content...');

      // Update existing Media & Text section
      const updatedSections = homePage.pageSections.map((section) => {
        if (section._type === 'mediaText') {
          return mediaTextSection;
        }
        return section;
      });

      const result = await client
        .patch(homePage._id)
        .set({ pageSections: updatedSections })
        .commit();

      console.log('✅ Media & Text section updated:', result._id);
      return result;
    }

    // Add Media & Text section to existing homePage
    const updatedSections = [...homePage.pageSections, mediaTextSection];

    const result = await client.patch(homePage._id).set({ pageSections: updatedSections }).commit();

    console.log('✅ Media & Text section added to existing homePage:', result._id);
    return result;
  } catch (error) {
    console.error('❌ Error creating Media & Text section:', error);
    throw error;
  }
}

/**
 * Verification function to check Media & Text section structure
 */
async function verifyMediaTextSection() {
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
        }
      }
    }`;

    const homePage = await client.fetch(query);

    if (!homePage) {
      console.log('❌ No homePage document found');
      return null;
    }

    const mediaTextSection = homePage.pageSections.find((s) => s._type === 'mediaText');

    if (!mediaTextSection) {
      console.log('❌ No Media & Text section found in homePage');
      return null;
    }

    console.log('✅ Media & Text section found and verified:');
    console.log('- Heading:', mediaTextSection.heading);
    console.log('- Image Position:', mediaTextSection.imagePosition);
    console.log('- Content:', mediaTextSection.content?.[0]?.children?.[0]?.text);
    console.log('- Image:', mediaTextSection.image ? 'Present' : 'Not present');

    // Verify image asset exists
    if (mediaTextSection.image?.asset?._ref) {
      try {
        const asset = await client.getDocument(mediaTextSection.image.asset._ref);
        console.log('✅ Referenced image asset exists:', asset.url);
      } catch (error) {
        console.error('❌ Referenced image asset not found');
      }
    }

    return mediaTextSection;
  } catch (error) {
    console.error('❌ Error verifying Media & Text section:', error);
    throw error;
  }
}

// Example usage
async function example() {
  try {
    // Create Media & Text section with custom content
    await addMediaTextSection({
      heading: 'Welcome to Our Community',
      text: 'Join our vibrant community and discover amazing opportunities. We provide the tools and resources you need to succeed in your journey.',
      imagePosition: 'left',
    });

    // Verify the creation
    await verifyMediaTextSection();
  } catch (error) {
    console.error('Example failed:', error);
  }
}

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is required');
  process.exit(1);
}

if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.error('❌ SANITY_API_WRITE_TOKEN environment variable is required');
  process.exit(1);
}

// Run the script if called directly
if (require.main === module) {
  example();
}

module.exports = { addMediaTextSection, verifyMediaTextSection, example };

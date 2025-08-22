const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

/**
 * Add second Media & Text section to homepage
 * Task: Create second "Media & Text" section highlighting key product feature
 * Date: 2024-12-19
 */
async function addSecondMediaTextSection() {
  // Create Sanity client with write permissions
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
  });

  try {
    console.log('🚀 Adding second Media & Text section to homepage...');

    // Create a product screenshot SVG placeholder
    const svgContent = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1f2937"/>
      <rect x="50" y="50" width="500" height="300" fill="#374151" rx="8"/>
      <rect x="70" y="80" width="460" height="40" fill="#4b5563" rx="4"/>
      <rect x="70" y="140" width="200" height="120" fill="#6b7280" rx="4"/>
      <rect x="290" y="140" width="240" height="80" fill="#6b7280" rx="4"/>
      <rect x="290" y="240" width="240" height="20" fill="#6b7280" rx="4"/>
      <text x="50%" y="350" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
        Product Analytics Dashboard
      </text>
      <text x="50%" y="370" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">
        Replace with actual product screenshot in Sanity Studio
      </text>
    </svg>`;

    // Upload product screenshot placeholder
    console.log('📤 Uploading product screenshot placeholder...');
    const imageAsset = await client.assets.upload('image', Buffer.from(svgContent), {
      filename: 'product-analytics-dashboard.svg',
      contentType: 'image/svg+xml',
    });

    console.log('✅ Product screenshot uploaded successfully! Asset ID:', imageAsset._id);

    // Create second Media & Text section with specified requirements
    const secondMediaTextSection = {
      _type: 'mediaText',
      _key: `media-text-second-${Date.now()}`,
      heading: 'Discover Our Innovative Features',
      content: [
        {
          _key: `content-second-${Date.now()}`,
          _type: 'block',
          children: [
            {
              _key: `span-second-${Date.now()}`,
              _type: 'span',
              text: 'Dive deep into your data with our intuitive analytics dashboard. Track progress, gain insights, and make smarter decisions with ease.',
            },
          ],
          style: 'normal',
        },
      ],
      imagePosition: 'right', // Mirror the first section (which has 'left')
      image: {
        _type: 'image',
        alt: 'Product Analytics Dashboard - Interactive data visualization and insights',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id,
        },
      },
      cta: {
        label: 'Explore Features',
        url: '/features',
      },
    };

    // Get current homepage
    const homePage = await client.fetch('*[_type == "homePage"][0]');

    if (!homePage) {
      throw new Error('No homePage document found');
    }

    console.log('📄 Found existing homepage with', homePage.pageSections?.length || 0, 'sections');

    // Add second Media & Text section to existing sections
    const updatedSections = [...homePage.pageSections, secondMediaTextSection];

    // Update homepage with new section
    const result = await client.patch(homePage._id).set({ pageSections: updatedSections }).commit();

    console.log('✅ Second Media & Text section added successfully!');
    console.log('📋 Updated homepage ID:', result._id);
    console.log('📊 Total sections:', result.pageSections.length);

    return result;
  } catch (error) {
    console.error('❌ Error adding second Media & Text section:', error);
    throw error;
  }
}

/**
 * Verify the second Media & Text section was added correctly
 */
async function verifySecondMediaTextSection() {
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

    // Verify the second section has the correct requirements
    const secondSection = mediaTextSections[1]; // Second Media & Text section
    if (secondSection) {
      console.log('\n✅ Second Media & Text section verification:');
      console.log(
        '- Heading matches requirement:',
        secondSection.heading === 'Discover Our Innovative Features',
      );
      console.log('- Image position is right:', secondSection.imagePosition === 'right');
      console.log('- CTA present:', !!secondSection.cta);
      console.log('- CTA label correct:', secondSection.cta?.label === 'Explore Features');
      console.log('- CTA URL correct:', secondSection.cta?.url === '/features');
    }

    return mediaTextSections;
  } catch (error) {
    console.error('❌ Error verifying Media & Text sections:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    console.log('🎯 Starting second Media & Text section task...\n');

    // Add the second section
    await addSecondMediaTextSection();

    console.log('\n🔍 Verifying the addition...\n');

    // Verify the result
    await verifySecondMediaTextSection();

    console.log('\n✅ Task completed successfully!');
    console.log('📝 The second Media & Text section has been added to the homepage.');
    console.log(
      '🖼️  Replace the placeholder image with an actual product screenshot in Sanity Studio.',
    );
    console.log('🌐 The section will render on the frontend below the first Media & Text section.');
  } catch (error) {
    console.error('\n❌ Task failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { addSecondMediaTextSection, verifySecondMediaTextSection };

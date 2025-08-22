const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Create Sanity client with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function addHeroImage() {
  try {
    console.log('🖼️ Adding image to hero section...');

    // First, upload a placeholder image (we'll create a simple SVG)
    const placeholderSvg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="24">
        Hero Image Placeholder
      </text>
    </svg>`;

    console.log('📤 Uploading placeholder image...');

    // Upload the SVG as an asset
    const imageAsset = await client.assets.upload('image', Buffer.from(placeholderSvg), {
      filename: 'hero-placeholder.svg',
      contentType: 'image/svg+xml',
    });

    console.log('✅ Image uploaded:', imageAsset._id);

    // Get the current homePage
    const homePage = await client.fetch('*[_type == "homePage"][0]');

    if (!homePage) {
      console.log('❌ No homePage document found');
      return;
    }

    console.log('📄 HomePage found, adding image to hero section...');

    // Update the hero section to include the image
    const updatedSections = homePage.pageSections.map((section) => {
      if (section._type === 'hero') {
        return {
          ...section,
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAsset._id,
            },
            alt: 'Hero section placeholder image',
          },
        };
      }
      return section;
    });

    const result = await client.patch(homePage._id).set({ pageSections: updatedSections }).commit();

    console.log('✅ Image added to hero section successfully:', result._id);

    // Also let's verify the button URLs are correct
    console.log('\n🔍 Verifying button URLs:');
    const heroSection = updatedSections.find((s) => s._type === 'hero');
    if (heroSection && heroSection.buttons) {
      heroSection.buttons.forEach((button, index) => {
        console.log(`Button ${index + 1}: "${button.text}" -> ${button.link.href}`);
      });
    }

    return result;
  } catch (error) {
    console.error('❌ Error adding image to hero section:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  addHeroImage()
    .then(() => {
      console.log('🎉 Hero image addition completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { addHeroImage };

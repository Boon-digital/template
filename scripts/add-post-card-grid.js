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

async function addPostCardGrid() {
  try {
    console.log('🚀 Starting post card grid addition...');

    // First, check if homePage document exists
    const homePage = await client.fetch('*[_type == "homePage"][0]');

    if (!homePage) {
      console.log('❌ No homePage document found. Please create a homePage first.');
      return;
    }

    console.log('📄 HomePage document found. Adding post card grid section...');

    // Check if postCardGrid section already exists
    const existingPostCardGrid = homePage.pageSections?.find(
      (section) => section._type === 'postCardGrid',
    );

    if (existingPostCardGrid) {
      console.log('⚠️ Post card grid section already exists. Updating with new content...');

      // Update existing postCardGrid section
      const updatedSections = homePage.pageSections.map((section) => {
        if (section._type === 'postCardGrid') {
          return {
            ...section,
            heading: 'Latest Blog Posts',
            numberOfPosts: 3,
          };
        }
        return section;
      });

      const result = await client
        .patch(homePage._id)
        .set({ pageSections: updatedSections })
        .commit();

      console.log('✅ Post card grid section updated:', result._id);
      return result;
    } else {
      console.log('➕ Adding new post card grid section to existing HomePage...');

      // Add postCardGrid section to existing pageSections
      const newPostCardGridSection = {
        _type: 'postCardGrid',
        _key: 'post-card-grid-' + Date.now(),
        heading: 'Latest Blog Posts',
        numberOfPosts: 3,
      };

      const updatedSections = [...(homePage.pageSections || []), newPostCardGridSection];

      const result = await client
        .patch(homePage._id)
        .set({ pageSections: updatedSections })
        .commit();

      console.log('✅ Post card grid section added to HomePage:', result._id);
      return result;
    }
  } catch (error) {
    console.error('❌ Error adding post card grid section:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  addPostCardGrid()
    .then(() => {
      console.log('🎉 Post card grid addition completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { addPostCardGrid };

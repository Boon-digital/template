require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

// Create Sanity client with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function changeHeroLayout() {
  try {
    console.log('🚀 Changing hero section layout to centered...');

    // Get the current homePage
    const homePage = await client.fetch('*[_type == "homePage"][0]');

    if (!homePage) {
      console.log('❌ No homePage document found');
      return;
    }

    console.log('📄 HomePage found, updating hero section layout...');

    // Update the hero section layout to 'centered'
    const updatedSections = homePage.pageSections.map((section) => {
      if (section._type === 'hero') {
        console.log('🎯 Found hero section, changing layout from', section.layout, 'to centered');
        return {
          ...section,
          layout: 'centered',
        };
      }
      return section;
    });

    const result = await client.patch(homePage._id).set({ pageSections: updatedSections }).commit();

    console.log('✅ Hero section layout changed to centered successfully:', result._id);
    return result;
  } catch (error) {
    console.error('❌ Error changing hero section layout:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  changeHeroLayout()
    .then(() => {
      console.log('🎉 Hero layout change completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Hero layout change failed:', error);
      process.exit(1);
    });
}

module.exports = { changeHeroLayout };

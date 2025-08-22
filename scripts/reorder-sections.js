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

async function reorderSections() {
  try {
    console.log('🔧 Reordering sections to put hero first...');

    // Get the current homePage
    const homePage = await client.fetch('*[_type == "homePage"][0]');

    if (!homePage) {
      console.log('❌ No homePage document found');
      return;
    }

    console.log('📄 HomePage found, reordering sections...');
    console.log(
      'Current sections:',
      homePage.pageSections.map((s) => `${s._type} (${s._key})`),
    );

    // Reorder sections to put hero first, then others
    const heroSection = homePage.pageSections.find((section) => section._type === 'hero');
    const otherSections = homePage.pageSections.filter((section) => section._type !== 'hero');

    if (!heroSection) {
      console.log('❌ No hero section found');
      return;
    }

    const reorderedSections = [heroSection, ...otherSections];

    console.log(
      'New order:',
      reorderedSections.map((s) => `${s._type} (${s._key})`),
    );

    const result = await client
      .patch(homePage._id)
      .set({ pageSections: reorderedSections })
      .commit();

    console.log('✅ Sections reordered successfully:', result._id);
    return result;
  } catch (error) {
    console.error('❌ Error reordering sections:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  reorderSections()
    .then(() => {
      console.log('🎉 Section reordering completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { reorderSections };

/**
 * Change Hero Section Layout
 *
 * Reusable function to change the layout style of an existing hero section
 *
 * LEARNINGS:
 * - Layout changes are safe and don't affect content structure
 * - All existing content (heading, text, buttons, image) is preserved
 * - CSS classes automatically handle styling based on layout property
 * - Available layouts: 'default', 'centered', 'fullscreen'
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function changeHeroLayout(newLayout = 'centered') {
  try {
    console.log(`🚀 Changing hero section layout to ${newLayout}...`);

    // Validate layout option
    const validLayouts = ['default', 'centered', 'fullscreen'];
    if (!validLayouts.includes(newLayout)) {
      throw new Error(`Invalid layout: ${newLayout}. Valid options: ${validLayouts.join(', ')}`);
    }

    // Get the current homePage
    const homePage = await client.fetch('*[_type == "homePage"][0]');

    if (!homePage) {
      throw new Error('No homePage document found');
    }

    // Find hero section
    const heroSectionIndex = homePage.pageSections.findIndex((section) => section._type === 'hero');

    if (heroSectionIndex === -1) {
      throw new Error('No hero section found on homepage');
    }

    console.log(
      `📄 Found hero section, changing layout from ${homePage.pageSections[heroSectionIndex].layout} to ${newLayout}`,
    );

    // Update the hero section layout
    const updatedSections = [...homePage.pageSections];
    updatedSections[heroSectionIndex] = {
      ...updatedSections[heroSectionIndex],
      layout: newLayout,
    };

    const result = await client.patch(homePage._id).set({ pageSections: updatedSections }).commit();

    console.log(`✅ Hero section layout changed to ${newLayout} successfully:`, result._id);
    return result;
  } catch (error) {
    console.error('❌ Error changing hero section layout:', error);
    throw error;
  }
}

// Usage examples:
// await changeHeroLayout('centered');
// await changeHeroLayout('default');
// await changeHeroLayout('fullscreen');

module.exports = { changeHeroLayout };

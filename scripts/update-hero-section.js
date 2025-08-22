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

async function updateHeroSection() {
  try {
    console.log('🚀 Updating hero section...');
    
    // Get the current homePage
    const homePage = await client.fetch('*[_type == "homePage"][0]');
    
    if (!homePage) {
      console.log('❌ No homePage document found');
      return;
    }
    
    console.log('📄 HomePage found, updating hero section...');
    
    // Update the hero section with proper buttons and no image
    const updatedSections = homePage.pageSections.map(section => {
      if (section._type === 'hero') {
        return {
          ...section,
          heading: 'Welcome to Our Amazing Platform',
          text: [
            {
              _type: 'block',
              _key: 'hero-text-final-' + Date.now(),
              children: [
                {
                  _type: 'span',
                  _key: 'hero-text-span-final-' + Date.now(),
                  text: 'Discover the incredible features and possibilities that await you. Our platform is designed to help you achieve your goals and bring your ideas to life.',
                  marks: []
                }
              ],
              markDefs: [],
              style: 'normal'
            }
          ],
          // Remove image reference to avoid issues
          image: null,
          buttons: [
            {
              _type: 'button',
              _key: 'hero-button-final-1',
              variant: 'primary',
              text: 'Get Started',
              link: {
                _type: 'link',
                type: 'external',
                external: true,
                href: 'https://example.com/get-started'
              }
            },
            {
              _type: 'button',
              _key: 'hero-button-final-2',
              variant: 'secondary',
              text: 'Learn More',
              link: {
                _type: 'link',
                type: 'external',
                external: true,
                href: 'https://example.com/learn-more'
              }
            }
          ],
          layout: 'default'
        };
      }
      return section;
    });
    
    const result = await client
      .patch(homePage._id)
      .set({ pageSections: updatedSections })
      .commit();
      
    console.log('✅ Hero section updated successfully:', result._id);
    return result;
    
  } catch (error) {
    console.error('❌ Error updating hero section:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  updateHeroSection()
    .then(() => {
      console.log('🎉 Hero section update completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { updateHeroSection };

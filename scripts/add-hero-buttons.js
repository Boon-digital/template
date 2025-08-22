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

async function addHeroButtons() {
  try {
    console.log('🔧 Adding buttons to hero section...');
    
    // Get the current homePage
    const homePage = await client.fetch('*[_type == "homePage"][0]');
    
    if (!homePage) {
      console.log('❌ No homePage document found');
      return;
    }
    
    console.log('📄 HomePage found, adding buttons to hero section...');
    
    // Update the hero section to include buttons
    const updatedSections = homePage.pageSections.map(section => {
      if (section._type === 'hero') {
        return {
          ...section,
          buttons: [
            {
              _type: 'button',
              _key: 'hero-button-1',
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
              _key: 'hero-button-2', 
              variant: 'secondary',
              text: 'Learn More',
              link: {
                _type: 'link',
                type: 'external',
                external: true,
                href: 'https://example.com/learn-more'
              }
            }
          ]
        };
      }
      return section;
    });
    
    const result = await client
      .patch(homePage._id)
      .set({ pageSections: updatedSections })
      .commit();
      
    console.log('✅ Buttons added to hero section successfully:', result._id);
    return result;
    
  } catch (error) {
    console.error('❌ Error adding buttons to hero section:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  addHeroButtons()
    .then(() => {
      console.log('🎉 Hero buttons addition completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { addHeroButtons };

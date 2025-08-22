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

async function addHeroSection() {
  try {
    console.log('🚀 Starting hero section addition...');
    
    // First, check if homePage document exists
    const homePage = await client.fetch('*[_type == "homePage"][0]');
    
    if (!homePage) {
      console.log('❌ No homePage document found. Creating one...');
      
      // Create homePage document with hero section
      const newHomePage = {
        _type: 'homePage',
        name: 'Home Page',
        pageSections: [
          {
            _type: 'hero',
            _key: 'hero-section-' + Date.now(),
            heading: 'Welcome to Our Amazing Platform',
            text: [
              {
                _type: 'block',
                _key: 'hero-text-1',
                children: [
                  {
                    _type: 'span',
                    _key: 'hero-text-span-1',
                    text: 'Discover the incredible features and possibilities that await you. Our platform is designed to help you achieve your goals and bring your ideas to life.',
                    marks: []
                  }
                ],
                markDefs: [],
                style: 'normal'
              }
            ],
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: 'image-placeholder' // This will need to be replaced with actual image
              },
              alt: 'Hero section background image'
            },
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
            ],
            layout: 'default'
          }
        ],
        seo: {
          _type: 'seoMetaFields',
          metaTitle: 'Home - Welcome to Our Platform',
          metaDescription: 'Discover amazing features and possibilities on our platform.',
          noIndex: false
        }
      };
      
      const result = await client.create(newHomePage);
      console.log('✅ HomePage created with hero section:', result._id);
      return result;
      
    } else {
      console.log('📄 HomePage document found. Adding hero section...');
      
      // Check if hero section already exists
      const existingHero = homePage.pageSections?.find(section => section._type === 'hero');
      
      if (existingHero) {
        console.log('⚠️ Hero section already exists. Updating with new content...');
        
        // Update existing hero section
        const updatedSections = homePage.pageSections.map(section => {
          if (section._type === 'hero') {
            return {
              ...section,
              heading: 'Updated: Welcome to Our Amazing Platform',
              text: [
                {
                  _type: 'block',
                  _key: 'hero-text-updated-' + Date.now(),
                  children: [
                    {
                      _type: 'span',
                      _key: 'hero-text-span-updated-' + Date.now(),
                      text: 'Updated: Discover the incredible features and possibilities that await you. Our platform is designed to help you achieve your goals and bring your ideas to life.',
                      marks: []
                    }
                  ],
                  markDefs: [],
                  style: 'normal'
                }
              ],
              buttons: [
                {
                  _type: 'button',
                  _key: 'hero-button-updated-1',
                  variant: 'primary',
                  text: 'Get Started Now',
                  link: {
                    _type: 'link',
                    type: 'external',
                    external: true,
                    href: 'https://example.com/get-started'
                  }
                },
                {
                  _type: 'button',
                  _key: 'hero-button-updated-2',
                  variant: 'secondary',
                  text: 'Explore Features',
                  link: {
                    _type: 'link',
                    type: 'external',
                    external: true,
                    href: 'https://example.com/explore'
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
          
        console.log('✅ Hero section updated:', result._id);
        return result;
        
      } else {
        console.log('➕ Adding new hero section to existing HomePage...');
        
        // Add hero section to existing pageSections
        const newHeroSection = {
          _type: 'hero',
          _key: 'hero-section-' + Date.now(),
          heading: 'Welcome to Our Amazing Platform',
          text: [
            {
              _type: 'block',
              _key: 'hero-text-1',
              children: [
                {
                  _type: 'span',
                  _key: 'hero-text-span-1',
                  text: 'Discover the incredible features and possibilities that await you. Our platform is designed to help you achieve your goals and bring your ideas to life.',
                  marks: []
                }
              ],
              markDefs: [],
              style: 'normal'
            }
          ],
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: 'image-placeholder'
            },
            alt: 'Hero section background image'
          },
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
          ],
          layout: 'default'
        };
        
        const updatedSections = [...(homePage.pageSections || []), newHeroSection];
        
        const result = await client
          .patch(homePage._id)
          .set({ pageSections: updatedSections })
          .commit();
          
        console.log('✅ Hero section added to HomePage:', result._id);
        return result;
      }
    }
    
  } catch (error) {
    console.error('❌ Error adding hero section:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  addHeroSection()
    .then(() => {
      console.log('🎉 Hero section addition completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { addHeroSection };

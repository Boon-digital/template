const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

/**
 * Reusable function to create a hero section with proper validation
 * Based on learnings from hero section task (2024-12-19)
 */
async function createHeroSection(options = {}) {
  const {
    heading = 'Welcome to Our Amazing Platform',
    text = 'Discover amazing features and possibilities that will transform your experience.',
    button1Text = 'Get Started',
    button1Url = 'https://example.com/get-started',
    button2Text = 'Learn More',
    button2Url = 'https://example.com/learn-more',
    imageUrl = null,
    imageAlt = 'Hero section image',
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
    console.log('🚀 Creating hero section...');

    // Validate button URLs (LEARNING: Must be strings, not booleans)
    if (typeof button1Url !== 'string' || typeof button2Url !== 'string') {
      throw new Error('Button URLs must be strings, not booleans or other types');
    }

    // Create hero section structure
    const heroSection = {
      _type: 'hero',
      _key: `hero-section-${Date.now()}`,
      heading: heading,
      text: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: text,
            },
          ],
        },
      ],
      buttons: [
        {
          _key: `button-${Date.now()}-1`,
          _type: 'button',
          variant: 'primary',
          text: button1Text,
          link: {
            _type: 'link',
            type: 'external',
            external: true,
            href: button1Url, // LEARNING: Must be string URL
          },
        },
        {
          _key: `button-${Date.now()}-2`,
          _type: 'button',
          variant: 'secondary',
          text: button2Text,
          link: {
            _type: 'link',
            type: 'external',
            external: true,
            href: button2Url, // LEARNING: Must be string URL
          },
        },
      ],
    };

    // Add image if provided (LEARNING: Must be proper asset reference)
    if (imageUrl) {
      // Upload image asset first
      const imageAsset = await client.assets.upload('image', Buffer.from(imageUrl), {
        filename: 'hero-image.jpg',
        contentType: 'image/jpeg',
      });

      heroSection.image = {
        _type: 'image',
        alt: imageAlt,
        asset: {
          _type: 'reference',
          _ref: imageAsset._id,
        },
      };
    }

    // Check if homePage document exists
    const homePage = await client.fetch('*[_type == "homePage"][0]');

    if (!homePage) {
      console.log('❌ No homePage document found. Creating one...');

      // Create new homePage with hero section
      const result = await client.create({
        _type: 'homePage',
        name: 'Homepage',
        pageSections: [heroSection],
      });

      console.log('✅ HomePage created with hero section:', result._id);
      return result;
    }

    // Add hero section to existing homePage
    const updatedSections = [heroSection, ...homePage.pageSections];

    const result = await client.patch(homePage._id).set({ pageSections: updatedSections }).commit();

    console.log('✅ Hero section added to existing homePage:', result._id);
    return result;
  } catch (error) {
    console.error('❌ Error creating hero section:', error);
    throw error;
  }
}

/**
 * Verification function to check hero section structure
 */
async function verifyHeroSection() {
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
        text,
        buttons[]{
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
        },
        image{
          _type,
          alt,
          asset->{
            _id,
            url
          }
        }
      }
    }`;

    const homePage = await client.fetch(query);

    if (!homePage) {
      console.log('❌ No homePage document found');
      return null;
    }

    const heroSection = homePage.pageSections.find((s) => s._type === 'hero');

    if (!heroSection) {
      console.log('❌ No hero section found in homePage');
      return null;
    }

    console.log('✅ Hero section found and verified:');
    console.log('- Heading:', heroSection.heading);
    console.log('- Text:', heroSection.text?.[0]?.children?.[0]?.text);
    console.log('- Buttons:', heroSection.buttons?.length || 0);
    console.log('- Image:', heroSection.image ? 'Present' : 'Not present');

    // Validate button URLs
    if (heroSection.buttons) {
      heroSection.buttons.forEach((button, index) => {
        const url = button.link?.href;
        if (typeof url !== 'string') {
          console.warn(`⚠️ Button ${index + 1} has invalid URL type:`, typeof url);
        } else {
          console.log(`✅ Button ${index + 1}: "${button.text}" -> ${url}`);
        }
      });
    }

    return heroSection;
  } catch (error) {
    console.error('❌ Error verifying hero section:', error);
    throw error;
  }
}

// Example usage
async function example() {
  try {
    // Create hero section with custom content
    await createHeroSection({
      heading: 'Welcome to Our Platform',
      text: 'Experience the future of content management.',
      button1Text: 'Start Now',
      button1Url: 'https://example.com/start',
      button2Text: 'Documentation',
      button2Url: 'https://example.com/docs',
    });

    // Verify the creation
    await verifyHeroSection();
  } catch (error) {
    console.error('Example failed:', error);
  }
}

module.exports = { createHeroSection, verifyHeroSection, example };

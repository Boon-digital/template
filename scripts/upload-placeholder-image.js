const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function uploadPlaceholderImage() {
  try {
    console.log('🚀 Starting placeholder image upload...');

    // Read the SVG file
    const imagePath = path.join(__dirname, '../placeholder-image.svg');
    const imageBuffer = fs.readFileSync(imagePath);

    // Upload the image to Sanity
    console.log('📤 Uploading image to Sanity...');
    const imageAsset = await client.assets.upload('image', imageBuffer, {
      filename: 'placeholder-image.svg',
      contentType: 'image/svg+xml',
    });

    console.log('✅ Image uploaded successfully! Asset ID:', imageAsset._id);

    // Create the image document
    const imageDocument = {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
      alt: 'Image placeholder - Add your image in Sanity Studio',
    };

    // Get the current homepage
    console.log('📄 Fetching current homepage...');
    const homePage = await client.getDocument('homePage');

    if (!homePage) {
      console.log('❌ Homepage not found. Creating new homepage...');
      const newHomePage = {
        _id: 'homePage',
        _type: 'homePage',
        name: 'Home Page',
        pageSections: [
          {
            _key: 'media-text-placeholder',
            _type: 'mediaText',
            heading: 'Welcome to Our Site',
            content: [
              {
                _key: 'content-001',
                _type: 'block',
                children: [
                  {
                    _key: 'span-001',
                    _type: 'span',
                    text: 'This is a sample MediaText section with a placeholder image. You can replace this content and image in Sanity Studio.',
                  },
                ],
                style: 'normal',
              },
            ],
            imagePosition: 'left',
            image: imageDocument,
          },
        ],
      };

      await client.createOrReplace(newHomePage);
      console.log('✅ New homepage created with placeholder image!');
    } else {
      console.log('📝 Updating existing homepage...');

      // Check if there's already a MediaText section
      const existingMediaTextSection = homePage.pageSections?.find(
        (section) => section._type === 'mediaText',
      );

      if (existingMediaTextSection) {
        // Update the existing MediaText section with the placeholder image
        const updatedSections = homePage.pageSections.map((section) => {
          if (section._type === 'mediaText') {
            return {
              ...section,
              image: imageDocument,
            };
          }
          return section;
        });

        await client
          .patch('homePage')
          .set({
            pageSections: updatedSections,
          })
          .commit();

        console.log('✅ Updated existing MediaText section with placeholder image!');
      } else {
        // Add a new MediaText section with the placeholder image
        const newSection = {
          _key: `media-text-${Date.now()}`,
          _type: 'mediaText',
          heading: 'Welcome to Our Site',
          content: [
            {
              _key: 'content-001',
              _type: 'block',
              children: [
                {
                  _key: 'span-001',
                  _type: 'span',
                  text: 'This is a sample MediaText section with a placeholder image. You can replace this content and image in Sanity Studio.',
                },
              ],
              style: 'normal',
            },
          ],
          imagePosition: 'left',
          image: imageDocument,
        };

        const updatedSections = [...(homePage.pageSections || []), newSection];

        await client
          .patch('homePage')
          .set({
            pageSections: updatedSections,
          })
          .commit();

        console.log('✅ Added new MediaText section with placeholder image!');
      }
    }

    console.log(
      '🎉 Success! Placeholder image has been uploaded and added to your MediaText section.',
    );
    console.log('📱 Check your homepage to see the placeholder image in action.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
    process.exit(1);
  }
}

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is required');
  process.exit(1);
}

if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.error('❌ SANITY_API_WRITE_TOKEN environment variable is required');
  process.exit(1);
}

// Run the script
uploadPlaceholderImage();

const fs = require('fs');
const path = require('path');

// Function to add MediaText section with placeholder image
async function addPlaceholderSection() {
  try {
    console.log('🚀 Adding MediaText section with placeholder image...');

    // First, let's create a MediaText section with a placeholder image
    // We'll use a placeholder image URL that will be replaced later
    const mediaTextSection = {
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
              text: 'This is a sample MediaText section. You can replace this content and add your own image in Sanity Studio.',
            },
          ],
          style: 'normal',
        },
      ],
      imagePosition: 'left',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-https://via.placeholder.com/1000x667/F3F4F6/9CA3AF?text=Image+Placeholder',
        },
        alt: 'Image placeholder - Add your image in Sanity Studio',
      },
    };

    // Use the existing API endpoint to add this section to the homepage
    const response = await fetch('http://localhost:3000/api/sanity-mutations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SANITY_MUTATION_API_KEY,
      },
      body: JSON.stringify({
        operation: 'patch',
        id: 'homePage',
        document: {
          pageSections: [mediaTextSection],
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API request failed: ${error.error}`);
    }

    const result = await response.json();
    console.log('✅ Successfully added MediaText section with placeholder image!');
    console.log('📱 Check your homepage to see the new section.');
    console.log('🖼️  You can replace the placeholder image in Sanity Studio.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Check for required environment variables
if (!process.env.SANITY_MUTATION_API_KEY) {
  console.error('❌ SANITY_MUTATION_API_KEY environment variable is required');
  console.error('💡 Add it to your .env.local file');
  process.exit(1);
}

// Run the script
addPlaceholderSection();

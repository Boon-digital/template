const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function checkHomepage() {
  try {
    console.log('🔍 Checking homepage data...');

    const query = `*[_type == "homePage"][0]{
      _id,
      _type,
      name,
      pageSections[]{
        _key,
        _type,
        heading,
        text,
        content,
        imagePosition,
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

    console.log('📄 HomePage data:');
    console.log(JSON.stringify(homePage, null, 2));

    if (homePage?.pageSections) {
      console.log('\n📋 Sections found:');
      homePage.pageSections.forEach((section, index) => {
        console.log(`${index + 1}. ${section._type} - ${section.heading || 'No heading'}`);
      });
    } else {
      console.log('❌ No pageSections found');
    }
  } catch (error) {
    console.error('❌ Error checking homepage:', error);
  }
}

// Run the script
if (require.main === module) {
  checkHomepage()
    .then(() => {
      console.log('✅ Check completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { checkHomepage };

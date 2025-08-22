const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
});

async function checkPosts() {
  try {
    console.log('🔍 Checking posts in Sanity dataset...');

    // Fetch all posts
    const posts = await client.fetch(`
      *[_type == "post"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        excerpt,
        date,
        "imageUrl": image.asset->url,
        "authorName": author->firstName + " " + author->lastName,
        _createdAt
      }
    `);

    console.log(`📊 Found ${posts.length} posts:`);

    if (posts.length === 0) {
      console.log('❌ No posts found. You may need to create some posts first.');
      return;
    }

    posts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug?.current || 'No slug'}`);
      console.log(`   Excerpt: ${post.excerpt || 'No excerpt'}`);
      console.log(`   Date: ${post.date || 'No date'}`);
      console.log(`   Author: ${post.authorName || 'No author'}`);
      console.log(`   Image: ${post.imageUrl ? 'Yes' : 'No'}`);
      console.log(`   Created: ${new Date(post._createdAt).toLocaleDateString()}`);
    });
  } catch (error) {
    console.error('❌ Error checking posts:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  checkPosts()
    .then(() => {
      console.log('\n🎉 Post check completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { checkPosts };

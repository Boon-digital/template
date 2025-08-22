import { writeClient } from './client/writeClient';

export interface MutationOptions {
  operation: 'create' | 'createOrReplace' | 'createIfNotExists' | 'patch' | 'delete';
  document?: any;
  id?: string;
  query?: string;
  params?: Record<string, any>;
}

export interface MutationResponse {
  success: boolean;
  result: any;
  operation: string;
}

/**
 * Make a mutation to Sanity through the API route
 * This function is designed to be used by AI assistants to make changes to Sanity content
 */
export async function makeSanityMutation(options: MutationOptions): Promise<MutationResponse> {
  const apiKey = process.env.SANITY_MUTATION_API_KEY;

  if (!apiKey) {
    throw new Error('SANITY_MUTATION_API_KEY environment variable is not set');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sanity-mutations`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(options),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Mutation failed: ${response.status} ${response.statusText} - ${errorData.error || 'Unknown error'}`,
    );
  }

  return response.json();
}

/**
 * Direct mutation functions for common operations
 * These bypass the API route and use the write client directly
 */

export async function createDocument(document: any) {
  return writeClient.create(document);
}

export async function createOrReplaceDocument(id: string, document: any) {
  return writeClient.createOrReplace({
    ...document,
    _id: id,
  });
}

export async function createIfNotExistsDocument(id: string, document: any) {
  return writeClient.createIfNotExists({
    ...document,
    _id: id,
  });
}

export async function patchDocument(id: string, patches: any) {
  return writeClient.patch(id).set(patches).commit();
}

export async function deleteDocument(id: string) {
  return writeClient.delete(id);
}

/**
 * Helper function to create a new post
 */
export async function createPost(postData: {
  title: string;
  slug: string;
  excerpt?: string;
  body?: any;
  author?: string;
  categories?: string[];
  publishedAt?: string;
}) {
  const document = {
    _type: 'post',
    title: postData.title,
    slug: {
      _type: 'slug',
      current: postData.slug,
    },
    excerpt: postData.excerpt,
    body: postData.body || [],
    author: postData.author ? { _type: 'reference', _ref: postData.author } : undefined,
    categories: postData.categories?.map((cat) => ({ _type: 'reference', _ref: cat })) || [],
    publishedAt: postData.publishedAt || new Date().toISOString(),
  };

  return createDocument(document);
}

/**
 * Helper function to create a new page
 */
export async function createPage(pageData: {
  name: string;
  slug: string;
  content?: any;
  sections?: any[];
}) {
  const document = {
    _type: 'page',
    name: pageData.name,
    slug: {
      _type: 'slug',
      current: pageData.slug,
    },
    content: pageData.content || [],
    sections: pageData.sections || [],
  };

  return createDocument(document);
}

/**
 * Helper function to create a new category
 */
export async function createCategory(categoryData: {
  title: string;
  slug: string;
  description?: string;
}) {
  const document = {
    _type: 'category',
    title: categoryData.title,
    slug: {
      _type: 'slug',
      current: categoryData.slug,
    },
    description: categoryData.description,
  };

  return createDocument(document);
}

/**
 * Helper function to create a new person
 */
export async function createPerson(personData: {
  name: string;
  slug: string;
  image?: any;
  bio?: any;
}) {
  const document = {
    _type: 'person',
    name: personData.name,
    slug: {
      _type: 'slug',
      current: personData.slug,
    },
    image: personData.image,
    bio: personData.bio || [],
  };

  return createDocument(document);
}

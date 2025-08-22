import { createClient } from 'next-sanity';
import { serverEnv } from '@/env/serverEnv';
import { clientEnv } from '@/env/clientEnv';

export const writeClient = createClient({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: clientEnv.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false, // Disable CDN for write operations
  perspective: 'published',
  token: serverEnv.SANITY_API_WRITE_TOKEN, // Write token for mutations
});

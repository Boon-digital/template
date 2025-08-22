import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity/client/writeClient';
import { serverEnv } from '@/env/serverEnv';
import * as v from 'valibot';

// Define the schema for mutation requests
const MutationRequestSchema = v.object({
  operation: v.union([
    v.literal('create'),
    v.literal('createOrReplace'),
    v.literal('createIfNotExists'),
    v.literal('patch'),
    v.literal('delete'),
  ]),
  document: v.any(), // The document to create/update
  id: v.optional(v.string()), // Document ID for patch/delete operations
  query: v.optional(v.string()), // GROQ query for operations that need it
  params: v.optional(v.record(v.string(), v.any())), // Parameters for the query
});

// Define the schema for the API key validation
const ApiKeySchema = v.object({
  'x-api-key': v.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    // In a real implementation, you would validate this against a secure API key
    // For now, we'll use a simple check - you should replace this with proper validation
    const expectedApiKey = process.env.SANITY_MUTATION_API_KEY;
    if (!expectedApiKey || apiKey !== expectedApiKey) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await request.json();
    const validatedBody = v.parse(MutationRequestSchema, body);

    let result;

    // Execute the mutation based on the operation type
    switch (validatedBody.operation) {
      case 'create':
        result = await writeClient.create(validatedBody.document);
        break;

      case 'createOrReplace':
        if (!validatedBody.id) {
          return NextResponse.json(
            { error: 'Document ID is required for createOrReplace operation' },
            { status: 400 },
          );
        }
        result = await writeClient.createOrReplace({
          ...validatedBody.document,
          _id: validatedBody.id,
        });
        break;

      case 'createIfNotExists':
        if (!validatedBody.id) {
          return NextResponse.json(
            { error: 'Document ID is required for createIfNotExists operation' },
            { status: 400 },
          );
        }
        result = await writeClient.createIfNotExists({
          ...validatedBody.document,
          _id: validatedBody.id,
        });
        break;

      case 'patch':
        if (!validatedBody.id) {
          return NextResponse.json(
            { error: 'Document ID is required for patch operation' },
            { status: 400 },
          );
        }
        result = await writeClient.patch(validatedBody.id).set(validatedBody.document).commit();
        break;

      case 'delete':
        if (!validatedBody.id) {
          return NextResponse.json(
            { error: 'Document ID is required for delete operation' },
            { status: 400 },
          );
        }
        result = await writeClient.delete(validatedBody.id);
        break;

      default:
        return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      result,
      operation: validatedBody.operation,
    });
  } catch (error) {
    console.error('Sanity mutation error:', error);

    if (error instanceof v.ValiError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Optional: Add a GET endpoint to check if the API is working
export async function GET() {
  return NextResponse.json({
    message: 'Sanity mutations API is running',
    availableOperations: ['create', 'createOrReplace', 'createIfNotExists', 'patch', 'delete'],
  });
}

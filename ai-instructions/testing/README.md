# Testing Approaches for Sanity API Operations

This folder contains testing strategies, best practices, and examples for validating Sanity API operations.

## 📁 Testing Categories

### Unit Tests

- `api-client-tests.md` - Testing API client functions
- `validation-tests.md` - Testing data validation
- `utility-tests.md` - Testing helper functions
- `mutation-tests.md` - Testing document mutations

### Integration Tests

- `end-to-end-tests.md` - Complete workflow testing
- `bulk-operation-tests.md` - Testing bulk operations
- `media-upload-tests.md` - Testing file uploads
- `reference-tests.md` - Testing document references

### Performance Tests

- `load-testing.md` - Testing under load
- `stress-testing.md` - Testing limits
- `benchmark-tests.md` - Performance benchmarks
- `memory-tests.md` - Memory usage testing

### Error Testing

- `error-scenario-tests.md` - Testing error conditions
- `edge-case-tests.md` - Testing unusual scenarios
- `failure-recovery-tests.md` - Testing recovery mechanisms

## 🧪 Testing Framework Setup

### Jest Configuration

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
```

### Test Setup

```typescript
// tests/setup.ts
import { createClient } from '@sanity/client';

// Mock Sanity client for testing
jest.mock('@sanity/client', () => ({
  createClient: jest.fn(() => ({
    create: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    query: jest.fn(),
  })),
}));
```

## 📝 Test Examples

### Basic API Test

```typescript
// tests/api.test.ts
import { createPost } from '../src/api/posts';

describe('Post Creation', () => {
  it('should create a post successfully', async () => {
    const postData = {
      title: 'Test Post',
      slug: 'test-post',
      content: 'Test content',
    };

    const result = await createPost(postData);

    expect(result).toBeDefined();
    expect(result.title).toBe(postData.title);
    expect(result.slug).toBe(postData.slug);
  });

  it('should handle validation errors', async () => {
    const invalidData = {
      title: '', // Invalid: empty title
      slug: 'test-post',
    };

    await expect(createPost(invalidData)).rejects.toThrow();
  });
});
```

### Mock Testing

```typescript
// tests/mock.test.ts
import { createClient } from '@sanity/client';

const mockClient = {
  create: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  query: jest.fn(),
};

jest.mocked(createClient).mockReturnValue(mockClient);

describe('Mocked API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call create with correct data', async () => {
    const postData = { title: 'Test', content: 'Content' };

    mockClient.create.mockResolvedValue({ _id: 'test-id', ...postData });

    const result = await createPost(postData);

    expect(mockClient.create).toHaveBeenCalledWith(postData);
    expect(result._id).toBe('test-id');
  });
});
```

## 🔧 Testing Utilities

### Test Helpers

```typescript
// tests/helpers.ts
export const createTestPost = (overrides = {}) => ({
  title: 'Test Post',
  slug: 'test-post',
  content: 'Test content',
  author: 'test-author',
  ...overrides,
});

export const createTestImage = (overrides = {}) => ({
  _type: 'image',
  asset: {
    _ref: 'image-test-id',
    _type: 'reference',
  },
  ...overrides,
});

export const waitForOperation = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
```

### Test Data Factory

```typescript
// tests/factories.ts
export class TestDataFactory {
  static createPost(overrides = {}) {
    return {
      _type: 'post',
      title: 'Test Post',
      slug: 'test-post',
      content: 'Test content',
      publishedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static createPerson(overrides = {}) {
    return {
      _type: 'person',
      name: 'Test Person',
      slug: 'test-person',
      bio: 'Test bio',
      ...overrides,
    };
  }
}
```

## 📊 Testing Statistics

### Coverage Metrics

- **Line Coverage**: Percentage of code lines tested
- **Branch Coverage**: Percentage of code branches tested
- **Function Coverage**: Percentage of functions tested
- **Statement Coverage**: Percentage of statements tested

### Test Results

- **Total Tests**: Count of all tests
- **Passing Tests**: Count of successful tests
- **Failing Tests**: Count of failed tests
- **Test Duration**: Average time per test
- **Flaky Tests**: Tests with inconsistent results

## 🎯 Testing Best Practices

### Test Structure

- ✅ Use descriptive test names
- ✅ Follow AAA pattern (Arrange, Act, Assert)
- ✅ Keep tests independent
- ✅ Use meaningful test data
- ✅ Test both success and failure cases

### Test Data

- ✅ Use factories for test data
- ✅ Avoid hardcoded values
- ✅ Clean up test data
- ✅ Use realistic data scenarios
- ✅ Test edge cases

### Performance

- ✅ Mock external dependencies
- ✅ Use test databases
- ✅ Parallel test execution
- ✅ Optimize test setup/teardown
- ✅ Monitor test performance

## 🔄 Continuous Testing

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:unit",
      "pre-push": "npm run test:full"
    }
  }
}
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test
      - run: npm run test:coverage
```

## 📈 Test Reporting

### Coverage Reports

- HTML coverage reports
- Console coverage output
- Coverage thresholds
- Trend analysis

### Test Results

- JUnit XML reports
- HTML test reports
- Slack notifications
- Email alerts

---

**Last Updated**: [Current Date]
**Total Tests**: 0
**Coverage**: TBD
**Success Rate**: TBD

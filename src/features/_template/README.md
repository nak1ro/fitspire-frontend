# Feature Template

This is a template folder for creating new features. Copy this folder and rename it to your feature name.

## How to Use

1. Copy this folder: `cp -r _template my-feature`
2. Rename all `Feature` and `feature` references to your feature name
3. Update types in `types/index.ts`
4. Update endpoints in `api/endpoints.ts`
5. Implement your screens and components

## Structure

```
my-feature/
├── api/
│   ├── endpoints.ts    # API endpoint constants
│   ├── queries.ts      # React Query fetch hooks
│   ├── mutations.ts    # React Query mutation hooks
│   └── index.ts
├── components/         # Feature-specific UI components
│   └── index.ts
├── constants/          # Feature constants
│   └── index.ts
├── hooks/              # Re-exports + feature state hooks
│   └── index.ts
├── screens/            # Screen components
│   └── index.ts
├── types/              # Feature-specific types
│   └── index.ts
├── utils/              # Feature-specific helpers
│   └── index.ts
└── index.ts            # Feature barrel export
```

## Usage in App

```typescript
// Import hooks
import { useFeatureList, useCreateFeature } from '@/features/my-feature';

// Import types
import type { FeatureItem } from '@/features/my-feature';

// Import screens (usually direct)
import { MyFeatureScreen } from '@/features/my-feature/screens';
```

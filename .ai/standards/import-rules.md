# Import Rules

## Absolute Imports Only
Always use the `@/` alias for all imports within `src/`:
```typescript
import { Button } from '@/design-system';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';
import { ROUTES } from '@/app/constants';
```

## No Deep Relative Imports
Never use relative imports that go up multiple directories:
```typescript
// ❌ Bad
import { Button } from '../../design-system';
import type { User } from '../../types';

// ✅ Good
import { Button } from '@/design-system';
import type { User } from '@/types';
```

## Type Imports
Use `import type` for type-only imports:
```typescript
import type { User, ApiResponse } from '@/types';
import { Button } from '@/design-system'; // value import
```

## Import Order
```
1. React and React Router
2. Third-party libraries
3. Project components and UI
4. Custom hooks
5. Services
6. Stores
7. Types
8. Utils
9. Styles (CSS)

Example:
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { Button, Input } from '@/design-system';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth.store';
import type { User } from '@/types';
import { formatDate } from '@/utils/date';
import '@/styles/page.css';
```

## Barrel Imports
Prefer importing from barrel files:
```typescript
import { Button, Modal, Toast } from '@/design-system';
import { useAuth, useCart } from '@/hooks';
```
Not from deep paths:
```typescript
// Avoid
import { Button } from '@/design-system/components/Button';
```

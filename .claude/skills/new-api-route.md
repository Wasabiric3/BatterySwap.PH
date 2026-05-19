# new-api-route

Scaffold a new backend API route for BatterySwap PH following the project's controller → service → route registration pattern.

## Usage
`/new-api-route <resource> <method> <path>`

Example: `/new-api-route stations GET /api/v1/stations/nearby`

## What to build

When the user invokes this skill, scaffold **three files** (or add to existing ones):

### 1. `backend/src/routes/<resource>.ts`
Register the route on the Express router. If the file already exists, add the new route to it. Follow the existing pattern:
```typescript
import { Router } from "express";
import { <ControllerMethod> } from "../controllers/<resource>.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { <RequestSchema> } from "../models/<resource>.schema";

const router = Router();
router.<method>("<path>", authMiddleware, validate(<RequestSchema>), <ControllerMethod>);
export default router;
```

### 2. `backend/src/controllers/<resource>.controller.ts`
Thin controller — parse request, call service, return standard envelope:
```typescript
export const <ControllerMethod> = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await <ResourceService>.<serviceMethod>(req.query /* or req.body / req.params */);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
```

### 3. `backend/src/services/<resource>.service.ts`
Business logic + Prisma calls. Cache hot reads in Redis (TTL strategy from BACKEND_SKILLS.md).

## Conventions
- All endpoints live under `/api/v1/`
- Success envelope: `{ success: true, data, meta? }`
- Error envelope: `{ success: false, error: { code, message, details? } }`
- HTTP status codes: 200 GET, 201 POST, 204 DELETE, 400 bad input, 401 unauth, 403 forbidden, 404 not found, 409 conflict
- Use Zod schemas in `backend/src/models/` for request validation
- Soft deletes only — never hard-delete (use `deletedAt` timestamp)
- Add correlation ID (`x-request-id`) to Winston log calls
- Geospatial queries use PostGIS via Prisma `$queryRaw`
- Atomic operations (swap completion, booking state transitions) must use Prisma transactions

After scaffolding, show the user the exact curl/Insomnia snippet to test the new endpoint.

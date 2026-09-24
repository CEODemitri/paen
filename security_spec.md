# Security Specification & Test Scenarios

## Data Invariants
1. Articles can only be created, modified, or deleted by authorized Admins or approved Authors.
2. Video broadcasts can only be created, updated, or deleted by authorized Admins.
3. Comments can be created by authenticated users or readers; users can only delete or edit their own comments unless an Admin override is performed.
4. User role elevation (e.g. self-assigning 'admin' or 'author') is strictly forbidden.
5. All document IDs must conform to alphanumeric constraints and safe length limits (<= 128 characters).

## The Dirty Dozen Payloads (Rejection Matrix)
1. **Unauthenticated Article Creation**: Anonymous user attempting to write an article into `/articles/art-hacked`. -> `PERMISSION_DENIED`
2. **Author Escalation to Admin**: Non-admin user attempting to change their own role in `/users/{userId}` to `admin`. -> `PERMISSION_DENIED`
3. **Ghost Field Injection**: Attempting to inject `__proto__` or `isSuperAdmin: true` into article payload. -> `PERMISSION_DENIED`
4. **ID Traversal Poisoning**: Attempting to create a document with ID `../../secrets/key`. -> `PERMISSION_DENIED`
5. **Video Broadcast Alteration by Non-Admin**: Non-admin user attempting to overwrite video stream URL in `/videos/{id}`. -> `PERMISSION_DENIED`
6. **Massive Payload Buffer Overflow**: Article content with >50,000 characters or invalid data types. -> `PERMISSION_DENIED`
7. **Foreign Comment Deletion**: User attempting to delete another user's comment without admin privileges. -> `PERMISSION_DENIED`
8. **Admin Collection Self-Registration**: Non-admin attempting to create a document in `/admins/{uid}`. -> `PERMISSION_DENIED`
9. **Fake Author Spoofing**: Author creating an article with another user's `authorId`. -> `PERMISSION_DENIED`
10. **Unbounded Array Injection**: Sending an array with thousands of junk tags. -> `PERMISSION_DENIED`
11. **Client Timestamp Manipulation**: Attempting to forge immutable creation dates during updates. -> `PERMISSION_DENIED`
12. **PII Query Scrape**: Attempting blanket listing of user database without ownership verification. -> `PERMISSION_DENIED`

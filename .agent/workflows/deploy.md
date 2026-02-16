---
description: Push code to GitHub and deploy
---

# Deploy Workflow

## Steps

1. Check git status to see modified files
   // turbo
2. Run `pnpm run lint` to check for lint errors
   // turbo
3. Run `pnpm run test:int` to run integration tests
4. Stage all changes with `git add .`
5. Commit with a descriptive message using conventional commits format (e.g. `feat:`, `fix:`, `chore:`)
6. Push to GitHub with `git push`
7. Confirm push was successful by checking `git log --oneline -1`

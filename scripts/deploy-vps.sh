#!/usr/bin/env bash
# Deploy creditax-ai to the Oracle VPS (creditax.missionctrl.com.ng).
# Local history carries ~200MB of non-app blobs (superscale/, demo shots),
# so deploys push a single orphan snapshot commit of the CURRENT tree (~60MB)
# instead of the full history. The VPS post-receive hook does the rest:
# rsync → npm ci → build → pm2 restart (PORT=3003).
set -euo pipefail
KEY="$HOME/Desktop/dev/ssh-key-2026-09-13.key"

npx tsc --noEmit
npm run build > /dev/null

TREE=$(git rev-parse HEAD^{tree})
NEW=$(git commit-tree "$TREE" -m "creditax-ai deploy snapshot $(date +%F-%T)")
echo "pushing deploy snapshot $NEW ..."
GIT_SSH_COMMAND="ssh -i $KEY -o ServerAliveInterval=30" \
  git push -f vps "$NEW":refs/heads/master
echo "Deploy finished — https://creditax.missionctrl.com.ng"

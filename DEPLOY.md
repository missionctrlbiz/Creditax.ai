# Deploy pipeline

- **Push target:** `ssh://opc@84.12.111.102/opt/git/creditax.git` branch `master`
- **Hook:** post-receive — rsync (excludes .next / node_modules / .env / research / progress) → npm ci → next build → pm2 restart creditax
- **Safety:** .env and node_modules are never touched; on build failure the previous .next is restored and reloaded (hardened 2026-10-04, post-receive.bak-20261004)
- **Deploy log:** /tmp/creditax-deploy.log
- **Domains:** creditax.missionctrl.com.ng (live) · creditax.ai + www.creditax.ai (pre-wired in Caddy, pending DNS)

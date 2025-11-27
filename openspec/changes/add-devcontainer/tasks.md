## 1. Devcontainer Configuration

- [x] 1.1 Create `.devcontainer/devcontainer.json` with container settings
  - Base image, features (Node.js, Bun, Claude Code)
  - Volume mounts for Claude credentials
  - VS Code extensions (Claude Code extension)
  - Post-create command to run `bun install`
- [x] 1.2 Create `.devcontainer/Dockerfile` with base image and tools
- [x] 1.3 Create `.devcontainer/init-firewall.sh` with network isolation rules
- [x] 1.4 Add `.devcontainer/` to `.dockerignore` (prevent nesting in builds)

## 2. Documentation

- [x] 2.1 Create `README.md` with minimal quickstart section for devcontainer
- [x] 2.2 Update `CLAUDE.md` with YOLO mode workflow documentation
  - When to use devcontainer
  - How to add domains to whitelist
  - Credential persistence

## 3. Verification

- [ ] 3.1 Test container builds successfully
- [ ] 3.2 Test `bun install` and `bun dev` work inside container
- [ ] 3.3 Test Claude Code authentication persists between sessions
- [ ] 3.4 Test network isolation blocks non-whitelisted domains
- [ ] 3.5 Test `--dangerously-skip-permissions` flag works safely

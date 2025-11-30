# Change: Add Development Container for Safe YOLO Mode

## Why

Claude Code's `--dangerously-skip-permissions` flag enables fully autonomous AI coding without permission prompts. However, running this on a host machine is risky—Claude could accidentally delete files, run dangerous commands, or be exploited via prompt injection. A development container provides isolation so developers can safely use "YOLO mode" for maximum productivity.

## What Changes

- **Devcontainer Configuration**: `.devcontainer/` with Anthropic's reference setup customized for Bun/Next.js
- **Network Isolation**: Firewall rules restricting outbound connections to essential services only
- **Auto-detection**: VS Code automatically prompts to reopen in container when project is opened
- **Documentation**: README section + CLAUDE.md workflow documentation

## Impact

- Affected specs: New capability (development-container)
- Affected code:
  - `.devcontainer/devcontainer.json` - Container settings and features
  - `.devcontainer/Dockerfile` - Base image with Bun
  - `.devcontainer/init-firewall.sh` - Network isolation rules
  - `README.md` - Simple usage section
  - `CLAUDE.md` - YOLO mode workflow documentation

## Security Model

The container provides three layers of protection:

1. **Filesystem Isolation**: Only the project directory is mounted; host system is protected
2. **Network Isolation**: Default-deny firewall, only whitelisted domains allowed
3. **Credential Isolation**: Claude credentials mounted read-only from host

This enables `--dangerously-skip-permissions` to be used safely for unattended, autonomous coding sessions.

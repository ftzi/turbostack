## Context

Developers want to use Claude Code's `--dangerously-skip-permissions` flag for autonomous coding without risking their host system. The official Anthropic devcontainer provides a reference implementation with network isolation.

**Stakeholders**: Developers using Claude Code for autonomous coding sessions

**Constraints**:
- Must work with VS Code Dev Containers extension
- Must support Bun 1.3.1+ and Node.js 20+
- Must isolate network to prevent data exfiltration
- Must persist Claude authentication between sessions

## Goals / Non-Goals

**Goals:**
- Provide one-click setup for safe YOLO mode
- Network isolation with default-deny firewall
- Zero-friction developer experience (VS Code auto-prompts)
- Support full Turbostack workflow (Bun, Next.js, database connections)

**Non-Goals:**
- GitHub Codespaces optimization (future enhancement)
- CI/CD container usage
- Production deployment containers
- Supporting non-VS Code editors (works but not optimized)

## Decisions

### 1. Base Image

**Decision**: Use `mcr.microsoft.com/devcontainers/base:ubuntu` with Node.js and Bun features

**Rationale**: Official devcontainer base image with good defaults. Adding Bun via feature keeps Dockerfile simple.

**Alternatives considered**:
- `oven/bun` image: Lacks devcontainer tooling
- Custom Dockerfile from scratch: More maintenance burden

### 2. Network Whitelist

**Decision**: Allow only essential domains:

| Domain | Purpose |
|--------|---------|
| `api.anthropic.com` | Claude API |
| `statsig.anthropic.com` | Claude telemetry |
| `sentry.io` | Error reporting |
| `github.com` | Git operations |
| `*.githubusercontent.com` | GitHub raw content, releases |
| `registry.npmjs.org` | npm packages |
| `bun.sh` | Bun binary downloads |

**Rationale**: Minimal attack surface. These domains are required for normal development workflow.

**Not included**:
- `vercel.com` - Can add if needed, but not required for local dev
- Arbitrary internet access - Security risk

### 3. Credential Mounting

**Decision**: Mount `~/.claude` as read-only volume

**Rationale**: Persists authentication without requiring re-login. Read-only prevents container from modifying host credentials.

### 4. VS Code Auto-detection

**Decision**: Rely on VS Code's built-in devcontainer detection

**Rationale**: When user opens project, VS Code shows toast: "Folder contains a Dev Container configuration. Reopen folder to develop in a container." This is the simplest possible UX—no scripts or prompts needed.

### 5. README Simplicity

**Decision**: Minimal README section with 3-step quickstart

**Format**:
```markdown
## Safe YOLO Mode (Devcontainer)

1. Open project in VS Code
2. Click "Reopen in Container" when prompted
3. Run `claude --dangerously-skip-permissions`
```

**Rationale**: Most users just need to know it exists and how to use it. Link to full docs for details.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Container build time on first use (~2-5 min) | Pre-pull base image, use layer caching |
| Database connections may need configuration | Document in README, provide env var example |
| Network restrictions may block legitimate services | Document how to add domains to whitelist |
| Users may forget they're in container | VS Code shows "[Dev Container]" in title bar |

## Open Questions

1. **Database access**: Should we whitelist Neon's domains by default, or require manual configuration?
   - **Recommendation**: Don't whitelist by default; document how to add if needed. Most users will use local database or DATABASE_URL from .env.

2. **MCP servers**: Should external MCP servers work in the container?
   - **Recommendation**: Local MCP servers (file-based) work. Remote MCP servers need domain whitelisting.

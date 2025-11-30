# development-container Specification

## Purpose
TBD - created by archiving change add-devcontainer. Update Purpose after archive.
## Requirements
### Requirement: Development Container Configuration

The project SHALL provide a devcontainer configuration for safe isolated development.

#### Scenario: VS Code detects devcontainer
- **WHEN** a developer opens the project in VS Code
- **THEN** VS Code detects the `.devcontainer/` configuration
- **AND** prompts to "Reopen in Container"

#### Scenario: Container builds successfully
- **WHEN** developer chooses to reopen in container
- **THEN** the container builds with Node.js 20+, Bun 1.3.1+, and Claude Code CLI
- **AND** `bun install` runs automatically after container creation

### Requirement: Network Isolation

The devcontainer SHALL implement network isolation with a default-deny firewall policy.

#### Scenario: Whitelisted domains are accessible
- **WHEN** code inside the container makes requests to whitelisted domains
- **THEN** the requests succeed
- **AND** whitelisted domains include: Claude API, GitHub, npm registry, Bun registry

#### Scenario: Non-whitelisted domains are blocked
- **WHEN** code inside the container attempts to access a non-whitelisted domain
- **THEN** the connection is blocked by the firewall
- **AND** this prevents data exfiltration to arbitrary servers

### Requirement: Credential Persistence

The devcontainer SHALL persist Claude Code authentication between sessions.

#### Scenario: Claude authentication persists
- **WHEN** developer authenticates Claude Code inside the container
- **AND** later rebuilds or reopens the container
- **THEN** authentication is preserved
- **AND** developer does not need to re-authenticate

### Requirement: Safe YOLO Mode

The devcontainer SHALL enable safe usage of Claude Code's `--dangerously-skip-permissions` flag.

#### Scenario: YOLO mode runs safely
- **WHEN** developer runs `claude --dangerously-skip-permissions` inside the container
- **THEN** Claude Code operates without permission prompts
- **AND** the host filesystem outside the project is protected
- **AND** network access is restricted to whitelisted domains

#### Scenario: Host system is protected
- **WHEN** Claude Code attempts destructive operations in YOLO mode
- **THEN** only the mounted project directory can be affected
- **AND** the host system remains unaffected


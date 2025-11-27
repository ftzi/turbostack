#!/bin/bash
# Network isolation firewall for safe Claude Code YOLO mode
# Reference: https://code.claude.com/docs/en/devcontainer

set -e

# Skip if not running as root (firewall setup requires sudo)
if [ "$(id -u)" -ne 0 ]; then
    echo "Skipping firewall setup (requires root). Run with sudo for network isolation."
    exit 0
fi

echo "Setting up network isolation firewall..."

# Flush existing rules
iptables -F OUTPUT

# Allow loopback
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established connections
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow DNS
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 53 -j ACCEPT

# Whitelist: Claude API
iptables -A OUTPUT -d api.anthropic.com -j ACCEPT
iptables -A OUTPUT -d statsig.anthropic.com -j ACCEPT

# Whitelist: Error reporting
iptables -A OUTPUT -d sentry.io -j ACCEPT

# Whitelist: GitHub (git operations, releases)
iptables -A OUTPUT -d github.com -j ACCEPT
iptables -A OUTPUT -d raw.githubusercontent.com -j ACCEPT
iptables -A OUTPUT -d objects.githubusercontent.com -j ACCEPT
iptables -A OUTPUT -d codeload.github.com -j ACCEPT

# Whitelist: npm registry
iptables -A OUTPUT -d registry.npmjs.org -j ACCEPT

# Whitelist: Bun
iptables -A OUTPUT -d bun.sh -j ACCEPT

# Default deny all other outbound traffic
iptables -A OUTPUT -j DROP

echo "Firewall configured. Allowed domains:"
echo "  - api.anthropic.com (Claude API)"
echo "  - statsig.anthropic.com (telemetry)"
echo "  - sentry.io (error reporting)"
echo "  - github.com, *.githubusercontent.com (git)"
echo "  - registry.npmjs.org (npm)"
echo "  - bun.sh (Bun)"
echo ""
echo "To add more domains, edit .devcontainer/init-firewall.sh"

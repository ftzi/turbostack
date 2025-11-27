FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/home/vscode/.bun/bin:${PATH}"

# Install iptables for firewall rules
RUN apt-get update && apt-get install -y iptables && rm -rf /var/lib/apt/lists/*

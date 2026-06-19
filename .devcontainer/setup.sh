#!/bin/bash
set -e

echo "=== Fortress Finance Dev Container Setup ==="

# Ensure pnpm is in PATH
export PNPM_HOME="/home/node/.pnpm"
export PATH="$PNPM_HOME:$PATH"

# Verify pnpm version
echo "pnpm version: $(pnpm --version)"

# Verify Node version
echo "Node version: $(node --version)"

# Install dependencies with frozen lockfile for reproducibility
echo "Installing dependencies..."
pnpm install --frozen-lockfile

# Build workspace packages
echo "Building workspace packages..."
pnpm run build

echo "=== Setup Complete ==="
echo "Available commands:"
echo "  pnpm dev     - Start development servers"
echo "  pnpm build   - Build all packages"
echo "  pnpm lint    - Run linters"
echo "  pnpm clean   - Clean all caches and node_modules"

#!/bin/bash

# Checkmate Bootstrap Script
# This script downloads and runs the main installation script

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║                                           ║"
echo "║     Checkmate Installer Bootstrapper      ║"
echo "║                                           ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}\n"

echo -e "${BLUE}ℹ️  Downloading installation script...${NC}\n"

# Download the install script
INSTALL_SCRIPT_URL="https://raw.githubusercontent.com/ds-horizon/checkmate/master/install.sh"

if command -v curl &> /dev/null; then
    curl -fsSL "$INSTALL_SCRIPT_URL" -o /tmp/checkmate-install.sh
elif command -v wget &> /dev/null; then
    wget -q "$INSTALL_SCRIPT_URL" -O /tmp/checkmate-install.sh
else
    echo -e "${RED}❌ Error: Neither curl nor wget is available. Please install one of them.${NC}"
    exit 1
fi

# Make it executable
chmod +x /tmp/checkmate-install.sh

echo -e "${GREEN}✅ Installation script downloaded${NC}\n"

# Run the installer
echo -e "${BLUE}ℹ️  Starting installation...${NC}\n"
bash /tmp/checkmate-install.sh

# Cleanup
rm -f /tmp/checkmate-install.sh

echo -e "\n${GREEN}✅ Bootstrap complete!${NC}"


#!/bin/bash

# Checkmate MCP Server Setup Script
# This script helps you quickly set up the MCP server

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Symbols
CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"
INFO="${BLUE}ℹ${NC}"
WARN="${YELLOW}⚠${NC}"

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║   Checkmate MCP Server Setup Script      ║"
echo "╔═══════════════════════════════════════════╝"
echo -e "${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${CROSS} Error: package.json not found"
    echo -e "${INFO} Please run this script from the mcp-server directory"
    exit 1
fi

# Check Node.js version
echo -e "${INFO} Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${CROSS} Node.js version must be 18 or higher"
    echo -e "${INFO} Current version: $(node -v)"
    exit 1
fi
echo -e "${CHECK} Node.js version: $(node -v)"

# Install dependencies
echo ""
echo -e "${INFO} Installing dependencies..."
if npm install; then
    echo -e "${CHECK} Dependencies installed successfully"
else
    echo -e "${CROSS} Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
echo ""
if [ ! -f ".env" ]; then
    echo -e "${INFO} Creating .env file from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${CHECK} .env file created"
        echo ""
        echo -e "${WARN} IMPORTANT: Please edit .env file with your configuration:"
        echo -e "   - CHECKMATE_API_BASE (your Checkmate instance URL)"
        echo -e "   - CHECKMATE_API_TOKEN (your API token)"
    else
        echo -e "${CROSS} .env.example not found"
        exit 1
    fi
else
    echo -e "${CHECK} .env file already exists"
fi

# Prompt for configuration
echo ""
read -p "Would you like to configure the .env file now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${INFO} Please enter your Checkmate configuration:"
    echo ""
    
    # API Base URL
    read -p "Checkmate API Base URL (e.g., http://localhost:3000): " API_BASE
    if [ -n "$API_BASE" ]; then
        sed -i.bak "s|CHECKMATE_API_BASE=.*|CHECKMATE_API_BASE=$API_BASE|" .env && rm .env.bak
        echo -e "${CHECK} API Base URL configured"
    fi
    
    # API Token
    read -p "Checkmate API Token: " API_TOKEN
    if [ -n "$API_TOKEN" ]; then
        sed -i.bak "s|CHECKMATE_API_TOKEN=.*|CHECKMATE_API_TOKEN=$API_TOKEN|" .env && rm .env.bak
        echo -e "${CHECK} API Token configured"
    fi
    
    # Log Level
    echo ""
    echo "Log Level (error/warn/info/debug) [default: info]:"
    read -p "> " LOG_LEVEL
    if [ -n "$LOG_LEVEL" ]; then
        echo "LOG_LEVEL=$LOG_LEVEL" >> .env
        echo -e "${CHECK} Log level configured"
    fi
fi

# Build the server
echo ""
echo -e "${INFO} Building the MCP server..."
if npm run build; then
    echo -e "${CHECK} Build successful"
else
    echo -e "${CROSS} Build failed"
    exit 1
fi

# Run tests
echo ""
read -p "Would you like to run tests? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${INFO} Running tests..."
    if npm test; then
        echo -e "${CHECK} All tests passed"
    else
        echo -e "${WARN} Some tests failed"
    fi
fi

# Success message
echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════╗"
echo "║   Setup Complete! 🎉                      ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${INFO} Next steps:"
echo ""
echo "1. Configure Claude Desktop:"
echo "   - macOS: ~/Library/Application Support/Claude/claude_desktop_config.json"
echo "   - Windows: %APPDATA%\\Claude\\claude_desktop_config.json"
echo "   - Linux: ~/.config/Claude/claude_desktop_config.json"
echo ""
echo "2. Add this configuration:"
echo ""
echo -e "${BLUE}"
cat << 'EOF'
{
  "mcpServers": {
    "checkmate": {
      "command": "node",
      "args": ["PATH_TO/checkmate/mcp-server/build/index.js"],
      "env": {
        "CHECKMATE_API_BASE": "http://localhost:3000",
        "CHECKMATE_API_TOKEN": "your-api-token"
      }
    }
  }
}
EOF
echo -e "${NC}"
echo ""
echo "3. Restart Claude Desktop"
echo ""
echo -e "${INFO} For more information, see README.md"
echo ""
echo -e "${CHECK} Happy testing with Checkmate! 🚀"
echo ""


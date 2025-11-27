#!/bin/bash

# Checkmate Docker Setup Script
# This script helps you quickly set up Checkmate with Docker including the MCP server

set -e  # Exit on error

# Colors
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
echo "║   Checkmate Docker Setup Script          ║"
echo "║   (Main App + MCP Server)                 ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${CROSS} Docker is not installed"
    echo -e "${INFO} Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi
echo -e "${CHECK} Docker is installed: $(docker --version)"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${CROSS} Docker Compose is not installed"
    echo -e "${INFO} Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi
echo -e "${CHECK} Docker Compose is installed: $(docker-compose --version)"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${CROSS} docker-compose.yml not found"
    echo -e "${INFO} Please run this script from the Checkmate root directory"
    exit 1
fi

# Setup main app .env
echo ""
echo -e "${INFO} Setting up main application environment..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${CHECK} Created .env file from template"
    else
        echo -e "${WARN} .env.example not found"
    fi
else
    echo -e "${CHECK} .env file already exists"
fi

# Setup MCP server .env
echo ""
echo -e "${INFO} Setting up MCP server environment..."
if [ ! -f "mcp-server/.env" ]; then
    if [ -f "mcp-server/.env.example" ]; then
        cp mcp-server/.env.example mcp-server/.env
        # Set Docker-specific defaults
        sed -i.bak "s|CHECKMATE_API_BASE=.*|CHECKMATE_API_BASE=http://checkmate-app:3000|" mcp-server/.env && rm mcp-server/.env.bak
        echo -e "${CHECK} Created mcp-server/.env file"
        echo -e "${INFO} API Base set to: http://checkmate-app:3000 (Docker internal network)"
    else
        echo -e "${WARN} mcp-server/.env.example not found"
    fi
else
    echo -e "${CHECK} mcp-server/.env file already exists"
fi

# Prompt for configuration
echo ""
read -p "Would you like to configure the environment now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${INFO} Please configure your .env files:"
    echo -e "  1. Edit .env with your main app configuration"
    echo -e "  2. Edit mcp-server/.env with your API token"
    echo ""
    read -p "Press Enter to continue when ready..."
fi

# Ask about building
echo ""
read -p "Would you like to build and start all services now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${INFO} Building Docker images..."
    docker-compose build
    
    echo ""
    echo -e "${INFO} Starting services..."
    docker-compose up -d
    
    echo ""
    echo -e "${INFO} Waiting for services to be healthy..."
    sleep 10
    
    echo ""
    echo -e "${INFO} Service status:"
    docker-compose ps
    
    echo ""
    echo -e "${CHECK} Services started!"
    echo ""
    echo -e "${INFO} Access points:"
    echo -e "  - Checkmate App: http://localhost:3000"
    echo -e "  - Database: localhost:3306"
    echo ""
    echo -e "${INFO} Useful commands:"
    echo -e "  - View logs: ${BLUE}docker-compose logs -f${NC}"
    echo -e "  - Stop services: ${BLUE}docker-compose down${NC}"
    echo -e "  - Restart services: ${BLUE}docker-compose restart${NC}"
    echo -e "  - MCP logs: ${BLUE}docker-compose logs -f checkmate-mcp${NC}"
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
echo "1. Access Checkmate at http://localhost:3000"
echo "2. Configure Claude Desktop to use the MCP server"
echo "   (see mcp-server/README.md for instructions)"
echo "3. Check service health:"
echo "   ${BLUE}docker-compose ps${NC}"
echo ""
echo -e "${INFO} For more information:"
echo "  - Main README: ./README.md"
echo "  - MCP Server README: ./mcp-server/README.md"
echo "  - Docker Guide: ./mcp-server/DOCKER.md"
echo ""
echo -e "${CHECK} Happy testing with Checkmate! 🚀"
echo ""


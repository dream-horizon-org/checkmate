#!/bin/bash

# Checkmate Installation Script
# This script checks for prerequisites and installs Checkmate

# Note: Not using 'set -e' to allow graceful error handling
# We'll handle errors explicitly where needed

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            DISTRO=$ID
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    else
        OS="unknown"
    fi
    print_info "Detected OS: $OS"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Homebrew (macOS)
install_homebrew() {
    if [[ "$OS" == "macos" ]]; then
        if ! command_exists brew; then
            print_info "Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            print_success "Homebrew installed successfully"
        else
            print_success "Homebrew is already installed"
        fi
    fi
}

# Function to check and install Git
check_install_git() {
    print_header "Checking Git"
    if command_exists git; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        print_success "Git is installed (version $GIT_VERSION)"
    else
        print_warning "Git is not installed. Installing..."
        if [[ "$OS" == "macos" ]]; then
            brew install git
        elif [[ "$OS" == "linux" ]]; then
            if [[ "$DISTRO" == "ubuntu" ]] || [[ "$DISTRO" == "debian" ]]; then
                sudo apt-get update && sudo apt-get install -y git
            elif [[ "$DISTRO" == "fedora" ]] || [[ "$DISTRO" == "rhel" ]] || [[ "$DISTRO" == "centos" ]]; then
                sudo yum install -y git
            fi
        fi
        print_success "Git installed successfully"
    fi
}

# Function to check and install nvm
check_install_nvm() {
    print_header "Checking nvm (Node Version Manager)"
    
    # Check if nvm is already loaded in the current shell
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        # Source nvm if it exists but isn't loaded
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
    
    if command_exists nvm || [ -s "$HOME/.nvm/nvm.sh" ]; then
        print_success "nvm is installed"
        # Ensure nvm is loaded
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        return 0
    else
        print_warning "nvm is not installed. Installing..."
        install_nvm
    fi
}

# Function to install nvm
install_nvm() {
    print_info "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Load nvm in current shell
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Also add to shell profile for future sessions
    if [ -f "$HOME/.zshrc" ]; then
        if ! grep -q "NVM_DIR" "$HOME/.zshrc"; then
            echo '' >> "$HOME/.zshrc"
            echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.zshrc"
            echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$HOME/.zshrc"
        fi
    elif [ -f "$HOME/.bashrc" ]; then
        if ! grep -q "NVM_DIR" "$HOME/.bashrc"; then
            echo '' >> "$HOME/.bashrc"
            echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.bashrc"
            echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$HOME/.bashrc"
        fi
    fi
    
    print_success "nvm installed successfully"
}

# Function to check and install Node.js using nvm
check_install_node() {
    print_header "Checking Node.js"
    
    # Ensure nvm is loaded
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Default to Node 20 if .nvmrc doesn't exist (we'll check .nvmrc later after repo is cloned)
    REQUIRED_NODE_VERSION="20"
    print_info "Installing Node.js 20.x (will use .nvmrc version after repository setup)"
    
    # Check if Node 20 is installed via nvm
    # nvm list outputs versions, so we check if version 20 appears in the output
    if nvm list | grep -E "v20\." >/dev/null 2>&1; then
        print_success "Node.js 20.x is installed via nvm"
        nvm use 20 >/dev/null 2>&1
    elif command_exists node; then
        CURRENT_VERSION=$(node --version | cut -d'v' -f2)
        print_warning "Node.js is installed (version $CURRENT_VERSION) but not via nvm"
        print_info "Installing Node.js 20.x via nvm..."
        install_nodejs "20"
    else
        print_warning "Node.js is not installed. Installing via nvm..."
        install_nodejs "20"
    fi
}

# Function to install Node.js using nvm
install_nodejs() {
    local version=$1
    if [ -z "$version" ]; then
        version="20"
    fi
    
    # Ensure nvm is loaded
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    print_info "Installing Node.js $version via nvm..."
    nvm install "$version"
    
    if [ $? -eq 0 ]; then
        nvm use "$version"
        print_success "Node.js $version installed and activated successfully"
    else
        print_error "Failed to install Node.js via nvm"
        exit 1
    fi
}

# Function to check and install Yarn
check_install_yarn() {
    print_header "Checking Yarn"
    if command_exists yarn; then
        YARN_VERSION=$(yarn --version)
        print_success "Yarn is installed (version $YARN_VERSION)"
    else
        print_warning "Yarn is not installed. Installing..."
        if [[ "$OS" == "macos" ]]; then
            brew install yarn
        elif [[ "$OS" == "linux" ]]; then
            npm install -g yarn
        fi
        print_success "Yarn installed successfully"
    fi
}

# Function to check and install Docker
check_install_docker() {
    print_header "Checking Docker"
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1 2>/dev/null || echo "unknown")
        print_success "Docker is installed (version $DOCKER_VERSION)"
        
        # Check if Docker daemon is running
        if ! docker info >/dev/null 2>&1; then
            print_error "Docker is installed but not running."
            print_warning "Please start Docker Desktop before continuing."
            echo ""
            read -p "Press Enter after starting Docker, or Ctrl+C to exit..."
            
            # Check again after user presses Enter
            if ! docker info >/dev/null 2>&1; then
                print_error "Docker is still not running. Please start Docker Desktop."
                exit 1
            else
                print_success "Docker is now running!"
            fi
        fi
    else
        print_warning "Docker is not installed."
        if [[ "$OS" == "macos" ]]; then
            print_info "Docker Desktop needs to be installed manually on macOS."
            print_info "Download from: https://www.docker.com/products/docker-desktop/"
            echo ""
            read -p "Would you like to open the download page now? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                open "https://www.docker.com/products/docker-desktop/"
                print_success "Opened Docker Desktop download page"
            fi
            echo ""
            print_error "Please install Docker Desktop, start it, and run this script again."
            exit 1
        elif [[ "$OS" == "linux" ]]; then
            print_info "Installing Docker..."
            curl -fsSL https://get.docker.com -o get-docker.sh
            sudo sh get-docker.sh
            sudo usermod -aG docker $USER
            rm get-docker.sh
            print_success "Docker installed successfully"
            print_warning "You may need to log out and log back in for Docker permissions to take effect."
            print_info "Then run: sudo systemctl start docker"
        fi
    fi
}

# Function to clone or verify repository
setup_repository() {
    print_header "Setting up Checkmate Repository"
    
    # If we're already in the checkmate directory, skip cloning
    if [ -f "package.json" ] && grep -q "checkmate" package.json 2>/dev/null; then
        print_success "Already in Checkmate repository directory"
        REPO_DIR=$(pwd)
    else
        print_info "Cloning Checkmate repository..."
        if [ -d "checkmate" ]; then
            print_warning "Directory 'checkmate' already exists. Using existing directory..."
            REPO_DIR="$(pwd)/checkmate"
            if [ ! -f "$REPO_DIR/package.json" ]; then
                print_error "Directory 'checkmate' exists but doesn't appear to be a valid repository."
                print_info "Please remove it and run this script again."
                exit 1
            fi
        else
            # Try SSH first, fallback to HTTPS if SSH fails
            print_info "Attempting to clone via SSH..."
            if git clone git@github.com:ds-horizon/checkmate.git 2>/dev/null; then
                REPO_DIR="$(pwd)/checkmate"
                print_success "Repository cloned successfully via SSH"
            else
                print_warning "SSH clone failed, trying HTTPS..."
                if git clone https://github.com/ds-horizon/checkmate.git 2>/dev/null; then
                    REPO_DIR="$(pwd)/checkmate"
                    print_success "Repository cloned successfully via HTTPS"
                else
                    print_error "Failed to clone repository. Please check your internet connection and try again."
                    exit 1
                fi
            fi
            
            # Verify the clone was successful
            if [ ! -d "$REPO_DIR" ] || [ ! -f "$REPO_DIR/package.json" ]; then
                print_error "Repository clone appears to have failed. Directory structure is invalid."
                exit 1
            fi
        fi
    fi
    
    # Verify REPO_DIR is set and valid
    if [ -z "$REPO_DIR" ] || [ ! -d "$REPO_DIR" ]; then
        print_error "Repository directory is not set or invalid."
        exit 1
    fi
}

# Function to generate random session secret
generate_session_secret() {
    if command_exists openssl; then
        openssl rand -base64 32 2>/dev/null || echo "$(date +%s)$(echo $RANDOM | base64 | head -c 32)"
    else
        # Fallback to using date and random
        if command_exists md5sum; then
            echo "$(date +%s)-$(echo $RANDOM | md5sum | head -c 32)" 2>/dev/null
        else
            # Fallback for systems without md5sum (like macOS)
            echo "$(date +%s)$(echo $RANDOM | base64 | head -c 32)"
        fi
    fi
}

# Function to show OAuth setup instructions
show_oauth_instructions() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  🔐 Google OAuth Configuration${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}  Google OAuth is required for authentication in Checkmate${NC}"
    echo ""
    echo -e "  ${BLUE}📝 After installation, edit the .env file and add:${NC}"
    echo ""
    echo -e "     ${GREEN}GOOGLE_CLIENT_ID${NC}=your_google_client_id_here"
    echo -e "     ${GREEN}GOOGLE_CLIENT_SECRET${NC}=your_google_client_secret_here"
    echo ""
    echo -e "  ${BLUE}📖 Setup Guide:${NC}"
    echo -e "     ${BLUE}https://checkmate.dreamsportslabs.com/docs/project/setup#google-oauth-setup${NC}"
    echo ""
    echo -e "  ${BLUE}🔗 Google Cloud Console:${NC}"
    echo -e "     ${BLUE}https://console.cloud.google.com/apis/credentials${NC}"
    echo ""
    echo -e "  ${BLUE}⚡ Quick Steps:${NC}"
    echo -e "     ${GREEN}1.${NC} Visit Google Cloud Console (link above)"
    echo -e "     ${GREEN}2.${NC} Create OAuth 2.0 Client ID"
    echo -e "     ${GREEN}3.${NC} Set Authorized JavaScript origins: ${BLUE}http://localhost:3000${NC}"
    echo -e "     ${GREEN}4.${NC} Set Authorized redirect URIs: ${BLUE}http://localhost:3000/callback${NC}"
    echo -e "     ${GREEN}5.${NC} Copy Client ID and Secret to .env file"
    echo ""
}

# Function to setup environment file
setup_env_file() {
    print_header "Setting up Environment File"
    
    # Verify REPO_DIR is set before using it
    if [ -z "$REPO_DIR" ] || [ ! -d "$REPO_DIR" ]; then
        print_error "Repository directory is not set or invalid. Cannot setup environment file."
        exit 1
    fi
    
    cd "$REPO_DIR" || {
        print_error "Failed to change to repository directory: $REPO_DIR"
        exit 1
    }
    
    if [ -f ".env" ]; then
        print_warning ".env file already exists. Skipping creation."
        print_info "If you need to reconfigure, edit .env manually or delete it and run this script again."
        return
    fi
    
    if [ ! -f ".env.example" ]; then
        print_error ".env.example file not found in $(pwd)"
        print_error "This file should exist in the Checkmate repository."
        print_info "Please ensure you're in the correct directory or the repository is not corrupted."
        exit 1
    fi
    
    # Copy .env.example to .env
    cp .env.example .env
    print_success ".env file created from .env.example"
    
    # Generate and set session secret automatically
    print_info "Generating secure session secret..."
    SESSION_SECRET=$(generate_session_secret)
    
    # Update or add SESSION_SECRET in .env file
    if grep -q "^SESSION_SECRET=" .env 2>/dev/null; then
        # Update existing SESSION_SECRET
        if [[ "$OS" == "macos" ]]; then
            sed -i '' "s|SESSION_SECRET=.*|SESSION_SECRET=$SESSION_SECRET|g" .env 2>/dev/null || true
        else
            sed -i "s|SESSION_SECRET=.*|SESSION_SECRET=$SESSION_SECRET|g" .env 2>/dev/null || true
        fi
    else
        # Add SESSION_SECRET if it doesn't exist
        echo "" >> .env
        echo "# Session secret for authentication" >> .env
        echo "SESSION_SECRET=$SESSION_SECRET" >> .env
    fi
    
    print_success "Session secret generated and configured"
    echo ""
    
    # Show OAuth instructions
    show_oauth_instructions
}

# Function to install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    # Verify REPO_DIR is set before using it
    if [ -z "$REPO_DIR" ] || [ ! -d "$REPO_DIR" ]; then
        print_error "Repository directory is not set or invalid. Cannot install dependencies."
        exit 1
    fi
    
    cd "$REPO_DIR" || {
        print_error "Failed to change to repository directory: $REPO_DIR"
        exit 1
    }
    
    print_info "Installing Node.js dependencies..."
    if yarn install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies. Please check the error messages above."
        exit 1
    fi
}

# Function to verify Docker setup (without starting containers)
verify_docker_setup() {
    print_header "Verifying Docker Configuration"
    
    # Verify REPO_DIR is set before using it
    if [ -z "$REPO_DIR" ] || [ ! -d "$REPO_DIR" ]; then
        print_error "Repository directory is not set or invalid. Cannot verify Docker setup."
        exit 1
    fi
    
    cd "$REPO_DIR" || {
        print_error "Failed to change to repository directory: $REPO_DIR"
        exit 1
    }
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found"
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    
    echo -e "  ${GREEN}✓${NC} Docker is running"
    echo -e "  ${GREEN}✓${NC} docker-compose.yml found"
    echo ""
    print_success "Docker configuration verified"
    print_info "Containers are prepared but not started"
    print_info "Start them manually when ready (see commands in final summary)"
}

# Main installation flow
main() {
    clear
    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                                                               ║"
    echo "║            Checkmate Installation Script                      ║"
    echo "║                                                               ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  Starting Checkmate installation...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Detect OS
    detect_os
    
    # Install Homebrew on macOS if needed
    if [[ "$OS" == "macos" ]]; then
        install_homebrew
    fi
    
    # Check and install prerequisites
    check_install_git
    check_install_nvm
    check_install_node
    check_install_yarn
    check_install_docker
    
    # Setup repository
    setup_repository
    
    # Setup environment file
    setup_env_file
    
    # Ensure correct Node version from .nvmrc is installed and active
    cd "$REPO_DIR" || {
        print_error "Failed to change to repository directory: $REPO_DIR"
        exit 1
    }
    
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    if [ -f ".nvmrc" ]; then
        print_header "Setting up Node.js version from .nvmrc"
        
        # Read version from .nvmrc (remove 'v' prefix if present, and trim whitespace)
        NVMRC_VERSION=$(cat .nvmrc | tr -d 'v' | tr -d '\n' | xargs)
        print_info "Found .nvmrc with Node.js version: $NVMRC_VERSION"
        
        # Check if this version is already installed
        # nvm list outputs versions, so we check if the version appears in the output
        if nvm list | grep -E "(v|^)$NVMRC_VERSION" >/dev/null 2>&1; then
            print_success "Node.js $NVMRC_VERSION is already installed"
        else
            print_info "Installing Node.js $NVMRC_VERSION via nvm..."
            nvm install "$NVMRC_VERSION"
            if [ $? -ne 0 ]; then
                print_error "Failed to install Node.js $NVMRC_VERSION"
                exit 1
            fi
        fi
        
        # Use the version from .nvmrc
        print_info "Switching to Node.js version from .nvmrc..."
        nvm use
        if [ $? -ne 0 ]; then
            print_error "Failed to switch to Node.js version from .nvmrc"
            exit 1
        fi
        
        ACTUAL_VERSION=$(node --version)
        print_success "Using Node.js $ACTUAL_VERSION (from .nvmrc)"
    else
        print_warning ".nvmrc file not found. Using default Node.js version."
    fi
    
    # Install dependencies
    install_dependencies
    
    # Verify Docker setup (without starting containers)
    echo ""
    verify_docker_setup
    
    # Final success message
    echo ""
    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                                                               ║"
    echo "║          🎉  Installation Complete!  🎉                       ║"
    echo "║                                                               ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  Installation Summary${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${GREEN}✓${NC} All prerequisites installed"
    echo -e "  ${GREEN}✓${NC} Repository cloned"
    echo -e "  ${GREEN}✓${NC} Environment file created"
    echo -e "  ${GREEN}✓${NC} Dependencies installed"
    echo -e "  ${GREEN}✓${NC} Docker configuration verified"
    echo ""
    
    # Show configuration status
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  ⚠️  Configuration Required${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}  Action Required: Configure Google OAuth${NC}"
    echo ""
    echo -e "  ${BLUE}📝 Edit the .env file:${NC}"
    echo -e "     ${BLUE}$REPO_DIR/.env${NC}"
    echo ""
    echo -e "  ${BLUE}➕ Add these variables:${NC}"
    echo ""
    echo -e "     ${GREEN}GOOGLE_CLIENT_ID${NC}=your_google_client_id"
    echo -e "     ${GREEN}GOOGLE_CLIENT_SECRET${NC}=your_google_client_secret"
    echo ""
    echo -e "  ${BLUE}📖 Setup Guide:${NC}"
    echo -e "     ${BLUE}https://checkmate.dreamsportslabs.com/docs/project/setup#google-oauth-setup${NC}"
    echo ""
    echo -e "  ${BLUE}🔗 Google Cloud Console:${NC}"
    echo -e "     ${BLUE}https://console.cloud.google.com/apis/credentials${NC}"
    echo ""
    
    # Show ports information
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  🌐 Service Ports${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${GREEN}✓${NC} ${BLUE}Checkmate Application${NC}"
    echo -e "     ${BLUE}http://localhost:3000${NC}"
    echo ""
    echo -e "  ${GREEN}✓${NC} ${BLUE}MySQL Database${NC}"
    echo -e "     ${BLUE}localhost:3306${NC}"
    echo ""
    echo -e "  ${GREEN}✓${NC} ${BLUE}Drizzle Studio${NC}"
    echo -e "     ${BLUE}http://localhost:4000${NC}"
    echo -e "     ${YELLOW}(run: yarn db:studio)${NC}"
    echo ""
    
    # Show Docker commands
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  🐳 Docker Commands${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${GREEN}▶  Start Services${NC}"
    echo -e "     ${BLUE}cd $REPO_DIR${NC}"
    echo -e "     ${BLUE}yarn docker:setup${NC}              ${YELLOW}# Start all services${NC}"
    echo -e "     ${BLUE}yarn docker:db:setup${NC}          ${YELLOW}# Start only database${NC}"
    echo ""
    echo -e "  ${RED}■  Stop Services${NC}"
    echo -e "     ${BLUE}cd $REPO_DIR${NC}"
    echo -e "     ${BLUE}docker-compose down${NC}           ${YELLOW}# Stop all containers${NC}"
    echo -e "     ${BLUE}docker-compose down -v${NC}        ${YELLOW}# Stop and remove volumes${NC}"
    echo ""
    echo -e "  ${BLUE}⚙  Manage Services${NC}"
    echo -e "     ${BLUE}docker-compose up -d${NC}           ${YELLOW}# Start in background${NC}"
    echo -e "     ${BLUE}docker-compose restart${NC}         ${YELLOW}# Restart containers${NC}"
    echo -e "     ${BLUE}docker-compose ps${NC}             ${YELLOW}# View status${NC}"
    echo -e "     ${BLUE}docker ps${NC}                      ${YELLOW}# View all containers${NC}"
    echo ""
    echo -e "  ${BLUE}📋 View Logs${NC}"
    echo -e "     ${BLUE}docker logs checkmate-app${NC}      ${YELLOW}# Application logs${NC}"
    echo -e "     ${BLUE}docker logs checkmate-db${NC}       ${YELLOW}# Database logs${NC}"
    echo -e "     ${BLUE}docker-compose logs -f${NC}         ${YELLOW}# Follow all logs${NC}"
    echo ""
    
    # Next steps
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  🚀 Next Steps${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${GREEN}1.${NC} Configure Google OAuth in .env file (see above)"
    echo ""
    echo -e "  ${GREEN}2.${NC} Start Docker containers when ready:"
    echo -e "     ${BLUE}cd $REPO_DIR${NC}"
    echo -e "     ${BLUE}yarn docker:setup${NC}"
    echo ""
    echo -e "  ${GREEN}3.${NC} Access Checkmate at:"
    echo -e "     ${BLUE}http://localhost:3000${NC}"
    echo ""
    echo -e "  ${GREEN}4.${NC} Sign in with your Google account"
    echo ""
    
    # Resources
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  📚 Resources${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${BLUE}📖${NC} Documentation:"
    echo -e "     ${BLUE}https://checkmate.dreamsportslabs.com${NC}"
    echo ""
    echo -e "  ${BLUE}💬${NC} Discord Community:"
    echo -e "     ${BLUE}https://discord.gg/wBQXeYAKNc${NC}"
    echo ""
    echo -e "  ${BLUE}🐙${NC} GitHub:"
    echo -e "     ${BLUE}https://github.com/ds-horizon/checkmate${NC}"
    echo ""
    
    # Security tip
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  💡 Security Tip${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  Your ${BLUE}.env${NC} file contains sensitive credentials."
    echo -e "  Keep it secure and ${RED}never commit it to version control${NC}!"
    echo ""
    echo ""
}

# Run main function
main


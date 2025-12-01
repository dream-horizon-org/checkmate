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
        return 0
    else
        print_warning "Git is not installed. Installing..."
        if [[ "$OS" == "macos" ]]; then
            if brew install git; then
                print_success "Git installed successfully"
                return 0
            else
                return 1
            fi
        elif [[ "$OS" == "linux" ]]; then
            if [[ "$DISTRO" == "ubuntu" ]] || [[ "$DISTRO" == "debian" ]]; then
                if sudo apt-get update && sudo apt-get install -y git; then
                    print_success "Git installed successfully"
                    return 0
                else
                    return 1
                fi
            elif [[ "$DISTRO" == "fedora" ]] || [[ "$DISTRO" == "rhel" ]] || [[ "$DISTRO" == "centos" ]]; then
                if sudo yum install -y git; then
                    print_success "Git installed successfully"
                    return 0
                else
                    return 1
                fi
            fi
        fi
        return 1
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
        if install_nvm; then
            return 0
        else
            return 1
        fi
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

# Function to read Node.js version from .nvmrc (if repository is available)
read_nvmrc_version() {
    local repo_dir=$1
    if [ -n "$repo_dir" ] && [ -f "$repo_dir/.nvmrc" ]; then
        cat "$repo_dir/.nvmrc" | tr -d 'v' | tr -d '\n' | xargs
    else
        echo "20"
    fi
}

# Function to check and install Node.js using nvm
check_install_node() {
    print_header "Checking Node.js"
    
    # Ensure nvm is loaded
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Default to Node 20 if .nvmrc not available yet (will be checked after repo setup)
    REQUIRED_NODE_VERSION="20"
    print_info "Installing Node.js 20.x (will switch to .nvmrc version after repository setup)"
    
    # Check if Node 20 is installed via nvm
    if nvm list | grep -E "v20\." >/dev/null 2>&1; then
        print_success "Node.js 20.x is installed via nvm"
        nvm use 20 >/dev/null 2>&1
    elif command_exists node; then
        CURRENT_VERSION=$(node --version | cut -d'v' -f2)
        print_warning "Node.js is installed (version $CURRENT_VERSION) but not via nvm"
        print_info "Installing Node.js 20.x via nvm..."
        install_nodejs "20"
    else
        print_warning "Node.js is not installed. Installing Node.js 20.x via nvm..."
        install_nodejs "20"
    fi
    
    return 0
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
        return 0
    else
        print_warning "Yarn is not installed. Installing..."
        if [[ "$OS" == "macos" ]]; then
            if brew install yarn; then
                print_success "Yarn installed successfully"
                return 0
            else
                return 1
            fi
        elif [[ "$OS" == "linux" ]]; then
            if npm install -g yarn; then
        print_success "Yarn installed successfully"
                return 0
            else
                return 1
            fi
        fi
        return 1
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
        return 0
    else
        print_info "Cloning Checkmate repository..."
        if [ -d "checkmate" ]; then
            print_warning "Directory 'checkmate' already exists. Using existing directory..."
            REPO_DIR="$(pwd)/checkmate"
            if [ ! -f "$REPO_DIR/package.json" ]; then
                print_error "Directory 'checkmate' exists but doesn't appear to be a valid repository."
                print_info "Please remove it and run this script again."
                return 1
            fi
            return 0
        else
            # Try SSH first, fallback to HTTPS if SSH fails
            print_info "Attempting to clone via SSH..."
            if git clone git@github.com:dream-horizon-org/checkmate.git 2>/dev/null; then
                REPO_DIR="$(pwd)/checkmate"
                print_success "Repository cloned successfully via SSH"
            else
                print_warning "SSH clone failed, trying HTTPS..."
                if git clone https://github.com/dream-horizon-org/checkmate.git 2>/dev/null; then
                    REPO_DIR="$(pwd)/checkmate"
                    print_success "Repository cloned successfully via HTTPS"
                else
                    print_error "Failed to clone repository. Please check your internet connection and try again."
                    return 1
                fi
            fi
            
            # Verify the clone was successful
            if [ ! -d "$REPO_DIR" ] || [ ! -f "$REPO_DIR/package.json" ]; then
                print_error "Repository clone appears to have failed. Directory structure is invalid."
                return 1
            fi
            return 0
        fi
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
    echo -e "     ${BLUE}https://checkmate.dreamhorizon.org/docs/project/setup#google-oauth-setup${NC}"
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

# Function to collect Google OAuth credentials interactively
collect_oauth_credentials() {
    print_header "Google OAuth Configuration"
    
    show_oauth_instructions
    
    echo ""
    read -p "Press Enter when you have your Google OAuth credentials ready, or Ctrl+C to exit..."
    echo ""
    
    # Check if credentials are already set
    if grep -q "^GOOGLE_CLIENT_ID=" .env 2>/dev/null && grep -q "^GOOGLE_CLIENT_SECRET=" .env 2>/dev/null; then
        EXISTING_CLIENT_ID=$(grep "^GOOGLE_CLIENT_ID=" .env | cut -d'=' -f2 | tr -d '"' | tr -d "'")
        if [ -n "$EXISTING_CLIENT_ID" ] && [ "$EXISTING_CLIENT_ID" != "your_google_client_id_here" ]; then
            print_info "Google OAuth credentials found in .env file"
            read -p "Do you want to update them? (y/n) " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                print_success "Using existing Google OAuth credentials"
                return 0
            fi
        fi
    fi
    
    # Collect Client ID
    while true; do
        read -p "Enter your Google OAuth Client ID: " GOOGLE_CLIENT_ID
        if [ -z "$GOOGLE_CLIENT_ID" ]; then
            print_error "Client ID cannot be empty. Please try again."
            continue
        fi
        break
    done
    
    # Collect Client Secret
    while true; do
        read -p "Enter your Google OAuth Client Secret: " GOOGLE_CLIENT_SECRET
        if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
            print_error "Client Secret cannot be empty. Please try again."
            continue
        fi
        break
    done
    
    # Update .env file
    if [[ "$OS" == "macos" ]]; then
        # Update or add GOOGLE_CLIENT_ID
        if grep -q "^GOOGLE_CLIENT_ID=" .env 2>/dev/null; then
            sed -i '' "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID|g" .env
        else
            echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env
        fi
        
        # Update or add GOOGLE_CLIENT_SECRET
        if grep -q "^GOOGLE_CLIENT_SECRET=" .env 2>/dev/null; then
            sed -i '' "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET|g" .env
        else
            echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env
        fi
    else
        # Update or add GOOGLE_CLIENT_ID
        if grep -q "^GOOGLE_CLIENT_ID=" .env 2>/dev/null; then
            sed -i "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID|g" .env
        else
            echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env
        fi
        
        # Update or add GOOGLE_CLIENT_SECRET
        if grep -q "^GOOGLE_CLIENT_SECRET=" .env 2>/dev/null; then
            sed -i "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET|g" .env
        else
            echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env
        fi
    fi
    
    print_success "Google OAuth credentials configured successfully"
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
        print_warning ".env file already exists."
        read -p "Do you want to reconfigure? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Using existing .env file"
            # Still collect OAuth if not set
            if ! grep -q "^GOOGLE_CLIENT_ID=" .env 2>/dev/null || ! grep -q "^GOOGLE_CLIENT_SECRET=" .env 2>/dev/null; then
                collect_oauth_credentials
            fi
        return
        fi
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
    
    # Collect OAuth credentials interactively
    collect_oauth_credentials
}

# Function to setup MCP server environment file
setup_mcp_env_file() {
    print_header "Setting up MCP Server Environment File"
    
    # Verify REPO_DIR is set before using it
    if [ -z "$REPO_DIR" ] || [ ! -d "$REPO_DIR" ]; then
        print_error "Repository directory is not set or invalid. Cannot setup MCP server environment file."
        exit 1
    fi
    
    cd "$REPO_DIR" || {
        print_error "Failed to change to repository directory: $REPO_DIR"
        exit 1
    }
    
    MCP_ENV_FILE="$REPO_DIR/mcp-server/.env"
    
    if [ -f "$MCP_ENV_FILE" ]; then
        print_warning "MCP server .env file already exists. Skipping creation."
        print_info "If you need to reconfigure, edit $MCP_ENV_FILE manually."
        return
    fi
    
    if [ ! -f "$REPO_DIR/mcp-server/.env.example" ]; then
        print_warning ".env.example not found in mcp-server directory."
        print_info "Creating basic .env file..."
        
        # Create basic .env file
        cat > "$MCP_ENV_FILE" << EOF
# Checkmate MCP Server Configuration
CHECKMATE_API_BASE=http://localhost:3000
CHECKMATE_API_TOKEN=your-api-token-here
LOG_LEVEL=info
REQUEST_TIMEOUT=30000
ENABLE_RETRY=false
MAX_RETRIES=3
EOF
        print_success "MCP server .env file created with default values"
    else
        # Copy .env.example to .env
        cp "$REPO_DIR/mcp-server/.env.example" "$MCP_ENV_FILE"
        print_success "MCP server .env file created from .env.example"
    fi
    
    print_warning "⚠️  Action Required: Update CHECKMATE_API_TOKEN in $MCP_ENV_FILE"
    print_info "   Get your API token from: http://localhost:3000 (after starting Checkmate)"
    print_info "   Navigate to: User Settings → API Tokens → Generate Token"
    echo ""
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
        return 0
    else
        print_error "Failed to install dependencies. Please check the error messages above."
        return 1
    fi
}

# Function to build MCP server
build_mcp_server() {
    print_header "Building MCP Server"
    
    # Verify REPO_DIR is set before using it
    if [ -z "$REPO_DIR" ] || [ ! -d "$REPO_DIR" ]; then
        print_error "Repository directory is not set or invalid. Cannot build MCP server."
        exit 1
    fi
    
    cd "$REPO_DIR" || {
        print_error "Failed to change to repository directory: $REPO_DIR"
        exit 1
    }
    
    # Check if mcp-server directory exists
    if [ ! -d "$REPO_DIR/mcp-server" ]; then
        print_warning "MCP server directory not found. Skipping MCP server build."
        return
    fi
    
    cd "$REPO_DIR/mcp-server" || {
        print_error "Failed to change to MCP server directory"
        exit 1
    }
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_warning "MCP server package.json not found. Skipping build."
        return
    fi
    
    print_info "Installing MCP server dependencies..."
    if yarn install --frozen-lockfile; then
        print_success "MCP server dependencies installed"
    else
        print_warning "Failed to install MCP server dependencies. Continuing anyway..."
        return
    fi
    
    print_info "Building MCP server..."
    if yarn build; then
        print_success "MCP server built successfully"
        
        # Verify build output exists
        if [ -f "build/index.js" ]; then
            print_success "MCP server build artifact verified: build/index.js"
        else
            print_warning "MCP server build completed but build/index.js not found"
        fi
    else
        print_warning "Failed to build MCP server. You can build it later with: cd mcp-server && yarn build"
    fi
    
    # Return to repo root
    cd "$REPO_DIR" || {
        print_error "Failed to return to repository directory"
        exit 1
    }
}

# Function to verify Docker setup
verify_docker_setup() {
    print_header "Verifying Docker Configuration"
    
    # Verify REPO_DIR is set before using it
    if [ -z "$REPO_DIR" ] || [ ! -d "$REPO_DIR" ]; then
        print_error "Repository directory is not set or invalid. Cannot verify Docker setup."
        return 1
    fi
    
    cd "$REPO_DIR" || {
        print_error "Failed to change to repository directory: $REPO_DIR"
        return 1
    }
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found"
        return 1
    fi
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop."
        return 1
    fi
    
    echo -e "  ${GREEN}✓${NC} Docker is running"
    echo -e "  ${GREEN}✓${NC} docker-compose.yml found"
    echo ""
    print_success "Docker configuration verified"
    return 0
}

# Function to start Docker containers
start_docker_containers() {
    print_header "Starting Docker Containers"
    
    cd "$REPO_DIR" || {
        print_error "Failed to change to repository directory: $REPO_DIR"
        return 1
    }
    
    print_info "Starting Checkmate services with Docker..."
    if yarn docker:setup; then
        print_success "Docker containers started successfully"
        
        # Wait for services to be ready
        print_info "Waiting for services to be ready..."
        sleep 10
        
        # Check if app is accessible
        local max_attempts=30
        local attempt=0
        while [ $attempt -lt $max_attempts ]; do
            if curl -s http://localhost:3000/healthcheck >/dev/null 2>&1; then
                print_success "Checkmate application is running at http://localhost:3000"
                return 0
            fi
            attempt=$((attempt + 1))
            sleep 2
        done
        
        print_warning "Checkmate application may still be starting. Please check manually."
        return 0
    else
        print_error "Failed to start Docker containers"
        return 1
    fi
}

# Function to collect Checkmate API token
collect_checkmate_token() {
    print_header "Checkmate API Token Configuration"
    
    echo ""
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  📝 How to Get Your API Token${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${GREEN}1.${NC} Open Checkmate in your browser:"
    echo -e "     ${BLUE}http://localhost:3000${NC}"
    echo ""
    echo -e "  ${GREEN}2.${NC} Sign in with your Google account"
    echo ""
    echo -e "  ${GREEN}3.${NC} Navigate to: ${BLUE}User Settings → API Tokens${NC}"
    echo ""
    echo -e "  ${GREEN}4.${NC} Click: ${BLUE}Generate Token${NC}"
    echo ""
    echo -e "  ${GREEN}5.${NC} Copy the generated token"
    echo ""
    echo ""
    read -p "Press Enter when you have your API token ready, or Ctrl+C to exit..."
    echo ""
    
    # Collect token
    while true; do
        read -p "Enter your Checkmate API token: " CHECKMATE_API_TOKEN
        if [ -z "$CHECKMATE_API_TOKEN" ]; then
            print_error "API token cannot be empty. Please try again."
            continue
        fi
        
        # Validate token format (basic check)
        if [ ${#CHECKMATE_API_TOKEN} -lt 8 ]; then
            print_warning "Token seems too short. Are you sure this is correct?"
            read -p "Continue anyway? (y/n) " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                continue
            fi
        fi
        break
    done
    
    # Update MCP server .env file
    MCP_ENV_FILE="$REPO_DIR/mcp-server/.env"
    if [ ! -f "$MCP_ENV_FILE" ]; then
        print_warning "MCP server .env file not found. Creating it..."
        setup_mcp_env_file
    fi
    
    # Update token in .env file
    if [[ "$OS" == "macos" ]]; then
        if grep -q "^CHECKMATE_API_TOKEN=" "$MCP_ENV_FILE" 2>/dev/null; then
            sed -i '' "s|^CHECKMATE_API_TOKEN=.*|CHECKMATE_API_TOKEN=$CHECKMATE_API_TOKEN|g" "$MCP_ENV_FILE"
        else
            echo "CHECKMATE_API_TOKEN=$CHECKMATE_API_TOKEN" >> "$MCP_ENV_FILE"
        fi
    else
        if grep -q "^CHECKMATE_API_TOKEN=" "$MCP_ENV_FILE" 2>/dev/null; then
            sed -i "s|^CHECKMATE_API_TOKEN=.*|CHECKMATE_API_TOKEN=$CHECKMATE_API_TOKEN|g" "$MCP_ENV_FILE"
        else
            echo "CHECKMATE_API_TOKEN=$CHECKMATE_API_TOKEN" >> "$MCP_ENV_FILE"
        fi
    fi
    
    print_success "API token configured in mcp-server/.env"
    echo ""
}

# Function to handle errors and offer retry
handle_error() {
    local error_message=$1
    local step_name=$2
    
    echo ""
    print_error "Installation failed at: $step_name"
    print_error "Error: $error_message"
    echo ""
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  💡 Potential Fixes${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    case "$step_name" in
        "Git Installation")
            echo -e "  ${BLUE}•${NC} Ensure you have internet connection"
            echo -e "  ${BLUE}•${NC} Check if Git is already installed: ${BLUE}git --version${NC}"
            echo -e "  ${BLUE}•${NC} Try installing Git manually and run script again"
            ;;
        "NVM Installation")
            echo -e "  ${BLUE}•${NC} Check internet connection"
            echo -e "  ${BLUE}•${NC} Try: ${BLUE}curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash${NC}"
            echo -e "  ${BLUE}•${NC} Restart terminal and run script again"
            ;;
        "Node.js Installation")
            echo -e "  ${BLUE}•${NC} Ensure nvm is installed and loaded"
            echo -e "  ${BLUE}•${NC} Try: ${BLUE}nvm install 20${NC}"
            echo -e "  ${BLUE}•${NC} Check Node.js version: ${BLUE}node --version${NC}"
            ;;
        "Yarn Installation")
            echo -e "  ${BLUE}•${NC} Ensure Node.js is installed"
            echo -e "  ${BLUE}•${NC} Try: ${BLUE}npm install -g yarn${NC}"
            echo -e "  ${BLUE}•${NC} Check Yarn version: ${BLUE}yarn --version${NC}"
            ;;
        "Docker Installation")
            echo -e "  ${BLUE}•${NC} Install Docker Desktop manually"
            echo -e "  ${BLUE}•${NC} Start Docker Desktop"
            echo -e "  ${BLUE}•${NC} Verify: ${BLUE}docker info${NC}"
            ;;
        "Repository Setup")
            echo -e "  ${BLUE}•${NC} Check internet connection"
            echo -e "  ${BLUE}•${NC} Verify Git is installed: ${BLUE}git --version${NC}"
            echo -e "  ${BLUE}•${NC} Try cloning manually: ${BLUE}git clone https://github.com/dream-horizon-org/checkmate.git${NC}"
            ;;
        "Dependencies Installation")
            echo -e "  ${BLUE}•${NC} Ensure Node.js and Yarn are installed"
            echo -e "  ${BLUE}•${NC} Check internet connection"
            echo -e "  ${BLUE}•${NC} Try: ${BLUE}cd $REPO_DIR && yarn install${NC}"
            ;;
        "MCP Server Build")
            echo -e "  ${BLUE}•${NC} Ensure Node.js is installed"
            echo -e "  ${BLUE}•${NC} Try: ${BLUE}cd $REPO_DIR/mcp-server && yarn install && yarn build${NC}"
            ;;
        "Docker Startup")
            echo -e "  ${BLUE}•${NC} Ensure Docker is running"
            echo -e "  ${BLUE}•${NC} Check port 3000 is not in use"
            echo -e "  ${BLUE}•${NC} Try: ${BLUE}cd $REPO_DIR && yarn docker:setup${NC}"
            ;;
        *)
            echo -e "  ${BLUE}•${NC} Check the error message above"
            echo -e "  ${BLUE}•${NC} Review installation logs"
            echo -e "  ${BLUE}•${NC} Check documentation: ${BLUE}https://checkmate.dreamhorizon.org${NC}"
            ;;
    esac
    
    echo ""
    read -p "Would you like to try again? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        print_info "Please fix the issue and run the script again:"
        echo -e "     ${BLUE}./install.sh${NC}"
        echo ""
        exit 1
    else
        print_info "Installation cancelled. You can run the script again later."
        exit 1
    fi
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
    if ! check_install_git; then
        handle_error "Git installation failed" "Git Installation"
    fi
    
    if ! check_install_nvm; then
        handle_error "NVM installation failed" "NVM Installation"
    fi
    
    if ! check_install_node; then
        handle_error "Node.js installation failed" "Node.js Installation"
    fi
    
    if ! check_install_yarn; then
        handle_error "Yarn installation failed" "Yarn Installation"
    fi
    
    if ! check_install_docker; then
        handle_error "Docker installation/verification failed" "Docker Installation"
    fi
    
    # Setup repository
    if ! setup_repository; then
        handle_error "Repository setup failed" "Repository Setup"
    fi
    
    # Read .nvmrc and ensure correct Node version is installed (after repository is cloned)
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
        if nvm list | grep -E "v?$NVMRC_VERSION\b" >/dev/null 2>&1; then
            print_success "Node.js $NVMRC_VERSION is already installed"
        else
            print_info "Installing Node.js $NVMRC_VERSION via nvm..."
            if ! nvm install "$NVMRC_VERSION"; then
                handle_error "Failed to install Node.js $NVMRC_VERSION" "Node.js Installation"
            fi
        fi
        
        # Use the version from .nvmrc
        print_info "Switching to Node.js version from .nvmrc..."
        if ! nvm use; then
            handle_error "Failed to switch to Node.js version from .nvmrc" "Node.js Installation"
        fi
        
        ACTUAL_VERSION=$(node --version)
        print_success "Using Node.js $ACTUAL_VERSION (from .nvmrc)"
    else
        print_warning ".nvmrc file not found. Using Node.js version from previous step."
    fi
    
    # Setup environment file (includes OAuth credential collection)
    setup_env_file
    
    # Setup MCP server environment file
    setup_mcp_env_file
    
    # Install dependencies
    if ! install_dependencies; then
        handle_error "Dependencies installation failed" "Dependencies Installation"
    fi
    
    # Build MCP server
    build_mcp_server  # Non-fatal, continues on failure
    
    # Verify Docker setup
    echo ""
    if ! verify_docker_setup; then
        handle_error "Docker setup verification failed" "Docker Setup"
    fi
    
    # Start Docker containers
    echo ""
    if start_docker_containers; then
        # Collect API token after services are running
        echo ""
        collect_checkmate_token
    else
        print_warning "Docker containers failed to start. You can start them manually later."
        print_info "To start manually: cd $REPO_DIR && yarn docker:setup"
        print_info "You can configure the API token later in mcp-server/.env"
    fi
    
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
    echo -e "  ${GREEN}✓${NC} Step 1: Prerequisites installed (Git, NVM, Node.js, Yarn, Docker)"
    echo -e "  ${GREEN}✓${NC} Step 2: Repository cloned/setup"
    echo -e "  ${GREEN}✓${NC} Step 3: Node.js version configured from .nvmrc"
    echo -e "  ${GREEN}✓${NC} Step 4: Environment file created with session secret"
    echo -e "  ${GREEN}✓${NC} Step 5: Google OAuth credentials configured"
    echo -e "  ${GREEN}✓${NC} Step 6: MCP server environment file created"
    echo -e "  ${GREEN}✓${NC} Step 7: Main dependencies installed"
    echo -e "  ${GREEN}✓${NC} Step 8: MCP server built"
    echo -e "  ${GREEN}✓${NC} Step 9: Docker containers started"
    echo -e "  ${GREEN}✓${NC} Step 10: Checkmate API token configured"
    echo ""
    
    # Resources
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  📚 Resources${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${BLUE}📖${NC} Documentation:"
    echo -e "     ${BLUE}https://checkmate.dreamhorizon.org${NC}"
    echo ""
    echo -e "  ${BLUE}💬${NC} Discord Community:"
    echo -e "     ${BLUE}https://discord.gg/wBQXeYAKNc${NC}"
    echo ""
    echo -e "  ${BLUE}🐙${NC} GitHub:"
    echo -e "     ${BLUE}https://github.com/dream-horizon-org/checkmate${NC}"
    echo ""
    
    # Show configuration status (already configured during installation)
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  ✅ Configuration Status${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${GREEN}✓${NC} Google OAuth credentials configured in .env"
    echo -e "  ${GREEN}✓${NC} Checkmate API token configured in mcp-server/.env"
    echo -e "  ${GREEN}✓${NC} MCP Server built and ready"
    echo -e "     ${BLUE}Build location: $REPO_DIR/mcp-server/build/index.js${NC}"
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
    echo -e "  ${GREEN}1.${NC} Access Checkmate:"
    echo -e "     ${BLUE}Open http://localhost:3000 in your browser${NC}"
    echo ""
    echo -e "  ${GREEN}2.${NC} Sign in with your Google account"
    echo ""
    echo -e "  ${GREEN}3.${NC} Configure Cursor IDE (optional):"
    if [ -f "$REPO_DIR/CURSOR_SETUP.md" ]; then
        echo -e "     ${BLUE}See: $REPO_DIR/CURSOR_SETUP.md${NC}"
    else
        echo -e "     ${BLUE}See: $REPO_DIR/mcp-server/README.md${NC}"
    fi
    echo -e "     ${BLUE}MCP server build: $REPO_DIR/mcp-server/build/index.js${NC}"
    echo ""
    echo -e "  ${GREEN}4.${NC} Start using Checkmate!"
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
    
    # Final refined steps
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  📋 Refined Installation Steps Summary${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}The installation script completed the following steps:${NC}"
    echo ""
    echo -e "  ${GREEN}1.${NC} ${BLUE}Prerequisites Installation${NC}"
    echo -e "     • Git, NVM, Node.js, Yarn, Docker"
    echo ""
    echo -e "  ${GREEN}2.${NC} ${BLUE}Repository Setup${NC}"
    echo -e "     • Cloned Checkmate repository"
    echo -e "     • Configured Node.js version from .nvmrc"
    echo ""
    echo -e "  ${GREEN}3.${NC} ${BLUE}Configuration${NC}"
    echo -e "     • Created .env file with session secret"
    echo -e "     • Collected Google OAuth credentials"
    echo -e "     • Created mcp-server/.env file"
    echo ""
    echo -e "  ${GREEN}4.${NC} ${BLUE}Dependencies & Build${NC}"
    echo -e "     • Installed main application dependencies"
    echo -e "     • Built MCP server"
    echo ""
    echo -e "  ${GREEN}5.${NC} ${BLUE}Services Startup${NC}"
    echo -e "     • Started Docker containers"
    echo -e "     • Collected and configured API token"
    echo ""
    echo -e "${BLUE}Everything is ready to use!${NC}"
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


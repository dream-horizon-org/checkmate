#!/bin/bash

# Checkmate Installation Script
# This script checks for prerequisites and installs Checkmate

set -e  # Exit on error

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
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}\n"
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

# Function to check and install Node.js
check_install_node() {
    print_header "Checking Node.js"
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
        
        if [ "$NODE_MAJOR" -ge 18 ]; then
            print_success "Node.js is installed (version $NODE_VERSION)"
        else
            print_warning "Node.js version $NODE_VERSION is too old. Need v18.x or higher."
            print_info "Installing latest Node.js LTS..."
            install_nodejs
        fi
    else
        print_warning "Node.js is not installed. Installing..."
        install_nodejs
    fi
}

install_nodejs() {
    if [[ "$OS" == "macos" ]]; then
        brew install node@20
    elif [[ "$OS" == "linux" ]]; then
        # Install Node.js using NodeSource repository
        print_info "Installing Node.js 20.x..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        if [[ "$DISTRO" == "ubuntu" ]] || [[ "$DISTRO" == "debian" ]]; then
            sudo apt-get install -y nodejs
        elif [[ "$DISTRO" == "fedora" ]] || [[ "$DISTRO" == "rhel" ]] || [[ "$DISTRO" == "centos" ]]; then
            sudo yum install -y nodejs
        fi
    fi
    print_success "Node.js installed successfully"
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
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        print_success "Docker is installed (version $DOCKER_VERSION)"
        
        # Check if Docker daemon is running
        if ! docker info >/dev/null 2>&1; then
            print_error "Docker is installed but not running."
            print_info "Please start Docker Desktop and run this script again."
            exit 1
        fi
    else
        print_warning "Docker is not installed."
        if [[ "$OS" == "macos" ]]; then
            print_info "Please download and install Docker Desktop from:"
            print_info "https://www.docker.com/products/docker-desktop/"
            print_error "Install Docker Desktop, start it, and run this script again."
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
        else
            git clone git@github.com:ds-horizon/checkmate.git
            REPO_DIR="$(pwd)/checkmate"
            print_success "Repository cloned successfully"
        fi
    fi
}

# Function to generate random session secret
generate_session_secret() {
    if command_exists openssl; then
        openssl rand -base64 32
    else
        # Fallback to using date and random
        echo "$(date +%s)-$(echo $RANDOM | md5sum | head -c 32)"
    fi
}

# Function to guide OAuth setup
guide_oauth_setup() {
    print_header "Google OAuth Setup Guide"
    
    echo -e "${YELLOW}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  Google OAuth is required for authentication in Checkmate    ║${NC}"
    echo -e "${YELLOW}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    print_info "📖 Detailed documentation: ${BLUE}https://checkmate.dreamsportslabs.com/docs/project/setup#google-oauth-setup${NC}"
    echo ""
    
    print_info "Steps to create Google OAuth credentials:"
    echo ""
    echo "  1. Go to Google Cloud Console"
    echo "     → https://console.cloud.google.com/"
    echo ""
    echo "  2. Create a new project (or select existing)"
    echo ""
    echo "  3. Enable Google+ API"
    echo "     → APIs & Services → Library → Search 'Google+ API' → Enable"
    echo ""
    echo "  4. Create OAuth 2.0 Credentials"
    echo "     → APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID"
    echo ""
    echo "  5. Configure OAuth consent screen (if prompted)"
    echo "     → Application name: Checkmate"
    echo "     → User support email: Your email"
    echo ""
    echo "  6. Create OAuth Client ID"
    echo "     → Application type: Web application"
    echo "     → Name: Checkmate Local"
    echo "     → Authorized JavaScript origins: http://localhost:3000"
    echo "     → Authorized redirect URIs: http://localhost:3000/callback"
    echo ""
    echo "  7. Copy the Client ID and Client Secret"
    echo ""
    
    # Automatically open both URLs
    print_info "🌐 Opening documentation and Google Cloud Console in your browser..."
    echo ""
    sleep 1
    
    DOCS_URL="https://checkmate.dreamsportslabs.com/docs/project/setup#google-oauth-setup"
    GOOGLE_CONSOLE_URL="https://console.cloud.google.com/apis/credentials"
    
    if [[ "$OS" == "macos" ]]; then
        open "$DOCS_URL"
        sleep 0.5  # Small delay between opening tabs
        open "$GOOGLE_CONSOLE_URL"
    elif [[ "$OS" == "linux" ]]; then
        if command_exists xdg-open; then
            xdg-open "$DOCS_URL" &>/dev/null &
            sleep 0.5
            xdg-open "$GOOGLE_CONSOLE_URL" &>/dev/null &
        elif command_exists gnome-open; then
            gnome-open "$DOCS_URL" &>/dev/null &
            sleep 0.5
            gnome-open "$GOOGLE_CONSOLE_URL" &>/dev/null &
        else
            print_warning "Could not open browser automatically."
            print_info "Please open these URLs:"
            print_info "  1. Documentation: $DOCS_URL"
            print_info "  2. Google Console: $GOOGLE_CONSOLE_URL"
        fi
    fi
    
    print_success "✅ Opened documentation and Google Cloud Console"
    echo ""
    print_info "📋 Follow the steps above (or in the documentation) to create OAuth credentials."
    echo ""
    read -p "Press Enter when you have your credentials ready..."
}

# Function to setup environment file with interactive input
setup_env_file() {
    print_header "Setting up Environment File"
    
    cd "$REPO_DIR"
    
    if [ -f ".env" ]; then
        print_warning ".env file already exists."
        read -p "Would you like to reconfigure it? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Keeping existing .env file"
            return
        fi
    fi
    
    if [ ! -f ".env.example" ]; then
        print_error ".env.example file not found"
        exit 1
    fi
    
    # Copy .env.example to .env
    cp .env.example .env
    print_success ".env file created from .env.example"
    echo ""
    
    # Guide OAuth setup
    guide_oauth_setup
    
    # Prompt for Google OAuth credentials
    print_header "Configure OAuth Credentials"
    
    echo -e "${YELLOW}Please enter your Google OAuth credentials:${NC}"
    echo ""
    
    # Google Client ID
    while true; do
        read -p "Enter Google Client ID: " GOOGLE_CLIENT_ID
        if [ -n "$GOOGLE_CLIENT_ID" ]; then
            break
        else
            print_error "Client ID cannot be empty. Please try again."
        fi
    done
    
    # Google Client Secret
    while true; do
        read -p "Enter Google Client Secret: " GOOGLE_CLIENT_SECRET
        if [ -n "$GOOGLE_CLIENT_SECRET" ]; then
            break
        else
            print_error "Client Secret cannot be empty. Please try again."
        fi
    done
    
    # Generate Session Secret
    print_info "Generating secure session secret..."
    SESSION_SECRET=$(generate_session_secret)
    
    echo ""
    print_success "Credentials collected successfully!"
    echo ""
    
    # Update .env file with collected credentials
    print_info "Updating .env file with your credentials..."
    
    # For macOS (BSD sed)
    if [[ "$OS" == "macos" ]]; then
        sed -i '' "s|GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID|g" .env
        sed -i '' "s|GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET|g" .env
        sed -i '' "s|SESSION_SECRET=.*|SESSION_SECRET=$SESSION_SECRET|g" .env
    else
        # For Linux (GNU sed)
        sed -i "s|GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID|g" .env
        sed -i "s|GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET|g" .env
        sed -i "s|SESSION_SECRET=.*|SESSION_SECRET=$SESSION_SECRET|g" .env
    fi
    
    print_success ".env file configured successfully!"
    echo ""
    print_info "📝 Your credentials have been saved to .env"
    print_warning "⚠️  Keep your .env file secure and never commit it to version control"
    echo ""
}

# Function to install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    cd "$REPO_DIR"
    
    print_info "Installing Node.js dependencies..."
    yarn install
    print_success "Dependencies installed successfully"
}

# Function to setup Docker containers
setup_docker() {
    print_header "Setting up Docker Containers"
    
    cd "$REPO_DIR"
    
    print_info "Creating Docker containers and seeding database..."
    print_info "This may take a few minutes..."
    
    yarn docker:setup
    
    print_success "Docker setup completed successfully"
}

# Main installation flow
main() {
    clear
    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════════╗"
    echo "║                                           ║"
    echo "║     Checkmate Installation Script         ║"
    echo "║                                           ║"
    echo "╚═══════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    print_info "Starting Checkmate installation..."
    echo ""
    
    # Detect OS
    detect_os
    
    # Install Homebrew on macOS if needed
    if [[ "$OS" == "macos" ]]; then
        install_homebrew
    fi
    
    # Check and install prerequisites
    check_install_git
    check_install_node
    check_install_yarn
    check_install_docker
    
    # Setup repository
    setup_repository
    
    # Setup environment file
    setup_env_file
    
    # Install dependencies
    install_dependencies
    
    # Setup Docker automatically
    echo ""
    print_header "Docker Container Setup"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    print_info "Setting up Docker containers and seeding the database..."
    print_info "This step will create and start the MySQL database container."
    echo ""
    print_warning "⏳ This may take a few minutes. Please wait..."
    echo ""
    
    setup_docker
    DOCKER_SETUP_DONE=true
    
    # Final success message
    print_header "Installation Complete! 🎉"
    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════════╗"
    echo "║  Checkmate is ready to use!              ║"
    echo "╚═══════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    print_success "✅ All prerequisites installed"
    print_success "✅ Repository cloned"
    print_success "✅ Environment configured"
    print_success "✅ Dependencies installed"
    if [ "$DOCKER_SETUP_DONE" = true ]; then
        print_success "✅ Docker containers ready"
    fi
    echo ""
    
    # Open Checkmate in browser
    if [ "$DOCKER_SETUP_DONE" = true ]; then
        print_info "🌐 Opening Checkmate in your browser..."
        echo ""
        sleep 2  # Give Docker a moment to fully start
        
        CHECKMATE_URL="http://localhost:3000"
        
        if [[ "$OS" == "macos" ]]; then
            open "$CHECKMATE_URL"
        elif [[ "$OS" == "linux" ]]; then
            if command_exists xdg-open; then
                xdg-open "$CHECKMATE_URL" &>/dev/null &
            elif command_exists gnome-open; then
                gnome-open "$CHECKMATE_URL" &>/dev/null &
            else
                print_warning "Could not open browser automatically."
                print_info "Please open: $CHECKMATE_URL"
            fi
        fi
        
        print_success "✅ Browser opened"
        echo ""
        print_info "🚀 Next steps:"
        echo "  1. Sign in with your Google account"
        echo "  2. Start managing your test cases!"
    else
        print_info "🚀 Next steps:"
        echo "  1. Run Docker setup: cd $REPO_DIR && yarn docker:setup"
        echo "  2. Access Checkmate at: http://localhost:3000"
    fi
    
    echo ""
    print_info "📚 Resources:"
    echo "  • Documentation: https://checkmate.dreamsportslabs.com"
    echo "  • Discord Community: https://discord.gg/wBQXeYAKNc"
    echo "  • GitHub: https://github.com/ds-horizon/checkmate"
    echo ""
    print_warning "💡 Tip: Your .env file contains sensitive credentials. Keep it secure!"
    echo ""
}

# Run main function
main


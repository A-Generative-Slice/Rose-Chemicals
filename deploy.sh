#!/bin/bash

# =============================================================================
# Rose Chemicals - Docker Deployment Script
# =============================================================================
# Single-command script for build → test → deploy
# Usage: ./deploy.sh [command] [options]
# =============================================================================

set -e

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
PROJECT_NAME="rose-chemicals"
COMPOSE_PROJECT_NAME="${PROJECT_NAME}"
DOCKER_COMPOSE="docker compose"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# -----------------------------------------------------------------------------
# Helper Functions
# -----------------------------------------------------------------------------
print_header() {
    echo -e "\n${BLUE}============================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}============================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_dependencies() {
    print_header "Checking Dependencies"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed: $(docker --version)"
    
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose V2 is not available. Please update Docker."
        exit 1
    fi
    print_success "Docker Compose is available: $(docker compose version)"
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    print_success "Docker daemon is running"
}

# -----------------------------------------------------------------------------
# Environment Setup
# -----------------------------------------------------------------------------
setup_env() {
    print_header "Setting Up Environment"
    
    ENV_FILE="${1:-.env}"
    
    if [ ! -f "$ENV_FILE" ]; then
        if [ -f ".env.docker.example" ]; then
            cp .env.docker.example "$ENV_FILE"
            print_warning "Created $ENV_FILE from .env.docker.example"
            print_warning "Please edit $ENV_FILE with your configuration!"
        else
            print_error "No environment file found. Please create $ENV_FILE"
            exit 1
        fi
    else
        print_success "Environment file exists: $ENV_FILE"
    fi
    
    # Load environment variables
    export $(grep -v '^#' "$ENV_FILE" | xargs -d '\n' 2>/dev/null) || true
}

# -----------------------------------------------------------------------------
# Development Mode
# -----------------------------------------------------------------------------
dev() {
    print_header "Starting Development Environment"
    
    check_dependencies
    setup_env ".env.docker.dev"
    
    print_info "Building development containers..."
    $DOCKER_COMPOSE build
    
    print_info "Starting services with hot-reload..."
    $DOCKER_COMPOSE up -d
    
    print_success "Development environment is ready!"
    echo ""
    echo "  Frontend:  http://localhost:3000"
    echo "  Backend:   http://localhost:5000"
    echo "  MongoDB:   mongodb://localhost:27017"
    echo ""
    echo "  Logs:      docker compose logs -f"
    echo "  Stop:      ./deploy.sh stop"
}

# -----------------------------------------------------------------------------
# Production Mode
# -----------------------------------------------------------------------------
prod() {
    print_header "Starting Production Environment"
    
    check_dependencies
    setup_env ".env.docker.prod"
    
    print_info "Building production containers..."
    $DOCKER_COMPOSE -f docker-compose.yml -f docker-compose.prod.yml build
    
    print_info "Starting production services..."
    $DOCKER_COMPOSE -f docker-compose.yml -f docker-compose.prod.yml up -d
    
    print_success "Production environment is ready!"
    echo ""
    echo "  Application: http://localhost (or your domain)"
    echo ""
}

# -----------------------------------------------------------------------------
# Build Only
# -----------------------------------------------------------------------------
build() {
    print_header "Building Docker Images"
    
    check_dependencies
    
    MODE="${1:-dev}"
    
    if [ "$MODE" = "prod" ]; then
        setup_env ".env.docker.prod"
        print_info "Building production images..."
        $DOCKER_COMPOSE -f docker-compose.yml -f docker-compose.prod.yml build --no-cache
    else
        setup_env ".env.docker.dev"
        print_info "Building development images..."
        $DOCKER_COMPOSE build --no-cache
    fi
    
    print_success "Build completed!"
}

# -----------------------------------------------------------------------------
# Test
# -----------------------------------------------------------------------------
test_services() {
    print_header "Testing Services"
    
    print_info "Checking container health..."
    
    # Wait for services to be healthy
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker compose ps | grep -q "unhealthy\|starting"; then
            print_info "Waiting for services to be healthy... ($attempt/$max_attempts)"
            sleep 5
            ((attempt++))
        else
            break
        fi
    done
    
    # Test MongoDB
    print_info "Testing MongoDB connection..."
    if docker compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        print_success "MongoDB is healthy"
    else
        print_error "MongoDB connection failed"
        return 1
    fi
    
    # Test Backend
    print_info "Testing Backend API..."
    local backend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health 2>/dev/null || echo "000")
    if [ "$backend_health" = "200" ]; then
        print_success "Backend API is healthy"
    else
        print_warning "Backend API returned: $backend_health"
    fi
    
    # Test Frontend
    print_info "Testing Frontend..."
    local frontend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
    if [ "$frontend_health" = "200" ]; then
        print_success "Frontend is healthy"
    else
        print_warning "Frontend returned: $frontend_health"
    fi
    
    print_success "All tests completed!"
}

# -----------------------------------------------------------------------------
# Deploy (Full Pipeline)
# -----------------------------------------------------------------------------
deploy() {
    print_header "Full Deployment Pipeline"
    
    MODE="${1:-prod}"
    
    echo "Starting full deployment pipeline for: $MODE"
    echo ""
    
    # Step 1: Build
    build "$MODE"
    
    # Step 2: Start services
    if [ "$MODE" = "prod" ]; then
        prod
    else
        dev
    fi
    
    # Step 3: Wait for services
    print_info "Waiting for services to start..."
    sleep 10
    
    # Step 4: Test
    test_services
    
    print_success "Deployment completed successfully!"
}

# -----------------------------------------------------------------------------
# Stop Services
# -----------------------------------------------------------------------------
stop() {
    print_header "Stopping Services"
    
    $DOCKER_COMPOSE down
    
    print_success "All services stopped"
}

# -----------------------------------------------------------------------------
# Clean Up
# -----------------------------------------------------------------------------
clean() {
    print_header "Cleaning Up Docker Resources"
    
    print_warning "This will remove all containers, images, and volumes for this project!"
    read -p "Are you sure? (y/N): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        print_info "Stopping containers..."
        $DOCKER_COMPOSE down -v --remove-orphans
        
        print_info "Removing images..."
        docker images | grep "$PROJECT_NAME" | awk '{print $3}' | xargs -r docker rmi -f
        
        print_info "Pruning unused resources..."
        docker system prune -f
        
        print_success "Cleanup completed!"
    else
        print_info "Cleanup cancelled"
    fi
}

# -----------------------------------------------------------------------------
# Logs
# -----------------------------------------------------------------------------
logs() {
    SERVICE="${1:-}"
    
    if [ -n "$SERVICE" ]; then
        $DOCKER_COMPOSE logs -f "$SERVICE"
    else
        $DOCKER_COMPOSE logs -f
    fi
}

# -----------------------------------------------------------------------------
# Shell Access
# -----------------------------------------------------------------------------
shell() {
    SERVICE="${1:-backend}"
    
    print_info "Opening shell in $SERVICE container..."
    $DOCKER_COMPOSE exec "$SERVICE" sh
}

# -----------------------------------------------------------------------------
# Status
# -----------------------------------------------------------------------------
status() {
    print_header "Service Status"
    
    $DOCKER_COMPOSE ps
    
    echo ""
    print_info "Container Resources:"
    docker stats --no-stream $(docker compose ps -q) 2>/dev/null || true
}

# -----------------------------------------------------------------------------
# Backup Database
# -----------------------------------------------------------------------------
backup_db() {
    print_header "Backing Up Database"
    
    BACKUP_DIR="./backups"
    BACKUP_FILE="$BACKUP_DIR/mongodb-backup-$(date +%Y%m%d-%H%M%S).gz"
    
    mkdir -p "$BACKUP_DIR"
    
    print_info "Creating backup..."
    docker compose exec -T mongodb mongodump --archive --gzip > "$BACKUP_FILE"
    
    print_success "Backup saved to: $BACKUP_FILE"
}

# -----------------------------------------------------------------------------
# Restore Database
# -----------------------------------------------------------------------------
restore_db() {
    BACKUP_FILE="${1:-}"
    
    if [ -z "$BACKUP_FILE" ]; then
        print_error "Please specify a backup file: ./deploy.sh restore-db <backup-file>"
        exit 1
    fi
    
    if [ ! -f "$BACKUP_FILE" ]; then
        print_error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
    
    print_header "Restoring Database"
    
    print_warning "This will overwrite existing data!"
    read -p "Are you sure? (y/N): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        print_info "Restoring from: $BACKUP_FILE"
        cat "$BACKUP_FILE" | docker compose exec -T mongodb mongorestore --archive --gzip --drop
        print_success "Database restored!"
    else
        print_info "Restore cancelled"
    fi
}

# -----------------------------------------------------------------------------
# Usage
# -----------------------------------------------------------------------------
usage() {
    echo "Rose Chemicals Docker Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  dev           Start development environment with hot-reload"
    echo "  prod          Start production environment"
    echo "  deploy [mode] Full pipeline: build → start → test (default: prod)"
    echo "  build [mode]  Build Docker images only (dev|prod)"
    echo "  test          Test all services"
    echo "  stop          Stop all services"
    echo "  clean         Remove all containers, images, and volumes"
    echo "  logs [svc]    View logs (optionally for specific service)"
    echo "  shell [svc]   Open shell in container (default: backend)"
    echo "  status        Show service status"
    echo "  backup-db     Backup MongoDB database"
    echo "  restore-db    Restore MongoDB from backup"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh dev              # Start development"
    echo "  ./deploy.sh deploy prod      # Full production deployment"
    echo "  ./deploy.sh logs frontend    # View frontend logs"
    echo "  ./deploy.sh shell backend    # Open backend shell"
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
COMMAND="${1:-help}"
shift || true

case "$COMMAND" in
    dev)
        dev "$@"
        ;;
    prod)
        prod "$@"
        ;;
    deploy)
        deploy "$@"
        ;;
    build)
        build "$@"
        ;;
    test)
        test_services "$@"
        ;;
    stop)
        stop "$@"
        ;;
    clean)
        clean "$@"
        ;;
    logs)
        logs "$@"
        ;;
    shell)
        shell "$@"
        ;;
    status)
        status "$@"
        ;;
    backup-db)
        backup_db "$@"
        ;;
    restore-db)
        restore_db "$@"
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        print_error "Unknown command: $COMMAND"
        usage
        exit 1
        ;;
esac

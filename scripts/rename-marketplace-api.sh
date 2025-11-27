#!/bin/bash

# Script to rename @0xsequence/marketplace-api to a better name
# This package is a client adapter layer for Sequence services (Builder, Indexer, Marketplace, Metadata)
# and should not be confused with the actual Sequence Marketplace backend API

set -e  # Exit on error

# ============================================
# Configuration - Edit these values
# ============================================
OLD_NAME="@0xsequence/marketplace-api"
NEW_NAME="@0xsequence/api-client"
OLD_DIR_NAME="marketplace-api"
NEW_DIR_NAME="api-client"

# ============================================
# Script options
# ============================================
DRY_RUN=false
VERBOSE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --dry-run    Show what would be changed without making changes"
            echo "  --verbose    Show detailed output"
            echo "  --help       Show this help message"
            echo ""
            echo "Edit the script to configure the new package name:"
            echo "  OLD_NAME=\"$OLD_NAME\""
            echo "  NEW_NAME=\"$NEW_NAME\""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# ============================================
# Colors and formatting
# ============================================
if [[ -t 1 ]]; then
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    RED='\033[0;31m'
    BOLD='\033[1m'
    NC='\033[0m'
else
    GREEN=''
    YELLOW=''
    BLUE=''
    RED=''
    BOLD=''
    NC=''
fi

# ============================================
# Helper functions
# ============================================

log_header() {
    echo ""
    echo -e "${BOLD}========================================${NC}"
    echo -e "${BOLD}$1${NC}"
    echo -e "${BOLD}========================================${NC}"
    echo ""
}

log_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_info() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "  $1"
    fi
}

# Function to safely replace text in file
replace_in_file() {
    local file=$1
    local old=$2
    local new=$3
    
    if [[ ! -f "$file" ]]; then
        return
    fi
    
    if grep -q "$old" "$file"; then
        if [[ "$DRY_RUN" == "true" ]]; then
            log_info "Would update: $file"
            if [[ "$VERBOSE" == "true" ]]; then
                echo -e "${YELLOW}    Matches found:${NC}"
                grep -n "$old" "$file" | head -3
                if [[ $(grep -c "$old" "$file") -gt 3 ]]; then
                    echo "    ... and $(($(grep -c "$old" "$file") - 3)) more"
                fi
            fi
        else
            # Use different sed syntax for macOS vs Linux
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|$old|$new|g" "$file"
            else
                sed -i "s|$old|$new|g" "$file"
            fi
            log_success "Updated: $file"
        fi
    fi
}

# Function to replace text in all files matching a pattern
replace_in_files() {
    local pattern=$1
    local old=$2
    local new=$3
    local description=$4
    
    log_section "$description"
    
    local count=0
    
    # Find files and replace (excluding node_modules, dist, and .git)
    while IFS= read -r -d '' file; do
        if grep -q "$old" "$file" 2>/dev/null; then
            replace_in_file "$file" "$old" "$new"
            ((count++))
        fi
    done < <(find . -type f -name "$pattern" \
        -not -path "*/node_modules/*" \
        -not -path "*/dist/*" \
        -not -path "*/.git/*" \
        -not -path "*/pnpm-lock.yaml" \
        -print0 2>/dev/null)
    
    if [[ $count -eq 0 ]]; then
        log_info "No files matched pattern: $pattern"
    else
        log_success "Processed $count file(s)"
    fi
}

# Function to check for backend API URL references
check_backend_urls() {
    log_section "Checking for backend API URL references (these should NOT be changed)"
    
    local files_with_urls=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
        -not -path "*/node_modules/*" \
        -not -path "*/dist/*" \
        -not -path "*/.git/*" \
        -exec grep -l "marketplace-api\.sequence\.app" {} \; 2>/dev/null)
    
    if [[ -n "$files_with_urls" ]]; then
        log_warning "Found files with 'marketplace-api.sequence.app' URLs:"
        echo "$files_with_urls" | while read -r file; do
            echo "    - $file"
        done
        echo ""
        echo -e "${YELLOW}  These URLs refer to the actual backend API and will NOT be changed${NC}"
    else
        log_info "No backend API URLs found"
    fi
}

# ============================================
# Main script
# ============================================

log_header "Package Rename Script"

if [[ "$DRY_RUN" == "true" ]]; then
    log_warning "DRY RUN MODE - No files will be modified"
fi

echo "Configuration:"
echo "  Old package name: $OLD_NAME"
echo "  New package name: $NEW_NAME"
echo "  Old directory name: $OLD_DIR_NAME"
echo "  New directory name: $NEW_DIR_NAME"
echo ""

# Confirmation prompt (skip in dry-run mode)
if [[ "$DRY_RUN" == "false" ]]; then
    read -p "Continue with rename? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# Step 1: Update package.json files
replace_in_files "package.json" "$OLD_NAME" "$NEW_NAME" "Step 1: Updating package.json files"

# Step 2: Update TypeScript imports
replace_in_files "*.ts" "from '$OLD_NAME'" "from '$NEW_NAME'" "Step 2: Updating imports in .ts files"
replace_in_files "*.tsx" "from '$OLD_NAME'" "from '$NEW_NAME'" "Step 2: Updating imports in .tsx files"

# Step 3: Update TypeScript imports with subpaths
replace_in_files "*.ts" "from '$OLD_NAME/" "from '$NEW_NAME/" "Step 3: Updating subpath imports in .ts files"
replace_in_files "*.tsx" "from '$OLD_NAME/" "from '$NEW_NAME/" "Step 3: Updating subpath imports in .tsx files"

# Step 4: Update comments
replace_in_files "*.ts" "// $OLD_NAME" "// $NEW_NAME" "Step 4: Updating comments in .ts files"
replace_in_files "*.tsx" "// $OLD_NAME" "// $NEW_NAME" "Step 4: Updating comments in .tsx files"

# Step 5: Update markdown documentation
replace_in_files "*.md" "$OLD_NAME" "$NEW_NAME" "Step 5: Updating markdown files"

# Step 6: Update CHANGELOG references (directory name)
replace_in_files "CHANGELOG.md" "$OLD_DIR_NAME" "$NEW_DIR_NAME" "Step 6: Updating CHANGELOG directory references"

# Step 7: Update test files
replace_in_files "*.test.ts" "$OLD_NAME" "$NEW_NAME" "Step 7: Updating .test.ts files"
replace_in_files "*.test.tsx" "$OLD_NAME" "$NEW_NAME" "Step 7: Updating .test.tsx files"

# Step 8: Update generated file headers
replace_in_files "*.gen.ts" "$OLD_DIR_NAME@v" "$NEW_DIR_NAME@v" "Step 8: Updating generated file headers"

# Step 9: Update type assertion and utility files
replace_in_files "type-assertions.ts" "$OLD_DIR_NAME package" "$NEW_DIR_NAME package" "Step 9: Updating type assertion comments"

# Step 10: Update environment override files in playgrounds
log_section "Step 10: Updating playground environment files"
if [[ -d "./playgrounds" ]]; then
    find ./playgrounds -type f \( -name "*.ts" -o -name "*.tsx" \) \
        -not -path "*/node_modules/*" \
        -not -path "*/dist/*" \
        -print0 2>/dev/null | while IFS= read -r -d '' file; do
        replace_in_file "$file" "$OLD_NAME" "$NEW_NAME"
    done
    log_success "Processed playground files"
else
    log_info "No playgrounds directory found"
fi

# Step 11: Check backend URLs
check_backend_urls

# ============================================
# Summary
# ============================================

log_header "Summary"

if [[ "$DRY_RUN" == "true" ]]; then
    echo -e "${YELLOW}DRY RUN completed - no files were modified${NC}"
    echo ""
    echo "To apply these changes, run:"
    echo "  $0"
else
    log_success "Rename completed successfully!"
fi

echo ""
echo "Next steps:"
echo ""
echo "  1. Review changes:       git diff"
echo "  2. Run installation:     pnpm install"
echo "  3. Build packages:       pnpm build"
echo "  4. Run tests:            pnpm test"

if [[ "$DRY_RUN" == "false" ]]; then
    echo "  5. Commit changes:       git add . && git commit -m 'Rename package to $NEW_NAME'"
fi

echo ""
echo -e "${BLUE}Optional:${NC} Rename the 'api' directory to '$NEW_DIR_NAME'"
echo "  git mv api $NEW_DIR_NAME"
echo "  # Then update pnpm-workspace.yaml"
echo ""

echo -e "${YELLOW}Important notes:${NC}"
echo "  • This is a breaking change requiring a major version bump"
echo "  • URLs like 'marketplace-api.sequence.app' remain unchanged"
echo "  • Users will need to update their imports"
echo ""

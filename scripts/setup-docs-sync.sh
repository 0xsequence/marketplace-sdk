#!/bin/bash

# 🔧 Documentation Sync Setup Script
# This script helps you set up the automated documentation sync workflow

set -e

echo "🚀 Marketplace SDK Documentation Sync Setup"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

# Function to check if DOCS_SYNC_TOKEN secret exists
check_docs_sync_token() {
    if command -v gh &> /dev/null; then
        if gh auth status &> /dev/null; then
            if gh secret list &> /dev/null; then
                if gh secret list | grep -q "DOCS_SYNC_TOKEN"; then
                    return 0  # Secret exists
                fi
            fi
        fi
    fi
    return 1  # Secret doesn't exist or can't be checked
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "sdk/docs" ]; then
    print_error "This script must be run from the marketplace-sdk root directory"
    exit 1
fi

print_status "Found marketplace-sdk repository structure"

# Check if the workflow file exists
if [ ! -f ".github/workflows/sync-docs.yml" ]; then
    print_error "Workflow file not found. Please ensure sync-docs.yml exists in .github/workflows/"
    exit 1
fi

print_status "Found sync-docs.yml workflow file"

echo ""
print_step "Step 1: GitHub Repository Configuration"
echo "----------------------------------------"

# Get repository information
REPO_URL=$(git config --get remote.origin.url || echo "")
if [ -z "$REPO_URL" ]; then
    print_error "Could not determine repository URL. Make sure you're in a git repository."
    exit 1
fi

# Extract repository info
if [[ $REPO_URL == *"github.com"* ]]; then
    if [[ $REPO_URL == *".git" ]]; then
        REPO_INFO=$(echo $REPO_URL | sed 's/.*github\.com[\/:]//g' | sed 's/\.git$//g')
    else
        REPO_INFO=$(echo $REPO_URL | sed 's/.*github\.com\///g')
    fi
    print_status "Repository: $REPO_INFO"
else
    print_error "This doesn't appear to be a GitHub repository"
    exit 1
fi

echo ""
print_step "Step 2: Personal Access Token (PAT) Setup"
echo "------------------------------------------"

# Check if DOCS_SYNC_TOKEN already exists
if check_docs_sync_token; then
    print_status "DOCS_SYNC_TOKEN secret already exists in repository"
    print_info "Skipping PAT creation and secret setup steps..."
else
    print_info "You need to create a GitHub Personal Access Token with the following permissions:"
    echo "  • repo (Full control of private repositories)"
    echo "  • workflow (Update GitHub Action workflows)"
    echo ""
    print_info "Follow these steps:"
    echo "  1. Go to: https://github.com/settings/tokens"
    echo "  2. Click 'Generate new token (classic)'"
    echo "  3. Name: 'marketplace-sdk-docs-sync'"
    echo "  4. Select scopes: 'repo' and 'workflow'"
    echo "  5. Click 'Generate token'"
    echo "  6. Copy the token (you won't see it again!)"
    echo ""

    read -p "Press Enter when you have created and copied your PAT..."

    echo ""
    print_step "Step 3: Repository Secret Configuration"
    echo "---------------------------------------"

    print_info "Now you need to add the PAT as a repository secret:"
    echo "  1. Go to: https://github.com/$REPO_INFO/settings/secrets/actions"
    echo "  2. Click 'New repository secret'"
    echo "  3. Name: DOCS_SYNC_TOKEN"
    echo "  4. Value: Paste your PAT"
    echo "  5. Click 'Add secret'"
    echo ""

    read -p "Press Enter when you have added the DOCS_SYNC_TOKEN secret..."
fi

echo ""
print_step "Step 3: Validation"
echo "-------------------"

# Check if we can detect the secret (we can't actually read it, but we can check the API)
print_info "Validating setup..."

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    print_status "GitHub CLI found, attempting to validate repository access..."
    
    if gh auth status &> /dev/null; then
        print_status "GitHub CLI is authenticated"
        
        # Try to list secrets (this will show if the secret exists but not its value)
        if gh secret list &> /dev/null; then
            if gh secret list | grep -q "DOCS_SYNC_TOKEN"; then
                print_status "DOCS_SYNC_TOKEN secret found in repository"
            else
                print_warning "DOCS_SYNC_TOKEN secret not found. Please double-check you added it correctly."
            fi
        else
            print_warning "Cannot access repository secrets. This might be normal if you don't have admin access."
        fi
    else
        print_warning "GitHub CLI not authenticated. Cannot validate secret setup."
    fi
else
    print_warning "GitHub CLI not found. Cannot validate secret setup automatically."
fi

echo ""
print_step "Step 4: Testing the Workflow"
echo "-----------------------------"

print_info "You can test the workflow in several ways:"
echo ""
echo "🧪 Manual Test:"
echo "  1. Go to: https://github.com/$REPO_INFO/actions"
echo "  2. Select 'Sync Documentation to 0xsequence/docs'"
echo "  3. Click 'Run workflow'"
echo "  4. Choose 'main' branch and click 'Run workflow'"
echo ""
echo "🧪 Automatic Test:"
echo "  1. Make a small change to any file in sdk/docs/"
echo "  2. Commit and push to main branch"
echo "  3. Check the Actions tab for the workflow run"
echo ""

# Generate a test file for easy testing
print_info "Creating a test file for you to try..."

TEST_FILE="sdk/docs/test-sync-$(date +%Y%m%d-%H%M%S).md"
cat > "$TEST_FILE" << EOF
# Test Sync File

This is a test file created by the docs sync setup script.

- Created: $(date)
- Purpose: Testing automated documentation sync
- Repository: $REPO_INFO

You can delete this file after confirming the sync works.
EOF

print_status "Created test file: $TEST_FILE"
print_info "You can commit and push this file to test the sync workflow."

echo ""
print_info "📝 Note: Only README.md is excluded from sync"
echo "  • README.md (internal setup guide) - stays in your repo only"
echo "  • All other files (including test files) will be synced to 0xsequence/docs"
print_info "Test files will appear in the target repository and should be cleaned up after testing"

echo ""
print_step "Step 5: Cleanup and Next Steps"
echo "-------------------------------"

echo "📋 What to do next:"
echo "  1. ✅ Commit the test file (if you want to test)"
echo "  2. ✅ Push to main branch"
echo "  3. ✅ Watch the Actions tab for workflow execution"
echo "  4. ✅ Check 0xsequence/docs for the created PR"
echo "  5. ✅ Delete the test file after successful test"
echo ""

print_step "Important Notes"
echo "---------------"
print_warning "Security:"
echo "  • Keep your PAT secure and don't share it"
echo "  • The workflow only runs on the main repository (safety check included)"
echo "  • Always review PRs before merging"
echo ""

print_warning "Maintenance:"
echo "  • PATs expire - set a calendar reminder to renew"
echo "  • Monitor workflow runs for failures"
echo "  • Update the workflow if your needs change"
echo ""

print_status "Setup complete! 🎉"
echo ""
print_info "For detailed information, see: sdk/docs/README.md"
print_info "For troubleshooting, check the workflow logs in the Actions tab"

echo ""
echo "Happy documenting! 📚✨"

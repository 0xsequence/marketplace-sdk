#!/bin/bash

# Script to analyze the impact of renaming @0xsequence/marketplace-api
# This shows statistics and examples without making any changes

set -e

# Configuration
OLD_NAME="@0xsequence/marketplace-api"
SEARCH_ROOT="."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

log_header() {
    echo ""
    echo -e "${BOLD}========================================${NC}"
    echo -e "${BOLD}$1${NC}"
    echo -e "${BOLD}========================================${NC}"
}

log_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
}

log_stat() {
    echo -e "${GREEN}  $1:${NC} $2"
}

log_header "Rename Impact Analysis"
echo "Package: $OLD_NAME"
echo ""

# Count package.json references
log_section "Package References"
PACKAGE_JSON_COUNT=$(find . -name "package.json" \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -exec grep -l "$OLD_NAME" {} \; 2>/dev/null | wc -l | tr -d ' ')
log_stat "package.json files" "$PACKAGE_JSON_COUNT"

if [[ $PACKAGE_JSON_COUNT -gt 0 ]]; then
    echo ""
    echo -e "${YELLOW}  Files:${NC}"
    find . -name "package.json" \
        -not -path "*/node_modules/*" \
        -not -path "*/dist/*" \
        -exec grep -l "$OLD_NAME" {} \; 2>/dev/null | while read -r file; do
        echo "    - $file"
    done
fi

# Count TypeScript/TSX imports
log_section "Import Statements"
TS_IMPORT_COUNT=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -not -path "*/.git/*" \
    -exec grep -l "from '$OLD_NAME" {} \; 2>/dev/null | wc -l | tr -d ' ')
log_stat "Files with imports" "$TS_IMPORT_COUNT"

TOTAL_IMPORTS=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -not -path "*/.git/*" \
    -exec grep -h "from '$OLD_NAME" {} \; 2>/dev/null | wc -l | tr -d ' ')
log_stat "Total import lines" "$TOTAL_IMPORTS"

if [[ $TS_IMPORT_COUNT -gt 0 ]]; then
    echo ""
    echo -e "${YELLOW}  Sample imports:${NC}"
    find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
        -not -path "*/node_modules/*" \
        -not -path "*/dist/*" \
        -not -path "*/.git/*" \
        -exec grep "from '$OLD_NAME" {} \; 2>/dev/null | head -5 | while read -r line; do
        echo "    $line"
    done
    if [[ $TOTAL_IMPORTS -gt 5 ]]; then
        echo "    ... and $((TOTAL_IMPORTS - 5)) more"
    fi
fi

# Count subpath imports
log_section "Subpath Imports"
SUBPATH_COUNT=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -not -path "*/.git/*" \
    -exec grep -l "from '$OLD_NAME/" {} \; 2>/dev/null | wc -l | tr -d ' ')
log_stat "Files with subpath imports" "$SUBPATH_COUNT"

if [[ $SUBPATH_COUNT -gt 0 ]]; then
    echo ""
    echo -e "${YELLOW}  Subpaths used:${NC}"
    find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
        -not -path "*/node_modules/*" \
        -not -path "*/dist/*" \
        -not -path "*/.git/*" \
        -exec grep -oh "from '$OLD_NAME/[^']*" {} \; 2>/dev/null | sort -u | while read -r path; do
        echo "    $path'"
    done
fi

# Count test files
log_section "Test Files"
TEST_COUNT=$(find . -type f \( -name "*.test.ts" -o -name "*.test.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -exec grep -l "$OLD_NAME" {} \; 2>/dev/null | wc -l | tr -d ' ')
log_stat "Test files affected" "$TEST_COUNT"

# Count comments
log_section "Comments & Documentation"
COMMENT_COUNT=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -exec grep -l "// $OLD_NAME" {} \; 2>/dev/null | wc -l | tr -d ' ')
log_stat "Files with comments" "$COMMENT_COUNT"

MARKDOWN_COUNT=$(find . -name "*.md" \
    -not -path "*/node_modules/*" \
    -exec grep -l "$OLD_NAME" {} \; 2>/dev/null | wc -l | tr -d ' ')
log_stat "Markdown files" "$MARKDOWN_COUNT"

# Backend API URLs (should NOT be changed)
log_section "Backend API URLs (Will NOT be changed)"
BACKEND_URL_COUNT=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -exec grep -l "marketplace-api\.sequence\.app" {} \; 2>/dev/null | wc -l | tr -d ' ')
log_stat "Files with backend URLs" "$BACKEND_URL_COUNT"

if [[ $BACKEND_URL_COUNT -gt 0 ]]; then
    echo ""
    echo -e "${YELLOW}  These URLs will be preserved:${NC}"
    find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
        -not -path "*/node_modules/*" \
        -not -path "*/dist/*" \
        -exec grep -oh "https://[^\"']*marketplace-api\.sequence\.app[^\"']*" {} \; 2>/dev/null | sort -u | head -3 | while read -r url; do
        echo "    $url"
    done
fi

# Breakdown by area
log_section "Breakdown by Area"

SDK_COUNT=$(find ./sdk -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    2>/dev/null | xargs grep -l "$OLD_NAME" 2>/dev/null | wc -l | tr -d ' ')
log_stat "SDK files" "$SDK_COUNT"

API_COUNT=$(find ./api -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    2>/dev/null | xargs grep -l "$OLD_NAME" 2>/dev/null | wc -l | tr -d ' ')
log_stat "API package files" "$API_COUNT"

PLAYGROUND_COUNT=$(find ./playgrounds -type f \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    2>/dev/null | xargs grep -l "$OLD_NAME" 2>/dev/null | wc -l | tr -d ' ')
log_stat "Playground files" "$PLAYGROUND_COUNT"

# File type breakdown
log_section "File Types"

TS_COUNT=$(find . -name "*.ts" \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -not -path "*/.git/*" \
    -exec grep -l "$OLD_NAME" {} \; 2>/dev/null | wc -l | tr -d ' ')
log_stat ".ts files" "$TS_COUNT"

TSX_COUNT=$(find . -name "*.tsx" \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -not -path "*/.git/*" \
    -exec grep -l "$OLD_NAME" {} \; 2>/dev/null | wc -l | tr -d ' ')
log_stat ".tsx files" "$TSX_COUNT"

JSON_COUNT=$(find . -name "*.json" \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -not -path "*/pnpm-lock.yaml" \
    -exec grep -l "$OLD_NAME" {} \; 2>/dev/null | wc -l | tr -d ' ')
log_stat ".json files" "$JSON_COUNT"

# Summary
log_section "Summary"

TOTAL_FILES=$((TS_COUNT + TSX_COUNT + JSON_COUNT + MARKDOWN_COUNT))

echo -e "${GREEN}Total files to be modified: ~$TOTAL_FILES${NC}"
echo ""
echo "Categories:"
echo "  • TypeScript files:  $TS_COUNT"
echo "  • TSX files:         $TSX_COUNT"
echo "  • JSON files:        $JSON_COUNT"
echo "  • Markdown files:    $MARKDOWN_COUNT"
echo ""
echo "Changes:"
echo "  • Import statements: ~$TOTAL_IMPORTS"
echo "  • Subpath imports:   ~$SUBPATH_COUNT files"
echo "  • Test files:        $TEST_COUNT"
echo ""
echo -e "${YELLOW}Note:${NC} Backend API URLs in $BACKEND_URL_COUNT files will be preserved"
echo ""

log_section "Suggested Package Names"
echo "Based on the package's purpose (client adapters for multiple Sequence services):"
echo ""
echo "  1. @0xsequence/api-client       (Recommended - clear and concise)"
echo "  2. @0xsequence/service-adapters (Descriptive of adapter pattern)"
echo "  3. @0xsequence/api-adapters     (Similar to #2, shorter)"
echo "  4. @0xsequence/clients          (Very short, but might be ambiguous)"
echo ""

log_section "Next Steps"
echo "1. Review this analysis"
echo "2. Choose a new package name"
echo "3. Edit scripts/rename-marketplace-api.sh and update NEW_NAME"
echo "4. Run a dry-run: ./scripts/rename-marketplace-api.sh --dry-run"
echo "5. Execute rename: ./scripts/rename-marketplace-api.sh"
echo ""

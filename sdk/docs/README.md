# 📚 Documentation Sync Setup

Automated synchronization between `marketplace-sdk` documentation and `0xsequence/docs` repository.

## What It Does

Automatically syncs documentation from `sdk/docs/` to the docs repository when changes are pushed to main branch.

## Quick Setup

### 1. Create Personal Access Token (PAT)
1. Go to [GitHub Settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Name: `marketplace-sdk-docs-sync`
4. Select scopes: `repo` and `workflow`
5. Generate and copy the token

### 2. Add Repository Secret
1. Go to your repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `DOCS_SYNC_TOKEN`
4. Value: Paste your PAT

## How It Works

**Triggers:**
- Push to main/master branch with changes in `sdk/docs/`
- Manual trigger from Actions tab

**Process:**
1. Copies files from `sdk/docs/` to `0xsequence/docs`
2. Creates a timestamped branch (`sync-marketplace-docs-YYYYMMDD-HHMMSS`)
3. Opens a pull request with your changes

## Testing

**Manual Test:**
1. Go to Actions tab → "Sync Documentation to 0xsequence/docs"
2. Click "Run workflow"

**Automatic Test:**
1. Edit any file in `sdk/docs/`
2. Commit and push to main
3. Check Actions tab for workflow run

## Troubleshooting

**Common Issues:**
- `DOCS_SYNC_TOKEN` not set or expired
- Insufficient token permissions
- No write access to target repository

**Check:**
- Repository secrets are properly configured
- Token has `repo` and `workflow` scopes
- You're a collaborator on `0xsequence/docs`

---

*Use the setup script `scripts/setup-docs-sync.sh` for guided configuration.*

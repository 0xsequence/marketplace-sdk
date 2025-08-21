# 📚 Documentation Sync Setup Guide

This guide explains how to set up automated documentation synchronization between the `marketplace-sdk` repository and the `0xsequence/docs` repository using GitHub Actions.

## 🎯 What This Does

The GitHub Actions workflow automatically:
1. **Monitors** the `sdk/docs/` directory for changes
2. **Triggers** when changes are pushed to the main branch
3. **Copies** documentation files to the `0xsequence/docs` repository
4. **Creates** a pull request with the updated documentation
5. **Includes** detailed information about the source of changes

## 📋 Prerequisites

Before the workflow can function, you need to set up proper authentication:

### 1. Create a Personal Access Token (PAT)

You need a GitHub Personal Access Token with the following permissions:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "marketplace-sdk-docs-sync"
4. Set expiration as needed (recommend 1 year)
5. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)

### 2. Add the Token as a Repository Secret

1. Go to your `marketplace-sdk` repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `DOCS_SYNC_TOKEN`
5. Value: The PAT you created above

## 🚀 How It Works

### Workflow Triggers

The workflow runs when:
- Changes are pushed to the `main` or `master` branch
- The changes include files in the `sdk/docs/` directory
- You manually trigger it from the Actions tab (workflow_dispatch)

### Workflow Steps

1. **Checkout Source**: Gets the latest code from marketplace-sdk
2. **Configure Git**: Sets up git with proper credentials
3. **Checkout Docs Repo**: Clones the 0xsequence/docs repository
4. **Create Branch**: Creates a unique branch with timestamp
5. **Copy Files**: Copies all files from `sdk/docs/` to `marketplace-sdk/` in the docs repo
6. **Check Changes**: Determines if there are actual changes to commit
7. **Create PR**: If changes exist, creates a pull request with detailed information

### Branch Naming

Each sync creates a unique branch with the format:
```
sync-marketplace-docs-YYYYMMDD-HHMMSS
```

Example: `sync-marketplace-docs-20241215-143022`

### PR Details

The created pull request includes:
- **Title**: 📚 Sync Marketplace SDK Documentation
- **Detailed body** with source information
- **Labels**: documentation, marketplace-sdk, automated
- **Reviewer**: The person who triggered the workflow
- **Commit details**: Including the exact source commit hash

## 🔧 Configuration Options

### Customizing the Workflow

You can modify the workflow file (`.github/workflows/sync-docs.yml`) to:

1. **Change target directory**: Modify the copy command in the "Copy documentation files" step
2. **Add file filtering**: Use rsync with exclude patterns if you want to skip certain files
3. **Modify PR template**: Update the title, body, and labels in the "Create pull request" step
4. **Change triggers**: Modify the `on` section to trigger on different events

### Example Customizations

**Filter out certain file types:**
```yaml
- name: Copy documentation files
  run: |
    mkdir -p docs-repo/marketplace-sdk
    rsync -av --exclude='*.tmp' --exclude='*.log' sdk/docs/ docs-repo/marketplace-sdk/
```

**Add additional reviewers:**
```yaml
reviewers: |
  ${{ github.actor }}
  your-username
  another-reviewer
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Resource not accessible by integration" error**
   - Check that the `DOCS_SYNC_TOKEN` secret is properly set
   - Verify the token has `repo` and `workflow` permissions
   - Ensure the token hasn't expired

2. **"No changes detected" when changes exist**
   - Check that files are actually different between repositories
   - Verify the copy command is working correctly
   - Look at the workflow logs for file listing output

3. **Permission denied on target repository**
   - Ensure the token has write access to the `0xsequence/docs` repository
   - Verify you're a collaborator on the target repository

### Debug Mode

To enable more verbose logging, add this step before the copy operation:

```yaml
- name: Debug - List source files
  run: |
    echo "Source documentation files:"
    find sdk/docs -type f | head -20
```

## 📊 Monitoring

### Viewing Workflow Runs

1. Go to the "Actions" tab in your repository
2. Look for "Sync Documentation to 0xsequence/docs" workflow
3. Click on any run to see detailed logs
4. Check the summary to see if a PR was created

### Notifications

You'll receive notifications when:
- The workflow fails
- A pull request is created (if you're set as a reviewer)
- Someone reviews/merges the created PR

## 🔐 Security Considerations

1. **Token Security**: The PAT should only have the minimum required permissions
2. **Repository Check**: The workflow includes a safety check to only run on the main repository
3. **Branch Protection**: Consider setting up branch protection rules on the docs repository
4. **Review Process**: Always review the created PRs before merging

## 🚀 Manual Triggering

To manually trigger the sync:

1. Go to the "Actions" tab in your repository
2. Select "Sync Documentation to 0xsequence/docs"
3. Click "Run workflow"
4. Choose the branch and click "Run workflow"

This is useful for:
- Testing the setup
- Syncing documentation after making the initial configuration
- Re-syncing if a previous run failed

## 📝 Best Practices

1. **Regular Reviews**: Set up regular reviews of documentation PRs
2. **Clear Commit Messages**: The workflow creates descriptive commit messages automatically
3. **Testing**: Test the workflow in a fork first if you're unsure
4. **Monitoring**: Keep an eye on workflow runs and address failures promptly
5. **Documentation**: Keep this guide updated as you modify the workflow

---

*This automated sync helps keep documentation up-to-date across repositories while maintaining proper review processes.*

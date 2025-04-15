## Development

### Local Testing

To test changes locally without publishing to npm:

1. In the CLI tool's directory:
   ```bash
   # Clone the repository (if you haven't already)
   git clone <your-repo-url>
   cd <repo-directory>

   # Install all dependencies (IMPORTANT: Do this first!)
   npm install

   # Create a global link
   npm link
   ```

2. In a test directory (anywhere else on your system):
   ```bash
   # Create a new directory for testing
   mkdir test-bot && cd test-bot

   # Link to your local version
   npm link create-openchat-bot

   # Test the command
   npx create-openchat-bot
   ```

3. Make changes to the code and test them immediately. The changes will be reflected when you run the command again.

4. When you're done testing:
   ```bash
   # In your test directory
   npm unlink create-openchat-bot

   # In your CLI tool's directory
   npm unlink
   ```

### Publishing Changes

When you're ready to publish your changes:

1. Update the version in `package.json`
2. Commit your changes
3. Create a new tag
4. Push to GitHub
5. Publish to npm:
   ```bash
   npm publish
   ```

### Updating & Publishing the package: 
1. Update version number: 
- ``npm version patch`` - for small bug fixes (e.g., 1.0.0 → 1.0.1)
- ``npm version minor`` - for new features (e.g., 1.0.0 → 1.1.0)
- ``npm version major`` - for breaking changes (e.g., 1.0.0 → 2.0.0)

2. After updating the version, you'll need to:
```bash
   git add .
   git commit -m "chore: bump version to x.x.x"
   git tag vx.x.x
   git push origin main --tags
```

3. Then you can publish the new version: 
```bash 
   npm publish
``` 
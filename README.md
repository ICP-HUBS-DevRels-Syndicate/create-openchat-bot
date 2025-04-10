# Create OpenChat Bot

A CLI tool to quickly scaffold OpenChat bot templates.

## Installation

```bash
npm install -g create-openchat-bot
```

## Usage

```bash
npx create-openchat-bot
```

This will:
1. Ask you which type of bot you want to create (offchain or onchain)
2. Ask for your bot's name
3. Create a new directory with the template
4. Set up the necessary configuration
5. Run the appropriate setup script

## Bot Types

### Offchain Bot
- Runs on your local machine
- Good for development and testing
- No Internet Computer deployment needed
- Quick setup and iteration

### Onchain Bot
- Deploys to the Internet Computer
- Runs on the blockchain
- More complex setup
- Requires DFX and Internet Computer tools

## Prerequisites

### For Offchain Bots
- [Rust](https://www.rust-lang.org/tools/install)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (for identity management)

### For Onchain Bots
- [Rust](https://www.rust-lang.org/tools/install)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- Internet Computer tools

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

## License

MIT 
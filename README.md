# OpenChat Bots Tutorial

This repository contains comprehensive resources for creating AI-powered bots in the OpenChat ecosystem. It includes a template for getting started and examples of both off-chain and on-chain bot implementations.

## Directory Structure

1. `openchat-bot-template/` - A starter template that can be forked or installed to begin creating OpenChat bots
2. `openchat-bot-offchain-example/` - An example implementation of an off-chain OpenChat bot
3. `openchat-bot-onchain-example/` - An example implementation of an on-chain OpenChat bot (running as a canister)

## Getting Started

Each directory contains its own README with specific instructions for that implementation. Choose the approach that best fits your needs:

- Use the template if you want to start from scratch
- Check the off-chain example if you want to run a bot without deploying a canister
- Check the on-chain example if you want to deploy your bot as a canister on the Internet Computer

## Prerequisites

- Node.js (v16 or higher)
- dfx (for on-chain development)
- OpenChat account and API credentials
- Basic knowledge of JavaScript/TypeScript
- For on-chain development: knowledge of Motoko or Rust

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. We welcome improvements to the examples and documentation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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

To contribute to this tool:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Link the package locally:
   ```bash
   npm link
   ```
4. Make your changes
5. Test using:
   ```bash
   create-openchat-bot
   ```

## License

MIT 
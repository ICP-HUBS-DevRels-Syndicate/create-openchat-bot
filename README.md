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

## Overview: 
You can find an overview of the OpenChat Bot framework [here](https://github.com/open-chat-labs/open-chat-bots/blob/main/OVERVIEW.md)

## SDKs: 
SDKs are available in different languages: 
- Rust SDK, see the documentation [here](https://github.com/open-chat-labs/open-chat-bots/blob/main/rs/README.md)
- Typescript SDK, see the documentation [here](https://github.com/open-chat-labs/open-chat-bots/blob/main/ts/README.md)
- Motoko SDK, see the documentation [here](https://github.com/open-chat-labs/open-chat-bots/blob/main/motoko/README.md)


### Note: _This package is in beta mode and it currently only supports the Rust SDK, the motoko and typescript sdk are in the pipeline._

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

For both onchain and offchain bot, you need to have installed the following tools: 
- [Rust](https://www.rust-lang.org/tools/install)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (for identity management)

# Registering Your Bot

Follow the instructions [here](https://github.com/ICP-HUBS-DevRels-Syndicate/openchat-bots/blob/main/REGISTER-BOT.md)

## License

MIT 
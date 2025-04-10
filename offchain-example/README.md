# Offchain Bot Example

This repository contains an example of an offchain bot built using the OpenChat Bot SDK. This guide will walk you through setting up, deploying, and understanding the bot.

## Getting Started

### Prerequisites
- dfx installed
- [Rust](https://www.rust-lang.org/tools/install) installed
- Git installed

### Step 1: Clone the Repository
```bash
git clone https://github.com/open-chat-labs/open-chat-bots.git
cd open-chat-bots/offchain-example
```

### Step 2: Deploy the Bot
The repository includes a setup script that handles the entire deployment process. Simply run:
```bash
./scripts/setup_bot.sh
```

This script will:
1. Create a new identity for the bot
2. Export the identity to a PEM file
3. Fetch the OpenChat public key
4. Create the necessary configuration file
5. Build and run the bot

### Step 3: Register the Bot

Please follow the instructions in [REGISTER-BOT.md](../../REGISTER-BOT.md) to register and install your bot in OpenChat.

And that's how you deploy, register and run your bot!

Now let's understand how the different code logic of the bot works.

## Understanding the Setup Script

The setup process is handled by the `setup_bot.sh` script. Let's examine it in detail:

```bash
# Exit on error
set -e

echo "Setting up OpenChat offchain bot environment..."

# Step 1: Create new identity
echo "Creating new identity 'bot_identity'..."
dfx identity new bot_identity --storage-mode=plaintext

# Step 2: Export identity to PEM file
echo "Exporting identity to PEM file..."
dfx identity export bot_identity > identity.pem

# Step 3: Get OpenChat public key
echo "Fetching OpenChat public key..."
OC_PUBLIC_KEY=$(curl -s https://oc.app/public-key)

# Step 4: Create config.toml
echo "Creating config.toml..."
cat > config.toml << EOF
pem_file = "./identity.pem"
ic_url = "https://icp0.io"
port = 8080
oc_public_key = """
$OC_PUBLIC_KEY
"""
log_level = "INFO"
EOF

# Step 5: Build and run
echo "Building and running the bot..."
cargo build && cargo run
```

The script:
1. Creates a new identity for the bot
2. Exports the identity to a PEM file for authentication
3. Fetches the OpenChat public key
4. Creates a configuration file with all necessary settings
5. Builds and runs the bot

## Understanding the Code Structure

The offchain bot example follows a modular Rust project structure. Here's the complete structure:

```
offchain-example/
├── scripts/                    # Setup scripts
│   └── setup_bot.sh           # Main setup script
├── src/                       # Source code
│   ├── config.rs              # Configuration management
│   ├── main.rs                # Main application entry point
│   └── bot.rs                 # Bot implementation
├── Cargo.toml                # Rust dependencies and configuration
├── README.md                 # This documentation
└── config.toml              # Bot configuration file
```

### Key Components

#### 1. Cargo.toml
```toml
[package]
name = "offchain_bot"
version = "0.1.0"
edition = "2021"
description = "A boilerplate for creating offchain bots for OpenChat"
authors = ["Your Name <your.email@example.com>"]
license = "MIT"

[dependencies]
oc_bots_sdk = { git = "https://github.com/open-chat-labs/open-chat-bots.git", branch = "main" }
tokio = { version = "1.36.0", features = ["full"] }
serde = { version = "1.0.193", features = ["derive"] }
serde_json = "1.0.108"
tracing = "0.1.40"
tracing-subscriber = "0.3.18"
toml = "0.8.10"
```

#### 2. src/config.rs
Manages the bot's configuration:
- Loads settings from config.toml
- Handles configuration validation
- Provides type-safe access to settings

#### 3. src/main.rs
The main entry point that:
- Sets up logging
- Loads configuration
- Initializes and runs the bot

#### 4. src/bot.rs
Implements the bot's core functionality:
- Command handling
- Message processing
- OpenChat API integration

### Bot Functionality

The example bot implements a simple echo command that:
1. Accepts a message parameter
2. Sends the message back to the user
3. Supports markdown formatting
4. Handles errors gracefully

### Extending the Bot

To add new commands:
1. Implement new command handlers in `src/bot.rs`
2. Register the commands in the bot's initialization
3. Update the command definitions

You can now build your own custom made offchain bot using this template by adding new commands and logic.
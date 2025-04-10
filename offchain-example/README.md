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
|   ├── commands/ 
|   |      └── echo.rs         # Echo command handler
|   |      └── mod.rs          # exporting echo mod
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

[dependencies]
async-trait = "0.1.86"
axum = "0.8.1"
candid = "0.10.10"
dotenv = "0.15.0"
ic-agent = "0.39.3"
serde = { version = "1.0.217", features = ["derive"] }
serde_json = "1.0.138"
tokio = { version = "1.37.0", features = ["full"] }
toml = "0.8.20"
tower-http = { version = "0.6.2", features = ["cors", "trace"] }
tracing = "0.1.41"
tracing-subscriber = "0.3.19"
oc_bots_sdk = { git = "https://github.com/open-chat-labs/open-chat-bots.git", branch = "main" }
oc_bots_sdk_offchain = { git = "https://github.com/open-chat-labs/open-chat-bots.git", branch = "main" }
reqwest = { version = "0.11", features = ["json"] }

[profile.release]
lto = true
opt-level = "z"
codegen-units = 1
debug = false
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

#### 4. src/commands/echo.rs
Implements the echo command functionality:
- Defines the command structure using `BotCommandDefinition`
- Implements the `CommandHandler` trait for the `Echo` struct
- Handles command execution using the OpenChat API client
- Supports message parameters with validation (min/max length)
- Returns the echoed message to the user

The command definition includes:
- Command name and description
- Parameter configuration (message with length constraints)
- Required permissions (text message permission)
- Placeholder text for user guidance

The command handler:
- Extracts the message parameter from the command context
- Uses the OpenChat client factory to create a client
- Sends the message back to the user
- Returns a success result with the sent message

### Bot Functionality

The example bot implements a simple echo command that:
1. Accepts a single required parameter called "message"
2. Validates the message length (between 1 and 10,000 characters)
3. Supports multi-line messages
4. Requires text message permissions
5. Returns the exact message back to the user
6. Provides helpful placeholders and descriptions for user guidance

The command can be invoked in OpenChat using:
```
/echo message: Your message here
```

The code structure follows these principles:
- Clear command definition with proper metadata
- Type-safe parameter handling
- Proper error handling through Result types
- Thread-safe implementation using LazyLock
- Clean separation between command definition and execution

### Extending the Bot

To add a new command to your bot, follow these steps:

1. **Create a new command file**
   Create a new file in the `src/commands` directory, for example `src/commands/my_command.rs`:

   ```rust
   use async_trait::async_trait;
   use oc_bots_sdk::api::command::{CommandHandler, SuccessResult};
   use oc_bots_sdk::api::definition::*;
   use oc_bots_sdk::types::BotCommandContext;
   use oc_bots_sdk_offchain::AgentRuntime;
   use std::sync::LazyLock;
   use oc_bots_sdk::oc_api::client_factory::ClientFactory;

   static DEFINITION: LazyLock<BotCommandDefinition> = LazyLock::new(MyCommand::definition);

   pub struct MyCommand;

   #[async_trait]
   impl CommandHandler<AgentRuntime> for MyCommand {
       fn definition(&self) -> &BotCommandDefinition {
           &DEFINITION
       }

       async fn execute(
           &self,
           context: BotCommandContext,
           oc_client_factory: &ClientFactory<AgentRuntime>,
       ) -> Result<SuccessResult, String> {
           // Your command logic here
           let message = "Your response message";
           
           let response = oc_client_factory
               .build(context)
               .send_text_message(message)
               .execute_then_return_message(|_, _| ());

           Ok(SuccessResult { message: response })
       }
   }

   impl MyCommand {
       fn definition() -> BotCommandDefinition {
           BotCommandDefinition {
               name: "mycommand".to_string(),
               description: Some("Description of your command".to_string()),
               placeholder: Some("Placeholder text for the command".to_string()),
               params: vec![
                   // Add your command parameters here
                   BotCommandParam {
                       name: "param1".to_string(),
                       description: Some("Description of the parameter".to_string()),
                       placeholder: Some("Parameter placeholder".to_string()),
                       required: true,
                       param_type: BotCommandParamType::StringParam(StringParam {
                           min_length: 1,
                           max_length: 100,
                           choices: Vec::new(),
                           multi_line: false,
                       }),
                   },
               ],
               permissions: BotPermissions::from_message_permission(MessagePermission::Text),
               default_role: None,
           }
       }
   }
   ```

2. **Register the command in mod.rs**
   Add your new command module to `src/commands/mod.rs`:
   ```rust
   pub mod echo;
   pub mod my_command;
   ```

3. **Register the command in main.rs**
   Add your command to the registry in `src/main.rs`:
   ```rust
   let commands = CommandHandlerRegistry::new(oc_client_factory)
       .register(commands::echo::Echo)
       .register(commands::my_command::MyCommand);
   ```

4. **Command Parameters**
   You can add different types of parameters to your command:
   - String parameters (with length constraints)
   - Number parameters (with min/max values)
   - Boolean parameters
   - Choice parameters (dropdown selection)

   Example of different parameter types:
   ```rust
   params: vec![
       // String parameter
       BotCommandParam {
           name: "text".to_string(),
           param_type: BotCommandParamType::StringParam(StringParam {
               min_length: 1,
               max_length: 1000,
               choices: Vec::new(),
               multi_line: true,
           }),
           // ... other fields
       },
       // Number parameter
       BotCommandParam {
           name: "count".to_string(),
           param_type: BotCommandParamType::NumberParam(NumberParam {
               min: 1,
               max: 100,
               step: 1,
           }),
           // ... other fields
       },
       // Boolean parameter
       BotCommandParam {
           name: "enabled".to_string(),
           param_type: BotCommandParamType::BooleanParam,
           // ... other fields
       },
       // Choice parameter
       BotCommandParam {
           name: "option".to_string(),
           param_type: BotCommandParamType::StringParam(StringParam {
               min_length: 0,
               max_length: 100,
               choices: vec![
                   BotCommandOptionChoice {
                       value: "option1".to_string(),
                       label: "Option 1".to_string(),
                   },
                   BotCommandOptionChoice {
                       value: "option2".to_string(),
                       label: "Option 2".to_string(),
                   },
               ],
               multi_line: false,
           }),
           // ... other fields
       },
   ],
   ```

5. **Accessing Parameters**
   In your command's execute method, you can access parameters using:
   ```rust
   let param1 = context.command.arg("param1");
   let param2 = context.command.arg("param2");
   ```

6. **Sending Messages**
   You can send different types of messages:
   ```rust
   // Text message
   oc_client_factory
       .build(context)
       .send_text_message("Your message")
       .execute_then_return_message(|_, _| ());

   // Message with markdown
   oc_client_factory
       .build(context)
       .send_text_message("**Bold** and *italic* text")
       .with_block_level_markdown(true)
       .execute_then_return_message(|_, _| ());
   ```

After adding your command:
1. Rebuild the bot: `cargo build`
2. Restart the bot: `cargo run`
3. Test your command in OpenChat using `/mycommand param1: value`

You can now build your own custom made offchain bot using this template by adding new commands and logic.
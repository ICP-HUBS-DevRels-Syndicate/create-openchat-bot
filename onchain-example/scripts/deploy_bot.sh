#!/bin/bash

# Pre-requisites
#
# 1. The [OpenChat repo](https://github.com/open-chat-labs/open-chat) and the [bot SDK repo](https://github.com/open-chat-labs/open-chat-bots) should be cloned to the same parent folder.
# 2. OpenChat should be setup according to [these instructions](https://github.com/open-chat-labs/open-chat/blob/master/README.md) 
# 3. dfx has been started
# 4. You are using the desired DFX principal. See `dfx identity use --help` for more information.

# CD into the directory this script is installed in
SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")
cd $SCRIPT_DIR

# Set default values
MODE=${1:-upgrade} # MODE is either install, reinstall or upgrade
NETWORK=${2:-playground} # NETWORK is either playground or local

# ANSI color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "Deploying bot with the following settings:"
echo "Mode: $MODE (default: upgrade)"
echo "Network: $NETWORK (default: playground)"
echo ""

# Read the OpenChat public key from the website
OC_PUBLIC_KEY=$(curl -s https://oc.app/public-key)

# if [ $? -ne 0 ]; then
#     echo "OpenChat is not running on http://localhost:5001."
#     exit 1
# fi

# Build the bot install args
ARGS="(record { oc_public_key = \"$OC_PUBLIC_KEY\" } )"

# Generate Cargo.lock file first
echo "Generating Cargo.lock file..."
cd ..
cargo build --target wasm32-unknown-unknown || exit 1
cd $SCRIPT_DIR

if [ "$NETWORK" = "playground" ]; then
    echo "Deploying to playground network..."
    
    # Try to get the canister ID to check if it exists
    CANISTER_ID=$(dfx canister id onchain_bot --network playground 2>/dev/null)
    
    if [ $? -eq 0 ] && [ ! -z "$CANISTER_ID" ]; then
        echo "Canister exists. Attempting upgrade..."
        # Try to upgrade first
        if ! dfx deploy onchain_bot --playground --argument "$ARGS" --mode upgrade; then
            echo "Upgrade failed. The canister might have expired. Creating a new one..."
            # If upgrade fails, create a new canister
            dfx deploy onchain_bot --playground --argument "$ARGS" --mode install
        fi
    else
        echo "Canister does not exist. Creating a new one..."
        # Create a new canister
        dfx deploy onchain_bot --playground --argument "$ARGS" --mode install
    fi
    
    # Get the canister ID after deployment
    CANISTER_ID=$(dfx canister id onchain_bot --network playground)
    
    echo ""
    echo "Bot successfully deployed to playground network!"
    echo -e "${GREEN}Bot URL: https://$CANISTER_ID.raw.icp0.io/${NC}"
    echo -e "Note: The bot is accessible via the URL above. Test it out using: ${BLUE}curl https://$CANISTER_ID.raw.icp0.io/${NC}"
    echo "Warning: Playground canisters expire after 20 minutes. You may need to redeploy after expiration."
    echo ""
else
    # For local deployment, use the normal process
    ./utils/deploy.sh onchain_bot OnchainBot $MODE "$ARGS" $NETWORK
fi
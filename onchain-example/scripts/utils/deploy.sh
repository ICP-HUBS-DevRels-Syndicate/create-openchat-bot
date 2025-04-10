#!/bin/bash

# Capture the directory this script is installed in and cd into the rs folder
SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")
cd $SCRIPT_DIR/../..

BOT=$1
NAME=$2
MODE=$3
ARGS=$4
NETWORK=${5:-local} # Default to local network

if [ $MODE = "install" ]
then
    echo "Installing $BOT"
    # Create a canister for the bot locally
    dfx canister create --quiet $BOT --no-wallet --network $NETWORK || exit 1
fi

# Get the canister ID
CANISTER_ID=$(dfx canister id $BOT --network $NETWORK) || exit 1
echo "Canister ID: $CANISTER_ID"

# Build the bot WASM
echo "Building $BOT WASM"
dfx build --quiet $BOT --check --network $NETWORK || exit 1

# Install/reinstall/upgrade the $BOT canister
echo "Installing $BOT"
dfx canister install --quiet --mode $MODE $BOT --argument "$ARGS" --network $NETWORK || exit 1

# Return the URL of the $BOT
echo ""
echo "Name: $NAME"
echo "Principal: $CANISTER_ID"
if [ "$NETWORK" = "playground" ]; then
    echo "Bot URL: https://$CANISTER_ID.raw.icp0.io/"
    echo "Note: The bot is accessible via the URL above. Make sure to include the '?id=' parameter with your canister ID."
else
    echo "Endpoint: http://$CANISTER_ID.raw.localhost:8080"
fi
echo ""
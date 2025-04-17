#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const shell = require('shelljs');

// ANSI color codes
const green = chalk.green;
const blue = chalk.blue;
const red = chalk.red;

async function main() {
    console.log(chalk.bold.blue('\nWelcome to OpenChat Bot Creator! 🚀\n'));

    // Ask for bot type
    const { botType } = await inquirer.prompt([
        {
            type: 'list',
            name: 'botType',
            message: 'Which type of bot do you want to create?',
            choices: [
                { name: 'Offchain Bot (Runs on your machine)', value: 'offchain' },
                { name: 'Onchain Bot (Deploys to Internet Computer)', value: 'onchain' }
            ]
        }
    ]);

    // Ask for bot name
    const { botName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'botName',
            message: 'What is the name of your bot?',
            validate: (input) => {
                if (!input) return 'Bot name is required';
                if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
                    return 'Bot name can only contain letters, numbers, underscores, and hyphens';
                }
                return true;
            }
        }
    ]);

    // Create project directory
    const projectDir = path.join(process.cwd(), botName);
    if (fs.existsSync(projectDir)) {
        console.log(red(`\nError: Directory "${botName}" already exists.`));
        process.exit(1);
    }

    const spinner = ora('Creating your bot...').start();

    try {
        // Clone the template repository
        spinner.text = 'Cloning template repository...';
        shell.exec(`git clone https://github.com/ICP-HUBS-DevRels-Syndicate/openchat-bots.git ${botName}`, { silent: true });

        // Navigate to the project directory
        const projectDir = path.join(process.cwd(), botName);
        const exampleDir = path.join(projectDir, `${botType}-example`);
        const otherType = botType === 'offchain' ? 'onchain' : 'offchain';
        
        spinner.text = 'Setting up project structure...';
        
        // Copy necessary files from example directory
        shell.cp('-r', `${exampleDir}/src`, projectDir);
        shell.cp('-r', `${exampleDir}/Cargo.toml`, projectDir);
        shell.cp('-r', `${exampleDir}/Cargo.lock`, projectDir);
        shell.cp('-r', `${exampleDir}/config.toml`, projectDir);
        shell.cp('-r', `${exampleDir}/scripts`, projectDir);
        if (botType === 'onchain') {
            shell.cp('-r', `${exampleDir}/dfx.json`, projectDir);
            shell.cp('-r', `${exampleDir}/can.did`, projectDir);
        }
        
        // Clean up unnecessary files and directories
        spinner.text = 'Cleaning up temporary files...';
        shell.rm('-rf', [
            path.join(projectDir, `${otherType}-example`),
            path.join(projectDir, '.git'),
            path.join(projectDir, `${botType}-example`),
            path.join(projectDir, 'bin'),
            path.join(projectDir, 'images'),
            path.join(projectDir, 'BOT-DOCUMENTATION.md'),
            path.join(projectDir, 'REGISTER-BOT.md'), 
            path.join(projectDir, 'local-development.md'),
            path.join(projectDir, 'package.json'),
            path.join(projectDir, 'package-lock.json')
        ]);
        
        // Navigate to project directory
        shell.cd(projectDir);

        if (botType === 'offchain') {
            spinner.text = 'Updating package configuration...';
            // Update package name in Cargo.toml
            shell.sed('-i', 'name = "offchain_bot"', `name = "${botName}"`, 'Cargo.toml');
            
            spinner.text = 'Configuring bot identity...';
            // Update identity name in setup_bot.sh
            shell.sed('-i', 'bot_identity', `${botName}_identity`, 'scripts/setup_bot.sh');
            
            // Stop the spinner while running the setup script
            spinner.stop();
            console.log(blue('\nRunning setup script...\n'));
            
            // Make setup script executable and run it
            shell.chmod('+x', 'scripts/setup_bot.sh');
            const result = shell.exec('./scripts/setup_bot.sh');
            
            if (result.code !== 0) {
                console.error(red('Setup script failed:'));
                console.error(result.stderr);
                process.exit(1);
            }

            // Run cargo build to verify everything works
            console.log(blue('\nBuilding the project...\n'));
            const buildResult = shell.exec('cargo build');
            
            if (buildResult.code !== 0) {
                console.error(red('Build failed:'));
                console.error(buildResult.stderr);
                process.exit(1);
            }
        } else {
            spinner.text = 'Updating package configuration...';
            // Update package name in Cargo.toml
            shell.sed('-i', 'name = "onchain_bot"', `name = "${botName}"`, 'Cargo.toml');
            
            spinner.text = 'Configuring canister...';
            // Create dfx.json with proper canister configuration
            const dfxJson = {
                "dfx": "0.26.0-beta.1",
                "canisters": {
                    [botName]: {
                        "type": "rust",
                        "package": botName,
                        "candid": "can.did",
                        "gzip": true
                    }
                },
                "networks": {
                    "local": {
                        "bind": "127.0.0.1:8080",
                        "type": "ephemeral",
                        "replica": {
                            "subnet_type": "system"
                        }
                    }
                },
                "version": 1
            };
            
            // Write the updated dfx.json
            fs.writeFileSync('dfx.json', JSON.stringify(dfxJson, null, 2));
            
            // Update canister name in deploy_bot.sh
            shell.sed('-i', 'onchain_bot', botName, 'scripts/deploy_bot.sh');
            
            // Stop the spinner while running the deployment script
            spinner.stop();
            console.log(blue('\nRunning deployment script...\n'));
            
            // Make deploy script executable and run it
            shell.chmod('+x', 'scripts/deploy_bot.sh');
            const result = shell.exec('./scripts/deploy_bot.sh');
            
            if (result.code !== 0) {
                console.error(red('Deployment script failed:'));
                console.error(result.stderr);
                process.exit(1);
            }
        }

        // Initialize git repository and create initial commit
        spinner.text = 'Initializing git repository...';
        shell.exec('git init', { silent: true });
        shell.exec('git add .', { silent: true });
        shell.exec('git commit -m "Initial commit: OpenChat bot created with create-openchat-bot"', { silent: true });
        spinner.succeed('Git repository initialized with initial commit');

        // Only show success message if scripts ran successfully
        console.log(green('\nBot created successfully!'));

        // Display next steps
        console.log('\nNext steps:');
        console.log(`1. Navigate to your bot directory: ${blue(`cd ${botName}`)}`);
        if (botType === 'offchain') {
            console.log(`2. Start your bot: ${blue('cargo run')}`);
        } else {
            console.log(`2. When testing out the new changes to your bot, re-deploy it using the command: ${blue('./scripts/deploy_bot.sh')}`);
        }
        console.log(`3. Follow the bot registration instructions at: ${blue('https://www.npmjs.com/package/create-openchat-bot')}`);
        console.log('\nYour git repository has been initialized with an initial commit.');
        console.log('You can now create a remote repository and push your changes.\n');
        console.log('\nHappy bot building! 🎉\n');

    } catch (error) {
        spinner.fail(red('Failed to create bot'));
        console.error(error);
        process.exit(1);
    }
}

main().catch(console.error);
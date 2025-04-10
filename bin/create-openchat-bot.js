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
        shell.exec(`git clone https://github.com/ICP-HUBS-DevRels-Syndicate/openchat-bots.git ${botName}`, { silent: true });

        // Navigate to the correct example directory
        const exampleDir = path.join(projectDir, `${botType}-example`);
        shell.cd(exampleDir);

        if (botType === 'offchain') {
            // Update package name in Cargo.toml
            shell.sed('-i', 'name = "offchain_bot"', `name = "${botName}"`, 'Cargo.toml');
            
            // Update identity name in setup_bot.sh
            shell.sed('-i', 'bot_identity', `${botName}_identity`, 'scripts/setup_bot.sh');
            
            // Make setup script executable and run it
            shell.chmod('+x', 'scripts/setup_bot.sh');
            shell.exec('./scripts/setup_bot.sh', { silent: true });
        } else {
            // Update package name in Cargo.toml
            shell.sed('-i', 'name = "onchain_bot"', `name = "${botName}"`, 'Cargo.toml');
            
            // Update canister name in deploy_bot.sh
            shell.sed('-i', 'onchain_bot', botName, 'scripts/deploy_bot.sh');
            
            // Make deploy script executable and run it
            shell.chmod('+x', 'scripts/deploy_bot.sh');
            shell.exec('./scripts/deploy_bot.sh', { silent: true });
        }

        spinner.succeed(green('Bot created successfully!'));

        // Display next steps
        console.log('\nNext steps:');
        console.log(`1. Navigate to your bot directory: ${blue(`cd ${botName}/${botType}-example`)}`);
        if (botType === 'offchain') {
            console.log(`2. Start your bot: ${blue('cargo run')}`);
        } else {
            console.log(`2. Deploy your bot: ${blue('./scripts/deploy_bot.sh')}`);
        }
        console.log(`3. Follow the registration instructions in ${blue('REGISTER-BOT.md')}`);
        console.log('\nHappy bot building! 🎉\n');

    } catch (error) {
        spinner.fail(red('Failed to create bot'));
        console.error(error);
        process.exit(1);
    }
}

main().catch(console.error);
/**
 * Release mode (wip / patch / minor / major) :
 * NPM Script to release current version to Git and NPM.
 * First argument is increment of package.json (patch / minor / major)
 * or "wip" for work in progress.
 * Second argument is commit message
 */
const { log, error, exec, inRealPackage } = require('./cli');

// Get arguments
const increment = (process.argv[2] || '').toLowerCase();
let message = process.argv[3];

// If we are in work in progress publishing mode
const isWip = increment == 'wip';

// If this is a real release
if ( !isWip )
{
	// Check if there is a missing argument
	if ( !increment || !message )
	{
		error(`Usage : npm run release (patch|minor|major) "message"\nex : npm run release patch "Woopsy"`);
	}

	// Increment and throw if increment value is not right
	try
	{
		exec(`npm run increment ${increment}`, {stdio: []});
	}
	catch (e) { error(e) }
}

// Default message, for WIP mode only
if (!message)
{
	message = "Work in progress"
}

log(`> Publishing ${increment} ...\n`);

// Add every sources files
try
{
	inRealPackage()
	? exec(`git add src/** doc/** tests/** README.md .npmrc .gitignore .npmignore package.json`, { stdio: [0, 1, 2] })
	: exec(`git add --all`, { stdio: [0, 1, 2] })
}
catch (e) {}

// Pre-commit hook if this is not work in progress
if ( !isWip ) require('./pre-commit');

// Commit with message and commit hook
try
{
	exec(`git commit -m"${message}"`, { stdio: [0, 1, 2] });
}
catch (e) {}

// Pre-push hook if this is not work in progress
if ( !isWip ) require('./pre-push');

// And then push and push hook
try
{
	exec(`git push`, { stdio: [0, 1, 2] });
}
catch (e) {}
/**
 * Release mode (patch / minor / major) :
 * NPM Script to release current version to Git and NPM.
 * First argument is increment of package.json (patch / minor / major)
 * Second argument is commit message
 *
 * Husky git hooks will do the compile / test / publish stuff 
 * 
 * WIP (wip) : 
 *
 * NPM Script to release Work In Progress to Git and nothing to NPM.
 * Nothing will be compiled
 * No Husky hooks will be triggered.
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
		error(`Usage : npm run publish (patch|minor|major) "message"\nex : npm run publish patch "Woopsy"`);
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
	? exec(`git add src/* doc/* tests/* README.md LICENSE .gitignore .npmignore package.json`, { stdio: [0, 1, 2] })
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
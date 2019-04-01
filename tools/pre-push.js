/**
 * Equivalent to pre-push git hook.
 * Is called by release.js
 *
 * 1. Will generate and publish doc to github if any doc related file has been updated.
 * 2. Will publish to npm if package.json contains a name field
 */

const { log, exec, inRealPackage } = require('./cli');

// ----------------------------------------------------------------------------- PUBLISH DOC

// Here we check if we need to regenerate and publish the documentation
let needsDoc = false;
try
{
	// Do not check path in sub-folders.
	// for ex src/doc/ needs to be not detected as doc file
	const startCheckIndex = 5;

	// If there is any updated file in git
	exec('git diff --stat --cached origin/master').split("\n").map( line =>
	{
		// Which is in the doc directory
		[
			line.indexOf('doc/'),
			line.indexOf('.doczrc.js')
		].map( check =>
		{
			if (check !== -1 && check < startCheckIndex)
				needsDoc = true;
		});
	});
}

// Generate doc if we had an error
catch (e) { needsDoc = true }

// Regenerate doc
if ( needsDoc )
{
	log('> Doc updated, publishing to github.io ...');
	exec('gh-pages -d doc', true);
	log('> Done !');
}

// ----------------------------------------------------------------------------- NPM PUBLISH

// Hook only if we are on a real package here (and not typescript-npm-starter)
if ( !inRealPackage() ) return;

// Do not publish to NPM if .nopublish file exists
if ( !require('fs').existsSync('.nopublish') )
{
	// Get package.json info
	const packageJSON = require('../package.json');

	log(`> Publishing package ${packageJSON.name} version ${packageJSON.version} to NPM ...`);
	exec('npm publish', true);
	log('> Done !');
}

// ----------------------------------------------------------------------------- PUSH TAGS

// Here we push our tag which has been auto-generated in pre-commit.js
try
{
	log('> Pushing version tag ...');
	exec('git push --tags');
	log('> Done !');
}
catch (e)
{
	error(`! Error push tag.\n${e.message}`);
}
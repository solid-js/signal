/**
 * This file shows help message from command :
 * npm run help
 */
 
const getScriptsInfo = require('npm-scripts-info');
const readPkgUp = require('read-pkg-up');
const chalk = require('chalk');

readPkgUp().then( result =>
{
	const scriptsInfo = getScriptsInfo(result.pkg);
	Object.keys( scriptsInfo ).map( key =>
	{
		console.log(`$ npm run ${chalk.bold(key)} :`);
		console.log(`${scriptsInfo[key]}\n`);
	});
});

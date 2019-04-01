/**
 * Will build sources from src/ folder to dist/ folder.
 * 1. Will compile Typescript files to ES modules as .mjs files.
 * 2. Will compile Typescript files to Common JS modules as .js files.
 */

const { log, exec, error, inRealPackage } = require('./cli');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// If we need a fast compile for dev
const quickCompile = process.argv[2] == "quick-compile";

// Utility to recursively change files extensions into a folder
function recursiveChangeExtension (dir, from, to)
{
	fs.readdirSync(dir).forEach( f =>
	{
		const filePath = path.join( dir, f);
		const stats = fs.lstatSync( filePath );

		// Recursive browse and rename if this is a directory
		if ( stats.isDirectory() )
		{
			recursiveChangeExtension( filePath );
		}

		// Rename to .mjs if this is a .js file
		else if ( path.extname( f ) == from )
		{
			fs.renameSync( filePath, filePath.replace(from, to) );
		}
	});
}


let compileProfiles = [
	// Compile ES modules with tsconfig.module.json and rename all files to .mjs files
	['Compiling Typescript to ES modules', 'tsc -p tsconfig.module.json', '.mjs'],

	// Compile Common JS modules with default tsconfig and keep .js files
	['Compiling Typescript to Common JS modules', 'tsc'],
];

// If we need a fast compile, remove ES Modules compilation
if (quickCompile)
{
	compileProfiles = [ compileProfiles[1] ];
}

// Compile all selected profiles
compileProfiles.map( el =>
{
	log(`${el[0]} ...`, true, true);
	let ee;
	try
	{
		// Compile with tsc
		exec(el[1], {shell: true, stdio: []});

		// Rename extensions if needed
		(2 in el) && recursiveChangeExtension('dist/', '.js', el[2]);
	}
	catch (e)
	{
		// Show error message and stop script
		log(` ${chalk.red('Error !')}\n\n`, false, true);
		console.log( e.stdout.toString() );
		console.error( e.stderr.toString() );
		process.exit(1);
	}
	log(` Done !\n`, false, true);
});

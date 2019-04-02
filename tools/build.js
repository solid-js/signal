/**
 * Will build sources from src/ folder to dist/ folder.
 * 1. Will compile Typescript files to ES modules as .mjs files.
 * 2. Will compile Typescript files to Common JS modules as .js files.
 * 3. Will compress Javascript files with Terser to measure production file sizes.
 *
 * Step 3 will enable production mode with process.env.NODE_ENV="production"
 * Dead code will be eliminated to remove dev and debug code from file size.
 */
const { log, exec, error, inRealPackage } = require('./cli');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const fileSize = require('filesize');

// ----------------------------------------------------------------------------- CONFIG

// If we need a fast compile for dev
const quickCompile = process.argv[2] == "quick-compile";

// Node env for compression and dead code elimination.
const nodeEnv = 'production';

// Set .mjs to compress modules,
// or .js to compress ES5 files
const compressType = '.mjs';
const compressedExtension = '.min' + compressType;

// Typescript compilation profiles
let compileProfiles = [
	// Compile ES modules with tsconfig.module.json and rename all files to .mjs files
	['Compiling Typescript to ES modules', 'tsc -p tsconfig.module.json', '.mjs'],

	// Compile Common JS modules with default tsconfig and keep .js files
	['Compiling Typescript to Common JS modules', 'tsc'],
];

// ----------------------------------------------------------------------------- CHANGE EXTENSION

// Utility to recursively change files extensions into a folder
function recursiveChangeExtension ( dir, from, to )
{
	// Browse this folder
	fs.readdirSync( dir ).forEach( f =>
	{
		// Get file info
		const filePath = path.join( dir, f );
		const stats = fs.lstatSync( filePath );

		// Recursive browse and rename if this is a directory
		if ( stats.isDirectory() )
		{
			recursiveChangeExtension( filePath, from, to );
		}

		// Rename to .mjs if this is a .js file
		else if ( path.extname( f ) == from )
		{
			fs.renameSync( filePath, filePath.replace(from, to) );
		}
	});
}

// ----------------------------------------------------------------------------- COMPRESS FUNCTIONS

// Compress a file with terser
function terser ( filePath, outputPath )
{
	exec(`node_modules/.bin/terser --compress -d process.env.NODE_ENV=\"'${nodeEnv}'\" --mangle -o ${outputPath} -- ${filePath}`);
}

// Recursively browse a folder and compress every file with terser
function recursiveTerser ( dir, from, to )
{
	let results = {};
	fs.readdirSync(dir).forEach( f =>
	{
		// Get file info
		const filePath = path.join( dir, f );
		const stats = fs.lstatSync( filePath );

		// Recursive browse and append results if this is a folder
		if ( stats.isDirectory() )
		{
			results = {
				...results,
				...recursiveTerser( filePath )
			};
		}

		// If this is a corresponding file, which is not already compressed with terser
		else if ( path.extname( f ) == from && filePath.indexOf(to) === -1 )
		{
			terser( filePath, filePath.replace(from, to) );
			results[ filePath ] = fs.statSync( filePath ).size;
		}
	});
	return results;
}

// ----------------------------------------------------------------------------- LOG UTILITIES

const columnWidth = 60;

// Log spaces to create a column
function logSpaces ( column1Length )
{
	for ( let i = columnWidth - column1Length; i --; i > 0 )
		process.stdout.write(' ');
}

// Log 2 columns
function logColumn ( column1, column2 )
{
	process.stdout.write( "\n" + column1 );
	logSpaces( column1.length );
	log( column2, false, true );
}

// ----------------------------------------------------------------------------- BUILD

// If we need a fast compile, remove ES Modules compilation
if ( quickCompile )
{
	compileProfiles = [ compileProfiles[1] ];
}

// Compile all selected profiles
compileProfiles.map( el =>
{
	const column1 = `${el[0]} ...`;
	log(column1, true, true);
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
		logSpaces( column1.length );
		log(` ${chalk.red('Error !')}\n\n`, false, true);
		console.log( e.stdout.toString() );
		console.error( e.stderr.toString() );
		process.exit(1);
	}
	logSpaces( column1.length );
	log(`Done !\n`, false, true);
});

// ----------------------------------------------------------------------------- THEN COMPRESS

// Do not compress if this is a quick build
if ( quickCompile ) return;

// Show header and compress files recursively
const column1 = `Compressing files ...`;
log(column1, true, true);
const results = recursiveTerser('dist/', compressType, compressedExtension);
logSpaces( column1.length );
log(`Done !\n`, false, true);

// Show every file sizes
log(`\nBundle size estimation :`, false, true);
let totalSize = 0;
Object.keys( results ).map( filePath =>
{
	const size = results[ filePath ];
	totalSize += size;
	logColumn( filePath, fileSize( size ) );
});

// Show total file size
console.log('');
logColumn('For an estimated total of', fileSize(totalSize) );
console.log('');

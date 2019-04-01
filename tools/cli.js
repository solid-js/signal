const execSync = require('child_process').execSync;
const chalk = require('chalk');

module.exports = {
	/**
	 * Log a bold line in CLI
	 */
	log: ( message, noBold, noLine ) =>
	{
		const content = noBold ? message : chalk.bold(message);
		noLine ? process.stdout.write( content ) : console.log( content );
	},

	/**
	 * Halt with an error message
	 */
	error: (str, code) =>
	{
		console.error(chalk.red.bold( str ));
		console.error('');
		process.exit( code || 1 );
	},

	/**
	 * Exec a command and return stdout as string.
	 */
	exec: (command, options) =>
	{
		const result = execSync(command, (
			options === true
			? { stdio: [1, 2] }
			: options
		));
		return result ? result.toString() : null;
	},

	/**
	 * Check if we are a real package.
	 * A real package is a package that goes on NPM and is created from
	 * typescript-npm-starter. 
	 */
	inRealPackage: () => (require('../package.json').name != null)
}
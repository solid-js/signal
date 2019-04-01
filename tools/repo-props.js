/**
 * Get Github repository infos from package.json
 */
function getRepoProps ()
{
	// Read package.json repository URL
	const packageData = require('../package.json');
	const repoURL = (packageData.repository || {}).url || '';

	// Return default if not found
	if (!repoURL) return defaultReturn;

	// Split on / and return default if not found
	const splitted = repoURL.split('/');
	if (splitted.length < 1) return defaultReturn;

	// Extract and return organisation and repo name
	return {
		organisation: splitted[ splitted.length - 2 ],
		name: splitted[ splitted.length - 1 ].split('.git')[0]
	};
}

module.exports = {
	/**
	 * Function to get package.json repository name.
	 * Used to configure doczrc base to deploy correctly on github.io
	 * https://{organisation-name}.github.io/{repo-name}/
	 * /{repo-name}/ will be the base.
	 */
	getRepoBase: function ( defaultBase )
	{
		const repoProps = getRepoProps( defaultReturn );
		return `/${repoProps.name}/`;
	},

	/**
	 * Generate documentation URI on Github.io pages.
	 * Will use package.json repository field.
	 * https://{organisation-name}.github.io/{repo-name}/
	 */
	getDocumentationURI: function ( defaultReturn )
	{
		const repoProps = getRepoProps( defaultReturn );
		return `https://${repoProps.organisation}.github.io/${repoProps.name}/`;
	}
}
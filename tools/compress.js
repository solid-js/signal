/**
 * Compress built Javascript files with Terser and measure file size.
 *
 * This will enable production mode with process.env.NODE_ENV="production"
 * Dead code will be eliminated to remove dev and debug code from file size.
 *
 * ES6+ bundle will be created in dist folder, as release.min.js.
 * This file is not meant to be used in production.
 */
const { log, exec, error, inRealPackage } = require('./cli');
const fileSize = require('filesize');
const fs = require('fs');

// Get human readable file size
const getNiceFileSize = path => fileSize( fs.statSync( path ).size );

// Config
const releasePath = "dist/release.min.js";
const nodeEnv = "production";
const source = "dist/*.js";

// Remove generated compressed file
exec(`rm -rf ${releasePath}`);

// Compress file with Terser
exec(`node_modules/.bin/terser --compress -d process.env.NODE_ENV=\"'${nodeEnv}'\" --mangle -o ${releasePath} -- ${source}`);

// Log file size
log(`Production bundle size of ${releasePath} is ${getNiceFileSize( releasePath)}`);
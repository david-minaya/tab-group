/* eslint-disable no-undef */
const package = require('../../package.json');

function transformManifest(content) {

  const isProd = process.env.NODE_ENV === 'production';
  const manifest = JSON.parse(content.toString());

  manifest.version = package.version;
  manifest.name = isProd ? 'Tab Group' : 'Tab Group Dev';

  return JSON.stringify(manifest, undefined, 2);
}

module.exports = {
  transformManifest
};

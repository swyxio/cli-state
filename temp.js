const Conf = require('conf');

const config = new Conf();

// config.set('unicorn', '🦄');
console.log(config.get('unicorn'));
console.log(config.path);
console.log(config._options.projectName);

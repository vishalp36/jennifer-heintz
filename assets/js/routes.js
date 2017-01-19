import config from 'config'

module.exports = {
	[`${config.BASE}`]: require('./sections/home'),
	[`${config.BASE}home`]: { section: require('./sections/home') },
	[`${config.BASE}about`]: { section: require('./sections/about') },
	[`${config.BASE}contact`]: { section: require('./sections/contact') },
  [`${config.BASE}work`]: { section: require('./sections/work') }, 
  [`${config.BASE}work/:id`]: { section: require('./sections/single'), duplicate: true }
}
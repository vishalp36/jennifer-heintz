import config from 'config'

/* ----------
all routes needs to be defined inline
see https://github.com/bigwheel-framework/documentation/blob/master/routes-defining.md#as-section-standard-form
---------- */
module.exports = {
	[`${config.BASE}`]: require('./sections/home'),
	[`${config.BASE}home`]: { section: require('./sections/home') },
	[`${config.BASE}about`]: { section: require('./sections/about') },
	[`${config.BASE}contact`]: { section: require('./sections/contact') },
  [`${config.BASE}work`]: { section: require('./sections/work') }, 
  [`${config.BASE}work/:id`]: { section: require('./sections/single'), duplicate: true }
}
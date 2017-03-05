import domselect from 'dom-select'

const config = {

	BASE: '/',

	body: document.body,
	view: domselect('main'),
	nav: domselect.all('.js-nav'),

	width: window.innerWidth,
	height: window.innerHeight,

	isProjectNavClick: false
}

export default config

import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import Default from './default'
import Custom from '../lib/custom'
import { on, off } from 'dom-event'

class Home extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'home'

		this.backToTop = this.backToTop.bind(this)
		this.onTileClick = this.onTileClick.bind(this)
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.addEvents()

		done()
	}

	addEvents() {

		this.initSmooth()

		this.ui.tile.forEach(tile => on(tile, 'click', this.onTileClick))
		on(this.ui.button, 'click', this.backToTop)
	}

	removeEvents() {

		this.smooth.destroy()

		this.ui.tile.forEach(tile => off(tile, 'click', this.onTileClick))
		off(this.ui.button, 'click', this.backToTop)
	}

	initSmooth() {

		this.smooth = new Custom({
			section: this.ui.smooth,
			opacity: this.ui.button,
			noscrollbar: true,
			ease: 0.1,
			vs: {
				mouseMultiplier: 0.25,
				firefoxMultiplier: 30
			}
		})

		this.smooth.init()
	}

	backToTop() {

		this.smooth && this.smooth.scrollTo(0)
	}

	onTileClick(evt) {

		this.smooth.off()

		this.target = evt.currentTarget
	}

	animateIn(req, done) {

		classes.add(config.body, `is-${this.slug}`)

		const tl = new TimelineMax({paused: true, onComplete: _ => {
			done()
			this.lazyLoad()
		}})

		if (!req.previous) {

			tl.set(this.page, { autoAlpha: 1 })
			tl.staggerFromTo(this.ui.tile, 1, {
				y: 100,
				autoAlpha: 0
			}, {
				delay: 0.6,
				y: 0,
				autoAlpha: 1
			}, 0.05)
			tl.restart()

		} else {

			tl.to(this.page, 1, {autoAlpha: 1})
			tl.restart()
		}
	}

	animateOut(req, done) {

		classes.remove(config.body, `is-${this.slug}`)

		req.params.id ? this.animateToSingle(done) : this.animateToSection(done)
	}

	animateToSingle(done) {

		const time = 0.6

		const tl = new TimelineMax({paused: true, onComplete: done})

		tl.to(this.page, 1, {
			autoAlpha: 0,
			ease: Expo.easeInOut
		})
		tl.restart()
	}

	animateToSection(done) {

		const tl = new TimelineMax({ paused: true, onComplete: done })

		tl.to(this.page, 1, { autoAlpha: 0, ease: Expo.easeInOut })
		tl.restart()
	}

	lazyLoad() {

		[...this.ui.lazy].forEach(el => {

			const img = document.createElement('img')
			const image = el.getAttribute('data-src')

			img.onload = () => {

				el.style['background-image'] = `url('${image}')`

				if (el.nextElementSibling) {
					requestAnimationFrame(_ => classes.add(el.nextElementSibling, 'hidden'))
				}
			}

			img.src = image
		})
	}
	// 
	// resize(width, height) {
	// 
	// 	this.canvas.width = width
	// 	this.canvas.height = height
	// }

	destroy(req, done) {

		super.destroy()

		this.removeEvents()

		this.page.parentNode.removeChild(this.page)

		done()
	}
}

module.exports = Home

import 'whatwg-fetch'
import config from 'config'
import sniffer from 'sniffer'
import classes from 'dom-classes'
import create from 'dom-create-element'
import gsap from 'gsap'

TweenLite.defaultEase = Expo.easeInOut

class Preloader {

	constructor(onComplete) {

		this.preloaded = onComplete
		this.view = config.view
		this.el = null
	}

	init(req, done) {

		classes.add(config.body, 'is-loading')

		fetch(`${config.BASE}data/data.json`)
			.then(res => res.json())
			.then(json => {
				window._data = json
				done()
			})

		config.infos = sniffer.getInfos()

		this.createDOM()

		done()
	}

	createDOM() {

		const page = this.view.firstChild

		this.el = create({
			selector: 'div',
			styles: 'preloader',
			html: `
			<div class="preloader__inner">
				<div class="vertical-align">
					<div class="preloader__text vertical-align__item">
						<h1 class="preloader__name">Jennifer Heintz</h1>
						<h2 class="preloader__subtitle">Designer & Illustrator</h2>
					</div>
				</div>
			</div>`
		})

		this.view.insertBefore(this.el, page)
	}

	resize(width, height) {

		config.width = width
		config.height = height
	}

	animateIn(req, done) {

		const text = document.querySelector('.preloader__text')

		const tl = new TimelineMax({ paused: true, onComplete: () => {
			done()
			this.preloaded()
		}})
		
		tl.to(text, 1.75, { autoAlpha: 1, ease: Linear.easeNone })
		tl.restart()
	}

	animateOut(req, done) {

		const text = document.querySelector('.preloader__text')
		const ui = document.querySelectorAll('.js-nav')

		const tl = new TimelineMax({ paused: true, onComplete: done })

		tl.staggerTo(text.children, 1, { autoAlpha: 0 }, -0.05, 'out')
		tl.to(ui, 1.5, { autoAlpha: 1 }, 'out')
		tl.set(this.el, { autoAlpha: 0 })
		tl.restart()
	}

	destroy(req, done) {

		classes.add(config.body, 'is-loaded')
		classes.remove(config.body, 'is-loading')

		this.view.removeChild(this.el)

		done()
	}
}

module.exports = Preloader

import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import Default from './default'
import Smooth from 'smooth-scrolling'

class Work extends Default {
	
	constructor(opt) {
		
		super(opt)

		this.slug = 'work'
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
		
		this.initSmooth();
		this.lazyLoad()
	}
	
	removeEvents() {
		
		this.smooth.destroy()
	}
	
	lazyLoad() {
		
		this.ui.lazy.forEach((el) => {

        const img = document.createElement('img')
        const image = el.getAttribute('data-src')
            
        img.onload = () => {
                
          el.style['background-image'] = `url('${image}')`
					
          setTimeout(_ => {
          	requestAnimationFrame(_ => classes.add(el.nextElementSibling, 'hidden'))
					}, 1000)
        }

        img.src = image
    })
	}
	
	initSmooth() {
		
		this.smooth = new Smooth({
			section: this.ui.smooth,
			noscrollbar: true,
			ease: 0.1
		})

		this.smooth.init()
	}

	animateIn(req, done) {

		classes.add(config.body, `is-${this.slug}`)

		TweenLite.to(this.page, 1, {
			autoAlpha: 1,
			ease: Expo.easeInOut,
			onComplete: done
		})
	}
	
	animateOut(req, done) {

		classes.remove(config.body, `is-${this.slug}`)

		TweenLite.to(this.page, 0.7, {
			autoAlpha: 0,
			ease: Expo.easeInOut,
			onComplete: done
		})
	}

	destroy(req, done) {

		super.destroy()
		
		this.removeEvents()

		this.page.parentNode.removeChild(this.page)
		
		done()
	}
}

module.exports = Work
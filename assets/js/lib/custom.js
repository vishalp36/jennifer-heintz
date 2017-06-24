import Smooth from 'smooth-scrolling'
import clamp from '../utils/math/clamp'
import slice from '../utils/array/slice'

class Custom extends Smooth {

  constructor(opt = {}) {

    super(opt)

    this.dom.section = opt.section
    this.dom.opacity = opt.opacity
    this.dom.parallax = slice(opt.parallax)
    this.dom.last = [...this.dom.parallax].pop()

    this.parallax = this.dom.parallax.map(el => ({
      el: el,
      ease: el.dataset.ease || 0.1,
      current: 0,
      computed: getComputedStyle(el).transform === 'none' ? false : getComputedStyle(el).transform
    }))

    console.log(this.parallax)

    this.sectionBottom = this.dom.section.getBoundingClientRect().bottom.toFixed()
    this.opacityBottom = this.dom.opacity.getBoundingClientRect().bottom.toFixed()
  }

  run() {

    super.run()

    this.sectionBottom = this.dom.last.getBoundingClientRect().bottom.toFixed()

    const current = Math.round(Math.abs(this.opacityBottom - this.sectionBottom))
    const opacity = clamp(0, current / (this.vars.height * .15), 1)
    const inview = (this.opacityBottom - this.sectionBottom) >= 0

    this.dom.opacity.style.opacity = inview ? opacity.toFixed(2) : 0

    this.parallax.forEach(entry => {
      entry.current += (this.vars.target - entry.current) * entry.ease
      entry.current < .1 && (entry.current = 0)

      const t = `translateY(${-entry.current.toFixed(2)}px) translateZ(0)`

      entry.el.style[this.prefix] = entry.computed ? `${entry.computed} ${t}` : t
    })
  }

  resize() {

    this.sectionBottom = this.dom.section.getBoundingClientRect().bottom.toFixed()
    this.opacityBottom = this.dom.opacity.getBoundingClientRect().bottom.toFixed()

    this.vars.bounding = this.dom.section.getBoundingClientRect().height - this.vars.height * 0.5

    super.resize()
  }
}

export default Custom

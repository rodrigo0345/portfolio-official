window.addEventListener("scroll", setScrollVar)
window.addEventListener("resize", setScrollVar)
window.addEventListener("scroll", setScrollVarUnlimited)
window.addEventListener("resize", setScrollVarUnlimited)

function setScrollVar() {
  const htmlElement = document.documentElement
  const percentOfScreenHeightScrolled =
    htmlElement.scrollTop / htmlElement.clientHeight
  
  htmlElement.style.setProperty(
    "--scroll",
    Math.min(percentOfScreenHeightScrolled * 100, 100)
  )
}

setScrollVar()

function setScrollVarUnlimited() {
    const htmlElement = document.documentElement
    const percentOfScreenHeightScrolled =
      htmlElement.scrollTop / htmlElement.clientHeight
      console.log(percentOfScreenHeightScrolled * 100)
    htmlElement.style.setProperty(
      "--scroll-unlimited",
      percentOfScreenHeightScrolled * 100
    )
  }
  
  setScrollVarUnlimited()

const observer = new IntersectionObserver(entries => {
    for (let i = entries.length - 1; i >= 0; i--) {
      const entry = entries[i]
      if (entry.isIntersecting) {
        document.querySelectorAll("[data-img]").forEach(img => {
          img.classList.remove("show")
        })
        const img = document.querySelector(entry.target.dataset.imgToShow)
        img?.classList.add("show")
        break
      }
    }
  })
  
  document.querySelectorAll("[data-img-to-show]").forEach(section => {
    observer.observe(section)
  })
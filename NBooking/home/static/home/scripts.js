// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const target = document.querySelector(a.getAttribute('href'))
      if(target){
        e.preventDefault()
        target.scrollIntoView({behavior:'smooth',block:'start'})
      }
    })
  })

  // Mobile menu toggle
  const burger = document.getElementById('burger')
  const navMenu = document.getElementById('nav-menu')
  if(burger){
    burger.addEventListener('click',()=>{
      burger.classList.toggle('open')
      navMenu.classList.toggle('open')
    })
    navMenu.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click',()=>{
        burger.classList.remove('open')
        navMenu.classList.remove('open')
      })
    })
  }
})

// Lightbox for gallery
document.addEventListener('DOMContentLoaded',()=>{
  const lightbox = document.getElementById('lightbox')
  const lbImg = document.getElementById('lightbox-img')
  const lbClient = document.getElementById('lightbox-client')
  const lbCaption = document.getElementById('lightbox-caption')
  const lbService = document.getElementById('lightbox-service')
  const lbClose = document.getElementById('lightbox-close')

  function openLightbox(data){
    if(!lightbox) return
    lbImg.src = data.image || ''
    lbImg.alt = data.caption || data.client || ''
    lbClient.textContent = data.client || ''
    lbCaption.textContent = data.caption || ''
    lbService.textContent = data.service || ''
    lightbox.setAttribute('aria-hidden','false')
    lightbox.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  function closeLightbox(){
    if(!lightbox) return
    lightbox.setAttribute('aria-hidden','true')
    lightbox.classList.remove('open')
    lbImg.src = ''
    document.body.style.overflow = ''
  }

  document.querySelectorAll('.g-item').forEach(fig=>{
    fig.addEventListener('click',e=>{
      const image = fig.dataset.image || (fig.querySelector('img') && fig.querySelector('img').src)
      const client = fig.dataset.client || ''
      const caption = fig.dataset.caption || ''
      const service = fig.dataset.service || ''
      if(image){
        openLightbox({image,client,caption,service})
      }
    })
  })

  if(lbClose) lbClose.addEventListener('click',closeLightbox)
  if(lightbox) lightbox.addEventListener('click',e=>{ if(e.target===lightbox) closeLightbox() })
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeLightbox() })
})

// Gallery filtering functionality
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn')
  const galleryItems = document.querySelectorAll('.gallery-item')

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'))
      // Add active class to clicked button
      button.classList.add('active')

      const filterValue = button.getAttribute('data-filter')

      galleryItems.forEach(item => {
        if (filterValue === 'all') {
          item.classList.add('show')
        } else {
          const itemService = item.getAttribute('data-service')
          if (itemService && itemService.includes(filterValue)) {
            item.classList.add('show')
          } else {
            item.classList.remove('show')
          }
        }
      })
    })
  })
})

// Services filtering functionality
document.addEventListener('DOMContentLoaded', () => {
  const categoryButtons = document.querySelectorAll('.category-btn')
  const serviceCards = document.querySelectorAll('.service-detail-card')

  // Show all services by default
  serviceCards.forEach(card => card.classList.add('show'))

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'))
      // Add active class to clicked button
      button.classList.add('active')

      const categoryValue = button.getAttribute('data-category')

      serviceCards.forEach(card => {
        if (categoryValue === 'all') {
          card.classList.add('show')
        } else {
          const cardCategory = card.getAttribute('data-category')
          if (cardCategory === categoryValue) {
            card.classList.add('show')
          } else {
            card.classList.remove('show')
          }
        }
      })
    })
  })
})


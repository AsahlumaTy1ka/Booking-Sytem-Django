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

// Appointments page functionality: search by code, toggle done
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('appt-search')
  const searchBtn = document.getElementById('appt-search-btn')
  const clearBtn = document.getElementById('appt-clear-btn')
  const apptsContainer = document.getElementById('appointments-container')

  if (!apptsContainer) return

  function normalize(s){ return (s||'').toString().trim().toLowerCase() }

  function filterByCode(code){
    const q = normalize(code)
    const rows = apptsContainer.querySelectorAll('.appt-row')
    rows.forEach(r=>{
      const c = normalize(r.dataset.code)
      if(!q || c.includes(q)) r.style.display = ''
      else r.style.display = 'none'
    })
  }

  if(searchBtn){
    searchBtn.addEventListener('click',()=> filterByCode(searchInput.value))
  }
  if(searchInput){
    searchInput.addEventListener('keydown',e=>{ if(e.key==='Enter') filterByCode(searchInput.value) })
  }
  if(clearBtn){
    clearBtn.addEventListener('click',()=>{ if(searchInput) searchInput.value=''; filterByCode('') })
  }

  // CSRF helper (Django cookie)
  function getCookie(name){
    let cookieValue = null
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
          break
        }
      }
    }
    return cookieValue
  }

  apptsContainer.addEventListener('change', async (e)=>{
    const target = e.target
    if(target.classList && target.classList.contains('appt-done-checkbox')){
      const id = target.dataset.id
      const row = apptsContainer.querySelector(`.appt-row[data-id="${id}"]`)
      const checked = target.checked
      // Optimistic UI
      if(row) {
        row.classList.toggle('done', checked)
      }

      // Send toggle to backend — user will implement view/URL
      try{
        const csrftoken = getCookie('csrftoken')
        await fetch(`/appointments/${id}/toggle/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken || ''
          },
          body: JSON.stringify({ done: checked })
        })
      }catch(err){
        console.error('Failed to update appointment', err)
      }
    }
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


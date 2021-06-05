import '../scss/style.scss'

const fetchData = async () => {
  try {
    const response = await fetch('https://603e38c548171b0017b2ecf7.mockapi.io/homes')
    if (!response.ok) {
      throw new Error('Проблемы с загрузкой данных с сервера')
    }
    const data = await response.json()
    return data
  } catch (e) {
    console.log(e)
  }
}

const createCardBox = () => {
  const box = document.createElement('section')
  box.className = 'development__card-box card-box'
  return box
}

const createCard = (id, title, address, type, price) => {
  const strPrice = String(price)
  const color = (type === 'IndependentLiving') ? '#006F79' : '#EC6608'
  const typeText = (type === 'IndependentLiving') ? 'Independent living' : "Support available"
  const card = document.createElement('div')
  card.className = 'card-box__item'
  const cardContent =
    `
    <a href="/details/${id}" class="card-box__card card">
      <div class="card__top">
        <img src="https://via.placeholder.com/300x150/FF0000/FFFFFF?text=title" alt="#" height="233" width="379">
        <span class="card__description" style="background-color: ${color}">${typeText}</span>
      </div>
      <div class="card__bottom">
        <h3 class="card__title">${title}</h3>
        <span class="card__text card__text_first">${address}</span>
        <span class="card__text">
          New Properties for Sale from 
          <span class="card__text_bold">£${strPrice.slice(0,3)},${strPrice.slice(3,-1)}</span>
        </span>
        <span class="card__text">Shared Ownership Available</span>
      </div>
    </a>
    `
  card.innerHTML = cardContent
  return card
}

const pushDataToBox = (box, data) => {
  data.forEach(item => {
    const card = createCard(item.id, item.title, item.address, item.type, item.price )
    box.append(card)
  })
  if (data.length) {
    box.insertAdjacentHTML(
      'beforeend',
      `
    <div class="card-box__btn">
        <button>See more<i class="arrow right"></i></button>
    </div>
    `)
  } else {
    box.insertAdjacentHTML('beforeend', '<h3>Не найдено</h3>')
  }
  return box
}

const render = (data) => {
  const content = document.getElementById('content')
  content.innerHTML = ''
  const box = createCardBox()
  const boxWithData = pushDataToBox(box, data)
  content.append(boxWithData)
}

document.addEventListener('DOMContentLoaded', async () => {
  try{
    const data = await fetchData()

    if (data.length === 0) {
      return
    }
    render(data)

    document.getElementById('filter').addEventListener('input', (event) => {
      const filteredData = data.filter(item => item.title.toLowerCase().includes(event.target.value.toLowerCase()))
      render(filteredData)
    })
  }catch (e){}
})
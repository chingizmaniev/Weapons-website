
let page = 1
let countPage = 1
let searchValue = ''
render()

//Start Search
$('.search').on('input', (e) => {
    searchValue = e.target.value
    render()
})
//End Search

// Пагинация старт
function getPagination() {
    fetch(`https://weapons-kg.herokuapp.com/api/products`)
        .then(res => res.json())
        .then(data => {
            countPage = Math.ceil(data.length / 6)
            $('.pagination-page').remove()
            for (let i = countPage; i >= 1; i--) {
                $('.prev-btn').after(`
                    <span style='cursor: pointer; margin-right: 4px; margin-left: 4px' class="pagination-page">${i}</span>
                `)
            }
        })
}

$('body').on('click', '.pagination-page', function (e) {
    page = e.target.innerText
    render()
})
$('.prev-btn').on('click', function () {
    if (page > 1) {
        page--
        render()
    } else {
        return
    }
})

$('.next-btn').on('click', function () {
    if (page >= countPage) return
    page++
    render()
})
// Пагинация End

//Старт Read
function render() {
    fetch(`https://weapons-kg.herokuapp.com/api/products?_page=${page}&_limit=6&q=${searchValue}`)
        .then(res => res.json())
        .then(data => {
            $('.products-block').html('')
            getPagination()
            data.forEach(item => {
                $('.products-block').append(`
                    <div class="card" style="width: 22rem; margin-bottom: 30px; col-12 col-md-6">
                        <img src="${item.image}" style="height: 426px" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">Description: ${item.description.slice(0, 100)}...</p>
                            <p class="card-text">Price: ${item.price}</p>
                            <p class="card-text">Quantity: ${item.quantity}</p>
                            <p class="card-text">Seller: ${item.seller}</p>
                            <p class="card-text">Phone: ${item.phone}</p>
                            <a id="${item.id}" href="#" class="edit-btn btn btn-primary">Edit</a>
                            <a id="${item.id}" href="#" class="delete-btn btn"><i class="fa fa-trash delete-btn" id="${item.id}"></i></a>
                        </div>
                    </div>
                `)
            })
        })
}
//Read End

//Start Edit
$('body').on('click', '.edit-btn', function () {
    let id = this.id
    fetch(`https://weapons-kg.herokuapp.com/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
            $('.name-inp-edit').val(data.name)
            $('.price-inp-edit').val(data.price)
            $('.quantity-inp-edit').val(data.quantity)
            $('.seller-inp-edit').val(data.seller)
            $('.phone-inp-edit').val(data.phone)
            $('.image-inp-edit').val(data.image)
            $('.description-inp-edit').val(data.description)
            $('.save-btn').attr('id', id)
            $('.main-modal').css('display', 'block')
        })
})

$('.save-btn').on('click', function () {
    if (!$('.name-inp-edit').val().trim() || !$('.price-inp-edit').val().trim() || !$('.quantity-inp-edit').val().trim() || !$('.seller-inp-edit').val().trim() || !$('.phone-inp-edit').val().trim() || !$('.image-inp-edit').val().trim() || !$('.description-inp-edit').val().trim()) {
        alert('Please fill all fields')
        return
    }
    let id = this.id
    let editedProduct = {
        name: $('.name-inp-edit').val(),
        price: $('.price-inp-edit').val(),
        quantity: $('.quantity-inp-edit').val(),
        seller: $('.seller-inp-edit').val(),
        phone: $('.phone-inp-edit').val(),
        image: $('.image-inp-edit').val(),
        description: $('.description-inp-edit').val()
    }
    fetch(`https://weapons-kg.herokuapp.com/api/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(editedProduct),
        headers: {
            'Content-type': 'application/json;charsed=utf-8'
        }
    })
        .then(() => {
            $('.main-modal').css('display', 'none')
            render()
        })
})

$('.close-btn').on('click', function () {
    $('.main-modal').css('display', 'none')
})
//Edited End

//

//Start Add
$('.add-btn').on('click', (e) => {
    if (!$('.name-inp').val().trim() || !$('.price-inp').val().trim() || !$('.quantity-inp').val().trim() || !$('.seller-inp').val().trim() || !$('.phone-inp').val().trim() || !$('.image-inp').val().trim() || !$('.description-inp').val().trim()) {
        alert('Please fill all fields')
        return
    }
    let newProduct = {
        name: $('.name-inp').val(),
        price: $('.price-inp').val(),
        quantity: $('.quantity-inp').val(),
        seller: $('.seller-inp').val(),
        phone: $('.phone-inp').val(),
        image: $('.image-inp').val(),
        description: $('.description-inp').val()
    }
    fetch(`https://weapons-kg.herokuapp.com/api/products`, {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(() => {
            render()
            $('.name-inp').val(''),
                $('.price-inp').val(''),
                $('.quantity-inp').val(''),
                $('.seller-inp').val(''),
                $('.phone-inp').val(''),
                $('.image-inp').val(''),
                $('.description-inp').val('')
            $('.main-modal1').css('display', 'none')
            render()
        })
})

$('.close1').on('click', () => {
    $('.main-modal1').css('display', 'none')
})

$('.add-main').on('click', () => {
    $('.main-modal1').css('display', 'block')
})
//Add End

//Delete start
$('body').on('click', '.delete-btn', function () {
    let id = this.id
    fetch(`https://weapons-kg.herokuapp.com/api/products/${id}`, {
        method: 'DELETE'
    })
        .then(() => render())
})
//Delete End






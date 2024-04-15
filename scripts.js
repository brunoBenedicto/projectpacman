function playIntro() {
  var introSound = document.getElementById('soundIntro');
  introSound.play();
}


// Função para abrir o modal
function openModal(totalPrice, products) {
  document.getElementById("total-price").innerText = totalPrice.toFixed(2);
  var productList = document.getElementById("selected-products");
  productList.innerHTML = "";
  products.forEach(function(product) {
      var li = document.createElement("li");
      li.innerText = product.name + " - Quantidade: " + product.quantity;
      productList.appendChild(li);
  });
  document.querySelector('.modal').style.display = 'block';
}


  // Função para fechar o modal
  function closeModal() {
    document.querySelector('.modal').style.display = 'none';
  }

  // Botão de compra
  document.querySelector('.buy-button').addEventListener('click', function() {
    var totalPrice = 0;
    var products = [];
    var cards = document.querySelectorAll('.card');
    cards.forEach(function(card) {
        console.log(card); // Verifica o conteúdo de card
        var productPriceElement = card.querySelector('.price');
        console.log(productPriceElement); // Verifica se o elemento com a classe 'price' foi encontrado
        var productName = card.querySelector('p').innerText;
        var productPrice = parseFloat(productPriceElement.innerText.replace('R$ ', ''));
        var quantity = parseInt(card.querySelector('.quantity-input').value);
        totalPrice += productPrice * quantity;
        if (quantity > 0) {
            products.push({ name: productName, quantity: quantity });
        }
    });
    openModal(totalPrice, products);
});

  // Botões de quantidade
  var clickSound1 = document.getElementById('clickButton+');
  var clickSound2 = document.getElementById('clickButton-');
  var quantityButtons = document.querySelectorAll('.quantity-button');
  quantityButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var input = button.parentElement.querySelector('.quantity-input');
      var value = parseFloat(input.value);
      if (button.innerText === '-' && value > 0) {
        input.value = value - 1;
        console.log(input.value)
        clickSound2.play();
      } else if (button.innerText === '+') {
        input.value = value + 1;
        clickSound1.play();
        console.log(input.value)
        console.log(typeof(input.value))
      }
    });
  });

  // Fechar o modal ao clicar fora da área do modal
  window.onclick = function(event) {
    var modal = document.querySelector('.modal');
    if (event.target == modal) {
      closeModal();
    }
  };

  document.getElementById("pay-button").addEventListener("click", function() {
    // Aqui você pode adicionar a lógica para processar o pagamento
    // Por exemplo, você pode redirecionar o usuário para uma página de pagamento ou exibir uma mensagem de confirmação
    alert("Pagamento processado com sucesso!");
});


function loadProducts() {
  fetch('./src/data/products.json')
  .then(response => response.json())
  .then(data => {
      data.forEach(product => {
          var card = document.createElement('div');
          card.classList.add('card', 'row', 'm-3');
          card.innerHTML = `
              <div class="col-sm">
                  <img src="${product.image}" alt="${product.name}">
              </div>
              <div class="col-sm">
                  <p>${product.name}</p>
              </div>
              <div class="col-sm">
                  <p>R$ <span class="price">${product.price.toFixed(2)}</span></p>
              </div>
              <div class="contador col-sm container">
                  <div class="input-group container">
                      <div class="input-group-prepend container">
                          <button class="quantity-button btn btn-outline-secondary" type="button">-</button>
                          <input type="number" class="quantity-input form-control" placeholder="" aria-label="" aria-describedby="basic-addon1" value="0" readonly>
                          <button class="quantity-button btn btn-outline-secondary" type="button">+</button>
                      </div>
                  </div>
              </div>
          `;
          document.querySelector('.container').appendChild(card);
      });
  })
  .catch(error => console.error('Erro ao carregar os produtos:', error));
}

// Chame a função para carregar os produtos ao carregar a página
window.onload = loadProducts;
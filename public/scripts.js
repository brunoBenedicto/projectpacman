function playIntro() {
  var introSound = document.getElementById('soundIntro');
  if (introSound) {
    introSound.play().catch(function(error) {
      console.error('Erro ao reproduzir o som intro:', error);
    });
  } else {
    console.error('Elemento de áudio "soundIntro" não encontrado');
  }
}

// Função para abrir o modal
function openModal(totalPrice, products) {
  document.getElementById("total-price").innerText = totalPrice.toFixed(2);
  var productList = document.getElementById("selected-products");
  productList.innerHTML = "";
  products.forEach(function(product) {
      var li = document.createElement("li");
      li.innerText = product.quantity + " - " + product.name;
      productList.appendChild(li);
  });
  document.querySelector('.modal').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
  document.querySelector('.modal').style.display = 'none';
}

document.getElementById("pay-button").addEventListener("click", function() {
  console.log('Botão "Pagar" clicado');
  var clickSoundPay = document.getElementById('paySound');
  clickSoundPay.play();

  // Lista de produtos selecionados
  var selectedProducts = [];
  var cards = document.querySelectorAll('.card');
  cards.forEach(function(card) {
      var productName = card.querySelector('.titulo-card').innerText;
      var quantity = parseInt(card.querySelector('.quantity-input').value);
      if (quantity > 0) {
          selectedProducts.push({ name: productName, quantity: quantity });
      }
  });

  // Valor total da compra
  var totalPrice = parseFloat(document.getElementById("total-price").innerText);


  console.log('Enviando solicitação para o servidor com os seguintes dados:');
console.log('Produtos:', selectedProducts);
console.log('Total:', totalPrice);


  // Envia os detalhes da compra para a API
  fetch('http://localhost:3000/pagamento', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ produtos: selectedProducts, total: totalPrice })
  })
  .then(response => response.json())
  .then(data => {
      console.log(data.message);
      alert(data.message); // Mostra uma mensagem de sucesso
  })
  .catch(error => {
      console.error('Erro ao processar o pagamento:', error);
      alert('Erro ao processar o pagamento. Por favor, tente novamente mais tarde.');
  });
});

function addQuantityButtonListeners() {
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
}

function loadProducts() {
  fetch('./src/data/products.json')
  .then(response => response.json())
  .then(data => {
      data.forEach(product => {
          var card = document.createElement('div');
          card.classList.add('card', 'col-9','col-md-3','col-lg-2', 'm-2'); // Adicionando a classe 'col-4'
          card.innerHTML = `
              <div class="col-sm">
                  <img src="${product.image}" alt="${product.name}">
              </div>
              <div class="col-sm">
                  <p class="titulo-card">${product.name}</p>
              </div>
              <div class="preco-card col-sm">
                  <p>R$ <span>${product.price.toFixed(2)}</span></p>
              </div>
              
              <div class="contador input-group col-sm">
                <div class="input-group-prepend">
                  <button class="quantity-button btn" type="button">-</button>
                  <input type="number" class="quantidade-card quantity-input form-control" placeholder="" aria-label="" aria-describedby="basic-addon1" value="0" readonly>
                  <button class="quantity-button btn" type="button">+</button>
                </div>
              </div>
          `;
          document.getElementById('product-container').appendChild(card); // Modificado para selecionar o container correto
      });
      // Adiciona event listeners aos botões de quantidade após carregar os produtos
      addQuantityButtonListeners();
      
      // Adiciona o evento de clique ao botão de compra
      document.querySelector('.buy-button').addEventListener('click', function() {
        playIntro();
        var totalPrice = 0;
        var products = [];
        var cards = document.querySelectorAll('.card');
        cards.forEach(function(card) {
            console.log(card); // Verifica o conteúdo de card
            var productPriceElement = card.querySelector('.preco-card span');
            console.log(productPriceElement); // Verifica se o elemento com a classe 'price' foi encontrado
            var productName = card.querySelector('.titulo-card').innerText;
            var productPrice = parseFloat(productPriceElement.innerText);
            var quantity = parseInt(card.querySelector('.quantity-input').value);
            totalPrice += productPrice * quantity;
            if (quantity > 0) {
                products.push({ name: productName, quantity: quantity });
            }
        });
        openModal(totalPrice, products);
      });
  })
  .catch(error => console.error('Erro ao carregar os produtos:', error));
}

// Chame a função para carregar os produtos ao carregar a página
window.onload =function(){
  loadProducts();
} 
  
window.onclick = function(event) {
  var modal = document.querySelector('.modal');
  if (event.target == modal) {
    closeModal();
  }
};
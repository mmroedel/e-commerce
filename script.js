// === E-commerce Script ===
// por Murilo Roedel

// --- Funções de Ajuda do localStorage ---

/**
 * Pega o carrinho salvo no localStorage.
 * @returns {Array} O array do carrinho.
 */
function getCart() {
  const cartString = localStorage.getItem('magazineMuriloCart');
  if (cartString) {
    return JSON.parse(cartString);
  }
  return []; // Retorna um array vazio se não houver carrinho
}

/**
 * Salva o carrinho no localStorage.
 * @param {Array} cart O array do carrinho a ser salvo.
 */
function saveCart(cart) {
  localStorage.setItem('magazineMuriloCart', JSON.stringify(cart));
}

/**
 * Adiciona um item ao carrinho.
 * @param {object} productToAdd O produto a ser adicionado (com id, title, price, image, quantity).
 */
function addToCart(productToAdd) {
  let cart = getCart();
  
  // Verifica se o item já existe
  const existingItem = cart.find(item => item.id === productToAdd.id);
  
  if (existingItem) {
    // Se existe, apenas aumenta a quantidade
    existingItem.quantity += productToAdd.quantity;
  } else {
    // Se não existe, adiciona o novo item
    cart.push(productToAdd);
  }
  
  saveCart(cart); // Salva o carrinho atualizado
  atualizarContadorCarrinho(); // Atualiza o ícone do cabeçalho
  
  alert(`"${productToAdd.title}" (${productToAdd.quantity}x) adicionado ao carrinho!`);
}

/**
 * Remove um item do carrinho (todas as quantidades).
 * @param {number} productId O ID do produto a ser removido.
 */
function removeFromCart(productId) {
  let cart = getCart();
  const newCart = cart.filter(item => item.id !== productId);
  saveCart(newCart);
  
  // Atualiza a visualização (se estivermos na página do carrinho)
  renderCartPage(); 
  // Atualiza o contador do cabeçalho
  atualizarContadorCarrinho(); 
}

/**
 * Atualiza a quantidade de um item no carrinho.
 * @param {number} productId O ID do produto.
 * @param {number} newQuantity A nova quantidade.
 */
function updateCartQuantity(productId, newQuantity) {
  if (newQuantity < 1) {
    // Se a quantidade for menor que 1, remove o item
    removeFromCart(productId);
    return;
  }
  
  let cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
    
    // Atualiza a visualização (se estivermos na página do carrinho)
    renderCartPage();
    // Atualiza o contador do cabeçalho
    atualizarContadorCarrinho();
  }
}

/**
 * Atualiza o número no ícone do carrinho no cabeçalho.
 */
function atualizarContadorCarrinho() {
  const cart = getCart();
  // Soma a *quantidade* de cada item, não apenas o número de itens
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Encontra TODOS os contadores (pode haver mais de um se o modal estiver aberto)
  const cartCountElements = document.querySelectorAll(".cart-count");
  if (cartCountElements) {
    cartCountElements.forEach(el => el.textContent = totalCount);
  }
}

// === Início do Script Principal ===

document.addEventListener("DOMContentLoaded", () => {
  
  // --- Elementos Globais ---
  const cartIcon = document.querySelector(".cart-icon");
  
  // Modais (Lógica do Modal permanece para o ícone do header)
  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.querySelector(".close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalValue = document.getElementById("cart-total-value");
  const btnFinalizarCompra = document.getElementById("finalizar-compra");

  const paymentModal = document.getElementById("payment-modal");
  const closePayment = document.querySelector(".close-payment");
  const paymentDetails = document.getElementById("payment-details");

  // --- Elementos da Página (para verificação) ---
  const productListContainer = document.getElementById("produto-card");
  const productPageContainer = document.getElementById("dados-produto");
  const cartPageItemsContainer = document.getElementById("cart-page-items"); // NOVO: Container da página do carrinho
  const mapContainer = document.getElementById("map");

  // --- ATUALIZA O CONTADOR DO CARRINHO EM TODAS AS PÁGINAS ---
  atualizarContadorCarrinho();

  // --- LÓGICA DA PÁGINA PRINCIPAL (LISTA DE PRODUTOS) ---
  if (productListContainer) {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((produtos) => {
        let cardsHTML = "";
        produtos.forEach((item) => {
          cardsHTML += `
            <div class="card">
              <a href="produto.html?id=${item.id}">
                <img src="${item.image}" alt="${item.title}">
              </a>
              <h2><a href="produto.html?id=${item.id}">${item.title}</a></h2>
              <p>${item.description}</p>
              <div class="price">R$ ${item.price.toFixed(2)}</div>
              <div class="rating">Avaliação: ${item.rating.rate}</div>
              
              <button class="btn-cart"
                data-id="${item.id}"
                data-title="${item.title}"
                data-price="${item.price}"
                data-image="${item.image}">
                🛒 Adicionar ao Carrinho
              </button>
              <button class="btn-comprar" 
                data-id="${item.id}"
                data-title="${item.title}"
                data-price="${item.price}"
                data-image="${item.image}">
                Comprar
              </button>
            </div>`;
        });
        productListContainer.innerHTML = cardsHTML;
        setupProductButtons(); // Configura os botões da lista
      })
      .catch((error) => {
        console.error("Erro ao carregar produtos:", error);
        productListContainer.innerHTML = "<p>Erro ao carregar produtos.</p>";
      });
  }

  // --- LÓGICA DA PÁGINA DE PRODUTO (INDIVIDUAL) ---
  if (productPageContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const imageColumnContainer = document.getElementById("product-image-container");
    const detailsColumnContainer = productPageContainer; 

    if (productId && imageColumnContainer) {
      fetch(`https://fakestoreapi.com/products/${productId}`)
        .then((res) => res.json())
        .then((produto) => {
          
          const imageHTML = `
            <div class="imagem-produto-principal">
              <img id="produto-imagem" src="${produto.image}" alt="${produto.title}"/>
            </div>
            <div class="product-thumbnails">
              <img src="${produto.image}" alt="Thumbnail 1" class="thumb-active"/>
              <!-- Usando placeholders da web, já que a API só manda 1 imagem -->
              <img src="https://placehold.co/70x70/eee/ddd?text=Thumb" alt="Thumbnail 2" />
              <img src="https://placehold.co/70x70/eee/ddd?text=Thumb" alt="Thumbnail 3" />
            </div>
          `;
          imageColumnContainer.innerHTML = imageHTML;
          
          const detailsHTML = `
            <h2 id="product-title">${produto.title}</h2>
            <div class="product-rating" id="product-rating">
              ${generateStars(produto.rating.rate)} 
              <span>(${produto.rating.count} avaliações)</span>
            </div>
            <div class="product-price" id="product-price">R$ ${produto.price.toFixed(2)}</div>
            <p class="product-description" id="product-description">${produto.description}</p>
            
            <div class="quantity-selector">
              <label for="quantity">Quantidade:</label>
              <button class="quantity-btn" id="quantity-minus">-</button>
              <input type="text" id="quantity-input" value="1" readonly>
              <button class="quantity-btn" id="quantity-plus">+</button>
            </div>

            <button class="btn-cart btn-adicionar-grande" id="product-add-to-cart"
              data-id="${produto.id}"
              data-title="${produto.title}"
              data-price="${produto.price}"
              data-image="${produto.image}">
              🛒 Adicionar ao Carrinho
            </button>
            <div class="product-details-list" id="product-details-list">
              <h3>Detalhes do Produto</h3>
              <ul>
                <li>Categoria: ${produto.category}</li>
                <li>Material: (Dado de exemplo)</li>
                <li>Garantia: (Dado de exemplo)</li>
              </ul>
            </div>
          `;
          detailsColumnContainer.innerHTML = detailsHTML;

          setupProductButtons(); 
          setupQuantitySelector(); 
        })
        .catch((error) => { 
          console.error("Erro ao carregar produto:", error);
          detailsColumnContainer.innerHTML = "<h2>Erro ao carregar o produto.</h2>";
          imageColumnContainer.innerHTML = "";
         });
    } else { 
      detailsColumnContainer.innerHTML = "<h2>Produto não encontrado.</h2>";
      if(imageColumnContainer) imageColumnContainer.innerHTML = "";
     }
  }

  // --- NOVO: LÓGICA DA PÁGINA DO CARRINHO (carrinho.html) ---
  if (cartPageItemsContainer) { 
    const checkoutContainer = document.getElementById("checkout-button-container");
    const paymentModal = document.getElementById("payment-modal"); 
    if (checkoutContainer && paymentModal) { 
      checkoutContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-checkout') && !event.target.disabled) {
          paymentModal.style.display = 'block';
        }
      });
    }

    renderCartPage(); // Chama a função para desenhar a página do carrinho
  }

  // --- FUNÇÕES REUTILIZÁVEIS ---

  /**
   * Configura os listeners de evento para os botões 'Adicionar' e 'Comprar'
   */
  function setupProductButtons() {
    // Adicionar ao carrinho
    const addButtons = document.querySelectorAll(".btn-cart");
    addButtons.forEach((button) => {
      if (button.dataset.listenerAttached) return; 
      
      button.addEventListener("click", (event) => {
        const data = event.target.dataset;
        // Pega a quantidade da página do produto, se existir
        const quantityInput = document.getElementById("quantity-input");
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        const product = {
          id: parseInt(data.id),
          title: data.title,
          price: parseFloat(data.price),
          image: data.image,
          quantity: quantity // Agora o produto tem quantidade
        };
        
        addToCart(product); // Usa a nova função
      });
      button.dataset.listenerAttached = 'true';
    });

    // Compra Direta (Simplificado - apenas adiciona e abre o pagamento)
    const buyButtons = document.querySelectorAll(".btn-comprar");
    buyButtons.forEach((button) => {
      if (button.dataset.listenerAttached) return;

      button.addEventListener("click", (event) => {
        const data = event.target.dataset;
        const product = {
          id: parseInt(data.id),
          title: data.title,
          price: parseFloat(data.price),
          image: data.image,
          quantity: 1
        };
        
        // Limpa o carrinho, adiciona este e salva
        saveCart([product]); 
        atualizarContadorCarrinho();
        
        // Abre o modal de pagamento
        if (paymentModal) {
            paymentDetails.innerHTML = "";
            paymentModal.style.display = "block";
        } else {
            // Fallback se o modal não estiver nesta página (embora devesse estar)
            console.log("Modal de pagamento não encontrado nesta página.");
        }
      });
      button.dataset.listenerAttached = 'true';
    });
  }
  
  /**
   * Configura os botões de + e - da quantidade (na PÁGINA DO PRODUTO)
   */
  function setupQuantitySelector() {
    const plusBtn = document.getElementById("quantity-plus");
    const minusBtn = document.getElementById("quantity-minus");
    const input = document.getElementById("quantity-input");

    if (plusBtn && minusBtn && input) {
      plusBtn.addEventListener("click", () => { input.value = parseInt(input.value) + 1; });
      minusBtn.addEventListener("click", () => {
        let value = parseInt(input.value);
        if (value > 1) { input.value = value - 1; }
      });
    }
  }
  
  /**
   * Gera o HTML das estrelas de avaliação
   */
  function generateStars(rate) {
    let stars = "";
    let fullStars = Math.floor(rate);
    for(let i = 0; i < fullStars; i++) stars += "★";
    for(let i = 0; i < (5 - fullStars); i++) stars += "☆";
    return stars;
  }

  // --- LÓGICA DO MODAL CARRINHO (COMPARTILHADA) ---
  if(cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      // Se for link, deixa o link funcionar
      if (cartIcon.tagName === 'A' && cartIcon.href) {
         // Verifica se o href aponta para carrinho.html
        if (cartIcon.href.endsWith('carrinho.html')) {
          return; // Deixa o navegador seguir o link
        }
      }
      
      // Previne o comportamento padrão (se não for um link para o carrinho)
      e.preventDefault();
      
      // Se não for um link para o carrinho, abre o modal
      exibirCarrinhoModal();
      if(cartModal) cartModal.style.display = "block";
    });
  }

  if(closeCart) closeCart.addEventListener("click", () => (cartModal.style.display = "none"));

  window.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.style.display = "none";
    if (e.target === paymentModal) paymentModal.style.display = "none";
  });

  /**
   * Exibe o carrinho no MODAL
   */
  function exibirCarrinhoModal() {
    const cart = getCart(); // Pega do localStorage
    
    if (!cartItemsContainer || !cartTotalValue) return; // Não faz nada se o modal não existir

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
      cartTotalValue.textContent = "0.00";
      return;
    }

    let total = 0;
    let html = "";
    cart.forEach((item) => {
      total += (item.price * item.quantity);
      html += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-info">
            <strong>${item.title}</strong><br>
            Qtd: ${item.quantity} x R$ ${item.price.toFixed(2)}
          </div>
        </div>`;
    });
    cartItemsContainer.innerHTML = html;
    cartTotalValue.textContent = total.toFixed(2);
  }

  // --- LÓGICA DE PAGAMENTO (COMPARTILHADA) ---
  if(btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener("click", () => {
      cartModal.style.display = "none";
      paymentModal.style.display = "block";
    });
  }

  if(closePayment) closePayment.addEventListener("click", () => {
    paymentModal.style.display = "none";
    paymentDetails.innerHTML = "";
  });

  document.querySelectorAll(".payment-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const metodo = btn.dataset.method;
      mostrarDetalhesPagamento(metodo);
    });
  });

  function mostrarDetalhesPagamento(metodo) {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (metodo === "pix") {
      paymentDetails.innerHTML = `
        <h3>Pagamento via Pix</h3>
        <p>Escaneie o QR Code abaixo para realizar o pagamento:</p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=Pagamento%20Magazine%20Murilo&size=200x200" alt="QR Code Pix">
        <p><strong>Valor total:</strong> R$ ${total.toFixed(2)}</p>
      `;
    } else if (metodo === "cartao") {
      paymentDetails.innerHTML = `
        <h3>Pagamento com Cartão de Crédito</h3>
        <input type="text" placeholder="Número do Cartão">
        <input type="text" placeholder="Nome no Cartão">
        <input type="text" placeholder="Validade (MM/AA)">
        <input type="text" placeholder="CVV">
        <button id="confirmar-pagamento">Confirmar Pagamento</button>
      `;
    }
  }

  // --- Dropdown categorias (COMPARTILHADO) ---
  const categoryBtn = document.querySelector(".category-btn");
  const dropdown = document.querySelector(".dropdown-content");

  if (categoryBtn && dropdown) {
    categoryBtn.addEventListener("click", (e) => { e.stopPropagation(); dropdown.classList.toggle("show"); });
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !categoryBtn.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
  }

  // --- LÓGICA DO MAPA (COMPARTILHADO, seletivo) ---
  if (mapContainer) {
    var map = L.map('map').setView([-30.000457, -51.201330], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
    L.marker([-30.000457, -51.201330]).addTo(map).bindPopup('Magazine Murilo<br>Estamos aqui!').openPopup();
  }
  
});

// === FUNÇÕES GLOBAIS DA PÁGINA DO CARRINHO ===
// (Precisam estar fora do DOMContentLoaded para serem chamadas pelas funções de clique)

/**
 * Desenha a página do carrinho (carrinho.html)
 */
function renderCartPage() {
  const cartPageItemsContainer = document.getElementById("cart-page-items");
  const summarySubtotalEl = document.getElementById("summary-subtotal");
  const summaryShippingEl = document.getElementById("summary-shipping");
  const summaryTotalEl = document.getElementById("summary-total");
  const checkoutButtonContainer = document.getElementById("checkout-button-container");
  
  // Se não estiver na página do carrinho, não faz nada
  if (!cartPageItemsContainer) return; 
  
  const cart = getCart();
  
  if (cart.length === 0) {
    cartPageItemsContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    summarySubtotalEl.textContent = "R$ 0,00";
    summaryShippingEl.textContent = "R$ 0,00";
    summaryTotalEl.textContent = "R$ 0,00";
    checkoutButtonContainer.innerHTML = '<button class="btn-checkout" disabled>Finalizar Compra</button>';
    return;
  }
  
  let itemsHTML = "";
  let subtotal = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    itemsHTML += `
      <div class="cart-page-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-page-item-details">
          <p class="item-title">${item.title}</p>
          <p class="item-price">R$ ${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-page-item-quantity">
          <button class="quantity-btn-cart" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <input type="text" value="${item.quantity}" readonly>
          <button class="quantity-btn-cart" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-page-item-total">
          R$ ${itemTotal.toFixed(2)}
        </div>
        <div class="cart-page-item-remove">
          <button class="btn-remove-item" onclick="removeFromCart(${item.id})">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    `;
  });
  
  cartPageItemsContainer.innerHTML = itemsHTML;
  
  // Lógica de Frete (Exemplo Fixo)
  const shipping = 15.00; 
  const total = subtotal + shipping;
  
  summarySubtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
  summaryShippingEl.textContent = `R$ ${shipping.toFixed(2)}`;
  summaryTotalEl.textContent = `R$ ${total.toFixed(2)}`;
  checkoutButtonContainer.innerHTML = '<button class="btn-checkout">Finalizar Compra</button>';
}
// === FIM DO SCRIPT ===
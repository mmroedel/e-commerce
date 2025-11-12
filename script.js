// === E-commerce Script ===
// por Murilo Roedel

document.addEventListener("DOMContentLoaded", () => {

  let cart = [];
  const cartCountElement = document.querySelector(".cart-count");
  const cartIcon = document.querySelector(".cart-icon");

  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.querySelector(".close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalValue = document.getElementById("cart-total-value");
  const btnFinalizarCompra = document.getElementById("finalizar-compra");

  const paymentModal = document.getElementById("payment-modal");
  const closePayment = document.querySelector(".close-payment");
  const paymentDetails = document.getElementById("payment-details");

  // --- Carregar produtos da API ---
  fetch("https://fakestoreapi.com/products") 
    .then(res => res.json())
    .then(produtos => {
      const container = document.getElementById("produto-card");
      let cardsHTML = "";

      produtos.forEach(item => {
        cardsHTML += `
          <div class="card">
            <img src="${item.image}" alt="${item.title}">
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <div class="price">Preço: R$ ${item.price.toFixed(2)}</div>
            <div class="rating">Avaliação: ${item.rating.rate}</div>
            
            <button class="btn-comprar" 
                data-id="${item.id}"
                data-title="${item.title}"
                data-price="${item.price}"
                data-image="${item.image}">
                Comprar
            </button>
          </div>`;
      });

      container.innerHTML = cardsHTML;
      setupCartButtons();
    })
    .catch(error => {
      console.error("Erro ao carregar produtos:", error);
      document.getElementById("produto-card").innerHTML = '<p>Erro ao carregar produtos.</p>';
    });

  // --- Adicionar ao carrinho ---
  function setupCartButtons() {
    const allButtons = document.querySelectorAll('.btn-comprar');
    allButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const data = event.target.dataset;
        const product = {
          id: parseInt(data.id),
          title: data.title,
          price: parseFloat(data.price),
          image: data.image
        };
        cart.push(product);
        atualizarCarrinho();
        alert(`"${product.title}" adicionado ao carrinho!`);
      });
    });
  }

  function atualizarCarrinho() {
    cartCountElement.textContent = cart.length;
  }

  // --- Mostrar carrinho ---
  cartIcon.addEventListener("click", () => {
    exibirCarrinho();
    cartModal.style.display = "block";
  });

  closeCart.addEventListener("click", () => cartModal.style.display = "none");

  window.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.style.display = "none";
    if (e.target === paymentModal) paymentModal.style.display = "none";
  });

  function exibirCarrinho() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
      cartTotalValue.textContent = "0.00";
      return;
    }

    let total = 0;
    let html = "";

    cart.forEach(item => {
      total += item.price;
      html += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-info">
            <strong>${item.title}</strong><br>
            R$ ${item.price.toFixed(2)}
          </div>
        </div>`;
    });

    cartItemsContainer.innerHTML = html;
    cartTotalValue.textContent = total.toFixed(2);
  }

  // --- Pagamento ---
  btnFinalizarCompra.addEventListener("click", () => {
    cartModal.style.display = "none";
    paymentModal.style.display = "block";
  });

  closePayment.addEventListener("click", () => {
    paymentModal.style.display = "none";
    paymentDetails.innerHTML = "";
  });

  document.querySelectorAll(".payment-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const metodo = btn.dataset.method;
      mostrarDetalhesPagamento(metodo);
    });
  });

  function mostrarDetalhesPagamento(metodo) {
    if (metodo === "pix") {
      paymentDetails.innerHTML = `
        <h3>Pagamento via Pix</h3>
        <p>Escaneie o QR Code abaixo para realizar o pagamento:</p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=Pagamento%20Magazine%20Murilo&size=200x200" alt="QR Code Pix">
        <p><strong>Valor total:</strong> R$ ${cartTotalValue.textContent}</p>
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

  // --- Dropdown categorias ---
  const categoryBtn = document.querySelector(".category-btn");
  const dropdown = document.querySelector(".dropdown-content");

  if (categoryBtn && dropdown) {
    categoryBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !categoryBtn.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
  }

});

// Logica e consumo de api do site de e-commerce
// por Murilo Roedel
document.addEventListener("DOMContentLoaded", () => {


    let cart = [];
    const cartCountElement = document.querySelector(".cart-count");

    // Se o cartCountElement for null, avisa no console
    if (!cartCountElement) {
        console.error("ERRO CRÍTICO: Não foi possível encontrar '.cart-count'. O carrinho não vai funcionar.");
        return; 
    }

    /** busca os dados da api ***/
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
                        <div class="price">Preço:R$ ${item.price.toFixed(2)}</div>
                        <div class="rating"> Rate ${item.rating.rate}</div>
                        
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
        /** tratamento de exeções **/
        .catch(error =>{
            console.error("Erro ao carregar produto", error);
            document.getElementById("produto-card").innerHTML = '<p>Erro ao carregar produto</p>';
        });

    function setupCartButtons() {
        const allButtons = document.querySelectorAll('.btn-comprar');
        
        allButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productData = event.target.dataset;
                
                const product = {
                    id: parseInt(productData.id),
                    title: productData.title,
                    price: parseFloat(productData.price),
                    image: productData.image
                };
                adicionarAoCarrinho(product);
            });
        });
    }

    function adicionarAoCarrinho(product) {
        cart.push(product);
        console.log("Carrinho:", cart);
        atualizarContadorCarrinho();
    }

    function atualizarContadorCarrinho() {
        cartCountElement.textContent = cart.length;
    }

}); 
/** busca os dados da api ***/
fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {
            var produtos = data.products;
            
        /** monta os cards **/
        for(let i = 1; i < 30; i++){
            const item = produtos[i];
            const container = (document.getElementById("produto-card"));
            /* criado a interação para carregar os card
               colocado div class card e operador de soma */
            container.innerHTML += `
                <div class="card">
                    <img src="${produtos[i].thumbnail}" alt="${produtos[i].title}">
                    <h2>${produtos[i].title}</h2>
                    <p>${produtos[i].description}</p>
                    <div class="price">Preço:R$ ${produtos[i].price}</div>
                    <div class="rating"> Rate ${produtos[i].rating}</div>
                    <button class="btn-comprar">Comprar</button>
                </div>`;
        }
    })
    /** tratamento de exeções **/
    .catch(error =>{
        console.error("Erro ao carregar produto", error);
        document.getElementById("produto-card").innerHTML = '<p>Erro ao carregar produto</p>';
    });
  


/*Busca os dados da api*/
fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {
        const produtos = data.products;
        const produto = produtos[5];
        //monta os cards
        const card = document.getElementById("produto-card");
        card.innerHTML = ` 
        <img src ="${produto.thumbnail}" alt="${produto.title}">
        <h2>${produto.title}</h2>
        <p>${produto.description}</p>
        <div class="price"> Preço: R$ '${produto.price}'</div>
        <div class="rating">Ranking: R$ ${produto.rating}</div>
        <button class="btn-comprar">Comprar</button>
        `;
    })
    //tratamento de exceções
    .catch(error =>{
        console.error("Erro ao carregar o produto", error);
        document.getElementById("produto-card").innerHTML = '<p> Erro ao carregar o produto </p>';
    });

    const card = document.getElementById('produto-card');

# 🛍️ Magazine Murilo: E-commerce 

[![Made with HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![Styled with CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![Powered by JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

## 🎯 Sobre o Projeto

A **Magazine Murilo** é um projeto de e-commerce desenvolvido como parte do curso de extensão da UC **FRAMEWORK FRONT-END COM CONSUMO DE API**. O objetivo principal é demonstrar a proficiência na integração de um *front-end* puro (Vanilla) com serviços de dados externos, simulando uma loja virtual completa.

Este projeto utiliza dados de produtos fornecidos pela API pública `https://fakestoreapi.com/` para preencher dinamicamente o catálogo.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando uma arquitetura robusta e focada em performance para o desenvolvimento Web:


HTML5: Estrutura semântica para as três páginas principais (Home, Produto e Carrinho).

CSS3: Estilização responsiva utilizando Grid Layout e Flexbox.

JavaScript (Vanilla):

Consumo de API com fetch().

Manipulação avançada do DOM para renderização dinâmica.

Uso do localStorage para persistência do carrinho de compras.

Roteamento simples baseado em parâmetros de URL (?id=...).

FakeStore API: (https://fakestoreapi.com/) Fornece os dados de produtos para popular a loja.

Leaflet.js: Biblioteca de mapa interativo usada para exibir a localização física da loja.

Google Material Symbols: Biblioteca de ícones utilizada em todo o projeto.

Google Fonts (Poppins): Fonte principal para o design da interface.

## ✨ Funcionalidades em Destaque

Catálogo Dinâmico: A página inicial (index.html) carrega e exibe todos os produtos da API.

Página de Detalhes do Produto: Ao clicar em um produto, o usuário é levado para produto.html?id=[id]. O JavaScript extrai o ID da URL, busca os dados daquele produto específico na API e renderiza o layout.

Carrinho de Compras Persistente:

Os usuários podem adicionar, remover e atualizar a quantidade de itens.

O carrinho é salvo no localStorage, mantendo os itens mesmo que o usuário feche o navegador.

Cálculo de subtotal e total na página de carrinho (carrinho.html).

Mapa Interativo: A página inicial exibe um mapa (via Leaflet) com um marcador na localização física da loja.

Modais:

Modal de "Resumo do Carrinho" no cabeçalho.

Modal de "Pagamento" (com opções de Pix e Cartão) no fluxo de finalização.

Design Responsivo: A interface se adapta a diferentes tamanhos de tela.
---

## 🛠️ Como Executar o Projeto Localmente

Este é um projeto 100% estático, não sendo necessário Node.js ou qualquer servidor.

Baixe os arquivos do projeto:

Você pode clonar o repositório (git clone ...) ou baixar o arquivo .zip.

Abra o index.html:

Se você baixou o .zip, descompacte a pasta.

Navegue até a pasta do projeto e abra o arquivo index.html diretamente no seu navegador preferido (Chrome, Firefox, etc.).

E pronto! O site estará funcionando.

---

## 👩‍💻 Autor

* **MURILO RÖEDEL** 
    * LinkedIn: Murilo Röedel
    * https://github.com/mmroedel/

---


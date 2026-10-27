const products = [
  {
    id: 1,
    name: "Fone Pulse X",
    category: "audio",
    price: 349.9,
    description: "Áudio imersivo com visual minimalista.",
    emoji: "🎧",
    tag: "Mais vendido",
    glow: "#5df2e52a"
  },
  {
    id: 2,
    name: "Smartwatch Nova",
    category: "wearables",
    price: 499.9,
    description: "Seu dia conectado em um só lugar.",
    emoji: "⌚",
    tag: "Novo",
    glow: "#a58bff2b"
  },
  {
    id: 3,
    name: "Óculos Vision AR",
    category: "wearables",
    price: 899.9,
    description: "Um conceito de visão para outro nível.",
    emoji: "🥽",
    tag: "Destaque",
    glow: "#6b8cff2b"
  },
  {
    id: 4,
    name: "Speaker Orbit",
    category: "audio",
    price: 279.9,
    description: "Som potente em um formato compacto.",
    emoji: "🔊",
    tag: "Compacto",
    glow: "#ff9d6e24"
  },
  {
    id: 5,
    name: "Carregador Flux",
    category: "acessorios",
    price: 159.9,
    description: "Energia prática para sua rotina digital.",
    emoji: "🔋",
    tag: "Essencial",
    glow: "#5df2e526"
  },
  {
    id: 6,
    name: "Teclado Mecha",
    category: "acessorios",
    price: 429.9,
    description: "Precisão e estilo para sua estação.",
    emoji: "⌨️",
    tag: "Setup",
    glow: "#a58bff2b"
  }
];

const cart = new Map();
const money = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const productsNode = document.querySelector("#products");
const notice = document.querySelector("#notice");
let noticeTimer;

function showNotice(message) {
  notice.textContent = message;
  notice.classList.add("show");
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => notice.classList.remove("show"), 2400);
}

function renderProducts(filter = "todos") {
  productsNode.innerHTML = "";
  products
    .filter((p) => filter === "todos" || p.category === filter)
    .forEach((p) => {
      const card = document.createElement("article");
      card.className = "product";
      card.innerHTML = `
        <div class="product-visual" style="--glow:${p.glow}">
          <span class="tag">${p.tag}</span>
          <span class="emoji" aria-hidden="true">${p.emoji}</span>
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="product-bottom">
            <span class="price">${money(p.price)}</span>
            <button class="add" aria-label="Adicionar ${p.name} ao carrinho" data-add="${p.id}">+</button>
          </div>
        </div>
      `;
      productsNode.appendChild(card);
    });
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  showNotice("Produto adicionado ao carrinho.");
}

function renderCart() {
  const count = [...cart.values()].reduce((a, b) => a + b, 0);
  document.querySelector("#cartCount").textContent = `(${count})`;

  const node = document.querySelector("#cartItems");
  if (!count) {
    node.innerHTML =
      '<div class="empty">Seu carrinho ainda está vazio.<br>Que tal explorar os produtos?</div>';
  } else {
    node.innerHTML = "";
    cart.forEach((qty, id) => {
      const p = products.find((x) => x.id === id);
      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <div>
          <strong>${p.name}</strong>
          <small>${money(p.price)} cada</small>
          <div class="qty">
            <button data-change="${id}" data-delta="-1" aria-label="Diminuir quantidade">−</button>
            <span>${qty}</span>
            <button data-change="${id}" data-delta="1" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <strong>${money(p.price * qty)}</strong>
      `;
      node.appendChild(row);
    });
  }

  const total = [...cart.entries()].reduce(
    (sum, [id, qty]) => sum + products.find((p) => p.id === id).price * qty,
    0
  );
  document.querySelector("#cartTotal").textContent = money(total);
}

productsNode.addEventListener("click", (e) => {
  const b = e.target.closest("[data-add]");
  if (b) addToCart(Number(b.dataset.add));
});

document.querySelectorAll(".filter").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((x) =>
      x.classList.toggle("active", x === b)
    );
    renderProducts(b.dataset.filter);
  })
);

document
  .querySelector("#openCart")
  .addEventListener("click", () =>
    document.querySelector("#cartPanel").classList.add("open")
  );

document
  .querySelector("#closeCart")
  .addEventListener("click", () =>
    document.querySelector("#cartPanel").classList.remove("open")
  );

document.querySelector("#cartPanel").addEventListener("click", (e) => {
  if (e.target.id === "cartPanel") e.currentTarget.classList.remove("open");
});

document.querySelector("#cartItems").addEventListener("click", (e) => {
  const b = e.target.closest("[data-change]");
  if (!b) return;
  const id = Number(b.dataset.change);
  const next = (cart.get(id) || 0) + Number(b.dataset.delta);
  if (next <= 0) cart.delete(id);
  else cart.set(id, next);
  renderCart();
});

document
  .querySelector("#checkout")
  .addEventListener("click", () =>
    showNotice("Checkout demonstrativo. Configure pagamentos antes de vender.")
  );

document.querySelector("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();


const cart = [];

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const orderBtn = document.getElementById("order-btn");
const orderMessage = document.getElementById("order-message");

// Ajouter un plat au panier
document.querySelectorAll(".add-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    orderMessage.textContent = "";
    renderCart();
  });
});

// Afficher le panier
function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML =
      "<p>Votre panier est vide. Ajoutez un plat du menu !</p>";
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const details = document.createElement("div");
    const title = document.createElement("strong");
    const description = document.createElement("p");

    title.textContent = item.name;
    description.textContent =
      item.price.toLocaleString("fr-FR") +
      " FCFA l'unité";

    details.append(title, description);

    const actions = document.createElement("div");
    actions.className = "cart-actions";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Retirer un " + item.name);

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Ajouter un " + item.name);

    const remove = document.createElement("button");
    remove.textContent = "Supprimer";
    remove.className = "remove";

    minus.addEventListener("click", () => {
      item.quantity--;

      if (item.quantity <= 0) {
        cart.splice(cart.indexOf(item), 1);
      }

      renderCart();
    });

    plus.addEventListener("click", () => {
      item.quantity++;
      renderCart();
    });

    remove.addEventListener("click", () => {
      cart.splice(cart.indexOf(item), 1);
      renderCart();
    });

    actions.append(minus, quantity, plus, remove);
    row.append(details, actions);
    cartItems.appendChild(row);
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartTotal.textContent =
    total.toLocaleString("fr-FR") + " FCFA";

  orderBtn.disabled = cart.length === 0;
}

// Filtrer les plats
document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((filter) => {
      filter.classList.remove("active");
    });

    button.classList.add("active");

    const category = button.dataset.category;

    document.querySelectorAll(".food-card").forEach((card) => {
      card.hidden =
        category !== "tous" &&
        card.dataset.category !== category;
    });
  });
});

// Préparer une commande
orderBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  const lines = cart.map((item) => {
    return (
      "- " +
      item.name +
      " x" +
      item.quantity +
      " : " +
      (item.price * item.quantity).toLocaleString("fr-FR") +
      " FCFA"
    );
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const message =
    "Bonjour Teranga Restaurant ! Je souhaite commander :\n\n" +
    lines.join("\n") +
    "\n\nTotal : " +
    total.toLocaleString("fr-FR") +
    " FCFA.\nMerci !";

  orderMessage.replaceChildren();

  const info = document.createElement("p");
  info.textContent =
    "Votre commande est prête. Copiez le message ci-dessous et envoyez-le au restaurant.";

  const preview = document.createElement("textarea");
  preview.value = message;
  preview.rows = 7;
  preview.readOnly = true;
  preview.style.cssText =
    "width:100%;padding:12px;margin:12px 0;border:1px solid #ddd;border-radius:8px;";

  const copyButton = document.createElement("button");
  copyButton.className = "btn";
  copyButton.textContent = "Copier la commande";

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(message);
      copyButton.textContent = "Commande copiée !";
    } catch {
      preview.select();
      document.execCommand("copy");
      copyButton.textContent = "Copiez le texte sélectionné";
    }
  });

  orderMessage.append(info, preview, copyButton);
});

renderCart();

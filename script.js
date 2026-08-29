// UVG Universal Gearhouse Main Script

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Dynamic Product Grid Renderer ---
  const productGrid = document.querySelector(".product-grid");

  if (productGrid && typeof GEAR_ITEMS !== "undefined") {
    // Determine page target category based on current pathname or grid ID
    const path = window.location.pathname.toLowerCase();
    let pageCategory = "";
    
    if (path.includes("cameras")) pageCategory = "Cameras";
    else if (path.includes("lighting")) pageCategory = "Lighting";
    else if (path.includes("gear-grips") || path.includes("grips")) pageCategory = "Grips";

    // Filter items for the page category
    const categoryItems = pageCategory 
      ? GEAR_ITEMS.filter(item => item.category === pageCategory)
      : GEAR_ITEMS;

    if (categoryItems.length > 0) {
      // Clear grid and populate dynamic items
      productGrid.innerHTML = "";
      categoryItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.type = item.type || "";
        card.dataset.brand = (item.brand || "").toLowerCase();
        card.dataset.price = item.price;
        card.dataset.category = item.subcategory;

        const formattedPrice = item.price ? `R ${Number(item.price).toLocaleString()}/day` : "Contact for Rate";

        const imagePath = item.image.startsWith("/") ? item.image : `/${item.image}`;
        card.innerHTML = `
          <div class="product-image">
            <img src="${imagePath}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='/images/logo.jpeg';"/>
          </div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <span class="price">${formattedPrice}</span>
        `;
        productGrid.appendChild(card);
      });
    }
  }

  // --- 2. Filter & Sort Logic ---
  const applyBtn = document.querySelector(".apply-btn");
  const sortSelect = document.getElementById("sort");

  function applyFiltersAndSort() {
    if (!productGrid) return;
    const cards = Array.from(productGrid.querySelectorAll(".product-card"));

    // Selected Types
    const checkedTypeEls = document.querySelectorAll('.filter-section:nth-of-type(1) input:checked');
    const checkedTypes = Array.from(checkedTypeEls).map(el => el.parentElement.textContent.toLowerCase().trim());

    // Selected Brands
    const checkedBrandEls = document.querySelectorAll('.filter-section:nth-of-type(2) input:checked');
    const checkedBrands = Array.from(checkedBrandEls).map(el => el.parentElement.textContent.toLowerCase().trim());

    // Selected Price Ranges
    const checkedPriceEls = document.querySelectorAll('.filter-section:nth-of-type(3) input:checked');
    const checkedPrices = Array.from(checkedPriceEls).map(el => el.parentElement.textContent.trim());

    // Filter cards
    cards.forEach(card => {
      const type = (card.dataset.type || "").toLowerCase();
      const brand = (card.dataset.brand || "").toLowerCase();
      const category = (card.dataset.category || "").toLowerCase();
      const title = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";
      const price = parseFloat(card.dataset.price) || 0;

      let typeMatch = checkedTypes.length === 0;
      if (!typeMatch) {
        typeMatch = checkedTypes.some(t => {
          const cleanT = t.replace(/\s*\(\d+\)/g, '').trim(); // strip counts like (13)
          return type.includes(cleanT) || category.includes(cleanT) || title.includes(cleanT);
        });
      }

      let brandMatch = checkedBrands.length === 0;
      if (!brandMatch) {
        brandMatch = checkedBrands.some(b => {
          const cleanB = b.replace(/\s*\(\d+\)/g, '').trim();
          return brand.includes(cleanB) || title.includes(cleanB);
        });
      }

      let priceMatch = checkedPrices.length === 0;
      if (!priceMatch) {
        priceMatch = checkedPrices.some(p => {
          if (p.includes("1 000") && p.includes("10 000")) return price >= 1000 && price <= 10000;
          if (p.includes("10 001") && p.includes("20 000")) return price >= 10001 && price <= 20000;
          if (p.includes("20 001") && p.includes("30 000")) return price >= 20001 && price <= 30000;
          if (p.includes("500") && p.includes("2000")) return price >= 500 && price <= 2000;
          if (p.includes("2001") && p.includes("3500")) return price >= 2001 && price <= 3500;
          if (p.includes("3501") && p.includes("5000")) return price >= 3501 && price <= 5000;
          if (p.includes("50") && p.includes("2000")) return price >= 50 && price <= 2000;
          if (p.includes("2001") && p.includes("5000")) return price >= 2001 && price <= 5000;
          if (p.includes("5001") && p.includes("8000")) return price >= 5001 && price <= 8000;
          return true;
        });
      }

      if (typeMatch && brandMatch && priceMatch) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });

    // Sorting
    if (sortSelect) {
      const sortVal = sortSelect.value;
      let sortedCards = Array.from(productGrid.querySelectorAll(".product-card"));

      if (sortVal.includes("A–Z") || sortVal.includes("A-Z") || sortVal === "Name (A–Z)") {
        sortedCards.sort((a, b) => {
          const tA = a.querySelector("h3") ? a.querySelector("h3").textContent : "";
          const tB = b.querySelector("h3") ? b.querySelector("h3").textContent : "";
          return tA.localeCompare(tB);
        });
      } else if (sortVal.includes("Low to High")) {
        sortedCards.sort((a, b) => (parseFloat(a.dataset.price) || 0) - (parseFloat(b.dataset.price) || 0));
      } else if (sortVal.includes("High to Low")) {
        sortedCards.sort((a, b) => (parseFloat(b.dataset.price) || 0) - (parseFloat(a.dataset.price) || 0));
      }

      sortedCards.forEach(c => productGrid.appendChild(c));
    }
  }

  if (applyBtn) applyBtn.addEventListener("click", applyFiltersAndSort);
  if (sortSelect) sortSelect.addEventListener("change", applyFiltersAndSort);

  // Search input live filtering
  const searchInput = document.querySelector(".search-input input") || document.getElementById("filterSearch");
  if (searchInput && productGrid) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      const cards = productGrid.querySelectorAll(".product-card");
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
});

// --- 3. Categories Dropdown Toggle ---
document.addEventListener('click', function(e){
  const catBtn = document.getElementById('catBtn');
  const catList = document.getElementById('catList');
  const triangle = document.querySelector(".triangle");

  if (!catBtn || !catList) return;

  if (catBtn.contains(e.target)){
    catList.classList.toggle("show");
    if (catList.style.display === 'block') {
      catList.style.display = 'none';
    } else {
      catList.style.display = 'block';
    }
    if (triangle) triangle.classList.toggle("rotate");
  } else {
    if (!catList.contains(e.target)) {
      catList.style.display = 'none';
      catList.classList.remove("show");
      if (triangle) triangle.classList.remove("rotate");
    }
  }
});

// --- 4. Hero Carousel ---
(function(){
  const slides = document.querySelectorAll('.hero-slide');
  const prev = document.getElementById('heroPrev');
  const next = document.getElementById('heroNext');
  let idx = 0;
  if (!slides.length) return;

  function show(i){
    slides.forEach(s => s.classList.remove('active'));
    slides[(i + slides.length) % slides.length].classList.add('active');
  }

  show(idx);

  if (prev) prev.addEventListener('click', () => { idx = (idx - 1 + slides.length) % slides.length; show(idx); });
  if (next) next.addEventListener('click', () => { idx = (idx + 1) % slides.length; show(idx); });

  setInterval(() => { idx = (idx + 1) % slides.length; show(idx); }, 6000);
})();

// categories dropdown toggle
document.addEventListener('click', function(e){
  const catBtn = document.getElementById('catBtn');
  const catList = document.getElementById('catList');

  if(!catBtn || !catList) return;

  if(catBtn.contains(e.target)){
    catList.style.display = (catList.style.display === 'block') ? 'none' : 'block';
  } else {
    if(!catList.contains(e.target)) catList.style.display = 'none';
  }
});

// HERO carousel simple
(function(){
  const slides = document.querySelectorAll('.hero-slide');
  const prev = document.getElementById('heroPrev');
  const next = document.getElementById('heroNext');
  let idx = 0;
  if(!slides.length) return;

  function show(i){
    slides.forEach(s => s.classList.remove('active'));
    slides[(i+slides.length)%slides.length].classList.add('active');
  }

  show(idx);

  if(prev) prev.addEventListener('click', ()=> { idx = (idx-1+slides.length)%slides.length; show(idx); });
  if(next) next.addEventListener('click', ()=> { idx = (idx+1)%slides.length; show(idx); });

  // auto rotate every 6s
  setInterval(()=> { idx = (idx+1)%slides.length; show(idx); }, 6000);
})();

// Basic cat carousel horizontal drag (touch friendly)
(function(){
  const slider = document.getElementById('catCarousel');
  if(!slider) return;
  let isDown=false, startX, scrollLeft;
  slider.addEventListener('mousedown', (e)=>{ isDown=true; slider.classList.add('active'); startX=e.pageX - slider.offsetLeft; scrollLeft=slider.scrollLeft; });
  slider.addEventListener('mouseleave', ()=>{ isDown=false; slider.classList.remove('active'); });
  slider.addEventListener('mouseup', ()=>{ isDown=false; slider.classList.remove('active'); });
  slider.addEventListener('mousemove', (e)=>{ if(!isDown) return; e.preventDefault(); const x=e.pageX - slider.offsetLeft; const walk=(x-startX)*1.2; slider.scrollLeft=scrollLeft-walk; });
})();


// === Catalogue Filters ===
(function() {
  const searchInput = document.getElementById("filterSearch");
  const minRate = document.getElementById("minRate");
  const maxRate = document.getElementById("maxRate");
  const checkboxes = document.querySelectorAll(".filter-list input[type='checkbox']");
  const grid = document.getElementById("gearGrid");
  const cards = grid ? Array.from(grid.children) : [];
  const applyBtn = document.getElementById("applyFilters");
  const sortSelect = document.getElementById("sortSelect");

  function filterAndSort() {
    const term = (searchInput.value || "").toLowerCase();
    const min = parseFloat(minRate.value) || 0;
    const max = parseFloat(maxRate.value) || Infinity;
    const activeCats = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    let filtered = cards.filter(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      const price = parseFloat(card.dataset.price);
      const category = card.dataset.category;
      const matchName = name.includes(term);
      const matchCat = activeCats.length ? activeCats.includes(category) : true;
      const matchPrice = price >= min && price <= max;
      return matchName && matchCat && matchPrice;
    });

    // Sort
    const sortVal = sortSelect.value;
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price);
      const priceB = parseFloat(b.dataset.price);
      if (sortVal === "priceLow") return priceA - priceB;
      if (sortVal === "priceHigh") return priceB - priceA;
      return a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent);
    });

    grid.innerHTML = "";
    filtered.forEach(c => grid.appendChild(c));
  }

  if (applyBtn) applyBtn.addEventListener("click", filterAndSort);
  if (sortSelect) sortSelect.addEventListener("change", filterAndSort);
  if (searchInput) searchInput.addEventListener("input", filterAndSort);
})();

// === Modern Search Icon Toggle ===
(function() {
  const searchBar = document.getElementById('searchBar');
  const searchIcon = document.getElementById('searchIcon');
  const cancelIcon = document.getElementById('cancelIcon');

  if (!searchBar || !searchIcon || !cancelIcon) return;

  // When user types, toggle icons
  searchBar.addEventListener('input', () => {
    if (searchBar.value.trim() !== "") {
      searchIcon.classList.add('icon-hidden');
      cancelIcon.classList.remove('icon-hidden');
      cancelIcon.classList.add('icon-visible');
    } else {
      searchIcon.classList.remove('icon-hidden');
      cancelIcon.classList.remove('icon-visible');
      cancelIcon.classList.add('icon-hidden');
    }
  });

  // When user clicks cancel
  cancelIcon.addEventListener('click', () => {
    searchBar.value = "";
    searchBar.focus();
    cancelIcon.classList.add('icon-hidden');
    cancelIcon.classList.remove('icon-visible');
    searchIcon.classList.remove('icon-hidden');
    searchIcon.classList.add('icon-visible');
  });
})();

//cameras.js
document.addEventListener("DOMContentLoaded", () => {
  const applyBtn = document.querySelector(".apply-btn");
  const productCards = document.querySelectorAll(".product-card");
  const sortSelect = document.getElementById("sort");

  // Apply filters
  applyBtn.addEventListener("click", () => {
    const checkedTypes = Array.from(
      document.querySelectorAll('.filter-section:nth-of-type(1) input:checked')
    ).map((el) => el.parentElement.textContent.toLowerCase().split(" ")[0]); // get "dslr", etc.

    const checkedBrands = Array.from(
      document.querySelectorAll('.filter-section:nth-of-type(2) input:checked')
    ).map((el) => el.parentElement.textContent.toLowerCase().trim());

    const checkedPrices = Array.from(
      document.querySelectorAll('.filter-section:nth-of-type(3) input:checked')
    ).map((el) => el.parentElement.textContent);

    productCards.forEach((card) => {
      const type = card.dataset.type.toLowerCase();
      const brand = card.dataset.brand.toLowerCase();
      const price = parseFloat(card.dataset.price);

      let typeMatch =
        checkedTypes.length === 0 || checkedTypes.some((t) => type.includes(t));
      let brandMatch =
        checkedBrands.length === 0 || checkedBrands.includes(brand);
      let priceMatch = true;

      // Price range logic
      if (checkedPrices.includes("R1 000 – R10 000")) {
        priceMatch = priceMatch && price >= 1000 && price <= 10000;
      }
      if (checkedPrices.includes("R10 001 – R20 000")) {
        priceMatch = priceMatch && price >= 10001 && price <= 20000;
      }
      if (checkedPrices.includes("R20 001 – R30 000")) {
        priceMatch = priceMatch && price >= 20001 && price <= 30000;
      }

      // Display if all match
      if (typeMatch && brandMatch && priceMatch) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

  // Sorting logic
  sortSelect.addEventListener("change", (e) => {
    const sortValue = e.target.value;
    const productGrid = document.querySelector(".product-grid");
    const products = Array.from(productGrid.querySelectorAll(".product-card"));

    let sorted;

    if (sortValue === "Name (A–Z)") {
      sorted = products.sort((a, b) =>
        a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent)
      );
    } else if (sortValue === "Price (Low to High)") {
      sorted = products.sort(
        (a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price)
      );
    } else if (sortValue === "Price (High to Low)") {
      sorted = products.sort(
        (a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price)
      );
    }

    productGrid.innerHTML = "";
    sorted.forEach((p) => productGrid.appendChild(p));
  });
});

//lighting.js
document.addEventListener("DOMContentLoaded", () => {
  const applyBtn = document.querySelector(".apply-btn");
  const productCards = document.querySelectorAll(".product-card");
  const sortSelect = document.getElementById("sort");

  applyBtn.addEventListener("click", () => {
    const checkedTypes = Array.from(
      document.querySelectorAll('.filter-section:nth-of-type(1) input:checked')
    ).map((el) => el.parentElement.textContent.toLowerCase().trim());

    const checkedBrands = Array.from(
      document.querySelectorAll('.filter-section:nth-of-type(2) input:checked')
    ).map((el) => el.parentElement.textContent.toLowerCase().trim());

    const checkedPrices = Array.from(
      document.querySelectorAll('.filter-section:nth-of-type(3) input:checked')
    ).map((el) => el.parentElement.textContent);

    productCards.forEach((card) => {
      const type = card.dataset.type.toLowerCase();
      const brand = card.dataset.brand.toLowerCase();
      const price = parseFloat(card.dataset.price);

      let typeMatch = checkedTypes.length === 0 || checkedTypes.includes(type);
      let brandMatch = checkedBrands.length === 0 || checkedBrands.includes(brand);
      let priceMatch = true;

      if (checkedPrices.includes("R500 – R2000")) {
        priceMatch = priceMatch && price >= 500 && price <= 2000;
      }
      if (checkedPrices.includes("R2001 – R3500")) {
        priceMatch = priceMatch && price >= 2001 && price <= 3500;
      }
      if (checkedPrices.includes("R3501 – R5000")) {
        priceMatch = priceMatch && price >= 3501 && price <= 5000;
      }

      if (typeMatch && brandMatch && priceMatch) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

  sortSelect.addEventListener("change", (e) => {
    const sortValue = e.target.value;
    const productGrid = document.querySelector(".product-grid");
    const products = Array.from(productGrid.querySelectorAll(".product-card"));
    let sorted;

    if (sortValue === "Name (A–Z)") {
      sorted = products.sort((a, b) =>
        a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent)
      );
    } else if (sortValue === "Price (Low to High)") {
      sorted = products.sort(
        (a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price)
      );
    } else if (sortValue === "Price (High to Low)") {
      sorted = products.sort(
        (a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price)
      );
    }

    productGrid.innerHTML = "";
    sorted.forEach((p) => productGrid.appendChild(p));
  });
});

//dropdown
const catBtn = document.getElementById("catBtn");
  const catList = document.getElementById("catList");
  const triangle = document.querySelector(".triangle");

  catBtn.addEventListener("click", () => {
    catList.classList.toggle("show");
    triangle.classList.toggle("rotate");
  });


//grips.js
document.addEventListener("DOMContentLoaded", () => {
  const applyBtn = document.querySelector(".apply-btn");
  const productCards = document.querySelectorAll(".product-card");
  const sortSelect = document.getElementById("sort");

  applyBtn.addEventListener("click", () => {
    const checkedTypes = Array.from(
      document.querySelectorAll('.filter-section:nth-of-type(1) input:checked')
    ).map((el) => el.parentElement.textContent.toLowerCase().trim());

    const checkedBrands = Array.from(
      document.querySelectorAll('.filter-section:nth-of-type(2) input:checked')
    ).map((el) => el.parentElement.textContent.toLowerCase().trim());

    const checkedPrices = Array.from(
      document.querySelectorAll('.filter-section:nth-of-type(3) input:checked')
    ).map((el) => el.parentElement.textContent);

    productCards.forEach((card) => {
      const type = card.dataset.type.toLowerCase();
      const brand = card.dataset.brand.toLowerCase();
      const price = parseFloat(card.dataset.price);

      let typeMatch = checkedTypes.length === 0 || checkedTypes.includes(type);
      let brandMatch = checkedBrands.length === 0 || checkedBrands.includes(brand);
      let priceMatch = true;

      if (checkedPrices.includes("R50 – R2000")) {
        priceMatch = priceMatch && price >= 50 && price <= 2000;
      }
      if (checkedPrices.includes("R2001 – R5000")) {
        priceMatch = priceMatch && price >= 2001 && price <= 5000;
      }
      if (checkedPrices.includes("R5001 – R8000")) {
        priceMatch = priceMatch && price >= 5001 && price <= 8000;
      }

      if (typeMatch && brandMatch && priceMatch) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

  sortSelect.addEventListener("change", (e) => {
    const sortValue = e.target.value;
    const productGrid = document.querySelector(".product-grid");
    const products = Array.from(productGrid.querySelectorAll(".product-card"));
    let sorted;

    if (sortValue === "Name (A–Z)") {
      sorted = products.sort((a, b) =>
        a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent)
      );
    } else if (sortValue === "Price (Low to High)") {
      sorted = products.sort(
        (a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price)
      );
    } else if (sortValue === "Price (High to Low)") {
      sorted = products.sort(
        (a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price)
      );
    }

    productGrid.innerHTML = "";
    sorted.forEach((p) => productGrid.appendChild(p));
  });
});



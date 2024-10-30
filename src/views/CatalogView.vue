<template>
  <div class="catalog-container">
    <div class="main-content">
      <div class="filters">
        <h3>Filters</h3>
        <label>
          Name:
          <input v-model="filters.name" placeholder="Search by name" />
        </label>

        <label>
          Genre:
          <select v-model="filters.genre">
            <option value="">All Genres</option>
            <option v-for="genre in genres" :key="genre.id" :value="genre.name">{{ genre.name }}</option>
          </select>
        </label>

        <label>
          Max Price: {{ filters.maxPrice }}
          <input
            type="range"
            v-model.number="filters.maxPrice"
            :min="0"
            :max="1000"
            step="10"
            class="price-slider"
          />
        </label>

        <button @click="applyFilters">Apply Filters</button>
      </div>
      <div class="product-cards">
        <v-card
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
    <div class="navigation">
      <button @click="prevPage">←</button>
      <span>Page {{ currentPage }}</span>
      <button @click="nextPage">→</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'; 
import vCard from '@/components/v-card.vue';

const products = ref([]);
const genres = ref([]);
const filteredProducts = ref([]);

const filters = ref({
  name: '',
  genre: '',
  minPrice: 0,
  maxPrice: 1000,  
});
const currentPage = ref(1);
const itemsPerPage = 9;

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  products.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const genresSnapshot = await getDocs(collection(db, 'genres'));
  genres.value = genresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Ініціалізуємо відфільтровані продукти всіма продуктами до застосування фільтра
  filteredProducts.value = products.value;
});

const applyFilters = () => {
  currentPage.value = 1;
  filteredProducts.value = products.value.filter(product => {
    const matchesName = product.name.toLowerCase().includes(filters.value.name.toLowerCase());
    const matchesGenre = !filters.value.genre || product.genre === filters.value.genre;
    const matchesPrice = product.price >= filters.value.minPrice && product.price <= filters.value.maxPrice;

    return matchesName && matchesGenre && matchesPrice;
  });
};

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < Math.ceil(filteredProducts.value.length / itemsPerPage)) currentPage.value++;
};
</script>

<style lang="scss" scoped>
.catalog-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 120vh;
  max-height: 100%;
  padding: 20px;
  background-color: var(--color-background-primary);

  .main-content {
    display: flex;
    width: 100%;
    max-width: 80vw;
    margin: 20px 0;
    height: 100%;
    .filters {
      width: 20%;
      background-color: var(--color-background-primary);
      padding: 2vw;
      margin-right: 20px;
      border-radius: 5px;
      border: 1px solid var(--color-border);
      height: 30%;

      h3 {
        color: var(--color-text-primary);
        margin-bottom: 1vw;
      }

      label {
        display: block;
        margin-bottom: 1vw;
        color: var(--color-text-primary);

        input {
          width: 100%;
          padding: 5px;
          margin: 1px;
          border-radius: 3px;
          border: 1px solid var(--color-border);
          background-color: var(--color-background-primary);
          color: var(--color-text-primary);
        }
        input[type="range"] {
          width: 100%;
          -webkit-appearance: none;
          appearance: none;
          background-color: var(--color-border);
          height: 6px;
          border-radius: 5px;
          outline: none;
          margin-top: 5px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 15px;
          height: 15px;
          background-color: var(--color-accent);
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        input[type="range"]::-moz-range-thumb {
          width: 15px;
          height: 15px;
          background-color: var(--color-accent);
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        p {
          font-size: 0.9rem;
          margin: 5px 0;
        }
      }

      select {
        width: 100%;
        padding: 5px;
        margin: 5px 0;
        border-radius: 3px;
        border: 1px solid var(--color-border);
        background-color: var(--color-background-primary);
        color: var(--color-text-primary);
      }

      button {
        margin-top: 10px;
        padding: 8px 12px;
        background-color: var(--color-accent);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      button:hover {
        background-color: var(--color-accent-dark);
      }
    }

    .product-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      width: 80%;
    }
  }

  .navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    width: 10%;
    padding: 10px;
    background-color: var(--color-accent-dark);
    color: var(--color-text-primary);

    button {
      border-radius: 10px;
      margin: 0 10px;
      background-color: var(--color-background-primary);
      color: var(--color-text-primary);
      border: none;
      padding: 5px 10px;
      cursor: pointer;
    }

    button:hover {
      background-color: var(--color-border);
    }
  }
}
</style>

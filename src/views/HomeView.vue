<template>
  <div class="home-view">
    <div class="new-game">
      <div class="genre">
        <div class="genre-buttons">
          <label v-for="genre in genres" :key="genre.name " :class="{ active: selectedGenre === genre.name  }">
            <input type="radio" :value="genre.name " v-model="selectedGenre" class="radio-button" />
            {{ genre.name }}
          </label>
        </div>
      </div>

      <div class="game">
        <div class="cards-wrapper">
          <div v-for="product in filteredNewGames" :key="product.id" class="genre-card" @click="goToProductPage(product.id)">
            <img :src="product.image" alt="Product Image" class="card-img" />
            {{ product.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="sales-leaders">
      <p>Sales Leaders</p>
      <div class="cards-wrapper">
        <div class="moving-cards">
          <vCard v-for="product in filteredProducts" :key="product.id" :product="product" class="large-card" />
          <vCard v-for="product in filteredProducts" :key="product.id + 'duplicate'" :product="product" class="large-card" />
        </div>
      </div>
    </div>

    <div class="attainment">
      <div class="attainment-wrapper">
        <template v-if="loading">
          <p>Loading achievements...</p>
        </template>
        <template v-else>
          <div v-for="achievement in achievements" :key="achievement.title" class="attainment-card">
            <p>{{ achievement.title }}</p>
            <p>{{ achievement.value }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from '@/stores/store';
import { useRouter } from 'vue-router';
import vCard from '@/components/v-card.vue';

const store = useStore();
const router = useRouter();

const products = ref([]);
const genres = ref([]);
const achievements = ref([]);
const loading = ref(false);
const selectedGenre = ref('Shooter');

onMounted(async () => {
  products.value = await store.fetchProducts();
  genres.value = await store.fetchGenres();
  loading.value = true;
  achievements.value = await store.fetchAchievements();
  loading.value = false;
});

const goToProductPage = (id) => {
  router.push({ name: 'ProductDetails', params: { id } });
};

const filteredNewGames = computed(() => {
  return products.value
    .filter(product => product.genre.trim().toLowerCase() === selectedGenre.value.toLowerCase())
    .slice(0, 2);
});

const filteredProducts = computed(() => {
  return products.value.slice(0, 10);
});
</script>



<style lang="scss" scoped>
.home-view {
  height: auto;
  background-color: var(--color-background-primary);
  padding-top: 2vw;

  .new-game {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: row;
    min-height: 50vh;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    .genre {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-border);
      width: 20vw;
      min-height: 50vh;
      border-radius: 10px;

      @media (max-width: 768px) {
        border-radius: 0px;
        width: 98vw;
        min-height: 5vh;
        padding: 1vw;
      }

      .genre-buttons {
        display: flex;
        flex-direction: column;
        width: 80%;
        height: 90%;

        @media (max-width: 768px) {
          gap: 2vw;
          width: 90%;
          flex-direction: row;
          overflow-x: auto;
          white-space: nowrap;
          scroll-behavior: smooth;
        }

        label {
          padding: 10px 15px;
          margin: 5px 0;
          background-color: var(--color-background-primary);
          color: var(--color-text-primary);
          border: 2px solid var(--color-border);
          border-radius: 5px;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.3s ease;

          &.active {
            background-color: var(--color-accent);
            color: #fff;
            border-color: var(--color-accent-dark);
          }

          &:hover {
            background-color: var(--color-accent-dark);
            color: #fff;
          }
        }

        .radio-button {
          display: none;
        }
      }
    }

    .game {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-border);
      width: 50vw;
      height: 50vh;
      border-radius: 10px;

      @media (max-width: 768px) {
        border-radius: 0px;
        width: 100vw;
      }

      .cards-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-direction: row;
        width: 100%;
        height: 100%;

        @media (max-width: 768px) {
          flex-direction: column;
        }

        .genre-card {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          height: 50%;
          border-radius: 10px;
          color: var(--color-text-primary);
          font-size: 1.5rem;
          text-align: center;
          padding: 1rem;

          @media (max-width: 768px) {
            width: 90%;
          }

          .card-img {
            margin-bottom: 1vw;
            width: 100%;
            height: 20vw;
            object-fit: cover;
            border-radius: 10px;
            transition: transform 0.3s;
            @media (max-width: 768px) {
              height: 15vh;
             }
            &:hover {
              transform: scale(1.01);
            }
          }
        }
      }
    }
  }

  .sales-leaders {
    padding-top: 2vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 30vh;

    p {
      margin-right: 72vw;
      padding: 1vw;
      border-radius: 20px;
      background-color: var(--color-border);
      text-align: center;
      color: var(--color-text-primary);

      @media (max-width: 768px) {
        margin-right: 60vw;
        height: 10vh;
        font-size: 20px;
        width: 25vw;
      }
    }

    .cards-wrapper {
      overflow: hidden;
      white-space: nowrap;
      width: 90vw;
      height: 70vh;

      .moving-cards {
        display: inline-flex;
        animation: slide 20s linear infinite;
        width: calc(100% * 3);
      }
    }

    @keyframes slide {
      0% {
        transform: translateX(0);
      }

      100% {
        transform: translateX(-50%);
      }
    }
  }

  .attainment {
    padding: 5vw 9.2vw 9.2vw 9.2vw;
    display: flex;

    .attainment-wrapper {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-evenly;
      background-color: var(--color-border);
      border-radius: 10px;

      @media (max-width: 768px) {
        flex-direction: column;
      }

      .attainment-card {
        margin: 2vw;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 20vw;
        height: 30vh;
        background-color: var(--color-background-primary);
        border-radius: 10px;

        @media (max-width: 768px) {
          width: 80vw;
          height: 30vh;
        }
      }
    }
  }

  .large-card {
    width: 800px;
    height: 1000px;
    font-size: 3rem;

    .card-img {
      width: 100%;
      height: 70%;
      object-fit: cover;
      border-radius: 10px;
    }
  }
}

.attainment {
  padding: 5vw 9.2vw 9.2vw 9.2vw;
  display: flex;
  justify-content: center;

  .attainment-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    background-color: var(--color-border);
    border-radius: 10px;
    padding: 2vw;
    gap: 2vw;

    .attainment-card {
      width: 20vw;
      height: 20vh;
      background-color: var(--color-background-primary);
      color: var(--color-text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, background-color 0.3s;

      &:hover {
        transform: translateY(-5px);
        background-color: var(--color-accent-light);
      }

      p {
        margin: 0.5vw 0;
        font-size: 1.2rem;
      }
    }
  }
}
</style>

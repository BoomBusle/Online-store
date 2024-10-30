<template>
  <div class="home-view">
    <div class="new-game">
      <div class="genre">
        <div class="genre-buttons">
          <label v-for="genre in genres" :key="genre" :class="{ active: selectedGenre === genre }">
            <input type="radio" :value="genre" v-model="selectedGenre" class="radio-button" />
            {{ genre }}
          </label>
        </div>
      </div>

      <div class="game">
        <div class="cards-wrapper">
          <div v-for="product in filteredNewGames" :key="product.id" class="genre-card"
            @click="goToProductPage(product.id)">
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
          <vCard v-for="product in filteredProducts" :key="product.id + 'duplicate'" :product="product"
            class="large-card" />
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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'vue-router'; 
import vCard from '@/components/v-card.vue';

const products = ref([]);
const selectedGenre = ref('Puzzle');
const genres = ref([]);

const router = useRouter();

const achievements = ref([]);
const loading = ref(true);

onMounted(async () => {
  const productSnapshot = await getDocs(collection(db, 'products'));
  products.value = productSnapshot.docs.map(doc => doc.data());

  const genreSnapshot = await getDocs(collection(db, 'genres'));
  genres.value = genreSnapshot.docs.map(doc => doc.data().name);
  fetchAchievements();

});

const fetchAchievements = async () => {
  try {
    const salesSnapshot = await getDocs(collection(db, 'orders'));
    const gamesSnapshot = await getDocs(collection(db, 'products'));
    const genresSnapshot = await getDocs(collection(db, 'genres'));

    achievements.value = [
      { title: 'Number of Sales', value: salesSnapshot.size },
      { title: 'Number of Games on Sale', value: gamesSnapshot.size },
      { title: 'Number of Genres', value: genresSnapshot.size },
    ];
  } catch (error) {
    console.error('Error fetching achievements:', error);
  } finally {
    loading.value = false;
  }
};

const goToProductPage = (id) => {
  router.push({ name: 'ProductDetails', params: { id: id } });
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
    height: 50vh;

    .genre {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-border);
      width: 20vw;
      height: 50vh;
      border-radius: 10px;

      .genre-buttons {
        display: flex;
        flex-direction: column;
        width: 80%;
        height: 90%;

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

      .cards-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-direction: row;
        width: 100%;
        height: 100%;

        .genre-card {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          color: var(--color-text-primary);
          font-size: 1.5rem;
          text-align: center;
          padding: 1rem;

          .card-img {
            margin-bottom: 1vw;
            width: 100%;
            height: 20vw;
            object-fit: cover;
            border-radius: 10px;
            transition: transform 0.3s;

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
      color: var(--color-text-primary);
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

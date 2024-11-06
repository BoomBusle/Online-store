<template>
  <div class="product-wrapper">
    <div class="product-details" v-if="product">
      <div class="image-section">
        <h1>{{ product.name }}</h1>
        <img :src="product.image" alt="Product Image" class="product-img" />
      </div>
      <div class="info-section">
        <p class="description">{{ product.descr }}</p>
        <div class="price-section">
          <p class="price">{{ product.price }} $</p>
          <p class="key-count">Available keys: {{ keyCount }}</p>
          <button class="buy-btn" :disabled="keyCount === 0" @click="buyProduct">
            {{ keyCount === 0 ? 'Out of Stock' : 'Buy Now' }}
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Product not found...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { useStore } from '@/stores/store';

const store = useStore();
const route = useRoute();
const product = ref(null);
const keyCount = ref(0);
const user = ref(null);

onMounted(async () => {
  const productId = route.params.id;

  try {
    product.value = await store.fetchProduct(productId);
    if (product.value) {
      keyCount.value = await store.fetchKeyCount(productId);
    } else {
      console.log("Product not found!");
    }
  } catch (error) {
    console.error("Error loading product:", error);
  }

  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
});

const buyProduct = async () => {
  if (!user.value) {
    alert('Please log in to buy products.');
    return;
  }

  if (keyCount.value === 0) {
    alert("This product is out of stock.");
    return;
  }

  try {
    await store.addToCart(user.value.uid, product.value);
    alert("Product added to cart successfully!");
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};
</script>


<style scoped>
.product-wrapper {
  display: flex;
  min-height: 54vh;
  align-items: center;
  justify-content: center;
  padding: 5vw;
  background-color: var(--color-background-primary);
  gap: 3vw;
  flex-direction: column;
  max-width: 100%;
}

.product-details {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 4vw;
  background-color: var(--color-border);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
  gap: 3vw;
  flex-wrap: wrap;
}

.image-section {
  flex: 1;
  text-align: center;
}

.product-img {
  width: 80%;
  max-width: 300px;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s ease-in-out;
}

.product-img:hover {
  transform: scale(1.05);
}

h1 {
  font-size: 2rem;
  color: var(--color-text-primary);
  margin-bottom: 1vw;
}

.info-section {
  flex: 1;
  padding-left: 2vw;
  text-align: center;
}

.description {
  text-align: start;
  font-size: 1rem;
  color: var(--color-text-primary);
  margin-bottom: 2vw;
}

.price-section {
  display: flex;
  align-items: center;
  margin-top: 2vw;
  justify-content: space-between;
  gap: 2vw;
  flex-wrap: wrap;
}

.key-count {
  font-size: 1rem;
  color: var(--color-text-primary);
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-accent);
}

.buy-btn {
  background-color: var(--color-accent);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.buy-btn:hover {
  background-color: var(--color-accent-dark);
}

.buy-btn:disabled {
  background-color: gray;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-wrapper {
    padding: 5vw;
  }

  .product-details {
    flex-direction: column;
    width: 90%;
    padding: 4vw;
  }

  .image-section {
    margin-bottom: 2vw;
  }

  h1 {
    font-size: 1.5rem;
  }

  .description {
    font-size: 0.9rem;
  }

  .price-section {
    flex-direction: column;
    align-items: center;
  }

  .price {
    font-size: 1.25rem;
  }

  .buy-btn {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}

</style>

<template>
  <div class="order-container">
    <h1>Your Order</h1>

    <div v-if="cartItems.length > 0" class="order-content">
      <div v-for="item in cartItems" :key="item.id" class="order-item">
        <div class="image-section">
          <img :src="item.image" alt="Product Image" class="product-img" />
        </div>
        <div class="info-section">
          <h2>{{ item.name }}</h2>
          <p class="description">Price: {{ item.price }} $</p>
        </div>
      </div>

      <div class="order-form">
        <p>Total: {{ totalPrice }} $</p>
        <button @click="submitOrder" class="place-order-btn">Place Order</button>
      </div>
    </div>

    <div v-else>
      <p class="empty-cart-message">Your cart is empty...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/stores/store';
import { auth } from '@/firebase';

const store = useStore();
const router = useRouter();
const cartItems = ref([]);

onMounted(() => {
  const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  cartItems.value = storedCartItems;
});

const totalPrice = computed(() => cartItems.value.reduce((total, item) => total + item.price, 0));

const submitOrder = async () => {
  if (auth.currentUser) {
    try {
      const orderedItems = [];
      let missingKeys = false;

      for (const item of cartItems.value) {
        const productKey = await store.fetchAndDeleteKey(item.productId);

        if (productKey && productKey.key) {
          orderedItems.push({
            name: item.name,
            price: item.price,
            key: productKey.key,
          });
          console.log(`Assigned key ${productKey.key} for product ${item.name}`);
        } else {
          missingKeys = true;
          console.warn(`Key for product "${item.name}" is unavailable or missing`);
        }
      }

      if (orderedItems.length > 0 && !missingKeys) {
        await store.addOrder(auth.currentUser.uid, orderedItems);

        await store.clearCartFromDatabase(auth.currentUser.uid);
        cartItems.value = [];
        localStorage.removeItem('cartItems');

        router.push({ name: 'user-profile', params: { username: auth.currentUser.displayName } });
      } else if (missingKeys) {
        alert('Some products are unavailable due to missing keys');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing your order. Please try again.');
    }
  } else {
    alert('Please log in to place an order.');
  }
};
</script>


<style scoped>
.order-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: var(--color-background-primary);
  height: 75vh;
  margin: 0 auto;
  gap: 20px;
}

h1 {
  font-size: 32px;
  color: var(--color-text-primary);
  margin-bottom: 30px;
}

.order-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 60vw;
  padding: 20px;
  background-color: var(--color-border);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  width: 100%;
  padding: 20px;
  background-color: var(--color-background-primary);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.image-section {
  flex: 1;
}

.product-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 15px;
  transition: transform 0.3s ease-in-out;
}

.product-img:hover {
  transform: scale(1.05);
}

.info-section {
  flex: 2;
  padding-left: 20px;
}

h2 {
  font-size: 24px;
  color: var(--color-text-primary);
  margin-bottom: 10px;
}

.description {
  font-size: 18px;
  color: var(--color-text-primary);
}

.order-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: var(--color-border);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  p {
      font-size: 18px;
      font-weight: bold;
      color: var(--color-text-primary);
    }
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.place-order-btn {
  background-color: var(--color-accent);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.place-order-btn:hover {
  background-color: var(--color-accent-dark);
}

.place-order-btn:disabled {
  background-color: gray;
  cursor: not-allowed;
}

.empty-cart-message {
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-top: 20px;
}
</style>
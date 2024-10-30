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
          <button class="buy-btn" @click="buyProduct">Buy Now</button>
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
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const route = useRoute();
const product = ref(null);
const user = ref(null);

onMounted(async () => {
  const productId = route.params.id;
  const productRef = doc(db, "products", productId);

  try {
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      product.value = productSnap.data();
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
  if (user.value) {
    const cartRef = collection(db, `users/${user.value.uid}/cart`);
    try {
      await addDoc(cartRef, {
        productId:product.value.id,
        name: product.value.name,
        price: product.value.price,
        image: product.value.image,
        descr: product.value.descr
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  } else {
    alert('Please log in to buy products.');
  }
};
</script>

<style scoped>
.product-wrapper {
  display: flex;
  height: 65vh;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
  background-color: var(--color-background-primary);
  margin: 0 auto;
  gap: 30px;
}
.product-details {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 40px;
  background-color: var(--color-border);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 60vw;
  margin: 0 auto;
  gap: 30px;
}
.image-section {
  flex: 1;
  text-align: start;
}

.product-img {
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 20px;
  transition: transform 0.3s ease-in-out;
}

.product-img:hover {
  transform: scale(1.05);
}

h1 {
  font-size: 32px;
  color: var(--color-text-primary);
  margin-bottom: 20px;
}

.info-section {
  flex: 1;
  padding-left: 20px;
}

.description {
  font-size: 18px;
  color: var(--color-text-primary);
  margin-bottom: 20px;
}

.price-section {
  display: flex;
  align-items: center;
  margin-top: 20px;
  justify-content: space-between;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-accent);
}

.buy-btn {
  background-color: var(--color-accent);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.buy-btn:hover {
  background-color: var(--color-accent-dark);
}

.buy-btn:active {
  transform: scale(0.98);
}
</style>

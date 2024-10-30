<template>
  <div class="card" @click="goToProductPage">
    <img :src="product.image" alt="Product Image" class="card-img" />
    <h3>{{ product.name }}</h3>
    <p>{{ product.price }} $</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  product: Object,
});

const router = useRouter();

const goToProductPage = () => {
  router.push({ name: 'ProductDetails', params: { id: props.product.id } });
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  background-color: var(--color-background-secondary);
  border-radius: 10px;
  width: 200px;
  height: 300px;
  cursor: pointer;
  transition: transform 0.3s;
}

.card:hover {
  transform: scale(1.01);
}

.card-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

h3 {
  font-size: 18px;
  margin: 10px 0;
  color: var(--color-text-primary);
}

p {
  font-size: 12px;
  color: var(--color-accent);
}
</style>

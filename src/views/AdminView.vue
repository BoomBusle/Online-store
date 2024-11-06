<template>
  <div class="admin-view">
    <h1>Admin Panel</h1>

    <div class="tabs">
      <button @click="activeTab = 'genres'" :class="{ active: activeTab === 'genres' }">Genres</button>
      <button @click="activeTab = 'products'" :class="{ active: activeTab === 'products' }">Products</button>
      <button @click="activeTab = 'keys'" :class="{ active: activeTab === 'keys' }">Product Keys</button>
    </div>

    <div v-if="activeTab === 'genres'" class="tab-content">
      <h2>Add New Genre</h2>
      <form @submit.prevent="addGenre">
        <input v-model="newGenre" placeholder="Genre Name" required />
        <button type="submit">Add Genre</button>
      </form>

      <h2>All Genres</h2>
      <ul>
        <li v-for="genre in genres" :key="genre.id">
          <input v-model="genre.name" />
          <button @click="updateGenre(genre)">Update</button>
          <button @click="deleteGenre(genre.id)">Delete</button>
        </li>
      </ul>
    </div>

    <div v-if="activeTab === 'products'" class="tab-content">
      <h2>Add New Product</h2>
      <form @submit.prevent="addProduct">
        <input v-model="newProduct.name" placeholder="Product Name" required />
        <select v-model="newProduct.genre" required>
          <option disabled value="">Select Genre</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.name">{{ genre.name }}</option>
        </select>
        <input v-model="newProduct.descr" placeholder="Description" required />
        <input v-model="newProduct.image" placeholder="Image URL" required />
        <input v-model="newProduct.price" type="number" placeholder="Price" required />
        <button type="submit">Add Product</button>
      </form>

      <h2>All Products</h2>
      <ul>
        <li v-for="product in products" :key="product.id">
          <input v-model="product.name" placeholder="Product Name" />
          <input v-model="product.descr" placeholder="Description" />
          <input v-model="product.image" placeholder="Image URL" />
          <input v-model="product.price" type="number" placeholder="Price" />
          <button @click="updateProduct(product)">Update</button>
          <button @click="deleteProduct(product.id)">Delete</button>
        </li>
      </ul>
    </div>

    <div v-if="activeTab === 'keys'" class="tab-content">
      <h2>Add Product Keys</h2>
      <select v-model="selectedProductId">
        <option disabled value="">Select Product</option>
        <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
      </select>
      <form @submit.prevent="addKey" v-if="selectedProductId">
        <input v-model="newKey" placeholder="Product Key" required />
        <button type="submit">Add Key</button>
      </form>

      <h2>All Keys</h2>
      <ul>
        <li v-for="key in keys" :key="key.id">
          <span>{{ getProductNameById(key.productId) }}: </span>
          <input v-model="key.key" />
          <button @click="updateKey(key)">Update</button>
          <button @click="deleteKey(key.id)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/stores/store';

const store = useStore();

const activeTab = ref('genres');
const newGenre = ref('');
const newProduct = ref({
  name: '',
  genre: '',
  descr: '',
  image: '',
  price: 0,
});
const newKey = ref('');
const selectedProductId = ref('');

const genres = ref([]);
const products = ref([]);
const keys = ref([]);

onMounted(async () => {
  genres.value = await store.fetchGenres();
  products.value = await store.fetchProducts();
  keys.value = await store.fetchKeys();
});

const addGenre = async () => {
  const addedGenre = await store.addGenre(newGenre.value);
  genres.value.push(addedGenre);
  newGenre.value = '';
};

const updateGenre = async (genre) => {
  await store.updateGenre(genre);
};

const deleteGenre = async (id) => {
  await store.deleteGenre(id);
  genres.value = genres.value.filter(genre => genre.id !== id);
};

const addProduct = async () => {
  const addedProduct = await store.addProduct({ ...newProduct.value });
  products.value.push(addedProduct);
  newProduct.value = { name: '', genre: '', descr: '', image: '', price: 0 };
};

const updateProduct = async (product) => {
  await store.updateProduct(product);
};

const deleteProduct = async (id) => {
  await store.deleteProduct(id);
  products.value = products.value.filter(product => product.id !== id);
};

const addKey = async () => {
  const addedKey = await store.addKey(selectedProductId.value, newKey.value);
  keys.value.push(addedKey);
  newKey.value = '';
};

const updateKey = async (key) => {
  await store.updateKey(key);
};

const deleteKey = async (id) => {
  await store.deleteKey(id);
  keys.value = keys.value.filter(key => key.id !== id);
};

const getProductNameById = (id) => {
  const product = products.value.find(p => p.id === id);
  return product ? product.name : '';
};
</script>


<style scoped>
.admin-view {
  padding: 5vw;
  background-color: var(--color-background-primary);
  min-height: 80vh;
}
p{
  color: var(--color-text-primary);
  font-weight: bold;
}
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  margin: 1vw;
  padding: 1vw;
  border: none;
  background-color: var(--color-accent);
  cursor: pointer;
  border-radius: 5px;
  color: white;
}

button.active {
  background-color: var(--color-accent-dark);
}

.tab-content {
  max-width: 80vw;
  margin: 0 auto;
  background-color: var(--color-background-primary);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

span {
  color: var(--color-text-primary);
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

li {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 2vw;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

input {
  width: 97.5%;
  margin: 0.5vw;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  font-size: 16px;
  padding: 1vw;
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
}

select {
  width: 99%;
  margin: 0.5vw;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  font-size: 16px;
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
}

button[type="submit"] {
  background-color: var(--color-accent);
  color: white;
}

button[type="submit"]:hover {
  background-color: var(--color-accent-dark);
}

h1,
h2 {
  color: var(--color-text-primary);
  text-align: center;
  margin-top: 1vw;
  font-weight: bold;
}
</style>

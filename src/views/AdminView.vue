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
        <li v-for="(genre, index) in genres" :key="genre.id">
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
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';

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
  await fetchGenres();
  await fetchProducts();
  await fetchKeys();
});

const fetchGenres = async () => {
  const querySnapshot = await getDocs(collection(db, 'genres'));
  genres.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  products.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const fetchKeys = async () => {
  const querySnapshot = await getDocs(collection(db, 'keys'));
  keys.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getProductNameById = (id) => {
  const product = products.value.find(p => p.id === id);
  return product ? product.name : '';
};

const addGenre = async () => {
  try {
    await addDoc(collection(db, 'genres'), { name: newGenre.value.trim() });
    newGenre.value = '';
    await fetchGenres();
    alert('Genre added successfully!');
  } catch (e) {
    console.error('Error adding genre:', e);
  }
};

const addProduct = async () => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      name: newProduct.value.name,
      genre: newProduct.value.genre,
      descr: newProduct.value.descr,
      image: newProduct.value.image,
      price: newProduct.value.price,
    });
    products.value.push({ id: docRef.id, ...newProduct.value });
    newProduct.value = { name: '', genre: '', descr: '', image: '', price: 0 };
    alert('Product added successfully!');
  } catch (e) {
    console.error('Error adding product:', e);
  }
};

const addKey = async () => {
  if (selectedProductId.value && newKey.value) {
    try {
      await addDoc(collection(db, 'keys'), { productId: selectedProductId.value, key: newKey.value });
      newKey.value = '';
      await fetchKeys();
      alert('Key added successfully!');
    } catch (e) {
      console.error('Error adding key:', e);
    }
  }
};

const updateGenre = async (genre) => {
  try {
    await updateDoc(doc(db, 'genres', genre.id), { name: genre.name });
    alert('Genre updated successfully!');
  } catch (e) {
    console.error('Error updating genre:', e);
  }
};

const updateProduct = async (product) => {
  try {
    await updateDoc(doc(db, 'products', product.id), {
      name: product.name,
      descr: product.descr,
      image: product.image,
      price: product.price
    });
    alert('Product updated successfully!');
  } catch (e) {
    console.error('Error updating product:', e);
  }
};

const updateKey = async (key) => {
  try {
    await updateDoc(doc(db, 'keys', key.id), { key: key.key });
    alert('Key updated successfully!');
  } catch (e) {
    console.error('Error updating key:', e);
  }
};

const deleteGenre = async (id) => {
  try {
    await deleteDoc(doc(db, 'genres', id));
    await fetchGenres();
    alert('Genre deleted successfully!');
  } catch (e) {
    console.error('Error deleting genre:', e);
  }
};

const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, 'products', id));
    await fetchProducts();
    alert('Product deleted successfully!');
  } catch (e) {
    console.error('Error deleting product:', e);
  }
};

const deleteKey = async (id) => {
  try {
    await deleteDoc(doc(db, 'keys', id));
    await fetchKeys();
    alert('Key deleted successfully!');
  } catch (e) {
    console.error('Error deleting key:', e);
  }
};
</script>

<style scoped>
.admin-view {
  padding: 5vw;
  background-color: var(--color-background-primary);
  min-height: 80vh;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  margin: 0 10px;
  padding: 10px 15px;
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

span{
  color: var(--color-text-primary);
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

li{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}
input {
  width: 97.5%;
  margin: 0.5vw;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  font-size: 16px;
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

h1, h2 {
  color: var(--color-text-primary);
  text-align: center;
  margin-top: 1vw;
  font-weight: bold;
}

</style>

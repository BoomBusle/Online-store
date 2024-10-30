<template>
  <div class="header">
    <div class="left-section">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/catalog" class="nav-link">Catalog</router-link>
      <div class="search">
  <input
    type="text"
    placeholder="Search product..."
    v-model="searchQuery"
    @input="showSearchResults = true"
  />
  <button @click="search">
    <i class="fas fa-search search-icon"></i>
  </button>
  <div v-if="showSearchResults && filteredProducts.length > 0" class="search-results">
    <div
      v-for="product in filteredProducts"
      :key="product.id"
      @click="goToProduct(product.id)"
      class="search-result-item"
    >
      <img :src="product.image" alt="Product Image" />
      <div class="product-info">
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }} $</p>
      </div>
    </div>
  </div>
</div>

    </div>

    <div class="right-section">
      <label class="switcher">
        <input type="checkbox" v-model="isDarkTheme" />
        <span class="slider round"></span>
      </label>

      <button v-if="!isAuthenticated" @click="openLoginModal" class="login-button">Log in</button>

      <div v-else class="user-section">
        <div class="cart" @click="toggleCartModal">
          <i class="fas fa-shopping-cart cart-icon"></i>
          <span>Cart ({{ cartItems.length }})</span>
        </div>
        <div class="user-profile" @click="goToUserProfile">
          <i class="fas fa-user user-icon"></i>
          <span>{{ userName }}</span>
        </div>
        <div class="avatar" @click="goToUserProfile">
          <img :src="avatarUrl" alt="Avatar" />
        </div>
        <button @click="logout" class="logout-button">Log out</button>
      </div>
    </div>

    <div class="cart-modal" v-if="showCartModal">
      <h2>Кошик</h2>
      <div v-if="cartItems.length > 0" class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.image" alt="Product Image" class="cart-item-img" />
          <div class="cart-item-info">
            <h4>{{ item.name }}</h4>
            <p>{{ item.price }} $</p>
          </div>
          <button class="remove-btn" @click="removeFromCart(item.id)">Delete</button>
        </div>
        <div class="cart-summary">
          <p>Total: {{ totalPrice }} $</p>
          <button class="checkout-btn" @click="goToOrder" >Order</button>
        </div>
      </div>
      <div class="cart-summary" v-else>
        <p>Кошик порожній...</p>
      </div>
    </div>

    <LoginModal v-if="showLoginModal" @close="closeLoginModal" @open-register="openRegisterModal" />
    <RegisterModal v-if="showRegisterModal" @close="closeRegisterModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { collection, doc, addDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router';

import LoginModal from '../views/LoginModal.vue';
import RegisterModal from '../views/RegisterModal.vue';

const router = useRouter();

const isDarkTheme = ref(localStorage.getItem('theme') === 'dark');
const isAuthenticated = ref(false);
const userName = ref('');
const avatarUrl = ref('https://static.vecteezy.com/system/resources/previews/009/398/577/non_2x/man-avatar-clipart-illustration-free-png.png');
const showCartModal = ref(false);
const cartItems = ref([]);
const showLoginModal = ref(false);
const showRegisterModal = ref(false);

const searchQuery = ref('');
const showSearchResults = ref(false);
const products = ref([]);

const fetchProducts = async () => {
  const productsRef = collection(db, 'products');
  const productsSnapshot = await getDocs(productsRef);
  products.value = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

onMounted(() => {
  fetchProducts();
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return [];
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const goToProduct = (id) => {
  showSearchResults.value = false;
  searchQuery.value = '';
  router.push({ name: 'ProductDetails', params: { id } });
};

const search = () => {
  if (filteredProducts.value.length > 0) {
    goToProduct(filteredProducts.value[0].id);
  }
};

const openLoginModal = () => {
  showLoginModal.value = true;
};

const closeLoginModal = () => {
  showLoginModal.value = false;
};

const openRegisterModal = () => {
  showLoginModal.value = false;
  showRegisterModal.value = true;
};

const closeRegisterModal = () => {
  showRegisterModal.value = false;
};

const updateTheme = (isDark) => {
  const theme = isDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

const toggleCartModal = () => (showCartModal.value = !showCartModal.value);

const removeFromCart = async (id) => {
  if (isAuthenticated.value) {
    const cartItemRef = doc(db, `users/${auth.currentUser.uid}/cart`, id);
    await deleteDoc(cartItemRef);
  }
};

onMounted(() => {
  fetchProducts();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAuthenticated.value = true;
      userName.value = user.displayName || 'User';
      avatarUrl.value = user.photoURL || 'https://static.vecteezy.com/system/resources/previews/009/398/577/non_2x/man-avatar-clipart-illustration-free-png.png';
      const cartRef = collection(db, `users/${user.uid}/cart`);
      onSnapshot(cartRef, (snapshot) => {
        cartItems.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    } else {
      isAuthenticated.value = false;
      cartItems.value = [];
    }
  });
  updateTheme(isDarkTheme.value);
});

const totalPrice = computed(() => cartItems.value.reduce((total, item) => total + item.price, 0));

watch(isDarkTheme, (val) => {
  updateTheme(val);
});

const logout = async () => {
  try {
    await signOut(auth);
    isAuthenticated.value = false;
    userName.value = '';
    avatarUrl.value = 'https://static.vecteezy.com/system/resources/previews/009/398/577/non_2x/man-avatar-clipart-illustration-free-png.png';
    router.push('/');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

const goToUserProfile = () => {
  router.push({ name: 'user-profile', params: { username: userName.value } });
};

const goToOrder = () => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems.value)); 
  router.push({ name: 'order' });
};

const syncThemeAcrossTabs = (event) => {
  if (event.key === 'theme') {
    isDarkTheme.value = event.newValue === 'dark';
  }
};

window.addEventListener('storage', syncThemeAcrossTabs);

onUnmounted(() => {
  window.removeEventListener('storage', syncThemeAcrossTabs);
});

</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.sass";
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.search {
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background-color: var(--color-background-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  z-index: 1000;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-result-item:hover {
  background-color: var(--color-accent-light);
}

.search-result-item img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 10px;
}

.product-info h3 {
  font-size: 16px;
  margin: 0;
  color: var(--color-text-primary);
}

.product-info p {
  font-size: 14px;
  color: var(--color-accent);
}

.header {
  height: $header-height;
  background: var(--color-background-primary);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
.cart-modal {
  position: fixed;
  top: 5%;
  right: 10%;
  width: 400px;
  background-color: var(--color-border);
  border: 1px solid var(--color-border);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1000;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    text-align: center;
    color: var(--color-text-primary);
  }

  .cart-items {
    max-height: 300px;
    overflow-y: auto;
  }

  .cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    .cart-item-img {
      width: 80px;
      height: 80px;
      margin-right: 15px;
      border-radius: 8px;
    }

    .cart-item-info {
      flex-grow: 1;

      h4 {
        font-size: 18px;
        margin: 0;
        color: var(--color-accent);
      }

      p {
        font-size: 16px;
        color: var(--color-text-primary);
      }
    }

    .remove-btn {
      background-color: #f44336;
      color: white;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 5px;
    }
  }

  .cart-summary {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      font-size: 18px;
      font-weight: bold;
      color: var(--color-text-primary);
    }

    .checkout-btn {
      background-color: var(--color-accent);
      color: var(--color-text-primary);
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 5px;
    }
  }
}
.nav-link {
  color: var(--color-text-primary);
  text-decoration: none;
  margin-right: 15px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: var(--color-accent-dark);
  }
}

.left-section {
  display: flex;
  align-items: center;
}

.search {
  display: flex;
  align-items: center;

  input {
    margin-top: 0.1vw;
    padding: 7.5px;
    border: 1px solid var(--color-border);
    border-radius: 4px 0px 0px 4px;
    font-size: 14px;
    color: var(--color-text-primary);
    background-color: var(--color-background-secondary);
  }

  button {
    background: var(--color-accent);
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 0px 4px 4px 0px;
    color: white;

    i {
      font-size: 16px;
    }
  }
}

.right-section {
  display: flex;
  align-items: center;

  .login-button,
  .logout-button {
    background-color: var(--color-accent);
    border: none;
    padding: 8px 16px;
    color: white;
    cursor: pointer;
    border-radius: 22px;
    margin-left: 15px;
  }

  .user-section {
    display: flex;
    align-items: center;
    margin-left: 15px;

    .cart,
    .user-profile,
    .avatar {
      margin-left: 15px;
      display: flex;
      cursor: pointer;
      color: var(--color-accent-dark);
      align-items: center;
    }
    
    .cart-icon,
    .user-icon {
      font-size: 18px;
      margin-right: 5px;
    }

    .avatar img {
      border-radius: 50%;
      width: 32px;
      height: 32px;
    }
  }

  .switcher {
    margin-top: 0.1vw;
    position: relative;
    display: inline-block;
    width: 44px;
    height: 22px;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--color-accent);;
      transition: 0.4s;
      border-radius: 34px;

      &:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }
    }

    input:checked+.slider {
      background-color: var(--color-accent);
    }

    input:checked+.slider:before {
      transform: translateX(20px);
    }
  }
}
</style>

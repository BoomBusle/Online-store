<template>
    <div class="profile-container">
      <div class="profile-wrapper">
        <div class="profile-header">
          <img class="avatar" :src="avatarUrl" alt="User Avatar" />
          <h2>{{ username }}</h2>
        </div>
  
        <div class="user-info">
          <label>Username:</label>
          <input type="text" v-model="username" placeholder="Change Username" />
          <label>Email:</label>
          <input type="email" v-model="email" placeholder="Change Email" />
  
          <label>Password:</label>
          <input type="password" v-model="password" placeholder="New Password" />
  
          <button @click="updateUserInfo">Save Changes</button>
        </div>
      </div>
  
      <div class="orders-section">
        <h3>Orders</h3>
        <div v-if="orders.length === 0" class="no-orders">
          <span>No Orders</span>
        </div>
  
        <div v-for="order in paginatedOrders" :key="order.id" class="order-card">
          <span>Order #{{ order.id }}</span>
          <p>Delivery Address: {{ order.deliveryAddress }}</p>
          <p>Items:</p>
          <ul>
            <li v-for="item in order.items" :key="item.id">{{ item.name }}  </li>
            <li v-for="item in order.items" :key="item.id"> key:  {{ item.key }} </li>
          </ul>
        </div>
      </div>
  
      <div class="navigation">
        <button @click="prevPage" :disabled="currentPage === 1">←</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">→</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router'; 
  import { auth, db } from '@/firebase';
  import { collection, query, where, onSnapshot } from 'firebase/firestore';
  import { updateEmail, updatePassword } from 'firebase/auth';
  
  const router = useRouter(); 
  const avatarUrl = ref('https://static.vecteezy.com/system/resources/previews/009/398/577/non_2x/man-avatar-clipart-illustration-free-png.png');
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const orders = ref([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const pageSize = 5;
  
  const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return orders.value.slice(start, start + pageSize);
  });
  
  onMounted(() => {
    const user = auth.currentUser;
    if (user) {
      username.value = user.displayName || '';
      email.value = user.email;    
      if (username.value === 'Admin') {
        router.push('/adminpanel'); 
      }
    }
    fetchOrders();
  });
  
  const fetchOrders = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
  
      onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          orders.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          totalPages.value = Math.ceil(orders.value.length / pageSize);
        } else {
          orders.value = [];
        }
      }, (error) => {
        console.error("Error fetching orders:", error);
      });
    } else {
      console.error('No user is currently logged in');
    }
  };
  
  const updateUserInfo = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateEmail(user, email.value);
        if (password.value) {
          await updatePassword(user, password.value);
        }
        console.log('User information updated');
      } catch (error) {
        console.error('Error updating user information', error);
      }
    }
  };
  
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: var(--color-background-primary);
    color: #333;
    min-height: 100vh;
  }
  
  .profile-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: row;
    width: 90vw;
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .profile-header {
    h2 {
      font-size: 36px;
      font-weight: bold;
      color: var(--color-accent);
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .avatar {
    border-radius: 50%;
    width: 300px;
    height: 300px;
    margin-bottom: 10px;
  }
  
  .user-info {
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
    
  }
  
  .user-info input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    @media (max-width: 768px) {
      width: 90%;
    }
  }
  
  button {
    background-color: var(--color-accent);
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: var(--color-accent-dark);
  }
  
  .orders-section {
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
    h3{
        text-align: center;
        font-weight: bold;
        color: var(--color-accent);
    }
  }
  
  .order-card {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 5px;
    span{
        color: var(--color-accent);
    }
    p{
        color: var(--color-text-primary);
    }
    li{
        color: var(--color-text-primary);
    }
  }
  
  .no-orders {
    text-align: center;
    color: #666;
  }
  
  .navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    span{
        color: var(--color-text-primary);
    }
  }
  
  button[disabled] {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  
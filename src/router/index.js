import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CatalogView from '../views/CatalogView.vue';
import AdminView from '@/views/AdminView.vue';
import UserProfileView from '@/views/UserProfileView.vue';
import ProductDetails from '@/views/ProductDetails.vue';
import OrderView from '@/views/OrderView.vue';
import { auth } from '@/firebase'; 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: CatalogView
    },
    {
      path: '/adminpanel',
      name: 'adminpanel',
      component: AdminView,
      meta: { requiresAuth: true } 
    },
    {
      path: '/user/:username',
      name: 'user-profile',
      component: UserProfileView,
      props: true,
      meta: { requiresAuth: true } 
    },
    {
      path: '/product/:id',
      name: 'ProductDetails',
      component: ProductDetails,
      props: true,
    },
    {
      path: '/order',
      name: 'order',
      component: OrderView,
      props: true,
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser; 

  if (requiresAuth && !currentUser) {
    next('/'); 
  } else {
    next(); 
  }
});

export default router;

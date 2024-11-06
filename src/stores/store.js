import { defineStore } from 'pinia';
import { db } from '@/firebase';
import { collection, addDoc, getDocs, getDoc, updateDoc, query, where, deleteDoc, doc, limit,onSnapshot } from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';

export const useStore = defineStore('admin', () => {

  const fetchGenres = async () => {
    const querySnapshot = await getDocs(collection(db, 'genres'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };
  const fetchProduct = async (productId) => {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    return productSnap.exists() ? { id: productId, ...productSnap.data() } : null;
  };
  const fetchKeys = async () => {
    const querySnapshot = await getDocs(collection(db, 'keys'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const fetchSales = async () => {
    const salesSnapshot = await getDocs(collection(db, 'orders'));
    return salesSnapshot.size;
  };
  const fetchAchievements = async () => {
    const salesSnapshot = await getDocs(collection(db, 'orders'));
    const gamesSnapshot = await getDocs(collection(db, 'products'));
    const genresSnapshot = await getDocs(collection(db, 'genres'));

    return [
      { title: 'Number of Sales', value: salesSnapshot.size },
      { title: 'Number of Games on Sale', value: gamesSnapshot.size },
      { title: 'Number of Genres', value: genresSnapshot.size },
    ];
  };
  const fetchKeyCount = async (productId) => {
    const keysRef = collection(db, 'keys');
    const keysQuery = query(keysRef, where('productId', '==', productId));
    const keysSnapshot = await getDocs(keysQuery);
    return keysSnapshot.size;
  };
  const fetchAndDeleteKey = async (productId) => {
    const keysRef = collection(db, 'keys');
    const keyQuery = query(keysRef, where('productId', '==', productId), limit(1));
    const keySnapshot = await getDocs(keyQuery);
    if (!keySnapshot.empty) {
      const keyDoc = keySnapshot.docs[0];
      await deleteDoc(doc(db, 'keys', keyDoc.id));
      return { id: keyDoc.id, ...keyDoc.data() };
    } else {
      return null;
    }
  };
  const fetchOrders = (userId, orders) => {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        orders.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } else {
        orders.value = [];
      }
    }, (error) => {
      console.error("Error fetching orders:", error);
    });
  };

  const updateUserInfo = async (user, email, password) => {
    try {
      await updateEmail(user, email);
      if (password) {
        await updatePassword(user, password);
      }
      console.log('User information updated');
    } catch (error) {
      console.error('Error updating user information', error);
    }
  };
  const addOrder = async (userId, orderedItems) => {
    await addDoc(collection(db, 'orders'), {
      items: orderedItems,
      userId,
      createdAt: new Date(),
    });
  };

  const clearCartFromDatabase = async (userId) => {
    const cartCollectionRef = collection(db, 'users', userId, 'cart');
    const cartSnapshot = await getDocs(cartCollectionRef);
    const deletePromises = cartSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  };
  const addToCart = async (userId, product) => {
    const cartRef = collection(db, `users/${userId}/cart`);
    await addDoc(cartRef, {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      descr: product.descr,
    });
  };

  const addGenre = async (name) => {
    const docRef = await addDoc(collection(db, 'genres'), { name });
    return { id: docRef.id, name };
  };

  const addProduct = async (product) => {
    const docRef = await addDoc(collection(db, 'products'), product);
    return { id: docRef.id, ...product };
  };

  const addKey = async (productId, key) => {
    const docRef = await addDoc(collection(db, 'keys'), { productId, key });
    return { id: docRef.id, productId, key };
  };

  const updateGenre = async (genre) => {
    await updateDoc(doc(db, 'genres', genre.id), { name: genre.name });
  };

  const updateProduct = async (product) => {
    await updateDoc(doc(db, 'products', product.id), {
      name: product.name,
      descr: product.descr,
      image: product.image,
      price: product.price,
    });
  };

  const updateKey = async (key) => {
    await updateDoc(doc(db, 'keys', key.id), { key: key.key });
  };

  const deleteGenre = async (id) => {
    await deleteDoc(doc(db, 'genres', id));
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const deleteKey = async (id) => {
    await deleteDoc(doc(db, 'keys', id));
  };

  return {
    fetchGenres,
    fetchProducts,
    fetchProduct,
    fetchKeys,
    fetchSales,
    fetchAchievements,
    fetchKeyCount,
    fetchAndDeleteKey,
    fetchOrders, 
    updateUserInfo,
    addOrder,
    clearCartFromDatabase,
    addToCart,
    addGenre,
    addProduct,
    addKey,
    updateGenre,
    updateProduct,
    updateKey,
    deleteGenre,
    deleteProduct,
    deleteKey,
  };
});

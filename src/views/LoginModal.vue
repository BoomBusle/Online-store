<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="emitClose">&times;</span>
      <h2>Log in</h2>
      <input type="email" placeholder="Email" v-model="loginData.email" />
      <input type="password" placeholder="Password" v-model="loginData.password" />
      <button @click="handleLogin">Log in</button>
      <p>Don't have an account? <button class="btn-reg" @click="emitRegister">Sign up</button></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase'; 

const emit = defineEmits(['close', 'open-register']); 

const loginData = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, loginData.value.email, loginData.value.password);
    console.log('Logged in:', loginData.value.email);
    emit('close'); 
  } catch (error) {
    console.error('Login error:', error.message);
  }
};

const emitClose = () => {
  emit('close');
};

const emitRegister = () => {
  emit('open-register');
};
</script>

  
  <style scoped>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
  
  .modal-content {
    background-color: var(--color-background-primary);
    padding: 30px;
    border-radius: 15px;
    width: 35vw;
    text-align: center;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--color-border);
    transition: all 0.3s ease-in-out;
  }
  
  .close {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
    font-size: 24px;
    color: var(--color-text-primary);
    transition: color 0.2s;
  }
  
  .close:hover {
    color: var(--color-accent);
  }
  
  h2 {
    color: var(--color-text-primary);
    font-size: 22px;
    margin-bottom: 20px;
  }
  
  input {
    width: 90%;
    padding: 12px;
    margin: 10px 0;
    border: 1px solid var(--color-border);
    border-radius: 5px;
    background-color: var(--color-background-primary);
    color: var(--color-text-primary);
    transition: all 0.3s ease;
  }
  
  input:focus {
    border-color: var(--color-accent);
    outline: none;
  }
  
  button {
    width: 95%;
    padding: 12px;
    margin-top: 20px;
    background-color: var(--color-accent);
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: var(--color-accent-dark);
  }
  
  p {
    margin-top: 15px;
    color: var(--color-text-primary);
  }
  
  p .btn-reg {
    background: none;
    border: none;
    color: var(--color-accent);
    cursor: pointer;
    font-size: 14px;
    transition: color 0.3s ease;
  }
  
  p .btn-reg:hover {
    color: darken(var(--color-accent), 10%);
  }
  </style>
  

  
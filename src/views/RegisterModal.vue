<template>
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="emitClose">&times;</span>
        <h2>Sign up</h2>
  
        <input type="text" placeholder="Username" v-model="registerData.username" @input="validateUsername" />
        <span v-if="errors.username" class="error">{{ errors.username }}</span>
  
        <input type="email" placeholder="Email" v-model="registerData.email" @input="validateEmail" />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
  
        <div class="password-input-wrapper">
          <input :type="showPassword ? 'text' : 'password'" placeholder="Password" v-model="registerData.password" @input="validatePassword" />
          <button type="button" class="toggle-password" @click="togglePasswordVisibility">{{ showPassword ? 'Hide' : 'Show' }}</button>
        </div>
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
  
        <div class="password-strength-bar">
          <div class="strength-bar" :style="{ width: passwordStrengthValue + '%' }" :class="passwordStrengthClass"></div>
        </div>
        <p v-if="passwordStrength" class="strength-text">Password strength: {{ passwordStrength }}</p>
  
        <ul class="password-tips">
          <li :class="{ passed: registerData.password.length >= 8 }">At least 8 characters</li>
          <li :class="{ passed: /[A-Z]/.test(registerData.password) }">At least 1 uppercase letter</li>
          <li :class="{ passed: /[a-z]/.test(registerData.password) }">At least 1 lowercase letter</li>
          <li :class="{ passed: /[0-9]/.test(registerData.password) }">At least 1 number</li>
          <li :class="{ passed: /[\W_]/.test(registerData.password) }">At least 1 special character</li>
        </ul>
  
        <button :disabled="passwordStrengthValue < 50" @click="handleRegister">Sign up</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
  import { auth } from '@/firebase';
  
  const emit = defineEmits(['close']);
  
  const registerData = ref({
    username: '',
    email: '',
    password: ''
  });
  
  const errors = ref({
    username: null,
    email: null,
    password: null
  });
  
  const showPassword = ref(false);
  const passwordStrength = ref('');
  const passwordStrengthValue = ref(0);
  const passwordStrengthClass = ref('weak');
  
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };
  
  const validateUsername = () => {
    if (!registerData.value.username) {
      errors.value.username = 'Username is required';
    } else if (registerData.value.username.length < 3) {
      errors.value.username = 'Username must be at least 3 characters';
    } else {
      errors.value.username = null;
    }
  };
  
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerData.value.email) {
      errors.value.email = 'Email is required';
    } else if (!emailRegex.test(registerData.value.email)) {
      errors.value.email = 'Please enter a valid email (e.g., user@example.com)';
    } else {
      errors.value.email = null;
    }
  };
  
  const validatePassword = () => {
    const password = registerData.value.password;
    let strengthValue = 0;
  
    if (password.length >= 8) strengthValue += 25;
    if (/[A-Z]/.test(password)) strengthValue += 25;
    if (/[0-9]/.test(password)) strengthValue += 25;
    if (/[\W_]/.test(password)) strengthValue += 25;
  
    passwordStrengthValue.value = strengthValue;
  
    if (strengthValue >= 75) {
      passwordStrength.value = 'Strong';
      passwordStrengthClass.value = 'strong';
    } else if (strengthValue >= 50) {
      passwordStrength.value = 'Medium';
      passwordStrengthClass.value = 'medium';
    } else {
      passwordStrength.value = 'Weak';
      passwordStrengthClass.value = 'weak';
    }
  
    errors.value.password = password.length >= 8 ? null : 'Password must be at least 8 characters';
  };
  
  const handleRegister = async () => {
    validateUsername();
    validateEmail();
    validatePassword();
  
    if (!errors.value.username && !errors.value.email && !errors.value.password && passwordStrengthValue.value >= 50) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, registerData.value.email, registerData.value.password);
        
        await updateProfile(userCredential.user, {
          displayName: registerData.value.username,
        });
  
        console.log('Registered:', userCredential.user.email, 'Username:', registerData.value.username);
        emit('close'); 
      } catch (error) {
        console.error('Registration error:', error.message);
      }
    }
  };
  const emitClose = async () =>{
    emit('close'); 
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
  
  .password-input-wrapper {
    position: relative;
  }
  
  .toggle-password {
    position: absolute;
    top: 18%;
    right: 3%;
    width: 4vw;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-accent);
    font-size: 14px;
  }
  
  .error {
    color: red;
    font-size: 12px;
    margin-bottom: 10px;
    display: block;
  }
  
  .password-strength-bar {
    width: 95%;
    background-color: #ddd;
    height: 8px;
    border-radius: 4px;
    margin-left: 1vw;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  
  .strength-bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .strength-bar.weak {
    background-color: red;
  }
  
  .strength-bar.medium {
    background-color: orange;
  }
  
  .strength-bar.strong {
    background-color: green;
  }
  
  .strength-text {
    font-size: 12px;
    color: var(--color-accent);
    margin-top: 5px;
  }
  
  .password-tips {
    text-align: left;
    list-style: none;
    padding: 0;
    margin-top: 10px;
    margin-left: 1vw;
    color: var(--color-text-primary);
    font-size: 12px;
  }
  
  .password-tips li {
    margin-bottom: 5px;
  }
  
  .password-tips li.passed {
    color: green;
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
  
  button[disabled] {
    background-color: gray;
    cursor: not-allowed;
  }
  
  button:hover:not([disabled]) {
    background-color: var(--color-accent-dark);
  }
  </style>
  
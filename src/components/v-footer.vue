<template>
    <footer>
      <div class="footer-section">
        <h3>Contact Us</h3>
        <ul class="contact-list">
          <li><i class="fas fa-envelope"></i> info123@company.com</li>
          <li><i class="fas fa-phone-alt"></i> +38 (099) 123-45-67</li>
          <li><i class="fas fa-map-marker-alt"></i> Kyiv, Ukraine</li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3>Follow Us</h3>
        <div class="social-icons">
          <a href="#" class="icon-link">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#" class="icon-link">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" class="icon-link">
            <i class="fab fa-twitter"></i>
          </a>
        </div>
      </div>
  
      <div class="footer-section">
        <form class="subscribe-form">
          <h3>Subscribe to Newsletter</h3>
          <input type="email" placeholder="Your email" class="email-input" />
          <button type="submit" class="subscribe-btn">Subscribe</button>
        </form>
      </div>
    </footer>
  </template>
  
  <script setup>
  </script>
  
  <style lang="scss" scoped>
  footer {
  display: flex;
  justify-content: space-evenly;
  padding: 40px;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background-primary);
  color: var(--color-accent);
  text-align: center;

  .footer-section {
    flex: 1;
    margin: 0 20px;
  }

  h3 {
    font-size: 20px;
    margin-bottom: 15px;
    color: var(--color-accent);
  }

  .contact-list {
    list-style-type: none;
    padding: 0;
  }

  .contact-list li {
    margin-bottom: 10px;
    font-size: 16px;
  }

  .social-icons {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  .icon-link i {
    font-size: 30px;
    color: var(--color-accent);
    transition: transform 0.3s ease;
  }

  .subscribe-form {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .email-input {
    padding: 10px;
    border: 2px solid var(--color-accent);
    border-radius: 5px;
    width: 200px;
  }

  .subscribe-btn {
    background-color: var(--color-accent);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;

    .footer-section {
      margin: 15px 0;
    }

    .email-input {
      width: 100%; 
    }

    .subscribe-form {
      display: none;
    }
  }

}

  </style>
  
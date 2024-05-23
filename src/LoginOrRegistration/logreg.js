$(document).ready(function() {
  // Инициализация вкладки при загрузке страницы
  $('.tab-button').removeClass('active');
  $('.tab-content').removeClass('active').hide();
  $('[data-tab="login"]').addClass('active');
  $('#login').addClass('active').show();
  
  $('.tab-button').click(function() {
      var tabId = $(this).data('tab');
      
      $('.tab-button').removeClass('active');
      $(this).addClass('active');
      
      $('.tab-content').removeClass('active').hide();
      $('#' + tabId).addClass('active').show();
  });

  $('#show-login-password').click(function() {
      var passwordField = $('#login-password');
      if (passwordField.attr('type') === 'password') {
          passwordField.attr('type', 'text');
      } else {
          passwordField.attr('type', 'password');
      }
  });

  $('#show-register-password').click(function() {
      var passwordField = $('#register-password');
      if (passwordField.attr('type') === 'password') {
          passwordField.attr('type', 'text');
      } else {
          passwordField.attr('type', 'password');
      }
  });

  $('#login-form').submit(function(event) {
      event.preventDefault();
      var loginData = {
          phone: $('#login-phone').val(),
          password: $('#login-password').val()
      };
      $.ajax({
          url: '/login',
          method: 'POST',
          data: JSON.stringify(loginData),
          contentType: 'application/json',
          success: function(response) {
              alert('Login successful!');
              // Redirect or handle successful login
          },
          error: function(error) {
              alert('Login failed!');
          }
      });
  });

  $('#register-form').submit(function(event) {
      event.preventDefault();
      var registerData = {
          lastName: $('#register-last-name').val(),
          firstName: $('#register-first-name').val(),
          middleName: $('#register-middle-name').val(),
          phone: $('#register-phone').val(),
          birthday: $('#register-birthday').val(),
          password: $('#register-password').val()
      };
      $.ajax({
          url: '/register',
          method: 'POST',
          data: JSON.stringify(registerData),
          contentType: 'application/json',
          success: function(response) {
              alert('Registration successful!');
              // Redirect or handle successful registration
          },
          error: function(error) {
              alert('Registration failed!');
          }
      });
  });
});

function goToMain() {
  window.location.href = '../main/main.html';
}

let selectRole = '';
$(document).ready(function() {
  const userId = localStorage.getItem('userId');
  // console.log("Ваш " + userId);
  if (userId) {
      // console.log('Пользователь с ID ' + userId + ' вошел в систему.');
      $('#addUserButton').show();
      $('#logoutLink').show();
  } else {
      // console.log('Пользователь не вошел в систему.');
  }

  // Функция для получения HTML-кода пользователя
  function getUserHTML(user) {
      const userContainer = document.createElement('div');
      userContainer.classList.add('user');
      userContainer.setAttribute('data-id', user._id);

      const name = document.createElement('h2');
      name.textContent = `${user.firstName} ${user.lastName}`;
      userContainer.appendChild(name);

      const phone = document.createElement('p');
      phone.textContent = `Номер телефона: ${user.phone}`;
      userContainer.appendChild(phone);

      userContainer.addEventListener('click', () => {
          const userId = userContainer.getAttribute('data-id');
          window.location.href = `../../profDate/profDate.html?userId=${userId}`;
      });

      return userContainer;
  }

  // Функция для загрузки пользователей
  function loadUsers(searchQuery, role) {
      const container = document.getElementById('userContainer');
      container.innerHTML = '';

      let url = '/users';
      let query = {};
      if (role) {
          query.role = role;
      }
      if (searchQuery) {
          query.searchQuery = searchQuery;
      }

      $.get(url, query, function(data) {
          container.innerHTML = '';
          data.forEach(user => {
              container.appendChild(getUserHTML(user));
          });
      }).fail(function(error) {
          console.error('Ошибка:', error);
          container.innerHTML = '';
          const textMessage = document.createElement('p');
          textMessage.textContent = 'Ошибка при загрузке данных. Пожалуйста, попробуйте еще раз позже.';
          container.appendChild(textMessage);
      });
  }



// Внутри document.ready
$('#searchButton').click(function() {
    const searchQuery = $('#searchInput').val();
    loadUsers(searchQuery, selectRole);
    console.log(searchQuery + ' _ ' + selectRole);
});

$('#resetButton').click(function() {
    loadUsers();
    selectRole = '';

    $('#searchInput').val('');

});

// И другие обработчики событий для кнопок фильтрации ролей

  $('#allUsersButton').click(function() {
      selectRole = '';
      const searchQuery = $('#searchInput').val();
    loadUsers(searchQuery, selectRole);
    console.log(searchQuery + ' _ ' + selectRole);


      
  });

  $('#userGuestButton').click(function() {
      selectRole = 'user';
      const searchQuery = $('#searchInput').val();
    loadUsers(searchQuery, selectRole);
    console.log(searchQuery + ' _ ' + selectRole);


  });

  $('#staffButton').click(function() {
      selectRole = 'moderator';
      const searchQuery = $('#searchInput').val();
    loadUsers(searchQuery, selectRole);
    console.log(searchQuery + ' _ ' + selectRole);



  });

  $('#adminButton').click(function() {
      selectRole = 'admin';
      const searchQuery = $('#searchInput').val();
    loadUsers(searchQuery, selectRole);
    console.log(searchQuery + ' _ ' + selectRole);



  });

  $('#logoutLink').click(function(event) {
      event.preventDefault();
      localStorage.removeItem('userId');
      window.location.href = '../../LoginOrRegistration/logreg.html';
  });

  loadUsers();
});

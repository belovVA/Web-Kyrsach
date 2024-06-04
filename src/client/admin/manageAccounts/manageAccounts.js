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
  function loadUsers(role) {
      const container = document.getElementById('userContainer');
      container.innerHTML = '';

      let url = '/users';
      // console.log(role);
      if (role) {
          url = `/usersByRole?role=${role}`;
      }

      fetch(url)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Ошибка при загрузке данных');
              }
              return response.json();
          })
          .then(data => {
              // console.log('Fetched users:', data);
              container.innerHTML = '';
              data.forEach(user => {
                  container.appendChild(getUserHTML(user));
              });
          })
          .catch(error => {
              console.error('Ошибка:', error);
              container.innerHTML = '';
              const textMessage = document.createElement('p');
              textMessage.textContent = 'Ошибка при загрузке данных. Пожалуйста, попробуйте еще раз позже.';
              container.appendChild(textMessage);
          });
  }

  $('#resetButton').click(function() {
      loadUsers();
  });

  $('#allUsersButton').click(function() {
      loadUsers();
  });

  $('#userGuestButton').click(function() {
      loadUsers('user');
  });

  $('#staffButton').click(function() {
      loadUsers('moderator');
  });

  $('#adminButton').click(function() {
      loadUsers('admin');
  });

  $('#logoutLink').click(function(event) {
      event.preventDefault();
      localStorage.removeItem('userId');
      window.location.href = '../../LoginOrRegistration/logreg.html';
  });

  loadUsers();
});

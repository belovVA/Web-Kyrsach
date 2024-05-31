  $(document).ready(function() {
    // const urlParams = new URLSearchParams(window.location.search);
  const userId = localStorage.getItem('userId');

  if (userId) {
    $('#profileLink').attr('href', `../profile/profile.html?userId=${userId}`).show();
      // console.log('Пользователь с ID ' + userId + ' вошел в систему.');
      // Получаем информацию о пользователе с сервера
      fetch(`/profile/${userId}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Ошибка при загрузке профиля пользователя');
              }
              return response.json();
          })
          .then(user => {
              console.log('Получен профиль пользователя:', user);
              // Проверяем роль пользователя
              var roleSelect = $('#role');
        roleSelect.empty(); // Очищаем существующие опции
              if (user.role === "superadmin") {
                roleSelect.append($('<option>', {value: 'user', text: 'User'}));
                roleSelect.append($('<option>', {value: 'moderator', text: 'Moderator'}));
                roleSelect.append($('<option>', {value: 'admin', text: 'Admin'}));
            } else if (user.role === "admin") {
                roleSelect.append($('<option>', {value: 'user', text: 'User'}));
                roleSelect.append($('<option>', {value: 'moderator', text: 'Moderator'}));
            }
            });
          }
    $('#createUserForm').submit(function(event) {
        event.preventDefault();

        if ($('#password').val() !== $('#confirmPassword').val()) {
            alert('Пароли не совпадают!');
            return;
        }

        const newUser = {
            lastName: $('#surname').val(),
            firstName: $('#name').val(),
            middleName: $('#middlename').val(),
            phone: $('#phone').val(),
            role: $('#role').val(),
            password: $('#password').val()
        };

        $.ajax({
            url: '/usersNew',
            method: 'POST',
            data: JSON.stringify(newUser),
            contentType: 'application/json',
            success: function(response) {
                alert('Пользователь успешно создан!');
                window.location.href = '../manageAccounts/manageAccounts.html';
            },
            error: function(error) {
                alert('Ошибка при создании пользователя!');
            }
        });
    });

    $('#backButton').click(function() {
        window.location.href = '../manageAccounts/manageAccounts.html';
    });
  });

// Скрипт регистрации пользователя
function registerUser() {
  // Получаем значения из формы
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const city = document.getElementById('cityReg').value.trim();
  const street = document.getElementById('street').value.trim();
  const entrance = document.getElementById('entrance').value.trim();
  const floor = document.getElementById('floor').value.trim();
  const apartment = document.getElementById('apartment').value.trim();
  const photoInput = document.getElementById('photo');
  // Проверка обязательных полей
  if (!firstName || !lastName || !city || !street) {
    alert('Пожалуйста, заполните все обязательные поля.');
    return;
  }
  const user = {
    firstName,
    lastName,
    city,
    street,
    entrance,
    floor,
    apartment,
    photo: null,
  };
  // Функция сохранения пользователя
  const saveUser = () => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(user));
      alert('Регистрация успешно завершена!');
      window.location.href = 'index.html';
    } catch (e) {
      console.error('Ошибка при сохранении данных пользователя:', e);
      alert('Не удалось сохранить данные.');
    }
  };
  // Если выбран файл для фото, считываем его как Data URL
  if (photoInput && photoInput.files && photoInput.files[0]) {
    const file = photoInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      user.photo = e.target.result;
      saveUser();
    };
    reader.onerror = function (e) {
      console.warn('Не удалось прочитать файл. Регистрация без фото.', e);
      saveUser();
    };
    reader.readAsDataURL(file);
  } else {
    saveUser();
  }
}
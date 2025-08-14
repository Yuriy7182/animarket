// Данные об агентствах (идентично основному файлу script.js)
const agenciesData = [
  {
    id: 1,
    name: "Весёлые герои",
    city: "Павлодар",
    desc: "Организация детских праздников с любимыми супергероями. Большой опыт и индивидуальный подход.",
    characters: ["Человек‑паук", "Бэтмен", "Капитан Марвел"],
    rating: 4.8,
    image: "https://picsum.photos/id/1011/400/300",
    animations: [
      {
        name: "Человек‑паук",
        price: 15000,
        popularity: 5,
        image: "https://picsum.photos/id/1020/400/200"
      },
      {
        name: "Бэтмен",
        price: 16000,
        popularity: 4,
        image: "https://picsum.photos/id/1019/400/200"
      },
      {
        name: "Капитан Марвел",
        price: 14000,
        popularity: 3,
        image: "https://picsum.photos/id/1039/400/200"
      }
    ]
  },
  {
    id: 2,
    name: "Сказочный мир",
    city: "Аксу",
    desc: "Агентство, которое подарит детям настоящую сказку. Яркие костюмы и волшебные персонажи.",
    characters: ["Эльза", "Принцесса София", "Рапунцель"],
    rating: 4.2,
    image: "https://picsum.photos/id/1015/400/300",
    animations: [
      {
        name: "Эльза",
        price: 12000,
        popularity: 5,
        image: "https://picsum.photos/id/1016/400/200"
      },
      {
        name: "Принцесса София",
        price: 11000,
        popularity: 3,
        image: "https://picsum.photos/id/1043/400/200"
      },
      {
        name: "Рапунцель",
        price: 13000,
        popularity: 4,
        image: "https://picsum.photos/id/1018/400/200"
      }
    ]
  },
  {
    id: 3,
    name: "Супер команда",
    city: "Астана",
    desc: "Мы знаем, как увлечь детей всех возрастов. От супергероев до сказочных персонажей — всё для вашего праздника.",
    characters: ["Супермен", "Чудо‑женщина", "Человек‑паук"],
    rating: 4.5,
    image: "https://picsum.photos/id/1005/400/300",
    animations: [
      {
        name: "Супермен",
        price: 17000,
        popularity: 4,
        image: "https://picsum.photos/id/1035/400/200"
      },
      {
        name: "Чудо‑женщина",
        price: 15500,
        popularity: 5,
        image: "https://picsum.photos/id/1048/400/200"
      },
      {
        name: "Человек‑паук",
        price: 16000,
        popularity: 3,
        image: "https://picsum.photos/id/1020/400/200"
      }
    ]
  }
];

let currentAgency = null;

// Переменная для хранения комментариев текущего агентства
let currentComments = [];

// Получаем параметр id из URL или localStorage
function getAgencyId() {
  const params = new URLSearchParams(window.location.search);
  let id = params.get('id');
  if (!id) {
    // fallback: попробуем localStorage
    id = localStorage.getItem('selectedAgencyId');
  }
  return id ? parseInt(id) : null;
}

// Отобразить информацию об агентстве
function renderAgency() {
  const id = getAgencyId();
  currentAgency = agenciesData.find(a => a.id === id);
  if (!currentAgency) {
    document.getElementById('agency-content').innerHTML = '<p>Агентство не найдено.</p>';
    return;
  }
  // Заголовок
  document.getElementById('agency-title').textContent = currentAgency.name;
  const infoContainer = document.getElementById('agency-info');
  infoContainer.innerHTML = '';
  // Выводим основные данные
  const desc = document.createElement('p');
  desc.textContent = currentAgency.desc;
  const city = document.createElement('p');
  city.innerHTML = `<strong>Город:</strong> ${currentAgency.city}`;
  const rating = document.createElement('p');
  rating.innerHTML = `<strong>Рейтинг:</strong> ${currentAgency.rating.toFixed(1)}`;
  infoContainer.appendChild(city);
  infoContainer.appendChild(rating);
  infoContainer.appendChild(desc);
  // Отобразить анимации по умолчанию
  sortAnimations();
  // Инициализируем комментарии
  initComments();
}

// Сортировка анимаций и их отображение
function sortAnimations() {
  if (!currentAgency) return;
  const sortSelect = document.getElementById('sort-select');
  const criteria = sortSelect.value;
  let sorted = [...currentAgency.animations];
  if (criteria === 'price') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (criteria === 'popularity') {
    sorted.sort((a, b) => b.popularity - a.popularity);
  }
  renderAnimations(sorted);
}

// Отрисовать список анимаций
function renderAnimations(list) {
  const container = document.getElementById('animation-list');
  container.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'animation-card';

    // Изображение
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;

    // Контейнер для текста
    const info = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = item.name;
    const price = document.createElement('p');
    price.innerHTML = `<strong>Цена:</strong> ${item.price} ₸/час`;
    const popularity = document.createElement('p');
    popularity.innerHTML = `<strong>Популярность:</strong> ${item.popularity}`;

    info.appendChild(title);
    info.appendChild(price);
    info.appendChild(popularity);

    card.appendChild(img);
    card.appendChild(info);
    container.appendChild(card);
  });
}

function goBack() {
  window.location.href = 'index.html';
}

// === Комментарии ===

// Инициализация комментариев и формы
function initComments() {
  const user = localStorage.getItem('userProfile');
  const commentsKey = getCommentsKey();
  try {
    currentComments = JSON.parse(localStorage.getItem(commentsKey)) || [];
  } catch (e) {
    currentComments = [];
  }
  renderCommentForm(user);
  renderComments();
}

// Получение ключа для комментариев текущего агентства
function getCommentsKey() {
  return currentAgency ? `comments_${currentAgency.id}` : 'comments_unknown';
}

// Отрисовать форму добавления комментария
function renderCommentForm(user) {
  const formContainer = document.getElementById('comment-form');
  formContainer.innerHTML = '';
  if (!user) {
    formContainer.innerHTML =
      '<p>Чтобы оставить комментарий, пожалуйста, <a href="register.html">зарегистрируйтесь</a>.</p>';
    return;
  }
  // Создаем textarea и кнопку
  const textarea = document.createElement('textarea');
  textarea.id = 'commentText';
  textarea.rows = 3;
  textarea.placeholder = 'Ваш комментарий...';
  textarea.style.width = '100%';
  textarea.style.padding = '8px';
  textarea.style.marginBottom = '10px';
  textarea.style.border = '1px solid #ccd4e0';
  textarea.style.borderRadius = '6px';

  const btn = document.createElement('button');
  btn.textContent = 'Добавить комментарий';
  btn.onclick = submitComment;

  formContainer.appendChild(textarea);
  formContainer.appendChild(btn);
}

// Сохранить комментарий
function submitComment() {
  const textArea = document.getElementById('commentText');
  if (!textArea) return;
  const text = textArea.value.trim();
  if (!text) {
    alert('Пожалуйста, введите текст комментария.');
    return;
  }
  const user = JSON.parse(localStorage.getItem('userProfile'));
  if (!user) {
    alert('Для добавления комментария необходимо зарегистрироваться.');
    return;
  }
  const newComment = {
    id: Date.now(),
    author: `${user.firstName} ${user.lastName}`,
    text: text,
    likes: 0,
    likedBy: [] // список пользователей, поставивших лайк
  };
  currentComments.push(newComment);
  // Сохраняем в localStorage
  localStorage.setItem(getCommentsKey(), JSON.stringify(currentComments));
  // Очищаем поле
  textArea.value = '';
  renderComments();
}

// Отрисовать все комментарии
function renderComments() {
  const list = document.getElementById('comments-list');
  list.innerHTML = '';
  if (!currentComments || currentComments.length === 0) {
    list.innerHTML = '<p>Комментариев пока нет. Будьте первым!</p>';
    return;
  }
  // Получаем данные пользователя для проверки лайков
  const user = localStorage.getItem('userProfile');
  let likedComments = [];
  let userName = '';
  if (user) {
    const u = JSON.parse(user);
    userName = `${u.firstName} ${u.lastName}`;
    likedComments = u.likedComments || [];
  }
  currentComments.forEach(comment => {
    const card = document.createElement('div');
    card.style.backgroundColor = '#fff';
    card.style.border = '1px solid #e5eaf0';
    card.style.borderRadius = '8px';
    card.style.padding = '15px';
    card.style.marginBottom = '10px';
    // Автор
    const authorEl = document.createElement('p');
    authorEl.innerHTML = `<strong>${comment.author}</strong>`;
    card.appendChild(authorEl);
    // Текст
    const textEl = document.createElement('p');
    textEl.textContent = comment.text;
    card.appendChild(textEl);
    // Контейнер лайков и кнопки
    const likeContainer = document.createElement('div');
    likeContainer.style.display = 'flex';
    likeContainer.style.alignItems = 'center';
    likeContainer.style.gap = '6px';
    // Кнопка лайка
    const likeButton = document.createElement('button');
    likeButton.textContent = '❤️';
    likeButton.style.backgroundColor = 'transparent';
    likeButton.style.border = 'none';
    likeButton.style.cursor = 'pointer';
    likeButton.style.fontSize = '1.2rem';
    // Определяем, лайкнул ли пользователь
    const liked = likedComments.includes(comment.id);
    likeButton.style.opacity = liked ? '1' : '0.5';
    likeButton.onclick = function () {
      likeComment(comment.id);
    };
    const likeCount = document.createElement('span');
    likeCount.textContent = comment.likes;
    likeContainer.appendChild(likeButton);
    likeContainer.appendChild(likeCount);
    card.appendChild(likeContainer);
    list.appendChild(card);
  });
}

// Поставить лайк
function likeComment(commentId) {
  const userStr = localStorage.getItem('userProfile');
  if (!userStr) {
    alert('Чтобы ставить лайки, пожалуйста, зарегистрируйтесь.');
    return;
  }
  const user = JSON.parse(userStr);
  // Проверяем, лайкнул ли пользователь
  user.likedComments = user.likedComments || [];
  const idx = user.likedComments.indexOf(commentId);
  // Находим комментарий
  const comment = currentComments.find(c => c.id === commentId);
  if (!comment) return;
  if (idx === -1) {
    // ещё не лайкнул: увеличиваем лайки
    comment.likes += 1;
    user.likedComments.push(commentId);
  } else {
    // уже лайкнул: снимаем лайк
    comment.likes = Math.max(0, comment.likes - 1);
    user.likedComments.splice(idx, 1);
  }
  // Сохраняем изменения
  localStorage.setItem(getCommentsKey(), JSON.stringify(currentComments));
  localStorage.setItem('userProfile', JSON.stringify(user));
  // Перерисовываем
  renderComments();
}

document.addEventListener('DOMContentLoaded', renderAgency);
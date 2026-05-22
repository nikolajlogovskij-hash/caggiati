# Схема базы данных Caggiati

## Таблицы

### `categories` — Категории товаров
| Колонка | Тип | Описание |
|---|---|---|
| id | BIGINT (PK, auto) | Идентификатор |
| name | TEXT (NOT NULL) | Название |
| slug | TEXT (UNIQUE) | URL-адрес |
| description | TEXT | Описание |
| image_url | TEXT | Изображение |
| parent_id | BIGINT (FK → categories.id) | Родительская категория |
| sort_order | INTEGER (default 0) | Порядок сортировки |
| created_at | TIMESTAMPTZ | Создано |
| updated_at | TIMESTAMPTZ | Обновлено |

**RLS:** Публичное чтение

---

### `products` — Товары
| Колонка | Тип | Описание |
|---|---|---|
| id | BIGINT (PK, auto) | Идентификатор |
| name | TEXT (NOT NULL) | Название |
| slug | TEXT (UNIQUE) | URL-адрес |
| description | TEXT | Описание |
| category_id | BIGINT (FK → categories.id) | Категория |
| price_cents | INTEGER (NOT NULL, default 0) | Цена в копейках |
| old_price_cents | INTEGER | Старая цена |
| currency | TEXT (default 'BYN') | Валюта |
| in_stock | BOOLEAN (default true) | В наличии |
| stock_quantity | INTEGER (default 0) | Количество |
| material | TEXT | Материал |
| weight_grams | INTEGER | Вес (г) |
| dimensions | TEXT | Размеры |
| sku | TEXT (UNIQUE) | Артикул |
| sort_order | INTEGER (default 0) | Сортировка |
| is_featured | BOOLEAN (default false) | Рекомендуемый |
| created_at | TIMESTAMPTZ | Создано |
| updated_at | TIMESTAMPTZ | Обновлено |

**RLS:** Публичное чтение

---

### `product_images` — Изображения товаров
| Колонка | Тип | Описание |
|---|---|---|
| id | BIGINT (PK, auto) | Идентификатор |
| product_id | BIGINT (FK → products.id) | Товар |
| url | TEXT (NOT NULL) | URL изображения |
| alt | TEXT | Alt-текст |
| sort_order | INTEGER (default 0) | Порядок |
| is_main | BOOLEAN (default false) | Главное |
| created_at | TIMESTAMPTZ | Создано |

**RLS:** Публичное чтение

---

### `profiles` — Профили пользователей
| Колонка | Тип | Описание |
|---|---|---|
| id | UUID (PK, FK → auth.users.id) | ID пользователя |
| email | TEXT | Email |
| full_name | TEXT | ФИО |
| phone | TEXT | Телефон |
| address | TEXT | Адрес |
| city | TEXT | Город |
| country | TEXT (default 'Республика Беларусь') | Страна |
| role | TEXT (default 'customer') | Роль: customer / admin |
| consent_pd | BOOLEAN (default false) | Согласие на обработку ПД |
| consent_oferta | BOOLEAN (default false) | Согласие с офертой |
| consent_disclaimer | BOOLEAN (default false) | Ознакомлен с инфо на сайте |
| created_at | TIMESTAMPTZ | Создано |
| updated_at | TIMESTAMPTZ | Обновлено |

**RLS:** Пользователь видит/редактирует только свой профиль.  
**Триггер:** Автоматическое создание профиля при регистрации (`create_profile_on_signup`).

---

### `orders` — Заказы
| Колонка | Тип | Описание |
|---|---|---|
| id | BIGINT (PK, auto) | Номер заказа |
| user_id | UUID (FK → profiles.id) | Пользователь |
| status | TEXT (default 'pending') | Статус |
| total_cents | INTEGER (NOT NULL, default 0) | Сумма в копейках |
| currency | TEXT (default 'BYN') | Валюта |
| full_name | TEXT (NOT NULL) | ФИО получателя |
| phone | TEXT (NOT NULL) | Телефон |
| email | TEXT | Email |
| city | TEXT (NOT NULL) | Город |
| address | TEXT (NOT NULL) | Адрес доставки |
| comment | TEXT | Комментарий |
| created_at | TIMESTAMPTZ | Создано |
| updated_at | TIMESTAMPTZ | Обновлено |

**Статусы:** pending → confirmed → processing → shipped → delivered (или cancelled)  
**RLS:** Пользователь видит только свои заказы.

---

### `order_items` — Позиции заказа
| Колонка | Тип | Описание |
|---|---|---|
| id | BIGINT (PK, auto) | Идентификатор |
| order_id | BIGINT (FK → orders.id) | Заказ |
| product_id | BIGINT (FK → products.id) | Товар |
| product_name | TEXT (NOT NULL) | Название (снимок) |
| price_cents | INTEGER (NOT NULL) | Цена (снимок) |
| quantity | INTEGER (default 1) | Количество |
| image_url | TEXT | Изображение |
| created_at | TIMESTAMPTZ | Создано |

**RLS:** Через родительский заказ.

---

### `favorites` — Избранное
| Колонка | Тип | Описание |
|---|---|---|
| id | BIGINT (PK, auto) | Идентификатор |
| user_id | UUID (FK → profiles.id) | Пользователь |
| product_id | BIGINT (FK → products.id) | Товар |
| created_at | TIMESTAMPTZ | Добавлено |

**RLS:** Пользователь управляет только своим избранным.

---

### `reviews` — Отзывы
| Колонка | Тип | Описание |
|---|---|---|
| id | BIGINT (PK, auto) | Идентификатор |
| product_id | BIGINT (FK → products.id) | Товар |
| user_id | UUID (FK → profiles.id) | Автор |
| rating | INTEGER (CHECK 1-5) | Оценка |
| comment | TEXT | Текст отзыва |
| author_name | TEXT (NOT NULL) | Имя автора |
| created_at | TIMESTAMPTZ | Создано |

**RLS:** Публичное чтение; автор может создать/редактировать свой отзыв.

---

### `contact_messages` — Сообщения с формы связи
| Колонка | Тип | Описание |
|---|---|---|
| id | BIGINT (PK, auto) | Идентификатор |
| full_name | TEXT (NOT NULL) | ФИО |
| phone | TEXT (NOT NULL) | Телефон |
| email | TEXT | Email |
| message | TEXT | Сообщение |
| is_read | BOOLEAN (default false) | Прочитано |
| created_at | TIMESTAMPTZ | Создано |

**RLS:** Вставка доступна всем (анонимно). Чтение — админам.

---

### `discounts` — Скидочные купоны
| Колонка | Тип | Описание |
|---|---|---|
| id | BIGINT (PK, auto) | Идентификатор |
| code | TEXT (UNIQUE) | Код купона |
| description | TEXT | Описание |
| discount_percent | INTEGER (1-100) | Процент скидки |
| discount_cents | INTEGER (default 0) | Фикс. скидка в копейках |
| min_order_cents | INTEGER (default 0) | Мин. сумма заказа |
| starts_at | TIMESTAMPTZ | Начало действия |
| ends_at | TIMESTAMPTZ | Конец действия |
| usage_limit | INTEGER | Лимит использований |
| used_count | INTEGER (default 0) | Использовано раз |
| is_active | BOOLEAN (default true) | Активен |
| created_at | TIMESTAMPTZ | Создано |

---

### `settings` — Настройки сайта
| Колонка | Тип | Описание |
|---|---|---|
| id | BIGINT (PK, auto) | Идентификатор |
| key | TEXT (UNIQUE) | Ключ |
| value | TEXT | Значение |
| updated_at | TIMESTAMPTZ | Обновлено |

---

### `seo_meta` — SEO-метаданные
| Колонка | Тип | Описание |
|---|---|---|
| id | BIGINT (PK, auto) | Идентификатор |
| entity_type | TEXT (NOT NULL) | Тип сущности |
| entity_id | BIGINT | ID сущности |
| meta_title | TEXT | Title |
| meta_description | TEXT | Description |
| meta_keywords | TEXT | Keywords |
| og_image | TEXT | OG Image |
| created_at | TIMESTAMPTZ | Создано |
| updated_at | TIMESTAMPTZ | Обновлено |

---

## Индексы
- `products`: category_id, slug, is_featured, created_at, price_cents, material
- `product_images`: product_id, is_main
- `categories`: slug, parent_id
- `orders`: user_id, status, created_at
- `order_items`: order_id
- `favorites`: user_id
- `reviews`: product_id
- `contact_messages`: created_at
- `discounts`: code, is_active

## RLS (Row Level Security)
Все таблицы с включённым RLS. Публичные данные (категории, товары, изображения, отзывы) доступны всем на чтение. Пользовательские данные (профили, заказы, избранное) привязаны к `auth.uid()`.

## Триггеры
- `trigger_create_profile` — автосоздание профиля при регистрации пользователя.
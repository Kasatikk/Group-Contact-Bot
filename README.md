# 🍕 Discord-бот для двусторонней связи

Этот бот обеспечивает двустороннюю коммуникацию между пользователями и администрацией через Discord, с возможностью пересылки сообщений между личными сообщениями бота и групповым чатом.

## 🚀 Настройка и запуск

1. **Создайте файл конфигурации**:
   - В папке `src` создайте файл `.env.local`
   - Заполните его следующим содержимом:

```env
MONGO_URL=your_mongodb_connection_string
BOT_TOKEN=your_discord_bot_token
CHAT_ID=your_target_channel_id
```

## 📋 Требования к окружению
- Node.js v16+
- MongoDB
- Discord Developer Portal (для получения токена бота)

## 📸 Скриншоты интерфейса

![Пример работы бота](https://i.postimg.cc/mkdCx2b0/Group-10.png)  

## 🤖 Команды бота
- `/start` - начать новое обращение
- `/help` - получить справку
- `/status` - проверить статус обращения

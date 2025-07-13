import ms from 'ms';
import { Context, Markup } from 'telegraf';
import { Client } from '@core/Client/ClientClass';

const client = new Client();

export const start = async () => {
    client.logger.listen();
    await client.db.connect();

    client.bot.command('start', async (ctx: Context) => {
        await ctx.reply(
            '👋 Привет, воспользуйся кнопками ниже, чтобы взаимодействовать с ботом.',
            {
                ...Markup.inlineKeyboard([
                    Markup.button.callback('Задать вопрос', 'CreateQuestion'),
                    Markup.button.callback('Создать заказ', 'CreateOrder')
                ])
            }
        );
        await ctx.sendSticker(
            'CAACAgIAAxkBAAENJbxnxwi_AAFichyu4scWYLgJ_XQct8cAAjQ6AAIezyFLytJK34iifik2BA'
        );
    });

    client.bot.command('close', async (ctx: Context) => {
        if (ctx.message?.is_topic_message) {
            const db = await client.db.users.findUserByThreadId(
                ctx.message.message_thread_id!
            );

            await client.bot.telegram.closeForumTopic(
                process.env['CHAT_ID']!,
                ctx.message.message_thread_id!
            );

            db!.threadId = 0;
            db!.sendCooldown = 0;
            db!.isOpenThread = false;

            await db?.save();

            await client.bot.telegram.sendMessage(
                db!.user!,
                'Твое обращение было закрыто.'
            );
            await client.bot.telegram.sendSticker(
                db!.user!,
                'CAACAgIAAxkBAAENKAtnxzAviGnsQIx00e2qQYekyibFBgACe0EAAny7IUsLjcm5l7KGQzYE'
            );

            await ctx.react('👍');
        }
    });

    client.bot.command('ban', async (ctx: Context) => {
        if (ctx.message?.is_topic_message) {
            const db = await client.db.users.findUserByThreadId(
                ctx.message.message_thread_id!
            );

            await client.bot.telegram.closeForumTopic(
                process.env['CHAT_ID']!,
                ctx.message.message_thread_id!
            );

            db!.threadId = 0;
            db!.sendCooldown = 0;
            db!.isOpenThread = false;
            db!.blocked = true;

            await db?.save();

            await client.bot.telegram.sendMessage(
                db!.user!,
                'Твое обращение было закрыто.'
            );

            await ctx.react('👍');
        }
    });

    client.bot.action(
        ['CreateQuestion', 'CreateOrder'],
        async (ctx: Context) => {
            const db = await client.db.users.findUserById(ctx.from!.id);

            if (db.blocked) {
                return await ctx.reply(
                    '👀 Ошибка: У тебя <b>отобран доступ</b>',
                    {
                        parse_mode: 'HTML'
                    }
                );
            }

            if (db.isOpenThread) {
                return await ctx.reply(
                    '👀 Ошибка: У тебя есть <b>открытое обращение</b>',
                    {
                        parse_mode: 'HTML'
                    }
                );
            }

            if (db.sendCooldown! > Date.now()) {
                return await ctx.reply(
                    '👀 Ошибка: С прошлого обращения <b>не прошло</b> 10-ти минут.',
                    {
                        parse_mode: 'HTML'
                    }
                );
            }

            await client.bot.telegram
                .createForumTopic(
                    process.env['CHAT_ID']!,
                    `${
                        (ctx.callbackQuery as any).data == 'CreateOrder'
                            ? 'Заказ'
                            : 'Вопрос'
                    } от ${ctx.from?.first_name ?? 'Пользователь'} (${ctx.from!.id})`
                )
                .then(async (thread) => {
                    db.threadId = thread.message_thread_id;
                    db.sendCooldown = Date.now() + ms('10m');
                    db.isOpenThread = true;

                    await db.save();
                });

            await ctx.reply(
                `Ожидай, твой ${(ctx.callbackQuery as any).data == 'CreateOrder' ? 'заказ' : 'вопрос'} добавлен в очередь.`
            );
        }
    );

    client.bot.on('message', async (ctx: Context) => {
        if (ctx.message?.is_topic_message) {
            const db = await client.db.users.findUserByThreadId(
                ctx.message.message_thread_id!
            );

            if (db) {
                await ctx.copyMessage(db.user!).catch(() => {});
            }
        } else {
            const db = await client.db.users.findUserById(ctx.from!.id);

            if (db && db.threadId !== 0) {
                await ctx.forwardMessage(process.env['CHAT_ID']!, {
                    message_thread_id: db.threadId!
                });
            }
        }
    });

    client.bot.launch();
};

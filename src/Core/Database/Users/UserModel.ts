import { Schema, model, SchemaTypes } from 'mongoose';

export default model(
    'order-bot',
    new Schema({
        user: SchemaTypes.Number,
        threadId: SchemaTypes.Number,
        sendCooldown: SchemaTypes.Number,
        isOpenThread: { type: SchemaTypes.Boolean, default: false },
        blocked: { type: SchemaTypes.Boolean, default: false }
    })
);
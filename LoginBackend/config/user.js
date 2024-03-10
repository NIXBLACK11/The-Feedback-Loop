const zod = require("zod");

const createUser = zod.object({
    userName: zod.string().min(6),
    userEmail: zod.string().email(),
    userPassword: zod.string().min(6),
});

const checkUser = zod.object({
    userName: zod.string().min(6),
    userPassword: zod.string().min(6),
});

module.exports = { createUser, checkUser };
const jwt = require('jsonwebtoken');
const jwtAuth = require('koa-jwt');
const secret = 'ssssss';
const opt = {
    secret : 'dddd',
    key: 'ddddd'
};

const token = jwt.sign({
    data: {
        a:1,
    },
    exp: Math.floor(Date.now()/1000)+60*60
},secret);


console.log(token);


console.log(jwt.verify(token,secret,opt))// 解码加验证

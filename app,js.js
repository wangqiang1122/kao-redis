const koa = require('koa');
const redis = require('redis');
const wrapper = require('co-redis');
const session = require('koa-session');
const koaRedis = require('koa-redis');
const path = require('path');

// 路由

const redisClient = redis.createClient('6379','localhost'); // 连接redis服务器 端口号及域名
const client = wrapper(redisClient); // 转化成适合koa语法的


const server = new koa();

// koa路由

const Router = require('koa-router');
const router = new Router();

// 接收post的值
const bodyparser = require('koa-bodyparser')
// 静态文件托管
const static1 = require('koa-static');
server.use(static1('www'));


server.keys = ['saom fsf ']; // session 的加密秘药

const CONFIG_SESSION ={
    key: 'kkb_sess111',  //名字
    maxAge: 8640000,
    httpOnly: true, // 服务器可读取
    signed: true, // 签名
    store: koaRedis({redisClient}), // 把session放到redis里
};

server.use(session(CONFIG_SESSION,server));

server.use(bodyparser());
server.use( async (ctx,next)=>{
    console.log(ctx.method)
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:63342');
    ctx.set('Access-Control-Allow-Credentials', true); // 跨域是否允许携带请求头
    if ( ctx.method.toUpperCase() === 'OPTIONS' ) {
        console.log('发送了非简单请求');
        ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT'); // 如需跨域的方法
        ctx.set('Access-Control-Allow-Headers', 'x-name,content-type,token,Authorization'); // 跨域允许请求头携带的自定义参数
        // ctx.set('Access-Control-Allow-Headers', 'content-type');
        ctx.set('Access-Control-Max-Age', '-1'); // 用来指定本次预检请求的有效期，单位为秒
        return ctx.body = '';
    }
    redisClient.keys('*',(err,val)=>{
        val.forEach((item)=>{
            redisClient.get(item,(err,node)=>{
                console.log(node)
            })
        })

    });
    await next();

});

server.use(router.routes());
router.use('/token',require('./router/router1'));

router.post('/login',(ctx) => {
    ctx.stauts=200;
    ctx.session['name'] = ctx.request.body['account'];
    console.log(ctx.session['name']);
    if (ctx.session['name']) {
        ctx.body= {
            code: 1,
            message: '成功'
        }
    }
});

router.post('/loginout',require('./src/libs'),async (ctx) => {

    delete ctx.session['name'];
    ctx.body = {
        hahaah:'消除成功'
    }
});

router.post('/getuser',require('./src/libs'),async (ctx) => {
    // delete ctx.session['name'];
    ctx.body = {
        name:ctx.session['name']
    }
});



// server.use((ctx)=>{
//     const url = ctx.path;
//
//     // 查看redis是否生效
//     redisClient.keys('*',(err,key)=>{
//         console.log(key)
//
//     });
//     console.log(ctx.session);
//     ctx.session['n']='ffffff';
//     ctx.body = '放松的方式地方';
//     delete  ctx.session['n']
//     // console.log(url);
// });

server.listen('5555');

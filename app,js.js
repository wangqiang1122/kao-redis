const koa = require('koa');
const redis = require('redis');
const wrapper = require('co-redis');
const session = require('koa-session');
const koaRedis = require('koa-redis');
const path = require('path');

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
server.use((ctx,next)=>{
    console.log(ctx.path)
    // ctx.set('Access-Control-Allow-Origin', '*');
    // ctx.set('Access-Control-Allow-Methods','OPTIONS,GET,POST,PUT');

    redisClient.keys('*',(err,val)=>{
        val.forEach((item)=>{
            redisClient.get(item,(err,node)=>{
                console.log(node)
            })
        })

    });
    next()
});

server.use(router.routes());


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

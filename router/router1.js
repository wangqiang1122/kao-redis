const Router = require('koa-router');
const router = new Router();

const jwt = require('jsonwebtoken');
const jwtAuth = require('koa-jwt');
const secret = 'ssssss';


router.use((ctx,next)=>{
    console.log(ctx.method);
    // ctx.set('Access-Control-Allow-Origin', 'http://localhost:63342');
    // ctx.set('Access-Control-Allow-Credentials', true); // 跨域是否允许携带请求头
    // ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT'); // 如需跨域的方法
    // ctx.set('Access-Control-Allow-Headers', 'x-name,content-type,token,Authorization'); // 跨域允许请求头携带的自定义参数
    next()
});


router.use(function(ctx, next){
    return next().catch((err) => {
        console.log(err)
        if (401 === err.status) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else {
            throw err;
        }
    });
});


router.post('/login',(ctx)=>{


  ctx.body = {
      a:'ssss',
      token: jwt.sign({
          data: {
              a:1,
          },
          exp: Math.floor(Date.now()/1000)+60*60
      },secret)
  }
});

router.post('/getuser',jwtAuth({ secret }),(ctx)=>{
   console.log(ctx.state);

   ctx.body = {
       code: 1,
   }
});


module.exports = router.routes()

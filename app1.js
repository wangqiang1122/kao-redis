const koa = require('koa');
const app = new koa();
const static = require('koa-static');
const request = require('request');
const Router = require('koa-router');
const queryString = require('querystring')
const router = new Router();

const ClientID = '8072898721f100864574';
const ClientSecret = '209b708944c4fb2234266ac324b92b704f851232';
app.use(static('./www'));
app.use(router.routes());

router.get('/github/login',(ctx)=>{
    console.log('sss')
   var a = 'https://github.com/login/oauth/authorize';
   var paths = `${a}?client_id=${ClientID}`
   ctx.redirect(paths)
});
router.get('/github/callback', async (ctx)=>{
   const code = ctx.query.code; // 获取code 换token

   const url= `https://github.com/login/oauth/access_token?client_id=${ClientID}&client_secret=${ClientSecret}&code=${code}`;
      const token=await new Promise((resolve)=>{
           request.get({url: url},(err,response,data)=>{
               console.log(queryString.parse(data));
               resolve(queryString.parse(data).access_token)
           })
       });
    const url1 = `https://api.github.com/user?access_token=${token}`;


    var a = await new Promise((resolve)=>{
        request.get({url: url1, headers: {
                'User-Agent': 'Awesome-Octocat-App'
            }},(err,response,data)=>{
            // console.log(JSON.parse(data));
            // var a = JSON.parse(data)
            resolve(JSON.parse(data))
        })
    });
    ctx.body = `<img src=${a.avatar_url}><div>${a.login}</div>`


});



app.listen('5555')







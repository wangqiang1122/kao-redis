module.exports= function (ctx,next) {
   if (ctx.session['name']) {
       next()
   } else {
       ctx.body = {
           message: '还没登录'
       }
   }
};

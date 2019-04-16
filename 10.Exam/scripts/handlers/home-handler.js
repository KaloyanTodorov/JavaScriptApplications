window.handlers = window.handlers || {};
// window.notifications = window.notifications || {};

handlers.getHome = async function (ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username') || '';
  ctx.userId = sessionStorage.getItem('userId');

  if(ctx.isAuth) {
    handlers.getAllEvents(ctx);
  } else {
    ctx.loadPartials({
      header: './views/common/header.hbs',
      footer: './views/common/footer.hbs'
    })
    .then(function () {
      this.partial('./views/home/home.hbs');
    })
    .catch(function (err) {
      console.log(err);
    });
  }
}
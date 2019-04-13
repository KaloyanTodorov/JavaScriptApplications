window.handlers = window.handlers || {};

handlers.getHome = async function (ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username') || '';
  ctx.id = sessionStorage.getItem('id');

  try {
  
    ctx.memes = await memeService.getAllMemes();
    
      ctx.loadPartials({
        header: './views/common/header.hbs',
        footer: './views/common/footer.hbs',
        meme: './views/home/meme.hbs'
      }).then(function () {
        this.partial('./views/home/home.hbs');
      }).catch(function (err) {
        notifications.showError(err);
      });
  } catch (err) {
    console.error(err);
  }
}
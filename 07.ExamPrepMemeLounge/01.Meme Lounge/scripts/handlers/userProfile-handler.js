window.handlers = window.handlers || {};

handlers.getUserProfile = async (ctx) => {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username');

  
  try {
    ctx.userId = ctx.params.id;

    const user = await kinvey.get('user', ctx.userId, 'kinvey');
    
    ctx.email = user.email;
    ctx.avatarUrl = user.avatarUrl;
    ctx.profileUser = user.name;

    const usersMemes = await memeService.getAllMemes('appdata', 'memes', 'kinvey');
    const currentUserMemes = usersMemes.filter(m => m._acl.creator === ctx.userId);

    ctx.memes = currentUserMemes;

    ctx.loadPartials({
      header: './views/common/header.hbs',
      footer: './views/common/footer.hbs',
      meme: './views/home/meme.hbs'
    }).then(function () {
      this.partial('./views/profile/user-profile.hbs');
    }).catch(function (err) {
      notifications.showError(err);
    });
  } catch (err) {
    console.error(err);
  }
}

handlers.deleteUser = async (ctx) => {
  await kinvey.remove('user', ctx.params.id, 'kinvey');

  notifications.showSuccess('User deleted');
  ctx.redirect('#/home');
}
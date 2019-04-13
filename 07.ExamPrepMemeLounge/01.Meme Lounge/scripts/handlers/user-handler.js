window.handlers = window.handlers || {};

handlers.getRegister = function (ctx) {
  ctx.loadPartials({
    header: './views/common/header.hbs',
    footer: './views/common/footer.hbs'
  }).then(function () {
    this.partial('./views/user/register.hbs');
  }).catch(function (err) {
    console.log(err);
  });
}

handlers.postRegister = function (ctx) {
  const {username, password, repeatPass, email, avatarUrl} = ctx.params;
  
  if (repeatPass !== password) {
    notifications.showError('Passwords must match!');
    return;
  }

  userService.register(username, password, email, avatarUrl)
    .then((res) => {
      userService.saveSession(res);
      notifications.showSuccess('User registration successful.');
      ctx.redirect('#/home');
  }).catch(function (err) {
    notifications.showError(err.responseJSON.description);
  });
}

handlers.getLogin = function (ctx) {
  ctx.loadPartials({
    header: './views/common/header.hbs',
    footer: './views/common/footer.hbs'
  }).then(function () {
    this.partial('./views/user/login.hbs');
  }).catch(function (err) {
    console.log(err);
  });
}

handlers.postLogin = function (ctx) {
  const {username, password} = ctx.params;

  userService.login(username, password)
  .then((res) => {
    userService.saveSession(res);
    notifications.showSuccess('User logged in successfully.');
    ctx.redirect('#/home');
  }).catch(function (err) {
    notifications.showError(err.responseJSON.description);
  });
}

handlers.logoutUser = function (ctx) {
  userService.logout()
  .then(() => {
    sessionStorage.clear();
    notifications.showSuccess('User logged out successfully');
    ctx.redirect('#/index');
  })
}

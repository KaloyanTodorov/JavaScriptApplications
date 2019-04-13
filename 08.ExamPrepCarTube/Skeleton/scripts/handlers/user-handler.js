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
  let username = ctx.params.username;
  let password = ctx.params.password;
  let repeatPassword = ctx.params.repeatPass;

  if(username.length < 3) {
    notifications.showError('Username must be at least 3 chars long.');
    return;
  }

  const regexUsername = /^[A-Za-z]+$/g;

  if(!regexUsername.test(username)) {
    notifications.showError('Username must contain only English letters.');
    return;
  }

  const regexPassword = /^([A-Za-z0-9]{6,})$/g;

  if(!regexPassword.test(password)) {
    notifications.showError('Password should be at least 6 chars long AND letters and digits only.');
    return;
  }

  if (repeatPassword !== password) {
    notifications.showError('Passwords must match');
    return;
  }


  userService.register(username, password).then((res) => {
    userService.saveSession(res);
    notifications.showSuccess('User registered successfully.');
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
  let username = ctx.params.username;
  let password = ctx.params.password;
  userService.login(username, password).then((res) => {
    userService.saveSession(res);
    notifications.showSuccess('User logged in successfully.');
    ctx.redirect('#/home');
  }).catch(function (err) {
    notifications.showError(err.responseJSON.description);
  });
}

handlers.logoutUser = function (ctx) {
  userService.logout().then(() => {
    sessionStorage.clear();
    notifications.showSuccess('User logged out successfully.');
    ctx.redirect('#/home');
  })
}
window.handlers = window.handlers || {};
// window.notifications = window.notifications || {};

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
  let repeatPassword = ctx.params.rePassword;
  
  if (username.length < 3) {
    notifications.showError('Username must be at least 3 characters');
    return;
  }

  if (password.length < 6) {
    notifications.showError('Password must be at least 6 characters');
    return;
  }

  if (repeatPassword !== password) {
    notifications.showError('Passwords must match');
    return;
  }


  userService.register(username, password).then((res) => {
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
    notifications.showSuccess('User logged out successfully');
    ctx.redirect('#/home');
  })
}

handlers.showProfile = async function(ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username') || '';
  ctx.userId = sessionStorage.getItem('userId');

  const allEvents = await eventsServise.getAllEvents();
  const userEventes = allEvents.filter(event => event._acl.creator === ctx.userId);

  ctx.numberOfEvents = userEventes.length;
  ctx.events = userEventes;

  ctx.loadPartials({
    header: './views/common/header.hbs',
    footer: './views/common/footer.hbs',
    event: './views/profile/event.hbs'
  }).then(function () {
    this.partial('./views/profile/user-profile.hbs');
  }).catch(function (err) {
    console.log(err);
  });
}
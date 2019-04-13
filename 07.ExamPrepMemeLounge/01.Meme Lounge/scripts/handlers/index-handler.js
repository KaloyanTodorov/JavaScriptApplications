window.handlers = window.handlers || {};

handlers.getIndex = (ctx) => {
    ctx.isAuth = userService.isAuth();

    ctx.loadPartials({
        header: './views/common/header.hbs',
        footer: './views/common/footer.hbs',
      }).then(function () {
        this.partial('./views/index/index.hbs');
      }).catch(function (err) {
        notifications.showError(err);
      });
}
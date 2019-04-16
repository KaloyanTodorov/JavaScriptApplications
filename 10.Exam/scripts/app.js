window.handlers = window.handlers || {};

$(() => {
  const app = Sammy('body', function () {
    this.use('Handlebars', 'hbs');
    
    // home page routes
    this.get('/index.html', handlers.getHome);
    this.get('/', handlers.getHome);
    this.get('#/home', handlers.getHome);

    // user routes
    this.get('#/register', handlers.getRegister);
    this.post('#/register', handlers.postRegister);
    
    this.get('#/login', handlers.getLogin);
    this.post('#/login', handlers.postLogin);

    this.get('#/logout', handlers.logoutUser);

    // ADD YOUR ROUTES HERE

    this.get('#/create-event', handlers.getCreateEvent);
    this.post('#/create-event', handlers.postCreateEvent);

    this.get('#/details/:id', handlers.getEventById);

    this.get('#/delete/:id', handlers.deleteEvent);

    this.get('#/edit/:id', handlers.getEditEvent);
    this.post('#/edit/:id', handlers.postEditEvent);

    this.get('#/join/:id', handlers.joinEvent);

    this.get('#/profile', handlers.showProfile);
  });
  app.run();
});
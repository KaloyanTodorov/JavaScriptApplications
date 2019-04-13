window.handlers = window.handlers || {};

$(() => {
  const app = Sammy('#container', function () {
    this.use('Handlebars', 'hbs');
    // index page routes
    this.get('index.html', handlers.getIndex);
    this.get('#/index', handlers.getIndex);
    
    // user routes
    this.get('#/register', handlers.getRegister);
    this.post('#/register', handlers.postRegister);
    
    this.get('#/login', handlers.getLogin);
    this.post('#/login', handlers.postLogin);
    
    this.get('#/logout', handlers.logoutUser);

    this.get('#/profile/:id', handlers.getUserProfile);

    this.get('#/delete/:id', handlers.deleteUser);

    // Meme feed routes
    this.get('#/', handlers.getHome);
    this.get('#/home', handlers.getHome); 

    // Create meme
    this.get('#/create-meme', handlers.getCreateMeme);
    this.post('#/create-meme', handlers.postCreateMeme);

    // Edit meme
    this.get('#/edit/:id/:creator', handlers.getEditMeme);
    this.post('#/edit/:id/:creator', handlers.postEditMeme);

    // Delete meme route
    this.get('#/delete/:id/:creator', handlers.deleteMeme);

  });
  app.run();
});
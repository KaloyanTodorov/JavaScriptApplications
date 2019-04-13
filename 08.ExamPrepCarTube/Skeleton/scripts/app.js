window.handlers = window.handlers || {};

$(() => {
  const app = Sammy('#container', function () {
    this.use('Handlebars', 'hbs');
    
    // home page routes
    this.get('/index.html', handlers.getHome);
    this.get('/', handlers.getHome);
    this.get('#/home', handlers.getHome);
    this.get('#/all-listings', handlers.getHome);
    

    // user routes
    this.get('#/register', handlers.getRegister);
    this.post('#/register', handlers.postRegister);
    
    this.get('#/login', handlers.getLogin);
    this.post('#/login', handlers.postLogin);

    this.get('#/logout', handlers.logoutUser);

    // ADD YOUR ROUTES HERE

    this.get('#/create-listing', handlers.getCreateListing);
    this.post('#/create-listing', handlers.postCreateListing);

    this.get('#/edit/:id', handlers.getEditListing);
    this.post('#/edit/:id', handlers.postEditListing);

    this.get('#/delete/:id', handlers.deleteListing);

    this.get('#/details/:id', handlers.getDetailsListing);

    this.get('#/my-listings', handlers.getMyListings);
    
  });
  app.run();
});
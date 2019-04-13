window.handlers = window.handlers || {};

handlers.getHome = async function (ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username') || '';
  ctx.userId = sessionStorage.getItem('userId');

  if(ctx.isAuth) {
    try {
      let carListings = await carListingsService.getAllCarListings();
      carListings.forEach(carListing => carListing.isSeller = ctx.userId === carListing._acl.creator);
      ctx.carListings = carListings;
    
      await ctx.loadPartials({
        header: './views/common/header.hbs',
        footer: './views/common/footer.hbs',
        carListing: './views/home/car-listing.hbs'
      })
      .then(function () {
        this.partial('./views/home/home.hbs');
      })
      .catch(function (err) {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
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


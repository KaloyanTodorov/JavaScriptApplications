window.handlers = window.handlers || {};

handlers.getCreateListing = function (ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username') || '';
  ctx.userId = sessionStorage.getItem('userId');

  ctx.loadPartials({
    header: './views/common/header.hbs',
    footer: './views/common/footer.hbs'
  })
  .then(function () {
    this.partial('./views/createListing/create-listing.hbs');
  })
  .catch(function (err) {
    console.log(err);
  });
}

handlers.postCreateListing = function(ctx) {
    const context = ctx.params;
    
    const seller = sessionStorage.getItem('username');
    const title = context.title;
    const description = context.description;
    const brand = context.brand;
    const model = context.model;
    const year = context.year;
    const imageUrl = context.imageUrl;
    const price = context.price;
    const fuel = context.fuel;

    carListingsService.createListing(seller, title, description, brand, model, year, imageUrl, fuel, price)
    .then(function(res) {

        ctx.redirect('#/home');
    })
    .catch (function(err) {
        console.log(err);
    });
}

handlers.getEditListing = async function (ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username') || '';
  ctx.userId = sessionStorage.getItem('userId');

  const res = await carListingsService.getListingById(ctx.params.id);
  
  _getParams(ctx, res);

  ctx.loadPartials({
    header: './views/common/header.hbs',
    footer: './views/common/footer.hbs'
  })
  .then(function () {
    this.partial('./views/editListing/edit-listing.hbs');
  })
  .catch(function (err) {
    console.log(err);
  });
}

handlers.postEditListing = function(ctx) {

  const data = {
    seller: sessionStorage.getItem('username'),
    title: ctx.params.title,
    description: ctx.params.description,
    brand: ctx.params.brand,
    model: ctx.params.model,
    year: ctx.params.year,
    fuel: ctx.params.fuel,
    imageUrl: ctx.params.imageUrl,
    price: ctx.params.price
  };

  carListingsService.editListingById(ctx.params.id, data)
    .then(function(res) {
      ctx.redirect('#/home');
      notifications.showSuccess('Car listing edited.');
    })
    .catch(function(err) {
      console.log(err)
    });
}

handlers.deleteListing = async function(ctx) {
  await carListingsService.deleteListing(ctx.params.id);

  notifications.showSuccess('Car listing deleted.');
  ctx.redirect('#')
}

handlers.getDetailsListing = async function(ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username') || '';
  ctx.userId = sessionStorage.getItem('userId');

  let carListing = await carListingsService.getListingById(ctx.params.id);
  ctx.isSeller = ctx.userId === carListing._acl.creator;
  
  const res = await carListingsService.getListingById(ctx.params.id);
  _getParams(ctx, res);

  ctx.loadPartials({
    header: './views/common/header.hbs',
    footer: './views/common/footer.hbs'
  })
  .then(function () {
    this.partial('./views/details/details-listing.hbs');
  })
  .catch(function (err) {
    console.log(err);
  });
}

handlers.getMyListings = async function(ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username') || '';
  ctx.userId = sessionStorage.getItem('userId');

  try {
    let carListings = await carListingsService.getAllCarListings();
    const currentListings = carListings.filter(carListing => ctx.userId === carListing._acl.creator);
    
    ctx.carListings = currentListings;
    // _getParams(ctx, currentListing);
  
    await ctx.loadPartials({
      header: './views/common/header.hbs',
      footer: './views/common/footer.hbs',
      carListing: './views/myListings/car-listings.hbs'
    })
    .then(function () {
      this.partial('./views/myListings/my-listings.hbs');
    })
    .catch(function (err) {
      console.log(err);
    });
  } catch (err) {
    console.log(err);
  }

}

function _getParams(ctx, res) {
  ctx.title = res.title;
  ctx.description = res.description;
  ctx.brand = res.brand;
  ctx.model = res.model;
  ctx.year = res.year;
  ctx.imageUrl = res.imageUrl;
  ctx.fuel = res.fuel;
  ctx.price = res.price;
  ctx.id = res._id;
  return ctx;
}
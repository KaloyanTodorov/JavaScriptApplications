window.handlers = window.handlers || {};

handlers.getCreateEvent = function (ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username') || '';
  ctx.userId = sessionStorage.getItem('userId');

  ctx.loadPartials({
    header: './views/common/header.hbs',
    footer: './views/common/footer.hbs'
  }).then(function () {
    this.partial('./views/createEvent/create-event.hbs');
  }).catch(function (err) {
    console.log(err);
  });
}

handlers.postCreateEvent = function(ctx) {
  const context = ctx.params;
  const name = context.name;
  const description = context.description;
  const dateTime = context.dateTime;
  const imageURL = context.imageURL; 
  const organizer = sessionStorage.getItem('username');

  if(name.length < 6) {
    notifications.showError('Event title should be at least 6 characters long.');
    return;
  }

  if(!typeof dateTime  === 'string') {
    notifications.showError('Date time should be at of type string.');
    return;
  }

  if(description.length < 10) {
    notifications.showError('The event description should be at least 10 characters long.');
    return;
  }

  let regex = /(^https:\/\/.+$)|(^http:\/\/.+$)/g;

  if(!regex.test(imageURL)) {
    notifications.showError('The image url should start with "http://" or "https://"');
    return;
  }

  eventsServise.createEvent(name, dateTime, description, imageURL, organizer)
    .then(function(res) {
      notifications.showSuccess('Event added.');
      ctx.redirect('#/home');
    })
    .catch(function(err) {
      console.log(err);
    })
}

handlers.getAllEvents = async function(ctx) {
  try {
    let events = await eventsServise.getAllEvents();

    // Soting manually because the query sorts alphabetically
    ctx.events = events.sort((a, b) => Number(b.interested) - Number(a.interested));

    ctx.loadPartials({
      header: './views/common/header.hbs',
      footer: './views/common/footer.hbs',
      event: './views/home/event.hbs'
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
}

handlers.getEventById = async function(ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username') || '';
  ctx.userId = sessionStorage.getItem('userId');

  const event = await eventsServise.getEventById(ctx.params.id);
  ctx._id = event._id;
  ctx.name = event.name;
  ctx.description = event.description;
  ctx.dateTime = event.dateTime;
  ctx.imageURL = event.imageURL;
  ctx.isOrganizer = ctx.userId === event._acl.creator
  ctx.organizer = event.organizer;
  ctx.interested = event.interested;

  ctx.loadPartials({
    header: './views/common/header.hbs',
    footer: './views/common/footer.hbs'
  }).then(function (res) {
    this.partial('./views/details/details-event.hbs');
  }).catch(function (err) {
    console.log(err);
  });
}

handlers.getEditEvent = async function(ctx) {

  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem('username') || '';
  ctx.userId = sessionStorage.getItem('userId');

  const event = await eventsServise.getEventById(ctx.params.id);
  ctx._id = event._id;
  ctx.name = event.name;
  ctx.description = event.description;
  ctx.dateTime = event.dateTime;
  ctx.imageURL = event.imageURL;
  ctx.organizer = event.organizer;
  ctx.interested = event.interested;

  ctx.loadPartials({
    header: './views/common/header.hbs',
    footer: './views/common/footer.hbs'
  }).then(function (res) {
    this.partial('./views/edit/edit-event.hbs');
  }).catch(function (err) {
    console.log(err);
  });
}

handlers.postEditEvent = function(ctx) {

  const _id = ctx.params.id;
  const name = ctx.params.name;
  const dateTime = ctx.params.dateTime;
  const description = ctx.params.description;
  const imageURL = ctx.params.imageURL;
  const organizer = ctx.params.organizer;
  const interested = ctx.params.interested;

  eventsServise.editEvent(_id, name, dateTime, description, imageURL, organizer, interested)
    .then(function(res) {
      notifications.showSuccess('Event edited.');
      ctx.redirect('#/home');
    })
    .catch(function(err) {
      console.log(err);
    });
}

handlers.deleteEvent = async function(ctx) {
  try {
    const res = await eventsServise.deleteEvent(ctx.params.id);

    notifications.showSuccess('Event was deleted.');
    ctx.redirect('#/');

  } catch (err) {
    console.error(err);
  }
}

handlers.joinEvent = async function(ctx) {

  const _id = ctx.params.id;
  const event = await eventsServise.getEventById(_id);
  
  const name = event.name;
  const dateTime = event.dateTime;
  const description = event.description;
  const imageURL = event.imageURL;
  const organizer = event.organizer;
  const interested = Number(event.interested) + 1;

  eventsServise.joinEvent(_id, name, dateTime, description, imageURL, organizer, interested)
    .then(function(res) {
      notifications.showSuccess('You join the event successfully.');
      ctx.redirect('#/home');
    })
    .catch(function(err) {
      console.error(err);
    })
}
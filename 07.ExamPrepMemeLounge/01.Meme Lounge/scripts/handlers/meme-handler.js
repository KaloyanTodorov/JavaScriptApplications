window.handlers = window.handlers || {};

handlers.getCreateMeme = (ctx) => {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');

    ctx.loadPartials({
        header: './views/common/header.hbs',
        footer: './views/common/footer.hbs'
    }).then(function() {
        this.partial('./views/createMeme/create-meme.hbs');
    }).catch (function (err) {
        console.error(err);
    })
}

handlers.postCreateMeme = (ctx) => {
    const {
        title,
        description,
        imageUrl
    } = ctx.params;
    
    const creator = sessionStorage.getItem('username');
    
        if (title.length > 33) {
            notifications.showError('Title must not exceed 33 characteres!');
            return;
        }
    
        if (title.length <= 0) {
            notifications.showError('Title must not not be empty!');
            return;
        }
    
        if (description.length < 3) {
            notifications.showError('Description must be at least 30 chars!');
            return;
        }
    
        if (description.length > 450) {
            notifications.showError('Description must not be more than 450 chars!');
            return;
        }

        memeService.createMeme(title, description, imageUrl, creator)
            .then(function() {
                notifications.showSuccess('Meme created!');
                ctx.redirect('#/home');
            }).catch(function(err) {
                console.error(err);
            })

  
}

handlers.getEditMeme = async(ctx) => {
    ctx.isAuth = userService.isAuth();
    ctx.username = sessionStorage.getItem('username');
    const creator = ctx.params.creator;

    if(creator !== ctx.username) {
        notifications.showError("You can edit only memes you created!");
        ctx.redirect('#/home');
        return;
    }

    try {
        const res = await kinvey.get('appdata', `memes/${ctx.params.id}`, 'kinvey');
    
        ctx.title = res.title;
        ctx.description = res.description;
        ctx.imageUrl = res.imageUrl;
        ctx.creator = res.creator;
        ctx.id = ctx.params.id;

        ctx.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(ctx) {
            this.partial('./views/editMeme/edit-meme.hbs');
        }).catch (function (err) {
            console.error(err);
        })
    } catch (error) {
        console.error(error);
    }
}

handlers.postEditMeme = (ctx) => {
    const {id, title, description, imageUrl, creator} = ctx.params;
    
    memeService.editMeme(id, title, description, imageUrl, creator)
        .then(function() {
            notifications.showSuccess('Successfully edited meme!');
            ctx.redirect('#');

        }).catch(function(err) {
            console.log(err);
        });
}

handlers.deleteMeme = async (ctx) => {

    const username = sessionStorage.getItem('username');
    const creator = ctx.params.creator;
    
    if(username !== creator) {
        notifications.showError("Cannot delete this meme, it's not yours!");
        ctx.redirect('#/home');
        return;
    }

    try {
        await memeService.deleteMeme(ctx.params.id);

        ctx.redirect('#/home');
    } catch (err) {
        notifications.showError(err.responseJSON.description);
        ctx.redirect('#/home');
    }
}
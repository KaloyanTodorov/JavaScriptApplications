$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        const headerAndFooterPartials = {
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }

        this.get('#/home', function() {
            this.loggedIn = !!sessionStorage.getItem('authtoken');
            this.username = sessionStorage.getItem('username');
            this.hasTeam = !sessionStorage.getItem('teamId');
            this.teamId = sessionStorage.getItem('teamId');

            this.loadPartials(headerAndFooterPartials)
                .then(function() {
                    this.partial('./templates/home/home.hbs');
            }).catch(function(err) {
                auth.handleError(err);
            });
        });

        this.get('#/about', function() {
            this.loggedIn = !!sessionStorage.getItem('authtoken');
            this.username = sessionStorage.getItem('username');

            this.loadPartials(headerAndFooterPartials)
                .then(function() {
                    this.partial('./templates/about/about.hbs');
                }).catch(function(error) {
                    auth.handleError(error);
                })
        });

        this.get('#/login', function() {
            this.loadPartials({
                    loginForm: './templates/login/loginForm.hbs',
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs'
                })
                .then(function() {
                    this.partial('./templates/login/loginPage.hbs');
                }).catch(function(error) {
                    auth.handleError(error);
                })
        });
        
        this.post('#/login', function(context) {
            const that = this;
            const { username, password } = context.params;
            auth.login(username, password)
                .then(function(response) {
                    auth.saveSession(response);
                    auth.showInfo('Logged in!');
                    that.redirect('#/home');
                }).catch(function(err) {
                    auth.handleError(err);
                });
        })

        this.get('#/register', function() {
            this.loadPartials({
                    registerForm: './templates/register/registerForm.hbs',
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs'
                })
                .then(function() {
                    this.partial('./templates/register/registerPage.hbs');
                }).catch(function(error) {
                    auth.handleError(error);
                })
        });

        this.post('#/register', function(context) {
            const that = this;
            const { username, password, repeatPassword } = context.params;
            auth.register(username, password, repeatPassword)
                .then(function(response) {
                    auth.saveSession(response);
                    auth.showInfo('Registered successfully!');
                    that.redirect('#/home');
                }).catch(function(err) {
                    auth.handleError(err);
                });
        });

        
        this.get('#/logout', async function() {
           await auth.logout();
           sessionStorage.clear();
           auth.showInfo('User logged out.');

           this.redirect('#/home');
        })

        this.get('#/catalog', function() {
            this.loggedIn = !!sessionStorage.getItem('authtoken');
            this.username = sessionStorage.getItem('username');
            this.hasNoTeam = !!sessionStorage.getItem('teamId');
            
            const res = teamsService.loadTeams();
            console.log(res);
            debugger;

            this.loadPartials({
                team: './templates/catalog/team.hbs',
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            })
                .then(function() {
                    this.partial('./templates/catalog/teamCatalog.hbs');
                })
                .catch(function(error) {
                    auth.handleError(error);
                })
        });

        this.get('#/catalog/:id', function() {})
           
        this.get('#/create', function() {
            this.loggedIn = !!sessionStorage.getItem('authtoken');
            this.username = sessionStorage.getItem('username');

            this.loadPartials({
                createForm: './templates/create/createForm.hbs',
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            })
                .then(function() {
                    this.partial('./templates/create/createPage.hbs');
                }).catch(function(error) {
                    auth.handleError(error);
                })
        });

        this.post('#/create', function(context) {
            const {name, comment} = context.params;
            debugger
            const that = this;
            
            teamsService.createTeam(name, comment)
                .then(function(response) {
                    const res = teamsService.joinTeam(response._id);
                    return res;
                })
                .then(function(response) {
                    
                    debugger;
                    that.redirect('#/catalog/:id');
                }).catch(function(err) {
                    auth.handleError(err);
                })
            })
    });

    app.run('#/home');
});
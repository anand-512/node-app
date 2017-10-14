module.exports = function (app, passport) {

    // Controllers
    var HomeController = require('../controllers/home');
    var userController = require('../controllers/user');
    var contactController = require('../controllers/contact');
    var chatController = require('../controllers/chat');

    app.get('/', HomeController.index);
    app.get('/chat', userController.ensureAuthenticated, chatController.chatGet);
    app.get('/contact', contactController.contactGet);
    app.post('/contact', contactController.contactPost);
    app.get('/account', userController.ensureAuthenticated, userController.accountGet);
    app.put('/account', userController.ensureAuthenticated, userController.accountPut);
    app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
    app.get('/signup', userController.signupGet);
    app.post('/signup', userController.signupPost);
    app.get('/login', userController.loginGet);
    app.post('/login', userController.loginPost);
    app.get('/forgot', userController.forgotGet);
    app.post('/forgot', userController.forgotPost);
    app.get('/reset/:token', userController.resetGet);
    app.post('/reset/:token', userController.resetPost);
    app.get('/logout', userController.logout);
    app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
    app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
    app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
}

/**
 * GET /contact
 */
exports.chatGet = function(req, res) {
    res.render('chat', {
        title: 'Chat'
    });
};
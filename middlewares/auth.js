// middlewares/auth.js
module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.session.user) {
        return next();
      }
      res.redirect('/admin/login');
    },
    
    ensureAdmin: function(req, res, next) {
      if (req.session.user && req.session.user.isAdmin) {
        return next();
      }
      res.redirect('/admin/login');
    }
  };
/* Authentication */

var initPassport = function(passport, LocalStrategy, db) {
    passport.use(new LocalStrategy( function(username, password, done ) {
        db.getUserByName(username, function(user) {
            console.log(user)
            if (user.password == password) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Authentication failed'})
            }
        }, function(error) {
            console.log(error)
            return done(null, false, {message: 'User not exists'})
        })
    }))
    // serialize and deserialize the user to/from the session
    passport.serializeUser(function(user, done) {
        done(null, user)
    })
    passport.deserializeUser(function(user, done) {
        done(null, user)
    });
}

var auth = function(req, res, next) {
    if (!req.isAuthenticated())
        res.send({message: 'Authentication failed'})
    else
        next()
}

module.exports = function(passport, LocalStrategy, db) {
    initPassport(passport, LocalStrategy, db)

    return {
        auth: auth
    }
}
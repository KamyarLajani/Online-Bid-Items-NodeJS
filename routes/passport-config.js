const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async(email, password, done)=>{
            const user = await getUserByEmail(email);
            if(user == null) {
                return done(null, false, {message: 'Email address or password is incorrect.'});
            }
            try {
                (async ()=>{
                    if(await bcrypt.compare(password, user.password)){
                        return done(null, user);
                    }
                    else {
                        return done(null, false, {message: 'Email address or password is incorrect.'});
                    }
                })();
            }
            catch(err){
                done(err);
            }
    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
    passport.serializeUser((user, done)=> done(null, user._id));
    passport.deserializeUser((id, done)=>{
        return done(null, getUserById(id));
    });
}

module.exports = initialize;
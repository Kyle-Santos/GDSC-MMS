const Member = require('../models/Member');

const login = async (req, res) => {
    const {email, password, rememberMe} = req.body;

    try{
        const member = await Member.findOne({email});
        
        if (!member){
            return res.redirect('/login?error=Invalid email or password');
        }

        const isPasswordValid = password == member.password;

        if(!isPasswordValid){
            return res.redirect('/login?error=Invalid email or password');
        }

        if (member.position != "Admin"){
            return res.redirect('/login?error=User is not an admin');
        }

        const userData = JSON.stringify({
            position: member.position,
            name: member.firstname // Add any other fields you want to include
        });

        // Set a cookie indicating login status
        res.cookie('isLoggedIn', 'true', { 
            httpOnly: false,
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined // 30 days if 'rememberMe' is checked
        });

        res.cookie('memberData', userData, {
            httpOnly: false,
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined // 30 days if 'rememberMe' is checked
        });

        res.redirect('/');

    }catch (error){

        res.status(500).json({message : error.message});

    }
}

const logout = async (req, res) => {
    res.clearCookie('isLoggedIn');
    res.clearCookie('memberData');
    res.send(`
        <script>
            window.location.href = '/';
        </script>
    `);
}

module.exports = {login, logout};

const Member = require('../models/Member');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const {email, password, rememberMe} = req.body;

    try{
        const member = await Member.findOne({email});
        
        if (!member){
            return res.status(401).json({message: 'Invalid email'});
        }

        const isPasswordValid = password == member.password;

        if(!isPasswordValid){
            return res.status(401).json({message: 'Invalid password'})
        }

        // Set a cookie indicating login status
        res.cookie('isLoggedIn', 'true', { 
            httpOnly: false,
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined // 30 days if 'rememberMe' is checked
        });

        const isLoggedIn = req.cookies.isLoggedIn;
        res.send(`
            <script>
                window.location.href = '/';
            </script>
        `);

    }catch (error){

        res.status(500).json({message : error.message});

    }
}

const logout = async (req, res) => {
    // Set a cookie indicating login status
    res.clearCookie('isLoggedIn');
    res.send(`
        <script>
            window.location.href = '/';
        </script>
    `);
}

module.exports = {login, logout};

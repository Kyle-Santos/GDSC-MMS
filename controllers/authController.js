const Member = require('../models/Member');

const login = async (req, res) => {
    const {email, password, rememberMe} = req.body;

    try{
        const member = await Member.findOne({email});
        
        if (!member){
            return res.redirect('/login?error=Invalid email or password.');
        }

        if(password != member.password){
            return res.redirect('/login?error=Invalid email or password.');
        }

        if (member.position == "Member"){
            return res.redirect('/login?error=Only admins and officers may log in.');
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

        if (member.position == "Officer"){
            return res.redirect(`/officer?studentid=${member.studentID}`);
        }

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

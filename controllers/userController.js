const User = require('../models/User');
const bcrypt = require('bcrypt');

const userCreate = async(req, res) => {
    const {firstname, lastname, email, password} = req.body;

    // confirm required fields
    if( !firstname || !lastname ||!email || !password) return res.status(400).json({'message': 'All credentials are required', 'data': req.body });

    // find duplicate user by email
    const userExisting = await User.findOne({email: email}).exec();
    if (userExisting) return res.status(409).json({'message': 'Email already used.', problem : 'email'});

    try{
        const lastID = await User.findOne({},{},{sort: {'userID': -1}}).exec();

        if (lastID){
            newUserID = lastID.userID + 1;
        }

        const hashedPass = await bcrypt.hash(password,10);

        await User.create({
            userID: newUserID,
            email: email,
            password: hashedPass,
            firstname: firstname,
            lastname: lastname
        });

        res.status(201).json({ 'success' : `New user created!`});

    }catch(error){
        res.status(500).json({message: 'error creating user'});
    }

}

const userRead = async(req, res) => {
    const {studentID} = req.body;

    try{
        const matchingUser = await User.findOne({studentID: studentID}).exec();

        res.status(201).json(matchingUser);

    }catch(error){
        res.status(500).json({message: 'error finding user'});
    }

}

const userUpdate = async(req, res) => {
    const {studentID, editedUserData} = req.body;

    const contactnum = editedUserData.contactnum === "null" ? null : editedUserData.contactnum;
    
    try{
        const updatedUser = await User.findOneAndUpdate({studentID}, {
          $set: {
            firstname: editedUserData.firstname,
            lastname: editedUserData.lastname,
            email: editedUserData.email,
            contactnum: contactnum,
          }
        }, {new: true}
        );
        
        if (!updatedUser) { // didn't find user
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({user:updatedUser});
    }catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
}

const userUpdateLogin = async(req, res) => {
    const {email, password} = req.body;
    const hashedPass = await bcrypt.hash(password,10);

    try{
        const updatedUser = await User.findOneAndUpdate({email}, {
          $set: {
            password: hashedPass
          }
        }, {new: true});
        
        if (!updatedUser) { // didn't find user
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({user:updatedUser});
    }catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
}

const userDelete = async(req, res) => {
    const {studentID} = req.body;

    try{
        const userDelete = await User.findOneAndDelete({studentID});

        if (userDelete){
            return res.status(200).json({ message : 'User deleted successfuly'});
        } else{
            return res.status(404).json({ message : 'User not found'});
        }

    }catch(error){
        res.status(500).json({message: 'error deleting user'});
    }

}

module.exports = { userCreate, userRead, userUpdate, userUpdateLogin, userDelete };
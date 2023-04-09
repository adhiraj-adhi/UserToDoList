const jwt = require('jsonwebtoken');
const UserModel = require("../src/model/DefModel");

const landingPage = (req, res) => {
    res.render("landing", { data : ''});
}

const registerUSer = async (req, res) => {
    try {
        if (req.body.password === req.body.confPassword) {
            const newUser = new UserModel({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
            });
            const result = await newUser.save();
            res.redirect("/");
        } else {
            throw new Error("Passwords do not match");
        }
    } catch (error) {
        console.log(error);
    }
}

let userData = {
    _id: "",
    email: "",
    name: ""
}


const loginUser = async (req, res) => {
    try {
        // console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;
        const getUser = await UserModel.findOne({ email: email });
        // console.log(getUser);
        if(getUser) {
            if (getUser.password === password) {
                userData._id = getUser._id.valueOf();
                userData.email = getUser.email;
                userData.name = getUser.name;
                const token = jwt.sign({ data : getUser._id.valueOf() }, process.env.PRIVATE_KEY, { expiresIn : "3d" });
                res.cookie("userToDoList", token, {httpOnly : true, maxAge : 1000 * 60 * 60 * 24 *3 });
                res.redirect("/profile");
            } else {
                throw new Error("Invalid Credentials");
            }
        } else {
            throw new Error("No User Found");
        }
    } catch (error) {
        if(error.message === 'No User Found') {
            res.render("landing", { data : error.message })
        }
        if(error.message === 'Invalid Credentials') {
            res.render("landing", { data : error.message })
        }
        console.log(error);
    }
}


const userProfile = async (req, res) => {
    // console.log(userData);
    try {
        const getUser = await UserModel.findById({ _id: userData._id });
        res.render("profile", { data: getUser });
    } catch (error) {
        console.log(error);
    }
}

const addTask = async (req, res) => {
    try {
        const task = req.body;
        const getUser = await UserModel.findById({ _id: userData._id });
        getUser.tasks.push(task);
        await getUser.save();
        res.redirect("/profile");
    } catch (error) {
        console.log(error);
    }
}

const editTask = async (req, res) => {
    try {
        // console.log(req.params);
        // output of above console :-
        // {
        //     idUser: '641417125317f0aeba5bc4b7',
        //     idItem: '6414417bafc6047bea9a7a70'
        // }

        const ids = req.params;
        const getUser = await UserModel.findById({ _id: userData._id });
        const itemDetail = getUser.tasks.id(ids.idItem);
        console.log(itemDetail);
        // console.log(getUser);
        // res.send(itemDetail);
        res.render("update", { data: itemDetail, ids: ids });
    } catch (error) {
        console.log(error);
    }
}

const updateTask = async (req, res) => {
    try {
        const ids = req.params;
        const newTask = req.body.newTask;
        const status = req.body.status;
        if (newTask.length !== 0) {
            const getUser = await UserModel.findById({ _id: ids.idUser });
            const dataToUpdate = getUser.tasks.id(ids.idItem);
            const index = getUser.tasks.indexOf(dataToUpdate);
            getUser.tasks[index].task = newTask;
            getUser.tasks[index].status = status;
            await getUser.save();
            res.redirect("/profile");
        } else {
            throw new Error("Task Can't be empty");
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteTask = async (req, res) => {
    const ids = req.params;
    const getUser = await UserModel.findById({ _id: ids.idUser });
    const dataToDelete = getUser.tasks.id(ids.idItem);
    const index = getUser.tasks.indexOf(dataToDelete);
    getUser.tasks.splice(index, 1);
    await getUser.save();
    res.redirect("/profile");
}

const logout = (req, res) => {
    const token = jwt.sign({ data : process.env.PRIVATE_KEY }, process.env.PRIVATE_KEY, { expiresIn : "1s" });
    res.cookie("userToDoList", token, {httpOnly : true, maxAge : 1000 });
    res.redirect("/");
}

module.exports = {
    landingPage,
    loginUser,
    registerUSer,
    userProfile,
    addTask,
    editTask,
    updateTask,
    deleteTask,
    logout
}
const userModel = require("../models/userModel");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "req.session.user.username" + Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Middleware to check if the user is logged in
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next();
    // res.redirect("/login");
  }
}

async function handleShowHomePage(req, res) {
  return res.render("homepage");
}

async function handleShowDashboard(req, res) {
  ensureAuthenticated(req, res, () => {
    return res.render("dashboard", { user: "req.session.user" });
  });
}

async function handleShowAdmin(req, res) {
  ensureAuthenticated(req, res, () => {
    return res.render("admin", { user: "req.session.user" });
  });
}

async function handleShowProfile(req, res) {
  ensureAuthenticated(req, res, () => {
    return res.render("profile", { user: "req.session.user" });
  });
}

async function handleShowUploadPDF(req, res) {
  ensureAuthenticated(req, res, () => {
    return res.render("uploadpdf", { user: "req.session.user" });
  });
}

async function handleUploadPDF(req, res) {
  ensureAuthenticated(req, res, () => {
    upload.single("pdf")(req, res, function (err) {
      if (err) {
        // An error occurred when uploading
        console.log(err);
        return res.status(422).send("an Error occured");
      }
      // No error occured.
      console.log(req.file); // This will log the details of the uploaded file.
      return res.redirect("/dashboard"); // This will redirect the user back to the dashboard after the file is uploaded.
    });
  });
}

async function handleShowLoginPage(req, res) {
  return res.render("login");
}

async function handleLoginUser(req, res) {
  const { username, password } = req.body;
  const user = await userModel.findUser(username, password);
  if (user) {
    req.session.user = user;
    return res.redirect("/dashboard");
  } else {
    return res.redirect("/dashboard");
   // return res.redirect("/login");
  }
}

async function handleShowRegisterPage(req, res) {
  return res.render("register");
}

async function handleShowButton(req, res) {
  return res.render("button");
}

async function handleRegisterUser(req, res) {
  const { username, password, fullName } = req.body;
  const user = await userModel.createUser(username, password);
  if (user) {
    return res.redirect("/login");
  } else {
    return res.redirect("/login");
   // return res.redirect("/register");
  }
}

async function handleLogoutUser(req, res) {
  req.session.destroy();
  return res.redirect("/");
}

module.exports = {
  handleShowHomePage,
  handleShowDashboard,
  handleShowProfile,
  handleShowUploadPDF,
  handleUploadPDF,
  handleShowLoginPage,
  handleLoginUser,
  handleShowRegisterPage,
  handleRegisterUser,
  handleLogoutUser,
  handleShowButton,
  handleShowAdmin

};

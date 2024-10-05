const adminDb = require("../adminModal/adminUser.modal");

const checkActivate = (req, res) => {
  
  adminDb.findOne({ email: req.body.email }).then((admin) => {
    if (admin.activate) {
      res.send({ msg: "Account is activated", status: true });
    } else {
      
      res.send({ msg: "Account is not activated yet", status: false });
    }
  });
};

const checkFirstAdmin = async (req, res) => {
  const allAdmin = await adminDb.find();

  if (allAdmin[0].email == req.body.email) {
    res.send({ msg: "You are the first admin", status: true });
  } else {
  }
};

const allAdmin = (req, res) => {
  adminDb
    .find()
    .then((all) => {
      res.json({
        msg: "All admin fetched successfully",
        allAdmin: all,
        status: true,
      });
    })
    .catch((err) => {
      res.send({ msg: "Failed to fetch all admins", status: false });
    });
};

const deleteAdmin = (req, res) => {
  adminDb.findByIdAndDelete(req.params.id).then(() => {
    res.send({ status: true, message: "admin deleted successfully" });
  });
};

const activateAdmin = (req, res) => {
  adminDb
    .findOneAndUpdate(
      { email: req.body.email },
      { $set: { activate: req.body.act ? false : true } },
      { new: true }
    )
    .then((admin) => {
      res.send({
        msg: admin.activate
          ? "Admin activated successfully"
          : "Admin deactivate",
        status: true,
      });
    })
    .catch((err) => {
      res.send({ msg: "Failed to activate admin", status: false });
    });
};
module.exports = {
  checkActivate,
  checkFirstAdmin,
  allAdmin,
  activateAdmin,
  deleteAdmin,
};

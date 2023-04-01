var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { dbUrl } = require("../config/dbConfig");
const { LeadModel } = require("../schema/leadschema.js");
const {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
  roleAdmin,
  roleSalesRep,
} = require("../config/auth");
const { MailService } = require("./../service/mailservice");

mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

router.post("/lead-info", async (req, res) => {
  try {
    let doc = new LeadModel(req.body);
    await doc.save();
    res.status(201).send({
      message: "Lead Created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

router.put("/manage-lead/:id", async (req, res) => {
  try {
    let data = await LeadModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).send({
      message: "Lead updated successfully",
      lead: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server error",
      error,
    });
  }
});

router.put("/lead/:id/:toStatus", validate, async (req, res) => {
  try {
    let data = await LeadModel.updateOne(
      { _id: req.params.id },
      { $set: { status: req.params.toStatus } }
    );
    res.status(200).send({
      message: "Status Changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server error",
      error,
    });
  }
});

router.get(
  "/dashboard-list-items/:status",
  validate,
  roleAdmin,
  async (req, res) => {
    try {
      let data = await LeadModel.find({ status: req.params.status });
      res.status(201).send({
        leads: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Internal Server Error ",
        error,
      });
    }
  }
);

router.get("/dashboard", validate, roleAdmin, async (req, res) => {
  try {
    let data = await LeadModel.aggregate([
      {
        $group: { _id: "$status", count: { $sum: 1 } },
      },
    ]);
    res.status(201).send({
      leads: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error ",
      error,
    });
  }
});

router.get("/chart-details", validate, roleAdmin, async (req, res) => {
  try {
    let data = await LeadModel.aggregate([
      {
        $group: { _id: "$createdBy", count: { $sum: 1 } },
      },
    ]);
    res.status(201).send({
      leads: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error ",
      error,
    });
  }
});

router.get("/manage-lead/:id", async (req, res) => {
  try {
    let data = await LeadModel.findOne({ _id: req.params.id });
    console.log(data);
    res.status(200).send({
      lead: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error ",
      error,
    });
  }
});

router.get("/display-lead", async (req, res) => {
  try {
    let data = await LeadModel.find();
    res.status(200).send({
      leads: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error ",
      error,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let data = await LeadModel.findByIdAndDelete({ _id: id });
    console.log(data);
    res.status(200).send({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Internal Server error",
      error,
    });
  }
});

router.post("/send-mail", validate, roleAdmin, async (req, res) => {
  try {
    let leads = await LeadModel.find(
      {},
      { email: 1, firstName: 1, lastName: 1 }
    );
    console.log(leads);
    for (e in leads) {
      await MailService({
        firstName: leads[e].firstName,
        lastName: leads[e].lastName,
        email: leads[e].email,
        subject: req.body.subject,
        message: req.body.message,
      });
    }
    res
      .status(200)
      .send({ message: "Email Campaing Sent Successfully", leads });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error", error });
  }
});

module.exports = router;

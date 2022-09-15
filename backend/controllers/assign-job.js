var mongoose = require("mongoose");
var User = mongoose.model("User");
var Customer = mongoose.model("Customer");

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.assignJob = async function (req, res) {
  console.log("here 1");

  if (
    !req.body ||
    !req.body.technicianEmail ||
    req.body.customer === undefined
  ) {
    sendJSONresponse(res, 400, {
      message: "All fields required",
      response: "error",
    });
    return;
  }
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile",
      response: "error",
    });
  } else {
    try {
      User.findOne({ email: req.body.technicianEmail }).exec(function (
        err,
        user
      ) {
        var found = false;
        found =
          user.assignedTasks.filter(
            (item) => item._customerId === req.body.customer._customerId
          ).length > 0;
        if (found && !req.body.remove) {
          res
            .status(403)
            .json({
              response: "error",
              message: "this job is already assigned to this user",
            });
        } else {
          if (!req.body.remove) {
            User.findOneAndUpdate(
              { email: req.body.technicianEmail },
              {
                $set: {
                  assignedTasks: [
                    ...user.assignedTasks,
                    {
                      ...req.body.customer,
                      dateAssigned: req.body.remove
                        ? undefined
                        : new Date().toLocaleString(),
                      cancelReason: undefined,
                      status: "assigned",
                    },
                  ],
                },
              },
              { new: true },
              (err, doc) => {
                if (err) {
                  console.log("Something wrong when updating data!");
                } else {
                  //remove assigned task if assigned to someone else
                  Customer.findOne({
                    _customerId: req.body.customer._customerId,
                  }).exec(function (err, customer1) {
                    if (!!customer1.assignedTo) {
                      User.findOne({ email: customer1.assignedTo }).exec(
                        function (err, tech) {
                          //removing other technicians assigned job if it is assigned and is not the same technician
                          if (customer1.assignedTo !== tech.email) {
                            User.findOneAndUpdate(
                              { email: customer1.assignedTo },
                              {
                                $set: {
                                  assignedTasks: tech.assignedTasks.filter(
                                    (item) =>
                                      item._customerId !==
                                      req.body.customer._customerId
                                  ),
                                },
                              },
                              { new: true },
                              (err, doc) => {
                                if (err) {
                                  console.log(
                                    "Something wrong when updating data!"
                                  );
                                } else {
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  });
                  try {
                    Customer.findOne({
                      _customerId: req.body.customer._customerId,
                    }).exec(function (err, user) {
                      Customer.findOneAndUpdate(
                        { _customerId: req.body.customer._customerId },
                        {
                          $set: {
                            dateAssigned: req.body.remove
                              ? undefined
                              : new Date().toLocaleString(),
                            assignedTo: req.body.remove
                              ? undefined
                              : req.body.technicianEmail,
                            status: req.body.remove ? "unassigned" : "assigned",
                            cancelReason: req.body.cancelReason
                              ? req.body.cancelReason
                              : undefined,
                          },
                        },
                        { new: true },
                        (err, doc) => {
                          if (err) {
                            res
                              .status(403)
                              .json({
                                response: "error",
                                message: "something went wrong",
                                code: 1234,
                              });
                          }

                          res.status(200).json({
                            response: "job assigned successfully!",
                          });
                        }
                      );
                    });
                  } catch {
                    res
                      .status(403)
                      .json({
                        response: "error",
                        message: "something went wrong",
                      });
                  }
                }
              }
            );
          } else {
            User.findOneAndUpdate(
              { email: req.body.technicianEmail },
              {
                $set: {
                  assignedTasks: user.assignedTasks.filter(
                    (cust) =>
                      cust._customerId !== req.body.customer._customerId &&
                      cust.status !== "completed"
                  ),
                },
              },
              { new: true },
              (err, doc) => {
                if (err) {
                  console.log("Something wrong when updating data!");
                }

                try {
                  Customer.findOne({
                    _customerId: req.body.customer._customerId,
                  }).exec(function (err, user) {
                    Customer.findOneAndUpdate(
                      { _customerId: req.body.customer._customerId },
                      {
                        $set: {
                          dateAssigned: req.body.remove
                            ? undefined
                            : new Date().toLocaleString(),
                          assignedTo: req.body.remove
                            ? undefined
                            : req.body.technicianEmail,
                          status: req.body.remove ? "unassigned" : "assigned",
                          cancelReason: req.body.cancelReason
                            ? req.body.cancelReason
                            : undefined,
                        },
                      },
                      { new: true },
                      (err, doc) => {
                        if (err) {
                          res
                            .status(403)
                            .json({
                              response: "error",
                              message: "something went wrong",
                              code: 1234,
                            });
                        }
                        res.status(200).json({
                          response: "job unassigned",
                        });
                      }
                    );
                  });
                } catch {
                  res
                    .status(403)
                    .json({
                      response: "error",
                      message: "something went wrong",
                    });
                }
              }
            );
          }
        }
      });
    } catch (error) {
      console.log("technician update error", error);
      res.status(403).json({ eror: "something went wrong" });
    }
  }
};

module.exports.startJob = async function (req, res) {
  console.log("here 1");

  if (
    !req.body ||
    !req.body.technicianEmail ||
    req.body.customer === undefined
  ) {
    sendJSONresponse(res, 400, {
      message: "All fields required",
      response: "error",
    });
    return;
  }
  if (!req.payload._id) {
    res.status(401).json({
      message: "UnauthorizedError: private profile",
      response: "error",
    });
  } else {
    try {
      User.findOne({ email: req.body.technicianEmail }).exec(function (
        err,
        user
      ) {
        var found = false;
        found =
          user.assignedTasks.filter(
            (item) =>
              item._customerId === req.body.customer._customerId &&
              item.status === "pending"
          ).length > 0;
        if (found && !req.body.remove) {
          res
            .status(403)
            .json({
              response: "error",
              message:
                "this job is already started by" +
                user.firstName +
                " " +
                user.lastName +
                "(" +
                user.email +
                ")",
            });
        } else {
          console.log(req.body);
          console.log(user);
          try {
            otherTasks = user.assignedTasks.filter(
              (item) => item._customerId !== req.body.customer._customerId
            );
            taskToUpdate = user.assignedTasks.filter(
              (item) => item._customerId === req.body.customer._customerId
            );
            taskToUpdate[0].status = "pending";
            taskToUpdate[0].dateStarted = new Date().toLocaleString();
          } catch (err) {
            console.log("technician update error", error);
            res.status(403).json({ eror: "something went wrong" });
          }
          User.findOneAndUpdate(
            { email: req.body.technicianEmail },
            { $set: { assignedTasks: [...taskToUpdate, ...otherTasks] } },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log("Something wrong when updating data!");
              } else {
                try {
                  Customer.findOneAndUpdate(
                    { _customerId: req.body.customer._customerId },
                    {
                      $set: {
                        dateStarted: req.body.remove
                          ? undefined
                          : new Date().toLocaleString(),
                        assignedTo: req.body.remove
                          ? undefined
                          : req.body.technicianEmail,
                        status: req.body.remove ? "unassigned" : "pending",
                        cancelReason: req.body.cancelReason
                          ? req.body.cancelReason
                          : undefined,
                      },
                    },
                    { new: true },
                    (err, doc) => {
                      if (err) {
                        res
                          .status(403)
                          .json({
                            response: "error",
                            message: "something went wrong",
                            code: 1234,
                          });
                      }

                      res.status(200).json({
                        response: "job started successfully!",
                      });
                    }
                  );
                } catch {
                  res
                    .status(403)
                    .json({
                      response: "error",
                      message: "something went wrong",
                    });
                }
              }
            }
          );
        }
      });
    } catch (error) {
      console.log("technician update error", error);
      res.status(403).json({ eror: "something went wrong" });
    }
  }
};

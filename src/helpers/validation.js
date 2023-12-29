const { body, validationResult } = require("express-validator");
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    return true;
  }
};

const regValidation = [
  body("name")
    .notEmpty()
    .withMessage(
      "Name of the traffic offender is required (Please fill the name field)"
    ),
  body("username")
    .notEmpty()
    .withMessage(
      "Username of the traffic offender is required (Please fill the username field)"
    ),
  body("password")
    .notEmpty()
    .withMessage("Password is required (Please fill the password field)")
    .isLength({ min: 6 })
    .withMessage("Minimum 6 characters required"),
  body("cnfpassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, req) => {
      if (value !== req.body.password) {
        throw new Error("Password does not match with password!");
      }
      return true;
    }),
];

const loginValidation = [
  body("username")
    .notEmpty()
    .withMessage(
      "Username of the traffic offender is required (Please fill the username field)"
    ),
  body("password")
    .notEmpty()
    .withMessage("Password is required (Please fill the password field)")
    .isLength({ min: 6 })
    .withMessage("Minimum 6 characters required"),
];

const imageValidation = [
  body("username")
    .notEmpty()
    .withMessage(
      "Username of the traffic offender is required (Please fill the username field)"
    ),
  body("image").custom((value, req) => {
    if (!req.file) {
      throw new Error(
        "Vehicle number plate image is required(Please upload the image of the vechicle number plate)"
      );
    }
    const formatCheck = ["image/jpeg", "image/png"];
    if (!formatCheck.includes(req.file.minetype)) {
      throw new Error(
        "Given image format is not in the allowed format. Only .jpeg and .png format is allowed!"
      );
    }
    return true;
  }),
];

const detectionValidation = [
  body("username")
    .notEmpty()
    .withMessage(
      "Username of the traffic offender is required (Please fill the username field)"
    ),
  body("vecnumber")
    .notEmpty()
    .withMessage(
      "Vehicle number of the traffic offender is required (Please fill the Vehicle number field)"
    )
    .custom((value) => {
      const format = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{1,4}$/;
      if (!format.test(value)) {
        throw new Error(
          "The given vehicle number is not in vehicle number plate format. Please check the given number plate!"
        );
      }
    }),
];

const complaintValidation = [
  body("name")
    .notEmpty()
    .withMessage(
      "Name of the traffic offender is required (Please fill the name field)"
    ),
  body("username")
    .notEmpty()
    .withMessage(
      "Username of the traffic offender is required (Please fill the username field)"
    ),
  body("vecnumber")
    .notEmpty()
    .withMessage(
      "Vehicle number of the traffic offender is required (Please fill the Vehicle number field)"
    )
    .custom((value) => {
      const format = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{1,4}$/;
      if (!format.test(value)) {
        throw new Error(
          "The given vehicle number is not in vehicle number plate format. Please check the given number plate!"
        );
      }
    }),
  body("crime")
    .notEmpty()
    .withMessage(
      "What crime the traffic offender did is required (Please fill the crime field)"
    ),
  body("area")
    .notEmpty()
    .withMessage(
      "Where the crime occured is required (Please fill the area field)"
    ),
  body("date")
    .notEmpty()
    .withMessage(
      "When the crime occurd is required (Please fill the date field)"
    ),
  body("fineamt")
    .notEmpty()
    .withMessage(
      "Fine amount to the traffic offender is required (Please fill the fine amount field)"
    ),
  body("duedate")
    .notEmpty()
    .withMessage(
      "Due date to the traffic offender to pay the fine amount is required (Please fill the due date field)"
    ),
];

const letterValidation = [
  body("username")
    .notEmpty()
    .withMessage(
      "Username of the traffic offender is required (Please fill the username field)"
    ),
];

module.exports = {
  checkValidation,
  regValidation,
  loginValidation,
  imageValidation,
  detectionValidation,
  complaintValidation,
  letterValidation,
};

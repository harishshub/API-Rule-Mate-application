// routes/index.js
const express = require("express");
const router = express.Router();
const config = require("../config");
const db = require("../config/database");
const AuthenticationToken = require("../middleware/authentication");
const validator = require("../helpers/validation");
const multer = require("multer");
const queries = require("../Models/queries"); 
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Registration Route
router.post(
  `${config.apiversion}/register`,
  validator.regValidation,
  async (req, res) => {
    if (!validator.checkValidation(req, res)) {
      return;
    }
    let { name, username, password, cnfpassword } = req.body;
    if (!name || !username || !password || !cnfpassword) {
      name = req.query.name;
      username = req.query.username;
      password = req.query.password;
      cnfpassword = req.query.cnfpassword;
    }
    if (!name || !username || !password || !cnfpassword) {
      res
        .status(400)
        .json({ message: "Data insufficient!!  Please fill all the details" });
    }

    if (password !== cnfpassword) {
      res.status(400).json({
        message:
          "Given password and confirm password is not same. Please recheck and enter the correct password.",
      });
    } else {
      const encpass = await bcrypt.hash(password, 10);
      db.query(queries.insertUserInfo, [name, username, encpass], (err) => {
        if (err) {
          console.log("userinfo insertion failed");
          res.status(500).json({
            message:
              "Userinfo Table insertion failed! Maybe due to the username has already exited",
          });
        } else {
          console.log("userinfo insertion success");
          res.json({ message: "Userinfo Table insertion success!" });
        }
      });
    }
  }
);

// Login Route
router.post(
  `${config.apiversion}/login`,
  validator.loginValidation,
  async (req, res) => {
    if (!validator.checkValidation(req, res)) {
      return;
    }
    let { username, password } = req.body;
    if (!username || !password) {
      username = req.query.username;
      password = req.query.password;
    }
    if (!username || !password) {
      res
        .status(400)
        .json({ message: "Data insufficient!!  Please fill all the details" });
    }
    db.query(queries.selectUserInfo, [username], async (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error in Authentication(server side)" });
      }
      if (
        result !== 0 &&
        (await bcrypt.compare(password, result[0].password))
      ) {
        const token = jwt.sign({ username }, config.secretKey, { expiresIn: "2hr" });

        res.json({ token, message: "Login success" });
      } else {
        res.status(401).json({ message: "Login Failed" });
      }
    });
  }
);

// Protected Route
router.get(
  `${config.apiversion}/user/protected`,
  AuthenticationToken,
  (req, res) => {
    res.json({ message: "Protected" });
  }
);

// Image Upload Route
router.post(
  `${config.apiversion}/vecnoimg`,
  validator.imageValidation,
  upload.single("image"),
  (req, res) => {
    if (!validator.checkValidation(req, res)) {
      return;
    }
    const { username } = req.body;
    if (!req.file || !username) {
      res.status(400).json({ message: "Image or username are required!!" });
    }

    const imgbuffer = req.file.buffer;
// Log the length of the image buffer
console.log("Image buffer length:", imgbuffer.length);
    db.query(queries.insertImage, [username, imgbuffer], (err) => {
      if (err) {
        console.log("Image insertion failed");
        res.status(500).json({ message: "Image insertion failed!!" });
      } else {
        console.log("Image insertion success");
        res.json({ message: "Image insertion success!!" });
      }
    });
  }
);

// Detection from Image Route
router.post(
  `${config.apiversion}/detection`,
  validator.detectionValidation,
  async (req, res) => {
    if (!validator.checkValidation(req, res)) {
      return;
    }
    let { username, vecnumber } = req.body;
    if (!username || !vecnumber) {
      username = req.query.username;
      vecnumber = req.query.vecnumber;
    }
    if (!username || !vecnumber) {
      res
        .status(400)
        .json({ message: "Data insufficient!!  Please fill all the details" });
    }
    db.query(queries.updateImage, [vecnumber, username], (err) => {
      if (err) {
        console.log("Vehicle number insertion failed");
        res.status(500).json({ message: "Vehicle number insertion failed!!" });
      } else {
        console.log("Vehicle number insertion success");
        res.json({ message: "Vehicle number insertion success!!" });
      }
    });
  }
);

// Complaint Route
router.post(
  `${config.apiversion}/complaint`,
  validator.complaintValidation,
  async (req, res) => {
    if (!validator.checkValidation(req, res)) {
      return;
    }

    let { name, username, vecno, crime, area, date, fineamt, duedate } = req.body;

    // if (!name || !username || !vecno || !crime || !area || !date || !fineamt || !duedate) {
    //   name = req.query.name;
    //   username = req.query.username;
    //   vecno = req.query.vecno;
    //   crime = req.query.crime;
    //   area = req.query.area;
    //   date = req.query.date;
    //   fineamt = req.query.fineamt;
    //   duedate = req.query.duedate;
    // }
    console.log(name, username, vecno, crime, area, date, fineamt, duedate);
    if (!name || !username || !vecno || !crime || !area || !date || !fineamt || !duedate) {
      return res.status(400).json({ message: "Data insufficient!!  Please fill all the details" });
    }

    console.log("Request Body:", req.body);

    try {
      await new Promise((resolve, reject) => {
        db.query(queries.insertComplaintInfo, [name, username, vecno, crime, area, date, fineamt, duedate], (err) => {
          if (err) {
            console.log("Complaint insertion failed");
            reject(err);
          } else {
            console.log("Complaint insertion success");
            res.json({ message: "Complaint Table insertion success!" });
            resolve();

          }
        });
      });

      // Only send one response to the client
      //return res.redirect('/success-page');
    } catch (error) {
      console.error('Error during complaint insertion:', error);
      return res.status(500).json({ message: "Complaint Table insertion failed! " });
    }
  }
);


// Letter Route
router.get(
  `${config.apiversion}/letter`,
  validator.letterValidation,
  async (req, res) => {
    if (!validator.checkValidation(req, res)) {
      return;
    }
    
    let username = req.body.username;

    if (!username) {
      username = req.query.username;
    }

    // Fetch details from the complaint and image tables using username
    db.query(queries.selectComplintInfo, [username], (err, resultComplaint) => {
      if (err) {
        console.log("Selection from complaint table failed");
        res
          .status(500)
          .json({
            message: "Data retrieval failed. Please check the username!",
          });
      } else {
        const complaintDetails = resultComplaint[0];

        // Fetch image from the vecnoimg table
        db.query(queries.selectImage, [username], (err, resultImage) => {
          if (err) {
            console.log("Selection from vecnoimg table failed");
            res
              .status(500)
              .json({
                message: "Image retrieval failed. Please check the username!",
              });
          } else {
            const imageBuffer = resultImage[0] ? resultImage[0].image : null;

            // Define letterContent outside the callbacks
            let letterContent = "";

            if (complaintDetails) {
              letterContent = `
              Respected Sir/Madam,

              This message is from the Tamil Nadu Police. Mr. or Mrs. ${
                complaintDetails.name
              } has violated the traffic rules in the ${
                complaintDetails.area
              } on ${
                complaintDetails.date
              }. The details of the violation are as follows:

              - Vehicle Number: ${complaintDetails.vecno}
              - Type of Crime: ${complaintDetails.crime}
              - Fine Amount: ${complaintDetails.fineamt}
              - Due Date: ${complaintDetails.duedate}

              <p>Please take necessary action.</p>

              <p>Sincerely,
              Tamil Nadu Police </p>

              <img src="data:image/jpeg;base64,${imageBuffer.toString(
                "base64"
              )}" alt="Vehicle Image" style="max-width: 100%;">
            `;
            } else {
              console.log(complaintDetails);
              letterContent = "No complaint found for the given username.";
            }

            // Send the letterContent as the response
            res.send(letterContent);
          }
        });
      }
    });
  }
);


module.exports = router;

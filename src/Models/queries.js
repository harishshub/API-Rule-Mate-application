const queries = {
    //insertion queries
    insertUserInfo:"INSERT INTO userinfo(name,username,password) VALUES (?,?,?)",
    insertImage:"INSERT INTO vecnoimg(username,image) VALUES (?,?)",
    insertComplaintInfo:"INSERT INTO complaint(name,username,vecno,crime,area,date,fineamt,duedate) VALUES (?,?,?,?,?,?,?,?)",

    //selection queries
    selectUserInfo:"SELECT * FROM userinfo WHERE username = ?", 
    selectImage:"SELECT image FROM vecnoimg WHERE username =?",
    selectComplintInfo:"SELECT * FROM complaint WHERE username =?",
    

    //updation queries
    updateImage:"UPDATE vecnoimg SET vecno=? WHERE username = ?",


};

module.exports = queries;
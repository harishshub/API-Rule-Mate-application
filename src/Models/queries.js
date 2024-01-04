const queries = {
    //insertion queries
    insertUserInfo:"INSERT INTO userinfos(name,username,password) VALUES (?,?,?)",
    insertImage:"INSERT INTO vecnoimg(username,image) VALUES (?,?)",
    insertComplaintInfo:"INSERT INTO complaints(name,username,vecno,crime,area,date,fineamt,duedate) VALUES (?,?,?,?,?,?,?,?)",

    //selection queries
    selectUserInfo:"SELECT * FROM userinfos WHERE username = ?", 
    selectImage:"SELECT image FROM vecnoimg WHERE username =?",
    selectComplintInfo:"SELECT * FROM complaints WHERE username =?",
    

    //updation queries
    updateImage:"UPDATE vecnoimg SET vecno=? WHERE username = ?",


};

module.exports = queries;
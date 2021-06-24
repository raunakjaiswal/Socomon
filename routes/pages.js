const express = require("express");
const router = express.Router();
const session = require("express-session");
const sess = require("../controllers/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysqlconnection = require("../connection.js");
const base64 = require("node-base64-image");
const fs = require("fs");
const multer = require("multer");
var fileupload = require("express-fileupload");
const app = require("../app");
const { Console } = require("console");
const e = require("express");
const { map } = require("../app");
const { route } = require("./auth");

// var finalpost = [] ;
// const checkk = (post,userid) => {

//   return new Promise((resolve, reject) => {
//     mysqlconnection.query(
//       "SELECT * from post_like WHERE post_like_post_id=? and post_like_user_id=?", [post.post_id, userid], (err, res) => {
//         if (res.length > 0)
//          {
//            post.like=1;
//            finalpost.push(post);
//            console.log(post);
//            resolve (post)

//         }
//         else
//         {
//           post.like = 0;
//           finalpost.push(post);
//           console.log(post);
//           resolve(post);
//         }
//         reject(err);
//       });

//   })
// }

const redirectlogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("login");
  } else {
    // console.log(req.session.userId);
    next();
  }
};

router.get("/", function (req, res) {
  // res.render('index');
  res.render("index");
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.get("/register", function (req, res) {
  res.render("register");
});

var userName;
var currentUserId;

router.get("/welcome", redirectlogin, (req, res) => {
  // if(req.session.uernamee)
  // console.log(req.session.uernamee);
  // mysqlconnection.query(SELECT * From user_credential)
  mysqlconnection.query(
    "SELECT * FROM user WHERE user_id = ?",
    [req.session.userId],
    function (err, results) {
      if (err) console.log(err);
      else {
        // console.log();$results[0].username
        // res.render('welcome', {title: 'user detail', items: results[0].username} );
        // res.render('welcome', {title: 'user detail', items: results[0].user_name} );

        userName = results[0].user_name;
        currentUserId = req.session.userId;
      }
    }
  );

  /// time function
  function timeDiffCalc(dateFuture, dateNow) {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    let difference = "";

    if (days > 0) {
      if (days > 7) {
        const date = dateNow.getDate();
        const month = dateNow.toLocaleString("default", { month: "short" });
        const year = dateNow.getFullYear();
        const time = dateNow.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        difference = `${date} ${month},${year} at ${time}`;
      } else {
        difference = days === 1 ? `${days} day ago` : `${days} days ago`;
      }
    } else if (hours > 0) {
      difference =
        hours === 0 || hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    } else if (minutes > 0) {
      difference =
        minutes === 0 || hours === 1
          ? `${minutes} minutes ago`
          : `${minutes} minutes ago`;
    } else {
      difference = "Just now";
    }

    return difference;
  }
  // function close
  // console.log(req.session.userId);
  // res.render('welcome');
  // else
  // res.render('index');

  // ---------------tejendra
// ***************************************************only friends can see post************************************
  mysqlconnection.query(
    // "SELECT * FROM post LEFT JOIN post_like ON post.post_id = post_like.post_like_post_id and post_like.post_like_user_id=?; ",
    "SELECT * FROM post LEFT JOIN post_like ON post.post_id = post_like.post_like_post_id and post_like.post_like_user_id=? WHERE post_user_id IN ((SELECT friend_id FROM friends WHERE user_id=?) UNION (SELECT user_id FROM user WHERE user_id=?)); ",
    [req.session.userId,req.session.userId,req.session.userId], //QUERY CHANGED, ONLY FRIENDS CAN SEE POST
    (err, posts) => {
      if (!err) {
        //
        mysqlconnection.query(
          "SELECT post_like_post_id,count(post_like_post_id) as count FROM post_like  GROUP BY post_like_post_id;",
          (error, result) => {
            if (error) console.log(error);
            else {
              // console.log("nnn");
              // console.log(result)
              var map = new Map();
              result.forEach((data) => {
                //  console.log(data.post_like_post_id);
                //  console.log(data.count);
                map.set(data.post_like_post_id, data.count);
              });
              var finalresult = [];
              posts.forEach((post) => {
                var cc = map.get(post.post_id);
                if (cc > 0) {
                  cc = cc;
                } else {
                  cc = 0;
                }
                  //  time added
                const currentTime = new Date();
                const uploadTime = post.post_time;
                const time = timeDiffCalc(currentTime, uploadTime);
                // xx
                let obj = {
                  post_id: post.post_id,
                  post_user_id: post.post_user_id,
                  post_user_name: post.post_user_name,
                  post_data: post.post_data,
                  post_data_type: post.post_data_type,
                  post_time: time,
                  post_about: post.post_about,
                  post_category_id: post.post_category_id,
                  post_like_id: post.post_like_id,
                  post_like_post_id: post.post_like_post_id,
                  post_like_user_id: post.post_like_user_id,
                  count: cc,
                };
                finalresult.push(obj);
              });
              // console.log(finalresult[0].post_id);

              // console.log("mm");
              res.render("welcome", {
                title: "user detail",
                userName,
                finalresult,
                user_lo_id: currentUserId,
                // map,
              });
            }
          }
        );
      } else console.log(err);
    }
  );
});

router.post("/newPost",redirectlogin, async (req, res) => {
  const base64 = await req.files.sampleFile.data.toString("base64");
  const desc = req.body.content;
  const category = req.body.category;
  const date = new Date();

  mysqlconnection.query(
    "INSERT INTO post SET ?",
    {
      post_user_id: req.session.userId,
      post_user_name: userName,
      post_data: base64,
      post_about: desc,
      post_category_id: category,
      post_time: date,
    },
    function (err, results) {
      if (err) console.log(err);
      else res.redirect("back");
    }
  );
});

router.get("/profile", redirectlogin, (req, res) => {
  // var userId = req.session.userId;

  mysqlconnection.query(
    "SELECT * FROM user WHERE user_id = ?",
    [req.session.userId],
    function (err, results) {
      if (err) console.log(err);
      else {
        // console.log();$results[0].username
        // res.render('welcome', {title: 'user detail', items: results[0].username} );
        // res.render('profile', {title: 'user detail', items: results[0]} );
        // console.log(results[0]);
        res.redirect("/profile/" + results[0].user_name);
      }
    }
  );
  // res.render('profile',{t});
});

router.get("/profile/:id", redirectlogin, (req, res) => {
  var id = req.params.id;
  // console.log(id);

  // console.log(userName);
  // console.log(id);

  // if(userName == id)
  // {

  // }
  // else
  // {
  mysqlconnection.query(
    "SELECT * FROM user WHERE user_name = ?",
    [id],
    function (err, results) {
      if (err) console.log(err);
      else {
        // console.log();$results[0].username
        // res.render('welcome', {title: 'user detail', items: results[0].username} );
        // var nn = 1;
        // mysqlconnection.query( "select * from uploads where id = ?", [nn], function (err, postpic) {
        //     if (err)
        //      console.log(err);
        //     else {
        // res.render("profile", { title: "user detail", items: results[0], pics: postpic,
        // console.log("done");
        mysqlconnection.query("SELECT  post_category_id,COUNT(post_user_id) as count FROM post Where post_user_id = ? GROUP BY post_category_id",[results[0].user_id],(erro,count)=>{
          if(erro)
          console.log(erro)
          else
          {
            // console.log(count);
            var count_cate = [];
            let obj = {
              photography_count: 0,
              artandcraft_count: 0,
              fashion_count: 0,
              cooking_count: 0,
              total_post_count: 0,
            }
            count.forEach((event)=>{
                if(event.post_category_id == 'Photography') 
                {
                  obj.photography_count = event.count;
                }
                else if(event.post_category_id == 'Fashion')
                {
                  obj.fashion_count = event.count;   
                }
                else if(event.post_category_id == 'Cooking')
                {
                  obj.cooking_count = event.count;
                }
                else 
                {
                  obj.artandcraft_count = event.count;
                }
                obj.total_post_count += event.count;

            }
            )
            count_cate.push(obj);
            // console.log(count_cate[0].total_post_count)
           
            // mysqlconnection.query("selc")                -------------------begins from here
            mysqlconnection.query("Select count(friend_id)as total_friend from friends where user_id=?",[results[0].user_id],(errrr,cc)=>{
                if(errrr)
                console.log(errrr);
                else
                {
                  // console.log(cc);
                  mysqlconnection.query(
                    "SELECT * FROM post Where post_user_name =? and post_category_id = 'Fashion'",
                    [id],
                    function (err, fashion) {
                      if (err) {
                        console.log(err);
                      } else {
                        // console.log("bdbehcbhsh")
                        // res.render("profile", { title: "user detail", items: results[0],photography });
                        mysqlconnection.query(
                          "SELECT * FROM post Where post_user_name =? and post_category_id = 'Photography'",
                          [id],
                          function (err, photography) {
                            if (err) {
                              console.log(err);
                            } else {
                              mysqlconnection.query(
                                "SELECT * FROM post Where post_user_name =? and post_category_id = 'Art&Craft'",
                                [id],
                                function (err, art) {
                                  if (err) console.log(err);
                                  else {
                                    mysqlconnection.query(
                                      "SELECT * FROM post Where post_user_name =? and post_category_id = 'Cooking'",
                                      [id],
                                      function (err, cooking) {
                                        if (err) console.log(err);
                                        else {
                                          if (userName == id) {
                                            // console.log("jjjj")
                                            mysqlconnection.query(
                                              "SELECT post_id,post_data,COUNT(post_id) as like_count FROM post INNER JOIN post_like ON post.post_id = post_like.post_like_post_id and post.post_user_id=? GROUP BY post_id ORDER BY like_count DESC",
                                              [req.session.userId],
                                              (error, maxPics) => {
                                                if(error)
                                                console.log(error)
                                                else
                                                {
                                                   res.render("sameprofile", {
                                                    title: "user detail",
                                                    items: results[0],
                                                    count_cat: count_cate[0],
                                                    fashion,
                                                    photography,
                                                    art,
                                                    cooking,
                                                    maxPic: maxPics,
                                                    total_friend: cc[0].total_friend,
      
                                                  });
                                                }
                                              })
                                          
                                          } else {
                                            // console.log(req.session.userId);
                                            var users = parseInt(req.session.userId);
                                            var friendsid = parseInt(results[0].user_id);
                                            // console.log("mnnnnn")
                                            // console.log(friendsid);
                                            // console.log(users);
          
                                            mysqlconnection.query(
                                              "Select * from friends where user_id =? and friend_id =?",
                                              [users, friendsid],
                                              function (err, resu) {
                                                if (err) console.log(err);
                                                else {
                                                  // console.log("kkk")
                                                  // console.log(count_cate)
                                                  mysqlconnection.query(
                                                    "SELECT post_id,post_data,COUNT(post_id) as like_count FROM post INNER JOIN post_like ON post.post_id = post_like.post_like_post_id and post.post_user_id=? GROUP BY post_id ORDER BY like_count DESC",
                                                    [friendsid],
                                                    (err, maxPics) => {
                                                      if(err)
                                                      console.log(err)
                                                      else
                                                      {
                                                        if (resu[0] != null)
                                                        res.render("profile", {
                                                          title: "user detail",
                                                          items: results[0],
                                                          count_cat:count_cate[0],
                                                          fashion,
                                                          photography,
                                                          art,
                                                          cooking,
                                                          maxPic: maxPics,
                                                          friend: "friends",
                                                          total_friend: cc[0].total_friend,
                                                        });
                                                      else
                                                        res.render("profile", {
                                                          title: "user detail",
                                                          items: results[0],
                                                          count_cat: count_cate[0],
                                                          fashion,
                                                          photography,
                                                          art,
                                                          cooking,
                                                          maxPic: maxPics,
                                                          friend: "friend request",
                                                          total_friend: cc[0].total_friend,
                                                        });
                                                      }

                                                    })
                                                  
                                                }
                                              }
                                            );
                                          }
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
            })

            
          }
        })
       
        // res.render("profile", { title: "user detail", items: results[0]
        // });
        // }
        //   }
        // );
        // res.render('profile', {title: 'user detail', items: results[0]} );
      }
    }
  );
  // }
});

router.get("/editprofile", redirectlogin, (req, res) => {
  // else
  // {
  res.render("editprofile");
  // }
});

router.post("/update_profile_pic", redirectlogin,async (req, res) => {
  //  let sampleFile;
  // console.log(req);
  // sampleFile = req.files.filename;
  // console.log(sampleFile);
  // console.log(req.session);
  const base64 = await req.files.filename.data.toString("base64");
  // console.log(base64);
  mysqlconnection.query(
    "UPDATE user SET Profile_pic = ? WHERE user_id = ?",
    [base64, req.session.userId],
    function (err, results) {
      if (err) console.log(err);
      else 
      // res.render("profile");
      res.redirect("back");
    }
  );
  // mysqlconnection.query( 'INSERT INTO user_credential SET ?', {username: username,password: hashedpassword})
  // const base64 = fs.readFileSync(sampleFile, "base64");
  // console.log(base64);
  // const buffer = Buffer.from(base64, "base64");

  // connection.query(
  //   "INSERT INTO user SET ?",
  //   { id: 5, profile_image: base64 },
  //   (err, results) => {
  //     console.log(err);
  //   }
  // );
});

router.post("/autocomplete/",redirectlogin, function (req, res, next) {
  // var regex = new RegExp(req.query["term"],'i')
  // console.log(req.query.term);

  // var var_name = "%"+req.query.term+"%";
  // console.log(req.body.task);
  var var_name = "%" + req.body.task + "%";
  // console.log(var_name);
  mysqlconnection.query(
    "select user_id,user_name,Profile_Pic from user where user_name like ?;",
    [var_name],
    function (err, results) {
      if (err) console.log(err);
      else {
        var result = [];
        results.forEach((element) => {
          let obj = {
            user_name: element.user_name,
            user_id: element.user_id,
          };
          result.push(obj);
        });
        // console.log(result[0].user_name);
        res.jsonp(result);
      }
    }
  );
});

router.post("/addfriend/",redirectlogin, function (req, response, next) {
  // console.log(req.body.friend);
  // console.log(req.session.userName);

  const friendName = req.body.friend;

  mysqlconnection.query(
    "SELECT user_id FROM user WHERE user_name = ?",
    friendName,
    (err, res) => {
      if (err) console.log(err);
      else {
        const friendId = res[0].user_id;
        var userId;

        mysqlconnection.query(
          "SELECT user_id FROM user WHERE user_name = ?",
          userName,
          (err, res1) => {
            if (err) console.log(err);
            else {
              userId = res1[0].user_id;

              // console.log(friendId);
              // console.log(userId);
              mysqlconnection.query(
                "INSERT INTO friends SET ?",
                {
                  user_id: userId,
                  friend_id: friendId,
                },
                (err, res) => {
                  if (err) console.log(err);
                }
              );

              mysqlconnection.query(
                "INSERT INTO friends SET ?",
                {
                  user_id: friendId,
                  friend_id: userId,
                },
                (err, res) => {
                  if (err) console.log(err);
                }
              );

              var result = [];
              let obj = {
                message: "success",
              };
              result.push(obj);
              response.jsonp(result);
            }
          }
        );
      }
    }
  );
});

router.post("/removefriend/",redirectlogin, function (req, response, next) {
  // console.log(req.body.friend);
  // console.log(req.session.userName);

  const friendName = req.body.friend;

  mysqlconnection.query(
    "SELECT user_id FROM user WHERE user_name = ?",
    friendName,
    (err, res) => {
      if (err) console.log(err);
      else {
        const friendId = res[0].user_id;
        var userId;

        mysqlconnection.query(
          "SELECT user_id FROM user WHERE user_name = ?",
          userName,
          (err, res1) => {
            if (err) console.log(err);
            else {
              userId = res1[0].user_id;

              mysqlconnection.query(
                "DELETE FROM friends WHERE user_id=? and friend_id=?",
                [userId, friendId],
                (err, res) => {
                  if (err) console.log(err);
                }
              );

              mysqlconnection.query(
                "DELETE FROM friends WHERE user_id=? and friend_id=?",
                [friendId, userId],
                (err, res) => {
                  if (err) console.log(err);
                }
              );

              var result = [];
              let obj = {
                message: "success",
              };
              result.push(obj);
              response.jsonp(result);
            }
          }
        );
      }
    }
  );
});

router.post("/addLike/",redirectlogin, function (req, response, next) {
  // console.log(req.body.friend);
  // console.log(req.session.userName);

  const postId = req.body.post;
  let obj = { message: "", likes: 0 };
  mysqlconnection.query(
    "select * from post_like where post_like_post_id=? and post_like_user_id=?",
    [postId, req.session.userId],
    (err, res) => {
      if (err) console.log(err);
      else {
        // console.log("done");
        // console.log(res.length);
        if (res.length > 0) {
          // console.log("done2");
          mysqlconnection.query(
            "Delete from post_like where post_like_post_id=? and post_like_user_id=?",
            [postId, req.session.userId],
            (err, res) => {
              if (err) {
                console.log(err);
                // console.log("error 1");
              } else {
                // console.log("mmmmmmm");
                // var result = [];
                obj.message = "successdeleted";
                // let obj = {
                //   message: "successdeleted",
                // };
                // result.push(obj);
                // response.jsonp(result);
              }
            }
          );
        } else {
          mysqlconnection.query(
            "INSERT INTO post_like SET ?",
            {
              post_like_post_id: postId,
              post_like_user_id: req.session.userId,
            },
            (err, res) => {
              if (err) {
                console.log(err);
                // console.log("error 2");
              } else {
                // console.log("qwe");
                // var result = [];
                obj.message = "successinserted";
                // let obj = {
                //   message: "successinserted",
                // };
                // result.push(obj);
                // response.jsonp(result);
              }
            }
          );
        }

        mysqlconnection.query(
          "SELECT COUNT(post_like_id) as likesCount FROM post_like WHERE post_like_post_id=?",
          [postId],
          (err, res) => {
            if (err) console.log(err);
            else {
              var result = [];
              obj.likes = res[0].likesCount;
              // let obj = {
              //   likes: res[0].likesCount,
              // };
              result.push(obj);
              response.jsonp(result);
            }
          }
        );
      }
    }
  );

  // mysqlconnection.query(
  //   "INSERT INTO post_like SET ?",
  //   { post_like_post_id: postId, post_like_user_id: req.session.userId },
  //   (err, res) => {
  //     if (err) console.log(err);
  //     else {
  //       var result = [];
  //       let obj = {
  //         message: "success",
  //       };
  //       result.push(obj);
  //       response.jsonp(result);
  //     }
  //   }
  // );
});



router.post("/addcomment/",redirectlogin,function(req,res){
  const postId = req.body.postid;
  const comment = req.body.addcom;
  const loginid = req.session.userId;
  // console.log(postId);
  // console.log(comment);

  mysqlconnection.query("Insert Into post_comment Set ?", 
  {
    post_comment_post_id: postId, 
    post_comment_user_id: loginid,
    post_comment_text: comment
  },(err,resul)=>{
    if(err)
    console.log(err);
    else
    {
      mysqlconnection.query("select user_name from user where user_id=?",[loginid],(errr,ress)=>{
        if(errr)
        console.log(errr);
        else
        {
          
          var result = [];
          let obj = {
            message: "success",
            post_comment_user_name: ress[0].user_name
          };
          result.push(obj);
          res.jsonp(result);
        }
      })
  
    }
  })


})

router.post("/showcomment/",redirectlogin,function(req,res){

  const postId = req.body.postid;
  mysqlconnection.query("select * from (Select * from post_comment where post_comment_post_id =?)as roww inner join (select user_id, user_name from user)as ro where roww.post_comment_user_id=ro.user_id;",[postId],(err,result)=>{
    if(err)
    console.log(err);
    else
    {
      // console.log(result);
      // var commentresult = [];
      // result.forEach((data)=>{
      //       let obj = {
      //          post_comment_id: data.post_comment_id,
      //          post_comment_post_id: data.post_comment_post_id,
      //          post_comment_user_id: data.post_comment_user_id,
      //          post_comment_user_name: data.user_name,
      //          post_comment_text: data.post_comment_text,
      //          post_comment_date: data.post_comment_date,

      //       }
      //       commentresult.push(obj);
      // })
      // res.jsonp(commentresult);
      res.jsonp(result);
    }
  })  

})



router.post("/countlikes/",redirectlogin,function(req,res){

  const postId = req.body.postid;
            mysqlconnection.query("SELECT count(post_like_id) as cc FROM post_like WHERE post_like_post_id =?",
            [postId],
            (err, resu) => {
              if(err) console.log(err);
              else{
                let result1 = [];
                if(resu[0].cc < 1){
                  resu[0].cc = 0;
                }
                let obj1 ={
                  message: "success",
                  count: resu[0].cc,    
                }
                result1.push(obj1);
                res.jsonp(result1);
              }
     })
})


// ************************ created for friend list ************************
router.post("/showfriend/",redirectlogin, function (req, res) {
  const userid = req.body.userid;
  // console.log(userid);
  // console.log("hii");
  // console.log(userid)

  mysqlconnection.query(
    "SELECT * FROM user WHERE user_id IN (SELECT friend_id FROM friends WHERE user_id=?)",
    [userid],
    (err, result) => {
      if (err) console.log(err);
      else {
        var allfriends = [];
        result.forEach((data)=>{
        let obj1 = {
          Profile_pic : data.Profile_pic,
          user_name : data.user_name,
        }
        // console.log(data.Profile_pic)
        allfriends.push(obj1);
        // console.log(allfriends);
      })
      res.jsonp(allfriends); 
      }
    }
  )
})


// ***************************************delete post*****************************

router.post("/checkdelete/",redirectlogin,function (req , res){
  // console.log(req.session.userId);
   res.json({final: req.session.userId});
 })
 
 router.post("/deletepost/", function( req, res){
   var postid = req.body.postid;
  //  console.log(postid);
   mysqlconnection.query(
     "DELETE FROM post WHERE post_id=?",
     [postid],
     function (err, resu){
       if (err) console.log(err); 
       else{
         console.log("records deleted.");
         var result = [];
         let obj = {
           message: "success",
         };
         result.push(obj);
       }
       res.jsonp(result); 
     })
 })




// ------------------------------------------message ------------------------------
router.get("/message", redirectlogin, (req, res) => {
  // var userId = req.session.userId;

  mysqlconnection.query(
    "SELECT * FROM user WHERE user_id = ?",
    [req.session.userId],
    function (err, results) {
      if (err) console.log(err);
      else {
        // console.log();$results[0].username
        // res.render('welcome', {title: 'user detail', items: results[0].username} );
        // res.render('profile', {title: 'user detail', items: results[0]} );
        // console.log(results[0]);
        res.redirect("/message/" + results[0].user_id+ "/"+results[0].user_name);
      }
    }
  );
  // res.render('profile',{t});
});

// router.get("/message/:id/:username", redirectlogin, (req, res) => {
//   var id = req.params.id;
//   var username= req.params.username;

  
//   res.render("message")

// })

router.get("/message/:id/:username", redirectlogin, (req, res) => {
  var userid = req.params.id;
  // console.log(userid);
  var userName = req.params.username;
  mysqlconnection.query(
    // "SELECT * FROM user WHERE user_id IN (SELECT friend_id FROM friends WHERE user_id=?)",
   "select kk.message_id, kk.friend_id,user.user_name from (SELECT  mm.message_id,CASE    WHEN mm.user_message_id = ? THEN mm.user_friend_message_id    WHEN mm.user_friend_message_id = ? THEN mm.user_message_id   END as friend_id   FROM (select * from user_message where user_message_id = ? or user_friend_message_id = ?) as mm ) as kk inner join user on user_id=kk.friend_id",
    [userid,userid,userid,userid],
    (err, result)=>{
      if (err) console.log(err);
      else{
        // var chatfriend = [];
        // console.log(result)
        // result.forEach((data) =>{
        //   let obj ={
        //     message_id: data.message_id,
        //     user_name: data.user_name,
        //     user_id: data.friend_id, 

        //   };
        //   chatfriend.push(obj);
        // });
        // console.log(userid)
        // console.log(result)
        // console.log(result);
        res.render("message",{
          userid,
          userName,
          // messageId: result[0].message_id,
          chatfriend: result,
        });
      }
    }
  )

})

router.post("/getmessage/",redirectlogin,function(req,res){
  var message_id  = req.body.message_id;
  // console.log("pressed")
  // console.log(message_id);
  mysqlconnection.query(
    // "Select * from user_message_text where user_message_text_id =?",
    // "select inner_table.user_message_text_id,inner_table.sender_message_id,inner_table.receiver_message_id,inner_table.message_text,inner_table.date_time,inner_table.sender_user_name,user.user_name as receiver_user_name from (select inn_table.user_message_text_id,inn_table.sender_message_id,inn_table.receiver_message_id, inn_table.message_text,inn_table.date_time,user.user_name as sender_user_name from(select * from user_message_text where user_message_text_id = ?) as inn_table   inner join user on user.user_id = inn_table.sender_message_id)as inner_table inner join  user on user.user_id = inner_table.receiver_message_id",
     "(select inn_table.user_message_text_id,inn_table.sender_message_id,inn_table.receiver_message_id, inn_table.message_text,inn_table.date_time,user.user_name as sender_user_name from(select * from user_message_text where user_message_text_id = ?) as inn_table inner join user on user.user_id = inn_table.sender_message_id)",
    [message_id],(err,ress)=>{
    if(err)
    console.log(err)
    else
    res.jsonp(ress);
  })
 
})



router.post("/saveMessage/",redirectlogin, function (req, res) {
  // console.log("pressed")
  // console.log(message_id);
  // console.log(req.body);
  mysqlconnection.query(
    // "Select * from user_message_text where user_message_text_id =?",
    // "select inner_table.user_message_text_id,inner_table.sender_message_id,inner_table.receiver_message_id,inner_table.message_text,inner_table.date_time,inner_table.sender_user_name,user.user_name as receiver_user_name from (select inn_table.user_message_text_id,inn_table.sender_message_id,inn_table.receiver_message_id, inn_table.message_text,inn_table.date_time,user.user_name as sender_user_name from(select * from user_message_text where user_message_text_id = ?) as inn_table   inner join user on user.user_id = inn_table.sender_message_id)as inner_table inner join  user on user.user_id = inner_table.receiver_message_id",
    "INSERT INTO user_message_text SET ?",
    {
      user_message_text_id: req.body.messageId,
      sender_message_id: req.body.senderId,
      receiver_message_id: req.body.receiverId,
      message_text: req.body.message,
    },
    (err, ress) => {
      if (err) console.log(err);
      else {
        var result = [];
        let obj = {
          message: "success",
        };
        result.push(obj);
      }
      res.jsonp(result);
    }
  );
});

router.post("/checksendmessage/",redirectlogin,function(req,res){

  var search_message_id = req.body.search_message_id;
  var user_login = req.session.userId;
  // console.log(search_message_id);
  // console.log(req.session.userId);

  mysqlconnection.query("select * from user_message where (user_message_id=? and user_friend_message_id=?) or (user_message_id=? and user_friend_message_id=?)",[search_message_id,req.session.userId,req.session.userId,search_message_id],(err,ress)=>{
    if(err)
    console.log(err);
    else
    {
      if(ress.length>0)
      {
          // available in database
          var result = [];
          let obj = {
            message: "You are already connected to chat",
          };
          result.push(obj);
        
        res.jsonp(result);
      
      }
      else
      {
           mysqlconnection.query("Insert into user_message SET ?",
           {
               user_message_id:  search_message_id,
               user_friend_message_id: user_login,
           },(err,resul)=>{
               if(err)
               console.log(err);
               else
               {
                var result = [];
                let obj = {
                  message: "You are now connected to chat",
                };
                  result.push(obj);
              
                  res.jsonp(result);
               }
           }
           )
      }
    }
  })

})


router.post("/showpostprofile/",redirectlogin,function(req,res){

  const postId = req.body.postid;
  console.log(postId);
  // mysqlconnection.query("select * from (Select * from post_comment where post_comment_post_id =?)as roww inner join (select user_id, user_name from user)as ro where roww.post_comment_user_id=ro.user_id;",[postId],(err,result)=>{
  //   if(err)
  //   console.log(err);
  //   else
  //   {
  //     // console.log(result);
  //     var commentresult = [];
  //     result.forEach((data)=>{
  //           let obj = {
  //              post_comment_id: data.post_comment_id,
  //              post_comment_post_id: data.post_comment_post_id,
  //              post_comment_user_id: data.post_comment_user_id,
  //              post_comment_user_name: data.user_name,
  //              post_comment_text: data.post_comment_text,
  //              post_comment_date: data.post_comment_date,

  //           }
  //           commentresult.push(obj);
  //     })
  //     res.jsonp(commentresult);
  //   }
  // })  

  mysqlconnection.query("select post_id,post_user_name,post_time,post_about,post_category_id from post where post.post_id=?",[postId],(err,result1)=>{

    if(err)
    console.log(err);
    else
    {
      mysqlconnection.query("select * from (Select * from post_comment where post_comment_post_id =?)as roww inner join (select user_id, user_name from user)as ro where roww.post_comment_user_id=ro.user_id",[postId],(err2,result2)=>{
        if (err2)
        console.log(err2)
        else
        {
          var result = [];
          // let obj = {

          // }
          result.push(result1);
          result.push(result2);
          // console.log(result);
          res.jsonp(result);
        }
      })
    }
  })

})

router.post("/showlikelist/",redirectlogin,function(req,res){
  var post_id = req.body.postid;
  mysqlconnection.query("select user_name,user_id from ((select * from post_like where post_like_post_id=?) as kk inner join user on user.user_id = kk.post_like_user_id)",[post_id],(err,resultt)=>{
    if(err)
    console.log(err);
    else
    {
      res.jsonp(resultt);
    }
  })

})


router.post("/checkdeletewelcomezoom/",redirectlogin,function(req,res){
  var post__id = req.body.postid;
  mysqlconnection.query("select post_user_id,post_id from post where post_id=?",[post__id],(err,ress)=>{
    if(err)
    console.log(err)
    else
    {
      // console.log(ress)
    res.jsonp(ress);
    }
  })

})


router.post("/showPosts/",redirectlogin, function (req, res) {
  var category = req.body.post_category;
  mysqlconnection.query(
    "SELECT post_data,post_user_name,post_about FROM post WHERE post_category_id=?",
    [category],
    (err, result) => {
      if (err) console.log(err);
      else {
        res.jsonp(result);
      }
    }
  );
});

router.get("/categories", function (req, res) {
  res.render("categories");
});


module.exports = router;

// app.post("", (req, res) => {
//   let sampleFile;
//   let uploadPath;

//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send("No files were uploaded");
//   }

//   //Input name is sampleFile
//   sampleFile = req.files.sampleFile;
//   uploadPath = __dirname + "/upload/" + sampleFile.name;

//   console.log(sampleFile);

//   // Use mv() to place file on the server
//   sampleFile.mv(uploadPath, function (err) {
//     if (err) {
//       return res.status(500).send(err);
//     }

//     res.send("File Uploaded");
//   });
// })

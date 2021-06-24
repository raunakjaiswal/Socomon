// const { post } = require("../../app");

var modelBtn = document.querySelector(".start-post");
var modelBg = document.querySelector(".modal-bg");
var closeBtn = document.querySelector(".close-icon");
var btn_exp = document.querySelectorAll(".btn_exp");

modelBtn.addEventListener("click", () => {
  modelBg.classList.add("bg-active");
});

closeBtn.addEventListener("click", () => {
  modelBg.classList.remove("bg-active");
});

const autoGrow = (element) => {
  element.style.height = "5px";
  element.style.height = element.scrollHeight + "px";
};

function changecolor(event, idd) {
  // if(color1.classList.contains("active")){
  //         color1.classList.remove("active");
  //         console.log("rempved")
  // }
  // else{
  //     color1.classList.add("active");
  //     console.log("addeed")
  // }
  var color1 = document.getElementById(idd);

  var post_likes = $(event).closest(".post_footer").find(".post_likes");

  $.ajax({
    url: "/addLike/",
    dataType: "jsonp",
    type: "POST",
    data: { post: idd },
    success: function (dataa) {
      if (dataa[0].message == "successdeleted") {
        color1.classList.remove("active");
        // console.log("rempved")
      } else {
        color1.classList.add("active");
      }
      post_likes.html(dataa[0].likes + " likes");
    },
  });
}

// btn_exp.forEach(function (button) {
//   button.addEventListener("click", function (event) {
//     // Through the event object you can get the unique instance of .btn_exp that you clicked
//     var button = event.currentTarget;

//     // If you wanted to get the data-alm-id value for this specific button you can access it like this
//     var post_id = button.dataset.postId;

//     $.ajax({
//       url: "/addLike/",
//       dataType: "jsonp",
//       type: "POST",
//       data: { post: post_id },
//       success: function (dataa) {
//         if (!dataa.error) window.location.reload();
//       },
//     });
//   });
// });

function addcomment(idd) {
  var select = document.getElementById("comment" + idd);
  var comment = select.value;

  // console.log(ss);

  $.ajax({
    url: "/addcomment/",
    dataType: "jsonp",
    type: "POST",
    data: { addcom: comment, postid: idd },
    success: function (dataa) {
      if (dataa[0].message == "success")
        // window.location.reload();
        select.value = "";
    },
  });
}

var postIdZoom;
var currentUser;

function addCommentZoom() {
  var commentInput = document.getElementById("commentInputZoom");
  var commentText = commentInput.value;

  var comment = document.querySelector(".comment");

  $.ajax({
    url: "/addcomment/",
    dataType: "jsonp",
    type: "POST",
    data: { addcom: commentText, postid: postIdZoom },
    success: function (dataa) {
      if (dataa[0].message == "success") {
        // window.location.reload();
        commentInput.value = "";
        comment.innerHTML +=
          "<p><strong>" + dataa[0].post_comment_user_name + " : </strong>" + commentText + "</p>";
      }
    },
  });
}

var post_delete="";
function showComment(event, idd) {
  // var select = document.getElementById("comment"+idd);
  // var comment  = select.value;

  // console.log(ss);
  post_delete=idd;

  postIdZoom = idd;

  var modal1 = document.getElementById("modal");
  modal1.style.display = "block";
  var span1 = document.getElementById("close");
  span1.onclick = function () {
    modal1.style.display = "none";
  };

  var img = document.querySelector(".modal-content1");

  var username_post_zoom = document.querySelector(".username_post_zoom");

  var postlike = document.querySelector(".post_likes");// new added

// -- xoom like
  var color1 = document.getElementById(idd);

  const heartZoom = document.getElementById("heart-zoom");

  if (color1.classList.contains("active")) {
    heartZoom.classList.add("active");
  } else {
    heartZoom.classList.remove("active");
  }

  // xx zoom like
  var comment = document.querySelector(".comment");
  comment.innerHTML = "";

  var post_img = $(event).closest(".post_card").find(".post_image");

  var post_username = $(event).closest(".post_card").find(".post-usernamee");

  // console.log(post_username.text());
  username_post_zoom.innerHTML = post_username.text();

  var base64String = post_img.attr("src");

  img.src = base64String;

  $.ajax({
    url: "/showcomment/",
    dataType: "jsonp",
    type: "POST",
    data: { postid: idd },
    success: function (dataa) {
      // console.log(dataa);
      // currentUser = dataa[0].post_comment_user_name;
     
      // dataa.forEach((element) => {
      //   comment.innerHTML +=
      //     "<p><strong>" +
      //     element.post_comment_user_name +
      //     " : </strong>" +
      //     element.post_comment_text +
      //     "</p>";
      // });

      dataa.forEach((element) => {
        comment.innerHTML +=
          "<p><strong>" +
          element.user_name +
          " : </strong>" +
          element.post_comment_text +
          "</p>";
      });

    },
  });
  // new added *********************************************
  $.ajax({
    url: "/countlikes/",
    dataType: "jsonp",
    type: "POST",
    data: { postid: idd },
    success: function (dataa1) {
      postlike.innerHTML = dataa1[0].count + " likes";
    },
  });
}


/* Like on view comments zoom */

const heartZoom = document.getElementById("heart-zoom");

heartZoom.addEventListener("click", () => {
  var post_likes = document.querySelector(".post_likes");
  var color1 = document.getElementById(postIdZoom);

  var post_like_orgin = $(`#${postIdZoom}`)
    .closest(".post_footer")
    .find(".post_likes");

  $.ajax({
    url: "/addLike/",
    dataType: "jsonp",
    type: "POST",
    data: { post: postIdZoom },
    success: function (dataa) {
      if (dataa[0].message == "successdeleted") {
        heartZoom.classList.remove("active");
        color1.classList.remove("active");
        // console.log("rempved")
      } else {
        heartZoom.classList.add("active");
        color1.classList.add("active");
      }
      post_likes.innerHTML = dataa[0].likes + " likes";
      post_like_orgin.html(dataa[0].likes + " likes");
    },
  });
});



// *************thakre******************** delete post *********************************

function checkDelete(uid, pid){
  var drop = document.getElementById("dropdown-content"+pid);
  if(drop.classList.contains("added")){
    drop.classList.remove("added");
  }
  else{
    drop.classList.add("added");
  }
  var check = document.getElementById("delete"+ pid);
  $.ajax({
    url: "/checkdelete/",
    type: "POST",
    data: { postid: uid },
    success: function (dataa) {
      //console.log(dataa);
      if(dataa.final === uid){
        check.classList.remove("remove");
      }
      else{
        check.classList.add("remove");
      }
    },
  });
}

function deletepost(idd){
  
  $.ajax({
    url: "/deletepost/",
    dataType: "jsonp",
    type: "POST",
    data: { postid: idd },
    success: function (dataa) {
      window.location.reload();
    },
  })
}


function showlikes(postidd)
{
  console.log(postidd);
  var friend = document.querySelector(".likes-friendbox");
  var modal = document.getElementById("likes-myModal");
  var span = document.getElementsByClassName("likes-close")[0];
  modal.style.display = "block";
  span.onclick = function() {
    modal.style.display = "none";
    // window.location.reload();
  }
  window.onclick = function(event)
   {
    if (event.target == modal)
     {
      modal.style.display = "none";
      // window.location.reload();
    }
  }
  friend.innerHTML="";

  $.ajax({
    url: "/showlikelist/",
    dataType: "jsonp",
    type: "POST",
    data:{postid: postidd},
    success: function (dataa) {
      // console.log(dataa);
      dataa.forEach((element) => {
        // console.log(element.Profile_pic);
        friend.innerHTML += 
        "<div class=\"user_info\"> <img class=\"profile_img\" src=\"/img/default.jpg\" />" +
         "<strong><p>" +
        element.user_name +
        "</p></strong><div>"; 
      });
    },
  });
}


//delete zoom post


// *************thakre******************** delete post *********************************

function checkDeletezoom(uid){
  // console.log(uid+"loginid");
  var pid = post_delete;
  // console.log(pid+"pid")
  var drop = document.getElementById("dropdown-content-zoom");
  if(drop.classList.contains("added")){
    drop.classList.remove("added");
  }
  else{
    drop.classList.add("added");
  }
  var check = document.getElementById("delete");
  $.ajax({
    url: "/checkdeletewelcomezoom/",
    type: "POST",
    data: { postid: pid },
    success: function (dataa) {
      // console.log(dataa.post_user_id+"hh");
      if(dataa[0].post_user_id === uid){
        check.classList.remove("remove");
      }
      else{
        check.classList.add("remove");
      }
    },
  });
}

function deletepostzoom(){
  idd = post_delete;
  $.ajax({
    url: "/deletepost/",
    dataType: "jsonp",
    type: "POST",
    data: { postid: idd },
    success: function (dataa) {
      window.location.reload();
    },
  })
}

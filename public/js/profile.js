var tabbuttons = document.querySelectorAll(
  ".tabcontainer .buttoncontainer button"
);
var tabpanels = document.querySelectorAll(".tabcontainer .tabpanel");
const friendButton = document.querySelector(".button2");
const removeBtn = document.querySelector(".removeBtn");

// console.log(tabbuttons);

function Showpanel(panelindex, colorcode) {
  tabbuttons.forEach(function (node) {
    node.style.backgroundColor = "";
    node.style.color = "";
  });
  tabbuttons[panelindex].style.backgroundColor = colorcode;
  tabbuttons[panelindex].style.color = "white";

  tabpanels.forEach(function (node) {
    node.style.display = "none";
  });
  tabpanels[panelindex].style.display = "block";
  tabpanels[panelindex].style.backgroundColor = colorcode;

  //  );
}
Showpanel(0, "#696969");

function makefriend() {
  var make = friendButton.id;
  $.ajax({
    url: "/addfriend/",
    dataType: "jsonp",
    type: "POST",
    data: { friend: make },
    success: function (dataa) {
      if (!dataa.error) window.location.reload();
    },
  });
}

function removefriend() {
  var remove = friendButton.id;
  $.ajax({
    url: "/removefriend/",
    dataType: "jsonp",
    type: "POST",
    data: { friend: remove },
    success: function (dataa) {
      if (!dataa.error) window.location.reload();
    },
  });
}



// ************************** fuction for modal friend list**********************************



function friendlist(idd)
{
  // console.log(idd);
  var friend = document.querySelector(".friendbox");
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
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
// console.log("mmm")
  $.ajax({
    url: "/showfriend/",
    dataType: "jsonp",
    type: "POST",
    data:{userid: idd},
    success: function (dataa) {
      console.log(dataa);
      dataa.forEach((element) => {
        console.log(element.Profile_pic);
        friend.innerHTML += 
        "<div class=\"user_info\"> <img class=\"profile_img\" src=\"/img/default.jpg\" />" +
         "<strong><p>" +
        element.user_name +
        "</p></strong><div>"; 
      });
    },
  });
  // <img src="data:image/png;base64,element.Profile_pic"/>
  // "<div class=\"user_info\"> <img class=\"profile_img\" src=\"/img/default.jpg\" />" +
  // "<strong><p>"
  // console.log(idd)
  // $.ajax({
  //   url: "/showfriend/",
  //   dataType: "jsonp",
  //   type: "POST",
  //   data: { userid: idd },
  //   success: function (dataa) {
  //     if (!dataa.error) window.location.reload();
  //   },
  // });
}



function checksendmessage(search_id)
{

//  console.log(search_id);
 $.ajax({
  url: "/checksendmessage/",
  dataType: "jsonp",
  type: "POST",
  data: {search_message_id:search_id},
  success: function (dataa) {
    // if (dataa[0].message == "success")
    //   // window.location.reload();
    //   select.value = "";
    // console.log(dataa[0].message);
    alert(`${dataa[0].message}`);
  },
});
}


// ************************************* edit profile ********************************************

function editprofile(){
  var modal = document.getElementById("myModal1");
  var span = document.getElementsByClassName("close")[1];
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
}
//  xxxxxxxxxxxxxxxxxx  edit profile xxxxxxxxxxxxxx 


// function showpostprofile(post_idd)
// {
//    console.log(post_idd);
   
// }


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

//***************************************** showpostprofile *****************************************


var postIdZoom;
var post_delete = "";
function showpostprofile(event, idd){
  postIdZoom = idd;
  post_delete = idd;
  // console.log(idd);
  var modal1 = document.getElementById("modal");
  modal1.style.display = "block";
  var span1 = document.getElementById("close");
  span1.onclick = function () {
    modal1.style.display = "none";
  };

  var img = document.querySelector(".modal-content1");

  var username_post_zoom = document.querySelector(".username_post_zoom");

  var comment = document.querySelector(".comment");
  comment.innerHTML = "";

  var post_img = $(event).closest(".con").find(".img-class");

  // var post_username = $(event).closest(".post_card").find(".post-usernamee");

  // username_post_zoom.innerHTML = post_username.text();

  var base64String = post_img.attr("src");

  var postlike = document.querySelector(".post_likes");// new added

  // -- xoom like
  // var color1 = document.getElementById(idd);

  // const heartZoom = document.getElementById("heart-zoom");

  // if (color1.classList.contains("active")) {
  //   heartZoom.classList.add("active");
  // } else {
  //   heartZoom.classList.remove("active");
  // }

  // xx zoom like

  img.src = base64String;

  $.ajax({
    url: "/showpostprofile/",
    dataType: "jsonp",
    type: "POST",
    data: { postid: idd },
    success: function (dataa) {
      // console.log(dataa);
    var  currentUser = dataa[0][0].post_user_name;
      username_post_zoom.innerHTML = currentUser;
      // console.log(dataa[1])
      dataa[1].forEach((element) => {
        comment.innerHTML +=
          "<p><strong>" +
          element.user_name +
          " : </strong>" +
          element.post_comment_text +
          "</p>";
      });
      // console.log(dataa[1])
      // console.log("nfnfn")
      // console.log(dataa[0][0].post_user_name);
      // console.log(dataa[0].result1);
    },
  });
    // new added *****************************************************************
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
// /* Like on view comments zoom */

// const heartZoom = document.getElementById("heart-zoom");

// heartZoom.addEventListener("click", () => {
//   var post_likes = document.querySelector(".post_likes");
//   var color1 = document.getElementById(postIdZoom);

//   var post_like_orgin = $(`#${postIdZoom}`)
//     .closest(".post_footer")
//     .find(".post_likes");

//   $.ajax({
//     url: "/addLike/",
//     dataType: "jsonp",
//     type: "POST",
//     data: { post: postIdZoom },
//     success: function (dataa) {
//       if (dataa[0].message == "successdeleted") {
//         heartZoom.classList.remove("active");
//         color1.classList.remove("active");
//         // console.log("rempved")
//       } else {
//         heartZoom.classList.add("active");
//         color1.classList.add("active");
//       }
//       post_likes.innerHTML = dataa[0].likes + " likes";
//       post_like_orgin.html(dataa[0].likes + " likes");
//     },
//   });
// });






// *************thakre******************** delete post *********************************

function checkDelete(uid){
  var pid = post_delete;
  var drop = document.getElementById("dropdown-content-zoom");
  if(drop.classList.contains("added")){
    drop.classList.remove("added");
  }
  else{
    drop.classList.add("added");
  }
  var check = document.getElementById("delete");
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

function deletepost(){
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

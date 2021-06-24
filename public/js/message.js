// const session = require("express-session");
let socket = io.connect("http://localhost:3000");
let messagearea = document.querySelector('.message_area')

var global_friend_name = "";
var global_friend_id = "";


var global_message_id ="";
function sendmessage(username, userId)
{
 
  var msgId = global_message_id;
  console.log(msgId+ "  nfn");
  let textarea = document.querySelector('#textarea')
  var message = textarea.value;

  if(global_friend_name != "")
  {
    sendMessage(message, username, userId, msgId)
  }
    
    // console.log(textarea.value)
}

function sendMessage(msg, username, userId, msgId){

  // time added
  console.log(msgId);
  const currTime = new Date();
  const msgTime = currTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  // xx
  let msgg ={
      user: username,
      message: msg.trim(),
      time: msgTime,
  }

  appendmessage(msgg,'outgoing')
  scroolbottom();
  console.log(global_friend_id)
  console.log(global_friend_name);

  
  $.ajax({
    url: "/saveMessage/",
    dataType: "jsonp",
    type: "POST",
    data: {
      senderId: userId,
      receiverId: global_friend_id,
      messageId: msgId,
      message: msg,
    },
    success: function (dataa) {
      // if (dataa[0].message == "success")
      //   // window.location.reload();
      //   select.value = "";
      // var nn = "mmmmm";
      // console.log(dataa);
      if ((dataa[0].message = "success")) console.log("success");
    },
  });


  //send to server

  socket.emit('message1',msgg)


}

socket.on('message1',(msg)=>{
  appendmessage(msg,'incoming')
  scroolbottom();
})


function appendmessage(msgg,type){
  // console.log("hello");
  let mainDiv  = document.createElement('div');
  let classname = type;
  mainDiv.classList.add(classname,'message')

  // let markup = `  <h4>${msgg.user}</h4>
  //               <p> ${msgg.message} </p>
  // `
  let markup = `  <h4>${msgg.user}</h4>
  <p class="message-txt"> ${msgg.message} </p>
  <p class="time"> ${msgg.time} </p>
`;
  mainDiv.innerHTML = markup

  messagearea.appendChild(mainDiv)
  scroolbottom();
}



function scroolbottom(){
  messagearea.scrollTop = messagearea.scrollHeight
}

function openmessage(event, user_login_id,msg_id,friend_name,friend_id)
{
    // console.log( user_login_id)
    // console.log(msg_id);
    // console.log(friend_name);
    // console.log(friend_id)
    // console.log(msg_id)
    global_message_id = msg_id;
    console.log(global_message_id)

    const active = document.querySelector(".active");
    if (active) {
      active.classList.remove("active");
    }
    event.classList.add("active");

    messagearea.innerHTML = "";
    global_friend_name = friend_name;
    global_friend_id = friend_id;

    $.ajax({
        url: "/getmessage/",
        dataType: "jsonp",
        type: "POST",
        data: { message_id: msg_id },
        success: function (dataa) 
        {
          // if (dataa[0].message == "success")
          //   // window.location.reload();
          //   select.value = "";
          // var nn = "mmmmm";
          // console.log(dataa);
          var dateTemp = "";
          dataa.forEach(element => {
            // console.log()
// time added
            const messageTime = new Date(element.date_time);

        const date = messageTime.getDate();
        const month = messageTime.toLocaleString("default", { month: "long" });
        const year = messageTime.getFullYear();

        const dateTitle = `${date} ${month}, ${year}`;

        if (dateTitle != dateTemp) {
          dateTemp = dateTitle;
          let mainDiv = document.createElement("div");
          mainDiv.classList.add("date-container");
          let markup = `<h2 class="date-title"> ${dateTitle} </h2>`;
          mainDiv.innerHTML = markup;
          messagearea.appendChild(mainDiv);
        }

        const sentTime = messageTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
// xxx
            if(element.sender_message_id == user_login_id)
            {
                let msgg ={
               user: element.sender_user_name,
               message: element.message_text,
               time: sentTime,
                }
              // appendmessage(element.sender_user_name,element.message_text,'outgoing')
                 appendmessage(msgg,'outgoing')
            }
            else
            {
              let msgg ={
                user: element.sender_user_name,
                message: element.message_text,
                time: sentTime,
                 }
              appendmessage(msgg,'incoming')

            }
          });

        },
      });
    
}



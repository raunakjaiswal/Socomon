const searchWrapper = document.querySelector(".search-box");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector("ul");

inputBox.onkeyup = (e) =>{
    let userData = e.target.value;
    let emptyArray = [];

// console.log(userData);
    $.ajax({
        url: "/autocomplete/",
        dataType: "jsonp",
        type: "POST",
        data:{'task':userData}, 
        success: function(dataa){
            //    console.log(data);
            // res(data);
            // console.log(dataa["user_name"]);

            if(userData){
                // emptyArray = dataa[0].user_name.filter((data)=>{
                //     return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
                // });
                // emptyArray.push(dataa[0].user_name); 
                dataa.forEach(element => {
                    emptyArray.push(element.user_name);
                });
                emptyArray = emptyArray.map((data)=>{
                    return data = "<li>" + data + "</li> <hr>";
                });
                // console.log(emptyArray);
                searchWrapper.classList.add("active");
                showSuggestion(emptyArray);
                let allList = suggBox.querySelectorAll("li");
                for(let i = 0; i< allList.length; i++){
                    allList[i].setAttribute("onclick","select(this)");
                }
            }else{
                searchWrapper.classList.remove("active");
            }
        

        },
        error: function(err)
        {
            console.log(err.status);
        },
    //    console.log(data);
    
    });

    // if(userData){
    //     emptyArray = suggestion.filter((data)=>{
    //         return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
    //     });
    //     emptyArray = emptyArray.map((data)=>{
    //         return data = "<li>" + data + "</li> <hr>";
    //     });
    //     console.log(emptyArray);
    //     searchWrapper.classList.add("active");
    //     showSuggestion(emptyArray);
    //     let allList = suggBox.querySelectorAll("li");
    //     for(let i = 0; i< allList.length; i++){
    //         allList[i].setAttribute("onclick","select(this)");
    //     }
    // }else{
    //     searchWrapper.classList.remove("active");
    // }
}

function select(ele){
    let selectUserData = ele.textContent;
    inputBox.value = selectUserData;
    searchWrapper.classList.remove("active");
}

function showSuggestion(list){
    let listData;
    if(!list.length){
        listData = "<li> No such Id </li>"
    }else{
        listData = list.join('');
    }
    suggBox.innerHTML= listData;
}

// $('.search-btn').click(function() {
//     // alert('hohoho');
//     var inputVal = document.getElementById("myinput").value;
//     console.log(inputVal)
//   });


//   function getsearch()
//   {
//     var inputVal = document.getElementById("myinput").value;
//     console.log(inputVal)
//     // http://localhost:3000/profile/aakriti_anand_21
//     $.ajax({
//         url: "/profile/"+inputVal ,
//         // dataType: "jsonp",
//         type: "GET",
//         // data:{'task':userData}, 
//         success: function(dataa){
//             $("html").html(dataa);
//         }})
//     // }).done();


//   }

  function getsearch() {
    url = 'http://localhost:3000/profile/' + document.getElementById("myinput").value
    window.open(url, '_self');
}
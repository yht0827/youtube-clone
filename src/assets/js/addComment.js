import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteComment = document.getElementsByClassName("fa-times");

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10)+1;
}
const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10)-1;
}

const addComment = comment => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const i = document.createElement("i");

    div.className="video__comment";
    div.innerHTML= comment;
    i.innerHTML="X";
    li.appendChild(div);
    li.appendChild(i);
    commentList.prepend(li);
    increaseNumber();
}

const sendComment = async comment => {
    const videoId = window.location.href.split("/videos/")[1];
   const response = await axios({
       url:`/api/${videoId}/comment`,
       method:"POST",
       data:{
            comment
            }
            }); 
    if(response.status === 200){
        addComment(comment);
    }
};


const handleSubmit = event =>{
    event.preventDefault();// 새로고침 방지
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value="";
}

const handleDeleteComment =async event => {
    const commentId = event.target.parentNode.id;
    const videoId = window.location.href.split("/videos/")[1];
    
    const response = await axios({
        url:`/api/${videoId}/delete`,
        method:"POST",
        data:{
             commentId
             }
             }); 
     if(response.status === 200){
         event.target.parentNode.remove();
         decreaseNumber();
     }
};

function init(){
    addCommentForm.addEventListener("submit",handleSubmit);

     Array.from(deleteComment).forEach(button => {
     button.addEventListener("click",handleDeleteComment);
    });
}

if(addCommentForm){
    init();
}
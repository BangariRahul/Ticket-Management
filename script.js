let addBtn = document.querySelector(".add-btn"); //add button selected
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textAreaCont = document.querySelector(".textarea-cont");
let colors = ["lightPink" , "lightBlue" , "lightGreen" , "purple"];
let modalPriorityColor = colors[colors.length-1];
let priorityColor = document.querySelectorAll(".priority-colors");
let removeBtnIndicator =document.querySelector(".remove-btn-incicator");
// let allTicketCont=document.querySelectorAll(".ticket-cont");
let toolBoxColors = document.querySelectorAll(".color");
let defaultScreen = document.querySelector(".no-ticket-sign-cont");
let addFlag=false;
let removeFlag=false;
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let ticketsArr = [];

if(localStorage.getItem("jira_tickets")){
    ticketsArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketsArr.forEach((ticketobj , obj)=>{
        createTicket(ticketobj.ticketColor , ticketobj.ticketTask , ticketobj.ticketId);
        


    })
}

for(let i=0 ;i<toolBoxColors.length ; i++){
    toolBoxColors[i].addEventListener("click" , (e)=>{
        let currentToolBoxColor = toolBoxColors[i].classList[0];
            
        let filtetredTickets = ticketsArr.filter((ticketobj , idx)=>{
          
            return currentToolBoxColor=== ticketobj.ticketColor;
        })

        // remove prevTickets
        let allTicketCont=document.querySelectorAll(".ticket-cont");
        for(let i=0 ;i<allTicketCont.length ;i++){
            allTicketCont[i].remove();
        }

        // add new tickets

        filtetredTickets.forEach((ticketobj , obj)=>{
            createTicket(ticketobj.ticketColor , ticketobj.ticketTask , ticketobj.ticketId);
        })

    })
 
    toolBoxColors[i].addEventListener("dblclick" , (e)=>{
        let allTicketCont=document.querySelectorAll(".ticket-cont");
        for(let i=0 ;i<allTicketCont.length ;i++){
            allTicketCont[i].remove();
        }
        
        ticketsArr.forEach((a)=>{
            createTicket( a.ticketColor , a.ticketTask , a.ticketId);

        })
    })

}

// listener for modal color priority
priorityColor.forEach((colorele )=>{
    colorele.addEventListener("click" , (e) =>{
        priorityColor.forEach((colorele2, idx)=>{
            colorele2.classList.remove("border");
        })
        colorele.classList.add("border");
        
        modalPriorityColor =  colorele.classList[0];
        
    })
})

addBtn.addEventListener("click", (e)=>{ //adding event listener to + button.
    //create modal
    //generate ticket.
    // addFlag == true modal display; 
    addFlag = !addFlag;
    if(addFlag){
     modalCont.style.display="flex";
    }
    else{
     modalCont.style.display="none";

    }

})

// listener for modal enter.
modalCont.addEventListener("keydown" , (e)=>{
    let key = e.key;
    if(key === "Shift"){
        // console.log(priorityColor);
        createTicket(modalPriorityColor ,textAreaCont.value , shortid() );
        defaultmodel();
        modalCont.style.display="none";

        addFlag = false;

       
    }

})


// default modal ticket
function defaultmodel(){ 
    // modalCont.style.display="none";
    console.log("default model");
    textAreaCont.value="";
    priorityColor.forEach((colorele2, idx)=>{
        colorele2.classList.remove("border");
    })
    priorityColor[priorityColor.length-1].classList.add("border");
    modalPriorityColor = "purple";

}



function createTicket(ticketColor , ticketTask, ticketId){
    // let id = ticketId || shortid();
    let ticketCont =document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML=`
    <div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">#${ticketId}</div>
            <div class="ticket-taskarea">${ticketTask}</div>
            <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
            </div>
    `;
    defaultScreen.style.display = "none";

    mainCont.appendChild(ticketCont);

    // create object of ticket and add to array
     let isPresent = false;
     ticketsArr.forEach((a)=>{
        if(a["ticketId"] == ticketId){
            isPresent = true;
        }
     })
     if(!isPresent){
     
        ticketsArr.push({ticketColor ,ticketTask, ticketId});
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));
     
    }
    ticketremoval(ticketCont , ticketId);
    handleLock(ticketCont , ticketId);
    handleColor(ticketCont , ticketId);

}

function ticketremoval(ticket , id){

      ticket.addEventListener("click", (e)=>{
      
       if(!removeFlag)return;

       console.log("ticket delete");
       let idx = getTicketIdx(id);
       ticketsArr.splice(idx, 1);
       localStorage.setItem("jira_tickets" , JSON.stringify(ticketsArr));     
       ticket.remove();

       if(ticketsArr.length === 0 ){
        defaultScreen.style.display = "flex";
        console.log(ticketsArr.length);
       }
   

      })
 
}

function handleLock(ticket, id){
    
let lockele = ticket.querySelector(".ticket-lock");
let ticketLock =lockele.children[0];
let ticketTaskArea=ticket.querySelector(".ticket-taskarea");
ticketLock.addEventListener("click", (e)=>{
    console.log("working");
    let tktIdx =getTicketIdx(id);

    if(ticketLock.classList.contains(lockClass)){
        ticketLock.classList.remove(lockClass);
        ticketLock.classList.add(unlockClass);
        ticketTaskArea.setAttribute("contenteditable", "true");
    }
    else{
        ticketLock.classList.remove(unlockClass);
        ticketLock.classList.add(lockClass);
        ticketTaskArea.setAttribute("contenteditable", "false");

    }
    ticketsArr[tktIdx].ticketTask = ticketTaskArea.Text;
    localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));
})
}

function handleColor(ticket, id){
    let ticketClr =ticket.querySelector(".ticket-color");

    ticketClr.addEventListener("click" , (e)=>{
        // ticketidx from ticket arr
        let tktIdx =getTicketIdx(id);
        let currentTicketColor = ticketClr.classList[1];
        let currentTicketColoridx = colors.findIndex((color)=>{
            return currentTicketColor === color;
        })
        currentTicketColoridx++;
        let newcurrentTicketIdx = currentTicketColoridx % colors.length;
        let newTicketColor = colors[newcurrentTicketIdx];

        ticketClr.classList.remove(currentTicketColor);
        ticketClr.classList.add(newTicketColor);
        
        // modify data in localstorage
        ticketsArr[tktIdx].ticketClr = newTicketColor;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));

    })
    }

    function getTicketIdx(id){
        let ticketidx = ticketsArr.findIndex((ticketObj)=>{
            return ticketObj.ticketId === id;
        })
        return ticketidx;

    }


// remove-btn activation.
removeBtn.addEventListener("click" , (e)=>{
   
    removeFlag = !removeFlag;
if(removeFlag){
    removeBtnIndicator.style.display="flex";
}
else{
    removeBtnIndicator.style.display="none";

}
console.log("yaha tk aa gya ");

})

// let test=false;
// allTicketCont.forEach((ticketcont , idx)=>{
// ticketcont.addEventListener("click", (e)=>{
//     // if(!removeFlag) return;
//     //  else{
//     //     ticketcont.remove();
//     //  }

// allTicketCont.forEach((ticketcont , idx) => {
//     ticketcont.addEventListener("click", (e) => {
//         console.log("chal rha hai");
//     });
// });
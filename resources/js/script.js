
/********************************/
/*       INITIALISATION         */
/********************************/

//repopulatePlansTable();
repopulateModulesTable();


/********************************/
/*     REUSEABLE FUNCTIONS      */
/********************************/

/*
    getters and setters for the localStorage elements
*/

function getSavedPlans() {
    if(localStorage.getItem('savedPlans') == null) {
        localStorage.setItem('savedPlans','');
        return "";
    } else {
        return JSON.parse(localStorage.getItem('savedPlans'));
    }
    
}

//save each plan as a JSON object - {label: "plan1", value: "html"}
function setSavedPlans() {
    
}

function getModuleList() {
    if(localStorage.getItem('moduleList') == null) {
        localStorage.setItem('moduleList','');
        return "";
    } else {
        return localStorage.getItem('moduleList');
    }
    
}

//save the html straight
function setModuleList() {
    localStorage.setItem('moduleList',$(".js--modTable tbody").html());
}


function repopulatePlansTable() {
    $('.js--plansTable tbody').html(getSavedPlans());
}

function repopulateModulesTable() {
    $('.js--modTable tbody').html(getModuleList());
}

/*
    navigation scroll for navbar
*/

$('a[href*="#"]')
// Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
    // On-page links
    if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
        && 
        location.hostname == this.hostname
    ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        // Does a scroll target exist?
        if (target.length) {
            // Only prevent default if animation is actually gonna happen
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 140
            }, 1000);
        }
    }
});
    


/* 
    load the autocomplete 
*/

 $.getJSON("https://api.nusmods.com/v2/2018-2019/moduleList.json", function(data) {
          var list = data.map(function(i){return i.moduleCode + " - " + i.title});
          new Awesomplete(document.querySelector("#moduleSearchDiv input"),{ 
             list: list,
             minChars: 1,
             maxItems: 10,
             autoFirst: true
          })
 })

  
 
/*
    make the table sortable
*/

$(function() {
  $( ".sortableTable" ).sortable();
});

//add the selected module from the search bar to the module table
$("input.awesomplete").on("awesomplete-selectcomplete", function(){
    var module = $("input.awesomplete").val();
    var arr = module.split("-");
    for(var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].trim(); 
    }
    $(".js--modTable tbody").append(
        "<tr><th scope='row'>" 
                + arr[0] + 
            "</th><td>" +
                arr[1] +
            "</td><td class='deleteCell'><div class = 'buttonContainer'><button type=\"button\" class=\"close deleteModule\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div></td>");
    setModuleList();
    $("input.awesomplete").val("");
 
});

/*
    delete row when close button is clicked
*/

$(document).on('click','.close', function(){
    $(this).parent().parent().parent().remove();
})


/*
    ------------------------LOGIC FOR THE SAVE AS NEW... BUTTON---------------------------- 
*/

function emptyFieldAlert() {
    $('.savePlan .no-name').show(200);
    $('.savePlan .savedSuccessfully').hide();
    setTimeout(function(){
        $('.savePlan .no-name').hide(300);
    }, 1500);
}


function successfulSaveAlert() {
     $('.savePlan .no-name ').hide(200);
        $('.savePlan .savedSuccessfully ').html("<strong>" + $('.savePlanBar input').val()+"</strong> saved!")
        $('.savePlan .savedSuccessfully ').show(200);
        setTimeout(function(){
            $('.savePlan .savedSuccessfully ').hide(300);
        }, 1500);
}

/*
    controls for the alerts for saving NEW plan
*/

$(".saveAsNewButton").on('click', function(){
    if ($('.savePlanBar input').val()==""){
        emptyFieldAlert();
    } else {
        successfulSaveAlert();
    }
})


//actually save the plan in localStorage


/*
    clear table and close modal
*/

$('.clearAllButton').click(function(){
    $(".js--modTable tbody").html("");
    $('#exampleModal').modal('hide');
})


/*
   prevent enter key on an empty search bar from reloading the page
*/

$('#moduleSearchBar').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        event.preventDefault();
    }
});


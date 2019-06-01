
/********************************/
/*       INITIALISATION         */
/********************************/

repopulatePlansTable();
repopulatePlansSuggestion();
repopulateModulesTable();
repopulateSavePlanBarInput();
updateNumSems();
 
/********************************/
/*     REUSEABLE FUNCTIONS      */
/********************************/

/*
    GETTERS AND SETTERS FOR THE LOCALSTORAGE ELEMENTS
*/

//each plan is a JSON object - {label: "plan1", value: "html"}
function getSavedPlans() {
    if(localStorage.getItem('savedPlans') == null) {
        localStorage.setItem('savedPlans','[]');
        return [];
    } else {
        return JSON.parse(localStorage.getItem('savedPlans'));
    }
    
}

//save each plan as a JSON object - {label: "plan1", value: "html"}
function setSavedPlans(arr) {
    localStorage.setItem('savedPlans',JSON.stringify(arr));
}

//makes the JSON object 
function makeJSON(plan) {
    var text = getCurrentModules();
    return {
        "name": plan,
        "html": text
    }
}

//moduleList refers to the latest view of the modules table.
//If a plan is loaded, then the plan will change the latest view of the modules table.
function getModuleList() {
    if(localStorage.getItem('moduleList') == null) {
        localStorage.setItem('moduleList','');
        return "";
    } else {
        return localStorage.getItem('moduleList');
    }
    
}

//SAVE THE HTML STRAIGHT
function setModuleList() {
    localStorage.setItem('moduleList', getCurrentModules());
}

function getCurrentModules() {
    return $(".js--modTable tbody").html();
}

//get savedPlans, join the html, then set the plansTable body html
function repopulatePlansTable() {
    var arr = getSavedPlans();
    
        var str = "";
         for (var i = 0; i < arr.length; i++) {
             var planName = arr[i].name;
             //create a tr
             str +=
             "<tr>" +
                 "<th><a href=\"\" class=\"planLink\">" + planName +"</a></th>" +
                           "<td class=\"deleteCell\">" +
                               "<div class = 'buttonContainer'>" + 
                                   "<button type=\"button\" class=\"close deletePlan\" aria-label=\"Close\">" +
                                 "<span aria-hidden=\"true\">&times;</span></button>" +
                               "</div>"+
                           "</td>"+
                     "</tr>"
         }
         $('.js--plansTable tbody').html(str);
    
 
}

function repopulatePlansSuggestion() {
    var arr = getSavedPlans();

    if (arr.length === 0) {
        $('.js--dropdown').prop('disabled',true);
    } else {
        $('.js--dropdown').prop('disabled',false);
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            var planName = arr[i].name;
            //create a tr
            str +=
           "<a class=\"dropdown-item\" href=\"\">" + planName +"</a>";
        }
        $('.input-group-prepend .dropdown-menu').html(str);

    }
}

function repopulateModulesTable() {
    $('.js--modTable tbody').html(getModuleList());
}

function repopulateSavePlanBarInput(){
    if (localStorage.getItem('lastInput')==null) {
        localStorage.setItem('lastInput','');
    } else {
        $('.savePlanBar input').val(localStorage.getItem('lastInput'));
    }
}

function setSavePlanBarInput(){
    var text = $('.savePlanBar input').val();
    localStorage.setItem('lastInput', text);
}


function updateNumSems() {
    var lastNum = $('.js--split-sem .dropdown-menu .dropdown-item:last-child').text();
    var numMods = $('.js--modTable tbody tr').length;
    var numSems = Math.ceil(numMods/4);    
    if (numSems > lastNum) {
        while(numSems > lastNum){
            lastNum++;                   
            $('.js--split-sem .dropdown-menu').append(
                    "<a class= 'dropdown-item' href = ''>" + lastNum +"</a>");  
            }
        } else if (numSems < lastNum) {
            $('.js--split-sem .dropdown-menu .dropdown-item:last-child').remove();
        }
}


/*
    NAVIGATION SCROLL FOR NAVBAR
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
    LOAD THE AUTOCOMPLETE 
*/

 $.getJSON("vendors/data/moduleList.json", function(data) {
          var list = data.map(function(i){return i.moduleCode + " - " + i.title});
          new Awesomplete(document.querySelector("#moduleSearchDiv input"),{ 
             list: list,
             minChars: 1,
             maxItems: 10,
             autoFirst: true
          })
 })

  
 
/*
    MAKE THE TABLE SORTABLE
*/

$(function() {
  $( ".sortableTable" ).sortable();
});

/*
    ADD THE SELECTED MODULE FROM THE SEARCH BAR TO THE MODULE TABLE
*/
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
    updateNumSems();
 
});

/*
    DELETE ROW WHEN CLOSE BUTTON IS CLICKED (FOR MODULES) 
*/


$(document).on('click','.deleteModule', function(){
    $(this).parent().parent().parent().remove();
    setModuleList();
    updateNumSems();
})


/*
    -----------------LOGIC FOR THE SAVE / SAVE AS NEW... BUTTON---------------------------- 
*/
/*
    ALERTS
*/

function emptyFieldAlert() {
    $('.savePlan .no-name').show(200);
    $('.savePlan .savedSuccessfully').hide();
     $('.savePlan .duplicate-name').hide();
    setTimeout(function(){
        $('.savePlan .no-name').hide(300);
    }, 1500);
}


function successfulSaveAlert() {
        $('.savePlan .duplicate-name').hide();
        $('.savePlan .no-name ').hide();
        $('.savePlan .savedSuccessfully ').html("<strong>" + $('.savePlanBar input').val()+"</strong> saved!")
        $('.savePlan .savedSuccessfully ').show(200);
        setTimeout(function(){
            $('.savePlan .savedSuccessfully ').hide(300);
        }, 1500);
}


function updateAndResyncPlans(name, arr) { 
    var obj = makeJSON(name);
    arr.push(obj);
    resyncPlans(arr);
}

function resyncPlans(arr) {
    setSavedPlans(arr);
    repopulatePlansTable();
    repopulatePlansSuggestion();
    successfulSaveAlert();
}

//CLICKING ON SAVE AS NEW BUTTON
$(".saveAsNewButton").on('click', function(){
    if ($('.savePlanBar input').val()==""){
        emptyFieldAlert();
    } else {
        var name = $('.savePlanBar input').val();
        var arr = getSavedPlans();
        var duplicate = false;
       
        for (var i = 0; i < arr.length;i++) {
            if (arr[i].name== name) {
                duplicate = true;
                break;
            }
        }
        if (duplicate) {
            //show the duplicate name div
            $('.savePlan .no-name').hide();
            $('.savePlan .savedSuccessfully').hide();
            $('.savePlan .duplicate-name').show(200);
            setTimeout(function(){
                $('.savePlan .duplicate-name').hide(300);
            }, 1500);
            
        } else {
            updateAndResyncPlans(name,arr);
        }
        
        //empty the input so that users cannot double click
        $('.savePlanBar input').val("");
        setSavePlanBarInput();
    }
})


//CLICKING ON SAVE BUTTON

$(".saveButton").on('click', function(){
    if ($('.savePlanBar input').val()==""){
        emptyFieldAlert();
    } else {
        var name = $('.savePlanBar input').val();
        var arr = getSavedPlans();
        var duplicate = false;
        var index = -1;
        for (var i = 0; i < arr.length;i++) {
            if (arr[i].name== name) {
                duplicate = true;
                index = i;
                break;
            }
        }
        if (duplicate) {
            //show the overwrite modal
            $("#overwritePlanModalLabel").text("Overwrite '" + name +"'?");
            $('#overwritePlanModal').modal('show');
            //save in localStorage
            $('#confirmOverwriteButton').click(function(){
                arr[index].html = getCurrentModules();
                resyncPlans(arr);
            })
            
        } else {
            updateAndResyncPlans(name, arr);
        }
        //left here for c-a-d purposes that the input is purposely left as is
        //empty the input so that users cannot double click
        // $('.savePlanBar input').val("");
        
    }
});


/*
    CLEAR TABLE AND CLOSE MODAL
*/

$('.clearAllButton').click(function(){
    $(".js--modTable tbody").html("");
    $('#clearTableModal').modal('hide');
    setModuleList();
})


/*
   PREVENT ENTER KEY ON AN EMPTY SEARCH BAR FROM RELOADING THE PAGE
*/

$('#moduleSearchBar').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        event.preventDefault();
    }
});

/*
    LOADING A PLAN BY CLICKING ON A PLAN NAME
*/


$('body').on('click', '.planLink', function(e){
    e.preventDefault();
    var planName = $(this).text();
    $('.savePlanBar input').val(planName);
    var plansArr = getSavedPlans();
    var html = "";
    for(var i = 0; i < plansArr.length; i++) {
        if (plansArr[i].name == planName) {
            html = plansArr[i].html;
            break;
        }
    }
    //change the current view
     $('html, body').animate({
                scrollTop: $("#modules").offset().top
            }, 1000);
    
    $(".js--modTable tbody").html(html);
    setModuleList();
    setSavePlanBarInput();
    
})

/*
    DELETING A PLAN
*/
$('body').on('click', '.deletePlan', function(){
    var planName = $(this).parent().parent().prev().text();
    $("#deletePlanModal .modal-body").text('\"' + planName + '\" will be permanently deleted!' );
    $("#deletePlanModal").modal('show');
    $('#confirmDeletePlanButton').click(function(){
        var plansArr = getSavedPlans();
        for(var i = 0; i < plansArr.length; i++) {
            if (plansArr[i].name == planName) {
                plansArr.splice(i,1);
                break;
            }
        }
        setSavedPlans(plansArr);
        repopulatePlansTable();
        repopulatePlansSuggestion();
        
        //if current plan in view is deleted, delete the planName from the savePlanBar input since its not in use anymore
        if (planName == $('.savePlanBar input').val()){
            $('.savePlanBar input').val("");
            setSavePlanBarInput();
        }
         $("#deletePlanModal").modal('hide');
    })
        
})

//WHEN CLICKING ON THE PLANS FROM THE DROPDOWN, DO NOTHING EXCEPT POPULATE THE INPUT WITH THE PLAN NAME
$('body').on('click','.js--dropdown-menu a', function(e){
    e.preventDefault();
    var planName = $(this).text();
    $('.savePlanBar input').val(planName);
    setSavePlanBarInput();
})








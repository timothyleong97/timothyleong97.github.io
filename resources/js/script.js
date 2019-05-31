
/********************************/
/*       INITIALISATION         */
/********************************/

repopulatePlansTable();
repopulateModulesTable();


/********************************/
/*     REUSEABLE FUNCTIONS      */
/********************************/

/*
    getters and setters for the localStorage elements
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

//save the html straight
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
    delete row when close button is clicked for modules 
*/


$(document).on('click','.deleteModule', function(){
    $(this).parent().parent().parent().remove();
    setModuleList();
})


/*
    -----------------LOGIC FOR THE SAVE / SAVE AS NEW... BUTTON---------------------------- 
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

/*
    controls for the alerts for saving NEW plan
*/

function updateAndResyncPlans(name, arr) { 
    var obj = makeJSON(name);
    arr.push(obj);
    setSavedPlans(arr);
    repopulatePlansTable();
    successfulSaveAlert();
}

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
    }
})


//controls for saving existing plan

$(".saveButton").on('click', function(){
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
            //TODO: show the overwrite modal
            //TODO: save in localStorage
        } else {
            updateAndResyncPlans(name, arr);
        }
        
        //empty the input so that users cannot double click
        $('.savePlanBar input').val("");
    }
});


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

/*
    Loading a plan by clicking on a plan name
*/


$('body').on('click', '.planLink', function(){
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
    $(".js--modTable tbody").html(html);
    setModuleList();
    
})

/*
    Deleting a plan
*/

$('body').on('click', '.deletePlan', function(){
    var me = $(this);
    $("#deletePlanModal").modal('show');
    $('#confirmDeletePlanButton').click(function(){
        var planName = me.parent().parent().prev().text();
        var plansArr = getSavedPlans();
        for(var i = 0; i < plansArr.length; i++) {
            if (plansArr[i].name == planName) {
                plansArr.splice(i,1);
                break;
            }
        }
        setSavedPlans(plansArr);
        repopulatePlansTable();
         $("#deletePlanModal").modal('hide');
    })
    
//    //TODO: convert this to modal
    
})


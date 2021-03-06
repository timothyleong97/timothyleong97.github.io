
/********************************/
/*       INITIALISATION         */
/********************************/

repopulatePlansTable();
repopulatePlansSuggestion();
repopulateModulesTable();
repopulateSavePlanBarInput();
updateNumSems();
makeSortable();
 
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

//SAVE CURRENT STATE OF MODULE TABLE IN LOCAL STORAGE
function setModuleList() {
    localStorage.setItem('moduleList', getCurrentModules());
}

//?sep? separates the modules from the breakdown
function getCurrentModules() {
    var modules = $(".js--modTable tbody").html();
    var breakdown = $(".table-list table").html();
    return modules + "_split_" + breakdown;
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
            
            str +=
           "<a class=\"dropdown-item\" href=\"\">" + planName +"</a>";
        }
        $('.input-group-prepend .dropdown-menu').html(str);

    }
}

function repopulateModulesTable() {
    var modulesAndBreakdowns = getModuleList();
    if (modulesAndBreakdowns != "") {
        var arr = modulesAndBreakdowns.split("_split_");
        $('.js--modTable tbody').html(arr[0]);
        $('.table-list table').html(arr[1]);    
        makeSortable();
    }    
}

function repopulateSavePlanBarInput(){
    if (localStorage.getItem('lastInput')==null) {
        localStorage.setItem('lastInput',"");
    } else {
        $('.savePlanBar input').val(localStorage.getItem('lastInput'));
    }
}

function setSavePlanBarInput(){
    var text = $('.savePlanBar input').val();
    localStorage.setItem('lastInput', text);
}


function updateNumSems() {
    var lastNum = $('.js--split-sem .dropdown-menu .dropdown-item:last-child').text();//1
    var numMods = $('.js--modTable tbody tr').length;//0
    var numSems = Math.ceil(numMods/4);    //0
    if (numMods > 0) {
        $("#dropdownMenuLink").removeClass("disabled");
    }
    if (numSems > lastNum) {
        while(numSems > lastNum){
            lastNum++;                   
            $('.js--split-sem .dropdown-menu').append(
                    "<a class= 'dropdown-item' href = ''>" + lastNum +"</a>");  
            }
        } else if (numSems < lastNum) {
            $('.js--split-sem .dropdown-menu .dropdown-item:last-child').remove();
        }
    if (numSems === 0) {
        $("#dropdownMenuLink").addClass("disabled");
    }

}


function setSelectedModuleName(moduleName) {
    var arr = [];
    if (localStorage.getItem('moduleNames') != null) {
        arr = JSON.parse(localStorage.getItem('moduleNames'));
    }
    arr.push(moduleName);
    localStorage.setItem('moduleNames',JSON.stringify(arr));
}

function removeModuleCode(moduleName) {
    var arr = JSON.parse(localStorage.getItem('moduleNames'));
    var index = arr.indexOf(moduleName);
    arr.splice(index, 1);
    localStorage.setItem('moduleNames', JSON.stringify(arr));
}


function checkSelectedModuleCodeExists(moduleName) {
    var arr = JSON.parse(localStorage.getItem('moduleNames'));
    if(arr == null) return false;
    var index = arr.indexOf(moduleName);
    if (index == -1) {
        return false;
    } else {
        return true;
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
 var list = moduleLists.map(function(i){return i.moduleCode + " - " + i.title});
 var engine = new Awesomplete(document.querySelector("#moduleSearchDiv input"),{ 
             list: list,
             minChars: 1,
             maxItems: 10,
             autoFirst: true
          })
  
 
/*
    MAKE THE TABLE SORTABLE
*/

function makeSortable() {
  $( ".connected-sortable" ).sortable({
      connectWith: ".connected-sortable",
      cancel: ".ui-disabled"
  }).disableSelection();
};


function makeRowFlash(moduleName) {
    var numRows = $('.js--modTable tbody tr').length;
    var currRow = $('.js--modTable tbody tr').first();
    for(var i = 0; i < numRows; i++) {
        var name = currRow.find('td').first().text();
        if (name == moduleName) {
             $('html, body').animate({
                scrollTop: currRow.offset().top -160
            }, 700);
            currRow.css('animation-duration','2.8s');
            currRow.addClass('faster');
            currRow.addClass('animated');
            currRow.addClass('flash');
            currRow.on('animationend', function(){
                currRow.removeClass('animated');
                currRow.removeClass('flash');
            })
            break;
        }
        currRow = currRow.next();
    }
}

/*
    ADD THE SELECTED MODULE FROM THE SEARCH BAR TO THE MODULE TABLE
*/
$("input.awesomplete").on("awesomplete-selectcomplete", function(){
    var module = $("input.awesomplete").val();
    var arr = module.split("-");
    for(var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].trim(); 
    }
    if (checkSelectedModuleCodeExists(arr[1])) {
        makeRowFlash(arr[1]);
        $('.js--added-module').show(200);
        setTimeout(function(){
        $('.js--added-module').hide(300);
        }, 3000);
    } else {
        $(".js--modTable tbody").append(
        "<tr><th scope='row'>" 
                + arr[0] + 
            "</th><td>" +
                arr[1] +
            "</td><td class='deleteCell'><div class = 'buttonContainer'><button type=\"button\" class=\"close deleteModule\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div></td>");
        setModuleList();
        updateNumSems();
        setSelectedModuleName(arr[1]);
     
    }
    $("input.awesomplete").val("");
    
});

/*
    DELETE ROW WHEN CLOSE BUTTON IS CLICKED (FOR MODULES) 
*/


$(document).on('click','.deleteModule', function(){
    var tr = $(this).parent().parent().parent();
    var moduleCode = tr.find('th').text();
    removeModuleCode(moduleCode);
    tr.remove();
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

/*
    PUSH A NEW PLAN INTO THE PLANS ARRAY
*/

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

/*
    CLICKING ON SAVE AS NEW BUTTON
*/

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


/*
    CLICKING ON SAVE BUTTON
*/

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
                $('#overwritePlanModal').modal('hide');
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
    $(".table-list table tbody").html("");
    $('#clearTableModal').modal('hide');
    updateNumSems();
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
    var arr = html.split("_split_");
    $(".js--modTable tbody").html(arr[0]);
    $('.table-list table').html(arr[1]); 
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


$('body').on('click', '.js--split-sem .dropdown-menu .dropdown-item', function(e) {
    e.preventDefault();
    var indexofMod = 1;
    var numSems = parseInt($(this).text());
    var numMods = $('.js--modTable tbody tr').length;
    //add code to delete whole table
    $('.table-list table tbody').remove();
    for(var i = 1; i <= numSems; i++) {

        $('.table-list table').append("<tbody class='connected-sortable'><tr class='ui-disabled'><th colspan='2'>Semester "+i+"</th></tr></tbody>");
        
        var segment = $('.table-list table tbody').last();
        var modsPerSem = Math.floor(numMods/numSems);
        if (i == numSems) {
            for (var k = indexofMod; k <= numMods; k++) {
                var row = $('.js--modTable tbody tr:nth-child('+k+")").clone();
                row.find(".deleteCell").remove();
                segment.append(row);
            }
        } else {
            for(var j = 0; j < modsPerSem; j++) {
                var row = $('.js--modTable tbody tr:nth-child('+indexofMod+")").clone();
                row.find(".deleteCell").remove();
                segment.append(row);
                indexofMod++;
            }    
        }
       
    }
    setModuleList();
    makeSortable();
})




$("#selectSemStartNumber").change(function(){
    var selectedNum = parseInt($("#selectSemStartNumber option:selected").text());
    renumberSemesters(selectedNum);
})

function renumberSemesters(num) {
    var numHeaders = $('.table-list table tbody').length;
    var currentTBody = $('.table-list table tbody').first();
    for(var i = 1; i <= numHeaders; i++) {
        currentTBody.find('tr').first().find('th').text("Semester " + num);
        currentTBody = currentTBody.next();
        num++;
    }
}

$('.exportToCSVButton').click(function(){
 	export_table_to_csv("table.csv");  
})

function export_table_to_csv(filename) {
	var csv = [];
	var rows = document.querySelectorAll(".table-list table tr");
	
    for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");
		
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
		csv.push(row.join(","));		
	}

    // Download CSV
    download_csv(csv.join("\n"), filename);
}

function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}


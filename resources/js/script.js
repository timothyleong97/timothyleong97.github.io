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

//capture the selected module from the search bar
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
            "</td><td class='deleteCell'><div class = 'buttonContainer'><button type=\"button\" class=\"close\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div></td>");
    
    $("input.awesomplete").val("");
    
});

/*
    delete row when close button is clicked
*/

$(document).on('click','.close', function(){
    $(this).parent().parent().parent().remove();
})


/*
    controls for the alerts for saving new plan
*/

$(".saveAsNewButton").on('click', function(){
    if ($('.savePlanBar input').val()==""){
        $('.savePlan .no-name ').show(200);
        $('.savePlan .savedSuccessfully ').hide();
         setTimeout(function(){
            $('.savePlan .no-name ').hide(300);
        }, 1500);
        
    } else {
        $('.savePlan .no-name ').hide(200);
        $('.savePlan .savedSuccessfully ').html("<strong>" + $('.savePlanBar input').val()+"</strong> saved!")
        $('.savePlan .savedSuccessfully ').show(200);
        setTimeout(function(){
            $('.savePlan .savedSuccessfully ').hide(300);
        }, 1500);
        
    }
})

/*
    clear table and close modal
*/

$('.clearAllButton').click(function(){
    $(".js--modTable tbody").html("");
    $('#exampleModal').modal('hide');
})

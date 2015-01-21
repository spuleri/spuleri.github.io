/*Smooth scroll function*/
$("a[href^='#']").on('click', function(e) {

   // prevent default anchor click behavior
   e.preventDefault();

   // store hash
   var hash = this.hash;

   // animate
   $('html, body').animate({
       scrollTop: $(this.hash).offset().top
     }, 600, function(){

       // when done, add hash to url
       // (default click behaviour)
       window.location.hash = hash;
     });

});


/*function to mark selection in nav bar as active*/
$(function() {
  $('.nav li').click(function() {
     $('.nav li').removeClass();
     $(this).addClass('active');
  });
});


//old function where arrow bounces on hover
// $("#extra-container").hover(function() {
//   $(this).effect("bounce", { direction: 'up', distance: 60, times: 1 }, 1000);
// }
// );

//changed arrow to bounce on page load.
$(function() {
  for(i = 0; i < 10; ++i){
    $("#extra-container").effect("bounce", { direction: 'up', distance: 80, times: 3 }, 2500);
  }
}
);


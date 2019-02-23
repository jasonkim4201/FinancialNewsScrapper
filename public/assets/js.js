$(document).ready(function() {
  console.log("document is ready");

 $("#scrapeBtn").on("click", function() {

  $.ajax({
    url: "/scrape",
    method: "GET"
  })
  .then(scrapedArticles => {
    alert("article scrapped!");
    location.reload();
  });
 });


const viewNews = () => {
    $.ajax({
      url: "/articles",
      method: "GET"
    })
    .then(dbArticles => {
      dbArticles.forEach((article, index) => {
        /* Ahahahaha my dynamic accordion worked! That wasn't so bad */

        let accordionCard = $(`<div class="card">`);
        let cardHeader = $(`<div class="card-header" id=${index + 1}>`);
        let headerBtn = $(`<h5 class="mb-0">`).appendTo(cardHeader);

        let collaspeBtnLink = $(`<button class="btn btn-link" data-toggle="collapse" data-target="#collapse${index + 1}" aria-expanded="false" aria-controls="collapse${index + 1}">`).text(article.title).appendTo(headerBtn);
        
        let accordionLinkedThingy = $(`<div id="collapse${index + 1}" class="collapse" aria-labelledby="heading${index + 1}" data-parent="#newsDiv">`);

        let accordionBody = $(`<div class="card-body">`).text(article.summary);
        let newslink = $(`<a>`).attr(`href`, `https://www.reuters.com/${article.link}`).html("<p>Link to Article</p>");
    
        $(cardHeader).appendTo(accordionCard);
        $(`#newsDiv`).append(accordionCard);

        accordionBody.appendTo(accordionLinkedThingy);
        $(accordionBody).append(newslink);

        $(`#newsDiv`).append(accordionLinkedThingy);

        
      });
    });
}

viewNews();




});
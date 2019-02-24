$(document).ready(function () {
  console.log("document is ready");

  $("#hideCommentBox").on("click", function () {
    $("#commentingDiv").empty();
  });

  $("#scrapeBtn").on("click", function () {

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
          //should add the article id into the accordion....
          let accordionCard = $(`<div class="card">`);
          let cardHeader = $(`<div class="card-header" id=${index + 1}>`);
          let headerBtn = $(`<h5 class="mb-0">`).appendTo(cardHeader);

          let collaspeBtnLink = $(`<button class="btn btn-link article" data-id="${article._id}"  data-toggle="collapse" data-target="#collapse${index + 1}" aria-expanded="false" aria-controls="collapse${index + 1}">`).text(article.title).appendTo(headerBtn);

          let accordionLinkedThingy = $(`<div id="collapse${index + 1}" class="collapse" aria-labelledby="heading${index + 1}" data-parent="#newsDiv">`);

          let accordionBody = $(`<div class="card-body">`).text(article.summary);
          let newslink = $(`<a>`).attr(`href`, `https://www.reuters.com/${article.link}`).html("<p>Link to Article</p>");


          $(cardHeader).appendTo(accordionCard);
          $(`#newsDiv`).append(accordionCard);

          accordionBody.appendTo(accordionLinkedThingy);
          $(accordionBody).append(newslink);

          $(`#newsDiv`).append(accordionLinkedThingy);


          // Create a area to see comments in accordion
          let commentDivSection = $(`<div id="commentArea">`);
          $(accordionBody).append(commentDivSection);

        });
      });
  }

  // on click of accordion link...get the specific aritcle id and store into variable
  // make comment box appear specifically for that accordion body
  $("#newsDiv").on("click", ".article", function () {
    const articleId = $(this).attr("data-id");
    console.log(articleId);
    // empty comment box if exists
    $("#commentingDiv").empty();

    // create commentsection variables and append it all together to #commentingDiv
    let commentCard = $(`<div class="card bg-info">`);
    let commentCardBody = $(`<div class="card-body">`);
    let formTag = $(`<form>`);
    let commentTitle = $(`<h4 class="text-center">`).text("comment section");
    let inputTitle = $(`<input type="text" class="form-control" id="commentTitle">`);
    let textarea = $(`<textarea name="note" id="commentSection" class="form-control w-100" rows="5">`);
    let submitBtn = $(`<button class="btn btn-block btn-dark" id="commentBtn">`).text("Submit note");

    // append comment area to form tag
    $(formTag)
      .append(commentTitle)
      .append(inputTitle)
      .append(textarea)
      .append(submitBtn);

    $(commentCardBody).append(formTag);
    $(commentCard).append(commentCardBody);
    $("#commentingDiv").append(commentCard);
    // use article id in ajax call
    $.ajax({
        url: `/articles/${articleId}`,
        method: "GET"
      })
      .then(articleData => {
        console.log("ARTICLE DATA:");
        console.log(articleData);
        $("#commentBtn").attr('data-id', articleData._id);
        // link sumbit button with aritcle data id attr

      })
  })


  // submit comments
  $(document).on("click", "#commentBtn", function (event) {
    event.preventDefault();
    console.log("clicked");

    const commentData = {
      title: $("#commentTitle").val().trim(),
      body: $("#commentSection").val().trim()
    };

    $("#commentTitle").val("");
    $("#commentSection").val("");

    const articleId = $(this).attr("data-id");
    if (!articleId) {
      return false;
    }
    if (commentData.title === "" || commentData.body === "") {
      alert("You cannot sumbit an empty comment.");
      return false;
    }
    console.log("COMMENT DATA:")
    console.log(commentData);
      $.ajax({
        url: `/articles/${articleId}`,
        method: "POST",
        data: commentData
      })
        .then(comments => {
          console.log("COMMENT RESULTS");
          console.log(comments);
          $("#commentTitle").val("");
          $("#commentSection").val("");
        })


  });

  // Once comments are in database they will be posted into the accordion where the comment div is 

  viewNews();
});
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
        alert("Articles scrapped!");
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


        });
      });
  }

  // on click of accordion link...get the specific aritcle id and store into variable
  // make comment box appear specifically for that accordion body
  $("#newsDiv").on("click", ".article", function () {
    const articleId = $(this).attr("data-id");
    console.log("DATA ID");
    console.log(articleId);
    // empty comment box if exists
    $("#commentingDiv").empty();

    // create commentsection variables and append it all together to #commentingDiv
    let commentCard = $(`<div class="card bg-info">`);
    let commentCardBody = $(`<div class="card-body">`);
    let formTag = $(`<form>`);
    let commentTitle = $(`<h4 class="text-center">`).text("comment section");
    let inputTitle = $(`<input type="text" class="form-control" placeholder="title" id="commentTitle">`);
    let textarea = $(`<textarea name="note" id="commentSection" placeholder="comment..." class="form-control w-100" rows="5">`);
    let submitBtn = $(`<button class="btn btn-block btn-dark" id="commentBtn">`).text("Submit note");
    let displayCommentDiv = $(`<div class="diaplayCommentZone mt-5">`);
    // append comment area to form tag
    $(formTag)
      .append(commentTitle)
      .append(inputTitle)
      .append(textarea)
      .append(submitBtn);

    $(commentCardBody).append(formTag);
    $(commentCard).append(commentCardBody);
    $("#commentingDiv").append(commentCard);
    $("#commentingDiv").append(displayCommentDiv);

    // use article id in ajax call
    $.ajax({
        url: `/articles/${articleId}`,
        method: "GET"
      })
      .then(articleData => {
        console.log("ARTICLE DATA:");
        console.log(articleData);
        $("#commentBtn").attr('data-id', articleData._id);

        // show the comment data in #commentArea
        console.log("ARRAY OF NOTES???")
        console.log(articleData.note);
       
        $(".commentArea").empty();

        // omg i figured it out?!? see i'm not a complete dumpster fire!
        // actually no let's not get too far ahead of myself
        articleData.note.forEach((notes, index) => {
          console.log(notes.title);
          console.log(notes.body);
          // okay now to put all this in some fucking box
          let noteCard = $(`<div class="card">`);
          let noteCardBody = $(`<div class="card-body">`);
          let noteCardTitle = $(`<h5 class="card-title">`).text(notes.title);
          let noteCardNote = $(`<p class="card-text">`).text(notes.body);
          /* let deleteNoteBtn = $(`<button class="btn btn-danger" id="${index}">`).text(`Discard note`); */
          

          // APPEND IT ALL
          $(noteCardBody)
            .append(noteCardTitle)
            .append(noteCardNote);

          $(noteCard).append(noteCardBody);
          
          $(".diaplayCommentZone").append(noteCard);
          
        });
      });
  });


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
        });

       // use article id in ajax call
    $.ajax({
      url: `/articles/${articleId}`,
      method: "GET"
    })
    .then(articleData => {
      $(".diaplayCommentZone ").empty();
      $("#commentBtn").attr('data-id', articleData._id);
      $(".commentArea").empty();

      articleData.note.forEach((notes, index) => {

        let noteCard = $(`<div class="card">`);
        let noteCardBody = $(`<div class="card-body">`);
        let noteCardTitle = $(`<h5 class="card-title">`).text(notes.title);
        let noteCardNote = $(`<p class="card-text">`).text(notes.body);

        $(noteCardBody)
          .append(noteCardTitle)
          .append(noteCardNote);

        $(noteCard).append(noteCardBody);
        
        $(".diaplayCommentZone").append(noteCard);
        
      });
    });

  });

  viewNews();
});
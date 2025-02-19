//This is for initialisation:
updateArticleKeyword("corona");
// this is my virtual articleview-object, containing the current state of article-view:
var articleview_calendarweek = 1;
var articleview_year = 2019;
var articleview_keyword = "corona";
var articleview_content;
var articleview_keyword_2 = "";
var articleview_content_2 = [];

function updateArticleTime(text_week) {
  articleview_calendarweek = parseInt(text_week.slice(3, 5));
  articleview_calendarweek = articleview_calendarweek+1;
  articleview_year = parseInt(text_week.slice(6, 10));
  echoArticles();
}

function updateArticleKeyword (keyword) {
  articleview_keyword = keyword;
  var article_datarequest = new XMLHttpRequest();
    article_datarequest.onreadystatechange = function() {
        if (article_datarequest.readyState == 4 && article_datarequest.status == 200) {
            var articleview_json = article_datarequest.responseText;
            articleview_content = JSON.parse(articleview_json);
            echoArticles();
        }
    }
    article_datarequest.open("GET", "data/articles/"+keyword+".json");
    article_datarequest.send();

}

function updateArticleKeyword2 (keyword) {
  if (keyword == "keines") {
    articleview_keyword_2 = "";
  } else {
    var article_datarequest = new XMLHttpRequest();
    article_datarequest.onreadystatechange = function() {
        if (article_datarequest.readyState == 4 && article_datarequest.status == 200) {
            var articleview_json = article_datarequest.responseText;
            articleview_content_2 = JSON.parse(articleview_json);
            echoArticles();
        }
    }
    article_datarequest.open("GET", "data/articles/"+keyword+".json");
    article_datarequest.send();
    articleview_keyword_2 = keyword;
  }
}

function echoArticles() {
  var articleview_display = "";
  var article_lists_max = Math.max(articleview_content.length, articleview_content_2.length)
  for (let i=0; i<article_lists_max; i++) {
    if (i < articleview_content.length) {
      var local_day = parseInt(articleview_content[i][2].slice(0, 2));
      var local_month = parseInt(articleview_content[i][2].slice(3, 5));
      var local_year = parseInt(articleview_content[i][2].slice(6, 10));
      var week_information = kalenderWoche(local_year,local_month,local_day);
      //alert("Artikelinformation: "+week_information[0]+"-"+week_information[1]+"\n Woche: "+articleview_year+"-"+articleview_calendarweek);
      if (local_year == articleview_year && week_information == articleview_calendarweek) {
        articleview_display = 
          articleview_display + "<h2><a href=" +
          articleview_content[i][3] + " target=_blank>" +
          articleview_content[i][1] + "</a></h2><p>" +
          articleview_content[i][2] + " - Süddeutsche Zeitung - " +
          articleview_keyword + "</p><p>" +
          articleview_content[i][4];
      }
    }
    if (i < articleview_content_2.length && articleview_keyword_2 != "") {
      var local_day = parseInt(articleview_content_2[i][2].slice(0, 2));
      var local_month = parseInt(articleview_content_2[i][2].slice(3, 5));
      var local_year = parseInt(articleview_content_2[i][2].slice(6, 10));
      var week_information = kalenderWoche(local_year,local_month,local_day);
      //alert("Artikelinformation: "+week_information[0]+"-"+week_information[1]+"\n Woche: "+articleview_year+"-"+articleview_calendarweek);
      if (local_year == articleview_year && week_information == articleview_calendarweek) {
        articleview_display = 
          articleview_display + "<h2><a href=" +
          articleview_content_2[i][3] + " target=_blank>" +
          articleview_content_2[i][1] + "</a></h2><p>" +
          articleview_content_2[i][2] + " - Süddeutsche Zeitung - " +
          articleview_keyword_2 + "</p><p>" +
          articleview_content_2[i][4];
      }
    }
  }
  //UX-Verbesserung bei fehlenden Artikeln:
  if (articleview_display == "") {
    var display_week = articleview_calendarweek;
    articleview_display = "<h2>In Kalenderwoche "+(display_week)+" des Jahres "+articleview_year+" gab es keine Artikel zum Thema "+articleview_keyword;
    if (articleview_keyword_2 != "") {
      articleview_display = articleview_display+" und "+articleview_keyword_2;
    }
    articleview_display = articleview_display+".</h2>"
  }
  document.getElementById('articleview').innerHTML = articleview_display;
}

function kalenderWoche(j,m,t) {
  var Datum = new Date();
  if (!t) {
    j = Datum.getYear(); if (1900 > j) j +=1900;
    m = Datum.getMonth(); t = Datum.getDate();
  }
  else m--;
  Datum = new Date(j,m,t,0,0,1);
  var tag = Datum.getDay(); if (tag == 0) tag = 7;
  var d = new Date(2004,0,1).getTimezoneOffset();
  var Sommerzeit = (Date.UTC(j,m,t,0,d,1) - Number(Datum)) /3600000;
  Datum.setTime(Number(Datum) + Sommerzeit*3600000 - (tag-1)*86400000);
  var Jahr = Datum.getYear(); if (1900 > Jahr) Jahr +=1900;
  var kw = 1;
  if (new Date(Jahr,11,29) > Datum) {
    var Start = new Date(Jahr,0,1);
    Start = new Date(Number(Start) + 86400000*(8-Start.getDay()));
    if(Start.getDate() > 4) Start.setTime(Number(Start) - 604800000);
    kw = Math.ceil((Datum.getTime() - Start) /604800000);
  }
  return kw;
}

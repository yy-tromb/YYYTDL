let reason = "Error";

function doGet(e) {
  var htmlOutput = HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("YYYTDL ver.0.3.0b - improved UI")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
  return htmlOutput;
}

function getYT(ytURL) {
  if (ytURL === undefined) {
    return err("No URL");
  } else if (startsWith(ytURL, "http") === false) {
    return err("This isn't URL");
  }
  const domain = ytURL.split("://")[1].split("/")[0];
  if( startsWith(domain, "music.youtube.com") === true ){
    ytURL="https://www.youtube.com/"+ytURL.split("://")[1].split("/")[1];
    return err("This isn't YouTube (This App isn't yet get from YT Music)");
  }else if (
    startsWith(domain, "youtu.be") === true ||
    startsWith(domain, "www.youtube.com") === true ||
    startsWith(domain, "m.youtube.com") === true
  ) {
    const res = UrlFetchApp.fetch(ytURL);
    const htmltext = res.getContentText();
    const fixedhtml = htmltext.split("var ytInitialPlayerResponse = null;")[1];
    const ytInitiScript = fixedhtml
      .split("var ytInitialPlayerResponse = ")[1]
      .split(";</script>")[0];
    const ytIniti = JSON.parse(ytInitiScript);
    const streamingData = ytIniti.streamingData;
    const { formats, adaptiveFormats } = streamingData;
    const ytdata = JSON.stringify({
      formats: formats,
      adaptiveFormats: adaptiveFormats,
      objectKeys:Object.keys(streamingData)
    });
    //Logger.log(ytdata);
    let output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(ytdata); // return response-data
    return ytdata;
  } else {
    return err("This isn't YT");
  }
}

function err(why) {
  let errobj={error:why};
  let errjson=JSON.stringify(errobj);
  return errjson;
}

function test(){
  Logger.log(getYT("https://www.youtube.com/watch?v=cpk9ghEYiOI"));
  Logger.log(getYT("https://music.youtube.com/watch?v=5_-TcIOxm60&list=OLAK5uy_l8fQyUWZfOO25E9HeDeeJCIDm0tsxwguc"));
}

function errTest(){
  Logger.log(err("Test tEst teSt tesT"));
}

function mime() {
  console.log(ContentService.MimeType);
}

//Tools

function startsWith(target, pattern) {
  return target.indexOf(pattern) === 0;
}

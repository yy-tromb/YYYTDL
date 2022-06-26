let reason = "Error";

function doGet(e) {
  var htmlOutput = HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("YYYTDL ver.0.1")
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
    ytURL="https://www.youtube.com/"+ytURL. ytURL.split("://")[1].split("/")[1];
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
    });
    let output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(ytdata); // return response-data
    return ytdata;
  } else {
    return err("This isn't YT");
  }
}

function err(why) {
  reason = why;
  let htmlOutput = HtmlService.createTemplateFromFile("error")
    .evaluate()
    .setTitle("YYYTDL ver.0.1 -Error")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
  return htmlOutput.getContent();
}

function cause() {
  return reason;
}

function mime() {
  console.log(ContentService.MimeType);
}

//Tools

function startsWith(target, pattern) {
  return target.indexOf(pattern) === 0;
}

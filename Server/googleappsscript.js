function doGet(e) {
    const dataSheetName = "data"; // 데이터 시트 이름
    const logSheetName = "log"; // 로그 시트 이름
    
    // CORS 헤더 추가 (모든 출처에서 접근 허용)
    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({message: 'Hello World'}));
    output.appendHeader('Access-Control-Allow-Origin', '*');  // 모든 출처 허용
    output.appendHeader('Access-Control-Allow-Methods', 'GET, POST');  // 허용하는 HTTP 메소드
    output.appendHeader('Access-Control-Allow-Headers', 'Content-Type');  // 허용하는 HTTP 헤더
    
    return output;
  }
  
  function getLoginLogs() {
    const logSheetName = "log"; // 로그 시트 이름
    const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(logSheetName);
    
    const logRange = logSheet.getDataRange();
    const logValues = logRange.getValues();
    
    let logs = [];
    
    // 로그 시트에서 데이터를 추출
    for (let i = 1; i < logValues.length; i++) {
      let logEntry = {
        eventId: logValues[i][0],
        eventDate: logValues[i][1],
        eventTime: logValues[i][2],
        username: logValues[i][3],
        eventType: logValues[i][4],
        comment: logValues[i][5]
      };
      logs.push(logEntry);
    }
  
    const response = {
      logs: logs
    };
    
    // CORS 헤더 추가
    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify(response));
    output.appendHeader('Access-Control-Allow-Origin', '*');  // 모든 출처 허용
    output.appendHeader('Access-Control-Allow-Methods', 'GET, POST');  // 허용하는 HTTP 메소드
    output.appendHeader('Access-Control-Allow-Headers', 'Content-Type');  // 허용하는 HTTP 헤더
  
    return output;
  }
  
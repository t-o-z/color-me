function myFunction() {

    // 情報設定    
    var spreadsheet = SpreadsheetApp.openById('/* シートID */');
    var sheet = spreadsheet.getSheetByName('/* シート名 */');
    var domain = 'https://example.com/'; /* URL */

    var newLine = "\r\n";
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange('A2:D' + lastRow);
    var groups = range.getValues();
    var html = 'var _html = (function(){/*' + newLine;
    html += '<ul id="side_navi02" class="cdd_menu flexnav flexnav-show">' + newLine;
    
    var baseLink = '<a href="' + domain + '?mode=grp&amp;gid=%s">%s</a>';
    var name = 0;
    var id = 1;
    var level = 2;
    var isClose = false;
    for(var i = 0; i < groups.length; i++){
      var temp = '';
      // 閉じタグ
      if(groups[i-1] != undefined){
        // 1階層UP
        if(groups[i-1][level] == (groups[i][level] + 1)){
          // 現在1で前が2の時
          if(groups[i][level] == 1){
            temp += '    </ul>' + newLine;
            temp += '</li>' + newLine;
          }
          if(groups[i][level] == 2){
            // 現在2で前が3の時
            temp += '            </ul>' + newLine;
            temp += '        </li>' + newLine;
          }
          if(groups[i][level] == 3){
            // 現在3で前が4の時
            temp += '                    </ul>' + newLine;
            temp += '                </li>' + newLine;
          }
        }
        // 2階層UP
        if(groups[i-1][level] == (groups[i][level] + 2)){
          // 現在1で前が3の時
          if(groups[i][level] == 1){
            temp += '            </ul>' + newLine;
            temp += '        </li>' + newLine;
            temp += '    </ul>' + newLine;
            temp += '</li>' + newLine;
          }
          if(groups[i][level] == 2){
            // 現在2で前が4の時
            temp += '                    </ul>' + newLine;
            temp += '                </li>' + newLine;
            temp += '            </ul>' + newLine;
            temp += '        </li>' + newLine;          
          }
        }
      }
  
      // 第一階層開始
      if(groups[i+1] != undefined && groups[i][level] == 1){
        if(groups[i+1][level] != groups[i][level]){
          // 子階層があれば閉じずにdropdownクラスを付与する
          temp += '<li class="cdd_menu-dropdown">' + newLine;
          temp += '    ' + Utilities.formatString(baseLink,groups[i][id],groups[i][name]) + newLine;
          temp += '    <ul>' + newLine;
        }else{
          // 子階層なし
          temp += '<li>' + Utilities.formatString(baseLink,groups[i][id],groups[i][name]) + '</li>' + newLine;
        }
      }
      
      // 第二階層開始
      if(groups[i+1] != undefined && groups[i][level] == 2){
  
        if(groups[i+1][level] == (groups[i][level] + 1)){
          // 子階層があれば閉じずにdropdownクラスを付与する
          temp += '        <li class="cdd_menu-dropdown">' + newLine;
          temp += '            ' + Utilities.formatString(baseLink,groups[i][id],groups[i][name]) + newLine;
          temp += '            <ul>' + newLine;
        }else{
          // 子階層なし
          temp += '        <li>' + Utilities.formatString(baseLink,groups[i][id],groups[i][name]) + '</li>' + newLine;
        }
      }    
      
      // 第三階層開始
      if(groups[i+1] != undefined && groups[i][level] == 3){
        if(groups[i+1][level] == (groups[i][level] + 1)){
          // 子階層があれば閉じずにdropdownクラスを付与する
          temp += '                <li class="cdd_menu-dropdown">' + newLine;
          temp += '                    ' + Utilities.formatString(baseLink,groups[i][id],groups[i][name]) + newLine;
          temp += '                    <ul>' + newLine;
        }else{
          // 子階層なし
          temp += '                <li>' + Utilities.formatString(baseLink,groups[i][id],groups[i][name]) + '</li>' + newLine;
        }      
      }
      
      // 第四階層開始
      if(groups[i+1] != undefined && groups[i][level] == 4){
        temp += '                        <li>' + Utilities.formatString(baseLink,groups[i][id],groups[i][name]) + '</li>' + newLine;
      }    
          
      // 最後の項目のみ第一階層開始処理に埋もれてしまうので固定で出力
      if(i == groups.length -1){
        temp += '<li>' + Utilities.formatString(baseLink,groups[i][id],groups[i][name]) + '</li>' + newLine;
      }
      html += temp;
    }
    html += '<\/ul>' + newLine;
    html += '*/}).toString().match(/[^]*\\/\\*([^]*)\\*\\/\\}$/)[1];' + newLine;
    html += '$("#side_menu").append(_html);' + newLine;
    outputFile(html);
  }
  
  function outputFile(text){
   // 定数
    var fileName = "side_menu.js";
    var contentType = "text/html";
    var charSet = "EUC-JP"; // カラーミー はEUC。
  
    // SJISなBlobに変換
    var blob = Utilities.newBlob("", contentType, fileName).setDataFromString(text, charSet);
  
    // Blobをファイルに出力（GoogleDriveのマイドライブにfileNameで出力）
    DriveApp.createFile(blob);
  }
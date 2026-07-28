/**
 * ============================================================================
 * MindEcho AI — Google Apps Script for User Registration & Click Tracking
 * ============================================================================
 * Автоматически сохраняет клики, тарифы и регистрацию (ID, Имя, Email, Телефон, Адрес)
 * Авто-создание новой вкладки каждые 100 записей
 * ============================================================================
 */

const MAX_ROWS = 100;

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheets()[ss.getSheets().length - 1];

    if (sheet.getLastRow() >= (MAX_ROWS + 1)) {
      const nextBatch = ss.getSheets().length + 1;
      sheet = ss.insertSheet(`Логи (Партия ${nextBatch})`);
      createHeader(sheet);
    } else if (sheet.getLastRow() === 0) {
      createHeader(sheet);
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.event_type || 'Клик',
      data.user_id || 'GUEST',
      data.user_name || '-',
      data.email || '-',
      data.phone || '-',
      data.address || '-',
      data.auth_provider || '-',
      data.plan_name || '-',
      data.price || 0,
      data.language || 'ru',
      data.user_agent || '-'
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function createHeader(sheet) {
  const headers = [
    'Дата и Время', 
    'Тип События', 
    'ID Пользователя', 
    'Имя Пользователя', 
    'Email / Логин', 
    'Телефон', 
    'Адрес / Локация', 
    'Способ Входа (Google/Apple/Email)', 
    'Тариф / Контекст', 
    'Цена ($)', 
    'Язык', 
    'Устройство (User Agent)'
  ];

  sheet.appendRow(headers);
  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground('#2563EB').setFontColor('#FFFFFF').setFontWeight('bold');
}

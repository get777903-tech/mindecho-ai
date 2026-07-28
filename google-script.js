/**
 * ============================================================================
 * MindEcho AI 2026 — Google Apps Script с автоматической нумерацией вкладок
 * ============================================================================
 * Авто-создание НОВОЙ ВКЛАДКИ с цифрами каждые 100 строк!
 * Данные НИКОГДА не стерутся, каждая 100-ка сохраняется в отдельный лист:
 * - "100+ Записей (Партия 1)"
 * - "100+ Записей (Партия 2)"
 * - "100+ Записей (Партия 3)" ... и так далее.
 * ============================================================================
 */

const MAX_ROWS = 100; // Лимит строк на 1 вкладку

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheets = ss.getSheets();
    let currentSheet = sheets[sheets.length - 1];

    // Если в текущем листе уже 100+ записей — авто-создаем НОВЫЙ ЛИСТ с нумерацией
    if (currentSheet.getLastRow() >= (MAX_ROWS + 1)) {
      const batchNumber = sheets.length + 1;
      const newSheetName = `100+ Записей (Партия ${batchNumber})`;
      currentSheet = ss.insertSheet(newSheetName);
      createHeader(currentSheet);
    } else if (currentSheet.getLastRow() === 0) {
      createHeader(currentSheet);
    }

    const data = JSON.parse(e.postData.contents);

    currentSheet.appendRow([
      data.timestamp || new Date().toLocaleString('ru-RU'),
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
    'Дата и Время', 'Тип События', 'ID Пользователя', 'Имя Пользователя', 
    'Email / Логин', 'Телефон', 'Адрес / Локация', 'Способ Входа', 
    'Тариф / Контекст', 'Цена ($)', 'Язык', 'Устройство'
  ];

  sheet.appendRow(headers);
  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground('#2563EB').setFontColor('#FFFFFF').setFontWeight('bold');
}

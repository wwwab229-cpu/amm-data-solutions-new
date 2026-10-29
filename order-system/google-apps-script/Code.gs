/**
 * AMM Data Solutions — free master order-request form bootstrap.
 * Run createAmmOrderSystem() once from a Google Apps Script project owned by AMM.
 * Creates one Google Form, a linked response spreadsheet, review-tracking columns,
 * and a spreadsheet submit trigger. It does NOT confirm orders or send quotes.
 */
const AMM_ORDER_FORM_TITLE = 'AMM Data Solutions — Project & Order Request';
const AMM_TRACKING_HEADERS = ['AMM Review Status','AMM Internal Notes','AMM Quote (USD)','AMM Confirmation Sent At'];

function createAmmOrderSystem() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('AMM_ORDER_FORM_ID') || props.getProperty('AMM_ORDER_SHEET_ID')) {
    throw new Error('AMM order system appears to exist already. Check Script Properties to avoid duplicate forms.');
  }
  const form = FormApp.create(AMM_ORDER_FORM_TITLE);
  form.setDescription('Tell AMM Data Solutions about your project. This form submits an enquiry/request only; it is not an order confirmation. AMM will review the details and contact you to discuss scope, starting estimate, final quote and timeline before work begins.')
    .setConfirmationMessage('Thank you. Your request has been received for review. This is not an order confirmation. AMM Data Solutions will review the information and contact you about the next steps.')
    .setCollectEmail(false).setLimitOneResponsePerUser(false).setShowLinkToRespondAgain(false).setProgressBar(true);

  form.addSectionHeaderItem().setTitle('1. Contact details').setHelpText('Please provide contact details so AMM can follow up about your request.');
  form.addTextItem().setTitle('Full name').setRequired(true);
  form.addTextItem().setTitle('Contact email').setRequired(true).setValidation(
    FormApp.createTextValidation().requireTextIsEmail().setHelpText('Enter a valid email address.').build());
  form.addTextItem().setTitle('Business or organisation (optional)').setRequired(false);
  form.addTextItem().setTitle('Country / region').setRequired(true);
  form.addListItem().setTitle('Preferred language').setChoiceValues(['English','Roman Urdu','Hindi','Arabic','Other']).setRequired(true);

  form.addPageBreakItem().setTitle('2. Choose your AMM service');
  form.addListItem().setTitle('Which service are you interested in?').setChoiceValues([
    'Digital Advertising','Data Management & Data Entry','Website Design & Digital Solutions',
    'AI Chatbots & Customer Support','AI & Business Automation','Google SEO & AI Search Visibility',
    'Not sure — please recommend a suitable service'
  ]).setRequired(true);
  form.addTextItem().setTitle('Project or website link (optional)').setRequired(false);
  form.addParagraphTextItem().setTitle('What do you want to achieve?').setHelpText('Describe the problem, goal, or work you need help with.').setRequired(true);
  form.addParagraphTextItem().setTitle('Required features, tasks, or deliverables').setHelpText('List the most important requirements. You can write in your preferred language.').setRequired(true);
  form.addParagraphTextItem().setTitle('Current tools, platforms, or workflow (optional)').setHelpText('For example: website platform, spreadsheets, advertising platforms, or existing software.').setRequired(false);

  form.addPageBreakItem().setTitle('3. Budget, timing & references');
  form.addListItem().setTitle('Estimated budget (USD, optional)').setChoiceValues(['Under $50','$50–$149','$150–$299','$300–$599','$600+','Not decided yet']).setRequired(false);
  form.addListItem().setTitle('When would you like to start?').setChoiceValues(['As soon as practical','Within 1–2 weeks','Within a month','Flexible / exploring']).setRequired(true);
  form.addParagraphTextItem().setTitle('Reference links or examples (optional)').setHelpText('Add links to websites, files, examples, or inspiration. Do not include passwords or confidential credentials.').setRequired(false);
  form.addParagraphTextItem().setTitle('Anything else AMM should know? (optional)').setRequired(false);
  form.addCheckboxItem().setTitle('Consent to follow-up').setChoiceValues(['I agree that AMM Data Solutions may use these details to review this request and contact me about it.']).setRequired(true);

  const spreadsheet = SpreadsheetApp.create('AMM Data Solutions — Order Requests');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
  SpreadsheetApp.flush();
  const responseSheet = findResponseSheet_(spreadsheet);
  if (!responseSheet) throw new Error('Form and spreadsheet were created, but the response tab was not ready. Wait briefly, then run finishAmmOrderSystem().');
  ensureTrackingColumns_(responseSheet);
  ScriptApp.newTrigger('onAmmOrderFormSubmit').forSpreadsheet(spreadsheet).onFormSubmit().create();
  props.setProperty('AMM_ORDER_FORM_ID', form.getId());
  props.setProperty('AMM_ORDER_SHEET_ID', spreadsheet.getId());
  Logger.log('ORDER FORM (share with clients): ' + form.getPublishedUrl());
  Logger.log('EDIT FORM (keep private): ' + form.getEditUrl());
  Logger.log('ORDER TRACKER: ' + spreadsheet.getUrl());
}

function finishAmmOrderSystem() {
  const props = PropertiesService.getScriptProperties();
  const formId = props.getProperty('AMM_ORDER_FORM_ID');
  const sheetId = props.getProperty('AMM_ORDER_SHEET_ID');
  if (!formId || !sheetId) throw new Error('No saved AMM form/sheet IDs found. Run createAmmOrderSystem() first.');
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const responseSheet = findResponseSheet_(spreadsheet);
  if (!responseSheet) throw new Error('Could not locate the Google Forms response tab.');
  ensureTrackingColumns_(responseSheet);
  const exists = ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'onAmmOrderFormSubmit');
  if (!exists) ScriptApp.newTrigger('onAmmOrderFormSubmit').forSpreadsheet(spreadsheet).onFormSubmit().create();
  Logger.log('ORDER FORM: ' + FormApp.openById(formId).getPublishedUrl());
  Logger.log('ORDER TRACKER: ' + spreadsheet.getUrl());
}

function onAmmOrderFormSubmit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  ensureTrackingColumns_(sheet);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const statusCol = headers.indexOf('AMM Review Status') + 1;
  const row = e.range.getRow();
  if (statusCol > 0 && row > 1 && !sheet.getRange(row, statusCol).getValue()) sheet.getRange(row, statusCol).setValue('Pending review');
}

function findResponseSheet_(spreadsheet) {
  return spreadsheet.getSheets().find(sheet => {
    const lastCol = sheet.getLastColumn();
    if (lastCol < 1 || sheet.getLastRow() < 1) return false;
    return sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0].some(h => /^timestamp$/i.test(String(h).trim()));
  }) || null;
}

function ensureTrackingColumns_(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
  AMM_TRACKING_HEADERS.forEach(header => {
    if (!headers.includes(header)) {
      const nextCol = sheet.getLastColumn() + 1;
      sheet.getRange(1, nextCol).setValue(header);
      headers.push(header);
    }
  });
}

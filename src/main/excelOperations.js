const ExcelJS = require('exceljs');

const toBase64 = (buffer) => {
  return btoa(
    buffer.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
};

const uploadImages = ({ columns, rows, worksheet, workbook }) => {
  let datas = rows;
  Object.keys(datas).forEach((key, rowIndex) => {
    if (
      JSON.stringify(Object.keys(datas[key])) !==
      JSON.stringify(Object.values(rows))
    ) {
      Object.values(columns).forEach((tag, columnIndex) => {
        if (!Object.keys(datas[key]).includes(tag)) {
          worksheet.getImages().forEach(({ range, imageId }) => {
            if (columnIndex === range.tl.col && rowIndex + 1 === range.tl.row) {
              const img = workbook.model.media.find((m) => m.index === imageId);
              datas = {
                ...datas,
                [key]: { ...datas[key], [tag]: toBase64(img.buffer) },
              };
            }
          });
        }
      });
    }
  });
  return datas;
};

const indexColumns = (worksheet) => {
  let tags = {};

  worksheet
    .getRow(1)
    .eachCell(({ value, col }) => (tags = { ...tags, [col]: value }));
  return tags;
};

const prepareRows = (worksheet, columns) => {
  let datas = {};

  worksheet.eachRow((row) => {
    row.eachCell(
      ({ value, row, col }) =>
        (datas = { ...datas, [row]: { ...datas[row], [columns[col]]: value } })
    );
  });
  delete datas[1];
  return datas;
};

export const readExcelData = async (path) => {
  const workbook = new ExcelJS.Workbook();
  const data = await workbook.xlsx.readFile(path);
  const worksheet = workbook.worksheets[0];

  const columns = indexColumns(worksheet);
  const rows = prepareRows(worksheet, columns);
  const updatedRows = uploadImages({ columns, rows, worksheet, workbook });
  return updatedRows;
};

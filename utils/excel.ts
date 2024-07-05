import XLSX from 'xlsx';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { getStoragePermission } from './tools';

export const exportDataToExcel = async (fileName: string) => {
  await getStoragePermission();
  const data = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 28 },
    { name: 'Jim', age: 35 },
  ];

  // 将数据转换为工作表
  const ws = XLSX.utils.json_to_sheet(data);

  // 创建工作簿并将工作表添加进去
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // 使用 XLSX.write() 生成Excel文件内容
  const wbout = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  // 构建文件路径
  const path = `${ReactNativeBlobUtil.fs.dirs.LegacySDCardDir}/${fileName}.xlsx`;
  // console.log(excelNode());
  // console.log(wbout);
  console.log(wbout.length);
  // 将Excel文件内容写入到文件
  ReactNativeBlobUtil.fs
    .writeFile(path, Array.from(wbout), 'ascii')
    .then(() => {
      console.log(`File written to ${path}`);
    })
    .catch(error => {
      console.error(error.message, path);
    });
};

const excelNode = () => {
  const wb = new Workbook(); // excel4node Workbook

  const sheet1 = new Sheet(wb, {
    name: 'sheet1',
  });

  sheet1.addColumns([
    {
      label: 'Names',
      name: 'names',
      style: null, // excel4node styles for registers cells
      styleHeader: wb.createStyle({
        // excel4node styles for headers cells
        alignment: {
          horizontal: 'center',
        },
      }),
      children: [
        {
          label: 'First Name',
          name: 'first_name',
          width: 40,
        },
        {
          label: 'Last Name',
          name: 'last_name',
          width: 30,
          style: wb.createStyle({
            font: {
              bold: true,
            },
          }),
        },
      ],
    },
    {
      label: 'Score',
      name: 'score',
      style: wb.createStyle({
        alignment: {
          horizontal: 'center',
        },
        fill: {
          type: 'pattern',
          patternType: 'solid',
          bgColor: '#00ff00',
          fgColor: '#00ff00',
        },
        font: {
          bold: true,
          color: '#ffffff',
        },
      }),
      styleHeader: wb.createStyle({
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
      }),
      width: 20,
    },
  ]);

  sheet1.registers = [
    { first_name: 'Lionel', last_name: 'Messi', score: 22 },
    { first_name: 'Maria', last_name: 'Smith', score: 31 },
    { first_name: 'Alex', last_name: 'Hansen', score: 14 },
    { first_name: 'Anna', last_name: 'Garcia', score: 23 },
  ];

  sheet1.write();

  return wb.writeToBuffer();
};

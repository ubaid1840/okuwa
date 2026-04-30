import * as XLSX from "xlsx";

const exportToExcel = (data, filename) => {
  // Step 1: Create a new workbook and a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Step 2: Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "data");

  // Step 3: Export the workbook to a file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export default exportToExcel;
import xlsx from 'xlsx';

export const readLocalFile = file => {
  const result = [];
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = event => {
      const data = event.target.result;
      const workbook = xlsx.read(data, { type: 'binary' });
      workbook.SheetNames.forEach(sheet => {
        const rowObject = xlsx.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
        rowObject.map(item => {
          result.push({
            title: item.TEN_TOUR || '',
            tour_id: parseInt(item.TOUR_ID) || 0,
            thumbnail_url: item.ANH_THUMB || '',
            price: parseInt(item.GIA_TOUR) || 0,
            time_travel: item.THOI_GIAN_DI || '',
            tour_code: '',
            number_of_seats: 0,
            vehicle: item.PHUONG_TIEN || '',
            overview_text: '',
            list_image_url: item.ANH_THUMB || '',
          });
        });
      });
      resolve(result);
    };
    fileReader.onerror = reject;
  });
};

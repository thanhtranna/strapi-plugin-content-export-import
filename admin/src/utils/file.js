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
      console.log('debug 01');
      workbook.SheetNames.forEach(sheet => {
        console.log('inside foreach');
        const dataTest = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        console.log("dataTest", dataTest);

        const rowObject = xlsx.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
        console.log('inside foreach');

        const mapTourId = new Map();

        rowObject.map(item => {
          console.log('item', item);
          let images = [];
          if (item.ANH_GALLERY.length > 0) {
            const imagesGallery = item.ANH_GALLERY.split(',');
            for (let index = 0; index < imagesGallery.length; index++) {
              const element = imagesGallery[index];
              images.push(`https://fiditour.com${element}`)
            }
          }
          const tourId = parseInt(item.TOUR_ID);
          if (tourId > 0 && !mapTourId.has(tourId)) {
            result.push({
              title: item.TEN_TOUR || '',
              tour_id: tourId || 0,
              thumbnail_url: item.ANH_THUMB || '',
              price: parseInt(item.GIA_TOUR.replace(',', '')) || 0,
              time_travel: item.THOI_GIAN_DI || '',
              tour_code: tourId,
              number_of_seats: 0,
              vehicle: item.PHUONG_TIEN || '',
              overview_text: item.NOIDUNG || '',
              list_image_url: JSON.parse(JSON.stringify(Object.assign({}, images))),
              rules_file: item.DIEU_KHOAN || '',
              schedule_file: item.CHUONG_TRINH_TOUR || '',
              price_and_include_file: item.GIA_VA_BAO_GOM || '',
              to_destination: item.DIEM_DEN || '',
            });
          } else {
            console.log(`tour_id ${tourId} has exist`);
          }
        });
      });
      resolve(result);
    };
    fileReader.onerror = reject;
  });
};

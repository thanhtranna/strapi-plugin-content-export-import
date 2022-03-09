import xlsx from "xlsx";

import { getNationalDestinations } from "./contentApis";

export const readLocalFile = (file) => {
  const result = [];
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (event) => {
      const data = event.target.result;
      const workbook = xlsx.read(data, { type: "binary" });
      console.log("debug 01");
      const nationalDestinations = await getNationalDestinations();
      workbook.SheetNames.forEach((sheet) => {
        console.log("inside foreach");
        const rowObject = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
        if (rowObject && !rowObject.length) {
          console.log("rowObject length = 0");
          return result;
        }
        console.log("inside foreach");

        const mapTourId = new Map();
        for (const element of rowObject) {
          console.log('typeof element', typeof element);
          console.log('element', element);
          let images = [];
          if (element.ANH_GALLERY.length > 0) {
            const imagesGallery = element.ANH_GALLERY.split(",");
            for (let index = 0; index < imagesGallery.length; index++) {
              const item = imagesGallery[index];
              images.push(`https://fiditour.com${item}`);
            }
          }
          const tourId = parseInt(element.TOUR_ID);
          const nationalDestination = findNameInArray(element.DIEM_KHOI_HANH, nationalDestinations);
          console.log('nationalDestination', nationalDestination);
          if (tourId > 0 && !mapTourId.has(tourId)) {
            result.push({
              title: element.TEN_TOUR || "",
              tour_id: tourId || 0,
              thumbnail_url: element.ANH_THUMB || "",
              price: parseInt(element.GIA_TOUR.replace(",", "")) || 0,
              time_travel: element.THOI_GIAN_DI || "",
              tour_code: tourId,
              number_of_seats: 0,
              vehicle: element.PHUONG_TIEN || "",
              overview_text: element.NOIDUNG_NGAN || "",
              list_image_url: JSON.parse(
                JSON.stringify(Object.assign({}, images))
              ),
              rules_file: element.DIEU_KHOAN || "",
              schedule_file: element.CHUONG_TRINH_TOUR || "",
              price_and_include_file: element.GIA_VA_BAO_GOM || "",
              from_destination: element.DIEM_KHOI_HANH || "",
              to_destination_name: element.DIEM_DEN || "",
              departure_date: element.NGAY_KHOI_HANH || "",
            });
          } else {
            console.log(`tour_id ${tourId} has exist`);
          }
        }
      });
      resolve(result);
    };
    fileReader.onerror = reject;
  });
};

const findNameInArray = (name, arr) => {
  return arr.find(data => data.name == name);
}
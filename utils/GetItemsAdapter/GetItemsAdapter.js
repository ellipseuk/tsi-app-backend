import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GetItemsAdapter {
  static API_URL = "https://services.tsi.lv/schedule/api/service.asmx/GetItems";

  async fetchAndSaveData() {
    try {
      const response = await axios.get(GetItemsAdapter.API_URL);

      let cleanData = response.data.trim();
      if (cleanData.startsWith("(") && cleanData.endsWith(")")) {
        cleanData = cleanData.slice(1, -1);
      }
      const parsedData = JSON.parse(cleanData);
      const rawData = JSON.parse(parsedData.d);

      const transformSection = (section) =>
        Object.entries(section).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      const transformedData = {
        teachers: rawData.teachers ? transformSection(rawData.teachers) : {},
        groups: rawData.groups ? transformSection(rawData.groups) : {},
        rooms: rawData.rooms ? transformSection(rawData.rooms) : {},
      };

      const dataDir = path.join(__dirname, "data");

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(dataDir, "teachers.json"),
        JSON.stringify(transformedData.teachers, null, 2),
        "utf-8"
      );
      fs.writeFileSync(
        path.join(dataDir, "groups.json"),
        JSON.stringify(transformedData.groups, null, 2),
        "utf-8"
      );
      fs.writeFileSync(
        path.join(dataDir, "rooms.json"),
        JSON.stringify(transformedData.rooms, null, 2),
        "utf-8"
      );

      console.log(`Reference data saved to: ${dataDir}`);
    } catch (error) {
      console.error(`Error fetching or saving reference data: ${error.message}`);
    }
  }
}

export default GetItemsAdapter;

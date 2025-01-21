import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TSIDataInterpreter {
  constructor() {
    this.dataCache = {};
  }

  async getData(type) {
    if (this.dataCache[type]) {
      return this.dataCache[type];
    }

    const filenameMap = {
      teachers: "teachers.json",
      groups: "groups.json",
      rooms: "rooms.json",
    };

    if (!filenameMap[type]) {
      throw new Error(`Invalid data type: ${type}`);
    }

    const filePath = path.join(__dirname, "GetItemsAdapter", "data", filenameMap[type]);
    this.dataCache[type] = JSON.parse(await fs.readFile(filePath, "utf-8"));
    return this.dataCache[type];
  }

  async getTeacherByID(id) {
    const teachers = await this.getData("teachers");
    return teachers[id] || null;
  }

  async getGroupByID(id) {
    const groups = await this.getData("groups");
    return groups[id] || null;
  }

  async getRoomByID(id) {
    const rooms = await this.getData("rooms");
    return rooms[id] || null;
  }

  async getTeacherIDByName(name) {
    const teachers = await this.getData("teachers");
    for (const [id, teacherName] of Object.entries(teachers)) {
      if (teacherName === name) {
        return id;
      }
    }
    return null;
  }

  async getGroupIDByName(name) {
    const groups = await this.getData("groups");
    for (const [id, groupName] of Object.entries(groups)) {
      if (groupName === name) {
        return id;
      }
    }
    return null;
  }

  async getRoomIDByName(name) {
    const rooms = await this.getData("rooms");
    for (const [id, roomName] of Object.entries(rooms)) {
      if (roomName === name) {
        return id;
      }
    }
    return null;
  }
}

export default TSIDataInterpreter;

// How to use

// (async () => {
//   const interpreter = new TSIDataInterpreter();

//   try {
//     const room = await interpreter.getRoomByID("24"); // <- Should be string
//     console.log("Room name:", room); // Must return 601
//     const roomID = await interpreter.getRoomIDByName("601");
//     console.log("Room ID:", roomID); // Must return 24
//   } catch (error) {
//     console.error(`Error retrieving room by ID: ${error.message}`);
//   }
// })();

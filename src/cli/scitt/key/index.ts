import generate from "./generate";
import exportKey from "./export";
import diagnose from "./diagnose";

const key = { generate, export: exportKey, diagnose }

export default key
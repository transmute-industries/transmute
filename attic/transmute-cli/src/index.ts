import echo from "./echo/echo";

// TODO ADD TEST FOR TS ENV FILES HERE... 
export class TransmuteCLI {
  echo = echo;
}

const instance = new TransmuteCLI();

export default instance;

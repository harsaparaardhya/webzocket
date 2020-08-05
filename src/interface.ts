interface config {
    roomId: string;
    production: boolean;
}

interface message {
  destination: string;
  key: string;
  value: any;
}

interface receiver {
    key: string;
    callback: (a: any) => void;
}

export { config , message , receiver };

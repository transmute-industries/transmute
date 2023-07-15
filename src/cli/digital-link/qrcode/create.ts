
import qrcode from 'qrcode-terminal';

/*
npm run transmute -- digital-link qrcode create \
--url https://status-list.vc
*/

interface RequestQrCode {
  url: string
}

const create = async (argv: RequestQrCode) => {
  qrcode.generate(argv.url);
}

export default create
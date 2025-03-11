import { Permit } from "permitio";
const TOKEN = process.env.PERMIT_TOKEN;

const permit = new Permit({
  // you'll have to set the PDP url to the PDP you've deployed in the previous step
  pdp: "http://localhost:7766",
  // pdp: "https://cloudpdp.api.permit.io",
  token: TOKEN,
});

export default permit;

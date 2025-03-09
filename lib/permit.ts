import { Permit } from "permitio";

const permit = new Permit({
  // you'll have to set the PDP url to the PDP you've deployed in the previous step
  pdp: "http://localhost:7766",
  // pdp: "https://cloudpdp.api.permit.io",
  token:
    "permit_key_bOzV24UvRQW5TVnaaDYUWFm67ixUSa3vFCGFcjJgyYbjqfZgERnfzYQ6eFvcUwRel9gFo2EVX5GPAVBYfrUEjR",
});

export default permit;

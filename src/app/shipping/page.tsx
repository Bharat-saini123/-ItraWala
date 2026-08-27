import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Shipping Information — ItraWala" };

export default function ShippingPage() {
  return <LegalPage eyebrow="Delivered with care" title="Shipping Information" intro="Every bottle is packed carefully from our shop in Narnaul, Haryana and sent across India." sections={[
    { title: "Processing time", content: "Orders are usually packed and dispatched within 1-2 business days after payment confirmation. Orders placed on Sundays or public holidays are processed on the next business day." },
    { title: "Delivery timelines", content: "Most Indian orders arrive within 3-7 business days after dispatch. Remote locations may take a little longer. Delivery estimates are indicative and can be affected by weather, courier delays, public holidays, or an incomplete address." },
    { title: "Shipping charges", content: "Shipping is free for orders of ₹999 or more. A flat shipping fee of ₹79 applies to orders below ₹999. The final shipping charge is shown at checkout before you pay." },
    { title: "Tracking and delivery", content: "Once your order is dispatched, we will share available tracking details by email or phone. Please ensure someone is available to receive the package and inspect it for visible damage before accepting delivery." },
    { title: "Address changes and delays", content: "Contact us as soon as possible if your address needs to be changed. We cannot guarantee changes after dispatch. If a package is returned because of an incorrect or incomplete address, re-shipping charges may apply." },
  ]} />;
}
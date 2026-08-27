import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Returns & Refunds — ItraWala" };

export default function ReturnsPage() {
  return <LegalPage eyebrow="Our return promise" title="Returns & Refunds" intro="Because fragrance products are personal-use items, we keep returns focused on products that arrive damaged, incorrect, or defective." sections={[
    { title: "Eligibility", content: "Please contact us within 48 hours of delivery if you receive a damaged, leaking, defective, or incorrect item. The product must be unused, with its original packaging, labels, and invoice. Opened or used fragrance products cannot be returned for change of mind or preference." },
    { title: "How to request a return", content: `Email ${process.env.ADMIN_EMAIL ?? ""} with your order number, a short description of the issue, and clear photographs or an unboxing video where available. Our team will review the request and share the next steps, normally within 2 business days.` },
    { title: "Replacement or refund", content: "For an approved issue, we will offer a replacement subject to availability or a refund for the affected product. Refunds are sent to the original payment method after the return is received and checked. Bank or payment-provider processing times may vary." },
    { title: "Damaged deliveries", content: "If the outer package is visibly damaged, please take photographs before opening and mention the damage to the delivery partner. If the item is damaged inside, keep all packaging until we confirm the resolution." },
    { title: "Non-returnable items", content: "Gift cards, personalised items, clearance items marked final sale, and products damaged after delivery through improper storage or handling are not eligible for return. Shipping charges are not refundable unless the error was ours." },
  ]} />;
}
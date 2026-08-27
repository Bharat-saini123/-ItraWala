import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Terms of Service — ItraWala" };

export default function TermsPage() {
  return <LegalPage eyebrow="Please read" title="Terms of Service" intro="These terms explain the simple rules that apply when you browse ItraWala or place an order with us." sections={[
    { title: "Using our website", content: "You agree to provide accurate information, keep your account credentials confidential, and use this website lawfully. We may suspend access where an account is being misused or used for fraudulent activity." },
    { title: "Products and fragrance", content: "We work to show accurate product descriptions, photographs, sizes, and prices. Fragrance can develop differently on different skin and product colour may vary slightly between batches. Product availability is subject to stock." },
    { title: "Orders and payment", content: "An order is accepted once we send an order confirmation. We may contact you to verify details or cancel an order when an item is unavailable, pricing is clearly incorrect, or fraud is suspected. Prices include applicable taxes unless stated otherwise. Payment must be completed using an available payment method." },
    { title: "Intellectual property", content: "The ItraWala name, logo, photography, writing, and other website content belong to ItraWala or our licensors. You may not reproduce, modify, or use them commercially without written permission." },
    { title: "Changes and applicable law", content: "We may update these terms when our services or legal obligations change. The latest version will appear on this page. These terms are governed by the applicable laws of India, with disputes subject to the jurisdiction of the appropriate courts." },
  ]} />;
}
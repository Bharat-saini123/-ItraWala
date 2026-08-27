import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy — ItraWala" };

export default function PrivacyPolicyPage() {
  return <LegalPage eyebrow="Your privacy" title="Privacy Policy" intro="We respect your trust and collect only the information needed to provide a smooth, reliable shopping experience." sections={[
    { title: "Information we collect", content: "When you create an account, place an order, or contact us, we may collect your name, email address, phone number, delivery address, and order details. Payment information is handled by our payment partners and is not stored by ItraWala." },
    { title: "How we use your information", content: "We use your information to process and deliver orders, send order updates, provide customer support, prevent fraud, and improve our products and website. We may send promotional messages only where permitted, and you can opt out at any time." },
    { title: "Sharing and security", content: "We share relevant details only with trusted service providers such as delivery partners, payment processors, and technology providers who help us operate the store. We do not sell your personal information. We use reasonable safeguards, although no online service can guarantee absolute security." },
    { title: "Cookies and your choices", content: "Our website may use essential cookies and similar technologies to keep you signed in, remember your cart, and understand basic site usage. You may manage cookies through your browser settings, but some store features may not work correctly without essential cookies." },
    { title: "Your rights", content: "You may ask us to access, correct, or delete your personal information, subject to records we must retain for legal or business purposes. Email hello@itrawala.in for privacy requests and we will respond within a reasonable period." },
  ]} />;
}
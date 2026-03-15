import { useState } from "react";
import { ChevronDown, ChevronUp, Phone, Mail } from "lucide-react";

const faqs = [
  {
    question: "How can I reset my password?",
    answer:
      "Go to the login page and click on 'Forgot Password'. Follow the instructions sent to your email.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can contact our helpdesk using the phone number or email listed below.",
  },
  {
    question: "What are the support hours?",
    answer: "Our support team is available Monday to Friday from 9 AM to 6 PM.",
  },
  {
    question: "Where can I track my request status?",
    answer:
      "After submitting a request, you will receive a ticket ID via email to track your issue.",
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Support Center</h1>

        {/* FAQ Section */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index: number) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow p-5 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </div>

              {openIndex === index && (
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        {/* Helpdesk Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
          <p className="text-gray-600 mb-6">
            If your issue is not resolved through FAQs, contact our helpdesk.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a
              href="tel:+919876543210"
              className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:opacity-90"
            >
              <Phone size={18} />
              +91 98765 43210
            </a>

            <a
              href="mailto:support@example.com"
              className="flex items-center justify-center gap-2 border px-6 py-3 rounded-xl hover:bg-gray-100"
            >
              <Mail size={18} />
              support@example.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

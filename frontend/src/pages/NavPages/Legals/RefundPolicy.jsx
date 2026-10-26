import React from "react";
import { Helmet } from "react-helmet";

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-semibold text-[#5DC9DE] mb-2">{title}</h2>
    {children}
  </section>
);

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy - OPH Community</title>
        <meta name="description" content="Learn about OPH Community's refund policy, eligibility criteria, and refund processing procedures." />
      </Helmet>

      <div className="px-6 lg:px-10 xl:px-16 pt-32 pb-10 bg-black text-white min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-[#5DC9DE]">Refund Policy</h1>

          <p className="mb-6 text-gray-300">
            This Refund Policy sets out the terms and conditions governing the eligibility, processing, and issuance of refunds for payments made to OPH Community. It is intended to provide clear and transparent information regarding the circumstances in which refunds may or may not be issued.
            Refunds shall be processed in accordance with the applicable provisions of the Consumer Protection Act, 2019 (India) and other applicable laws and regulations.
          </p>

          <Section title="1. Scope">
            <p className="text-gray-300 mb-3">This Refund Policy applies uniformly to all payments made on the OPH Community platform, including but not limited to the Membership Fee, Song Registration Fee, Event/Competition participation fees, and any other fee that may be introduced by the Company from time to time (collectively, the "Fees"). The same conditions set out below govern refund eligibility regardless of which Fee has been paid.</p>
            <p className="text-gray-300 mb-3">This Policy applies to all services offered, booked, or purchased through our platform, website, mobile application, or physical offices. By engaging our services, you agree to be bound by the terms outlined herein.</p>
            <p className="text-gray-300">This Policy should be read together with our Terms & Conditions and Cancellation Policy.</p>
          </Section>

          <Section title="2. General Refund Conditions">
            <p className="text-gray-300 mb-3">The following conditions apply to every Fee paid on the Platform:</p>
            
            <p className="text-gray-300 mb-3"><strong>2.1 Verification-Related Refunds.</strong> Where an Artist's registration, submission, or participation cannot proceed due to an issue arising during ID or eligibility verification, the Artist may request a refund of the relevant Fee. Where such a refund is approved, 80% of the Fee will be refunded, with a 20% administrative/processing charge deducted and retained by the Company.</p>
            
            <p className="text-gray-300 mb-3"><strong>2.2 Early-Stage Refunds.</strong> Separately, a refund of 50% of the relevant Fee is available where both of the following conditions are met:</p>
            <ul className="list-disc ml-6 text-gray-300 space-y-1 mb-3">
              <li>The refund request is made within 2 (two) days of the date of payment; and</li>
              <li>The status of the relevant service, submission, or entry is still "Under Review" at the time of the request (i.e., it has not yet been approved to proceed).</li>
            </ul>
            
            <p className="text-gray-300 mb-3"><strong>2.3 No Refund Situations.</strong> No refund will be provided under any circumstance where:</p>
            <ul className="list-disc ml-6 text-gray-300 space-y-1 mb-3">
              <li>The request is made citing a mere change of mind</li>
              <li>The status of the relevant service, submission, or entry has already moved to "Approved" or beyond — even if the request is made within the 2-day window described in Section 2.2</li>
              <li>The request for the Section 2.2 route is made after 2 (two) days from the date of payment</li>
            </ul>
            
            <p className="text-gray-300"><strong>2.4 Grounds for Compulsory Refunds (Service Deficiencies)</strong> In accordance with Indian consumer laws, a 100% refund will be issued regardless of standard timelines if:</p>
            <ul className="list-disc ml-6 text-gray-300 space-y-1">
              <li><strong>Non-Delivery:</strong> The service is completely failed to be delivered by our business on the agreed date and time.</li>
              <li><strong>Deficiency in Service:</strong> The delivered service is significantly faulty, imperfect, delayed, or inadequate in quality compared to what was promised.</li>
              <li><strong>Unfair Trade Practice:</strong> Misleading claims or unannounced hidden charges were applied to the transaction.</li>
            </ul>
          </Section>

          <Section title="3. Refund Process">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>3.1</strong> To request a refund, the Artist must submit a request along with any supporting documents required by the Company to verify eligibility (e.g., proof of the verification issue, or details of the relevant submission/entry). Submission: All cancellation and refund requests must be submitted in writing via email to our support desk.</li>
              <li><strong>3.2</strong> Refund requests will be reviewed within 2–3 working days of submission of all required documents.</li>
              <li><strong>3.3</strong> Once a refund is approved, it will be initiated within 7–10 working days.</li>
              <li><strong>3.4</strong> As the Platform does not use a third-party payment gateway, all approved refunds will be processed via direct UPI/bank transfer to the same account/UPI ID used for the original payment.</li>
            </ul>
          </Section>

          <Section title="4. Non-Refundable Scenarios">
            <p className="text-gray-300 mb-3">Refunds will not be provided under the following circumstances:</p>
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>The service was successfully delivered in full compliance with the service agreement.</li>
              <li>The customer changes their mind or experiences a change of personal circumstances after the service has already commenced or been completed.</li>
              <li>Once the relevant status has reached "Approved"</li>
              <li>Where an Artist's account is suspended or terminated for breach of the Terms & Conditions (e.g., uploading prohibited Content, providing false information)</li>
            </ul>
          </Section>

          <Section title="5. Force Majeure (Unforeseen Events)">
            <p className="text-gray-300 mb-3">Neither party shall be held liable for failure or delay to perform obligations caused by acts of God, government regulations, natural disasters, strikes, or other events beyond reasonable control. In such cases:</p>
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>A rescheduling option will be prioritized.</li>
              <li>If rescheduling is impossible, a refund of unearned fees will be evaluated on a case-by-case basis.</li>
            </ul>
          </Section>

          <Section title="6. Your Rights Under Consumer Protection Law">
            <p className="text-gray-300">Nothing in this Refund Policy limits any right or remedy available to an Artist under the Consumer Protection Act, 2019, including the right to approach the appropriate consumer forum in case of an unresolved dispute.</p>
          </Section>

          <Section title="7. Contact Us">
            <p className="text-gray-300 mb-3">For any refund-related query, please contact our Grievance Officer:</p>
            <ul className="list-disc ml-6 text-gray-300 space-y-1">
              <li>Email: connect@ophcommunity.org</li>
              <li>Address: Mumbai, Maharashtra, India</li>
            </ul>
          </Section>
        </div>
      </div>
    </>
  );
};

export default RefundPolicy;

import React from "react";
import { Helmet } from "react-helmet";

// Section component for reusability
const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-semibold text-[#5DC9DE] mb-2">{title}</h2>
    {children}
  </section>
);

const CancellationPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cancellation Policy</title>
        <meta name="description" content="Understand our cancellation terms, refund eligibility, event policy, and how OPH handles service or account terminations." />
      </Helmet>

      <div className="px-6 lg:px-10 xl:px-16 pt-32 pb-10 bg-black text-white min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* <h1 className="text-4xl font-bold mb-6 text-[#5DC9DE]">Cancellation Policy</h1> */}

          <p className="mb-6 text-gray-300">
            This Cancellation Policy applies to your OPH Community membership and Platform account (collectively, the "Platform").
            This Policy sets out the terms and conditions applicable to the cancellation of your membership or Platform account, including the treatment of your profile, songs, and income following cancellation.
            Cancellations will be processed in accordance with this Policy and the applicable provisions of the Consumer Protection Act, 2019 (India) and other applicable laws.
          </p>

          {/* Section 1 */}
          <Section title="1. Scope of the Policy">
            <p className="text-gray-300">This policy applies to all services offered, booked, or purchased through our platform, website, mobile application, or physical offices. By engaging our services, you agree to be bound by the terms outlined herein.</p>
          </Section>

          {/* Section 2 */}
          <Section title="2. Cancellation by the Artist">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>An Artist may cancel their Membership at any time, without needing to provide a reason, by submitting a cancellation request through their personal portal or by writing to us at connect@ophcommunity.org.</li>
              <li>Cancellation of Membership is separate from a refund of any Fee paid. Whether a Fee is refundable is governed exclusively by our Refund Policy, and cancelling a Membership does not, by itself, entitle an Artist to a refund.</li>
            </ul>
          </Section>

          {/* Section 3 */}
          <Section title="3. Effect of Cancellation on Profile & Content">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>Upon cancellation, the Artist's profile and EPK will be taken down from the Platform.</li>
              <li>Songs that have already been released through the Platform will remain live on the streaming and video platforms (e.g., audio streaming services, YouTube) on which they were distributed, since the Artist's ownership of their work is unaffected by cancellation.</li>
              <li>Upon cancellation, the Artist shall not have the right to request removal or takedown of already-released songs from any streaming or video platform (including YouTube) on which such songs were distributed through the Platform, since the Company has also made an investment — including but not limited to marketing, promotion, and distribution support — toward the release of such songs.</li>
              <li>Following the cancellation date, revenue generated from such already-released songs shall be split 50% to the Artist and 50% to OPH Community, in recognition of the Company's continued distribution and promotional investment in these songs. This differs from the pre-cancellation arrangement, under which the Artist receives 100% of song revenue.</li>
            </ul>
          </Section>

          {/* Section 4 */}
          <Section title="4. Cancellation by the Customer">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>Standard Cancellation:</strong> Requests made 72 hours or more before the scheduled service start time will receive a 100% refund (minus any payment gateway processing fees).</li>
              <li><strong>Short-Notice Cancellation:</strong> Requests made between 24 and 72 hours before the scheduled service start time will incur a 50% cancellation fee.</li>
              <li><strong>Late Cancellation:</strong> Requests made less than 24 hours before the scheduled service start time are non-refundable.</li>
              <li><strong>No-Show Policy:</strong> If a customer is absent at the scheduled time of service without prior notice, no refund will be issued.</li>
            </ul>
          </Section>

          {/* Section 5 */}
          <Section title="5. Effect of Cancellation on Income & Withdrawals">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>An Artist will continue to receive any income earned up to and including the date of cancellation of their Membership, in full.</li>
              <li>Following the cancellation date, the Artist shall continue to receive 50% of any revenue generated from previously released songs, in accordance with Section 3.4. No other income or payout will be made to the Artist after the cancellation date except as expressly provided in this Policy.</li>
              <li>Artists are encouraged to withdraw any available balance in their portal before submitting a cancellation request.</li>
            </ul>
          </Section>

          {/* Section 6 */}
          <Section title="6. Force Majeure (Unforeseen Events)">
            <p className="text-gray-300 mb-3">Neither party shall be held liable for failure or delay to perform obligations caused by acts of God, government regulations, natural disasters, strikes, or other events beyond reasonable control. In such cases:</p>
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>A rescheduling option will be prioritized.</li>
              <li>If rescheduling is impossible, a refund of unearned fees will be evaluated on a case-by-case basis.</li>
            </ul>
          </Section>

          {/* Section 7 */}
          <Section title="7. Cancellation by the Company">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>The Company will not cancel an Artist's Membership solely on account of inactivity.</li>
              <li>The Company reserves the right to cancel an Artist's Membership at any time, with or without notice, where the Artist is found to have engaged in fraud, wrongdoing, or any breach of the Terms & Conditions. This is in addition to, and consistent with, the suspension/termination rights described in our Terms & Conditions.</li>
            </ul>
          </Section>

          {/* Section 8 */}
          <Section title="8. Re-Registration">
            <p className="text-gray-300">An Artist who has cancelled their Membership may register on the Platform again at any time in the future by completing the full sign-up process afresh — including submission of ID verification and payment of the applicable Membership Fee then in effect — as an entirely new registration. No cooling-off or waiting period applies before re-registration.</p>
          </Section>

          {/* Section 9 */}
          <Section title="9. Contact Us">
            <p className="text-gray-300 mb-3">For any cancellation-related query, please contact our Grievance Officer:</p>
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

export default CancellationPolicy;

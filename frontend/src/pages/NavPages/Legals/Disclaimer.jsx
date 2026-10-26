import React from "react";
import { Helmet } from "react-helmet";

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-semibold text-[#5DC9DE] mb-2">{title}</h2>
    {children}
  </section>
);

const Disclaimer = () => {
  return (
    <>
      <Helmet>
        <title>Disclaimer - OPH Community</title>
        <meta name="description" content="Read OPH Community's disclaimer regarding our services and legal compliance." />
      </Helmet>

      <div className="px-6 lg:px-10 xl:px-16 pt-32 pb-10 bg-black text-white min-h-screen">

        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-[#5DC9DE]">Disclaimer</h1>

          <p className="mb-6 text-gray-300">
            This Disclaimer applies to the OPH Community website and Artist Portal (collectively, the "Platform") and should be read together with our Terms & Conditions.
            The information provided by OPH Community ("Company," "we," "us," or "our") through ophcommunity.com, ophcommunity.in, and ophcommunity.org (collectively, the "Site") is provided for general informational purposes only.
            We make reasonable efforts to keep the Site accurate and up to date; however, we do not guarantee that the information will always be accurate, complete, reliable, or continuously available. Your use of the Site and reliance on its information is at your own risk.
            To the fullest extent permitted by applicable law, OPH Community shall not be liable for any loss or damage arising from your use of, or reliance on, the Site or its information. We do not guarantee specific results, opportunities, earnings, growth, reach, or other outcomes from using the Platform or Services.
          </p>

          <Section title="1. No Guarantee of Income, Success, or Outcome">
            <p className="text-gray-300">OPH Community does not guarantee that any Artist will earn a specific amount of income, achieve a particular level of success, reach a certain audience size, win any event or competition, or attain a specific Leaderboard rank. Any figures, examples, testimonials, or illustrations shared by the Company on the Platform or in its marketing are for illustrative purposes only and do not represent a promise or assurance of similar results for any individual Artist. An Artist's outcomes depend on multiple factors outside the Company's control, including audience response, market conditions, and the Artist's own creative work.</p>
          </Section>

          <Section title="2. Third Party - External Links">
            <p className="text-gray-300 mb-3">The Site may include links to third-party websites, services, or features. These external links are provided for convenience, but we do not control, verify, or guarantee the accuracy, reliability, availability, or content of those third-party websites.</p>
            <p className="text-gray-300">We are not responsible for any information, products, services, or transactions provided by third parties. Any interaction or transaction you have with a third-party website is at your own risk and subject to their own terms and policies.</p>
          </Section>

          <Section title="3. Discretionary Features">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>TV Release.</strong> Consideration for release of a song on television is entirely at the Company's discretion. Submission of a song does not guarantee approval or eventual TV release.</li>
              <li><strong>Leaderboard, KPI, Spotlight & Rewards.</strong> Rankings, Spotlight features, and any associated rewards are determined by the Company based on performance criteria that may be updated from time to time, at the Company's sole discretion, and do not constitute a guaranteed entitlement for any Artist.</li>
              <li><strong>Events & Competitions.</strong> Results of any virtual event or competition are determined in accordance with the specific rules published for that event and are final and binding, subject to applicable law.</li>
            </ul>
          </Section>

          <Section title="4. Testimonials">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>The Site may include testimonials from our users sharing their personal experiences and opinions. These experiences are unique to each individual and may not represent the experience of every user.</li>
              <li>We do not guarantee that you will achieve the same results or have the same experience.</li>
              <li>Testimonials shared on the Site may be provided in text, audio, or video and are reviewed before publication. They may be edited only to correct grammar, typing errors, or remove unnecessary details for brevity.</li>
              <li>The experiences and opinions shared in these testimonials belong solely to the individual users and do not represent the views or opinions of OPH Community.</li>
              <li><em>In simple terms: Every artist's journey is different, so results may vary from person to person.</em></li>
            </ul>
          </Section>

          <Section title="5. Third-Party Data & Analytics">
            <p className="text-gray-300">Analytics, streaming statistics, and other data displayed on the Platform are sourced from third-party platforms (such as YouTube, Instagram, and audio streaming services). OPH Community relies on the accuracy of data provided by these third parties and is not responsible for any delay, inaccuracy, or discrepancy originating from such external sources.</p>
          </Section>

          <Section title="6. Direct Dealings Between Artists">
            <p className="text-gray-300">The Platform enables Artists to connect and collaborate directly with one another. OPH Community is not a party to, and disclaims all responsibility for, the outcome, quality, or performance of any direct arrangement, collaboration, or transaction between Artists arising from a connection made through the Platform. Further detail is available in Section 9 of our Terms & Conditions.</p>
          </Section>

          <Section title="7. Errors & Omissions Disclaimer">
            <p className="text-gray-300">We make every reasonable effort to provide accurate and reliable information on the Site. However, errors or omissions may occur, and we do not guarantee that all information is complete, accurate, current, or suitable for every purpose. The information is provided "as is", without any express or implied guarantee. OPH Community is not responsible for any loss, damage, or consequences resulting from decisions or actions taken based on information provided on the Site.</p>
          </Section>

          <Section title="8. Not Professional Advice">
            <p className="text-gray-300 mb-3">Nothing on the Platform including any content, guidance, or communication from the Company constitutes legal, financial, tax, or professional career advice. Artists are responsible for obtaining independent professional advice, including in relation to income tax, GST, or other statutory obligations arising from income earned through the Platform.</p>
          </Section>

          <Section title="9. Guest Contributors Disclaimer">
            <p className="text-gray-300">The Site may include content from guest contributors. Any views or opinions expressed in such content are their own and do not necessarily represent the views of OPH Community, its employees, staff, or affiliates, unless explicitly stated otherwise.</p>
          </Section>

          <Section title="10. Accuracy of Content">
            <p className="text-gray-300">While we make reasonable efforts to keep information on the Platform accurate and up to date, OPH Community does not warrant that the Platform's content is free of errors, omissions, or typographical inaccuracies, and reserves the right to correct any such error at any time without prior notice.</p>
          </Section>

          <Section title="11. Logos & Trademarks Disclaimer">
            <p className="text-gray-300 mb-3">All third-party logos and trademarks displayed or mentioned on ophcommunity.com, ophcommunity.in, or ophcommunity.org belong to their respective owners.</p>
            <p className="text-gray-300">Their use on our Site does not mean that those owners endorse, sponsor, approve of, or are affiliated with OPH Community.</p>
          </Section>

          <Section title="12. Limitation of Liability">
            <p className="text-gray-300">This Disclaimer should be read together with the Disclaimers and Limitation of Liability provisions set out in Sections 12 and 13 of our Terms & Conditions, which apply in full to this page.</p>
          </Section>

          <Section title="13. Contact Us">
            <p className="text-gray-300 mb-3">For any questions regarding this Disclaimer, please contact us at:</p>
            <ul className="list-disc ml-6 text-gray-300 space-y-1">
              <li>OPH Community</li>
              <li>Mumbai, Maharashtra, India</li>
              <li>Email: connect@ophcommunity.org</li>
            </ul>
          </Section>
        </div>
      </div>
    </>
  );
};

export default Disclaimer;

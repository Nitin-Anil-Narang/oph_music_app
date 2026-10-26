import React from "react";
import { Helmet } from "react-helmet";

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-semibold text-[#5DC9DE] mb-2">{title}</h2>
    {children}
  </section>
);

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - OPH Community</title>
        <meta name="description" content="Read OPH Community's Terms and Conditions governing your use of the Platform." />
      </Helmet>

      <div className="px-6 lg:px-10 xl:px-16 pt-32 pb-10 bg-black text-white min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-[#5DC9DE]">Terms & Conditions</h1>

          <p className="mb-6 text-gray-300">
            These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("User," "Artist," or "you") and OPH Community, a business having its registered office in Mumbai, Maharashtra, India ("OPH Community," "Company," "we," "us," or "our").
            These Terms govern your access to and use of the OPH Community website, Artist Portal, and all related features, products, and services (collectively, the "Platform" or "Services"). Applies to all visitors, Users, Artists, and other persons who access or use the Platform. By accessing, registering with, or using the Platform or Services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            Before accessing or using the Platform, please read these Terms carefully. They set out the terms governing your use of the Platform, the Services provided by OPH Community, and the respective rights, obligations, and responsibilities of you and OPH Community.
            The Privacy Policy explains how OPH Community collects, uses, stores, protects, and discloses Personal Data and other information in connection with your access to and use of the Platform.
            By registering, accessing, or using the Platform, you acknowledge that you have read, understood, and agreed to these Terms and all applicable policies incorporated herein, including the Privacy Policy, Refund Policy, Cancellation Policy, Disclaimer, Cookie Policy, and any other expressly applicable policies or guidelines.
            If you do not agree to these Terms or applicable policies, you must not register for, access, or use the Platform or Services.
            If you have any questions or concerns regarding these Terms, you may contact us at connect@ophcommunity.org before using the Platform.
          </p>

          <Section title="1. Definitions">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>Platform</strong> means the OPH Community website, artist portal, and any associated mobile or web-based services operated by the Company.</li>
              <li><strong>Independent Artist</strong> means a User who creates, performs, or produces a song or musical work independently and who consequently holds 100% (full) ownership rights in such work.</li>
              <li><strong>Specialist Artist</strong> means a User who specializes in and contributes one specific component of a musical work and who holds ownership rights only in their individual contribution to that work.</li>
              <li><strong>Membership</strong> means the one-time, non-recurring registration undertaken by an Artist to access the Platform's services.</li>
              <li><strong>Content</strong> means any song, recording, video, image, profile information, biography, artwork, or other material uploaded by a User on the Platform.</li>
              <li><strong>Services</strong> means the features made available through the Platform, including artist search, EPK profiles, Leaderboard, song distribution, marketing support, analytics, TV release facilitation, and income withdrawal.</li>
            </ul>
          </Section>

          <Section title="2. Eligibility">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>You must be at least 18 (eighteen) years of age to independently register as an Artist on the Platform.</li>
              <li>Individuals below 18 years of age may register only with the explicit consent and involvement of a parent or legal guardian.</li>
              <li>By registering, you represent that all information provided by you is true, accurate, and complete, and that you have the legal right and authority to enter into this agreement.</li>
            </ul>
          </Section>

          <Section title="3. Account Registration & Artist Portals">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>3.1</strong> The Platform offers two distinct categories of Artist registration: Independent Artist Portal and Specialist Artist Portal.</li>
              <li><strong>3.2</strong> You must select the category that accurately reflects your role. The Company reserves the right to verify or re-categorize a registration where information appears inconsistent.</li>
              <li><strong>3.3</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must notify us immediately of any unauthorized use.</li>
              <li><strong>3.4</strong> The Company reserves the right to refuse, suspend, or terminate registration where information is found to be false or in violation of these Terms.</li>
            </ul>
          </Section>

          <Section title="4. Membership & Fees">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>Access to the Platform's core Services requires payment of a one-time, non-recurring Membership Fee at the time of registration.</li>
              <li>The Membership Fee is a one-time payment only. OPH Community does not charge any subscription fee, recurring fee, or annual renewal fee.</li>
              <li>Independent Artists may additionally register individual songs for a separate, per-song Song Registration Fee.</li>
              <li><strong>Payment Method:</strong> All fees are currently processed through direct UPI/bank transfer. Users are responsible for ensuring the accuracy of their bank/UPI details.</li>
              <li>All fees are subject to the terms set out in our separate Refund Policy and Cancellation Policy.</li>
            </ul>
          </Section>

          <Section title="5. Platform Services">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>Search & Direct Connect:</strong> The Platform enables Users to search for and directly connect with other Artists without any commission charged by the Company.</li>
              <li><strong>EPK Profiles:</strong> Artists may build a profile showcasing their work, story, and social media presence.</li>
              <li><strong>Leaderboard, KPI & Spotlight:</strong> Independent Artists may be ranked on a performance-based Leaderboard and may receive free rewards at the Company's sole discretion.</li>
              <li><strong>Release Calendar:</strong> Independent Artists may schedule an advance release date for a song.</li>
              <li><strong>Song Release & Distribution:</strong> Independent Artists may release songs through the Platform with distribution support across applicable platforms.</li>
              <li><strong>TV Release:</strong> Certain songs may be considered for release on television channels, subject to the Company's review and approval.</li>
              <li><strong>Analytics:</strong> Independent Artists will receive periodic analytics relating to their released songs, updated approximately every 2–5 days.</li>
              <li><strong>Events & Competitions:</strong> The Platform organizes virtual music competitions and events. Artists registered on the Platform receive a 50% discount on event participation fees.</li>
              <li><strong>Support:</strong> Artists may raise support requests via ticket, call, or chat through their personal portal.</li>
            </ul>
          </Section>

          <Section title="6. Specialist Artist — Additional Terms">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>Specialist Artists receive all Services described in Section 5 except Leaderboard, KPI, Spotlight, Release Calendar, Song Release, TV Release, and Analytics.</li>
              <li>A Specialist Artist may showcase up to two (2) songs on their profile from projects they have contributed to, at no additional cost.</li>
              <li>Specialist Artists may directly edit their own profile through their personal portal.</li>
            </ul>
          </Section>

          <Section title="7. Ownership, Intellectual Property & Content License">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>Independent Artists retain 100% ownership of all rights, title, and interest in any song or musical work they create and release through the Platform.</li>
              <li>Specialist Artists retain ownership of their individual creative contribution to any project they work on.</li>
              <li>Where a Specialist Artist showcases work from a collaborative project, they represent and warrant that they hold the necessary right, license, or permission from other contributing Artist(s).</li>
              <li>By uploading Content to the Platform, you grant OPH Community a limited, non-exclusive, royalty-free, revocable license to host, display, reproduce, and promote such Content for operating the Platform and your song's marketing and distribution.</li>
              <li>You retain full ownership and 100% of the revenue generated from your released work while your Membership is active, subject to the Cancellation Policy.</li>
              <li>Once a song has been released and distributed through the Platform, an Artist may not require the Company to remove or take down such song from any streaming or video platform.</li>
              <li>User confirms that the Content belongs to them or that they have the necessary rights to use it.</li>
              <li>By enabling YouTube Content ID for a release, you represent and warrant that you exclusively control 100% of the composition and master rights, and that the recording is a unique and original master.</li>
            </ul>
          </Section>

          <Section title="8. User Content & Conduct">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>You are solely responsible for the Content you upload to the Platform.</li>
              <li>You agree not to upload any Content that infringes intellectual property rights, is defamatory, obscene, false, misleading, or contains viruses or malware.</li>
              <li>The Company reserves the right to review, remove, or disable access to any Content that violates these Terms or applicable Indian law.</li>
              <li>Repeated or serious violations may result in suspension or termination of your account.</li>
            </ul>
          </Section>

          <Section title="9. Direct Dealings Between Artists">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>The Platform enables Artists to connect and collaborate directly with one another, without the Company acting as an agent or intermediary.</li>
              <li>Any collaboration or agreement entered into between Artists is a private arrangement solely between the concerned Artists.</li>
              <li>OPH Community bears no responsibility or liability for the performance, quality, or outcome of any direct arrangement between Artists.</li>
              <li>Artists are strongly encouraged to clearly document the terms of any direct collaboration before commencing work.</li>
            </ul>
          </Section>

          <Section title="10. Income, Withdrawals & Taxes">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>All income earned by an Artist through the Platform is displayed within their personal portal.</li>
              <li>Artists may withdraw their available income at any time, in any amount, with no minimum withdrawal threshold.</li>
              <li>The Company does not take any commission on income earned directly between Artists or from third-party platforms.</li>
              <li>Artists are solely responsible for determining, declaring, and paying any income tax, GST, TDS, or other statutory dues applicable to income earned through the Platform.</li>
              <li>The Company is not responsible for revenue fluctuations or policy changes made by third-party platforms.</li>
            </ul>
          </Section>

          <Section title="11. Suspension & Termination">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>11.1 Suspension or Termination by the Company:</strong> OPH Community may suspend, restrict, or terminate an Artist's account if the Artist breaches these Terms, provides false information, uploads prohibited Content, or engages in fraudulent or harmful conduct.</li>
              <li><strong>11.2 Termination by the Artist:</strong> An Artist may close or terminate their account at any time by following the applicable account-closure process.</li>
              <li><strong>11.3 Effect on Ownership and Income:</strong> Termination does not transfer ownership of the Artist's Content to OPH Community and does not extinguish income that has already been validly earned.</li>
              <li><strong>11.4 Previously Released Content:</strong> Termination does not automatically require OPH Community to remove songs that have already been released or distributed through third-party platforms.</li>
              <li><strong>11.5 Suspension Does Not Affect Existing Obligations:</strong> Suspension does not automatically cancel obligations that arose before the suspension.</li>
              <li><strong>11.6 Survival:</strong> Provisions relating to ownership, intellectual property, Content rights, payments, and liability shall survive termination.</li>
            </ul>
          </Section>

          <Section title="12. Disclaimers">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>12.1 Platform Provided on an "As Is" Basis:</strong> The Platform and Services are provided on an "as is" and "as available" basis. We do not guarantee that the Platform will always be available, uninterrupted, secure, accurate, or error-free.</li>
              <li><strong>12.2 No Guarantee of Specific Results:</strong> OPH Community does not guarantee any specific outcome, performance, opportunity, or financial result for any Artist, including ranking, visibility, revenue, or approval for TV release.</li>
              <li><strong>12.3 Third-Party Data and Services:</strong> OPH Community does not guarantee the accuracy or availability of information obtained from third-party platforms and is not responsible for inaccuracies or delays originating from those sources.</li>
              <li><strong>12.4 No Warranty Regarding Completeness or Accuracy:</strong> OPH Community disclaims all warranties and representations regarding the completeness, security, reliability, accuracy, or availability of the Platform or Services.</li>
              <li><strong>12.5 Artist's Own Expectations and Decisions:</strong> You acknowledge that your use of the Platform involves circumstances that may depend on factors outside OPH Community's control.</li>
              <li><strong>12.6 Limitations Required by Law:</strong> Nothing in this Section excludes any warranty or liability that cannot lawfully be excluded under applicable law.</li>
            </ul>
          </Section>

          <Section title="13. Limitation of Liability">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>13.1 Exclusion of Certain Damages:</strong> OPH Community shall not be liable for any indirect, incidental, special, punitive, or consequential damages arising out of or relating to these Terms or the Platform.</li>
              <li><strong>13.2 Overall Liability Cap:</strong> The total aggregate liability of OPH Community shall not exceed the total amount of Membership Fees and Song Registration Fees actually paid by the relevant Artist during the twelve (12) months preceding the claim.</li>
              <li><strong>13.3 Third-Party Platforms and Services:</strong> OPH Community shall not be responsible for losses arising from the acts or omissions of third-party platforms or service providers.</li>
              <li><strong>13.4 Artist's Own Conduct:</strong> OPH Community shall not be liable for any loss arising from an Artist's Content, representations, unlawful conduct, or breach of these Terms.</li>
              <li><strong>13.5 No Limitation of Non-Excludable Liability:</strong> Nothing in these Terms shall exclude any liability that cannot lawfully be excluded under applicable Indian law.</li>
              <li><strong>13.7 No Exclusion of Amounts Properly Payable:</strong> Nothing in this Section shall allow OPH Community to avoid paying any amount that is validly earned and expressly payable to an Artist.</li>
            </ul>
          </Section>

          <Section title="14. Indemnification">
            <p className="text-gray-300">You agree to indemnify and hold harmless OPH Community, its founders, employees, and representatives from any claim, loss, liability, or expense arising out of: (a) your breach of these Terms; (b) your Content or lack of rights therein; (c) your violation of any applicable law; or (d) any dispute between you and another Artist.</p>
          </Section>

          <Section title="15. Governing Law & Jurisdiction">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>15.1 Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of India.</li>
              <li><strong>15.2 Jurisdiction:</strong> Disputes shall be subject to the jurisdiction of the competent courts at Mumbai, Maharashtra, India.</li>
              <li><strong>15.3 Consumer Rights:</strong> Nothing in this Section shall restrict any statutory right of an Artist to approach a Consumer Commission or other competent forum.</li>
              <li><strong>15.4 No Waiver:</strong> Failure to enforce any right shall not constitute a waiver of that right.</li>
              <li><strong>15.5 Severability:</strong> If any provision is determined to be invalid, that provision shall be enforced to the maximum extent permitted by law.</li>
              <li><strong>15.6 Entire Agreement:</strong> These Terms, together with the Privacy Policy and other incorporated policies, constitute the entire agreement between you and OPH Community.</li>
              <li><strong>15.7 Continuing Effect:</strong> Provisions required to continue after termination shall remain effective.</li>
            </ul>
          </Section>

          <Section title="16. Amendments to These Terms">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>16.1 Right to Amend:</strong> OPH Community reserves the right to modify, update, or amend these Terms from time to time.</li>
              <li><strong>16.2 Notice of Material Changes:</strong> Where we make material changes, we may notify Users through the Platform, by email, or by another reasonable means.</li>
              <li><strong>16.3 User's Responsibility to Review:</strong> You are responsible for reviewing the Terms periodically.</li>
              <li><strong>16.4 Acceptance of Revised Terms:</strong> Your continued access to or use of the Platform after revised Terms become effective constitutes your acceptance of the revised Terms.</li>
              <li><strong>16.5 If You Do Not Agree:</strong> If you do not agree with any revised Terms, you should discontinue use of the Platform.</li>
            </ul>
          </Section>

          <Section title="17. Purchases">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>If you wish to purchase any product or service, you may be asked to supply information including your payment details and billing address.</li>
              <li>You represent and warrant that you have the legal right to use any card or payment method and that the information you supply is true and complete.</li>
              <li>We may employ third-party services for payment processing. By submitting your information, you grant us the right to provide it to these third parties.</li>
              <li>We reserve the right to refuse or cancel your order for reasons including product availability, errors, or suspected fraud.</li>
            </ul>
          </Section>

          <Section title="18. Contests, Sweepstakes and Promotions">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>Any contests, sweepstakes, or promotions made available through the Service may be governed by separate rules.</li>
              <li>If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy.</li>
              <li>You retain all rights to any Content you submit, and you are responsible for protecting those rights.</li>
              <li>By posting Content, you grant us the right and license to use, modify, publicly perform, display, reproduce, and distribute such Content.</li>
              <li>OPH Community has the right but not the obligation to monitor and edit all Content provided by users.</li>
            </ul>
          </Section>

          <Section title="19. Prohibited Uses">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>You may use the Service only for lawful purposes and in accordance with these Terms.</li>
              <li>You agree not to use the Service in any way that violates any applicable law, exploits minors, transmits spam, impersonates others, or infringes upon the rights of others.</li>
              <li>You agree not to use any robot, spider, or automatic device to access the Service, introduce viruses or malware, or attempt to gain unauthorized access to the Service.</li>
              <li>You agree not to attack the Service via denial-of-service attacks or take any action that may damage or falsify Company rating.</li>
            </ul>
          </Section>

          <Section title="20. Copyright Policy">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>We respect the intellectual property rights of others and have a policy to respond to any claim that Content posted on the Service infringes on the copyright or other intellectual property rights of any person or entity.</li>
              <li>If you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to connect@ophcommunity.org with the subject line: "Copyright Infringement".</li>
              <li>You may be held accountable for damages for misrepresentation or bad-faith claims on the infringement of any Content.</li>
            </ul>
          </Section>

          <Section title="21. DMCA Notice and Procedure for Copyright Infringement Claims">
            <p className="text-gray-300 mb-3">You may submit a notification pursuant to the Digital Millennium Copyright Act (DMCA) by providing our Copyright Agent with the following information in writing:</p>
            <ul className="list-disc ml-6 text-gray-300 space-y-1">
              <li>An electronic or physical signature of the person authorized to act on behalf of the copyright owner</li>
              <li>A description of the copyrighted work that you claim has been infringed, including the URL where it exists</li>
              <li>Identification of the URL or other specific location on the Service where the infringing material is located</li>
              <li>Your address, telephone number, and email address</li>
              <li>A statement that you have a good faith belief that the disputed use is not authorized by the copyright owner</li>
              <li>A statement, made under penalty of perjury, that the above information is accurate and that you are the copyright owner or authorized to act on their behalf</li>
            </ul>
            <p className="text-gray-300 mt-3">You can contact our Copyright Agent via email at connect@ophcommunity.org.</p>
          </Section>

          <Section title="22. Error Reporting and Feedback">
            <p className="text-gray-300">You may provide us with information and feedback concerning errors, suggestions for improvements, ideas, problems, complaints, and other matters related to our Service ("Feedback"). You acknowledge and agree that: (i) you shall not retain any intellectual property right in the Feedback; (ii) Company may have development ideas similar to the Feedback; (iii) Feedback does not contain confidential information; and (iv) Company is not under any obligation of confidentiality with respect to the Feedback. In the event the transfer of ownership to the Feedback is not possible due to applicable laws, you grant Company an exclusive, transferable, irrevocable, free-of-charge, sub-licensable, unlimited and perpetual right to use the Feedback in any manner.</p>
          </Section>

          <Section title="23. Links to Third-Party Websites and Services">
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li><strong>23.1 Third-Party Links:</strong> The Platform may contain links to third-party websites, platforms, or services that are not owned or controlled by OPH Community.</li>
              <li><strong>23.2 No Control or Responsibility:</strong> OPH Community does not control and is not responsible for the content, availability, accuracy, security, or privacy practices of any third-party website or service.</li>
              <li><strong>23.3 Third-Party Services:</strong> Your use of any third-party website or service is governed by that third party's own terms and policies.</li>
              <li><strong>23.4 No Liability for Third-Party Content:</strong> OPH Community shall not be responsible for any loss or damage arising from your access to or use of any third-party website or service.</li>
              <li><strong>23.5 Third-Party Availability and Changes:</strong> Third-party platforms may change, become unavailable, or modify their policies without notice.</li>
              <li><strong>23.6 Review Before Use:</strong> We strongly recommend that you read the Terms of Service and Privacy Policy of any third-party website before accessing or using it.</li>
            </ul>
          </Section>

          <Section title="24. Changes To Service">
            <p className="text-gray-300">We reserve the right to withdraw or amend our Service, and any service or material we provide via the Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Service is unavailable at any time or for any period.</p>
          </Section>

          <Section title="25. Waiver And Severability">
            <p className="text-gray-300">No waiver by Company of any term or condition set forth in these Terms shall be deemed a further or continuing waiver of such term or condition. If any provision of these Terms is held by a court to be invalid, illegal, or unenforceable, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions will continue in full force and effect.</p>
          </Section>

          <Section title="26. Acknowledgement">
            <p className="text-gray-300">By accessing, registering on, or using the OPH Community Platform or any Services provided by us, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions and all policies incorporated into them. If you do not agree with these Terms or any applicable policy, you must not access or use the Platform or Services.</p>
          </Section>

          <Section title="27. Communications">
            <p className="text-gray-300">By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at connect@ophcommunity.org.</p>
          </Section>

          <Section title="28. Contact Us">
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

export default TermsAndConditions;

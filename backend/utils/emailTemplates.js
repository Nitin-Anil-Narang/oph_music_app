/**
 * Email Templates for OPH Community
 */

const getEmailTemplate = (headerTitle, headerEmoji, content) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OPH Community</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; border-radius: 8px;">
              <tr>
                <td style="background: linear-gradient(135deg, #684C9C 0%, #8B6BB8 100%); padding: 30px 40px;">
                  <span style="font-size: 32px;">${headerEmoji}</span>
                  <span style="font-size: 22px; font-weight: 600; color: #ffffff; margin-left: 10px;">${headerTitle}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px 40px; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0; font-size: 14px; color: #333333;">
                    <strong style="color: #684C9C;">Regards,</strong><br/>
                    OPH Community<br/>
                    India's First Music Community Platform
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Event Booking Approved Email
const eventBookingApprovedEmail = (userName, transactionId, eventName) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hey ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Great news! Your booking for has been successfully approved. 🎶</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your place at the event is now confirmed, and you're one step closer to getting your music in front of the right audience.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR EVENT DETAILS:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            ${eventName ? `<tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Event:</td><td style="color: #555555; font-size: 14px;">${eventName}</td></tr>` : ""}
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Transaction ID:</td><td style="color: #555555; font-size: 14px;">${transactionId}</td></tr>
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Keep creating, keep performing, and keep showing the world what your music stands for.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Your stage is waiting. Go make it yours. ❤️</p>
  `;
  return getEmailTemplate("Your Event Booking Has Been Approved! 🕺", "🎉", content);
};

module.exports = {
  eventBookingApprovedEmail,
  getEmailTemplate
};


// Event Booking Rejected Email
const eventBookingRejectedEmail = (userName, transactionId, rejectReason, amount) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hey ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">We've reviewed your registration request. Unfortunately, your booking could not be approved at this time. There may be specific reasons for this decision.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR PAYMENT DETAILS:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Transaction Id:</td><td style="color: #555555; font-size: 14px;">${transactionId}</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #dc3545; font-size: 14px; font-weight: 600;">Declined</td></tr>
            ${rejectReason ? `<tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Reason:</td><td style="color: #555555; font-size: 14px;">${rejectReason}</td></tr>` : ""}
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Amount:</td><td style="color: #555555; font-size: 14px;">₹${amount}</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Don't worry. Kindly review the details and take the necessary action, if required.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Keep creating. Keep applying. Your next opportunity could be the one. 🎵</p>
  `;
  return getEmailTemplate("Update on Your Event Booking — Payment ⚠️", "⛔️", content);
};


// Date Booking Approved Email
const dateBookingApprovedEmail = (userName, transactionId, releaseDate) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hey ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your Blocked Release Date has officially been approved! 🎉 Your date is now secured with OPH Community.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR BOOKING DETAILS:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Released Date:</td><td style="color: #555555; font-size: 14px;">${releaseDate}</td></tr>
            ${transactionId ? `<tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Transaction ID:</td><td style="color: #555555; font-size: 14px;">${transactionId}</td></tr>` : ""}
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">While you're recording, creating, performing, or working on your next big move — We're here to support you every step of the way. Let's make this release unforgettable!</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Looking forward to seeing what you create next.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Your Song's Date Is Officially Locked! ❤️</p>
  `;
  return getEmailTemplate("📅 New Release Date Has Been Approved!", "📅", content);
};


// Song Registration Approved Email
const songRegistrationApprovedEmail = (userName, transactionId, songName) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hey ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your song is now officially registered with OPH Community. Thank you for trusting us with your Music.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR SONG STATUS:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            ${songName ? `<tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Song:</td><td style="color: #555555; font-size: 14px;">${songName}</td></tr>` : ""}
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Transaction Id:</td><td style="color: #555555; font-size: 14px;">${transactionId}</td></tr>
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Content & Payment:</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Your Song has successfully passed the content approval process, and your payment has also been approved!</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">You've taken an Important step towards your Music Goals. Your music deserves to be heard.🎶</p>
  `;
  return getEmailTemplate("🎙️ Your Song Is Officially Registered with OPH Community!", "🎵", content);
};

// Song Registration Rejected Email
const songRegistrationRejectedEmail = (userName, transactionId, rejectReason, amount) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hey ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">We've carefully reviewed the payment submitted for your song. Unfortunately, we weren't able to approve it at this time. Please check the reason provided below, make the necessary changes.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR PAYMENT DETAILS:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Transaction Id:</td><td style="color: #555555; font-size: 14px;">${transactionId}</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Payment Status:</td><td style="color: #dc3545; font-size: 14px; font-weight: 600;">Declined</td></tr>
            ${rejectReason ? `<tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Reason:</td><td style="color: #555555; font-size: 14px;">${rejectReason}</td></tr>` : ""}
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Amount:</td><td style="color: #555555; font-size: 14px;">₹${amount}</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Your song registration cannot move forward until the payment issue is resolved. Please review the payment details and resubmit the payment with the correct transaction ID to continue.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Don't let a small step hold back a big song. 🎵</p>
  `;
  return getEmailTemplate("Urgent Action Required: Song Registration Payment ⚠️", "⛔️", content);
};


// Special Artist Song Approved Email
const specialArtistSongApprovedEmail = (userName, transactionId, songName) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hey ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your Song has Successfully passed our review process and Officially Approved! 🎉</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR SONG STATUS:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            ${songName ? `<tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Song:</td><td style="color: #555555; font-size: 14px;">${songName}</td></tr>` : ""}
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Transaction Id:</td><td style="color: #555555; font-size: 14px;">${transactionId}</td></tr>
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Another milestone in your musical journey. Keep going — your sound deserves to be heard. ❤️</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Keep building your Music. Keep pushing your creativity. Keep being yourself.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Your music. Your identity. Your journey. 🎵</p>
  `;
  return getEmailTemplate("🎶 Your Song Is Officially Registered with OPH Community!", "🌟", content);
};

// Special Artist Song Payment Approved Email
const specialArtistSongPaymentApprovedEmail = (userName, transactionId, amount) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hey ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your Song Payment is Officially Approved! 🎉</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR PAYMENT DETAILS:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Transaction Id:</td><td style="color: #555555; font-size: 14px;">${transactionId}</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Amount:</td><td style="color: #555555; font-size: 14px;">₹${amount}</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">We've carefully reviewed the payment submitted for your song, and we're pleased to confirm that your payment has been successfully approved.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Thank you for choosing and being part of OPH Community.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Keep creating. Keep growing. 🎶</p>
  `;
  return getEmailTemplate("🎶 Your Specialist Song Payment Has Been Approved!", "✅", content);
};


// Payment Approved Email
const paymentApprovedEmail = (userName, transactionId, amount) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your one-time membership payment has been successfully approved! 🎉</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">This is more than just a payment confirmation — this is the beginning of your journey as a member of the OPH Community. ❤️</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR PAYMENT DETAILS:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Transaction ID:</td><td style="color: #555555; font-size: 14px;">${transactionId}</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Payment Status:</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">✅ Approved</td></tr>
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Amount:</td><td style="color: #555555; font-size: 14px;">₹${amount}</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">You've taken an important step toward being part of a community built for music artists — whether you're an Independent Artist or a Specialist Artist.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">From here, you can explore the opportunities, connections, and benefits available to you as an OPH Community member.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Thank you for trusting us and choosing to become a part of our music family. We're excited to have you with us. 🎵</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Welcome to the family. Your journey with OPH Community starts now. ❤️🎵</p>
  `;
  return getEmailTemplate("🎉 Welcome to the OPH Community Family!", "🎉", content);
};

// Payment Rejected Email
const paymentRejectedEmail = (userName, transactionId, rejectReason, amount) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">We're currently unable to confirm your membership payment. It may not have been received or may not yet be visible to us. Don't worry — this does not mean your membership has been rejected. ❤️</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">There may be an issue with the payment or transaction details. Please check the reason provided below, take the required action, and if the payment was not completed successfully, you can try again.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR PAYMENT DETAILS:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Transaction ID:</td><td style="color: #555555; font-size: 14px;">${transactionId}</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Payment Status:</td><td style="color: #dc3545; font-size: 14px; font-weight: 600;">Declined</td></tr>
            ${rejectReason ? `<tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Reason:</td><td style="color: #555555; font-size: 14px;">${rejectReason}</td></tr>` : ""}
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Amount:</td><td style="color: #555555; font-size: 14px;">₹${amount}</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">We want to make sure everything is in place so you can complete your membership and enjoy the benefits of being part of the OPH Community Family. 🎵</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Take care of the required step and try again when you're ready. We'll be happy to welcome you into the family. ❤️</p>
  `;
  return getEmailTemplate("Action Needed: Your Membership Payment Needs Attention ⚠️", "⚠️", content);
};


// Personal Details Approved Email
const personalDetailsApprovedEmail = (userName) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your Personal Details have been successfully reviewed and approved by OPH Community. 🎉</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">Your Verification Status</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Step:</td><td style="color: #555555; font-size: 14px;">Personal Details</td></tr>
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">One more important part of your artist profile is now complete. Your profile is taking shape, and every completed detail helps us understand the artist behind the music.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Keep going — you're building your artist journey one step at a time. ❤️</p>
  `;
  return getEmailTemplate("👤 Your Personal Details Have Been Approved!", "✅", content);
};

// Personal Details Rejected Email
const personalDetailsRejectedEmail = (userName, rejectReason) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">We've reviewed the personal details submitted to your OPH Community. So, the information could not be approved. Make the necessary changes, resubmit your details, and keep moving forward.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">Your Verification Status</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Step:</td><td style="color: #555555; font-size: 14px;">Personal Details</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #dc3545; font-size: 14px; font-weight: 600;">Declined</td></tr>
            ${rejectReason ? `<tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px; vertical-align: top;">Reason:</td><td style="color: #555555; font-size: 14px;">${rejectReason}</td></tr>` : ""}
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">You're simply another step toward completing your artist profile. 🎵</p>
  `;
  return getEmailTemplate("Your Personal Action Required: Update Your Personal Details", "👤", content);
};


// Professional Details Approved Email
const professionalDetailsApprovedEmail = (userName) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your professional details have been successfully reviewed and approved by OPH Community. One more important part of your artist profile is now complete. You're now one step closer to being complete.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">Your Verification Status</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Step:</td><td style="color: #555555; font-size: 14px;">Professional Details</td></tr>
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Your experience, work and journey — this is what makes your artist identity yours.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Keep building. Keep growing. Keep creating. ❤️</p>
  `;
  return getEmailTemplate("💼 Your Professional Details Have Been Approved!", "✅", content);
};

// Professional Details Rejected Email
const professionalDetailsRejectedEmail = (userName, rejectReason) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">We've reviewed the Professional details submitted to your OPH Community. So, the information could not be approved. Please review the feedback and make the required changes before resubmitting.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">Your Verification Status</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Step:</td><td style="color: #555555; font-size: 14px;">Professional Details</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #dc3545; font-size: 14px; font-weight: 600;">Declined</td></tr>
            ${rejectReason ? `<tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px; vertical-align: top;">Reason:</td><td style="color: #555555; font-size: 14px;">${rejectReason}</td></tr>` : ""}
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Every correction brings your profile one step closer to completion.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Keep going. Your journey is bigger than one review. 🎶</p>
  `;
  return getEmailTemplate("Your Professional Action Required: Update Your Professional Details", "💼", content);
};


// Documentation Details Approved Email
const documentationDetailsApprovedEmail = (userName) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your documentation details have been successfully reviewed and approved by OPH Community. Another important part of your artist profile is now complete. You're now one step closer to being complete.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">Your Verification Status</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Step:</td><td style="color: #555555; font-size: 14px;">Documentation Details</td></tr>
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Thank you for taking the time to complete your details and helping us keep the artist ecosystem genuine and reliable.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">One more step completed. Keep moving forward. ❤️</p>
  `;
  return getEmailTemplate("🪪 Your Documentation Details Have Been Approved!", "✅", content);
};

// Documentation Details Rejected Email
const documentationDetailsRejectedEmail = (userName, rejectReason) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">We've reviewed the Professional details submitted to your OPH Community. So, the information could not be approved. Please review the reason provided and submit the required information again.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">Your Verification Status</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Step:</td><td style="color: #555555; font-size: 14px;">Documentation Details</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #dc3545; font-size: 14px; font-weight: 600;">Declined</td></tr>
            ${rejectReason ? `<tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px; vertical-align: top;">Reason:</td><td style="color: #555555; font-size: 14px;">${rejectReason}</td></tr>` : ""}
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Don't let this step slow you down.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Fix it. Resubmit it. Keep moving. Your music journey continues. 🎵</p>
  `;
  return getEmailTemplate("Your Action Required: Update Your Documentation Details", "🪪", content);
};


// All Documents Verified Email
const allDocumentsVerifiedEmail = (userName) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Great news! All your submitted documents have been successfully verified. The verification process is now complete.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">Verification Status</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">👤 Personal Details</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">💼 Professional Details</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">🪪 Documentation</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 30px 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">What's Next? 🎵</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: #5DC9DE; font-size: 18px; font-weight: bold; margin-right: 10px;">•</span>
          <span style="color: #555555; font-size: 14px;">Explore your dashboard and access the features available to you.</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: #5DC9DE; font-size: 18px; font-weight: bold; margin-right: 10px;">•</span>
          <span style="color: #555555; font-size: 14px;">Upload your music and content and start building your artist presence.</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: #5DC9DE; font-size: 18px; font-weight: bold; margin-right: 10px;">•</span>
          <span style="color: #555555; font-size: 14px;">Join upcoming events and competitions and discover new opportunities.</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: #5DC9DE; font-size: 18px; font-weight: bold; margin-right: 10px;">•</span>
          <span style="color: #555555; font-size: 14px;">Connect with fellow artists and become part of the OPH music community. ❤️</span>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
      <tr>
        <td style="background-color: #e8f4f8; border-left: 4px solid #5DC9DE; padding: 15px 20px; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #684C9C; line-height: 1.6;">OPH Community is Happy to see you Onboard. Your journey has just begun. Keep creating, connecting, and growing with OPH Community.</p>
        </td>
      </tr>
    </table>
  `;
  return getEmailTemplate("💌 Your All Documents Have Been Successfully Verified!", "✅", content);
};

// Contact Form Confirmation Email
const contactFormConfirmationEmail = (name, email, phone, instagramHandle, description) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${name || "there"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">We've successfully received your message and our team will review it and get back to you within 24 hours.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">Your Submission Details:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Name:</td><td style="color: #555555; font-size: 14px;">${name}</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px;">Phone:</td><td style="color: #555555; font-size: 14px;">${phone}</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px;">Instagram ID:</td><td style="color: #555555; font-size: 14px;">${instagramHandle}</td></tr>
            ${description ? `<tr><td style="font-weight: 600; color: #333333; font-size: 14px; vertical-align: top;">Message:</td><td style="color: #555555; font-size: 14px;">${description}</td></tr>` : ""}
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 30px 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">What's Next?</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: #5DC9DE; font-size: 18px; font-weight: bold; margin-right: 10px;">•</span>
          <span style="color: #555555; font-size: 14px;">Our team will review your message and get back to you within 24 hours.</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: #5DC9DE; font-size: 18px; font-weight: bold; margin-right: 10px;">•</span>
          <span style="color: #555555; font-size: 14px;">Explore upcoming events and competitions and find opportunities to be part of something bigger.</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: #5DC9DE; font-size: 18px; font-weight: bold; margin-right: 10px;">•</span>
          <span style="color: #555555; font-size: 14px;">Connect with fellow artists and grow your music community.</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: #5DC9DE; font-size: 18px; font-weight: bold; margin-right: 10px;">•</span>
          <span style="color: #555555; font-size: 14px;">Start sharing your music and content with the OPH Community.</span>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
      <tr>
        <td style="background-color: #e8f4f8; border-left: 4px solid #5DC9DE; padding: 15px 20px; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #684C9C; line-height: 1.6;">This is just a Beginning of our First Connection ❤️ We're excited to have you. Your journey as a member of OPH Community starts here a place to create, connect, discover, get opportunities, and grow alongside other music artists.</p>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">If you have any questions or need help along the way, our support team is always here for you.</p>
  `;
  return getEmailTemplate("💙 OPH Community Received Your Message", "🌟", content);
};


// Forgot Password Email
const forgotPasswordEmail = (userName, resetLink) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Looks like you requested to reset your Portal Password. No worries—it happens to the best of us! 😊</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Click the button below to create a new password and get back to your account.</p>
    <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
      <tr>
        <td style="background: linear-gradient(135deg, #684C9C 0%, #8B6BB8 100%); border-radius: 8px; text-align: center;">
          <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">RESET PASSWORD</a>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">If you didn't request this password reset, you can safely ignore this email. This link will expire in 5 minutes, so be sure to reset it soon.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Need help? We're happy to assist - just reach out!</p>
  `;
  return getEmailTemplate("🔐 Reset Your OPH Community Password.", "🤗", content);
};

// Password Reset Success Email
const passwordResetSuccessEmail = (userName) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your OPH Community Artist Portal Password has been successfully reset.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td>
              <td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Password Reset Successful ✅</td>
            </tr>
            <tr>
              <td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Security Note:</td>
              <td style="color: #555555; font-size: 14px;">Your account is now ready to use with your new password.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">If you made this change, you're all set. If you didn't reset your password, please contact the OPH Community Admin Team immediately.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Stay secure. Keep creating. Keep your music live. ❤️</p>
  `;
  return getEmailTemplate("🗝️ Your Password Has Been Successfully Reset", "😊", content);
};

// Date Booking Rejected Email
const dateBookingRejectedEmail = (userName, transactionId, rejectReason, amount) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hey ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">We've reviewed your Date Booking Request. Unfortunately, the requested date could not be approved.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR PAYMENT DETAILS:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Transaction Id:</td><td style="color: #555555; font-size: 14px;">${transactionId}</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #dc3545; font-size: 14px; font-weight: 600;">Declined</td></tr>
            ${rejectReason ? `<tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Reason:</td><td style="color: #555555; font-size: 14px;">${rejectReason}</td></tr>` : ""}
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Amount:</td><td style="color: #555555; font-size: 14px;">₹${amount}</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">There may be a specific reason behind the decision. Please check the reason provided below to understand what happened and what you can do next.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Keep going. Your journey doesn't end with one unavailable date. 🎶</p>
  `;
  return getEmailTemplate("Update on Your Date Booking — Payment ⚠️", "⛔️", content);
};


// Special Artist Song Payment Rejected Email
const specialArtistSongPaymentRejectedEmail = (userName, transactionId, rejectReason, amount) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hey ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">We've completed the review of your song submitted. Unfortunately, the submission could not be approved at this time.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR PAYMENT DETAILS:</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Transaction Id:</td><td style="color: #555555; font-size: 14px;">${transactionId}</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Payment Status:</td><td style="color: #dc3545; font-size: 14px; font-weight: 600;">Declined</td></tr>
            ${rejectReason ? `<tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Reason:</td><td style="color: #555555; font-size: 14px;">${rejectReason}</td></tr>` : ""}
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Amount:</td><td style="color: #555555; font-size: 14px;">₹${amount}</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Go through the feedback below, make the required changes, and resubmit for another review if needed.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">A rejection is not the end of your journey. Take the feedback, keep improving, and come back stronger.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Your Music is still yours. Keep Hustling. 🎵</p>
  `;
  return getEmailTemplate("Update on Your Special Artist Song — Payment ⚠️", "⛔️", content);
};


// Income Withdrawal Approved Email
const incomeWithdrawalApprovedEmail = (userName, withdrawalId, amount) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Good news! Your income withdrawal request has been successfully reviewed and approved. 🕺</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">Your work created the value. Now it's time to receive it. ❤️</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR INCOME REQUEST</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Withdrawal ID:</td><td style="color: #555555; font-size: 14px;">${withdrawalId}</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #2DDA89; font-size: 14px; font-weight: 600;">Approved ✅</td></tr>
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Requested Amount:</td><td style="color: #555555; font-size: 14px;">₹${amount}</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">What you earn through your music, your work, and the opportunities you find through the OPH Community is an important part of your journey. We're happy to see you turning your talent and participation into real earnings.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">This is one of the many things that makes being part of the OPH Community special — create, connect, discover, get opportunities, grow, and earn along the way.💰</p>
  `;
  return getEmailTemplate("💰 Your Income Withdrawal Request Has Been Approved!", "💰", content);
};

// Income Withdrawal Rejected Email
const incomeWithdrawalRejectedEmail = (userName, withdrawalId, rejectReason, amount) => {
  const content = `
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #333333;">Hi ${userName || "Artist"},</p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">We've completed the review of your income withdrawal request. At this time, we're unable to approve it.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 25px 0;">
      <tr>
        <td style="padding: 25px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #684C9C;">YOUR INCOME REQUEST</p>
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Withdrawal ID:</td><td style="color: #555555; font-size: 14px;">${withdrawalId}</td></tr>
            <tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Status:</td><td style="color: #dc3545; font-size: 14px; font-weight: 600;">Declined ⚠️</td></tr>
            ${rejectReason ? `<tr style="border-bottom: 1px solid #e9ecef;"><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Reason:</td><td style="color: #555555; font-size: 14px;">${rejectReason}</td></tr>` : ""}
            <tr><td style="font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Requested Amount:</td><td style="color: #555555; font-size: 14px;">₹${amount}</td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 25px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Don't worry — this is just a step in the process. 100% always will stay yours.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Please review the reason provided and take the required action before submitting a new withdrawal request.</p>
    <p style="margin: 15px 0 0 0; font-size: 14px; color: #555555; line-height: 1.6;">Your journey continues, and we're here to help you keep moving forward. 🎵</p>
  `;
  return getEmailTemplate("💙 Update on Your Income Withdrawal Request", "💙", content);
};


module.exports = {
  contactFormConfirmationEmail,
  eventBookingApprovedEmail,
  eventBookingRejectedEmail,
  dateBookingApprovedEmail,
  dateBookingRejectedEmail,
  songRegistrationApprovedEmail,
  songRegistrationRejectedEmail,
  specialArtistSongApprovedEmail,
  specialArtistSongPaymentApprovedEmail,
  specialArtistSongPaymentRejectedEmail,
  paymentApprovedEmail,
  paymentRejectedEmail,
  personalDetailsApprovedEmail,
  personalDetailsRejectedEmail,
  professionalDetailsApprovedEmail,
  professionalDetailsRejectedEmail,
  documentationDetailsApprovedEmail,
  documentationDetailsRejectedEmail,
  allDocumentsVerifiedEmail,
  incomeWithdrawalApprovedEmail,
  incomeWithdrawalRejectedEmail,
  forgotPasswordEmail,
  passwordResetSuccessEmail,
  getEmailTemplate
};

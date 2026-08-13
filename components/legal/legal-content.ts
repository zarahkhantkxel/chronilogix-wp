/**
 * Content for the two legal pages: /privacy and /terms.
 *
 * Kept as data rather than JSX so both documents share one renderer
 * (`LegalDocument`) and one typographic treatment.
 *
 * ─────────────────────────────────────────────────────────────────────
 * PROVENANCE. This is client-supplied legal copy, transcribed here with
 * copy-editing only: grammar, punctuation, consistent entity naming,
 * and the removal of find-and-replace artifacts left over from the
 * source document it was adapted from. No clause was added, removed, or
 * reworded in substance.
 *
 * Section ids and labels are stable and mirror the numbering counsel
 * will cite (Privacy uses I–XII, Terms uses 1–17 with 2.1-style
 * subsections). Do not renumber without checking inbound links.
 *
 * Points that still need a decision from the business are listed in
 * `docs/legal-open-items.md`. NOT LEGAL ADVICE — counsel must review
 * before these pages are treated as final.
 * ─────────────────────────────────────────────────────────────────────
 */

/* A list item is either a plain string or a lead-in with nested bullets
   (the prohibited-use and data-collection lists both need one level). */
export type LegalListItem = string | { text: string; items: string[] };

export type LegalBlock =
  /* `text` supports two inline marks: **bold** and [label](href). */
  | { type: "para"; text: string }
  | { type: "list"; items: LegalListItem[]; ordered?: boolean }
  /* A set-off notice. `warn` is for the clauses that have to be
     conspicuous to be enforceable (arbitration, warranty disclaimer,
     liability cap); `affirm` is for commitments in the reader's
     favour, so the two never read as the same kind of statement. */
  | { type: "notice"; tone: "warn" | "affirm"; text: string }
  | { type: "defs"; items: { term: string; text: string }[] }
  /* A lettered or decimal subsection — A., B. in Privacy; 2.1, 2.2 in
     Terms. Rendered with its own anchor so `/terms#s-10-3` works. */
  | { type: "sub"; label: string; heading: string; blocks: LegalBlock[] }
  | { type: "address"; org: string; lines: string[]; email: string };

export type LegalSection = {
  id: string;
  /* The document's own numeral, not a render-time index — legal cites
     are to these, so they must survive reordering of the array.
     Omitted for an unnumbered preamble section. */
  label?: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  eyebrow: string;
  title: string;
  titleTail: string;
  intro: string;
  updated: string;
  /* Conspicuous notice rendered above section 1. Terms carries the
     read-before-you-use / arbitration warning here, which is where a
     reader is expected to meet it. */
  preamble?: { tone: "warn" | "affirm"; text: string };
  sections: LegalSection[];
};

const LAST_UPDATED = "April 20, 2026";

export const LEGAL_CONTACT = "support@chronilogix.com";

const ADDRESS = {
  org: "Chronilogix, Inc.",
  lines: ["35 Burrwood Common", "Fairfield, CT 06824"],
  email: LEGAL_CONTACT,
};

/* ══════════════════════════════════════════════════════════════════
   PRIVACY POLICY
   ══════════════════════════════════════════════════════════════════ */

export const PRIVACY_DOC: LegalDoc = {
  eyebrow: "Legal",
  title: "Privacy",
  titleTail: "Policy",
  intro:
    "How Chronilogix collects, uses, stores, processes, and protects your information — and, given the sensitivity of the data involved, what we do and do not do with it.",
  updated: LAST_UPDATED,
  sections: [
    {
      id: "overview",
      label: "I",
      heading: "Overview",
      blocks: [
        {
          type: "para",
          text: "Chronilogix, Inc. (“Chronilogix,” “we,” “us,” or “our”) is deeply committed to protecting and respecting your privacy when you use our website, [chronilogix.com](https://chronilogix.com) (the “Website”), our applications (the “Apps”), and our other related products, services, and features (collectively, the “Products” or “Services”). This Privacy Policy explains in detail how we collect, use, store, process, and protect your information.",
        },
        {
          type: "para",
          text: "By accessing, downloading, installing, or using our Products, you acknowledge that you have read and understood, and that you agree to, the practices described in this Privacy Policy. Given the sensitive nature of emotional wellness data and the artificial intelligence (“AI”) component of Chronilogix AI, we want to ensure you are fully informed about our data practices.",
        },
        {
          type: "para",
          text: "**Who we are (data controller).** Chronilogix is a company incorporated under the laws of the State of Delaware, and we are the data controller responsible for the processing of your personal data under this Privacy Policy.",
        },
        {
          type: "para",
          text: "**Scope of this policy.** This Privacy Policy applies to all information collected through your use of the Website, the Apps (including the Chronilogix AI emotional wellness coach), and any other related products, services, and features that link to or expressly reference this policy.",
        },
        {
          type: "para",
          text: "For any privacy-related question or concern, please contact us at [support@chronilogix.com](mailto:support@chronilogix.com).",
        },
      ],
    },

    {
      id: "information-we-collect",
      label: "II",
      heading: "Information we collect",
      blocks: [
        {
          type: "para",
          text: "We collect several categories of information from you in order to provide, maintain, and improve the Service.",
        },
        {
          type: "sub",
          label: "A",
          heading: "Information you provide directly",
          blocks: [
            {
              type: "list",
              items: [
                "**Account registration data.** During registration we primarily collect your phone number, which we use for account creation, secure login via one-time password (OTP), and account-related communications. You may also create a nickname and provide answers to standardized questionnaires that we use to personalize your experience within the App. We do not collect other personal identifiers for account creation — we do not ask for your full name, physical address, date of birth, or email address.",
                {
                  text: "**Interactions with Chronilogix AI (User Content).** When you interact with Chronilogix AI, our AI-powered emotional support companion, through text or voice, we collect and securely store your conversational data in order to provide the core Service. This includes:",
                  items: [
                    "Text chat transcripts.",
                    "Transcriptions of voice interactions.",
                  ],
                },
                "**Optional profile information.** You may choose to provide additional information to personalize your experience, such as specific emotional wellness goals or preferences.",
                "**Correspondence and support.** When you contact us for customer service or technical support, or when you submit feedback, we collect the content of your communications and any information you provide relating to your inquiry.",
                "**Payment information.** For in-app purchases, payment transactions are handled securely by Apple (App Store) and Google (Google Play Store) through their respective platforms. For website-based transactions, our third-party payment processor collects and processes payment details. Chronilogix does not collect, store, or process your credit or debit card information, or any other sensitive payment data, directly on our servers. We receive only transaction confirmation details from these payment processors.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "B",
          heading: "Information collected automatically",
          blocks: [
            {
              type: "para",
              text: "When you access and use Chronilogix AI, certain information is collected automatically through tracking technologies.",
            },
            {
              type: "list",
              items: [
                "**Usage data.** We collect information about how you interact with the Service, including the features you use, the duration of your sessions, the frequency of your use, and the content you view or engage with. This helps us understand user behavior and preferences.",
                "**Device information.** We collect data about the device you use to access Chronilogix AI, such as your operating system version, device type, unique device identifiers, and system performance data.",
                "**Limited location information.** We identify the country a user is in, based on the phone number extension used during registration or on IP address. We do not track your precise geographical location.",
                "**Technical log data.** As with most websites and applications, we gather certain data and store it in log files. This may include Internet Protocol (IP) address, browser type, internet service provider (ISP), referring and exit pages, operating system, date and time stamp, and clickstream data. We also collect error reports and crash data.",
                "**Mobile analytics data.** We use mobile analytics software to better understand how our mobile software functions on your phone, including how often you engage with the Products, what events occur within the Products, and aggregated usage and performance data. We may link this data to personal data you submit within the mobile application.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "C",
          heading: "Information from third parties",
          blocks: [
            {
              type: "list",
              items: [
                "**App store providers.** We receive basic transaction confirmation details and certain account information from Apple (App Store) and Google (Google Play Store) relating to your subscription and use of the App.",
                "**Social media services.** If you choose to connect your Chronilogix AI account with a social media account (for example, using Facebook or Google to create an account), we may access certain personal information that your privacy settings on that service allow us to access, such as your name and email address. Your interactions with social media features are governed by the privacy statement of the company providing them.",
                "**Payment processors.** As described above, we receive confirmation details — but not sensitive payment data — from our third-party payment processors.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "how-we-use-information",
      label: "III",
      heading: "How we use your information",
      blocks: [
        {
          type: "para",
          text: "We use the information we collect for the specific purposes set out below, relying in each case on an appropriate legal basis as required by applicable data protection regulation (for example, Article 6 of the GDPR).",
        },
        {
          type: "sub",
          label: "A",
          heading:
            "To provide and maintain the Service (performance of contract / legitimate interest)",
          blocks: [
            {
              type: "list",
              items: [
                "To deliver Chronilogix AI’s core functionality, including processing your conversational inputs to generate relevant AI Output.",
                "To manage your account, your subscription, and your access to the Service.",
                "To ensure the Service operates correctly and efficiently across devices and platforms.",
                "To answer your questions or requests for information, handle your complaints, and provide customer support.",
                "To carry out our obligations arising from any agreement between you and us.",
                "To allow you to participate in interactive features of the Products when you choose to do so.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "B",
          heading:
            "For product improvement and AI model training (legitimate interest / consent)",
          blocks: [
            {
              type: "list",
              items: [
                "To continuously train, refine, and improve the accuracy, safety, and performance of the models and algorithms underlying Chronilogix AI, and of other Chronilogix products and services.",
                "For this purpose we primarily use aggregated and de-identified User Content and interaction data. We employ robust anonymization and de-identification techniques so that data used for AI training does not directly identify you and cannot reasonably be reconstructed to identify you as an individual.",
                "To analyze emotional states and offer customized recommendations, so that the emotional well-being support Chronilogix AI provides is more personalized and more effective.",
                "To conduct research — using anonymized data only — into mental and emotional health trends, while preserving user privacy.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "C",
          heading: "For communication (legitimate interest / consent)",
          blocks: [
            {
              type: "list",
              items: [
                "To send you important service-related notices, such as updates, security alerts, and changes to Product features and content.",
                "To send you promotional communications, such as email newsletters and push notifications, where you have consented to receive them. You can opt out of promotional email by selecting “unsubscribe” at the bottom of any such message, or by emailing us at [support@chronilogix.com](mailto:support@chronilogix.com). Push notifications can be managed at the device level.",
                "To provide you with the SMS Service, if you have consented to receive SMS messages.",
                "If you are an existing customer, to contact you by electronic means — email or in-Product message — with information about products and services similar to those that were the subject of a previous sale to you, unless you opt out of such communications.",
                "To notify you about updates or changes to Product features and content.",
                "To invite you to take part in Product surveys, so we can better understand your needs and expectations.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "D",
          heading:
            "For safety, security, and fraud prevention (legitimate interest / legal obligation)",
          blocks: [
            {
              type: "list",
              items: [
                "To monitor for and prevent fraudulent or unauthorized activity, and to detect and address security incidents.",
                "To enforce our Terms and Conditions and our other policies.",
                "To protect the rights, property, or safety of Chronilogix, our customers, or others.",
                "To protect against unplanned downtime or errors in the Products.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "E",
          heading: "For analytics and research (legitimate interest)",
          blocks: [
            {
              type: "list",
              items: [
                "To understand your broad, non-specific geographic location, which helps us identify groups of users by general geographic market — such as ZIP code, state, or country.",
                "To understand how people use the Products, including through mobile analytics software and log files, so we can improve the user experience and present content effectively.",
                "To account for applicable sales taxes, based on the ZIP code provided to our payment processor for purchases made through the Website.",
                "To measure advertising effectiveness and to serve our advertisements to you through third-party platforms such as Facebook or Google, on other sites and apps or across your devices, to the extent you have consented to such use under applicable law.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "F",
          heading: "For legal and regulatory compliance (legal obligation)",
          blocks: [
            {
              type: "list",
              items: [
                "To comply with our legal obligations — for example, maintaining accurate financial records, responding to legal requests such as court orders, subpoenas, or bankruptcy proceedings, and cooperating with law enforcement authorities.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "G",
          heading: "In connection with business transfers (legitimate interest)",
          blocks: [
            {
              type: "list",
              items: [
                "In the event of a merger, acquisition, asset sale, or similar transaction, your data may be transferred to the prospective seller or buyer of the business or assets concerned, as part of due diligence or as part of the transaction itself.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "how-we-share-information",
      label: "IV",
      heading: "How we share your information",
      blocks: [
        {
          type: "notice",
          tone: "affirm",
          text: "Chronilogix does not sell your personal data, including sensitive User Content, to third parties for advertising, marketing, or other commercial purposes.",
        },
        {
          type: "para",
          text: "We may disclose or share your data in the following limited circumstances.",
        },
        {
          type: "sub",
          label: "A",
          heading: "Within our corporate group",
          blocks: [
            {
              type: "para",
              text: "We may disclose your data to any member of our group — meaning our subsidiaries, our ultimate holding company, and its subsidiaries — where this is necessary for operational purposes and for providing the Service.",
            },
          ],
        },
        {
          type: "sub",
          label: "B",
          heading: "With service providers",
          blocks: [
            {
              type: "para",
              text: "We engage trusted third-party service providers who perform functions on our behalf and help us operate, provide, and improve the Service. These may include providers of:",
            },
            {
              type: "list",
              items: [
                "Cloud hosting and infrastructure.",
                "IT maintenance and support.",
                "Payment processing, as described in Section II.A.",
                "Analytics and advertising, using aggregated and de-identified data, or with your explicit consent where consent is required for advertising purposes.",
                "Customer support platforms.",
              ],
            },
            {
              type: "para",
              text: "We require every service provider to agree to maintain the confidentiality and security of your data, and to process it only for specified purposes, in accordance with our instructions and with applicable law.",
            },
          ],
        },
        {
          type: "sub",
          label: "C",
          heading: "With your consent",
          blocks: [
            {
              type: "para",
              text: "In some circumstances, acting on your specific request or explicit consent, we may need to disclose your data to a third party so that they can provide a service you have asked for — for example, if we were to offer an integrated SMS service and you explicitly consented to share your phone number for that purpose.",
            },
            {
              type: "para",
              text: "We may also disclose data to third parties that offer goods or services complementary to our own, where you have given explicit consent for that.",
            },
          ],
        },
        {
          type: "sub",
          label: "D",
          heading: "For legal and compliance reasons",
          blocks: [
            {
              type: "para",
              text: "We may disclose your data where we are required to do so by law, or where we believe in good faith that disclosure is necessary to comply with a legal obligation — for example, in response to a subpoena, court order, or other legal process.",
            },
            {
              type: "para",
              text: "We may also disclose data to protect the rights, property, or safety of Chronilogix, our customers, or others, including by exchanging data with other companies and organizations for the purposes of fraud protection and credit risk reduction.",
            },
          ],
        },
        {
          type: "sub",
          label: "E",
          heading: "In connection with business transfers",
          blocks: [
            {
              type: "para",
              text: "If Chronilogix sells or buys any business or assets, or if substantially all of our assets are acquired by a third party, the personal data we hold about our customers may be one of the transferred assets.",
            },
          ],
        },
        {
          type: "sub",
          label: "F",
          heading: "Data we do not share",
          blocks: [
            {
              type: "para",
              text: "We do not share your raw conversational data, or other sensitive User Content, with any third party for any purpose other than providing and improving the Chronilogix AI service — through anonymization and de-identification for AI model enhancement — or as explicitly permitted by your direct consent.",
            },
          ],
        },
      ],
    },

    {
      id: "data-retention",
      label: "V",
      heading: "Data retention",
      blocks: [
        {
          type: "para",
          text: "We retain your personal data for as long as necessary to fulfil the purposes for which it was collected, as set out in this Privacy Policy, and to comply with our legal obligations.",
        },
        {
          type: "list",
          items: [
            "**Account data.** Your account data is retained until you choose to delete your account. If you delete your account, all associated data is permanently removed from our servers, except for aggregated and anonymized data used for AI improvement.",
            "**Conversational data (User Content).** Your conversational data is retained until you choose to delete it. We do not erase this data automatically unless you take action — for example, clearing your chat history or deleting your account.",
            "**Transactional data.** Data relating to your purchases and financial transactions is kept for the whole period of the contractual relationship, and thereafter in accordance with our legal obligations and applicable statute-of-limitation periods. This data does not include payment card information, which Chronilogix does not store.",
            "**Marketing communication data.** Data collected on the basis of your consent to receive marketing communications is used until you withdraw that consent, or until applicable law requires that it no longer be used.",
            "**Requests and queries.** Data collected in the context of a request or query is kept for the period necessary to process and reply to it.",
            "**Cookies and tracking data.** Where cookies or other trackers are placed on your device, they are kept for a period of up to twelve (12) months, or as otherwise specified in our Cookie Policy.",
            "**Other data.** Other data is kept for as long as necessary for the purposes pursued, and in compliance with our legal obligations, including applicable statutes of limitation.",
          ],
        },
      ],
    },

    {
      id: "data-security",
      label: "VI",
      heading: "Data security",
      blocks: [
        {
          type: "para",
          text: "We prioritize the security of your information and follow generally accepted industry standards to protect the personal data submitted to us, both in transit and once we have received it.",
        },
        {
          type: "list",
          items: [
            "**Encryption.** All user conversations are encrypted, including end-to-end encryption where technically feasible, for maximum privacy. Payment transactions are encrypted using SSL technology.",
            "**De-identification and anonymization.** We apply de-identification and anonymization techniques so that your data — conversational data in particular — remains anonymous where it is used for AI model enhancement, and cannot be reconstructed to identify you as an individual.",
            "**Secure storage.** Conversational data is stored against randomly generated unique user IDs rather than personal details. All data is held on our secure servers in the United States.",
            "**Limited access.** We operate strict access controls, so that only authorized employees and third-party vendors with a legitimate business need can access user data. Analysis of sensitive data is conducted primarily on aggregated and anonymized data.",
            "**On-device transcription.** For voice interactions, transcription typically takes place on your device, which means raw audio is generally never stored on our servers.",
            "**HIPAA.** We follow Health Insurance Portability and Accountability Act (HIPAA) standards where applicable to protect your health information.",
          ],
        },
        {
          type: "notice",
          tone: "warn",
          text: "Acknowledgement of inherent risks. While we implement commercially reasonable security measures to protect your data, you acknowledge that no transmission of data over the internet or any wireless network can be guaranteed to be one hundred percent secure. We therefore cannot guarantee the absolute security of any information you transmit to or receive from Chronilogix AI, and you do so at your own risk. Once we have received your data, we apply strict procedures and security features to try to prevent unauthorized access.",
        },
      ],
    },

    {
      id: "your-rights",
      label: "VII",
      heading: "Your data protection rights",
      blocks: [
        {
          type: "para",
          text: "Under applicable data protection law — including the Delaware Personal Data Privacy Act, the EU GDPR, and other relevant regulation — you have certain rights in respect of your personal data. We are committed to helping you exercise them.",
        },
        {
          type: "list",
          items: [
            "**Right of access.** You have the right to obtain confirmation of whether personal data concerning you is being processed and, if it is, to obtain access to that data and a copy of it.",
            "**Right to rectification.** You have the right to have inaccurate personal data concerning you corrected. You also have the right to have incomplete personal data completed, including by providing a supplementary statement.",
            "**Right to erasure (“right to be forgotten”).** In some cases you have the right to have personal data concerning you erased. On request, Chronilogix will permanently and irreversibly anonymize your data so that it can never be reconstructed to identify you as an individual. This is not an absolute right, and we may have legal or legitimate grounds for retaining certain data.",
            "**Right to restriction of processing.** In some cases you have the right to obtain a restriction on the processing of your personal data.",
            "**Right to data portability.** You have the right to receive the personal data you have provided to us in a structured, commonly used, and machine-readable format, and to transmit that data to another controller without hindrance from us. This right applies only where the processing is based on your consent or on a contract and is carried out by automated means.",
            "**Right to object.** You have the right to object at any time, on grounds relating to your particular situation, to processing of your personal data that is based on our legitimate interest. We may, however, invoke compelling legitimate grounds for continuing to process it. Where your personal data is processed for direct marketing purposes, you have the right to object at any time. You may exercise that right by using the “unsubscribe” link at the bottom of any message you receive, or by emailing us at [support@chronilogix.com](mailto:support@chronilogix.com).",
            "**Right to lodge a complaint.** You have the right to contact the competent supervisory authority to complain about our personal data protection practices — for example, the Delaware Department of Justice under the Delaware Personal Data Privacy Act, or the data protection authority for your own jurisdiction.",
            "**Right to give instructions about the use of your data after your death.** Where applicable law provides for it, you may give us instructions concerning the use of your personal data after your death.",
          ],
        },
        {
          type: "para",
          text: "**How to exercise your rights.** To exercise one or more of these rights, email us at [support@chronilogix.com](mailto:support@chronilogix.com). You may also request access to your data in order to modify or update it at any time at the same address. We will respond to your request within a reasonable timeframe as required by applicable law, subject to verification of your identity.",
        },
      ],
    },

    {
      id: "international-transfers",
      label: "VIII",
      heading: "International data transfers",
      blocks: [
        {
          type: "para",
          text: "You agree that all personal information collected by or through Chronilogix may be transferred to, processed in, and stored anywhere in the world, including the United States. Such transfer may be to our own servers, to the servers of our affiliates, or to the servers of our service providers.",
        },
        {
          type: "para",
          text: "Your personal information may be accessible to law enforcement or other authorities pursuant to a lawful request in the jurisdictions where it is processed or stored. By providing information to Chronilogix, you explicitly consent to the storage and processing of your personal information in those locations, and you acknowledge that local authorities may access it as described.",
        },
        {
          type: "para",
          text: "Where we transfer data outside your country of residence, we put appropriate safeguards in place so that your personal data receives a level of protection consistent with applicable law. Those safeguards may include reliance on adequacy decisions, standard contractual clauses, or other legally recognized transfer mechanisms.",
        },
      ],
    },

    {
      id: "childrens-privacy",
      label: "IX",
      heading: "Children’s privacy",
      blocks: [
        {
          type: "para",
          text: "Chronilogix AI is generally intended for individuals who are at least eighteen (18) years of age, or the age of legal majority in their jurisdiction of residence. An individual under eighteen (18), or under the applicable age of majority, may use the Products only with the involvement and consent of a parent or legal guardian and under that person’s account, as set out in our [Terms and Conditions](/terms).",
        },
        {
          type: "para",
          text: "If we become aware that we have collected personal data from a child under the age of eighteen (18) without verifiable parental consent, we will take reasonable steps to delete it as quickly as possible. If you believe we may hold information from or about a child under that age, please contact us at [support@chronilogix.com](mailto:support@chronilogix.com).",
        },
      ],
    },

    {
      id: "cookies",
      label: "X",
      heading: "Cookies and other tracking technologies",
      blocks: [
        {
          type: "para",
          text: "Chronilogix and our analytics partners use technologies such as cookies, beacons, tags, and scripts to enable functionality and improve the user experience.",
        },
        {
          type: "para",
          text: "**What cookies are.** Cookies are small data files placed on your device. We also use local storage, such as HTML5, to store content data and preferences.",
        },
        {
          type: "para",
          text: "**How we use them.**",
        },
        {
          type: "list",
          items: [
            "**Functionality.** To recognize your device so that you do not have to provide the same data more than once, to recognize that you may already have given a username and password, and to store your preferences.",
            "**Analytics.** To measure how people use the Products, gather statistical data such as visitor numbers and usage volumes, and understand user behavior so we can optimize our content and services. We use Google Analytics for this purpose.",
            "**Advertising.** We work with third parties such as Facebook and Google to manage our advertising of the Products on other sites and platforms and across your devices, based on your past visits to the Website. These partners may use technologies such as cookies to gather data about your activity within the Products in order to deliver that advertising to you, including retargeting ads.",
            "**Log files.** We gather certain data and store it in log files, including IP address, browser type, ISP, referring and exit pages, operating system, and clickstream data. This helps us understand which content is popular and make decisions about what to offer.",
          ],
        },
        {
          type: "para",
          text: "**Your choices.** We will obtain your consent before using such trackers to the extent applicable law requires it. Most browsers and devices offer tools for removing cookies and clearing local storage. Note that opting out of interest-based advertising does not stop generic ads from being served to you. You can also adjust your ad preferences in your Google or Facebook account.",
        },
      ],
    },

    {
      id: "changes",
      label: "XI",
      heading: "Changes to this Privacy Policy",
      blocks: [
        {
          type: "para",
          text: "We may update this Privacy Policy from time to time to reflect changes in our data practices, in legal requirements, or in our service offering. If we make any material change, we will notify you before it takes effect — by in-Product message, by email to the address associated with your account, or by posting a notice on the Website or in the App.",
        },
        {
          type: "para",
          text: "We encourage you to review this page periodically for the latest information about our privacy practices. As a registered user, it is your responsibility to maintain a valid email address. If you have opted out of communications from us you may not receive these notifications; the updated Privacy Policy will still govern your use of the Service, and you remain responsible for checking for changes. Your continued use of the Website or the Service after a change takes effect indicates your agreement to be bound by the modified Privacy Policy.",
        },
      ],
    },

    {
      id: "contact",
      label: "XII",
      heading: "Contact us",
      blocks: [
        {
          type: "para",
          text: "If you have any question, comment, or request regarding this Privacy Policy, your data rights, or our data practices, please contact us at:",
        },
        { type: "address", ...ADDRESS },
      ],
    },
  ],
};

/* ══════════════════════════════════════════════════════════════════
   TERMS AND CONDITIONS
   ══════════════════════════════════════════════════════════════════ */

export const TERMS_DOC: LegalDoc = {
  eyebrow: "Legal",
  title: "Terms and",
  titleTail: "Conditions",
  intro:
    "The agreement between you and Chronilogix, Inc. governing your access to and use of the Chronilogix behavioral health and chronic care support application and related services.",
  updated: LAST_UPDATED,
  preamble: {
    tone: "warn",
    text: "Please read these Terms and Conditions carefully before using Chronilogix AI. These Terms include an important arbitration clause and class action waiver that affect how disputes with Chronilogix are resolved.",
  },
  sections: [
    {
      /* Unnumbered in the source document — it sits above “1.
         Definitions” as the preamble that binds the reader. */
      id: "agreement",
      heading: "The agreement",
      blocks: [
        {
          type: "para",
          text: "These Terms and Conditions (the “Terms” or this “Agreement”) constitute a legally binding agreement between you (“User,” “you,” or “your”) and Chronilogix, Inc., a company incorporated under the laws of the State of Delaware, regarding your access to and use of the Chronilogix behavioral health and chronic care support application and related services (collectively, the “Service”). The Service is accessible through our website, [www.chronilogix.com](https://www.chronilogix.com), and through our mobile device application (the “App”).",
        },
        {
          type: "para",
          text: "By accessing, downloading, installing, or using Chronilogix, you acknowledge that you have read and understood these Terms and agree to be bound by them, together with our [Privacy Policy](/privacy), which is incorporated into this Agreement by reference. If you do not agree to these Terms, you must not access, download, install, or use Chronilogix.",
        },
        {
          type: "para",
          text: "Chronilogix reserves the right, at its sole discretion, to modify or revise these Terms at any time. We will give notice of any such change by updating the “Last updated” date at the top of these Terms, or by providing other notice as required by law. Your continued use of Chronilogix AI after a change is posted constitutes your acceptance of that change. It is your responsibility to review these Terms regularly.",
        },
        {
          type: "para",
          text: "These Terms apply to all users of the Service, including without limitation users who are browsers, vendors, customers, merchants, or contributors of content.",
        },
      ],
    },

    {
      id: "definitions",
      label: "1",
      heading: "Definitions",
      blocks: [
        {
          type: "para",
          text: "To ensure clarity and precision, the following terms have the meanings set out below.",
        },
        {
          type: "defs",
          items: [
            {
              term: "AI Output",
              text: "The responses, suggestions, conversational text, or other content generated by Chronilogix AI in response to User Content.",
            },
            {
              term: "AI Therapist, AI therapy-like support, AI therapist-style support",
              text: "Refers exclusively to the conversational style and techniques employed by Chronilogix AI, which are inspired by established psychological frameworks such as Motivational Interviewing, Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), Socratic questioning, Rational Emotive Behavior Therapy, and the like. These terms are used solely to describe the conversational interaction. **They do not imply that Chronilogix AI is a licensed, qualified, or registered human therapist, medical professional, mental healthcare provider, or clinical expert.** Their use in any context does not represent the provision of professional medical advice, diagnosis, treatment, or psychiatric care.",
            },
            {
              term: "App",
              text: "The mobile device application of Chronilogix AI, accessible on iOS and Android phones, iPads, and tablets.",
            },
            {
              term: "Content",
              text: "All information, data, text, software, scripts, graphics, photographs, sounds, music, video, audiovisual combinations, interactive features, and other material you may view, access, or contribute to, on or through Chronilogix AI, including AI Output.",
            },
            {
              term: "Crisis Situation",
              text: "Includes, but is not limited to, any situation involving suicidal ideation, self-harm, harm to others, a severe mental health emergency, acute psychological distress requiring immediate professional intervention, or any situation in which a user is unable to ensure their own safety or the safety of others, or to act on their own discretion.",
            },
            {
              term: "Chronilogix, we, us, our",
              text: "Chronilogix, Inc., a company incorporated under the laws of the State of Delaware, the developer and provider of Chronilogix AI.",
            },
            {
              term: "Intellectual Property Rights",
              text: "All forms of intellectual property right, including but not limited to patents, copyrights, moral rights, trademarks, service marks, trade names, trade dress, trade secrets, know-how, inventions, discoveries, concepts, designs, fine-tuned AI models, proprietary algorithms, source code, and any other proprietary right, whether registered or unregistered, together with all applications and registrations for any of the foregoing.",
            },
            {
              term: "Chronilogix AI, the Service",
              text: "The AI-powered coaching application developed by Chronilogix, Inc., accessible on iOS and Android phones, iPads and tablets, and through a web interface, which supports users through text or voice-based conversation.",
            },
            {
              term: "Privacy Policy",
              text: "The separate document setting out how Chronilogix collects, uses, stores, and protects your personal data, available at [/privacy](/privacy).",
            },
            {
              term: "Site",
              text: "The Chronilogix website located at [www.chronilogix.com](https://www.chronilogix.com).",
            },
            {
              term: "User, you, your",
              text: "Any individual accessing, downloading, installing, or using Chronilogix AI.",
            },
            {
              term: "User Content",
              text: "Any data, text, audio, images, or other material that you, as a User, input, upload, or transmit while using Chronilogix AI.",
            },
          ],
        },
      ],
    },

    {
      id: "nature-of-service",
      label: "2",
      heading:
        "Nature of Chronilogix AI, and disclaimers regarding medical and therapeutic services",
      blocks: [
        {
          type: "notice",
          tone: "warn",
          text: "This section is critical and governs the core functionality and limitations of Chronilogix AI. Your acceptance of these Terms constitutes your express agreement to these fundamental principles.",
        },
        {
          type: "sub",
          label: "2.1",
          heading: "Chronilogix AI is not a medical or clinical service",
          blocks: [
            {
              type: "list",
              items: [
                "Chronilogix AI is designed and provided solely as a self-help tool for emotional wellness support, personal reflection, and general informational purposes in the context of emotional and mental well-being. It is engineered to provide conversational support and guidance, inspired by established psychological frameworks, to help users manage everyday emotional challenges such as overthinking, burnout, loneliness, anxiety, emotional spirals, decision fatigue, and the like.",
                "**Chronilogix AI is not a medical device, a licensed healthcare provider, a therapist, a psychiatrist, or any other qualified medical or mental health professional.**",
                "**Your use of Chronilogix AI — regardless of its conversational style or of how it may be described, whether as an “AI emotional wellness coach,” an “AI mental health coach,” or an “AI therapist” — does not create a doctor-patient relationship, a therapist-client relationship, a psychologist-client relationship, or any other professional medical or clinical relationship or fiduciary duty** between you and Chronilogix, Inc., its employees, agents, or affiliates.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "2.2",
          heading: "No diagnosis, treatment, or medical advice",
          blocks: [
            {
              type: "list",
              items: [
                "**Chronilogix AI cannot and will not provide medical advice, diagnose mental health conditions, treat mental illness, offer medication advice, or prescribe any form of treatment.**",
                "All interactions with Chronilogix AI, and any information or suggestion it provides, are for general informational and self-help purposes only. They are not intended to be, and must not be used as, a substitute for professional medical advice, diagnosis, treatment, therapy, or psychiatric care from a qualified healthcare professional.",
                "You understand and acknowledge that you should always seek the advice of your physician or another qualified health provider with any question you may have about a medical condition, a mental health condition, or a specific health goal. Never disregard professional medical advice, or delay seeking it, because of something you have read or heard on Chronilogix AI.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "2.3",
          heading: "Prohibition of use in Crisis Situations",
          blocks: [
            {
              type: "list",
              items: [
                "**Chronilogix AI is not equipped or intended to provide support in an emergency or Crisis Situation.** This includes, but is not limited to, situations involving suicidal ideation, self-harm, harm to others, an acute mental health emergency, or any situation requiring immediate professional intervention.",
                "**You must seek urgent professional help immediately** if you are in a Crisis Situation, or if you believe you are experiencing a medical or mental health emergency. Chronilogix AI will surface crisis hotlines and resources as a redirect, but it cannot engage in or respond to such situations.",
                "By using Chronilogix AI, you agree **not to use the Service for any Crisis Situation**, and you affirm that you will instead contact the appropriate emergency service or mental health professional — for example, by dialing 911 in the United States, 112 in the European Union, or the emergency number for your local jurisdiction. In the United States, the 988 Suicide & Crisis Lifeline can be reached by calling or texting 988.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "2.4",
          heading: "Limitations inherent to generative artificial intelligence",
          blocks: [
            {
              type: "para",
              text: "Chronilogix AI is an AI model powered by large language models (LLMs) and is under continuous training. While Chronilogix employs robust internal safety, moderation, and behavior alignment protocols, you acknowledge that generative AI systems, by their nature, may:",
            },
            {
              type: "list",
              items: [
                "Produce inaccurate, incomplete, or contextually inappropriate responses.",
                "Generate information that is not factual, or that is subject to “hallucination.”",
                "Provide responses that are misinterpreted or misunderstood by the User.",
              ],
            },
            {
              type: "para",
              text: "**Chronilogix does not warrant the accuracy, completeness, reliability, or usefulness of any information or advice provided by Chronilogix AI, and does not guarantee any specific emotional, psychological, or other outcome from its use.** You agree that you use Chronilogix AI’s outputs at your own risk.",
            },
          ],
        },
        {
          type: "sub",
          label: "2.5",
          heading: "User responsibility and discretion",
          blocks: [
            {
              type: "list",
              items: [
                "You understand and expressly agree that your reliance on any information or suggestion provided by Chronilogix AI is solely at your own risk.",
                "You agree to exercise your own judgment and discretion when considering any information or suggestion from Chronilogix AI.",
                "You undertake to consult a qualified professional before making any decision based on an interaction with Chronilogix AI, particularly one concerning your health, your well-being, or any significant life choice.",
                "You assume full responsibility for the decisions and actions you take based on your use of Chronilogix AI. Do not start or stop taking any medication or medical treatment unless advised to do so by a medical practitioner. Never disregard or delay seeking medical advice on the basis of content or information available on Chronilogix AI.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "2.6",
          heading: "Third-party devices, wearables, and biomarkers",
          blocks: [
            {
              type: "list",
              items: [
                "If you choose to integrate any third-party device, wearable, or biomarker data with Chronilogix AI or a related service — whether or not directly supported by Chronilogix — you acknowledge that such devices are not medical devices, are not manufactured by Chronilogix, Inc., and are merely procured and distributed by third parties.",
                "Chronilogix is not responsible for any defect in such a third-party device, and will not be liable for any loss or damage you suffer through your use of such a device or of any data derived from it. You assume full responsibility for the decisions and actions you take based on your use of any third-party device or biomarker data.",
                "**Chronilogix gives no warranty in respect of third-party devices, wearables, or the accuracy of biomarker data.** Health information and biomarker accuracy may be affected by an underlying health condition. Please use such products and services only under the supervision of a doctor or healthcare professional if you have any health condition.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "user-responsibilities",
      label: "3",
      heading: "User representations and responsibilities",
      blocks: [
        {
          type: "para",
          text: "By accessing or using Chronilogix AI, you represent and warrant as follows.",
        },
        {
          type: "sub",
          label: "3.1",
          heading: "Eligibility",
          blocks: [
            {
              type: "list",
              items: [
                "You are at least eighteen (18) years of age, or the age of legal majority in your jurisdiction of residence, and you have the legal capacity to enter into a binding agreement with Chronilogix. If you are under eighteen (18), you may use Chronilogix AI only with the express consent and supervision of a parent or legal guardian who agrees to be bound by these Terms.",
                "You are not located in a country subject to a US government, EU, or UN embargo, or that has been designated by any of those bodies as a “terrorist supporting” country, and you are not listed on any US government, EU, or UN list of prohibited or restricted parties.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "3.2",
          heading: "Accurate information and account security",
          blocks: [
            {
              type: "list",
              items: [
                "If you create an account with us (an “Account”) in order to use certain features of the Service, you must provide accurate, complete, and current information for that Account, and you agree to maintain and promptly update it so that it stays accurate, complete, and current. If you do not, we may have to suspend or terminate your Account.",
                "You agree not to disclose your Account password to anyone, and you must notify us immediately of any unauthorized use of your Account. You are solely responsible for all activity that occurs under your Account, whether or not you are aware of it.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "3.3",
          heading: "Responsible use and conduct",
          blocks: [
            {
              type: "list",
              items: [
                "You agree to use Chronilogix AI solely for its intended purpose as a self-help emotional wellness and chronic care tool, strictly in accordance with these Terms and with all applicable local, national, and international law and regulation.",
                "You understand and agree that you are solely responsible for your interactions with Chronilogix AI, and for any decision or action you take on the basis of them.",
                "You commit to exercising personal judgment and discretion when interpreting or acting upon any information or suggestion from Chronilogix AI.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "3.4",
          heading: "Prohibited activities",
          blocks: [
            { type: "para", text: "You are expressly prohibited from:" },
            {
              type: "list",
              items: [
                "Using Chronilogix AI for any illegal, harmful, fraudulent, or unauthorized purpose, or in any way that violates applicable law or regulation.",
                {
                  text: "Posting, uploading, publishing, submitting, transmitting, or otherwise making available any User Content that:",
                  items: [
                    "Infringes, misappropriates, or violates a third party’s patent, copyright, trademark, trade secret, moral rights, or other Intellectual Property Rights, or rights of publicity or privacy.",
                    "Is fraudulent, false, misleading, or deceptive.",
                    "Is defamatory, obscene, pornographic, vulgar, or offensive.",
                    "Promotes discrimination, bigotry, racism, hatred, harassment, or harm against any individual or group.",
                    "Is violent or threatening, or promotes violence or action that is threatening to any person or entity.",
                    "Promotes illegal or harmful activities or substances.",
                    "Violates, or encourages conduct that would violate, applicable law or regulation, or that would give rise to civil liability.",
                  ],
                },
                "Attempting to gain unauthorized access to any portion or feature of Chronilogix AI, or to any system or network connected to the Service or to any Chronilogix server, whether by hacking, password mining, or any other illegitimate means.",
                "Impersonating any person or entity, or falsely stating or otherwise misrepresenting your affiliation with a person or entity.",
                "Uploading or transmitting any virus, Trojan horse, worm, time bomb, cancelbot, corrupted file, or any other similar software or program that may damage the operation of another’s computer or property.",
                "Disrupting, modifying, interfering with, or otherwise affecting the normal operation of Chronilogix AI.",
                "Engaging in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.",
                "Collecting or storing personal data about other users without their express consent.",
                "Using the Service to send unsolicited commercial communications (“spam”).",
                "Circumventing, disabling, or otherwise interfering with security-related features of Chronilogix AI, or with features that prevent or restrict use or copying of Content or that enforce limitations on use of the Service.",
                "Attempting to reverse-engineer, decompile, disassemble, or derive the source code, underlying algorithms, or architecture of Chronilogix AI or of any part of it.",
                "Modifying, adapting, translating, selling, renting, leasing, lending, or creating derivative works based on Chronilogix AI or on any Content other than your own User Content.",
                "Using Chronilogix AI for any commercial purpose without the express prior written consent of Chronilogix.",
                "Removing, altering, or obscuring any copyright, trademark, service mark, or other proprietary rights notice incorporated in or accompanying the Service or the Content.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "3.5",
          heading: "User Content ownership and warranties",
          blocks: [
            {
              type: "list",
              items: [
                "You are solely responsible for all User Content you make available through the Service.",
                "You represent and warrant that you own all of your User Content, or that you hold all rights necessary to grant us the license rights in your User Content set out in these Terms.",
                "You further represent and warrant that neither your User Content, nor your use and provision of your User Content through the Service, nor any use of your User Content by Chronilogix on or through the Service, will infringe, misappropriate, or violate a third party’s Intellectual Property Rights or rights of publicity or privacy, or result in the violation of applicable law or regulation.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "3.6",
          heading: "Chronilogix’s enforcement rights",
          blocks: [
            {
              type: "list",
              items: [
                "Although we are not obliged to monitor access to or use of the Service or the Content, or to review or edit any User Content, we have the right to do so in order to operate the Service, to ensure compliance with these Terms, and to comply with applicable law or other legal requirement.",
                "We reserve the right, but are not obliged, to remove or disable access to any Content, including User Content, at any time and without notice, if in our sole discretion we consider it objectionable or in violation of these Terms.",
                "We have the right to investigate violations of these Terms and conduct that affects the Service. We may also consult and cooperate with law enforcement authorities to prosecute users who violate the law.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "intellectual-property",
      label: "4",
      heading: "Intellectual property rights",
      blocks: [
        {
          type: "sub",
          label: "4.1",
          heading: "Ownership of Chronilogix AI and Chronilogix IP",
          blocks: [
            {
              type: "list",
              items: [
                "You acknowledge and agree that Chronilogix AI — including its underlying software, algorithms, designs, architecture, user interface, source code, object code, methodologies, proprietary fine-tuned AI models, its persona and conversational frameworks (including but not limited to the application of Motivational Interviewing, CBT, ACT, Socratic questioning, non-violent communication, and trauma-informed practice), trademarks, service marks, trade names, logos, and all Content other than User Content — is and remains the exclusive property of Chronilogix and its licensors.",
                "All Intellectual Property Rights in and to Chronilogix AI, the Service, and all associated material are owned by or licensed to Chronilogix and are protected by applicable intellectual property law and treaties worldwide, including those of the United States.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "4.2",
          heading: "Limited license to the User",
          blocks: [
            {
              type: "list",
              items: [
                "Subject to your compliance with these Terms, Chronilogix grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use Chronilogix AI for your personal, non-commercial emotional wellness support and self-reflection only, on devices you own or control, and as permitted by the usage rules set by your mobile device or browser provider.",
                "No rights are granted to you other than those expressly set out here. All rights not expressly granted are reserved by Chronilogix.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "4.3",
          heading: "Ownership of User Content",
          blocks: [
            {
              type: "list",
              items: [
                "Chronilogix does not claim any ownership right in your User Content. You retain all rights in and to your User Content — that is, your direct inputs, prompts, and communications with Chronilogix AI — to the extent you hold such rights.",
                "By submitting User Content, you grant Chronilogix a worldwide, royalty-free, perpetual, irrevocable, non-exclusive, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform, and display your User Content, in whole or in part, in connection with operating, maintaining, improving, and developing Chronilogix AI and other Chronilogix products and services, including for the purpose of training, analyzing, and enhancing the AI models — provided that such use is carried out in an anonymized and aggregated manner in order to protect your privacy, as further described in our [Privacy Policy](/privacy). This license survives termination of these Terms.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "4.4",
          heading: "AI Output",
          blocks: [
            {
              type: "list",
              items: [
                "You acknowledge and agree that the responses, suggestions, and other content generated by Chronilogix AI in response to your User Content (the “AI Output”) are derived from, and form part of, the proprietary AI models owned by Chronilogix.",
                "Chronilogix retains all Intellectual Property Rights in and to the AI Output.",
                "You are granted a limited, personal, non-exclusive, non-transferable, revocable license to use the AI Output generated during your personal, non-commercial use of Chronilogix AI, solely for your individual emotional wellness support and self-reflection.",
                "You are expressly prohibited from reproducing, distributing, modifying, publicly displaying, performing, publishing, or creating derivative works from the AI Output for any commercial purpose, and from using AI Output in any way that infringes the Intellectual Property Rights of Chronilogix or of any third party. You may not commercialize, sell, or publicly share the AI Output without the express prior written consent of Chronilogix.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "privacy-and-data",
      label: "5",
      heading: "Privacy policy and data usage",
      blocks: [
        {
          type: "sub",
          label: "5.1",
          heading: "Incorporation of the Privacy Policy",
          blocks: [
            {
              type: "list",
              items: [
                "Your privacy is critically important to us. These Terms incorporate our [Privacy Policy](/privacy) by reference. That policy describes in detail how Chronilogix collects, uses, stores, processes, and protects your personal data and User Content in connection with your use of Chronilogix AI.",
                "By agreeing to these Terms, you also acknowledge that you have read and agree to the terms of our Privacy Policy. Please review it carefully.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "5.2",
          heading: "Data use for AI improvement",
          blocks: [
            {
              type: "list",
              items: [
                "You explicitly consent to Chronilogix collecting and using your anonymized and aggregated User Content and interaction data for the purpose of continuously training, improving, and developing Chronilogix AI and other Chronilogix products and services, and of ensuring their safety and performance.",
                "Chronilogix employs robust anonymization techniques so that data used for AI training does not directly identify you. This process is described further in our [Privacy Policy](/privacy).",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "5.3",
          heading: "Data security disclaimer",
          blocks: [
            {
              type: "list",
              items: [
                "While Chronilogix implements commercially reasonable security measures to protect your data, you acknowledge that no transmission of data over the internet or any wireless network can be guaranteed to be one hundred percent secure. We therefore cannot guarantee the absolute security of any information you transmit to or receive from Chronilogix AI, and you do so at your own risk.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "fees-and-payment",
      label: "6",
      heading: "Subscription fees and payment",
      blocks: [
        {
          type: "sub",
          label: "6.1",
          heading: "Subscription types and fees",
          blocks: [
            {
              type: "list",
              items: [
                "Chronilogix offers various subscription types for Chronilogix AI, which may include free trials and weekly, monthly, and annual subscriptions. By selecting a subscription type, you agree to pay in advance the applicable subscription fee, if any, as posted in the App or on the Site, together with any applicable taxes and other expenses that may accrue in connection with your use of the Service.",
                "All payments are non-refundable and non-transferable unless otherwise expressly provided in these Terms or required by applicable law. All fees and applicable taxes are payable in United States dollars, or in the currency specified at the point of purchase.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "6.2",
          heading: "Free trials",
          blocks: [
            {
              type: "list",
              items: [
                "We may offer free trials for a specified period, during which you may use certain features of the Service without payment. Free trials are generally available only to new users, on account creation.",
                "Unless you cancel your free trial before the end of the trial period, we — or our third-party payment processor — will begin charging you the applicable monthly or annual subscription fee until you cancel. You will not receive a notice from us that your free trial has ended or that your subscription has begun. We reserve the right to modify or terminate free trials at any time, without notice, at our sole discretion.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "6.3",
          heading: "Recurring payment and auto-renewal",
          blocks: [
            {
              type: "list",
              items: [
                "When you purchase a subscription, the subscription fee — together with any applicable taxes and other charges — will be charged to you at the beginning of the paying portion of your subscription period.",
                "Your monthly or annual subscription will renew automatically at the then-current rate unless you cancel it in accordance with Section 6.4 below. By entering into these Terms and electing a recurring subscription, you acknowledge that your subscription has a regular payment feature, and you accept responsibility for all recurring payment obligations arising before cancellation.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "6.4",
          heading: "Cancellation",
          blocks: [
            {
              type: "list",
              items: [
                "You may cancel your subscription at any time. Cancellation instructions may be provided by your app store operator — for example, the Apple App Store or Google Play Store — or you can contact the Chronilogix team for assistance at [support@chronilogix.com](mailto:support@chronilogix.com).",
                "All payments are non-refundable and non-transferable on cancellation. You will not receive a refund of any portion of the subscription fee paid for the then-current subscription period. You may continue to use the Service through the end of that period.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "6.5",
          heading: "Price changes",
          blocks: [
            {
              type: "list",
              items: [
                "Subscription prices are subject to change at any time without prior notice. We reserve the right to correct any inadvertent pricing error, to change or revoke any limited-time offer, and to correct any error, inaccuracy, or omission on the Site or in the App, including after you have been charged your subscription fee.",
                "If we change the price of your monthly or annual subscription, you will be notified in advance and will have the option to cancel before the new price applies. Your continued use of the Service after a price change indicates your acceptance of the new price.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "6.6",
          heading: "Termination of subscriptions by Chronilogix",
          blocks: [
            {
              type: "list",
              items: [
                "We may terminate access to or use of the Service, including any subscription, at our sole discretion, at any time, and without prior notice. All fees are non-refundable. For monthly and annual subscriptions, if we terminate your subscription you may continue to use the Service for the remainder of your current subscription period; after that, the paid subscription Service will not be available to you.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "warranty-disclaimers",
      label: "7",
      heading: "Warranty disclaimers",
      blocks: [
        {
          type: "notice",
          tone: "warn",
          text: "The Service and all Content are provided “as is” and “as available,” without warranty of any kind, whether express or implied.",
        },
        {
          type: "sub",
          label: "7.1",
          heading: "General disclaimers",
          blocks: [
            {
              type: "list",
              items: [
                "Without limiting the foregoing, **Chronilogix expressly disclaims any warranty of merchantability, fitness for a particular purpose, quiet enjoyment, and non-infringement, and any implied warranty arising out of course of dealing or usage of trade.**",
                "Chronilogix makes no warranty that the Service will meet your requirements, or that it will be available on an uninterrupted, secure, or error-free basis.",
                "Chronilogix makes no warranty as to the quality, accuracy, timeliness, truthfulness, completeness, or reliability of any Content, including AI Output.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "7.2",
          heading: "No guarantee of error-free or virus-free operation",
          blocks: [
            {
              type: "list",
              items: [
                "Chronilogix does not warrant that the functional aspects of Chronilogix AI or our Content will be error-free, or that the platform, our Content, or the server that makes it available are free of viruses or other harmful components. We recommend that all internet users keep up-to-date virus checking software installed.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "7.3",
          heading: "No representation on third-party devices",
          blocks: [
            {
              type: "list",
              items: [
                "Chronilogix makes no representation or warranty as to the accuracy, completeness, or suitability for any purpose of any third-party device, or of any advice or information provided as part of a third-party service. So far as permitted under applicable law, we disclaim any liability for or in respect of any third-party device.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "limitation-of-liability",
      label: "8",
      heading: "Limitation of liability",
      blocks: [
        {
          type: "notice",
          tone: "warn",
          text: "This section limits the extent of Chronilogix, Inc.’s liability to you. Please read it carefully.",
        },
        {
          type: "sub",
          label: "8.1",
          heading: "General limitation",
          blocks: [
            {
              type: "para",
              text: "**To the fullest extent permitted by applicable law, in no event shall Chronilogix, Inc., its directors, officers, employees, agents, affiliates, licensors, suppliers, or successors be liable for any direct, indirect, incidental, special, consequential, punitive, or exemplary damages** — including but not limited to damages for loss of profits, goodwill, use, or data, or other intangible losses, and even if Chronilogix has been advised of the possibility of such damages — arising out of or in connection with:",
            },
            {
              type: "list",
              items: [
                "Your access to, use of, or inability to access or use Chronilogix AI.",
                "Any conduct or content of any third party on the Service.",
                "Any content obtained from the Service, including any information or suggestion provided by Chronilogix AI, whether accurate or inaccurate, appropriate or inappropriate, or subject to “hallucination.”",
                "Unauthorized access to, use of, or alteration of your transmissions or content.",
                "Any action or decision you take on the basis of your interactions with Chronilogix AI.",
                "Any emotional distress, psychological harm, or other injury, whether physical or mental, alleged to have arisen from your use of, reliance on, or interaction with Chronilogix AI — regardless of whether such harm was caused by the AI’s output, by your interpretation of it, or by your decision to use the Service in place of professional care.",
                "The failure of Chronilogix AI to provide real-time human support or to respond to a Crisis Situation, as expressly disclaimed above.",
                "Any delay or failure in performance resulting directly or indirectly from acts of nature, forces, or causes beyond our reasonable control — including without limitation internet failures, computer equipment failures, telecommunication equipment failures, other equipment failures, electrical power failures, strikes, labor disputes, riots, insurrections, civil disturbances, shortages of labor or materials, fires, floods, storms, explosions, acts of God, war, governmental actions, orders of domestic or foreign courts or tribunals, non-performance of third parties, or loss of or fluctuations in heat, light, or air conditioning.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "8.2",
          heading: "Cap on liability",
          blocks: [
            {
              type: "para",
              text: "Without prejudice to the foregoing, and to the maximum extent permitted by applicable law, **the total cumulative liability of Chronilogix, Inc., its directors, officers, employees, agents, affiliates, licensors, suppliers, and successors, arising out of or in connection with these Terms or your use of Chronilogix AI — whether in contract, tort (including negligence), breach of statutory duty, or otherwise — shall in no event exceed the greater of the total amount you have paid to Chronilogix for the use of Chronilogix AI in the twelve (12) months immediately preceding the event giving rise to the liability, or one hundred United States dollars (US$100.00).** This limitation applies even if the remedies available to you under these Terms fail of their essential purpose.",
            },
          ],
        },
        {
          type: "sub",
          label: "8.3",
          heading: "Jurisdictional limitations and fundamental elements",
          blocks: [
            {
              type: "list",
              items: [
                "Some jurisdictions do not allow the exclusion of certain warranties, or the limitation or exclusion of liability for incidental or consequential damages. Accordingly, some of the limitations in this Section 8 may not apply to you. In those jurisdictions, Chronilogix’s liability will be limited to the maximum extent permitted by law.",
                "**The exclusions and limitations of damages set out above are fundamental elements of the basis of the bargain between Chronilogix and you.**",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "indemnification",
      label: "9",
      heading: "Indemnification",
      blocks: [
        {
          type: "para",
          text: "You agree to defend, indemnify, and hold harmless Chronilogix, Inc., its parent companies, subsidiaries, affiliates, directors, officers, employees, agents, licensors, suppliers, and successors from and against any and all claims, liabilities, damages, losses, costs, expenses, and fees — including reasonable attorneys’ fees and legal costs — arising out of or in any way connected with:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Your access to or use of Chronilogix AI.",
            "Your User Content, or any data or information you provide through the Service.",
            "Your breach or alleged breach of any term, condition, representation, or warranty contained in these Terms.",
            "Your violation of any applicable law or regulation, or of any third-party right, including without limitation any intellectual property, privacy, or publicity right.",
            "Any claim by a third party — including without limitation a parent, guardian, family member, or mental health professional — alleging harm, whether psychological, emotional, physical, or otherwise, or damages caused by your use or misuse of Chronilogix AI, or by your reliance on information or suggestions provided by Chronilogix AI, particularly where that use or reliance was contrary to the disclaimers and limitations set out in these Terms.",
          ],
        },
        {
          type: "para",
          text: "This indemnification obligation survives termination of these Terms and of your use of Chronilogix AI. Chronilogix reserves the right, at its own expense, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, and in that case you agree to cooperate with our defense of the claim.",
        },
      ],
    },

    {
      id: "governing-law",
      label: "10",
      heading: "Governing law and dispute resolution",
      blocks: [
        {
          type: "sub",
          label: "10.1",
          heading: "Governing law",
          blocks: [
            {
              type: "list",
              items: [
                "These Terms and Conditions are governed by and construed in accordance with the laws of the State of Delaware and of the United States, without regard to conflict-of-law principles.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "10.2",
          heading: "Exclusive jurisdiction (non-arbitrable disputes)",
          blocks: [
            {
              type: "list",
              items: [
                "For any dispute not subject to the mandatory arbitration provisions below, you and Chronilogix irrevocably agree to submit to the exclusive jurisdiction of the courts of the State of Delaware for the resolution of any legal action or proceeding arising out of or relating to these Terms or your use of Chronilogix AI. Each party irrevocably waives any objection to venue in those courts, and irrevocably waives any claim that such an action or proceeding has been brought in an inconvenient forum.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "10.3",
          heading: "Mandatory binding arbitration (users in the United States)",
          blocks: [
            {
              type: "para",
              text: "This Section 10.3 applies exclusively to Users located in the United States of America.",
            },
            {
              type: "para",
              text: "**Agreement to arbitrate.** You and Chronilogix agree that any and all disputes, claims, or controversies arising out of or relating to these Terms, to Chronilogix AI, or to the breach, termination, enforcement, interpretation, or validity of these Terms — including the determination of the scope or applicability of this agreement to arbitrate — shall be determined by binding arbitration in the State of Delaware before a single arbitrator. The arbitration shall be administered by the American Arbitration Association in accordance with its then-current rules. Judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction.",
            },
            {
              type: "para",
              text: "**Class action waiver.** You and Chronilogix agree that **each party may bring claims against the other only on an individual basis, and not as a plaintiff or class member in any purported class, collective, or representative action or proceeding.** Unless both you and Chronilogix agree otherwise, the arbitrator may not consolidate more than one person’s claims and may not otherwise preside over any form of representative or class proceeding. The arbitrator may award declaratory or injunctive relief only in favor of the individual party seeking relief, and only to the extent necessary to provide relief warranted by that party’s individual claim. If this class action waiver is found to be unenforceable, then the entirety of this arbitration provision (Section 10.3) shall be null and void.",
            },
            {
              type: "para",
              text: "**Exceptions to arbitration.** Notwithstanding the foregoing, either party may bring an individual action in a small claims court located in the State of Delaware, or seek injunctive or other equitable relief in a court of competent jurisdiction in the State of Delaware to prevent the actual or threatened infringement, misappropriation, or violation of a party’s copyrights, trademarks, trade secrets, patents, or other intellectual property rights.",
            },
          ],
        },
      ],
    },

    {
      id: "term-and-termination",
      label: "11",
      heading: "Term and termination",
      blocks: [
        {
          type: "sub",
          label: "11.1",
          heading: "Term",
          blocks: [
            {
              type: "list",
              items: [
                "These Terms remain in full force and effect while you use Chronilogix AI.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "11.2",
          heading: "Termination by you",
          blocks: [
            {
              type: "list",
              items: [
                "You may stop using Chronilogix AI at any time. If you wish to terminate your account, you may do so through the account settings within the application, or by contacting us at [support@chronilogix.com](mailto:support@chronilogix.com). Termination of your account does not relieve you of any obligation arising before termination.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "11.3",
          heading: "Termination by Chronilogix",
          blocks: [
            {
              type: "para",
              text: "Chronilogix may, at its sole discretion, suspend or terminate your access to or use of Chronilogix AI at any time, with or without cause, and without prior notice or liability. Grounds for termination include, but are not limited to:",
            },
            {
              type: "list",
              items: [
                "Breach or violation of these Terms, or of any other policy or guideline referenced in them.",
                "A request by law enforcement or another government agency.",
                "Discontinuation or material modification of the Service, or of any part of it.",
                "Unexpected technical or security issues or problems.",
                "Extended periods of inactivity.",
                "Your engagement in fraudulent or illegal activity.",
                "Any activity that, in Chronilogix’s sole discretion, is harmful to other users, to Chronilogix’s business interests, or to the integrity of Chronilogix AI.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "11.4",
          heading: "Effect of termination",
          blocks: [
            {
              type: "list",
              items: [
                "On termination, your right to use Chronilogix AI ceases immediately. All provisions of these Terms that by their nature should survive termination — including without limitation the provisions on intellectual property ownership, disclaimers, limitation of liability, indemnification, governing law, and dispute resolution — survive termination.",
                "Termination of your account may involve deletion of the User Content associated with it, although aggregated and anonymized data used for AI improvement will be retained as described in the [Privacy Policy](/privacy). Chronilogix will not be liable to you or to any third party for any termination of your access to the Service.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "third-party-links",
      label: "12",
      heading: "Links to third-party websites or resources",
      blocks: [
        {
          type: "para",
          text: "The Service and the App may contain links to third-party websites or resources. We provide these links only as a convenience, and we are not responsible for the content, products, or services available from those websites or resources, or from links displayed on them. You acknowledge and assume all risk arising from your use of any third-party website or resource. We reserve the right to disable links to or from third-party sites, although we are under no obligation to do so. You acknowledge that when you follow a link that leaves our platform, the site you enter is not controlled by us and that different terms of service and privacy policies may apply.",
        },
      ],
    },

    {
      id: "copyright-policy",
      label: "13",
      heading: "DMCA and copyright policy",
      blocks: [
        {
          type: "para",
          text: "Chronilogix respects copyright law and expects its users to do the same. It is our policy to terminate, in appropriate circumstances, the accounts of holders who repeatedly infringe or are believed to be infringing the rights of copyright holders. Please contact us at [support@chronilogix.com](mailto:support@chronilogix.com) for further information about our copyright policy, which is provided on request.",
        },
      ],
    },

    {
      id: "app-store-terms",
      label: "14",
      heading: "App store terms",
      blocks: [
        {
          type: "para",
          text: "The following terms apply to any App accessed through or downloaded from an app store or distribution platform — such as the Apple App Store or Google Play — where the App is now or may in future be made available (each an “App Provider”). You acknowledge and agree that:",
        },
        {
          type: "list",
          items: [
            "These Terms are concluded between you and Chronilogix, Inc., and not with the App Provider. Chronilogix, not the App Provider, is solely responsible for the App.",
            "The App Provider is obliged to furnish any maintenance and support services in respect of the App. If the App fails to conform to any applicable warranty, you may notify the App Provider, and the App Provider will refund the purchase price for the App to you, if applicable; to the maximum extent permitted by applicable law, the App Provider will have no other warranty obligation whatsoever in respect of the App. Any other claim, loss, liability, damage, cost, or expense attributable to a failure to conform to a warranty will be the sole responsibility of Chronilogix, Inc.",
            "The App Provider is not responsible for addressing any claim you have, or any claim of any third party, relating to the App or to your possession and use of it — including without limitation (i) product liability claims, (ii) any claim that the App fails to conform to an applicable legal or regulatory requirement, and (iii) claims arising under consumer protection or similar legislation.",
            "In the event of a third-party claim that the App, or your possession and use of it, infringes that third party’s Intellectual Property Rights, Chronilogix will be solely responsible for the investigation, defense, settlement, and discharge of that claim, to the extent required by these Terms.",
            "The App Provider and its subsidiaries are third-party beneficiaries of these Terms as they relate to your license to the App. On your acceptance of these Terms, the App Provider will have the right — and will be deemed to have accepted the right — to enforce these Terms against you as a third-party beneficiary in respect of your license to the App.",
            "You must also comply with all applicable third-party terms of service when using the App.",
          ],
        },
      ],
    },

    {
      id: "feedback",
      label: "15",
      heading: "Feedback",
      blocks: [
        {
          type: "para",
          text: "We welcome feedback, comments, and suggestions for improvements to the Service (“Feedback”). You can submit Feedback by emailing us at [support@chronilogix.com](mailto:support@chronilogix.com). You grant Chronilogix a non-exclusive, worldwide, perpetual, irrevocable, fully paid, royalty-free, sublicensable, and transferable license under any Intellectual Property Rights you own or control to use, copy, modify, create derivative works based upon, and otherwise exploit the Feedback for any purpose, without obligation or compensation to you.",
        },
      ],
    },

    {
      id: "general-provisions",
      label: "16",
      heading: "General provisions",
      blocks: [
        {
          type: "sub",
          label: "16.1",
          heading: "Entire agreement",
          blocks: [
            {
              type: "list",
              items: [
                "These Terms, together with the Privacy Policy and any other legal notice or additional terms, conditions, or policies published by Chronilogix on the Service, constitute the complete and exclusive understanding and agreement between you and Chronilogix concerning your use of Chronilogix AI. They supersede all prior and contemporaneous communications, whether electronic, oral, or written, between you and Chronilogix in respect of the Service.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "16.2",
          heading: "Severability",
          blocks: [
            {
              type: "list",
              items: [
                "If any provision of these Terms is found by a court of competent jurisdiction to be invalid, illegal, or unenforceable, that invalidity, illegality, or unenforceability will not affect the remaining provisions, which remain in full force and effect. The invalid or unenforceable provision will be replaced by a valid and enforceable provision that most closely approximates the intent and economic effect of the original.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "16.3",
          heading: "Assignment",
          blocks: [
            {
              type: "list",
              items: [
                "You may not assign or transfer these Terms, or any right or obligation under them, by operation of law or otherwise, without our prior written consent. Any attempt to assign or transfer without that consent is null and void. Chronilogix may freely assign or transfer these Terms without restriction. Subject to the foregoing, these Terms bind and inure to the benefit of the parties, their successors, and their permitted assigns.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "16.4",
          heading: "Waiver",
          blocks: [
            {
              type: "list",
              items: [
                "No waiver of any term or condition set out in these Terms shall be deemed a further or continuing waiver of that term or condition, or a waiver of any other term or condition, and any failure by Chronilogix to assert a right or provision under these Terms does not constitute a waiver of that right or provision. A waiver is effective only if made in writing and signed by a duly authorized representative of Chronilogix, Inc. Except as expressly set out in these Terms, a party’s exercise of any of its remedies under these Terms is without prejudice to its other remedies under these Terms or otherwise.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "16.5",
          heading: "Force majeure",
          blocks: [
            {
              type: "list",
              items: [
                "Chronilogix will not be liable for any delay or failure in performance resulting directly or indirectly from events or causes beyond its reasonable control, including without limitation acts of God, war, riot, fire, flood, sabotage, terrorism, epidemics, pandemics, accidents, government orders or regulations, or any other cause beyond its reasonable control.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "16.6",
          heading: "Headings",
          blocks: [
            {
              type: "list",
              items: [
                "The headings in these Terms are for convenience only and do not affect their interpretation.",
              ],
            },
          ],
        },
        {
          type: "sub",
          label: "16.7",
          heading: "Notices",
          blocks: [
            {
              type: "list",
              items: [
                "Any notice or other communication provided by Chronilogix under these Terms, including notice of a modification to these Terms, will be given either (i) by email to the address associated with your account, or (ii) by posting to the Service. For notice given by email, the date of receipt is deemed to be the date on which the message is transmitted.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "contact",
      label: "17",
      heading: "Contact information",
      blocks: [
        {
          type: "para",
          text: "If you have any question about these Terms, about the practices of Chronilogix, Inc., or about your dealings with Chronilogix AI, or if you wish to report abuse, a violation of these Terms, or objectionable content, please contact us at:",
        },
        { type: "address", ...ADDRESS },
      ],
    },
  ],
};

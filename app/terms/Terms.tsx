/* eslint-disable react/no-unescaped-entities */
"use client";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import { useEffect } from "react";

const Wrapper = styled(Container)`
  max-width: 770px;
  line-height: 1.5;
  letter-spacing: 0.25px;
  h1.title {
    font-size: 2rem;
    font-weight: 700;
  }
  h2.title {
    font-size: 1.5rem;
    font-weight: 700;
  }
  .heading {
    font-size: 1.25rem;
    font-weight: 700;
  }
  p {
    font-size: 1.125rem;
  }
  a {
    color: ${({ theme }) => theme.colors.yellow};
  }
`;

const HeaderWrapper = styled.div`
  padding: 1rem;
  min-height: 70vh;
`;

function Terms() {
  useStartPageFromTop();

  useEffect(() => {
    // Handle anchor scroll when component mounts
    const handleAnchorScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        // Wait for DOM to be ready
        setTimeout(() => {
          // Remove the # from the hash to get the raw ID
          const id = hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            const headerOffset = 110; // Adjust this value based on your header height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    };

    handleAnchorScroll();
    window.addEventListener("hashchange", handleAnchorScroll);

    return () => window.removeEventListener("hashchange", handleAnchorScroll);
  }, []);

  return (
    <HeaderWrapper>
      <Wrapper className="content-hfill">
        <h1 className="title mt-5 mb-3">
          <strong>Terms &amp; Conditions: ZMZ&rsquo;s User Agreement</strong>
        </h1>

        <p className="fw-400">
          This User Agreement describes the terms and conditions which you
          accept by using our Website or our Services. We may have incorporated
          by reference some linked information.
        </p>

        <h2 className="title mt-4 mb-3">In this User Agreement:</h2>
        <p>
          <strong>"Account"</strong>
          <span className="fw-400">
            &nbsp;means the account associated with your email address.
          </span>
        </p>
        <p>
          <strong>"Client"</strong>
          <span className="fw-400">
            &nbsp; means a User that purchases Freelancer Services from
            Freelancers or identifies as an Client through the website. A User
            may be both a Client and a Freelancer under this agreement.
          </span>
        </p>
        <p>
          <strong>"Dispute Resolution Process"</strong>
          <span className="fw-400">
            &nbsp;means the process to be followed by Clients and Freelancers in
            accordance with the Dispute Resolution Services.
          </span>
        </p>
        <p>
          <strong>"Zehmizeh,"</strong>
          <span className="fw-400">&nbsp;</span>
          <strong>"we,"</strong>
          <span className="fw-400">&nbsp;</span>
          <strong>"our,"</strong>
          <span className="fw-400">&nbsp;</span>
          <strong>"company,"</strong>
          <span className="fw-400">&nbsp;</span>
          <strong>"the company,"</strong>
          <span className="fw-400">&nbsp;or&nbsp;</span>
          <strong>"us"</strong>
          <span className="fw-400">&nbsp;means Zehmize Inc. DBA Zehmizeh</span>
        </p>
        <p>
          <strong>"Inactive Account"</strong>
          <span className="fw-400">
            &nbsp;means a User Account that has not been logged into for a
            6-month period or other period determined by us from time to time.
          </span>
        </p>
        <p>
          <strong>"Intellectual Property Rights"</strong>{" "}
          <span className="fw-400">
            means all patent rights, copyright rights, moral rights, rights of
            publicity, trademark, trade dress and service mark rights, goodwill,
            trade secret rights and other intellectual property rights as may
            now exist or hereafter come into existence, and all applications
            therefore and registrations, renewals, and extensions thereof, as
            well as any materials which would qualify for such legal
            protections, in each case, under the laws of any state, country,
            territory or other jurisdiction.
          </span>
        </p>
        <p>
          <strong>"ZMZ Payment"</strong>
          <span className="fw-400">
            &nbsp;means a payment made by the Client for the provision of
            Freelancer Services under a User Contract and which will be released
            in accordance with the section "ZMZ Payments" of these terms and
            conditions.
          </span>
        </p>
        <p>
          <strong>"Project"</strong>
          <span className="fw-400">
            &nbsp;means a project offered or awarded by an Client via the
            Website, which may include a Project listed by an Client, a Project
            awarded by an Client, or a service bought by an Client from a
            Freelancer.
          </span>
        </p>
        <p>
          <strong>"Freelancer"</strong>
          <span className="fw-400">
            &nbsp;means a User that offers and provides services or identifies
            as a Freelancer through the Website. A User may be both a Client and
            a Freelancer under this agreement.
          </span>
        </p>
        <p>
          <strong>"Freelancer Services"</strong>
          <span className="fw-400">
            &nbsp;means all services provided by a Freelancer.
          </span>
        </p>
        <p>
          <strong>"Zehmizeh Services"</strong>
          <span className="fw-400">
            &nbsp;means all services provided by us to you.
          </span>
        </p>
        <p>
          <strong>"User,"</strong>
          <span className="fw-400">&nbsp;</span>
          <strong>"you"</strong>
          <span className="fw-400">&nbsp;or&nbsp;</span>
          <strong>"your"</strong>
          <span className="fw-400">
            &nbsp;means an individual who visits or uses the Website.
          </span>
        </p>
        <p>
          <strong>"User Contract"</strong>
          <span className="fw-400">
            &nbsp;means: (1) this User Agreement; (2) any other contractual
            provisions accepted by both the Client and Freelancer uploaded to
            the Website, to the extent not inconsistent with the User Agreement;
            (3) the Project terms as awarded and accepted on the Website, to the
            extent not inconsistent with the User Agreement; and (4) any other
            material incorporated by reference from time to time.
          </span>
        </p>
        <p>
          <strong>"Website"</strong>
          <span className="fw-400">
            &nbsp;means the Websites operated by Zehmizeh and any of its
            regional or other domains or properties, and any related Zehmizeh
            service, tool or application, specifically including mobile web, any
            iOS App, any Android App, or another access mechanism.
          </span>
        </p>

        <h2 className="title mb-3" id="1">
          1. Overview
        </h2>

        <p>
          By accessing the Website, you agree to the following terms with
          Zehmizeh.
        </p>

        <p>
          We may amend this User Agreement and any linked information from time
          to time by posting amended terms on the Website, without notice to
          you.
        </p>
        <p>
          The Website is an online venue where Users buy and sell Freelancer
          Services. Clients and Freelancers must register for an Account in
          order to buy or sell Freelancer Services. The Website enables Users to
          work together online to complete and pay for Projects and to use the
          services that we provide. We are not a party to any contractual
          agreements between Client and Freelancer in the online venue; we
          merely facilitate connections between the parties.
        </p>
        <p>
          We may, from time to time, and without notice, change or add to the
          Website or the information, products or services described in it.
          However, we do not undertake to keep the Website updated. We are not
          liable to you or anyone else if any error occurs in the information on
          the Website or if that information is not current.
        </p>

        <h2 className="title mb-3" id="2">
          2. Scope
        </h2>

        <p>
          Before using the Website, you must read the whole User Agreement, the
          Website policies and all linked information.
        </p>
        <p>
          <span className="fw-400">
            You must read and accept all of the terms in and linked to this User
            Agreement, the Zehmizeh Privacy Policy and all Website policies. By
            accepting this User Agreement as you access our Website, you agree
            that this User Agreement will apply whenever you use the Website and
            when you use the tools we make available to interact with the
            Website. Some Websites may have additional or other terms that we
            provide to you when you use those services.
          </span>
        </p>

        <h2 className="title mb-3" id="3">
          3. Eligibility
        </h2>

        <p>You will not use the Website if you:</p>
        <ol>
          <li className="fw-400">
            are not able to form legally binding contracts;
          </li>
          <li className="fw-400">are under the age of 18;</li>
          <li className="fw-400">
            are a person barred from receiving and/or rendering services under
            the laws of United States or other applicable jurisdiction;
          </li>
          <li className="fw-400">are suspended from using the Website; or</li>
          <li className="fw-400">do not hold a valid email address.</li>
        </ol>
        <p>
          Login credentials should not be shared by users with others.
          Individuals associated with the accounts (both corporate and personal)
          will be held responsible for all actions taken by the account, without
          limitation.
        </p>
        <p>
          User acknowledges and agrees that where a business name or company
          name is associated with his/her Account, this User Agreement is a
          contract with the User as an individual and the business, and the User
          and Business are jointly and severally responsible and liable for all
          activity undertaken in respect of its/his/her Account.
        </p>
        <p>
          We may, at our absolute sole discretion, refuse to register any person
          or entity as a User.
        </p>
        <p>
          You cannot transfer or assign any rights or obligations you have under
          this agreement without prior written consent.
        </p>

        <h2 className="title mb-3" id="4">
          4. Using Zehmizeh
        </h2>

        <p>
          While using the Website, you will not attempt to or otherwise do any
          of the following:
        </p>
        <ol>
          <li className="fw-400">
            post content or items in inappropriate categories or areas on our
            Websites and services;
          </li>
          <li className="fw-400">
            infringe any laws, third party rights or our policies;
          </li>
          <li className="fw-400">
            fail to deliver payment for services delivered to you;
          </li>
          <li className="fw-400">
            fail to deliver Freelancer Services purchased from you;
          </li>
          <li className="fw-400">
            circumvent or manipulate our fee structure, the billing process, or
            fees owed to Zehmizeh;
          </li>
          <li className="fw-400">
            <span className="fw-400">post content that is unlawful, </span>
            <em>
              <span className="fw-400">unhalachik</span>
            </em>
            <span className="fw-400">
              , plagiarized, discriminatory, offensive, threatening, abusive,
              false, inaccurate, misleading, deceptive, defamatory, invasive of
              privacy, or offensive;
            </span>
          </li>
          <li className="fw-400">
            take any action that may undermine the feedback or reputation
            systems (such as displaying, importing or exporting feedback
            information or using it for purposes unrelated to the Website);
          </li>
          <li className="fw-400">
            transfer your Zehmizeh account (including feedback) and Username to
            another party without our consent;
          </li>
          <li className="fw-400">
            distribute or post spam, unsolicited or bulk electronic
            communications, chain letters, or pyramid schemes;
          </li>
          <li className="fw-400">
            distribute viruses or any other technologies that may harm Zehmizeh,
            the Website, or the interests or property of Zehmizeh users
            (including their Intellectual Property Rights, privacy, and
            publicity rights)
          </li>
          <li className="fw-400">
            download and aggregate listings from the Website for display with
            listings from other websites without our express written permission,
            "frame," "mirror," or otherwise incorporate any part of the Website
            into any other website without our prior written authorization;
          </li>
          <li className="fw-400">
            attempt to modify, translate, adapt, edit, decompile, disassemble,
            or reverse engineer any software programs used by us in connection
            with the Website;
          </li>
          <li className="fw-400">
            copy, modify, or distribute rights or content from the Website or
            Zehmizeh’s copyrights and trademarks;
          </li>
          <li className="fw-400">
            harvest or otherwise collect information about Users, including
            email addresses, without the Users’ consent; or
          </li>
          <li className="fw-400">
            use Zehmizeh to facilitate money exchanges, including, but not
            limited to, cryptocurrency (e.g., bitcoin).
          </li>
        </ol>

        <h2 className="title mb-3" id="5">
          5. Intellectual Property Rights Infringement
        </h2>

        <p>
          Zehmizeh does not check user uploaded/created content for violations
          of copyright or other rights. However, if you believe any content
          violates your copyright or a related exclusive right, you should
          follow the process below. Zehmizeh looks into reported violations and
          removes or disables content shown to be violating third party rights.
        </p>
        <p>
          In order to allow us to review your report promptly and effectively, a
          copyright infringement notice ("Notice") should include the following:
        </p>
        <ul>
          <li className="fw-400">
            Identification of your copyrighted work and what is protected under
            the copyright(s) that you are referring to;
          </li>
          <li className="fw-400">
            Your copyright certificate(s)/designation(s) and the type, e.g.,
            registered or unregistered;
          </li>
          <li className="fw-400">
            Proof of your copyrights ownership, such as the registration number
            or a copy of the registration certificate;
          </li>
          <li className="fw-400">
            A short description of how our user(s) allegedly infringe(s) your
            copyright(s);
          </li>
          <li className="fw-400">
            Clear reference to the materials you allege are infringing and which
            you are requesting to be removed, for example, the GIG® url, a link
            to the deliverable provided to a user, etc.;
          </li>
          <li className="fw-400">
            Your complete name, address, email address, and telephone number;
          </li>
          <li className="fw-400">
            A statement that you have a good faith belief that use of the
            material in the manner complained of is not authorized by the
            copyright owner, its agent, or the law;
          </li>
          <li className="fw-400">
            A statement made under penalty of perjury that the information
            provided in the notice is accurate and that you are the copyright
            owner or the owner of an exclusive right that is being infringed, or
            are authorized to make the complaint on behalf of the copyright
            owner or the owner of an exclusive right that is being infringed.
          </li>
          <li className="fw-400">Your electronic or physical signature</li>
        </ul>
        <p>
          If you fail to comply with all of the requirements of Section
          512(c)(3) of the DMCA, your DMCA Notice may not be effective.
        </p>
        <p>
          You can send your Notice to our designated DMCA / Copyright Claims
          Agent at:{" "}
          <a
            className="email-link"
            href="mailto:info@zehmizeh.com"
            target="blank"
          >
            info@zehmizeh.com
          </a>
        </p>
        <p>
          Note that we will provide the user who is allegedly infringing your
          copyright with information about the Notice and allow them to respond.
          In cases where sufficient proof of infringement is provided, we may
          remove or suspend the reported materials prior to receiving the user's
          response. In cases where the allegedly infringing user provides us
          with a proper counter-notification indicating that it is permitted to
          post the allegedly infringing material, we may notify you and then
          replace the removed or disabled material. In all such cases, we will
          act in accordance with 17 U.S.C Section 512 and other applicable laws.
        </p>
        <p>
          Please be aware that if you knowingly materially misrepresent that
          material or activity on the Website is infringing your copyright, you
          may be held liable for damages (including costs and attorneys' fees)
          under Section 512(f) of the DMCA and your Zehmizeh account may be
          terminated.
        </p>
        <p>COUNTER-NOTIFICATION PROCEDURES:</p>
        <p>
          If you believe that material you posted on the site was removed or
          access to it was disabled due to mistake or misidentification, you may
          file a counter-notification with us (a "Counter-Notice") by submitting
          a written notification to our DMCA / Copyright Claims agent
          (identified above). Pursuant to the DMCA, the Counter-Notice must
          include substantially the following:
        </p>
        <ul>
          <li className="fw-400">Your physical or electronic signature.</li>
          <li className="fw-400">
            An identification of the material that has been removed or to which
            access has been disabled and the location at which the material
            appeared before it was removed or access disabled.
          </li>
          <li className="fw-400">
            Adequate information by which we can contact you (including your
            name, postal address, telephone number and, if available, e-mail
            address).
          </li>
          <li className="fw-400">
            A statement under penalty of perjury by you that you have a good
            faith belief that the material identified above was removed or
            disabled as a result of a mistake or misidentification of the
            material to be removed or disabled.
          </li>
          <li className="fw-400">
            A statement that you will consent to the jurisdiction of the Federal
            District Court for the judicial district in which your address is
            located (or if you reside outside the United States for any judicial
            district in which the Website may be found) and that you will accept
            service from the person (or an agent of that person) who provided
            the Website with the complaint at issue.
          </li>
        </ul>
        <p>
          The DMCA allows us to restore the removed content if the party filing
          the original DMCA Notice does not file a court action against you
          within ten business days of receiving the copy of your&nbsp;
          <strong>Counter-Notice</strong>. Please be aware that if you knowingly
          materially misrepresent that material or activity on the Website was
          removed or disabled by mistake or misidentification, you may be held
          liable for damages (including costs and attorneys' fees) under Section
          512(f) of the DMCA.
        </p>
        <p>TRADEMARK INFRINGEMENT</p>
        <p>
          Zehmizeh does not check user uploaded/created content for violations
          of trademark or other rights. However, if you believe any of the
          uploaded content violates your trademark, you should follow the
          process below. Zehmizeh looks into reported violations and removes or
          disables content shown to be violating third-party trademark rights.
        </p>
        <p>
          In order to allow us to review your report promptly and effectively, a
          trademark infringement notice ("TM Notice") should include the
          following:
        </p>
        <ul>
          <li className="fw-400">
            Identification of your trademark and the goods/services for which
            you claim trademark rights;
          </li>
          <li className="fw-400">
            Your trademark registration certificate and a printout from the
            pertinent country's trademark office records showing current status
            and title of the registration. Alternatively, a statement that your
            mark is unregistered, together with a court ruling confirming your
            rights;
          </li>
          <li className="fw-400">
            A short description of how our user(s) allegedly infringe(s) your
            trademark(s);
          </li>
          <li className="fw-400">
            Clear reference to the materials you allege are infringing and which
            you are requesting to be removed;
          </li>
          <li className="fw-400">
            Your complete name, address, email address, and telephone number;
          </li>
          <li className="fw-400">
            A statement that you have a good faith belief that use of the
            material in the manner complained of is not authorized by the
            trademark owner, its agent, or the law;
          </li>
          <li className="fw-400">
            A statement made under penalty of perjury that the information
            provided in the notice is accurate and that you are the trademark or
            are authorized to make the complaint on behalf of the trademark
            owner; and
          </li>
          <li className="fw-400">Your electronic or physical signature.</li>
        </ul>
        <p>
          You can send your Notice to:{" "}
          <a
            className="email-link"
            href="mailto:info@zehmizeh.com"
            target="blank"
          >
            info@zehmizeh.com
          </a>
        </p>
        <p>
          Note that we will provide the user who is allegedly infringing your
          trademark with information about the TM Notice and allow them to
          respond. In cases where sufficient proof of infringement is provided,
          we may remove or suspend the reported materials prior to receiving the
          user's response. In cases where the allegedly infringing user provides
          us with information indicating that it is permitted to post the
          allegedly infringing material, we may notify you and then replace the
          removed or disabled material. In all such cases, we will act in
          accordance with applicable law.
        </p>

        <p>REPEAT INFRINGERS</p>

        <p>
          It is our policy in appropriate circumstances to disable and/or
          terminate the accounts of users who are repeat infringers.
        </p>
        <p>
          It is our policy to respond to clear notices of alleged intellectual
          property rights infringement. Our Copyright Infringement Policy is
          designed to make submitting notices of alleged infringement to us as
          straightforward as possible while reducing the number of notices that
          we receive that are fraudulent or difficult to understand or verify.
          If you believe that your intellectual property rights have been
          violated, please notify us and we will investigate. However, we take
          no responsibility for intellectual property infringements and will not
          be liable for such infringements by users; our commitment to
          investigate allegations of infringements and remove content we believe
          infringes another party’s intellectual property rights is merely a
          courtesy to our users.
        </p>

        <h2 className="title mb-3" id="6">
          6. Taxes
        </h2>

        <p>
          You are responsible for paying any taxes, including any goods and
          services or value-added taxes, which may be applicable depending on
          the jurisdiction of the services provided.
        </p>
        <p>
          You acknowledge that you must comply with your obligations under
          income tax provisions in your jurisdiction.
        </p>

        <h2 className="title mb-3" id="7">
          7. Payment Administration Agent
        </h2>

        <p>
          You acknowledge and agree that we may in our sole discretion, from
          time to time, appoint our related bodies, corporate affiliates, or any
          other third party to act as our agent to accept or make payments
          (including merchant facilities) from or to Users on our behalf.
        </p>
        <p>
          Such a third party will have the same rights, powers, and privileges
          that we have under this User Agreement and will be entitled to
          exercise or enforce their rights, powers, and privileges as our agent
          or in their own name. In no event shall we be liable to any User for
          any loss, damage, or liability resulting from the Payment
          Administration Agent's negligence and/or acts beyond the authority
          given by Zehmizeh.
        </p>

        <h2 className="title mb-3" id="8">
          8. Promotion
        </h2>

        <p>
          We may display your company or business name, logo, images, or other
          media as part of the Zehmizeh Services and/or other marketing
          materials relating to the Website, except where you have explicitly
          requested that we do not do so and we have agreed to such a request in
          writing.
        </p>
        <p>
          You acknowledge that we may use the public description of your
          Projects and the content of your profile information on the Website
          for marketing and other related purposes.
        </p>

        <h2 className="title mb-2" id="9">
          9. Privacy Policy
        </h2>

        <p>
          The Privacy Policy describes the types of information we may collect
          from you, or that you may provide, when you access Zehmizeh. This
          Policy does not apply to information collected by any third party,
          including through any external website that may link to or be
          accessible from the site. Please check directly with each such third
          party to avoid unfair surprises and misunderstandings.
        </p>
        <p>
          <u>What information we collect</u>
        </p>
        <p>
          We may collect several types of information from and about users of
          our Site, including personal information (such as first name, last
          name, email, phone number, university, resume, payment details, login,
          password) and voluntary data (information you voluntarily provide when
          you contact us for any reason, upload or otherwise send us).
        </p>
        <p>
          We collect this information directly from you when you provide it to
          us as well as automatically as you navigate through the site.
        </p>
        <p>
          <u>How we use your information</u>
        </p>
        <p>
          We use information that we collect about you or that you provide to
          us, including any personal information to provide the services you
          requested, notify you about changes to our Site or any services we
          offer or provide through it, carry out our obligations and enforce our
          rights, and in any other way we may describe when you provide the
          information.
        </p>
        <p>
          <u>Disclosure of your information</u>
        </p>
        <p>
          We do not sell any of your personal information to 3rd parties. We may
          disclose personal information that we collect or you provide as
          described in this Policy:
        </p>
        <div className="ms-4">
          <span>
            a)&nbsp;&nbsp;To fulfill the purpose for which you provide it.
          </span>

          <br />
          <span>
            b)&nbsp;&nbsp;To contractors, service providers and other third
            parties we use to support our business.
          </span>

          <br />
          <span>
            c)&nbsp;&nbsp;To a buyer or other successor in the event of a
            merger, divestiture, restructuring, reorganization, dissolution or
            other sale or transfer of some or all of the Site's assets, whether
            as a going concern or as part of bankruptcy, liquidation or similar
            proceeding, in which personal information about our Site users is
            among the assets transferred.
          </span>

          <br />
          <span>
            d)&nbsp;&nbsp;We may, without restriction, disclose aggregated
            information about our users and information that does not identify
            any individual.
          </span>

          <br />
          <span>
            e)&nbsp;&nbsp;For any other purpose disclosed by us when you provide
            the information.
          </span>

          <br />
          <span>
            f)&nbsp;&nbsp;To comply with any court order, law or legal process,
            including to respond to any government or regulatory request.
          </span>

          <br />
          <span>
            g)&nbsp;&nbsp;If we believe disclosure is necessary or appropriate
            to protect the rights, property, or safety of the Site, our
            customers or others.
          </span>
        </div>
        <p className="mt-3">
          <u>Cookie Policy</u>
        </p>
        <p>
          Cookies are small text files which a website may put on your computer
          or mobile device when you first visit a site or page. The cookie will
          help our site, or another website, to recognize your device the next
          time you visit. For example, cookies can help us to remember your
          username and preferences, analyze how well our website is performing,
          or even allow us to recommend content we believe will be most relevant
          to you.
        </p>
        <p>We may use cookies for the following reasons and purposes:</p>
        <div className="ms-4">
          <p>
            a)&nbsp;To provide the service you have asked for.&nbsp;Some cookies
            are essential so you can navigate through the website and use its
            features. Without these cookies, we would not be able to provide the
            services you&rsquo;ve requested. For example, some cookies allow us
            to identify subscribers and ensure they can access the subscription
            only pages. If a subscriber opts to disable these cookies, the user
            will not be able to access all of the content that a subscription
            entitles them to. These cookies don't gather information about you
            that could be used for marketing or remembering where you've been on
            the internet. Essential cookies keep you logged in during your
            visit.
          </p>
          <p>
            b)&nbsp;To improve your browsing experience. These cookies allow the
            website to remember choices you make, such as your language or
            region and they provide improved features. These cookies will help
            remembering your preferences and settings, including marketing
            preferences, remembering if you've filled in certain forms, so
            you're not asked to do it again, remembering if you've been to the
            Site before and restricting the number of times you're shown a
            particular advertisement. We might also use these cookies to
            highlight Site services that we think will be of interest to you
            based on your usage of the website.
          </p>

          <p>
            c)&nbsp;Analytics.&nbsp;To improve your experience on our Site, we
            like to keep track of what pages and links are popular and which
            ones don't get used so much to help us keep our Site relevant and up
            to date. It's also very useful to be able to identify trends of how
            people navigate (find their way through) our Site and if they get
            error messages from web pages. This group of cookies, often called
            &ldquo;analytics cookies&rdquo; are used to gather this information.
            These cookies don't collect information that identifies you. The
            information collected is anonymous and is grouped with the
            information from everyone else&rsquo;s cookies. We can then see the
            overall patterns of usage rather than any one person&rsquo;s
            activity.
          </p>

          <p>
            d)&nbsp;To show advertising that is relevant to your interests. We
            may sell space on our Site to advertisers. The resulting ads often
            contain cookies. These cookies are used to deliver adverts more
            relevant to you and your interests. They are also used to limit the
            number of times you see an advertisement as well as help measure the
            effectiveness of the advertising campaign. They are usually placed
            by advertising networks with our permission. They remember that you
            have visited a website and this information is shared with other
            organizations such as advertisers.
          </p>
        </div>
        <p>
          <span className="fw-400">
            Most browsers allow you to turn off cookies. To do this, look at the
            &ldquo;help&rdquo; menu on your browser. Switching off cookies may
            restrict your use of the Site and/or delay or affect the way in
            which it operates.
          </span>
        </p>

        <p>
          <u>Data security</u>
        </p>

        <p>
          Personal information you provide to us is stored on a
          password-protected server accessible only by administrator. We use
          SSL. However, we cannot guarantee the security of your personal
          information transmitted to our Site because any transmission of
          information over the Internet has its inherent risks. Any transmission
          of personal information is at your own risk. We are not responsible
          for circumvention of any privacy settings or security measures
          contained on the Site. You are responsible for keeping your login
          credentials, if any, confidential.
        </p>

        <p>
          <u>Children&rsquo;s privacy</u>
        </p>

        <p>
          Our Site is not directed to children under the age of 18. We do not
          knowingly collect any personal information about children under the
          age of 18. If we obtain actual knowledge that we have collected
          personal information about a child under the age of 18, that
          information will be immediately deleted from our database.
        </p>
        <p>
          If a parent believes that his or her child has submitted personal
          information to us, he or she can contact us via e-mail. We will
          promptly delete the information upon learning that it relates to a
          child under the age of 18. Please note that it is possible some of
          this information may remain archived in web logs and backup archives
          after we delete the information from our active database.
        </p>

        <p>
          <u>International transfer</u>
        </p>

        <p>
          Your information, including Personal Information, may be transferred
          to — and maintained on — computers located outside of your state,
          province, country or other governmental jurisdiction where the data
          protection laws may differ than those from your jurisdiction.
        </p>

        <p>
          <u>EU users&rsquo; rights</u>
        </p>

        <p>
          This section of our Privacy Policy applies to the users of our
          platform in EU. We would like to inform you about your GDPR rights and
          how we safeguard them.
        </p>
        <div>
          <p>
            a)&nbsp;Your GDPR rights to be informed, to access, rectify, erase
            or restrict the processing of your personal information.&nbsp;You
            have the right to obtain free information about what personal data
            we have obtained about you, where it is stored, for how long, for
            what purposes it is used, and to whom it was disclosed. You have the
            right to have us, without undue delay, rectify of inaccurate
            personal data concerning you. That means you can request we change
            your personal data in our records, or have your incomplete personal
            data completed. You have the &ldquo;right to be forgotten,&rdquo;
            i.e., to have us delete your personal information, without undue
            delay, if the data is no longer necessary in relation to the
            purposes for which it was collected. However, GDPR gives us the
            right to refuse erasure if we can demonstrate compelling legitimate
            grounds for keeping your information.
          </p>
          <p>
            b)&nbsp;GDPR gives you the right to restrict the processing if any
            of the following applies:
          </p>
          <p>
            If you contest the accuracy of your personal data, we will restrict
            processing it for a period enabling us to verify its accuracy.
          </p>
          <p>
            The processing is unlawful and you oppose its erasure and request
            instead the restriction of its use.
          </p>
          <p>
            We no longer need your personal data for the purposes of the
            processing, but you require us to restrict processing for the
            establishment, exercise or defense of legal claims.
          </p>
          <p>
            You have objected to processing pursuant to Article 21(1) of the
            GDPR pending the verification whether our legitimate grounds
            override yours.
          </p>
        </div>
        <div>
          <p>
            c)&nbsp; Right to data portability. Upon request, we will provide
            you your personal data in our possession, in a structured, commonly
            used and machine-readable format. You have the right to transmit
            that data to another controller if doing so does not adversely
            affect the rights and freedoms of others.
          </p>
          <p>
            d)&nbsp;Right to object. You can object, on grounds relating your
            particular situation, at any time, to processing of your personal
            information, if based on point (e) or (f) of Article 6(1) of the
            GDPR. We will then have to stop processing, unless we can
            demonstrate compelling legitimate grounds for the processing. If you
            object to the processing for direct marketing purposes, we will have
            to stop processing for these purposes.
          </p>
          <p>
            e)&nbsp;Right to withdraw consent. GDPR grants you the right to
            withdraw your earlier given consent, if any, to processing of your
            personal data at any time.
          </p>
          <p>
            f)&nbsp;Rights related to automated decision making. As a
            responsible business, we do not rely on any automated decision
            making, such as profiling.
          </p>
        </div>
        <p>
          <u>Accessing and correcting your personal information</u>
        </p>
        <p>
          Please send us an e-mail to request access to, correct or delete any
          personal information that you have provided to us or to ask questions
          about this Privacy Policy. We reserve the right to refuse a request if
          we believe it would violate any law or cause the information to be
          incorrect. You can edit or delete your own information in your account
          settings.
        </p>

        <h2 className="title mb-3" id="10">
          10. Content
        </h2>

        <p>
          We do not claim ownership to your User Content; however, you grant us
          a non-exclusive, sublicensable, irrevocable, and royalty-free
          worldwide license under all copyrights, trademarks, patents, trade
          secrets, privacy and publicity rights, and other intellectual property
          rights, to use, reproduce, transmit, print, publish, publicly display,
          exhibit, distribute, redistribute, copy, comment on, modify, adapt,
          translate, create derivative works based upon, publicly perform, make
          available and otherwise exploit such User Content, in whole or in
          part, in all media formats now known or hereafter devised and on
          third-party sites and platforms in any number of copies and without
          limit as to time, manner of frequency of use, without further notice
          to you, and without the requirement of permission from or payment to
          you or any other person or entity.
        </p>
        <p>
          You acknowledge and agree that: (1) we act only as a forum for the
          online distribution and publication of User content. We make no
          warranty that User content is made available on the Website. We have
          the right (but not the obligation) to take any action deemed
          appropriate by us with respect to your User content; (2) we have no
          responsibility or liability for the deletion or failure to store any
          content, whether or not the content was actually made available on the
          Website; and (3) any and all content submitted to the Website is
          subject to our approval. We may reject, approve or modify your User
          content at our sole discretion.
        </p>
        <p>You represent and warrant that your content:</p>
        <ol>
          <li>
            will not infringe upon or misappropriate any copyright, patent,
            trademark, trade secret, or other intellectual property right or
            proprietary right or right of publicity or privacy of any person;
          </li>
          <li>will not violate any law or regulation;</li>
          <li>
            will not violate{" "}
            <em>
              <span>halacha</span>
            </em>
            <span>;</span>
          </li>
          <li>will not be defamatory or libelous;</li>
          <li>will not be obscene or contain pornography;</li>
          <li>
            will not include incomplete, false, or inaccurate information about
            Users or any other individual; and
          </li>
          <li>
            will not contain any viruses or other computer programming routines
            that are intended to damage, detrimentally interfere with,
            surreptitiously intercept or expropriate any system, data or
            personal information.
          </li>
        </ol>
        <p>
          You acknowledge and agree that we may transfer your personal
          information to a related body. If you wish to withdraw your consent,
          you acknowledge and agree that we may be unable to provide you with
          access to the Website and Zehmizeh Services and may close your
          Account.
        </p>
        <p>
          Information on the Website may contain information about legal,
          financial, health, and other matters. The information is not advice
          and should not be treated as such. You must not rely on the
          information on the Website as an alternative to professional advice.
          If you have specific questions about any matter, you should consult
          with a licensed professional. We take no responsibility for the
          accuracy, veracity or reliability of such information.
        </p>
        <p>
          We provide unmonitored access to third-party content, including User
          feedback and articles with original content and opinions (or links to
          such third-party content). We only act as a portal and have no
          liability based on, or related to, third-party content on the Website,
          whether arising under the laws of copyright or other intellectual
          property, breach of contract, defamation, libel, privacy, obscenity,
          or any other legal basis. We take no responsibility for the accuracy,
          veracity or reliability of such content.
        </p>
        <p>
          The Website may contain links to other third-party websites. We do not
          control the websites to which we link from the Website. We do not
          endorse the content, products, services, practices, policies or
          performance of the websites we link to from the Website. Use of
          third-party content and links to third-party content and/or websites
          is at your risk.
        </p>
        <p>
          In relation to deletion or hiding of any information or content, using
          the Website to delete, hide or otherwise dispose of information does
          not imply permanent deletion of content or information. Information
          may be retained, at our sole discretion, in compliance with company
          policy and to comply with record-keeping, regulatory, and law
          enforcement obligations.
        </p>

        <h2 className="title mb-3" id="11">
          11. Feedback, Reputation, and Reviews
        </h2>

        <p>
          You acknowledge that you transfer to Zehmizeh copyright to any
          feedback or reviews you leave consisting of comments and any rating(s)
          (e.g., quality, communication, etc.) together with any composite
          rating by us. You acknowledge that such feedback, reputation, and
          reviews belong solely to us, notwithstanding that we permit you to use
          it on our Website while you remain a User. You must not use, or deal
          with, such feedback, reputation, and reviews in any way inconsistent
          with our policies as posted on the Website from time to time without
          our prior written permission.
        </p>
        <p>
          You may not do (or omit to do) anything that may undermine the
          integrity of the Zehmizeh feedback system. We are entitled to suspend
          or terminate your Account at any time if we, in our sole and absolute
          discretion, are concerned by any feedback by you or about you, or your
          feedback rating, where we believe our feedback system may be
          subverted.
        </p>
        <p>
          Our feedback ratings belong to us and may not be used for any purpose
          other than facilitating the provision of Freelancer Services via the
          Website. You may not use your Freelancer or Client feedback
          (including, but not limited to, marketing or exporting any or all of
          your composite rating(s) or feedback comments) in any real or virtual
          venue other than a website operated by Zehmizeh or its related
          entities, without our written permission.
        </p>
        <p>
          Zehmizeh is not responsible and disclaims any and all liability for
          any harms resulting from feedback left by Users.
        </p>

        <h2 className="title mb-3" id="12">
          12. Advertising
        </h2>

        <p>
          Unless otherwise agreed with us, you must not advertise an external
          website, product or service on the Website. Any website address posted
          anywhere on the Website, including in a project post, project
          proposal, or other listing description must relate to a Project, user,
          or service being performed on the Website.
        </p>
        <p>
          We may display advertisements or promotions on the Website. You
          acknowledge and agree that we shall not be responsible for any loss or
          damage of any kind incurred by you as a result of the presence of such
          advertisements or promotions or any subsequent dealings with third
          parties. Furthermore, you acknowledge and agree that the content of
          any advertisements or promotions may be protected by copyrights,
          trademarks, service marks, patents, or other intellectual property or
          proprietary rights and laws. Unless expressly authorized by Zehmizeh
          or third-party right holders, you agree not to modify, sell,
          distribute, appropriate, or create derivative works based on such
          advertisement/promotions.
        </p>

        <h2 className="title mb-3" id="13">
          13. Communication With Other Users
        </h2>
        <p>
          While being a member of the site is free, ZehMizeh can only maintain
          its operations through transaction fees. When you use Zehmizeh to find
          a freelancer, we require you to use the Zehmizeh platform to pay that
          freelancer for any work they complete for you. Therefore, it is
          strictly against Halacha and our policy for freelancers and clients
          who find each other on ZehMizeh and conduct their business off the
          site.
        </p>
        <p>
          There is, of course, a limitation to this boundary. If a client and
          freelancer have been working together for at least two years (that is,
          two years since the freelancer was paid by that client) they can send
          an Off-Site Partnership Request. When this request is approved, these
          specific users can continue their working relationship without
          violating ZehMizeh's Terms of Service. This exemption applies only to
          the specific client-freelancer pair who have met these requirements
          and received approval - it does not extend to either user's
          relationships with other clients or freelancers on the platform, which
          must continue to be conducted through ZehMizeh.
        </p>
        <p>
          Attempting to bypass Zehmizeh's commission and payment structure by
          privately transacting with other Users is a violation of the law, this
          Agreement, and Halacha. Zehmizeh may take appropriate legal action to
          prevent such behavior. And may result in permanent account suspension.
          Zehmizeh’s election not to take action in response to a User’s
          circumvention or attempt at circumvention shall not be deemed a waiver
          of Zehmizeh's rights and shall not be interpreted as permission to act
          in such a manner.
        </p>
        <p>
          We may read, save, and monitor all correspondences, uploaded files,
          etc., posted to or communicated via the Website for the purpose of
          investigating fraud, regulatory compliance, risk management, and other
          related purposes.
        </p>

        <h2 className="title mb-3" id="14">
          14. Identity Verification Policy
        </h2>

        <p>
          You authorize us, directly or through third parties, to make any
          inquiries we consider necessary to validate your identity. You must,
          at our request: (1) provide further information to us, which may
          include your social security number, date of birth, and or other
          information that will allow us to identify you; (2) take steps to
          confirm ownership of your email address or financial instruments; or
          (3) verify your information against third party databases or through
          other sources.
        </p>
        <p>
          You must also, at our request, provide copies of identification
          documents (such as your passport or driver's license). We may also ask
          you to provide photographic identification holding your identification
          together with a sign with a code that we provide as an additional
          identity verification step. We also reserve the right to request a
          video interview with you to validate this information, your identity,
          your background, and your skills.
        </p>
        <p>
          We reserve the right to close, suspend, or limit access to your
          Account, the Website, and/or Zehmizeh Services in the event we are
          unable to obtain or verify to our satisfaction the information which
          we request under this section.
        </p>
        <p>
          We reserve the right to update your details on the website to match
          any identity documentation that has been provided. Disbursements such
          as wire transfers from the Website may only be made to the beneficiary
          matching your provided identity documents and account information.
        </p>

        <h2 className="title mb-3" id="15">
          15. User Services
        </h2>

        <p>
          Upon the Client awarding a Project to the Freelancer, and the
          Freelancer's acceptance on the Website, the Client and Freelancer will
          be deemed to have entered into a User Contract under which the Client
          agrees to purchase and the Freelancer agrees to deliver the Freelancer
          Services. You agree not to enter into any contractual provisions in
          conflict with the User Agreement.
        </p>
        <p>
          You are solely responsible for ensuring that you comply with your
          obligations to other Users. If you do not, you may become liable to
          that User. You must ensure that you are aware of any domestic laws,
          international laws, halacha, statutes, ordinances, and regulations
          relevant to you as an Client or Freelancer, or in any other uses you
          make of the Website.
        </p>
        <p>
          If another User breaches any obligation to you, you are solely
          responsible for enforcing any rights that you may have. For the
          avoidance of doubt, we have no responsibility for enforcing any rights
          under a User Contract.
        </p>
        <p>
          Each User acknowledges and agrees that the relationship between
          Clients and Freelancers is that of an independent contractor. Nothing
          in this User Agreement creates a partnership, joint venture, agency or
          employment relationship between Users. Nothing in this User Agreement
          shall in any way be construed as forming a joint venture, partnership
          or an employer-employee relationship between Zehmizeh and any User.
        </p>

        <h2 className="title mb-3" id="16">
          16. Special Provisions
        </h2>

        <p>Each User acknowledges:</p>
        <ol>
          <li>
            Zehmizeh does not review, approve, recommend, or verify any of the
            credentials, licenses, or statements of capability in relation to
            any Users of, or Projects listed on, the Website.
          </li>
          <li>
            Zehmizeh provides matchmaking and platform services only. Users
            agree that Zehmizeh has no liability for any other aspect of service
            delivery or interaction between Client and Freelancer. Zehmizeh is
            not a party to any disputes between Client and Freelancer, although
            we provide a limited dispute resolution mechanism to assist the
            parties in resolving issues.
          </li>
          <li>
            A User must never disclose personal details such as the User's name,
            street number, phone number or the email address in any Project
            description for any public communication on the Website.
          </li>
          <li>
            Zehmizeh may collect location-related data from you via technologies
            including but not limited to GPS, IP address location, Wi-Fi, and
            other methods. Each User specifically consents to this collection
            and sharing as part of this Agreement.
          </li>
        </ol>

        <h2 className="title mb-3" id="17">
          17. Funds
        </h2>

        <p>
          If your Account owes funds, we may take any of the following actions:
        </p>
        <ol>
          <li>
            set-off the negative amount with funds that you subsequently receive
            into your Account;
          </li>
          <li>
            reverse payments you have made from your Account to other User
            Accounts on the Website;
          </li>
          <li>
            deduct amounts you owe from money you subsequently add or receive
            into your Account; or
          </li>
          <li>
            immediately suspend or limit your Account until such time as your
            Account no longer has a negative amount.
          </li>
        </ol>
        <p>
          The above list is not exclusive; we reserve the right to collect any
          funds owed to us by any other legal means.
        </p>
        <p>You acknowledge and agree that:</p>
        <ol>
          <li>
            we are not a bank or other licensed financial institution and do not
            provide banking services or any financial services to you;
          </li>
          <li>
            the funds shown in your Account represent our unsecured obligations
            to you with respect to your rights to direct us to make payment in
            relation to the purchase and sale of Freelancer Services through the
            Website and provision of the Zehmizeh Services;
          </li>
          <li>
            to the extent that we are required to release funds from your
            Account to you, you will become our unsecured creditor until such
            funds are paid to you;
          </li>
          <li>
            we are not acting as a trustee or fiduciary with respect to such
            funds or payments;
          </li>
          <li>
            the amount of funds showing in your Account is not insured and is
            not a guaranteed deposit;
          </li>
          <li>
            funds may only be deposited to your Account or released from your
            Account by us and you must only use the mechanisms available on the
            Website to pay or receive funds in respect of Freelancer Services;
          </li>
          <li>
            any refunds required to be processed in your favor will be returned
            only to the source of the original deposit, and cannot be redirected
            to any other payment source;
          </li>
          <li>
            we may commingle your funds with funds of other Users and our own
            funds and such commingled funds could be used to pay other Users or
            for our general corporate purposes or otherwise, however, we will
            remain obligated to release or refund funds at your direction in
            accordance with this User Agreement.
          </li>
        </ol>

        <h2 className="title mb-3" id="18">
          18. Limits &amp; Fraud Prevention
        </h2>

        <p>
          We may, in our sole discretion, place a limit on any or all the funds
          in your Account (thereby preventing any use of the funds) if:
        </p>
        <ol>
          <li>
            we believe there may be an unacceptable level of risk associated
            with you, your Account, or any or all of your transactions
          </li>
          <li>
            we believe that the beneficiary of the payment is someone other than
            you;
          </li>
          <li>
            we believe that the payment is being made to a country where we do
            not offer our Service; or
          </li>
          <li>
            we are required to do so by law or applicable law enforcement
            agencies.
          </li>
        </ol>
        <p>
          If you are involved in a dispute and the dispute is not resolved in
          your favor, we may remove funds from your Account. We may also place a
          limit on your account in circumstances where we suspect you of
          fraudulent or other unacceptable behavior, while we investigate any
          such matter.
        </p>

        <h2 className="title mb-3" id="19">
          19. Inactive Accounts
        </h2>

        <p>We reserve the right to close an Inactive Account.</p>
        <p>
          We reserve the right to close an account with no or negative funds.
        </p>

        <h2 className="title mb-3" id="20">
          20. Right to Refuse Service
        </h2>

        <p>
          We may close, suspend or limit your access to your Account without
          reason. Without limiting the foregoing, we may close, suspend or limit
          your access to your Account:
        </p>
        <ol>
          <li>
            if we determine that you have breached or are acting in breach of
            this User Agreement;
          </li>
          <li>
            if you manipulate any Project process in an attempt to renegotiate
            the actual price privately, in an attempt to avoid fees;
          </li>
          <li>
            if we determine that you have infringed legal rights (resulting in
            actual or potential claims), including infringing Intellectual
            Property Rights;
          </li>
          <li>
            if we determine that you have engaged or are engaging in fraudulent
            or illegal activities
          </li>
          <li>if you do not respond to account verification requests;</li>
          <li>
            if you do not complete account verification when requested within 3
            months of the date of request;
          </li>
          <li>
            if you are the subject of a U.S., United Nations, EU or other
            applicable sanctions regime, or our banking and payment
            relationships otherwise preclude us from conducting business with
            you;
          </li>
          <li>
            to manage any risk of loss to us, a User, or any other person; or
          </li>
          <li>for other reasons, at our sole discretion.</li>
        </ol>
        <p>
          If we close your Account due to your breach of this User Agreement,
          you may also become liable for certain fees as described in this User
          Agreement.
        </p>
        <p>
          Without limiting our other remedies, to the extent you have breached
          this User Agreement, you must pay us all fees owed to us and reimburse
          us for all losses, costs (including any and all of our employee time)
          and expenses (including legal fees) related to investigating such
          breach and collecting such fees.
        </p>
        <p>
          You acknowledge and agree that: (1) the damages that we will sustain
          as a result of your breach of this User Agreement will be substantial
          and will potentially include (without limitation) fines and other
          related expenses imposed on us by our payment processors and Users and
          that those damages may be extremely difficult and impracticable to
          ascertain; (2) if you breach this User Agreement, we may fine you up
          to $10,000 for each breach and/or we may take legal action against you
          to recover losses that are in excess of the fine amount; (3) a fine of
          up to $10,000 is a reasonable pre-estimate or minimum estimate of our
          damages and is a reasonable amount for liquidated damages; and (4) we
          may release the entire (or part of the) amount of the fine from your
          Account to us.
        </p>
        <p>
          If we close your Account for a reason other than as a result of your
          breach of this User Agreement, unless as otherwise specified in this
          User Agreement, you will be entitled to receive any payment due from
          us to you.
        </p>
        <p>
          In the event that we close your Account, you will have no claim
          whatsoever against us in respect of any such suspension or termination
          of your Account.
        </p>

        <h2 className="title mb-3" id="21">
          21. ZMZ Payments
        </h2>

        <p>
          Subject to the User Contract, in some Projects, the Client can make a
          ZMZ Payment which will be locked from the Client's Account and cannot
          be claimed by the Freelancer until:
        </p>
        <ol>
          <li>
            the Client and Freelancer agree that the funds can be claimed by the
            Freelancer;
          </li>
          <li>
            if there is a dispute, the Client and Freelancer have concluded the
            Dispute Resolution Process and the Dispute is resolved in the
            Freelancer’s favor;
          </li>
          <li>
            the Client instructs us to pay a Freelancer for services performed
            by the Freelancer in respect of a Project; or
          </li>
          <li>
            the Client acknowledges that the Freelancer has completed the
            services fully and satisfactorily.
          </li>
        </ol>
        <p>
          If an Client does not approve of the Freelancer’s work product, the
          parties may elect to resolve the issue under the Dispute Resolution
          Process.
        </p>
        <p>
          If we have not received any instructions or dispute from an Client or
          Freelancer in respect of a ZMZ Payment within six months or any other
          reasonable length of time after the day that the ZMZ Payment was paid
          and the Client has not logged into their Account during that time, the
          ZMZ Payment will be unlocked and released back to the Client.
        </p>

        <h2 className="title mb-3" id="22">
          22. Requirements for Californian Users and ZMZ Payments
        </h2>

        <p>
          In the state of California, ZMZ Payments are regarded as regulated
          escrow activity.
        </p>
        <p>
          This Section deals with and applies to ZMZ Payments that are connected
          to California, i.e. where a User, being a Client or a Freelancer, is
          ordinarily a resident in California (&ldquo;California
          User(s)&rdquo;).
        </p>
        <p>
          So that we can continue to serve our California Users, we will
          facilitate escrow transactions on behalf of a Client and/or Freelancer
          either of whom is a California User, and to hold the funds in relation
          to any Project. Until further notice, there will be no additional fees
          for facilitating an escrow transaction initiated as a result of this
          Section.
        </p>
        <p>
          <strong>
            Accepted Currencies for ZMZ Payments and California Users
          </strong>
        </p>
        <p>
          We currently support Transactions only in U.S. Dollars. If a Client's
          Payment Method is denominated in a currency other than the supported
          currencies, a currency conversion will be required for the payment to
          be made.
        </p>
        <p>
          These foreign currency conversion rates adjust regularly based on
          market conditions. Wholesale currency conversion rates at which
          Zehmizeh or our Affiliates obtain foreign currency will usually be
          different than the foreign currency conversion rates offered on the
          Site. Each User, in its sole discretion and risk, may authorize the
          charge, debit, or credit of its Payment Method in a supported foreign
          currency and the conversion of the payment to one of the supported
          currencies at the foreign currency conversion rate displayed on the
          Site. A list of supported foreign currencies is available on the Site.
          The User's Payment Method provider may also charge fees directly to
          the Payment Method even when no currency conversion is involved. The
          User's authorization of a payment using a foreign currency conversion
          rate displayed on the Site is at the User's sole risk. Zehmizeh is not
          responsible for currency fluctuations that occur when billing or
          crediting a Payment Method denominated in a currency other than one of
          the Supported Currencies. Zehmizeh is not responsible for currency
          fluctuations that occur when receiving or sending payments to and from
          the Escrow Account.
        </p>
        <p>
          <strong>Release and Delivery of Amounts in Escrow</strong>
        </p>
        <p>
          Clients and Freelancers in a California Transaction irrevocably
          authorize and instruct the escrow agent to release applicable portions
          of the ZMZ Payment in an Escrow Account (each portion, a
          &ldquo;Release&rdquo;) to their Freelancer Escrow Account or, in the
          event of a refund, the Client Escrow Account, as applicable, upon the
          occurrence of and in accordance with one or more Release Conditions
          provided below or as otherwise required by applicable law or the Terms
          of Service. The amount of any Release will be delivered to the
          applicable Zehmizeh Account in accordance with Freelancer&rsquo;s or
          Client&rsquo;s authorization, as above, these Instructions, and
          General Escrow Instructions.
        </p>
        <p>
          As used in these Instructions, &ldquo;Release Condition&rdquo; means
          any of the following:
        </p>
        <ol>
          <li>Client clicks to release funds to Freelancer.</li>
          <li>
            Client does not take any action for 14 days from the date of a
            Freelancer’s Release request, in which case Freelancer and Client
            agree that Zehmizeh is authorized and irrevocably instructed to
            immediately release to Client the amount associated in the
            applicable ZMZ in connection with such Release request.
          </li>
          <li>
            Freelancer cancels the contract before a ZMZ Payment has been
            released to Freelancer, in which case the funds are to be returned
            to Client.
          </li>
          <li>
            Client and Freelancer have submitted joint written instructions for
            a Release to either Freelancer Escrow Account or Client Escrow
            Account, as applicable.
          </li>
          <li>
            Client and Freelancer agree to close the contract without release of
            funds, in which case the funds are to be returned to the Client.
          </li>
          <li>
            Client or Freelancer has failed to make its Arbitration payment
            pursuant to the Dispute Resolution Service, in which case the funds
            are released to the Party that has made its Arbitration Payment.
          </li>
          <li>
            Both Client and Freelancer have failed to timely submit to
            Arbitration for an unresolved Dispute as such term is defined in the
            Dispute Resolution Service, in which case the funds are released to
            the Client.
          </li>
          <li>
            Client or Freelancer has failed timely to respond to a Zehmizeh
            Dispute Resolution Service notification as required by the Dispute
            Resolution Service, in which case the funds are released to the User
            that has participated.
          </li>
          <li>
            Client or Freelancer otherwise has failed to comply with the Dispute
            Resolution Service, in which case the funds are to be released to
            the User that has complied with the Dispute Resolution Service.
          </li>
          <li>
            Submittal of a final award of an arbitrator appointed pursuant to
            the Dispute Resolution Service, in which case the funds will be
            released in accordance with such award.
          </li>
          <li>
            Issuance of the final order of a court of competent jurisdiction
            from which appeal is not taken, in which case the funds will be
            released in accordance with such order.
          </li>
          <li>
            Issuance of the final order of a Beth Din of competent jurisdiction
            from which appeal is not taken, in which case the funds will be
            released in accordance with such order.
          </li>
          <li>
            Zehmizeh believes, in our sole discretion, that fraud, non-payment,
            an illegal act, or a violation of this Agreement has been committed
            or is being committed or attempted, in which case Client and
            Freelancer irrevocably authorize and instruct Zehmizeh to take such
            actions as Zehmizeh deems appropriate in our sole discretion and in
            accordance with applicable law to prevent or remedy such acts,
            including without limitation to return the funds associated with
            such acts to their source of payment.
          </li>
        </ol>

        <h2 className="title mb-3" id="23">
          23. Disputes With Users
        </h2>

        <p>
          You acknowledge and agree that in the event that a dispute arises
          between you and another User in relation to any Project, you will
          first attempt to resolve any differences that you have in relation to
          such Project, including in relation to the quality of the services
          provided.
        </p>
        <p>
          If you continue to have any difficulties or problems in relation to a
          dispute with another User in relation to a Project we encourage you to
          contact us.
        </p>
        <p>
          You agree that any dispute arising between you and another User will
          be handled in accordance with this clause. Zehmizeh will have full
          rights and powers to make a binding determination for all such
          disputes. Upon receipt of a dispute, Zehmizeh shall have the right to
          request the Freelancer and the Client to provide documentation in
          support of their claim or position in relation to the dispute. You
          agree that Zehmizeh has absolute discretion to accept or reject any
          document provided. You also acknowledge that Zehmizeh is not a
          judicial or alternative dispute resolution institution and that we
          will make the determinations only as an ordinary reasonable person. In
          addition, we do not warrant that the documents provided by the parties
          to the dispute will be true, complete, or correct and you agree to
          indemnify and (to the maximum extent permitted by law) hold Zehmizeh
          and any of our affiliates harmless against any damages or liability
          you may suffer as a result of any documentation or material
          subsequently being found to be false or misleading.
        </p>
        <p>
          If Zehmizeh is holding a ZMZ Payment, we may freeze the funds pending
          a resolution of the dispute, and upon the dispute’s resolution
          unfreeze and distribute the funds in accordance with said resolution.
        </p>
        <p>
          In relation to disputes with any other users of the Website, you
          hereby agree to indemnify Zehmizeh from any and all claims, demands,
          and damages, actual and consequential, of every kind and nature, known
          and unknown, that are related to such a dispute, our determinations or
          the use of the ZMZ Dispute Resolution Services for ZMZ Payments and/or
          for Other Disputes.
        </p>
        <p>
          It is agreed by you that you will make every endeavor at fair play and
          post reasonable and fair demands/offers on your dispute. No conduct
          relating to threats, blackmail, or intimidation will be tolerated.
        </p>
        <p>
          A User found to be in breach of this Agreement or in violation of
          Zehmizeh’s policies and objectives during the ZMZ Dispute Resolution
          Service process may automatically lose the dispute in favor of the
          other party involved, regardless of the origin of the dispute. The
          User may also incur further disciplinary action.
        </p>

        <h2 className="title mb-3" id="24">
          {" "}
          24.Disputes With Us
        </h2>

        <p>
          If a dispute arises between you and Zehmizeh, our goal is to address
          your concerns immediately and, if we are unable to do so to your
          satisfaction, to provide you with a means of resolving the dispute
          quickly. We strongly encourage you to first contact us directly to
          seek a resolution.
        </p>
        <p>
          For any claim, Zehmizeh may elect to resolve the dispute in a
          cost-effective manner through binding arbitration before the Beth Din
          of America. Any judgment on the award rendered by the Beth Din or
          arbitrator may be entered in any court of competent jurisdiction.
        </p>
        <p>
          All claims you bring against Zehmizeh must be resolved in accordance
          with the terms of this Agreement. All claims filed or brought contrary
          to this Agreement shall be considered improperly filed and a breach of
          this Agreement. Should you file a claim contrary to the terms of this
          Agreement, Zehmizeh may recover its legal fees and costs (including
          in-house lawyers and paralegals).
        </p>
        <p>
          You agree that you will not pursue any claims arising under this User
          Agreement on a class or other representative basis and will not seek
          to coordinate or consolidate any arbitration or action hereunder with
          any other proceeding.
        </p>
        <p>
          If any proceeding by or against you is commenced under any provision
          of any bankruptcy or insolvency law, Zehmizeh will be entitled to
          recover all reasonable costs or expenses (including reasonable legal
          fees and expenses) incurred in connection with the enforcement of this
          Agreement.
        </p>
        <p>
          Zehmizeh's failure to act with respect to a breach by you or others
          does not waive our right to act with respect to subsequent or similar
          breaches.
        </p>

        <h2 className="title mb-3" id="25">
          25. Survival and Release
        </h2>

        <p>
          This agreement supersedes any other agreement between you and the
          Company. If any part of this document is found to be unenforceable,
          that part will be limited to the minimum extent necessary so that this
          document will otherwise remain in full force and effect. Our failure
          to enforce any part of this document is not a waiver of any of our
          rights to later enforce that part or any other part of this document.
          We may assign any of our rights and obligations under this document
          from time to time.
        </p>
        <p>
          If there is a dispute between participants on this site, or between
          users and any third party, you agree that the Company is under no
          obligation to become involved. If you have a dispute with one or more
          other users, you release the Company, its officers, employees, agents,
          and successors from claims, demands, and damages of every kind or
          nature, known or unknown, suspected or unsuspected, disclosed or
          undisclosed, arising out of or in any way related to such disputes
          and/or our Services. If you are a California resident, you shall and
          hereby do waive California Civil Code Section 1542, which says: "A
          general release does not extend to claims which the creditor does not
          know or suspect to exist in his or her favor at the time of executing
          the release, which, if known by him or her must have materially
          affected his or her settlement with the debtor."
        </p>

        <h2 className="title mb-3" id="26">
          26. Access and Interference
        </h2>

        <p>
          You agree that you will not use any robot, spider, scraper or other
          automated means to access the Website via any means, including for the
          avoidance of doubt access to our application programming interface,
          for any purpose without our express written permission.
        </p>
        <p>Additionally, you agree that you will not:</p>
        <ol>
          <li>
            take any action that imposes or may impose (in our sole discretion)
            an unreasonable or disproportionately large load on our
            infrastructure;
          </li>
          <li>
            interfere with, damage, manipulate, disrupt, disable, modify,
            overburden, or impair any device, software system or network
            connected to or used (by you or us) in relation to the Website or
            your Account, or assist any other person to do any of these things,
            or take any action that imposes, or may impose, in our discretion,
            an unreasonable or disproportionately large load on our
            infrastructure;
          </li>
          <li>
            copy, reproduce, modify, create derivative works from, distribute,
            or publicly display any content (except for your information) from
            the websites without the prior express written permission of
            Zehmizeh and the appropriate third party, as applicable;
          </li>
          <li>
            interfere or attempt to interfere with the proper working of the
            Websites, services or tools, or any activities conducted on or with
            the Websites, services or tools; or
          </li>
          <li>
            bypass our robot exclusion headers or other measures we may use to
            prevent or restrict access to the Website.
          </li>
        </ol>

        <h2 className="title mb-3" id="27">
          27. Closing Your Account
        </h2>

        <p>
          You may close your Account at any time. The option is located in the
          Account Settings.
        </p>
        <p>Account closure is subject to:</p>
        <ol>
          <li>not having any outstanding listings on the Website;</li>
          <li>
            resolving any outstanding matters (such as a suspension or
            restriction on your Account); and
          </li>
          <li>paying any outstanding fees or amounts owing on the Account.</li>
        </ol>
        <p>
          We may retain some of your personal information to satisfy regulatory
          requirements and our own external obligations. Closing your account
          does not necessarily delete or remove all the information we hold.
        </p>

        <h2 className="title mb-3" id="28">
          28. Indemnity
        </h2>

        <p>
          You will indemnify us (and our officers, directors, agents,
          subsidiaries, joint venturers, and employees) against any claim or
          demand, including legal fees and costs, made against us by any third
          party due to or arising out of your breach of this Agreement or your
          infringement of any law or the rights of a third party in the course
          of using or in connection with the Website and Zehmizeh Services.
        </p>
        <p>
          In addition, we can apply any funds in your Account against any
          liabilities you owe to us or loss suffered by us as a result of your
          non-performance or breach of this User Agreement.
        </p>

        <h2 className="title mb-3" id="29">
          29. Security
        </h2>

        <p>
          You must immediately notify us upon becoming aware of any unauthorized
          access or any other security breach to the Website, your Account or
          Zehmizeh Services and do everything possible to mitigate the
          unauthorized access or security breach (including preserving evidence
          and notifying appropriate authorities). Your User Account is yours
          only, and you must not share your password with others. You are solely
          responsible for securing your password. We will not be liable for any
          loss or damage arising from unauthorized access to your account
          resulting from your failure to secure your password.
        </p>

        <h2 className="title mb-3" id="30">
          30. No Warranty as to Each User's Purported Identity
        </h2>

        <p>
          We cannot and do not confirm each User's purported identity on the
          Website. We may but are not obligated to provide information about a
          User, such as a strength or risk score, geographical location, or
          third party background check or verification of identity or
          credentials. However, such information is based solely on data that a
          User submits, and we provide such information solely for the
          convenience of Users and the provision of such information is not an
          introduction, endorsement or recommendation by us.
        </p>

        <h2 className="title mb-3" id="31">
          31. No Warranty as to Content
        </h2>

        <p>
          The Website is a dynamic, time-sensitive Website. As such, information
          on the Website will change frequently. It is possible that some
          information could be considered offensive, harmful, inaccurate or
          misleading or mislabeled or deceptively labeled accidentally by us or
          accidentally or purposefully by a third party.
        </p>
        <p>
          Our Services, the Website and all content on it are provided on an
          &ldquo;as is,&rdquo; &ldquo;with all faults&rdquo; and &ldquo;as
          available&rdquo; basis and without warranties of any kind either
          express or implied. Without limiting the foregoing, we make no
          representation or warranty about:
        </p>
        <ol>
          <li>the Website or any Freelancer Services or Zehmizeh Services;</li>
          <li>
            the accuracy, reliability, availability, veracity, timeliness or
            content of the Website or any Freelancer Services or Zehmizeh
            Services;
          </li>
          <li>
            whether the Website or Freelancer Services or Zehmizeh Services will
            be up-to-date, uninterrupted, secure, error-free or non-misleading;
          </li>
          <li>whether defects in the Website will be corrected;</li>
          <li>
            whether the Website, the Freelancer Services or the Zehmizeh
            Services or any data, content or material will be backed up or
            whether business continuity arrangements are in place in respect of
            the Website, Freelancer Services or Zehmizeh Services;
          </li>
          <li>
            any third party agreements or any guarantee of business gained by
            you through the Website, Freelancer Services or Zehmizeh Services or
            us; or
          </li>
          <li>
            the Website, Freelancer Services or Zehmizeh Services or
            infrastructure on which they are based, being error or malicious
            code free, secure, confidential or performing at any standard or
            having any particular function.
          </li>
        </ol>
        <p>
          To every extent permitted by law, we specifically disclaim any implied
          warranties of title, merchantability, fitness for a particular
          purpose, quality, suitability and non-infringement.
        </p>

        <h2 className="title mb-3" id="32">
          32. Limitation of Liability
        </h2>

        <p>
          In no event shall we, our related entities, our affiliates or staff be
          liable, whether in contract, warranty, tort (including negligence), or
          any other form of liability, for:
        </p>
        <ol>
          <li>
            any indirect, special, incidental or consequential damages that may
            be incurred by you;
          </li>
          <li>
            any loss of income, business or profits (whether direct or indirect)
            that may be incurred by you; or
          </li>
          <li>
            any claim, damage, or loss that may be incurred by you as a result
            of any of your transactions involving the Website.
          </li>
        </ol>
        <p>
          The limitations on our liability to you above shall apply whether or
          not we, our related entities, our affiliates or staff have been
          advised of the possibility of such losses or damages arising.
        </p>
        <p>
          Notwithstanding the above provisions, nothing in this User Agreement
          is intended to limit or exclude any liability on the part of us and
          our affiliates and related entities where and to the extent that
          applicable law prohibits such exclusion or limitation.
        </p>

        <h2 className="title mb-3" id="33">
          33. Notices
        </h2>

        <p>
          Legal notices will be served to the email address you provide to
          Zehmizeh during the registration process. Notice will be deemed given
          24 hours after the email is sent, unless the sending party is notified
          that the email address is invalid or that the email has not been
          delivered. Alternatively, we may give you legal notice by mail to the
          address provided by you during the registration process. In such case,
          notice will be deemed given three days after the date of mailing.
        </p>

        <h2 className="title mb-3" id="34">
          34. Severability
        </h2>

        <p>
          The provisions of this User Agreement are severable, and if any
          provision of this User Agreement is held to be invalid or
          unenforceable, such provision may be removed and the remaining
          provisions will be enforced. This Agreement may be assigned by us to
          an associated entity at any time, or to a third party without your
          consent in the event of a sale or other transfer of some or all of our
          assets. In the event of any sale or transfer you will remain bound by
          this User Agreement.
        </p>

        <h2 className="title mb-3" id="35">
          35. Interpretation
        </h2>

        <p>
          Headings are for reference purposes only and in no way define, limit,
          construe or describe the scope or extent of such section.
        </p>

        <h2 className="title mb-3" id="36">
          36. No Waiver
        </h2>

        <p>
          Our failure to act with respect to an anticipated or actual breach by
          you or others does not waive our right to act with respect to
          subsequent or similar breaches. Nothing in this section shall exclude
          or restrict your liability arising out of fraud or fraudulent
          misrepresentation.
        </p>

        <h2 className="title mb-3" id="37">
          37. Communications
        </h2>

        <p>
          You consent to receive notices and information from us in respect of
          the Website and Services by electronic communication. You may withdraw
          this consent at any time, but if you do so we may choose to suspend or
          close your Account.
        </p>

        <h2 className="title mb-3" id="38">
          38. Additional Terms
        </h2>

        <p>
          It is important to read and understand all our policies as they
          provide the rules for trading on the Zehmizeh Website. In addition,
          there may be specific policies or rules that apply, and it is your
          responsibility to check our Help pages and policies to make sure you
          comply. Our policies, including all policies referenced in them, are
          part of this Agreement and provide additional terms and conditions
          related to specific services offered on our Websites.
        </p>
        <p>
          Each of these policies may be changed from time to time. Changes take
          effect when we post them on the Zehmizeh Website. When using
          particular services on our Website, you are subject to any posted
          policies or rules applicable to services you use through the Website,
          which may be posted from time to time. All such policies or rules are
          incorporated into this User Agreement.
        </p>

        <h2 className="title mb-3" id="39">
          39. General
        </h2>

        <p>
          <span className="fw-400">
            This Agreement and the Additional Terms set forth or referenced in
            Item 38 of this Agreement contain the entire understanding and
            agreement between you and Zehmizeh. The terms of the Agreement shall
            survive the Agreement and/or your use of Zehmizeh&rsquo;s services.
          </span>
        </p>

        <h2 className="title mb-3" id="40">
          40. Abusing Zehmizeh
        </h2>

        <p>
          Zehmizeh reserves to the greatest extent possible all rights, without
          limiting any other remedies, to limit, suspend or terminate our
          service(s) and or user account(s), suspend or ban access to our
          services, remove any content, and to take any and all technical or
          legal steps to ban users.
        </p>
        <p>
          Without limiting the reasons for taking the aforementioned actions,
          conduct giving rise to this response could include:
        </p>
        <ol>
          <li>
            use of our services for any illegitimate or non-bona fide purpose
          </li>
          <li>generating conflicts with other users</li>
          <li>generating potential legal liabilities</li>
          <li>infringing the intellectual property rights of third parties</li>
          <li>
            acting inconsistently with the letter or spirit of any of our
            policies
          </li>
          <li>
            abuse of any staff members including inappropriate or unreasonable
            communications
          </li>
          <li>consistently poor performance</li>
        </ol>

        <h2 className="title mb-3" id="41">
          41. Feedback
        </h2>

        <p>
          If you have any questions about this User Agreement or if you wish to
          report breaches of this User Agreement, please contact us by emailing
          us at&nbsp;
          <a
            className="email-link"
            href="mailto:info@zehmizeh.com"
            target="blank"
          >
            info@zehmizeh.com
          </a>
        </p>
        <p>
          <br />
          <br />
        </p>
      </Wrapper>
    </HeaderWrapper>
  );
}

export default Terms;

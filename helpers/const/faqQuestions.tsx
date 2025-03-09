import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const FAQ_QUESTIONS: Record<string, { question: string; answer: ReactNode }[]> = {
  basics: [
    {
      question: `How does ZehMizeh work? You're finding me a job?`,
      answer: (
        <div>
          <p>
            So ZehMizeh is not a recruitment agency. We're what's called a “freelancing marketplace,” - a platform where
            clients can hire professionals from different industries to complete short-term projects.
          </p>
          <br />
          <p>
            <u>
              <Link
                to="https://intercom.help/zehmizehfaq/en/articles/9491948-how-does-zehmizeh-work-you-re-finding-me-a-job"
                target="_blank"
              >
                How Projects on ZehMizeh Work
              </Link>
            </u>
          </p>
          <br />
          <b>Step 1:</b>
          <p className="mb-2">
            Clients post descriptions of the work they need to get done on the Project Board. Approved freelancers can
            see them by clicking the "Find Projects" button.
          </p>
          <b>Step 2:</b>
          <p className="mb-2">
            When a freelancer finds work they like the look of, they can submit a proposal, describing how they could
            help the client and how much money they would ask for to complete the project.
          </p>
          <b>Step 3:</b>
          <p className="mb-2">
            The client selects the proposal he likes most and hires that freelancer. Then, on the site, the freelancer
            completes the project and submits the work to the client.
          </p>
          <b>Step 4:</b>
          <p>The client sends money through the site directly to the freelancer's account.</p>
        </div>
      ),
    },
    {
      question: 'What kind of services or products can I sell on ZehMizeh?',
      answer: (
        <div>
          <p>
            Freelancers can sell any product or service <b>that can be delivered 100% remotely.</b> That means the
            entire project can be conducted and the final product can be delivered online.
          </p>
          <p className="mt-3">
            (ZehMizeh does NOT platform any platform or service{' '}
            <b>that requires meeting clients in person or sending a physical product in the mail.)</b>
          </p>
          <p className="mt-3">
            Our main service categories include:
            <ul>
              <li>Accounting/Financial Services</li>
              <li>Admin & Project Management</li>
              <li>Audio and Video</li>
              <li>Consulting and Business Strategy</li>
              <li>Customer Service and Sales</li>
              <li>Data and Analytics</li>
              <li>Design</li>
              <li>Engineering and Architecture</li>
              <li>IT, Network, and Software Implementation</li>
              <li>Legal Services</li>
              <li>Marketing and Branding</li>
              <li>Software, Mobile, and Web Development</li>
              <li>Translation</li>
              <li>Writing and Editing</li>
            </ul>
          </p>
        </div>
      ),
    },
    {
      question: 'How much does ZehMizeh cost?',
      answer: (
        <div>
          <p>
            To keep the website running, ZehMizeh takes a flat 9% from all transactions that take place on the site.
            (Freelancers can increase their fee to cover this charge.) There is no cost to being a member!
          </p>
        </div>
      ),
    },
    {
      question: 'After completing a project with a client, can we take the next project off ZehMizeh?',
      answer: (
        <div>
          <p>
            While being a member of the site is offered for free, ZehMizeh can only maintain its operations through the
            fees they charge on completed transactions. Therefore,{' '}
            <b>
              it is strictly against our policy for freelancers and clients to find each other on ZehMizeh and conduct
              their business off the site.
            </b>
          </p>
          <p className="mt-3">There is, of course, a limit on this policy. If two users:</p>
          <ul>
            <li>
              have been working together for at least two years, (that is, two years have passed since the freelancer
              was first hired)
            </li>
            <li>they have completed the first project, and</li>
            <li>the users have completed more than two projects together</li>
          </ul>
          <p>
            - they can send an Off-Site Partnership Request in order to take their working relationship off the website
            with ZehMizeh's approval. When this request is approved, users can legally and halachically continue their
            working relationship without violating ZehMizeh's Terms of Service.
          </p>
        </div>
      ),
    },
    {
      question: 'How can I freelance and hire freelancers from the same account?',
      answer: (
        <div>
          <p>
            Currently, this is not possible on ZehMizeh. Freelancers who also want to post projects use a second email
            account and make a client account.
          </p>
        </div>
      ),
    },
    {
      question: 'Can I freelance on ZehMizeh if I have another job?',
      answer: (
        <div>
          <p>
            Of course! One of the main reasons people freelance is to add a supplemental income on top of a normal
            salary, or to develop their skills as they try to transition to a new field. ZMZ is designed with this in
            mind, so users can participate as much or as little as they like. Users are not obligated to participate in
            any minimum amount of work.
          </p>
        </div>
      ),
    },
  ],
  signing_up_as_a_freelancer: [
    {
      question: 'What can clients see of my profile?',
      answer: (
        <div>
          <p>
            Clients can see all the content of your main profile page, your portfolio, and your ratings. (To see how it
            looks, click the “See Other Freelancer Profiles” button in the top-right of your profile page.)
          </p>
        </div>
      ),
    },
    {
      question: 'What should I write on my profile?',
      answer: (
        <div>
          <p>
            If you have trouble coming up with what to say, you can always look for inspiration from other freelancers.
          </p>
          <br />
          <p>
            There’s a button in the top-right corner of your profile page labeled “See Other Freelancer Profiles”... you
            can click there and consider the profiles that have been approved in the past.
          </p>
          <br />
          <p>(Tip: you can use the filters on the side to look for profiles that will be more similar to yours!)</p>
        </div>
      ),
    },
    {
      question: 'Can someone from the ZehMizeh staff fill out my profile for me?',
      answer: (
        <div>
          <p>
            No. We want ZehMizeh to be an even playing-field and we can’t give any individual an advantage. We encourage
            freelancers who are having a time filling out their profile to find inspiration from other freelancers.
          </p>
          <br />
          <p>
            There’s a button in the top-right corner of your profile page labeled “See Other Freelancer Profiles”... you
            can click there and consider the profiles that have been approved in the past.
          </p>
        </div>
      ),
    },
    {
      question: 'What do I do if I can’t find my skills on the skill list?',
      answer: (
        <div>
          <p>
            We can add them! Just send us a message through the Help Center (the yellow icon in the bottom corner) or as
            an inquiry (which you can submit by clicking the ‘Help’ option from the list at the top).
          </p>
          <br />
          <p>
            Note: ZehMizeh only platforms products and services <b>that can be delivered 100% remotely,</b> (that is -
            online). So if you want us to add a new type of graphic design to the list - we can do that! But we won’t be
            adding anything that requires users to meet in person or use physical mail - like physical therapy,
            catering, lifeguarding, etc.
          </p>
        </div>
      ),
    },
    {
      question: 'How long does it take for an account to be approved?',
      answer: (
        <div>
          <p>
            Usually no more than 1-2 business days. If you still haven’t been approved after that point, there’s
            probably an issue with your profile. See the article{' '}
            <u>
              <Link
                to="https://intercom.help/zehmizehfaq/en/articles/9491354-why-hasn-t-my-account-been-approved-yet"
                target="_blank"
              >
                Why hasn’t my account been approved yet?
              </Link>
            </u>{' '}
            to see why.
          </p>
        </div>
      ),
    },
    {
      question: 'Why hasn’t my account been approved yet?',
      answer: (
        <div>
          <b>Step 1.</b>
          <p className="mb-2">
            The first step to getting approved is filling out all of the required sections of your profile. If you’re
            not done yet, click the yellow bar in the bottom-left corner to see what you have left to finish.
          </p>
          <b>Step 2.</b>
          <p className="mb-2">
            If you have filled out all of these sections, wait up to one business day for a ZMZ employee to approve you.
          </p>
          <b>Step 3.</b>
          <p className="mb-2">
            If a business day has passed and you haven’t been approved, there is probably an issue with your profile.
            Consider these
          </p>
          <br />
          <b>6 Reasons You Haven’t Been Approved</b>
          <br />
          <div className="ms-3 mt-2">
            <b>1. Profile includes external links or contact info</b>
            <ul>
              <li>
                “Contact me at <b>lawyer@gmail.com</b>”
              </li>
              <li>
                “Visit my portfolio at <b>myportfolio.net</b>”
              </li>
            </ul>
            <p>To fix this, simply remove any external links or personal contact information.</p>
            <br />
            <b>2. Username is not a name</b>
            <p>
              Many of our freelancers use fake names to maintain their privacy. This is fine, as long as you’re using an
              actual name. Names like “MO CO” will no be approved; try “Moshe Cohen.”
            </p>
            <br />
            <b>3. Trying to sell services or products that ZMZ doesn’t platform</b>
            <ul>
              <li>“You can meet at my office for a consult…”</li>
              <li>“I’ll send you the finished product by mail…”</li>
            </ul>
            <p>
              ZehMizeh only platforms products and services that can be delivered on the website. That excludes physical
              items or services that require in-person meetings. To be approved, remove references to those.
            </p>
            <br />
            <b>4. Text is too vague</b>
            <ul>
              <li>“I do all kinds of projects!”</li>
              <li>“Anything you need!”</li>
            </ul>
            <p>Freelancers need to pick specific services to offer.</p>
            <br />
            <b>5. Poor English</b>
            <ul>
              <li>“Reliably and efficiency are my qualities.”</li>
            </ul>
            <p>
              There’s no need to make a profile in English if it’s not a strength of yours. We have many freelancers
              with Yiddish or Hebrew profiles… write your profile in the language most comfortable to you!
            </p>
            <br />
            <b>6. A section is not filled out</b>
            <p>If you put random text in a section, you will not be approved.</p>
          </div>
        </div>
      ),
    },
    {
      question: 'What’s the difference between a regular freelancer account and an agency account?',
      answer: (
        <div>
          <p>
            An agency account is shared by more than one person on a team, while a freelancer account is used by just
            one person.
          </p>
          <br />
          <p>You can change your account status on the ‘Account Settings’ section of your Profile pages.</p>
        </div>
      ),
    },
    {
      question: 'How can I change my email settings?',
      answer: (
        <div>
          <p>
            If you visit the “Account Settings” section of your profile pages, you’ll see an option near the bottom to
            change two of your email settings - how often you receive project board update emails and how often you
            receive alerts about unread messages.
          </p>
          <br />
          <p>
            There are only a few options currently, which we hope to expand soon. We’ll also be adding other email
            settings that can be personalized and adjusted.
          </p>
        </div>
      ),
    },
  ],
  stripe: [
    {
      question: 'Do I have to sign up for Stripe to freelance on ZehMizeh?',
      answer: (
        <div>
          <p>
            Yes. Currently, Stripe is our only payment delivery service and we can’t let someone sign up without a way
            of getting paid through the site.
          </p>
        </div>
      ),
    },
    {
      question: 'Can I be approved on Stripe even if I’m not American?',
      answer: (
        <div>
          <p>
            Yes! Any country which is on the list of options when you’re first registering can be approved on Stripe and
            on ZMZ. These countries are included:
          </p>
          <br />
          <ul>
            <li>United States</li>
            <li>Israel</li>
            <li>United Kingdom</li>
            <li>Canada</li>
            <li>Belgium</li>
            <li>South Africa</li>
            <li>Australia</li>
            <li>Austria</li>
            <li>Mexico</li>
            <li>France</li>
            <li>Germany</li>
            <li>Argentina</li>
            <li>Brazil</li>
            <li>Hungary</li>
            <li>Switzerland</li>
            <li>Panama</li>
            <li>New Zealand</li>
            <li>Gibraltar</li>
          </ul>
        </div>
      ),
    },
    {
      question: 'Where can I register for Stripe?',
      answer: (
        <div>
          <p>
            If you go to your profile pages, (by clicking your name in the top-right corner and then clicking
            ‘Profile’), you’ll see a section labeled ‘Payment Details’... click there and you’ll see the Stripe Account
            Details box.
          </p>
        </div>
      ),
    },
    {
      question: 'Will I be able to connect my Stripe account with ZehMizeh to my work bank account?',
      answer: (
        <div>
          <p>
            Yes! Once your identity is confirmed, Stripe will allow you to add whatever banking information you like.
          </p>
          <br />
          <p>(Note: Stripe with ZehMizeh only makes deposits - there is no ability to make withdrawals.)</p>
        </div>
      ),
    },
    {
      question: 'How do I connect my personal Stripe account to my Stripe account with ZehMizeh?',
      answer: (
        <div>
          <p>
            This isn’t an option on ZMZ. The type of Stripe service ZehMizeh users have is not the same as the normal
            individual’s Stripe account, so they are not compatible.
          </p>
          <br />
          <p>
            Stripe only serves to receive payments on ZehMizeh and deposit them directly in the freelancer’s bank
            account.
          </p>
        </div>
      ),
    },
    {
      question:
        'If I live and work in one country but have a bank account in another country, will I be able to have my payments sent to my bank account abroad?',
      answer: (
        <div>
          <p>
            Yes! During the Stripe registration process, all freelancers are asked to include a Preferred Banking
            Country. This is the country where you want your payments to be sent to… simply select the{' '}
            <b>country where your preferred bank account is</b> to have your fees sent there.
          </p>
        </div>
      ),
    },
    {
      question: 'For Americans: Do I have to give Stripe my Social Security Number to be approved?',
      answer: (
        <div>
          <p>Yes, (if you’re American). Stripe uses your SSN to confirm your identity and prevent fraud.</p>
        </div>
      ),
    },
    {
      question: 'For Americans: Can I use my EID instead of my SSN when registering for Stripe?',
      answer: (
        <div>
          <p>
            No. Stripe is using your SSN as a part of the verification process, unrelated to your banking info, so all
            freelancers need to confirm their identity with a SSN.
          </p>
        </div>
      ),
    },
    {
      question: 'How do I upload my Personal ID Document to Stripe?',
      answer: (
        <div>
          <p>
            If you’ve gotten to this point in the Stripe process, click ‘Edit’ next to your personal details. That
            should give you a place to upload your document.
          </p>
        </div>
      ),
    },
    {
      question:
        'Stripe is asking for a phone number to verify my identity, but my service does not receive texts… what should I do?',
      answer: (
        <div>
          <p>
            Unfortunately, to be approved for Stripe (which is part of getting approved on ZehMizeh), freelancers must
            go through this verification process. We recommend users without text temporarily borrow the phones of
            friends or family members with text in order to get verified.
          </p>
        </div>
      ),
    },
  ],
  getting_hired: [
    {
      question: 'How do I find projects that I want to do?',
      answer: (
        <div>
          <p>
            Click the yellow “Find Projects” button in the top right corner to see the projects currently available.
            There are filters on the left side of that page that you can use to narrow down the results according to
            your preferences!
          </p>
        </div>
      ),
    },
    {
      question: 'How long does it take clients to respond to proposals?',
      answer: (
        <div>
          <p>
            This is a difficult question to give a general answer for, since all clients are different. Even a single
            client could respond at different speeds at different times, depending on what’s going on in his life.
          </p>
          <br />
          <p>We can say this:</p>
          <ul>
            <li>
              For the majority of projects posts, clients hire <b>within two weeks</b> of posting the project. So if
              your proposal is already two weeks old and you haven’t heard anything, best not to hold your breath about
              it.
            </li>
            <li>
              Most clients so far tend not to decline proposals they’re not interested in… they simply hire someone
              else.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: 'This project post is unclear…how can I make an accurate proposal?',
      answer: (
        <div>
          <p>
            As many freelancers have experienced throughout their careers, clients often don’t know how to describe what
            they want. This is no different on ZehMizeh - some clients simply don’t know how to communicate what they’re
            after. This puts our freelancers in a bind… how to submit a proposal for a project whose details are uncear?
          </p>
          <br />
          <p>Freelancers have come up with a number of responses to this:</p>
          <ul>
            <li>
              Some will submit a price, but will include in their proposal description that their stated price is
              contingent upon clarifying details of the project.
            </li>
            <li>
              Some will submit a very low number - like $1 - simply to enter something, and will write in the
              description that they need to speak before the project to hammer out details.
            </li>
            <li>
              Others write a normal price for their service and use the ‘Questions’ box to share their concerns, or the
              ‘Special Terms and Conditions’ box to say they only agree to the project on the condition that they
              discuss in detail beforehand.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: 'How can I message a client without sending a proposal?',
      answer: (
        <div>
          <p>
            This is not an option on ZehMizeh, unless you are invited to the project directly by the client. In that
            case, you’ll be able to open a chat in response.
          </p>
          <br />
          <p>
            When you submit a proposal to a client, they can open a chat with any freelancer whose profile they find
            intriguing. (Often, they will not reach out to everyone who submitted a proposal.)
          </p>
        </div>
      ),
    },
    {
      question: 'Do I work on the project before or after submitting the proposal?',
      answer: (
        <div>
          <p>
            After. The proposal is like an application to get hired for the project… you don’t work on a job before
            you’re hired!
          </p>
          <br />
          <p>
            When it comes to project-based projects, even getting hired is not enough. You should first submit a
            milestone proposal and wait wait for the client to accept it before doing any work.
          </p>
        </div>
      ),
    },
    {
      question: 'Can I communicate with a client off of ZehMizeh?',
      answer: (
        <div>
          <p>
            We understand that our message system is still a work in progress and that some users will have an easier
            time communicating with their own emails or phones. It’s not against our policy for users to communicate off
            the platform if they respect the two core policies -
          </p>
          <br />
          <ol>
            <li>
              That all payments for the projects found on ZehMizeh take place on the site (or else there can’t be a
              site), and
            </li>
            <li>
              That freelancers not contract new projects with clients found on ZehMizeh until they’ve made an Off-Site
              Partnership Request, (or else there can’t be a site)
            </li>
          </ol>
          <p>
            <b>An Important Note:</b> In the case of a dispute of any kind, ZMZ can only respond to users’ claims based
            on what happened on the platform itself. So if a freelancer and client agreed to change an aspect of their
            contract on a call off the site, but then there was a disagreement about it later, ZMZ can only take action
            on the issue based on whatever was included in the ZMZ message system. Even screenshots of an email or
            Whatsapp conversation can’t be taken into consideration, since these are easy to forge.
          </p>
          <br />
          <p>(Baruch Hashem, we have not had any official disputes on the site so far.)</p>
        </div>
      ),
    },
    {
      question: 'How do I increase my chances of getting hired?',
      answer: (
        <div>
          <p className="mb-2">
            It’s impossible to say what every client wants, since they’re all different and have different priorities.
            One will pick the cheapest, one will pick the one with the highest rating or most completed projects… one
            could pick someone because they have the same last name.
          </p>
          <p>That being said, there are a few things freelancers can be careful of to improve their chances:</p>
          <br />
          <b>Don’t make it easy to reject you.</b>
          <p>
            Freelancers should remember that the clients may be receiving dozens of proposals for their project and they
            need some quick way of sorting through them. That makes it easy to reject proposals for light reasons, like
            seeing that you’ve used bad spelling or grammar; that you have no items in your portfolio; or that you
            haven’t included any details in your proposal. Be careful with these easy fixes!
          </p>
          <br />
          <b>Have a full profile.</b>
          <p>
            Some users have a full portfolio, an elegant logo for their profile photo, and a thorough list of all the
            skills they could think of. Not only does this make these freelancers easier for clients to find, but it
            also makes them more appealing in general. You can cut down their advantage by having a robust profile
            yourself.
          </p>
          <br />
          <b>Finish one project.</b>
          <p>
            It’s well-known that the first project is the hardest one to get. It’s easier for clients to pick someone
            who’s finished a project already and has a good rating, versus a user who has no history established on the
            site. To that end, some new users will look for a small project and offer a very cheap rate - cheaper than
            they would normally offer - simply to snag that first gig and invest in developing a record of good work.
          </p>
        </div>
      ),
    },
    {
      question: 'If I edit my proposal, will the client be notified?',
      answer: (
        <div>
          <p>
            When our notification system is completed, they will get a direct notification about it. For now, when a
            freelancer edits a proposal, there is a banner displayed across the top of it on the client’s side that
            indicates it was edited.
          </p>
        </div>
      ),
    },
    {
      question: 'What does “submitting a proposal” mean?',
      answer: (
        <div>
          <p>
            On ZehMizeh, clients come to share project posts that describe the project they’d like a freelancer to
            complete. Submitting a proposal is just another way of saying “applying for the position” - you formally
            send in your terms for completing the project and wait to see if the client is interested in hiring you.
          </p>
          <br />
          <p>
            To submit a proposal to a project, click on an interesting post from the “Find Projects” page. You’ll see a
            box at the top with the title of the project, the client’s name, and a yellow box that says “Submit
            Project.” Click that button and fill in the details of
          </p>
        </div>
      ),
    },
    {
      question: 'What is a project-based or hourly project?',
      answer: (
        <div>
          <p>
            A project-based project is one where the freelancer gets paid for completing the work, (either the whole
            project or pieces of it). An hourly project is one where the freelancer is paid according to the number of
            hours they worked.
          </p>
        </div>
      ),
    },
    {
      question: 'Can I stipulate that the client pay half up-front?',
      answer: (
        <div>
          <p>
            We have a section in the project proposal process called “Special Terms & Conditions,” where freelancers can
            add conditions like that to the project outline if they choose to.
          </p>
          <br />
          <p>
            On ZehMizeh, though, you may not need to. Most of the time, when a freelancer wants to be paid up front,
            they’re looking for a guarantee that the client won’t refuse to pay in the end. As long as freelancer is
            doing a project-based project, that’s not a concern.
          </p>
          <br />
          <p>
            After a freelancer has been hired for a project-based project and <b>before doing any work,</b> the
            freelancer submits what’s called a milestone proposal. This is like a mini-project proposal where the
            freelancer says what work they’ll do and for how much. They can divide a project into as many pieces a they
            like, or they can submit one milestone proposal for the whole budget.
          </p>
          <br />
          <p>
            The key is - when the client accepts the milestone proposal,{' '}
            <b>they are charged the full amount they promised to pay.</b> That amount is held by ZehMizeh, inaccessible
            to the client, held until the project is done. The client cannot “run off” with it so the freelancer has
            nothing to worry about.
          </p>
        </div>
      ),
    },
  ],
  working_a_project: [
    {
      question: 'What is a project-based or hourly project?',
      answer: (
        <div>
          <p>
            A project-based project is one where the freelancer gets paid for completing the work, (either the whole
            project or pieces of it). An hourly project is one where the freelancer is paid according to the number of
            hours they worked.
          </p>
        </div>
      ),
    },
    {
      question: 'What is a milestone? (For Project-Based projects)',
      answer: (
        <div>
          <p>
            A milestone is like a mini-project within your project - a commitment to do a certain amount of work in
            exchange for a certain percentage of the budget.
          </p>
          <br />
          <p>
            These are most helpful to any freelancer who’s working a large project and would like to get paid as they
            go. If you’re building a website, writing a book, or helping someone develop a new brand identity, you may
            not want to wait until the entire project is finished to get paid. By breaking down the project into pieces,
            you get to break down the budget into pieces too and get paid along the way.
          </p>
          <p>
            You don’t have to break the budget down, of course… if you’re fine with getting paid only when you’re
            finished, you can submit one milestone for the whole project and the whole budget.
          </p>
          <br />
          <p>
            <b>The most important thing to know</b> is that when a client accepts your milestone, they are{' '}
            <b>charged whatever they committed to pay you.</b> ZMZ holds that money while the freelancer works, so
            freelancers can feel secure that the client can’t back out on paying them.
          </p>
        </div>
      ),
    },
    {
      question: 'How do I submit a milestone?',
      answer: (
        <div>
          <p>
            A milestone is like a mini-project within your project - a commitment to do a certain amount of work in
            exchange for a certain percentage of the budget. For project-based projects,{' '}
            <b>you should not do any work until your client has accepted at least one milestone proposal.</b>
          </p>
          <br />
          <p>
            Navigate to your “My Projects” page from the list at the top. When you see your project list, click the
            project you want to work on.
          </p>
          <br />
          <p>
            When you’ve clicked on a project which you’ve been hired for already, you’ll see a tab on the project page
            called “Milestones.” Click that tab.
          </p>
          <br />
          <p>
            For a project-based project, you’ll see a yellow button that says “Propose Milestone.” Click that and fill
            out the all the required fields for milestone proposal. When you’re done, submit the milestone proposal. You
            can edit or cancel your proposal before the client responds.
          </p>
          <br />
          <p>
            When the client accepts your proposal, they are charged the amount of money you asked for. That money is
            held by ZMZ until you’ve finished the project. When you’ve submitted the completed work, the client has the
            money released and sent directly to your bank account!
          </p>
        </div>
      ),
    },
    {
      question: 'How do I leave a rating?',
      answer: (
        <div>
          <p>
            After the project is closed, visit the project's page from the "Closed" tab on your "My Projects" page.
            You'll see that the normal three project tabs - "Milestones," "Messages," and "Project Details," - is now
            joined by a fourth "Reviews" tab. Open this tab to see the client's rating and review and to leave your own.
          </p>
        </div>
      ),
    },
    {
      question: 'Do I submit milestones before or after I work on the project? (Project-Based)',
      answer: (
        <div>
          <p>
            Before! When a client accepts your milestone, they are <b>charged whatever they committed to pay you.</b>{' '}
            ZMZ holds that money while the freelancer works, so freelancers can feel secure that the client can’t back
            out on paying them.
          </p>
        </div>
      ),
    },
    {
      question: 'Do I submit hourly submissions before of after I’ve worked on the project?',
      answer: (
        <div>
          <p>After. The hours submission is based on the amount of time you’ve already worked.</p>
        </div>
      ),
    },
    {
      question: 'How do I change the budget after starting the project?',
      answer: (
        <div>
          <p>
            When you go to the project page in question, (by clicking the “My Projects” link at the top and finding it
            there), you’ll see the current budget displayed next to the word “Budget.” There’s a yellow “Change” button
            next to it - click there to adjust the budget.
          </p>
          <br />
          <p>
            Freelancers can lower the budget whenever they want. Clients have to consent to a budget increase, so
            freelancers submit a budget increase request for clients to take care of.
          </p>
        </div>
      ),
    },
    {
      question: 'Can I communicate with a client off of ZehMizeh?',
      answer: (
        <div>
          <p>
            We understand that our message system is still a work in progress and that some users will have an easier
            time communicating with their own emails or phones. It’s not against our policy for users to communicate off
            the platform if they respect the two core policies -
          </p>
          <br />
          <ol>
            <li>
              That all payments for the projects found on ZehMizeh take place on the site (or else there can’t be a
              site), and
            </li>
            <li>
              That freelancers not contract new projects with clients found on ZehMizeh until they’ve made an Off-Site
              Partnership Request, (or else there can’t be a site)
            </li>
          </ol>
          <p>
            <b>An Important Note:</b> In the case of a dispute of any kind, ZMZ can only respond to users’ claims based
            on what happened on the platform itself. So if a freelancer and client agreed to change an aspect of their
            contract on a call off the site, but then there was a disagreement about it later, ZMZ can only take action
            on the issue based on whatever was included in the ZMZ message system. Even screenshots of an email or
            Whatsapp conversation can’t be taken into consideration, since these are easy to forge.
          </p>
          <br />
          <p>(Baruch Hashem, we have not had any official disputes on the site so far.)</p>
        </div>
      ),
    },
    {
      question: 'Can I stipulate that the client pay half up-front? (Project-Based)',
      answer: (
        <div>
          <p>
            We have a section in the project proposal process called “Special Terms & Conditions,” where freelancers can
            add conditions like that to the project outline if they choose to.
          </p>
          <br />
          <p>
            On ZehMizeh, though, you may not need to. Most of the time, when a freelancer wants to be paid up front,
            they’re looking for a guarantee that the client won’t refuse to pay in the end. As long as freelancer is
            doing a project-based project, that’s not a concern.
          </p>
          <br />
          <p>
            After a freelancer has been hired for a project-based project and <b>before doing any work,</b> the
            freelancer submits what’s called a milestone proposal. This is like a mini-project proposal where the
            freelancer says what work they’ll do and for how much. They can divide a project into as many pieces a they
            like, or they can submit one milestone proposal for the whole budget.
          </p>
          <br />
          <p>
            The key is - when the client accepts the milestone proposal,{' '}
            <b>they are charged the full amount they promised to pay.</b> That amount is held by ZehMizeh, inaccessible
            to the client, held until the project is done. The client cannot “run off” with it so the freelancer has
            nothing to worry about.
          </p>
        </div>
      ),
    },
  ],
};

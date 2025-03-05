"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "../footer/Footer";

const AboutUs = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center pt-12 w-full bg-secondary pb-20 border-b border-primary">
        <div className="w-full md:px-0 px-10 max-w-[750px] flex flex-col gap-12">
          <p className="text-[32px] font-bold">About Us</p>
          <div className="flex items-center justify-center rounded-2xl border border-gray-300">
            <Image
              src={"/about-us.svg"}
              alt={"Hiring process illustration"}
              width={380}
              height={380}
              quality={100}
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[19px] font-bold">The World of Freelancing</p>
            <p className="text-[18px] font-normal">
              When a kid says he wants to be an astronaut, he&apos;s thinking
              about soaring through the stars… not fundraising for rocket fuel
              and managing the spaceship&apos;s social media.
            </p>
            <p className="text-[18px] font-normal">
              We all want to love our work, but even people with dream jobs have
              tasks they don&apos;t want to do. If only we could have some
              specialized staff who want to do those tasks, who are experts in
              those pesky projects that only slow us down.
            </p>
            <p className="text-[18px] font-normal">
              What if we were to tell you that those experts are not only out
              there, but they&apos;re just waiting for you to find them?
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[19px] font-bold">The World of Freelancing</p>
            <p className="text-[18px] font-normal">
              There&apos;s a whole world of professionals who make their own hours,
              who don&apos;t have a set office, who sell their services to different
              clients every month.
            </p>
            <p className="text-[18px] font-normal">
              They&apos;re called “freelancers” and their numbers are growing all the
              time. The modern world allows these incredibly talented workers to
              take their services to whoever wants them, getting paid on a
              project-by-project basis.
            </p>
            <p className="text-[18px] font-normal">
              While this style of work can be very rewarding, there is one
              consistent challenge freelancers face - finding the next client.
              Many freelancers do specialized work, which makes project
              opportunities less common and harder to find.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[19px] font-bold">Enter ZehMizeh</p>
            <p className="text-[18px] font-normal">
              This website is designed to make that connection, between the
              Jewish professional looking for specialists and the Jewish
              specialists looking for their next gig.
            </p>
            <p className="text-[18px] font-normal">
              When you need an expert for your business, you shouldn&apos;t have to
              ask around and hope your cousin&apos;s recommendation is good. Now, you
              can find top-rated experts from around the globe, in all manner of
              industries!
            </p>
            <p className="text-[18px] font-normal">
              And for the Jewish freelancers out there - you shouldn&apos;t have to
              exhaust yourself looking for clients. You know there are amazing
              opportunities out there, if only you could find them. How much
              could your business grow if those projects were delivered right to
              your laptop? How would your career change if you could just focus,
              not on promoting yourself, but on doing what you&apos;re great at?
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[19px] font-bold">So are you ready?</p>
            <p className="text-[18px] font-normal">
              You could get your projects done the old way: ask the receptionist
              who did a single WordPress class to build your website, or ask the
              rabbi&apos;s son who likes writing if he can do your ad copy.
            </p>
            <p className="text-[18px] font-normal">
              But you shouldn&apos;t have to settle when there are professionals
              waiting for you, professionals who love to do the projects you
              need to get done.
            </p>
            <p className="text-[19px] font-normal">
              Join our growing community.{" "}
              <span
                onClick={() => router.push("/register/employer")}
                className="cursor-pointer text-customYellow "
              >
                Register as a client or freelancer - today!
              </span>
            </p>
          </div>

          <div className="flex flex-col">
            <p className="text-[19px] font-bold">Our Address:</p>

            <p className="text-[20px] font-normal">600 NY-208 </p>
            <p className="text-[20px] font-normal">Monroe NY 10950 USA</p>
          </div>

          <div className="flex flex-col">
            <p className="text-[19px] font-bold">Email:</p>

            <p className="text-[20px] font-normal">info@zehmizeh.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;

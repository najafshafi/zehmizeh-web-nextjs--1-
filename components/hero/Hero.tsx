"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";

const VideoSection: React.FC = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsOverlayVisible(false);
    }
  };

  return (
    <div
      className="w-full flex flex-col justify-center bg-[#FEFBF4]  lg:min-h-[90vh] pt-12 md:pt-20 xl:pt-0 lg:my-0 "
    >
      {/* Container that reflows from column (mobile) to row (desktop) */}
      <div className="px-8 md:px-0  flex flex-col xl:flex-row justify-center items-center md:my-20 ">

        <div className="relative w-full max-w-[636px] aspect-[16/9]  ">

          <div
            className="relative rounded-lg w-full h-full"
          >

            <svg
              width="248"
              height="87"
              viewBox="0 0 248 87"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -top-[40px] sm:-top-[60px] md:-top-[85px] left-2 sm:left-4 z-0
                         scale-75 sm:scale-100"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 86.018H247.917C250.762 -29.8893 54.506 -22.5021 6.53894 71.346C4.01721 76.2798 1.84454 81.1717 0 86.018Z"
                fill="#1D1E1B"
              />
            </svg>

            {/* Yellow SVG (bottom-right) */}
            <svg
              width="299"
              height="254"
              viewBox="0 0 299 254"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -bottom-[50px] sm:-bottom-[75px] md:-bottom-[100px]
                         right-2 sm:right-6 z-0 scale-75 sm:scale-100 "
            >
              <path
                d="M218.343 246.462C123.984 281.821 63.889 180.57 0 77.886C7.886 59.332 48.002 11.526 145.209 0C327.228 1.479 340.144 200.819 218.343 246.462Z"
                fill="#F2B420"
              />
            </svg>

            {/* Actual video */}
            <video
              ref={videoRef}
              controls
              className="relative z-10 w-full h-full object-cover
                         rounded-lg transition-all duration-300 border-4 border-[#f6f6f5]"
            >
              <source
                src="https://zehmizeh-app-data.s3.amazonaws.com/files/site+pitch_1.mp4"
                type="video/mp4"
              />
            </video>

            {/* White overlay with logo + play icon */}
            {isOverlayVisible && (
               <div
               className="absolute inset-0 bg-white z-20 
                     flex flex-col items-center justify-center border-[10px] sm:border-[15px] md:border-[20px]
                       border-gray-200/75 rounded-lg"
             >
               {/* Decorative SVG + Play Icon together */}
               <div className="relative">
                 {/* Decorative SVG behind the play icon */}
                 <svg
                   width="48"
                   height="48"
                   viewBox="0 0 48 48"
                   fill="none"
                   xmlns="http://www.w3.org/2000/svg"
                   className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32"
                 >
                   <g clipPath="url(#clip0_3161_8223)">
                     <path
                       d="M44.8968 39.52H37.0668C36.9668 39.52 36.8868 39.44 36.8868 39.34V34.3834C36.8868 34.15 36.6968 33.9634 36.4668 33.9634H34.3868C34.1535 33.9634 33.9668 34.1534 33.9668 34.3834V47.5767C33.9668 47.81 34.1568 47.9967 34.3868 47.9967H36.4668C36.7001 47.9967 36.8868 47.8067 36.8868 47.5767V42.62C36.8868 42.52 36.9668 42.44 37.0668 42.44H44.8968C44.9968 42.44 45.0768 42.52 45.0768 42.62V47.5767C45.0768 47.81 45.2668 47.9967 45.4968 47.9967H47.5768C47.8101 47.9967 47.9968 47.8067 47.9968 47.5767V34.3834C47.9968 34.15 47.8068 33.9634 47.5768 33.9634H45.4968C45.2635 33.9634 45.0768 34.1534 45.0768 34.3834V39.34C45.0768 39.44 44.9968 39.52 44.8968 39.52Z"
                       fill="#1D1E1B"
                     />
                     <path
                       d="M20.0834 36.89H30.5834C30.8167 36.89 31.0034 36.7 31.0034 36.47V34.39C31.0034 34.1566 30.8134 33.97 30.5834 33.97H17.4034C17.1701 33.97 16.9834 34.16 16.9834 34.39V47.5833C16.9834 47.8166 17.1734 48.0033 17.4034 48.0033H30.5801C30.8134 48.0033 31.0001 47.8133 31.0001 47.5833V45.5033C31.0001 45.27 30.8101 45.0833 30.5801 45.0833H20.0801C19.9801 45.0833 19.9001 45.0033 19.9001 44.9033V42.63C19.9001 42.53 19.9801 42.45 20.0801 42.45H30.5934C30.8267 42.45 31.0134 42.26 31.0134 42.03V39.95C31.0134 39.7166 30.8234 39.53 30.5934 39.53H20.0801C19.9801 39.53 19.9001 39.45 19.9001 39.35V37.0766C19.9001 36.9766 19.9801 36.8966 20.0801 36.8966L20.0834 36.89Z"
                       fill="#1D1E1B"
                     />
                     <path
                       d="M45.0768 0.42V5.37667C45.0768 5.47667 44.9968 5.55667 44.8968 5.55667H37.0668C36.9668 5.55667 36.8868 5.47667 36.8868 5.37667V0.42C36.8868 0.186667 36.6968 0 36.4668 0H34.3868C34.1535 0 33.9668 0.19 33.9668 0.42V13.6133C33.9668 13.8467 34.1568 14.0333 34.3868 14.0333H36.4668C36.7001 14.0333 36.8868 13.8433 36.8868 13.6133V8.65667C36.8868 8.55667 36.9668 8.47667 37.0668 8.47667H44.8968C44.9968 8.47667 45.0768 8.55667 45.0768 8.65667V13.6133C45.0768 13.8467 45.2668 14.0333 45.4968 14.0333H47.5768C47.8101 14.0333 47.9968 13.8433 47.9968 13.6133V0.42C47.9968 0.186667 47.8068 0 47.5768 0H45.4968C45.2635 0 45.0768 0.19 45.0768 0.42Z"
                       fill="#1D1E1B"
                     />
                     <path
                       d="M42.6029 19.9066H47.5462C47.7796 19.9066 47.9662 19.7166 47.9662 19.4866V17.4066C47.9662 17.1732 47.7762 16.9866 47.5462 16.9866H34.3829C34.1496 16.9866 33.9629 17.1766 33.9629 17.4066V19.4866C33.9629 19.7199 34.1529 19.9066 34.3829 19.9066H39.3262C39.4262 19.9066 39.5062 19.9866 39.5062 20.0866V27.9166C39.5062 28.0166 39.4262 28.0966 39.3262 28.0966H34.4129C34.1796 28.0966 33.9929 28.2866 33.9929 28.5166V30.5966C33.9929 30.8299 34.1829 31.0166 34.4129 31.0166H47.5762C47.8096 31.0166 47.9962 30.8266 47.9962 30.5966V28.5166C47.9962 28.2832 47.8062 28.0966 47.5762 28.0966H42.6029C42.5029 28.0966 42.4229 28.0166 42.4229 27.9166V20.0866C42.4229 19.9866 42.5029 19.9066 42.6029 19.9066Z"
                       fill="#1D1E1B"
                     />
                     <path
                       d="M17.4034 16.9834C17.1701 16.9834 16.9834 17.1734 16.9834 17.4034V30.5967C16.9834 30.8301 17.1734 31.0167 17.4034 31.0167H19.4834C19.7167 31.0167 19.9034 30.8267 19.9034 30.5967V20.0867C19.9034 19.9867 19.9834 19.9067 20.0834 19.9067H22.3567C22.4567 19.9067 22.5367 19.9867 22.5367 20.0867V30.5967C22.5367 30.8301 22.7267 31.0167 22.9567 31.0167H25.0367C25.2701 31.0167 25.4567 30.8267 25.4567 30.5967V20.0867C25.4567 19.9867 25.5367 19.9067 25.6367 19.9067H27.9101C28.0101 19.9067 28.0901 19.9867 28.0901 20.0867V30.5967C28.0901 30.8301 28.2801 31.0167 28.5101 31.0167H30.5901C30.8234 31.0167 31.0101 30.8267 31.0101 30.5967V17.4034C31.0101 17.1701 30.8201 16.9834 30.5901 16.9834H17.4034Z"
                       fill="#1D1E1B"
                     />
                     <path
                       d="M20.0834 2.92333H30.5834C30.8167 2.92333 31.0034 2.73333 31.0034 2.50333V0.42C31.0034 0.186667 30.8134 0 30.5834 0H17.4034C17.1701 0 16.9834 0.19 16.9834 0.42V13.6133C16.9834 13.8467 17.1734 14.0333 17.4034 14.0333H30.5801C30.8134 14.0333 31.0001 13.8433 31.0001 13.6133V11.5333C31.0001 11.3 30.8101 11.1133 30.5801 11.1133H20.0801C19.9801 11.1133 19.9001 11.0333 19.9001 10.9333V8.66C19.9001 8.56 19.9801 8.48 20.0801 8.48H30.5934C30.8267 8.48 31.0134 8.29 31.0134 8.06V5.98C31.0134 5.74667 30.8234 5.56 30.5934 5.56H20.0801C19.9801 5.56 19.9001 5.48 19.9001 5.38V3.10667C19.9001 3.00667 19.9801 2.92667 20.0801 2.92667L20.0834 2.92333Z"
                       fill="#1D1E1B"
                     />
                     <path
                       d="M13.6133 0H0.42C0.19 0 0 0.19 0 0.42V2.50333C0 2.73333 0.19 2.92333 0.42 2.92333H9.06C9.22667 2.92333 9.30333 3.13 9.17667 3.24L0.146667 10.9867C0.0533333 11.0667 0 11.1833 0 11.3067V13.6167C0 13.8467 0.19 14.0367 0.42 14.0367H13.6133C13.8467 14.0367 14.0333 13.8467 14.0333 13.6167V11.5367C14.0333 11.3033 13.8433 11.1167 13.6133 11.1167H4.97333C4.80667 11.1167 4.73 10.91 4.85667 10.8L13.8867 3.05C13.98 2.97 14.0333 2.85333 14.0333 2.73V0.42C14.0333 0.186667 13.8433 0 13.6133 0Z"
                       fill="#1D1E1B"
                     />
                     <path
                       d="M13.6133 33.9634H0.42C0.19 33.9634 0 34.1534 0 34.3867V36.4667C0 36.7 0.19 36.89 0.42 36.89H9.06C9.22667 36.89 9.30333 37.0967 9.17667 37.2067L0.146667 44.95C0.0533333 45.03 0 45.1467 0 45.27V47.58C0 47.81 0.19 48 0.42 48H13.6133C13.8467 48 14.0333 47.81 14.0333 47.58V45.5C14.0333 45.2667 13.8433 45.08 13.6133 45.08H4.97333C4.80667 45.08 4.73 44.8734 4.85667 44.7634L13.8867 37.0167C13.98 36.9367 14.0333 36.82 14.0333 36.6967V34.3867C14.0333 34.1534 13.8433 33.9667 13.6133 33.9667V33.9634Z"
                       fill="#1D1E1B"
                     />
                     <path
                       d="M7.01667 31.0167C10.8919 31.0167 14.0333 27.8753 14.0333 24.0001C14.0333 20.1249 10.8919 16.9834 7.01667 16.9834C3.14147 16.9834 0 20.1249 0 24.0001C0 27.8753 3.14147 31.0167 7.01667 31.0167Z"
                       fill="#F2B420"
                     />
                   </g>
                   <defs>
                     <clipPath id="clip0_3161_8223">
                       <rect width="48" height="48" fill="white" />
                     </clipPath>
                   </defs>
                 </svg>
  
                 {/* Play icon on top (clickable) */}
                 <Image
                   onClick={handlePlay}
                   src="/home-play-icon.svg"
                   alt="Play Icon"
                   width={60}
                   height={60}
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      cursor-pointer hover:scale-125 transition-transform 
                      duration-500 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px]"
                 />
               </div>
             </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-[550px] xl:ml-12 my-20  flex flex-col justify-center lg:mt-20 md:my-20 ">
         <div>
         <h2 className="text-center xl:text-left text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 font-medium md:mt-20 lg:mt-20 xl:mt-0">
            Introducing
          </h2>
          <h3 className="text-5xl xl:leading-[88.8px] text-center xl:text-left sm:text-4xl md:text-7xl lg:text-7xl xl:text-7xl font-semibold mt-2 sm:mt-3 md:mt-4">
            <span className="text-gray-900">Your</span>{" "}
            <i className="text-yellow-500">Jewish</i>
            <span className="text-gray-900"> Outsourcing Platform</span>
          </h3>
          <p className="text-center xl:text-left py-3 px-10 md:px-0 lg:px-0 xl:px-0 text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl  text-gray-900 xl:leading-[51px]">
            Where every project finds its perfect match
          </p>
         </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;

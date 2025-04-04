export const isPDF = (url: string) => url?.split(".").pop() === "pdf";
export const isVideo = (url: string) => url?.split(".").pop() === "mp4";
export const isAudio = (url: string) =>
  ["mp3", "wav"].includes(url?.split(".").pop() || "");

export const coverImgHandler = (file: string) => {
  if (isPDF(file)) file = "/images/pdf-file.svg";
  if (isVideo(file)) file = "/images/video.png";
  if (isAudio(file)) file = "/images/audio.png";
  return file;
};

export const getVideoDuration = (url: string) =>
  new Promise<number>((resolve, reject) => {
    const video = document.createElement("video");
    video.src = url;
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const duration = video.duration;
      video.remove()
      resolve(duration)
    };

    video.onerror = () => {
      reject("Ошибка загрузки видео");
    };
  });
import React from "react";

const LessonVideo = ({ video }) => {
   return (
       <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <video
              controls
              src={video.url} // Firebase video URL'si burada kullanılıyor
              style={{
                 position: "absolute",
                 top: 0,
                 left: 0,
                 width: "100%",
                 height: "100%",
              }}
          />
          <p style={{ marginTop: "10px", textAlign: "center" }}>
             {video.title} - Süre: {Math.floor(video.duration / 60)}:
             {(video.duration % 60).toString().padStart(2, "0")}
          </p>
       </div>
   );
};

export default LessonVideo;

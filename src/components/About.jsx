import React from "react";
function About() {
  const style = window.matchMedia("(min-width: 901px)").matches
    ? { gridColumn: "span 3" }
    : { gridColumn: "span 2" };

  return (
    <div id="about">
      <div id="about-head" style={style}>
        <h1>Insta Chat</h1>
      </div>
      <div style={style}>
        <h2>About Developer</h2>
        <p>
          <strong>Name : Sanjay Majhi</strong>{" "}
        </p>
        <p>
          I am a Full Stack MERN Developer and a pround Indian. This Website is
          one of my project.
        </p>
        <p>
          For github profile :{" "}
          <a href="https://github.com/sanjaymajhi">GitHub - sanjaymajhi</a>
          <br />
          For LinkedIn profile :{" "}
          <a href="https://www.linkedin.com/in/sanjay-majhi-898938188/">
            LinkedIn - sanjaymajhi
          </a>
        </p>
      </div>
      <div style={style}>
        <h2>About the project</h2>
        <p>This project is a Full Stack Social Media Website.</p>
        <p>
          In this website, one can make his/her profile and follow other
          peoples, create posts, like, share, comment, like comments and reply
          to them.
          <br />
          See trending posts, videos, search peoples, upload photos, videos,
          chat with friends, see notifications and so on.
        </p>
        <p>
          Note : This website is not official website of any
          company/organistaion. This is just a practice project.
        </p>
      </div>

      <div>
        <h3>Front end </h3>
        <ul>
          <li>HTML</li>
          <li>CSS with SCSS and Bootstrap</li>
          <li>Reactjs + Hooks</li>
        </ul>
      </div>
      <div>
        <h3>Back end </h3>
        <ul>
          <li>Nodejs runtime engine</li>
          <li>Expressjs framework</li>
        </ul>
      </div>
      <div>
        <h3>DBMS used </h3>
        <ul>
          <li>MongoDB Atlas</li>
          <li>Mongoose ODM</li>
        </ul>
      </div>
      <div>
        <h3>Chats</h3>
        <ul>
          <li>Socket.io for realtime chatting</li>
          <li>Multer for uploading</li>
          <li>Cloudinary for storage</li>
        </ul>
      </div>
      <div>
        <h3>Authentication </h3>
        <ul>
          <li>JWT based token authentication</li>
          <li>Passwords Encypted using bcryptjs</li>
        </ul>
      </div>
      <div>
        <h3>APIs</h3>
        <ul>
          <li>Google Login</li>
          <li>FB Login</li>
          <li>Giphy API</li>
        </ul>
      </div>
    </div>
  );
}

export default About;

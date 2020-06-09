export function likeSharePost(e, type, origin = "posts") {
  e.preventDefault();
  const target = e.target;
  const myheaders = new Headers();
  myheaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  myheaders.append("content-type", "application/json");
  const url = "/users/posts/" + type;
  fetch(url, {
    method: "post",
    body: JSON.stringify({
      postId: e.target.id, //commment id for comments and post id for posts
    }),
    headers: myheaders,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.saved === "success") {
        //no of likes or shares before clicking
        if (origin === "posts") {
          let number = Number(target.nextSibling.nextSibling.textContent);
          target.nextSibling.nextSibling.textContent =
            target.style.color === "skyblue" ? number - 1 : number + 1;
        }
        target.style.color =
          target.style.color === "skyblue" ? "lightgray" : "skyblue";
      }
    });
}

export function errorDisplay(data, elem) {
  const alert = document.getElementById(elem);
  alert.style.display = "block";
  if (data.error) {
    alert.innerHTML += data.error.msg;
  }
  if (data.errors) {
    let count = 1;
    data.errors.map((err) => {
      alert.innerHTML += "<p>" + count + ". " + err.msg + "<br/></p>";
      count++;
    });
  }
  setTimeout(function () {
    alert.style.display = "none";
  }, 10000);
}

export const switchInJsx = (data) => {
  switch (data) {
    case "share":
      return "shared your post.";
    case "like":
      return "liked your post.";
    case "comment":
      return "commented on your post.";
    case "likeComment":
      return "liked your comment.";
    case "replyComment":
      return "replied to your comment.";
    case "likeReply":
      return "liked your reply to a comment.";
    default:
      return "started following you.";
  }
};

export function get_notifications(skip, setNotifics, total, history) {
  const myheaders = new Headers();
  myheaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  fetch("/users/notifications/" + skip, {
    method: "GET",
    headers: myheaders,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.saved === "success") {
        if (total !== undefined && data.notifics.length > 0) {
          document.title = `(${data.notifics.length}) new notifications `;
          data.notifics.map((notific) => {
            const alert = document.getElementById("notific-alert");
            alert.onclick =
              notific.type !== "follow"
                ? () => history.push("/user/post/" + notific.postId)
                : () =>
                    history.push(
                      "/user/profile/" +
                        notific.userWhoPushed.username.split("@")[1]
                    );

            const alertBody = alert.childNodes[0];
            alertBody.innerHTML =
              notific.userWhoPushed.f_name +
              " " +
              notific.userWhoPushed.l_name +
              " " +
              switchInJsx(notific.type) +
              ". <br/>" +
              "Click Here To See...";
            alert.style.display = "block";
            setTimeout(() => {
              alert.className = "fade toast";
            }, 5000);
          });
        }
        data.notifics.sort(
          (a, b) => new Date(b.datetime) - new Date(a.datetime)
        );
        setNotifics(data.notifics);
      }
    });
}

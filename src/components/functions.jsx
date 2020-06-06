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
            target.style.color === "blue" ? number - 1 : number + 1;
        }
        target.style.color = target.style.color === "blue" ? "gray" : "blue";
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

export function get_notifications(skip, setNotifics) {
  const myheaders = new Headers();
  myheaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  fetch("/users/notifications/" + skip, {
    method: "GET",
    headers: myheaders,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.saved === "success") {
        data.notifics.sort(
          (a, b) => new Date(b.datetime) - new Date(a.datetime)
        );
        setNotifics(data.notifics);
      }
    });
}

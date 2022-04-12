var span = document.getElementsByClassName("close")[0];

var modal = document.getElementById("myModal");

async function createClassTable() {
  const tbody = document.getElementById("table-body");
  while (tbody.firstChild) {
    tbody.removeChild(tbody.lastChild);
  }
  const response = await fetch("/dashboard/getClasses");

  const json = await response.json();
  const classes = json.classes;
  let i = 1;
  classes.forEach((item) => {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-dark");
    btn.innerHTML = "Click Here";
    th.innerHTML = i;
    th.setAttribute("scope", "row");
    const td = document.createElement("td");
    td.innerHTML = item._id;
    const td1 = document.createElement("td");
    td1.innerHTML = item.branch;
    const td2 = document.createElement("td");
    td2.innerHTML = item.sem;
    const td3 = document.createElement("td");
    td3.appendChild(btn);
    const td4 = document.createElement("td");
    const iconDiv = document.createElement("div");
    const span = document.createElement("span");
    const it = document.createElement("i");
    it.classList.add("fa-solid", "fa-trash");
    span.appendChild(it);
    span.setAttribute(
      "style",
      "font-size: 20px; margin-right: 10px; cursor: pointer;"
    );
    span.setAttribute("id", "btn-" + i.toString());
    iconDiv.append(span);
    iconDiv.setAttribute("style", "margin-top: 8px;");
    td4.append(iconDiv);
    row.append(th, td, td1, td2, td3, td4);
    tbody.appendChild(row);
    const delBtn = document.getElementById("btn-" + i.toString());
    delBtn.addEventListener("click", async (e) => {
      const data =
        delBtn.parentElement.parentElement.parentElement.getElementsByTagName(
          "td"
        )[0];
      const id = data.innerHTML;
      console.log(id);
      const response = await fetch(`/dashboard/classes/?cid=${id}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (json.message == "deleted") location.reload();
    });
    i++;
    const ol = document.createElement("ol");
    ol.classList.add("list-group", "list-group-flush");
    item.subjects.forEach((subject) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.innerHTML = subject;
      ol.appendChild(listItem);
    });
    btn.onclick = function () {
      const modalBody = document.getElementById("subjects");
      while (modalBody.firstChild) {
        modalBody.removeChild(modalBody.lastChild);
      }
      modalBody.appendChild(ol);
      modal.style.display = "block";
    };
  });
  $(document).ready(function () {
    $('#class-table').DataTable();
  });
  if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
  }
}

span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

createClassTable();

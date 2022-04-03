var span = document.getElementsByClassName("close")[0];

var modal = document.getElementById("myModal");

async function createClassTable() {
  const tbody = document.getElementById("table-body");

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
    btn.setAttribute("id", "btn-" + i.toString());
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
    const span1 = document.createElement("span");
    const it = document.createElement("i");
    it.classList.add("fa-solid","fa-trash");
    span.appendChild(it);
    span.setAttribute("style","font-size: 20px; margin-right: 10px; cursor: pointer;")
    const it1 = document.createElement("i");
    it1.classList.add("fa-solid","fa-pen-to-square");
    span1.setAttribute("style","font-size: 20px; cursor: pointer;")
    span1.appendChild(it1);
    iconDiv.append(span,span1);
    iconDiv.setAttribute("style","margin-top: 8px;")
    td4.append(iconDiv);
    row.append(th, td, td1, td2, td3,td4);
    tbody.appendChild(row);
    i++;
    const ol = document.createElement("ol");
    ol.classList.add("list-group","list-group-flush");
    item.subjects.forEach(subject => {
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

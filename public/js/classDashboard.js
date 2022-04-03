var span = document.getElementsByClassName("close")[0];

var modal = document.getElementById("myModal");

async function createClassTable() {
  const tbody = document.getElementById("table-body");

  const response = await fetch("/dashboard/getClasses");

  const json = await response.json();
  const classes = json.classes;
  console.log(classes);
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
    row.append(th, td, td1, td2, td3);
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
